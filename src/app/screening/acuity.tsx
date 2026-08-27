import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import {
  answerOptotype,
  currentLevel,
  DIRECTIONS,
  CARD_LONG_MM,
  CARD_SHORT_MM,
  optotypeHeightPx,
  pxPerMmFromCardShortEdge,
  resultOf,
  ROTATION,
  startEyeTest,
  widestOptotypePx,
  type Direction,
  type EyeResult,
  type EyeTest,
} from '../../acuity';
import { Body, Button, Card, Eyebrow, Screen, StepDots, Title } from '../../components/reba-kit';
import { useScreening } from '../../context/ScreeningContext';
import { useT } from '../../i18n';
import type { Eye } from '../../types/screening';
import { color, radius, space, TAP, type } from '../../theme';

/**
 * Tumbling E, three metres, one eye at a time.
 *
 * The measurement itself lives in src/acuity.ts. This file is the examiner's
 * side of it: what the patient sees, and the four buttons the health worker
 * taps to record where the patient pointed. The patient never touches
 * the phone.
 *
 * Nothing is written to the record until both eyes are done, and a line the
 * patient never passed is stored as null rather than as a number. An acuity
 * that was not measured must not be able to look like one that was.
 */

/**
 * The card is drawn standing up, short edge across, and that is the whole
 * point of this step.
 *
 * A phone screen is around 65 mm wide and the card's long edge is 85.6 mm, so
 * a card drawn lying down is wider than the glass it is drawn on. The examiner
 * would be asked to line up an edge that is not on the screen, and whatever
 * they settled on would silently become the scale for every letter after it.
 * Standing the card up puts the matched edge at 53.98 mm, which fits on every
 * phone this app is meant to run on.
 *
 * The bottom of the card runs off the screen and that is fine: only the width
 * is being matched, and the copy says so.
 */
const CARD_ASPECT = CARD_LONG_MM / CARD_SHORT_MM;

/** Padding either side of a Screen. The chart lives inside it. */
const SCREEN_PADDING = space.lg * 2;

/**
 * The outline breaks out of that padding and runs almost to the glass.
 *
 * On the smallest phone we target the card's short edge needs 346 units and
 * the padded column only offers 327, so obeying the layout here would put us
 * straight back to an edge that cannot be matched.
 */
const STAGE_BLEED = space.sm * 2;

/** Finger-sized steps would be coarser than the measurement deserves. */
const NUDGE = 2;

/**
 * How much of the standing card is drawn.
 *
 * At true scale the card is around 520 units tall, which is more than a phone
 * has to spare. Only the two sides are being matched, so the top of the card
 * is enough, and stopping well clear of the footer keeps the open bottom edge
 * reading as "this continues" rather than as a button that clipped it.
 */
const OUTLINE_MAX_H = 190;

const randomDirection = (avoid?: Direction): Direction => {
  const pool = avoid ? DIRECTIONS.filter((d) => d !== avoid) : DIRECTIONS;
  return pool[Math.floor(Math.random() * pool.length)];
};

type Phase = 'calibrate' | 'test' | 'done';

export default function Acuity() {
  const router = useRouter();
  const { update } = useScreening();
  const t = useT();

  // The outline may never be wider than the glass. A card edge that is off the
  // screen cannot be matched, and the scale it produces would still look like
  // a measurement in the record.
  const { width: windowWidth } = useWindowDimensions();
  const maxEdge = Math.max(120, Math.round(windowWidth - STAGE_BLEED));
  // Most phones land near 6 screen units per millimetre, so this opens close
  // to right and the examiner nudges from there rather than hunting.
  const [cardEdge, setCardEdge] = useState(() => Math.min(maxEdge, Math.round(CARD_SHORT_MM * 6)));

  const [phase, setPhase] = useState<Phase>('calibrate');
  const [eye, setEye] = useState<Eye>('right');
  const [test, setTest] = useState<EyeTest>(startEyeTest);
  const [direction, setDirection] = useState<Direction>(randomDirection);
  const [results, setResults] = useState<Partial<Record<Eye, EyeResult>>>({});

  const edge = Math.min(cardEdge, maxEdge);
  const pxPerMm = pxPerMmFromCardShortEdge(edge);

  function commit(all: Partial<Record<Eye, EyeResult>>) {
    update({
      acuity: {
        right: all.right?.denominator ?? null,
        left: all.left?.denominator ?? null,
        rightBelowChart: all.right?.belowChart ?? false,
        leftBelowChart: all.left?.belowChart ?? false,
        pxPerMm,
      },
    });
  }

  function finishEye(final: EyeTest) {
    const all = { ...results, [eye]: resultOf(final) };
    setResults(all);

    if (eye === 'right') {
      setEye('left');
      setTest(startEyeTest());
      setDirection(randomDirection());
      return;
    }
    commit(all);
    setPhase('done');
  }

  /** `guess` is null when the patient cannot make the letter out at all. */
  function answer(guess: Direction | null) {
    const next = answerOptotype(test, guess === direction);
    if (next.done) {
      finishEye(next);
      return;
    }
    setTest(next);
    setDirection(randomDirection(direction));
  }

  function redoEye(which: Eye) {
    setEye(which);
    setTest(startEyeTest());
    setDirection(randomDirection());
    setPhase('test');
  }

  // ---------------------------------------------------------------- calibrate
  if (phase === 'calibrate') {
    return (
      <Screen
        footer={<Button label={t.acuity.calibrateDone} onPress={() => setPhase('test')} />}
      >
        <StepDots current={2} total={6} />
        <Eyebrow>{t.acuity.step}</Eyebrow>
        <Title>{t.acuity.calibrateTitle}</Title>
        <Body muted>{t.acuity.calibrateLead}</Body>

        <View style={s.sizeRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.acuity.narrower}
            onPress={() => setCardEdge((w) => Math.max(120, w - NUDGE))}
            style={({ pressed }) => [s.sizeBtn, pressed && { backgroundColor: color.raised }]}
          >
            <Text style={s.sizeBtnLabel}>−</Text>
          </Pressable>
          <Text style={s.sizeLabel}>{t.acuity.narrower} / {t.acuity.wider}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.acuity.wider}
            onPress={() => setCardEdge((w) => Math.min(maxEdge, w + NUDGE))}
            style={({ pressed }) => [s.sizeBtn, pressed && { backgroundColor: color.raised }]}
          >
            <Text style={s.sizeBtnLabel}>+</Text>
          </Pressable>
        </View>

        {/* The outline sits below the buttons and not above them. A card
            standing against the glass covers everything under its top edge,
            so controls placed beneath it can only be reached by taking the
            card off the screen, which loses the alignment being made. */}
        <View style={s.cardStage}>
          <View
            style={[
              s.cardOutline,
              { width: edge, height: Math.min(edge * CARD_ASPECT, OUTLINE_MAX_H) },
            ]}
          />
        </View>

      </Screen>
    );
  }

  // --------------------------------------------------------------------- done
  if (phase === 'done') {
    return (
      <Screen
        footer={
          <Button label={t.acuity.next} onPress={() => router.push('/screening/capture')} />
        }
      >
        <StepDots current={2} total={6} />
        <Eyebrow>{t.acuity.step}</Eyebrow>
        <Title>{t.acuity.resultTitle}</Title>

        <Card style={s.summary}>
          <EyeRow
            label={t.acuity.rightEye}
            reading={t.acuity.eyeReading(
              results.right?.denominator ?? null,
              results.right?.belowChart ?? false,
            )}
            redoLabel={t.acuity.redo}
            onRedo={() => redoEye('right')}
          />
          <EyeRow
            label={t.acuity.leftEye}
            reading={t.acuity.eyeReading(
              results.left?.denominator ?? null,
              results.left?.belowChart ?? false,
            )}
            redoLabel={t.acuity.redo}
            onRedo={() => redoEye('left')}
          />
        </Card>
      </Screen>
    );
  }

  // --------------------------------------------------------------------- test
  const size = optotypeHeightPx(currentLevel(test), pxPerMm);

  // An optotype wider than its container is drawn clipped, which shows the
  // patient a smaller letter than the one about to be recorded against them.
  // With a sane calibration the largest E fits on every phone we target, so
  // reaching this means the calibration is wrong, and saying so beats
  // recording a failure the patient never earned.
  const chartRoom = windowWidth - SCREEN_PADDING - space.md * 2;
  const tooBigForScreen = widestOptotypePx(pxPerMm) > chartRoom;

  if (tooBigForScreen) {
    return (
      <Screen
        footer={<Button label={t.acuity.recalibrate} onPress={() => setPhase('calibrate')} />}
      >
        <StepDots current={2} total={6} />
        <Eyebrow>{t.acuity.step}</Eyebrow>
        <Title>{t.acuity.tooBigTitle}</Title>
        <Body>{t.acuity.tooBigBody}</Body>
      </Screen>
    );
  }

  return (
    <Screen>
      <StepDots current={2} total={6} />
      <Eyebrow>{t.acuity.step}</Eyebrow>
      <Title>{t.acuity.title}</Title>
      <Body muted>{eye === 'right' ? t.acuity.coverLeft : t.acuity.coverRight}</Body>

      <View style={s.testMeta}>
        <Text style={s.testEye}>{eye === 'right' ? t.acuity.rightEye : t.acuity.leftEye}</Text>
        <Text style={s.testLine}>{t.acuity.lineOf(currentLevel(test))}</Text>
      </View>

      <Card style={s.chart}>
        <TumblingE size={size} direction={direction} />
      </Card>

      <View style={s.pad}>
        <View style={s.padRow}>
          <Arrow symbol="↑" name={t.acuity.up} onPress={() => answer('up')} />
        </View>
        <View style={s.padRow}>
          <Arrow symbol="←" name={t.acuity.left} onPress={() => answer('left')} />
          <Arrow symbol="→" name={t.acuity.right} onPress={() => answer('right')} />
        </View>
        <View style={s.padRow}>
          <Arrow symbol="↓" name={t.acuity.down} onPress={() => answer('down')} />
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => answer(null)}
        style={({ pressed }) => [s.cannot, pressed && { backgroundColor: color.raised }]}
      >
        <Text style={s.cannotLabel}>{t.acuity.cannotSee}</Text>
      </Pressable>
    </Screen>
  );
}

/**
 * A tumbling E built from rectangles rather than a font glyph.
 *
 * The optotype is defined on a 5x5 grid with a stroke one unit wide, and its
 * overall height is the measurement. A font would render "E" at some fraction
 * of the point size that varies by typeface and platform, which would quietly
 * make the test wrong.
 */
function TumblingE({ size, direction }: { size: number; direction: Direction }) {
  const u = size / 5;
  const bar = { position: 'absolute' as const, left: 0, width: size, height: u, backgroundColor: color.ink };
  return (
    <View
      accessibilityLabel="E"
      style={{ width: size, height: size, transform: [{ rotate: ROTATION[direction] }] }}
    >
      <View style={[bar, { top: 0 }]} />
      <View style={[bar, { top: 2 * u }]} />
      <View style={[bar, { top: 4 * u }]} />
      <View
        style={{ position: 'absolute', left: 0, top: 0, width: u, height: size, backgroundColor: color.ink }}
      />
    </View>
  );
}

/** The arrowhead is what the health worker taps; `name` is what a screen reader says. */
function Arrow({ symbol, name, onPress }: { symbol: string; name: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      onPress={onPress}
      style={({ pressed }) => [s.arrow, pressed && { backgroundColor: color.raised }]}
    >
      <Text style={s.arrowLabel}>{symbol}</Text>
    </Pressable>
  );
}

function EyeRow({
  label,
  reading,
  redoLabel,
  onRedo,
}: {
  label: string;
  reading: string;
  redoLabel: string;
  onRedo: () => void;
}) {
  return (
    <View style={s.eyeRow}>
      <View style={s.eyeRowMain}>
        <Text style={s.eyeRowLabel}>{label}</Text>
        <Text style={s.eyeRowValue}>{reading}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={redoLabel}
        onPress={onRedo}
        style={({ pressed }) => [s.redo, pressed && { backgroundColor: color.raised }]}
      >
        <Text style={s.redoLabel}>{redoLabel}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  cardStage: {
    alignItems: 'center',
    // Cancels the Screen's padding so the outline can reach the full width.
    marginHorizontal: -space.lg,
    overflow: 'hidden',
  },
  cardOutline: {
    borderWidth: 2.5,
    borderColor: color.accent,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    backgroundColor: color.accentSoft,
    // Left open: the bottom of the card is off the screen and the examiner
    // is matching the two sides, not the corners.
    borderBottomWidth: 0,
  },
  sizeRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, justifyContent: 'center' },
  sizeBtn: {
    width: TAP,
    height: TAP,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBtnLabel: { fontSize: 28, color: color.ink, lineHeight: 32 },
  sizeLabel: { ...type.label, color: color.inkMuted, flex: 1, textAlign: 'center' },

  testMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  testEye: { ...type.body, fontWeight: '700', color: color.ink },
  testLine: { ...type.label, color: color.inkMuted },

  chart: { alignItems: 'center', justifyContent: 'center', paddingVertical: space.xl, minHeight: 180 },

  pad: { alignItems: 'center', gap: space.sm, marginTop: space.sm },
  padRow: { flexDirection: 'row', gap: space.sm },
  arrow: {
    width: TAP + 16,
    height: TAP + 16,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLabel: { fontSize: 30, color: color.ink },

  cannot: {
    minHeight: TAP,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    marginTop: space.xs,
  },
  cannotLabel: { ...type.body, fontWeight: '600', color: color.inkMuted },

  summary: { gap: space.md },
  eyeRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  eyeRowMain: { flex: 1, gap: 2 },
  eyeRowLabel: { ...type.label, color: color.inkMuted },
  eyeRowValue: { ...type.title, fontSize: 20, color: color.ink },
  redo: {
    minHeight: TAP,
    justifyContent: 'center',
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: color.line,
  },
  redoLabel: { ...type.body, fontSize: 13, fontWeight: '600', color: color.ink },
});
