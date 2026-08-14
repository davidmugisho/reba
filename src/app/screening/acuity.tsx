import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Button, Card, Eyebrow, Screen, StepDots, Title } from '../../components/reba-kit';
import { useScreening } from '../../context/ScreeningContext';
import { color, radius, space, TAP, type } from '../../theme';

/**
 * Tumbling E. The patient points which way the legs face, so it works for
 * children and for adults who do not read. Day 3 fills in the real logic:
 * calibration, decreasing sizes, stop rule.
 *
 * Sizes below are 6/x notation — 6/6 is normal, 6/60 is the top line.
 */
const LEVELS = [60, 36, 24, 18, 12, 9, 6];

type Direction = 'up' | 'right' | 'down' | 'left';

const ROTATION: Record<Direction, string> = {
  up: '-90deg',
  right: '0deg',
  down: '90deg',
  left: '180deg',
};

export default function Acuity() {
  const router = useRouter();
  const { draft, update } = useScreening();
  const [levelIndex, setLevelIndex] = useState(0);
  const [direction] = useState<Direction>('right');

  // TODO day 3: calibrate with a bank card, randomise direction,
  // track correct answers, stop after two misses on a line.
  function answer(_guess: Direction) {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex((i) => i + 1);
    }
  }

  function skip() {
    update({ acuity: { ...draft.acuity, left: LEVELS[levelIndex], right: LEVELS[levelIndex] } });
    router.push('/screening/capture');
  }

  return (
    <Screen footer={<Button label="Continue to eye capture" onPress={skip} />}>
      <StepDots current={2} total={6} />
      <Eyebrow>Step 3 of 6</Eyebrow>
      <Title>Which way do the legs point?</Title>
      <Body muted>
        Stand the patient three metres away. Cover the left eye first. Ask them to point.
      </Body>

      <Card style={s.chart}>
        <Text style={[s.letterE, { transform: [{ rotate: ROTATION[direction] }] }]}>E</Text>
      </Card>

      <Text style={s.level}>6/{LEVELS[levelIndex]}</Text>

      <View style={s.pad}>
        <View style={s.padRow}>
          <Arrow label="↑" onPress={() => answer('up')} />
        </View>
        <View style={s.padRow}>
          <Arrow label="←" onPress={() => answer('left')} />
          <Arrow label="→" onPress={() => answer('right')} />
        </View>
        <View style={s.padRow}>
          <Arrow label="↓" onPress={() => answer('down')} />
        </View>
      </View>
    </Screen>
  );
}

function Arrow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [s.arrow, pressed && { backgroundColor: color.raised }]}
    >
      <Text style={s.arrowLabel}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  chart: { alignItems: 'center', justifyContent: 'center', paddingVertical: space.xl },
  letterE: { fontSize: 96, fontWeight: '700', color: color.ink },
  level: { ...type.label, color: color.inkMuted, textAlign: 'center' },
  pad: { alignItems: 'center', gap: space.sm, marginTop: space.md },
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
});
