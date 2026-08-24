/**
 * Checks that the EjoChat key works, and shows what the API actually returns.
 *
 *   node tools/test-ejochat.mjs
 *
 * Reads .env directly — nothing is printed that could leak the key. Worth
 * running before trusting the explain screen, because src/ejochat.ts guesses
 * at the response shape and this is what confirms it.
 */
import { existsSync, readFileSync } from 'node:fs';

const env = {};
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const KEY = env.EXPO_PUBLIC_EJOCHAT_KEY ?? '';
const URL = env.EXPO_PUBLIC_EJOCHAT_URL || 'https://api.ejolabs.com/api/v1/subiza';

if (!KEY) {
  console.log('\n  No key found.\n');
  console.log('  1. cp .env.example .env');
  console.log('  2. paste the key into .env after EXPO_PUBLIC_EJOCHAT_KEY=');
  console.log('  3. run this again\n');
  console.log('  Put it in .env, never in .env.example — that one is committed.\n');
  process.exit(1);
}

// Enough to confirm the right key is loaded, not enough to reuse it.
console.log(`\n  key   ${KEY.slice(0, 10)}…${KEY.slice(-3)}  (${KEY.length} characters)`);
console.log(`  url   ${URL}\n`);

const question = process.argv.slice(2).join(' ') || 'Muraho, ubu ni ikizamini.';
console.log(`  asking: "${question}"\n`);

const started = Date.now();
let response;
try {
  response = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': KEY },
    body: JSON.stringify({ messages: [{ role: 'user', content: question }] }),
  });
} catch (cause) {
  console.log(`  COULD NOT REACH IT: ${cause}\n`);
  console.log('  No signal, or the endpoint is wrong. The app handles this —');
  console.log('  the explain screen keeps its written script.\n');
  process.exit(1);
}

const elapsed = Date.now() - started;
console.log(`  HTTP ${response.status} in ${elapsed} ms`);

const text = await response.text();
if (!response.ok) {
  console.log(`\n  REFUSED:\n  ${text.slice(0, 400)}\n`);
  if (response.status === 401 || response.status === 403) {
    console.log('  The key was rejected. Check it was copied whole.\n');
  }
  process.exit(1);
}

let data;
try {
  data = JSON.parse(text);
} catch {
  console.log(`\n  Not JSON. Raw reply:\n  ${text.slice(0, 400)}\n`);
  process.exit(1);
}

console.log('\n  --- what came back ---');
console.log(JSON.stringify(data, null, 2).slice(0, 1200));

// The same order src/ejochat.ts tries.
const paths = {
  'choices[0].message.content': data?.choices?.[0]?.message?.content,
  'choices[0].text': data?.choices?.[0]?.text,
  'message.content': data?.message?.content,
  reply: data?.reply,
  response: data?.response,
  answer: data?.answer,
  output: data?.output,
  content: data?.content,
};
const found = Object.entries(paths).find(([, v]) => typeof v === 'string' && v.trim());

console.log('\n  --- can the app read it? ---');
if (found) {
  console.log(`  YES — the answer is at "${found[0]}"`);
  console.log(`\n  ${found[1].trim().slice(0, 400)}\n`);
} else {
  console.log('  NO — none of the shapes src/ejochat.ts knows about matched.');
  console.log('  Send me the JSON above and I will adjust extractAnswer().\n');
  process.exit(1);
}
