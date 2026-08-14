# Reba

Vision screening for community health workers in Rwanda. It runs on a cheap
Android phone, offline, in about five minutes, and it never sends anything
anywhere.

*Reba* is Kinyarwanda for *look*.

## The problem it exists for

Most avoidable blindness is avoidable because someone could have caught it
early. In practice nobody catches it, because the nearest ophthalmologist is
hours away and a community health worker has no way to tell a lazy eye from a
tired one.

Reba does not diagnose. It is a triage tool: it flags the eyes a nurse or
doctor should look at properly, and it says so in language a health worker can
read at arm's length, outdoors, with a queue waiting.

## Two rules the whole app obeys

**Nothing leaves the phone.** No account, no upload, no sync, no analytics.
Screenings are written to on-device storage and stay there. This is not a
feature to be traded away later — it is the reason a health worker can run the
check on a child without asking a family to consent to anything leaving the
room.

**Reba never clears anyone.** There is no green band, no "healthy" result. The
mildest outcome the app can give is *no signs today*, and it says in the same
breath that this is not the same as healthy eyes. The model threshold is tuned
for sensitivity rather than accuracy on purpose: a false positive costs one
consultation, a false negative can cost an eye.

## The screening flow

Six steps, strictly linear, one screen each. A health worker gets interrupted —
a crying child, a queue — so every step is somewhere you can come back to
without losing the thread.

1. **Consent** — a script to read aloud, and a checkbox for a spoken yes.
2. **Patient** — age and sex are required, village and facility code are not.
3. **Visual acuity** — a tumbling E. The patient points which way the legs face,
   so it works for children and for adults who do not read.
4. **Eye capture** — one photo per eye, flash on, in a darkened room if there
   is one.
5. **Result** — a full-bleed colour band. This is the screen the product lives
   or dies on, so every other screen stays quiet to let it shout.
6. **Referral slip** — the outcome laid out to be shown to the family or copied
   onto the paper form, plus free-text notes. Saving happens here.

## What is real, and what is not

This is an early build. Several steps are deliberate placeholders, and it is
worth knowing which before you read the code and assume it is broken.

| Step | State |
| --- | --- |
| Consent | Real |
| Patient | Real |
| Visual acuity | **Placeholder.** The E never rotates and answers are not scored. Pressing continue records whichever line is showing, for both eyes. |
| Eye capture | **Placeholder.** No camera. Each capture stores `uri: 'placeholder'`. |
| Analysis | **Placeholder.** A 1.6s timeout and a hardcoded score of `0.72`, so every screening currently comes out as *refer*. |
| Result | Real, on top of a stubbed score. The *Explain this to me* button does nothing yet. |
| Referral + saving | Real. Writes to disk, survives a restart, and tells you when it fails. |

One more thing to know: the in-progress screening lives in memory only. If the
OS kills the app mid-screening, that screening is gone. Only committed records
survive.

## Running it

```bash
npm install
npx expo start          # then a for Android, i for iOS, w for web
```

Typecheck before you commit:

```bash
npx tsc --noEmit
```

Web works and is the fastest way to click through the flow, but it is not the
target. The target is a mid-range Android phone in daylight — check anything
that touches storage or the camera on a real device.

## Layout

```
src/
  app/                    # expo-router routes; the file tree IS the navigation
    index.tsx             # home: the tally and the two buttons
    screening/            # the six-step flow, its own stack
    history/              # list, and [id] for one record
  components/reba-kit.tsx # Screen, Button, Card, Title, Body, StepDots
  context/                # the screening being carried out right now
  storage/                # the only module that touches the disk
  theme.ts                # design tokens
  types/screening.ts      # the record shape
```

The routes depend on `reba-kit`, `ScreeningContext`, `storage/screenings`,
`theme.ts` and `types/screening`, and on nothing else. Anything else still
sitting in `src/components`, `src/hooks` or `src/constants` is leftover from
the Expo template and is not wired to anything — ignore it, or delete it.

## Storage

One module, [`src/storage/screenings.ts`](src/storage/screenings.ts), owns the
disk. Records live in AsyncStorage under the key `reba:screenings:v1`.

Stay on the version Expo pins — `npx expo install --check` is the authority,
not npm's latest. AsyncStorage's v3 line has a nicer API, but its native module
is not in Expo Go for this SDK, so a v3 build cannot be tested on a phone
without a custom dev client.

Two behaviours there are deliberate and should survive refactoring:

- **A failed read is not an empty list.** The read path degrades to `[]` so a
  screen still renders, but the write path throws instead. Treating an
  unreadable store as empty means the next save writes a one-record list over
  the top of every screening the device is holding.
- **A corrupt payload is quarantined, not overwritten.** It moves to
  `screenings:v1:corrupt:<timestamp>` so the records can still be pulled off
  the device, and the app carries on.

If a save fails, the referral screen says so, keeps the slip on screen to be
copied onto paper, and offers a retry. An app that claims to have saved a
screening and hasn't is worse than no app at all.

## Design

Tokens live in [`src/theme.ts`](src/theme.ts) and the reasoning is written down
there. The short version: the app is used outdoors on cheap screens, so
contrast is functional rather than decorative; touch targets never go below
56dp and text never below 13px; and colour means status and nothing else, so
the result band is the only saturated colour anywhere. The sky blue is from the
Rwandan flag rather than the default medical palette, because this is built for
Rwandan health workers first.

## Where it is going

- **Day 3** — real acuity: card-on-screen calibration, randomised direction,
  decreasing sizes, a stop rule after two misses on a line.
- **Day 4** — `expo-camera`: forced flash, alignment ring, one shot per eye at
  a fixed distance.
- **Day 7** — real on-device TFLite inference in place of the timeout.

Then: an explain screen for the result, and a way to get records off the phone
that does not betray the first rule.

## Working on this

Expo moves fast and this project tracks SDK 57. Read the versioned docs at
<https://docs.expo.dev/versions/v57.0.0/> before writing code against an Expo
API — the current docs will lie to you about older and newer releases alike.

Typed routes and the React Compiler are both switched on in
[`app.json`](app.json), so a bad `href` is a typecheck failure rather than a
runtime surprise.
