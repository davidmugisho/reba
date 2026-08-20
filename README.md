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
2. **Patient** — age and sex are required, village and referral destination are not.
3. **Visual acuity** — a tumbling E, one eye at a time, after a bank card
   calibrates the screen. The patient points which way the legs face, so it
   works for children and for adults who do not read.
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
| Visual acuity | Real. Card-on-screen calibration, randomised direction, decreasing lines, and a stop rule. An eye that was not measured is stored as `null`, never as a number. |
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
npx expo start          # scan the QR with Expo Go, or press w for web
```

Typecheck before you commit:

```bash
npx tsc --noEmit
```

The project stays on **SDK 54** so it opens in Expo Go. Expo Go carries one SDK
at a time, so bumping the SDK means every phone has to update Expo Go, and
every other project on the old SDK stops opening. Keep it here until there is
a reason to leave, and see [`AGENTS.md`](AGENTS.md).

Expo Go stops being enough the moment a native module that is not already
inside it lands — the on-device model at day 7 is the one to watch. That is
when a development build (`npx expo run:android`) becomes necessary.

Web is the fastest way to click through the flow, but it is not the target. The
target is a mid-range Android phone in daylight — check anything that touches
storage or the camera on a real device.

## Layout

```
src/
  app/                    # expo-router routes; the file tree IS the navigation
    index.tsx             # home: the tally and the two buttons
    screening/            # the six-step flow, its own stack
    history/              # list, and [id] for one record
  components/reba-kit.tsx # Screen, Button, Card, Title, Body, StepDots
  context/                # the screening being carried out right now
  i18n/                   # en is the source; fr, de, rw are typed against it
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

## Language

Kinyarwanda, English, French and German. The picker sits on home under the two
buttons, collapsed to the current language until tapped — a health worker sets
it once at the start of a shift, so it should not read as a fourth decision to
make before starting. The choice is stored on the device.

Flags are drawn PNGs in [`assets/images/flags/`](assets/images/flags), not flag
emoji. Emoji flags degrade to bare letters on a lot of cheap Android builds,
which is the hardware this is for.

[`src/i18n/en.ts`](src/i18n/en.ts) is the source. Every other locale is typed
against it, so a missing key is a compile error rather than a blank label in
front of a patient. Values that vary with data are functions rather than
template strings glued together at the call site, because word order moves
between languages and a sentence assembled from fragments cannot follow it.

**The Kinyarwanda has not been checked by a native speaker.** It was drafted,
not translated, and it must be read by one before the app meets a real patient.
The consent screen is why: a health worker reads it aloud, and it is where the
patient is told this is *not* a diagnosis. If that sentence lands wrong,
someone walks away believing their eyes have been examined when they have not.
The result bands carry the same weight. The warning is repeated at the top of
[`src/i18n/rw.ts`](src/i18n/rw.ts) so it cannot be missed while editing.

German is in because it was asked for. Worth knowing that Rwanda's official
languages are Kinyarwanda, English, French and Swahili — if these screens are
ever used near the eastern border, Swahili will earn its place before German
does.

## The acuity test

[`src/acuity.ts`](src/acuity.ts) holds the measurement and knows nothing about
the screen. It is separate because this is the part that has to be right: a
wrong optotype size or a wrong stop rule produces a number that looks clinical
and is not.

A 6/6 optotype subtends five arcminutes, which is 8.73 mm at six metres, and
the height scales with both the viewing distance and the 6/x denominator. At
the three metres this test uses, the 6/60 line is 43.65 mm tall. Turning
millimetres into pixels needs to know how big the screen is, which is what the
bank-card step is for — every bank and national ID card is 85.6 mm wide
(ISO/IEC 7810 ID-1), so matching an outline to one calibrates the phone.

Three optotypes per line, direction randomised each time, two misses on a line
ends the test. The result is the smallest line the patient actually passed.

The E is drawn from rectangles on a five-by-five grid rather than set in a
font. A font renders "E" at some fraction of the point size that varies by
typeface and platform, which would quietly make the test wrong.

Two outcomes that must not be confused, and are kept apart all the way into
storage: an eye that was never measured is `null`, and an eye that missed even
the largest line is `null` with `belowChart` set. The second is a finding —
vision worse than 6/60 — and it reaches the referral slip as words rather than
as a blank.

## Design

Tokens live in [`src/theme.ts`](src/theme.ts) and the reasoning is written down
there. The short version: the app is used outdoors on cheap screens, so
contrast is functional rather than decorative; touch targets never go below
56dp and text never below 13px; and colour means status and nothing else, so
the result band is the only saturated colour anywhere. The sky blue is from the
Rwandan flag rather than the default medical palette, because this is built for
Rwandan health workers first.

## Where it is going

- **Day 4** — `expo-camera`: forced flash, alignment ring, one shot per eye at
  a fixed distance.
- **Day 7** — real on-device TFLite inference in place of the timeout.

Then: an explain screen for the result, and a way to get records off the phone
that does not betray the first rule.

## Working on this

Expo moves fast and this project tracks SDK 54. Read the versioned docs at
<https://docs.expo.dev/versions/v54.0.0/> before writing code against an Expo
API — the current docs will lie to you about older and newer releases alike.

Typed routes and the React Compiler are both switched on in
[`app.json`](app.json), so a bad `href` is a typecheck failure rather than a
runtime surprise.
