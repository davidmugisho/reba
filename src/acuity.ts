/**
 * Tumbling E acuity test — the measurement, with no UI in it.
 *
 * The patient points which way the legs of the E face, so the test works for
 * children and for adults who do not read. The examiner taps what the patient
 * pointed; the patient never touches the phone.
 *
 * Kept separate from the screen because this is the part that has to be right:
 * a wrong optotype size or a wrong stop rule produces a number that looks
 * clinical and is not.
 */

/** Denominators of 6/x notation, largest letter first. 6/6 is normal vision. */
export const LEVELS = [60, 36, 24, 18, 12, 9, 6] as const;

/** How far the patient stands. The instructions on screen must agree with this. */
export const TEST_DISTANCE_M = 3;

/** Optotypes shown per line before the line counts as passed. */
export const PER_LINE = 3;

/** Misses on one line that end the test. Two is the usual screening rule. */
export const MISSES_TO_STOP = 2;

/** ISO/IEC 7810 ID-1 — every bank and national ID card is this wide. */
export const CARD_WIDTH_MM = 85.6;

export type Direction = 'up' | 'right' | 'down' | 'left';

export const DIRECTIONS: Direction[] = ['up', 'right', 'down', 'left'];

/** Degrees to rotate an "E" glyph so its legs face a given way. */
export const ROTATION: Record<Direction, string> = {
  up: '-90deg',
  right: '0deg',
  down: '90deg',
  left: '180deg',
};

/**
 * Height of a 6/`denominator` optotype in millimetres at the test distance.
 *
 * A 6/6 optotype subtends 5 arcminutes, which is 8.73 mm at 6 metres. Height
 * scales linearly with both the viewing distance and the 6/x denominator.
 */
export function optotypeHeightMm(denominator: number, distanceM = TEST_DISTANCE_M): number {
  return 8.73 * (distanceM / 6) * (denominator / 6);
}

/** The same height in screen units, once the card step has told us the scale. */
export function optotypeHeightPx(denominator: number, pxPerMm: number): number {
  return optotypeHeightMm(denominator) * pxPerMm;
}

/** A calibration is only as good as the card measurement it came from. */
export function pxPerMmFromCardWidth(widthPx: number): number {
  return widthPx / CARD_WIDTH_MM;
}

export interface EyeTest {
  /** Index into LEVELS of the line being shown. */
  levelIndex: number;
  /** Optotypes answered on this line so far. */
  shown: number;
  /** Misses on this line so far. */
  misses: number;
  /** Smallest line the patient has passed, as a 6/x denominator. */
  lastPassed: number | null;
  done: boolean;
}

export function startEyeTest(): EyeTest {
  return { levelIndex: 0, shown: 0, misses: 0, lastPassed: null, done: false };
}

/**
 * Records one answer and returns the next state.
 *
 * A line ends either by being completed (passed, move to a smaller line) or by
 * collecting MISSES_TO_STOP misses (the test ends, and the result is the last
 * line that was passed).
 */
export function answerOptotype(state: EyeTest, correct: boolean): EyeTest {
  if (state.done) return state;

  const misses = state.misses + (correct ? 0 : 1);
  const shown = state.shown + 1;

  // Enough misses on this line: the patient cannot read it. Stop here.
  if (misses >= MISSES_TO_STOP) {
    return { ...state, shown, misses, done: true };
  }

  // Line not finished yet — show another optotype at the same size.
  if (shown < PER_LINE) {
    return { ...state, shown, misses };
  }

  // Line completed with at most one miss: passed.
  const passed = LEVELS[state.levelIndex];
  const nextIndex = state.levelIndex + 1;

  // Nothing smaller left to show; 6/6 is as good as this chart goes.
  if (nextIndex >= LEVELS.length) {
    return { ...state, shown, misses, lastPassed: passed, done: true };
  }

  return { levelIndex: nextIndex, shown: 0, misses: 0, lastPassed: passed, done: false };
}

export interface EyeResult {
  /** 6/x denominator the patient reached, or null if they read no line at all. */
  denominator: number | null;
  /**
   * True when even the largest line was missed. Distinct from "not measured":
   * it means vision is worse than 6/60, which is itself a finding.
   */
  belowChart: boolean;
}

export function resultOf(state: EyeTest): EyeResult {
  if (state.lastPassed === null) {
    // Failed the top line — worse than the chart can measure, not "unknown".
    return { denominator: null, belowChart: state.done };
  }
  return { denominator: state.lastPassed, belowChart: false };
}

/** The line currently on screen. */
export function currentLevel(state: EyeTest): number {
  return LEVELS[state.levelIndex];
}

/**
 * Both eyes on one line, for the referral slip and the saved record.
 *
 * Takes the formatter rather than building the words itself, so the caller's
 * language decides how "worse than 6/60" reads. Returns `none` only when
 * neither eye was measured at all — an eye that failed the top line is a
 * finding, not a blank.
 */
export function bothEyesLine(
  acuity: {
    left: number | null;
    right: number | null;
    leftBelowChart?: boolean;
    rightBelowChart?: boolean;
  },
  format: (denominator: number | null, belowChart: boolean) => string,
  none: string,
): string {
  const measured =
    acuity.right !== null ||
    acuity.left !== null ||
    acuity.rightBelowChart === true ||
    acuity.leftBelowChart === true;
  if (!measured) return none;

  const r = format(acuity.right, acuity.rightBelowChart ?? false);
  const l = format(acuity.left, acuity.leftBelowChart ?? false);
  return `R ${r} · L ${l}`;
}
