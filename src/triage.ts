import { LEVELS } from './acuity';
import type { ReflexComparison } from './reflex';
import type { AcuityResult, Triage } from './types/screening';

/**
 * Which band a screening lands in, and why.
 *
 * This is an interim rule. Until the on-device model lands, the only real
 * signal Reba collects is the acuity measured at step 3, so that is what the
 * band is built from. It is a partial view — acuity says nothing about a white
 * pupil or a turned eye, which is what the photo check is for — but it is a
 * measurement rather than a guess, and poor acuity is a referral criterion in
 * its own right.
 *
 * Thresholds follow the app's stated bias: a false positive costs one
 * consultation, a false negative can cost an eye. Referring at 6/18 is
 * deliberately earlier than the WHO threshold for moderate impairment.
 */


/** Refer at this denominator or worse. Larger denominator means worse vision. */
const REFER_AT = 18;

/** A single borderline line: worth a recheck, not a referral. */
const MONITOR_AT = 12;

/** Lines of difference between the eyes that warrant a referral on their own. */
const LINES_APART_TO_REFER = 2;

/** Position on the chart, largest letter first. Higher index means better vision. */
const lineIndex = (denominator: number): number => LEVELS.indexOf(denominator as never);

/**
 * Returns null when there is nothing to judge — neither eye was measured.
 *
 * The caller must not turn that into a band. An app that has measured nothing
 * and still produces a result is the failure this whole file exists to avoid.
 */
export function triageFromAcuity(acuity: AcuityResult): Triage | null {
  const belowChart = acuity.rightBelowChart === true || acuity.leftBelowChart === true;

  // Worse than the chart can measure is the strongest thing acuity can say.
  if (belowChart) return { risk: 'refer', reason: 'belowChart', basis: 'acuity' };

  const measured = [acuity.right, acuity.left].filter((d): d is number => d !== null);
  if (measured.length === 0) return null;

  // Larger denominator is worse, so the worst eye is the largest number.
  const worst = Math.max(...measured);
  if (worst >= REFER_AT) return { risk: 'refer', reason: 'poorAcuity', basis: 'acuity' };

  // A gap between the eyes matters even when both are individually acceptable:
  // one eye quietly carrying the other is how amblyopia goes unnoticed.
  if (acuity.right !== null && acuity.left !== null) {
    const gap = Math.abs(lineIndex(acuity.right) - lineIndex(acuity.left));
    if (gap >= LINES_APART_TO_REFER) {
      return { risk: 'refer', reason: 'eyesDiffer', basis: 'acuity' };
    }
  }

  if (worst >= MONITOR_AT) return { risk: 'monitor', reason: 'borderlineAcuity', basis: 'acuity' };

  // Only one eye was testable. That is not enough to say nothing is wrong.
  if (measured.length < 2) return { risk: 'monitor', reason: 'borderlineAcuity', basis: 'acuity' };

  return { risk: 'clear', reason: 'noSignsOnAcuity', basis: 'acuity' };
}

/** Worst-first, so a band can be compared and never quietly softened. */
const SEVERITY: Record<Triage['risk'], number> = { clear: 0, monitor: 1, refer: 2 };

/**
 * The whole screening: the acuity, raised by what the photographs showed.
 *
 * The photo check may only ever move the band up. Its thresholds are set on
 * synthetic images and have never been calibrated against real eyes, so it is
 * allowed to add a referral and never to withdraw one. Until it is validated,
 * a wrong flag costs a consultation; a wrong reassurance could cost an eye.
 *
 * A pale pupil refers on its own — it is the strongest thing a photograph can
 * say, and the difference measured between white and red is wide. A difference
 * between the two reflexes only asks for a recheck: it is the same signal
 * measured more finely, and finer means less certain until the thresholds have
 * met real photographs.
 *
 * Photos too dark to read change nothing. The record says they were unreadable
 * rather than pretending they were clear.
 */
export function triageScreening(
  acuity: AcuityResult,
  reflex: ReflexComparison | null,
): Triage | null {
  const fromAcuity = triageFromAcuity(acuity);

  if (!reflex || reflex.finding === 'unreadable' || reflex.finding === 'symmetric') {
    return fromAcuity;
  }

  const fromReflex: Triage =
    reflex.finding === 'palePupil'
      ? { risk: 'refer', reason: 'palePupil', basis: 'reflex' }
      : { risk: 'monitor', reason: 'reflexDiffers', basis: 'reflex' };

  // Nothing measured at all in the acuity — the photograph stands alone.
  if (!fromAcuity) return fromReflex;

  // Keep whichever is worse. Ties stay with the acuity, which is the
  // measurement that has a protocol behind it.
  return SEVERITY[fromReflex.risk] > SEVERITY[fromAcuity.risk] ? fromReflex : fromAcuity;
}
