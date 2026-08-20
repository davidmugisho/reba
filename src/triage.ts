import { LEVELS } from './acuity';
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
