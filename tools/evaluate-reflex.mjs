/**
 * Runs the reflex measurement over a folder of photographs with known
 * diagnoses, and reports how it did.
 *
 * Same arithmetic as the phone: each image is reduced to a 96x96 JPEG and
 * handed to src/reflex.ts, so what this measures is what the app measures.
 *
 *   node tools/evaluate-reflex.mjs
 *
 * Put images in photos/ and describe them in photos/labels.csv:
 *
 *   file,truth
 *   eye-001.jpg,normal
 *   eye-002.jpg,leukocoria
 *
 * Crop each image to a single eye, roughly centred on the pupil, before
 * dropping it in. The app measures the middle of its frame because the health
 * worker fills the alignment ring; an uncropped face measures a cheek.
 *
 * What it cannot tell you: this scores the absolute paleness of one reflex.
 * The stronger signal — the difference between a patient's two eyes — needs
 * both eyes of the same person, so it can only be judged on pairs.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { decode as decodeJpeg } from 'jpeg-js';

const require = createRequire(import.meta.url);

const PHOTOS = 'photos';
const LABELS = join(PHOTOS, 'labels.csv');
const SIDE = 96;

/** Anything that is not "normal" is a case the tool must not miss. */
const isAbnormal = (truth) => truth.trim().toLowerCase() !== 'normal';

function readLabels() {
  if (!existsSync(LABELS)) return null;
  return readFileSync(LABELS, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !/^file\s*,/i.test(l))
    .map((l) => {
      const [file, truth] = l.split(',');
      return { file: file?.trim(), truth: (truth ?? '').trim() };
    })
    .filter((r) => r.file && r.truth);
}

/** Mirrors what expo-image-manipulator does on the phone. */
function measure(path, work) {
  const out = join(work, 'small.jpg');
  execFileSync('convert', [path, '-resize', `${SIDE}x${SIDE}!`, '-quality', '100', out]);
  const decoded = decodeJpeg(readFileSync(out), { useTArray: true });
  return measureReflex(decoded.data, decoded.width, decoded.height);
}

const labels = readLabels();
if (!labels?.length) {
  console.log(`\nNothing to measure yet.\n`);
  console.log(`  1. Crop each photograph to one eye and put it in ${PHOTOS}/`);
  console.log(`  2. List them in ${LABELS}:\n`);
  console.log('       file,truth');
  console.log('       eye-001.jpg,normal');
  console.log('       eye-002.jpg,leukocoria\n');
  const found = existsSync(PHOTOS)
    ? readdirSync(PHOTOS).filter((f) => /\.(jpe?g|png)$/i.test(f))
    : [];
  if (found.length) console.log(`  ${found.length} image(s) already in ${PHOTOS}/: ${found.join(', ')}\n`);
  process.exit(0);
}

const work = mkdtempSync(join(tmpdir(), 'reba-eval-'));

// Compiled here rather than duplicated, so the tool can never drift from the
// thresholds the app actually uses.
execFileSync('npx', [
  'tsc', 'src/reflex.ts', '--outDir', work,
  '--module', 'commonjs', '--target', 'es2020', '--skipLibCheck',
]);
const { measureReflex, PALE_AT, NOT_AN_EYE_BELOW } = require(join(work, 'reflex.js'));

const verdict = (m) =>
  m.tooDark || m.redness < NOT_AN_EYE_BELOW ? 'unreadable'
  : m.redness < PALE_AT ? 'pale'
  : 'red';

const rows = [];

for (const { file, truth } of labels) {
  const path = join(PHOTOS, file);
  if (!existsSync(path)) {
    console.log(`  !! missing: ${file}`);
    continue;
  }
  const m = measure(path, work);
  rows.push({ file, truth, redness: m.redness, brightness: m.brightness, verdict: verdict(m) });
}

console.log('\n  file                       truth          redness  verdict');
console.log('  ' + '-'.repeat(62));
for (const r of rows) {
  console.log(
    `  ${r.file.padEnd(26)} ${r.truth.padEnd(14)} ${r.redness.toFixed(3).padStart(7)}  ${r.verdict}`,
  );
}

const abnormal = rows.filter((r) => isAbnormal(r.truth));
const normal = rows.filter((r) => !isAbnormal(r.truth));
const missed = abnormal.filter((r) => r.verdict === 'red');
const falseFlags = normal.filter((r) => r.verdict === 'pale');
const unreadable = rows.filter((r) => r.verdict === 'unreadable');

console.log('\n  === WHAT IT DID ===');
console.log(`  abnormal cases        ${abnormal.length}`);
console.log(`    flagged pale        ${abnormal.filter((r) => r.verdict === 'pale').length}`);
console.log(`    MISSED              ${missed.length}   <- the number that matters`);
if (missed.length) console.log(`      ${missed.map((r) => r.file).join(', ')}`);
console.log(`  normal eyes           ${normal.length}`);
console.log(`    flagged wrongly     ${falseFlags.length}`);
if (falseFlags.length) console.log(`      ${falseFlags.map((r) => r.file).join(', ')}`);
console.log(`  unreadable frames     ${unreadable.length}`);

if (abnormal.length) {
  const sens = ((abnormal.length - missed.length) / abnormal.length) * 100;
  console.log(`\n  caught ${sens.toFixed(0)}% of abnormal cases (${abnormal.length} of them)`);
}
console.log(`\n  thresholds: pale below ${PALE_AT}, not-an-eye below ${NOT_AN_EYE_BELOW}`);
console.log('\n  A few dozen images is a first look, not a validation. Real numbers');
console.log('  need hundreds of cases and a protocol.\n');
