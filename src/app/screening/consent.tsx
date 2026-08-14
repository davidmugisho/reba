import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Button, Card, Eyebrow, Screen, StepDots, Title } from '../../components/reba-kit';
import { useScreening } from '../../context/ScreeningContext';
import { color, radius, space, type } from '../../theme';

const POINTS = [
  'This check looks for signs that the eyes need a closer look by a nurse or doctor.',
  'It is not a diagnosis. Nothing here replaces a clinic visit.',
  'Two photos of the eyes are taken. They stay on this phone.',
  'You can stop at any point.',
];

export default function Consent() {
  const router = useRouter();
  const { update } = useScreening();
  const [agreed, setAgreed] = useState(false);

  function next() {
    update({ consentGiven: true });
    router.push('/screening/patient');
  }

  return (
    <Screen
      footer={<Button label="Continue" onPress={next} disabled={!agreed} />}
    >
      <StepDots current={0} total={6} />
      <Eyebrow>Step 1 of 6</Eyebrow>
      <Title>Read this to the patient</Title>
      <Body muted>Use their own words if it helps. Wait for a clear yes.</Body>

      <Card>
        {POINTS.map((point) => (
          <View key={point} style={s.point}>
            <View style={s.bullet} />
            <Text style={s.pointText}>{point}</Text>
          </View>
        ))}
      </Card>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: agreed }}
        onPress={() => setAgreed((v) => !v)}
        style={s.check}
      >
        <View style={[s.box, agreed && s.boxOn]}>
          {agreed ? <Text style={s.tick}>✓</Text> : null}
        </View>
        <Text style={s.checkLabel}>The patient, or their guardian, agreed out loud.</Text>
      </Pressable>
    </Screen>
  );
}

const s = StyleSheet.create({
  point: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.accent,
    marginTop: 9,
  },
  pointText: { ...type.body, color: color.ink, flex: 1 },
  check: { flexDirection: 'row', gap: space.md, alignItems: 'center', paddingVertical: space.sm },
  box: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: color.inkFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: color.ink, borderColor: color.ink },
  tick: { color: color.onDark, fontSize: 18, fontWeight: '700' },
  checkLabel: { ...type.body, color: color.ink, flex: 1 },
});
