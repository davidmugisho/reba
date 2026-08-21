import * as ImageManipulator from 'expo-image-manipulator';
import { decode as decodeJpeg } from 'jpeg-js';
import { compareReflexes, measureReflex, type ReflexComparison } from './reflex';
import type { EyeCapture } from './types/screening';

/**
 * Reads the red reflex out of the two photographs just taken.
 *
 * The pure arithmetic lives in src/reflex.ts. This file is the plumbing: get
 * the picture down to a handful of pixels, decode it, hand it over.
 *
 * The frame is shrunk to 96x96 before anything else. Averaging a colour does
 * not need megapixels, and decoding a full photograph in JavaScript on a cheap
 * phone would stall the screen for seconds.
 *
 * It assumes the health worker filled the alignment ring with the eye, because
 * the sampled disc is the middle of the frame. A photograph taken from too far
 * away puts iris and skin into the average and dilutes the signal — which is
 * one of the things that will need tuning once there are real photographs to
 * tune against.
 */

const SAMPLE_SIDE = 96;

/** No atob in React Native, and no Buffer either. Fifteen lines beats a dependency. */
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64ToBytes(base64: string): Uint8Array {
  const clean = base64.replace(/[^A-Za-z0-9+/]/g, '');
  const bytes = new Uint8Array((clean.length * 3) >> 2);
  let out = 0;
  let buffer = 0;
  let bits = 0;

  for (let i = 0; i < clean.length; i++) {
    buffer = (buffer << 6) | B64.indexOf(clean[i]);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes[out++] = (buffer >> bits) & 0xff;
    }
  }
  return bytes.subarray(0, out);
}

async function measureOne(uri: string) {
  const small = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: SAMPLE_SIDE, height: SAMPLE_SIDE } }],
    // JPEG on purpose: it is what the decoder below understands, whatever the
    // camera produced.
    { base64: true, compress: 1, format: ImageManipulator.SaveFormat.JPEG },
  );
  if (!small.base64) throw new Error('the image could not be read back');

  const decoded = decodeJpeg(base64ToBytes(small.base64), { useTArray: true });
  return measureReflex(decoded.data, decoded.width, decoded.height);
}

/**
 * Returns null when the pair cannot be read at all — one photo missing, or the
 * decoding failed. Null means "not looked at", and the record keeps it that
 * way rather than recording a reassuring nothing.
 */
export async function readReflex(captures: EyeCapture[]): Promise<ReflexComparison | null> {
  const right = captures.find((c) => c.eye === 'right');
  const left = captures.find((c) => c.eye === 'left');
  if (!right || !left) return null;

  try {
    const [r, l] = await Promise.all([measureOne(right.uri), measureOne(left.uri)]);
    return compareReflexes(r, l);
  } catch (cause) {
    console.warn('[reba] could not read the eye photographs', cause);
    return null;
  }
}
