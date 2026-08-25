# Reba

Vision screening for community health workers in Rwanda. Five minutes, on a
cheap Android phone, offline.

*Reba* is Kinyarwanda for *look*.

**Reba does not diagnose.** It flags the eyes a nurse or doctor should examine,
and it says plainly what it does not know.

## Two rules

**Nothing leaves the phone by itself.** No backend, no account, no sync, no
analytics. The one way data can leave is a health worker deliberately exporting
a spreadsheet; the photographs are never in it.

**Reba never clears anyone.** The mildest result is *no signs today*, and it
says in the same breath that this is not the same as healthy eyes. Thresholds
are tuned for sensitivity: a false positive costs one consultation, a false
negative can cost an eye.

## What it does

1. **Consent** — a script read aloud, and a spoken yes.
2. **Patient** — age and sex.
3. **Visual acuity** — a tumbling E at three metres, one eye at a time. An ID
   card calibrates the screen so the letters are a true physical size.
4. **Eye photographs** — one per eye, flash on.
5. **Result** — refer, recheck, or no signs today, plus a script to read to the
   family.
6. **Referral slip** — to show or copy onto the paper form.

Kinyarwanda, English, French and German.

## What is real, and what is not

| Step | State |
| --- | --- |
| Consent, patient, referral, saving | Real |
| Visual acuity | Real. Calibrated, randomised, with a stop rule. An eye that was not measured is stored as `null`, never as a number. |
| Eye photographs | Real. Moved out of the cache into permanent storage; the record keeps that path. |
| Analysis | **Partial.** The band comes from the acuity and the red reflex, both measured on the device. **There is no trained model**, and the result screen says so. |

The model is the next phase. It needs thousands of eye photographs labelled by
ophthalmologists and taken on phones in villages — a dataset that does not exist
for this setting, because nobody had the tool to collect it. Reba is that tool,
and every screening already captures a pair.

## Running it

```bash
npm install
npx expo start          # scan the QR with Expo Go, or press w for web
npx tsc --noEmit        # before committing
```

The project stays on **Expo SDK 54** so it opens in Expo Go. See
[`AGENTS.md`](AGENTS.md).

EjoChat is optional: copy `.env.example` to `.env` and add a key. Without one,
that feature hides itself and everything else works.

## Where things are

```
src/
  app/          expo-router routes; the file tree is the navigation
  acuity.ts     the tumbling E measurement, no UI in it
  reflex.ts     reading the red reflex off a photograph
  triage.ts     which band a screening lands in, and why
  i18n/         en is the source; fr, de, rw are typed against it
  storage/      the only modules that touch the disk
tools/          benches: measure the reflex against known cases, check EjoChat
```

The clinical logic lives in the three pure modules at the top of `src/`, apart
from the screens, because those are the parts that have to be right.

## More

- [`docs/design-notes.md`](docs/design-notes.md) — why each decision was made,
  and the failure it was made against. Read this before changing anything
  clinical.
- [`docs/business-proposal.html`](docs/business-proposal.html) — the STP'26
  submission.

## Before this meets a patient

- The Kinyarwanda was drafted, not translated. A native speaker must read it —
  the consent script is read aloud to patients.
- The reflex thresholds have met very few real eyes and have already produced
  one false positive. They need real photographs before anyone trusts them.
