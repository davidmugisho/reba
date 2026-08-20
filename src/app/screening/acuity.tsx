import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  answerOptotype,
  currentLevel,
  DIRECTIONS,
  optotypeHeightPx,
  pxPerMmFromCardWidth,
  resultOf,
  ROTATION,
  startEyeTest,
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

/** ISO/IEC 7810 ID-1, the shape of every bank and national ID card. */
const CARD_ASPECT = 85.6 / 53.98;

const randomDirection = (avoid?: Direction): Direction => {
  const pool = avoid ? DIRECTIONS.filter((d) => d !== avoid) : DIRECTIONS;
  return pool[Math.floor(Math.random() * pool.length)];
};

type Phase = 'calibrate' | 'test' | 'done';

export default function Acuity() {
  const router = useRouter();
  const { update } = useScreening();
  const t = useT();

  const [phase, setPhase] = useState<Phase>('calibrate');
  const [cardWidth, setCardWidth] = useState(300);
  const [eye, setEye] = useState<Eye>('right');
  const [test, setTest] = useState<EyeTest>(startEyeTest);
  const [direction, setDirection] = useState<Direction>(randomDirection);
  const [results, setResults] = useState<Partial<Record<Eye, EyeResult>>>({});

  const pxPerMm = pxPerMmFromCardWidth(cardWidth);

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

        <View style={s.cardStage}>
          <View
            style={[s.cardOutline, { width: cardWidth, height: cardWidth / CARD_ASPECT }]}
          />
        </View>

        <View style={s.sizeRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.acuity.narrower}
            onPress={() => setCardWidth((w) => Math.max(160, w - 4))}
            style={({ pressed }) => [s.sizeBtn, pressed && { backgroundColor: color.raised }]}
          >
            <Text style={s.sizeBtnLabel}>−</Text>
          </Pressable>
          <Text style={s.sizeLabel}>{t.acuity.narrower} / {t.acuity.wider}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.acuity.wider}
            onPress={() => setCardWidth((w) => Math.min(520, w + 4))}
            style={({ pressed }) => [s.sizeBtn, pressed && { backgroundColor: color.raised }]}
          >
            <Text style={s.sizeBtnLabel}>+</Text>
          </Pressable>
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
    justifyContent: 'center',
    paddingVertical: space.lg,
  },
  cardOutline: {
    borderWidth: 2.5,
    borderColor: color.accent,
    borderRadius: radius.md,
    backgroundColor: color.accentSoft,
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
