import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Body, Button, Eyebrow, Screen, StepDots, Title } from '../../components/reba-kit';
import { useScreening } from '../../context/ScreeningContext';
import type { Eye } from '../../types/screening';
import { color, radius, space, type } from '../../theme';

/**
 * Day 4 replaces the placeholder frame with expo-camera: forced flash,
 * an alignment ring, and one shot per eye at a fixed distance.
 */
export default function Capture() {
  const router = useRouter();
  const { draft, update } = useScreening();
  const [eye, setEye] = useState<Eye>('right');

  const captured = draft.captures.map((c) => c.eye);
  const bothDone = captured.includes('left') && captured.includes('right');

  function shoot() {
    update({
      captures: [
        ...draft.captures.filter((c) => c.eye !== eye),
        { eye, uri: 'placeholder', capturedAt: new Date().toISOString() },
      ],
    });
    if (eye === 'right') setEye('left');
  }

  return (
    <Screen
      footer={
        bothDone ? (
          <Button label="Analyse" onPress={() => router.push('/screening/analysis')} />
        ) : (
          <Button label={`Capture ${eye} eye`} onPress={shoot} />
        )
      }
    >
      <StepDots current={3} total={6} />
      <Eyebrow>Step 4 of 6</Eyebrow>
      <Title>{bothDone ? 'Both eyes captured' : `Capture the ${eye} eye`}</Title>
      <Body muted>
        Darken the room if you can. Hold the phone one metre away, flash on, and fill the ring
        with the eye.
      </Body>

      <View style={s.viewfinder}>
        <View style={s.ring} />
        <Text style={s.placeholder}>Camera — day 4</Text>
      </View>

      <View style={s.status}>
        <EyeChip eye="right" done={captured.includes('right')} active={eye === 'right'} />
        <EyeChip eye="left" done={captured.includes('left')} active={eye === 'left'} />
      </View>
    </Screen>
  );
}

function EyeChip({ eye, done, active }: { eye: Eye; done: boolean; active: boolean }) {
  return (
    <View style={[s.chip, done && s.chipDone, active && !done && s.chipActive]}>
      <Text style={[s.chipLabel, done && { color: color.clear }]}>
        {done ? '✓ ' : ''}
        {eye === 'right' ? 'Right eye' : 'Left eye'}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  viewfinder: {
    aspectRatio: 3 / 4,
    borderRadius: radius.lg,
    backgroundColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.md,
  },
  ring: {
    width: '55%',
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: color.accent,
  },
  placeholder: { ...type.label, color: color.inkFaint },
  status: { flexDirection: 'row', gap: space.sm },
  chip: {
    flex: 1,
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: color.line,
    alignItems: 'center',
  },
  chipActive: { borderColor: color.accent },
  chipDone: { borderColor: color.clear, backgroundColor: color.clearSoft },
  chipLabel: { ...type.body, fontWeight: '600', color: color.ink },
});
