/**
 * Checks the reflex measurement.
 *
 *   node tools/test-reflex.mjs
 *
 * Synthetic eyes are built here and round-tripped through real JPEG encoding,
 * so the numbers include the compression the phone's photographs carry.
 *
 * If photos/ holds the pair from photos/labels.csv it measures those too. Real
 * photographs separate far less than synthetic ones — that is the finding worth
 * keeping in front of anyone who touches these thresholds.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, mkdtempSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { encode as encodeJpeg, decode as decodeJpeg } from 'jpeg-js';

const require = createRequire(import.meta.url);
const work = mkdtempSync(join(tmpdir(), 'reba-reflex-'));
execFileSync('npx', ['tsc', 'src/reflex.ts', '--outDir', work,
  '--module', 'commonjs', '--target', 'es2020', '--skipLibCheck']);
const R = require(join(work, 'reflex.js'));

let fails = 0;
const ok = (name, cond, extra = '') => {
  if (!cond) fails++;
  console.log(`  ${cond ? 'ok  ' : 'FAIL'}  ${name}${extra ? '  ' + extra : ''}`);
};
const eq = (name, got, want) => ok(`${name} -> ${got}`, got === want, got === want ? '' : `(want ${want})`);

/** A synthetic eye, with the specular flash highlight a real photograph has. */
function eye(pupil, surround = [28, 18, 16], size = 96) {
  const data = Buffer.alloc(size * size * 4);
  const c = size / 2, rad = size * 0.26, spec = size * 0.06;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const d2 = (x - c) ** 2 + (y - c) ** 2;
    const [r, g, b] = d2 <= spec ** 2 ? [250, 248, 245] : d2 <= rad ** 2 ? pupil : surround;
    const i = (y * size + x) * 4;
    data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255;
  }
  const dec = decodeJpeg(encodeJpeg({ data, width: size, height: size }, 90).data, { useTArray: true });
  return R.measureReflex(dec.data, dec.width, dec.height);
}

const HEALTHY = [205, 45, 35], WHITE = [225, 222, 218], DULL = [120, 55, 48];
const h = eye(HEALTHY), w = eye(WHITE);

console.log('\n-- synthetic eyes, with a flash highlight --');
console.log(`     healthy ${h.redness.toFixed(3)}   white ${w.redness.toFixed(3)}   gap ${(h.redness - w.redness).toFixed(3)}`);
ok('a healthy reflex is red-dominant', h.redness > 0.55, `(${h.redness.toFixed(3)})`);
ok('a white reflex sits near neutral', w.redness < 0.40, `(${w.redness.toFixed(3)})`);
ok('the flash highlight does not swamp it', h.redness - w.redness > 0.25);

console.log('\n-- the finding --');
eq('two healthy eyes', R.compareReflexes(h, h).finding, 'symmetric');
eq('one white pupil', R.compareReflexes(h, w).finding, 'palePupil');
eq('one dull, one healthy', R.compareReflexes(h, eye(DULL)).finding, 'asymmetric');
eq('both dull but alike', R.compareReflexes(eye(DULL), eye(DULL)).finding, 'symmetric');

console.log('\n-- it refuses to read what it cannot see --');
const dark = eye([6, 5, 5], [4, 4, 4]);
ok('a black frame is unreadable', dark.tooDark);
eq('and the comparison says so', R.compareReflexes(h, dark).finding, 'unreadable');
eq('a green frame is not a pale pupil', R.compareReflexes(h, eye([40, 200, 60])).finding, 'unreadable');
eq('nor a blue one', R.compareReflexes(h, eye([40, 60, 200])).finding, 'unreadable');

console.log('\n-- skin tone cancels, because the patient is their own control --');
for (const [name, s] of [['deep', [18, 11, 9]], ['mid', [40, 26, 22]], ['light', [70, 48, 42]]]) {
  const cmp = R.compareReflexes(eye(HEALTHY, s), eye(HEALTHY, s));
  ok(`${name}: two healthy eyes read symmetric`, cmp.finding === 'symmetric', `(gap ${cmp.rednessGap.toFixed(4)})`);
  ok(`${name}: a white pupil is still caught`, R.compareReflexes(eye(HEALTHY, s), eye(WHITE, s)).finding === 'palePupil');
}

// ---------------------------------------------------------------- real pair
const PAIR = [
  ['photos/rb-right-eye-normal.jpg', 'normal'],
  ['photos/rb-left-eye-leukocoria.jpg', 'leukocoria'],
];
if (PAIR.every(([f]) => existsSync(f))) {
  console.log('\n-- a real photograph (Wikimedia, public domain) --');
  const measured = PAIR.map(([f]) => {
    const out = join(work, 'r.jpg');
    execFileSync('convert', [f, '-resize', '96x96!', '-quality', '100', out]);
    const d = decodeJpeg(readFileSync(out), { useTArray: true });
    return R.measureReflex(d.data, d.width, d.height);
  });
  const [real, sick] = measured;
  const cmp = R.compareReflexes(real, sick);
  console.log(`     healthy ${real.redness.toFixed(3)}   leukocoria ${sick.redness.toFixed(3)}   gap ${cmp.rednessGap.toFixed(3)}`);
  ok('the leukocoria is caught', cmp.finding === 'palePupil', `(${cmp.finding})`);
  ok('the healthy eye is not itself pale', real.redness >= R.PALE_AT, `(${real.redness.toFixed(3)} vs ${R.PALE_AT})`);
  console.log('     real photographs separate far less than synthetic ones.');
  console.log('     the thresholds still need real data before anyone trusts them.');
} else {
  console.log('\n-- no real photographs in photos/, skipping that check --');
}

console.log(fails ? `\n${fails} FAILED\n` : '\nall passed\n');
process.exit(fails ? 1 : 0);
