# Photographs for evaluating the reflex check

Drop cropped eye photographs here, list them in `labels.csv`, then run:

```bash
node tools/evaluate-reflex.mjs
```

It reports how many abnormal cases the measurement missed — the only number
that really matters for a screening tool.

## Getting images

Wikimedia Commons is the practical starting point: search `leukocoria`,
`strabismus`, `cataract`. The images are freely licensed and the diagnosis is
usually stated. Open-access case reports carry more.

Normal eyes are free: photograph your own, or colleagues', through Reba itself.
That is the better half of the set anyway, because it comes from the same
camera in the same conditions.

Skip the large public ophthalmology datasets. They are fundus photographs taken
with hospital cameras, which is a different signal from a phone flash and will
teach you nothing about this.

## Crop to one eye

The app measures the middle of its frame, because the health worker fills the
alignment ring with the eye. An uncropped face measures a cheek. Crop each
image to a single eye, roughly centred on the pupil, before adding it.

## What this can and cannot tell you

It scores the **absolute** paleness of one reflex. The sturdier signal — the
difference between a patient's two eyes — needs both eyes of the same person,
so it can only be judged on pairs.

And a few dozen images is a first look, not a validation. It is enough to see
whether the thresholds are obviously wrong. It is not enough to say they are
right; that needs hundreds of cases and a protocol.

## Do not commit patient photographs

`.gitignore` keeps images out of the repository. Anything identifiable stays
off GitHub.
