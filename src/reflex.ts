/**
 * Reading the red reflex out of an eye photograph — arithmetic on pixels,
 * with no model in it.
 *
 * When the flash reaches the retina it comes back red, because the retina is
 * full of blood vessels. That is the "red eye" of family photographs, and it
 * is a sign of health. A reflex that comes back white means the light bounced
 * off something in front of the retina — a cataract, a detachment, or a
 * retinoblastoma. A reflex that is clearly duller on one side than the other
 * says that eye is different from its neighbour.
 *
 * None of that needs machine learning. It needs the average colour inside the
 * pupil, and a comparison.
 *
 * What this is not: it is not the model. It cannot see a squint, it cannot
 * name a disease, and it will miss things a trained model would catch. It is
 * a measurement, like the acuity — and it is held to the same rule, which is
 * that it may add a referral and may never withdraw one.
 */

/**
 * The reflex is sampled from a ring, not a disc.
 *
 * Dead centre of the pupil is the flash bouncing off the cornea — a specular
 * highlight, white in every eye whatever its health. Averaging it in drags a
 * healthy red reflex towards white and hides the very thing being looked for.
 * Reaching too far out picks up iris and lid instead.
 *
 * Measured on a real photograph of a child with leukocoria in one eye, the
 * separation between the two eyes is 0.064 with a plain disc and 0.093 with
 * this ring. The same change widens the gap on synthetic eyes too, so it is
 * the optics rather than a fit to one picture.
 */
const SAMPLE_INNER = 0.1;
const SAMPLE_OUTER = 0.28;

/** Below this mean brightness the frame is too dark to read anything from. */
export const TOO_DARK = 0.06;

/** Neutral redness — a white or grey reflex sits here. */
export const NEUTRAL_REDNESS = 1 / 3;

export interface ReflexMeasure {
  /** Mean channel values inside the sampled disc, 0..255. */
  r: number;
  g: number;
  b: number;
  /**
   * Share of the total signal carried by red, 0..1.
   * A white or grey reflex sits at about 1/3; a healthy red reflex is well above it.
   */
  redness: number;
  /** Mean brightness of the disc, 0..1. */
  brightness: number;
  /** True when the frame is too dark for the numbers above to mean anything. */
  tooDark: boolean;
}

/**
 * Averages a ring around the centre of the frame, where the pupil sits when
 * the health worker has filled the alignment ring with the eye.
 *
 * `pixels` is RGBA, row-major — what a decoded JPEG gives.
 */
export function measureReflex(pixels: Uint8Array, width: number, height: number): ReflexMeasure {
  const cx = width / 2;
  const cy = height / 2;
  const shorter = Math.min(width, height);
  const outer2 = (shorter * SAMPLE_OUTER) ** 2;
  const inner2 = (shorter * SAMPLE_INNER) ** 2;

  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;

  for (let y = 0; y < height; y++) {
    const dy = y - cy;
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const d2 = dx * dx + dy * dy;
      if (d2 > outer2 || d2 < inner2) continue;
      const i = (y * width + x) * 4;
      r += pixels[i];
      g += pixels[i + 1];
      b += pixels[i + 2];
      n++;
    }
  }

  // A frame too small for the ring to land on anything is not a measurement.
  if (n === 0) {
    return { r: 0, g: 0, b: 0, redness: 0, brightness: 0, tooDark: true };
  }

  r /= n;
  g /= n;
  b /= n;

  const total = r + g + b;
  const brightness = total / (3 * 255);

  return {
    r,
    g,
    b,
    // Guard the divide: a black disc has no colour to be dominated by.
    redness: total > 0 ? r / total : 0,
    brightness,
    tooDark: brightness < TOO_DARK,
  };
}

export type ReflexFinding =
  /** Both reflexes red and alike. Not a clean bill of health. */
  | 'symmetric'
  /** One reflex clearly less red than the other. */
  | 'asymmetric'
  /** A reflex close to white rather than red. */
  | 'palePupil'
  /** At least one photo is too dark to read. */
  | 'unreadable';

export interface ReflexComparison {
  right: ReflexMeasure;
  left: ReflexMeasure;
  /** Difference in redness between the eyes. */
  rednessGap: number;
  finding: ReflexFinding;
}

/**
 * A reflex this close to neutral is pale enough to flag on its own.
 * Deliberately generous: this may add a referral, never remove one.
 */
export const PALE_AT = 0.42;

/**
 * Below this, the frame is not an eye.
 *
 * Whatever is wrong with a pupil, its reflex does not come back green or blue.
 * A white reflex — the thing worth flagging — sits near a third, because white
 * splits evenly across the channels. A reading far under that means the
 * camera was pointed at something else, or missed the eye entirely.
 *
 * Without this floor a badly aimed photograph produces a referral instead of
 * an admission that nothing was read, which is the wrong way round: it puts a
 * family on the road to a clinic because the phone was held crooked.
 */
export const NOT_AN_EYE_BELOW = 0.2;

/**
 * Difference in redness between the eyes that counts.
 *
 * This is the sturdier of the two signals, because the patient is their own
 * control: both photos come from the same phone, the same flash, seconds
 * apart, so skin tone, ambient light and lens all cancel out.
 */
export const GAP_AT = 0.08;

export function compareReflexes(right: ReflexMeasure, left: ReflexMeasure): ReflexComparison {
  const rednessGap = Math.abs(right.redness - left.redness);

  // Say so rather than measure noise.
  if (right.tooDark || left.tooDark) {
    return { right, left, rednessGap, finding: 'unreadable' };
  }

  // Not a pale pupil — not a pupil at all.
  if (right.redness < NOT_AN_EYE_BELOW || left.redness < NOT_AN_EYE_BELOW) {
    return { right, left, rednessGap, finding: 'unreadable' };
  }

  // A pale reflex is the more serious of the two, so it is tested first.
  if (right.redness < PALE_AT || left.redness < PALE_AT) {
    return { right, left, rednessGap, finding: 'palePupil' };
  }

  if (rednessGap >= GAP_AT) {
    return { right, left, rednessGap, finding: 'asymmetric' };
  }

  return { right, left, rednessGap, finding: 'symmetric' };
}
