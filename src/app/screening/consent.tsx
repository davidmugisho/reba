import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Button, Card, Eyebrow, Screen, StepDots, Title } from '../../components/reba-kit';
import { useScreening } from '../../context/ScreeningContext';
import { useT } from '../../i18n';
import { color, radius, space, type } from '../../theme';

export default function Consent() {
  const router = useRouter();
  const { update } = useScreening();
  const t = useT();
  const [agreed, setAgreed] = useState(false);

  function next() {
    update({ consentGiven: true });
    router.push('/screening/patient');
  }

  return (
    <Screen
      footer={<Button label={t.common.continue} onPress={next} disabled={!agreed} />}
    >
      <StepDots current={0} total={6} />
      <Eyebrow>{t.consent.step}</Eyebrow>
      <Title>{t.consent.title}</Title>
      <Body muted>{t.consent.lead}</Body>

      <Card>
        {t.consent.points.map((point) => (
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
        <Text style={s.checkLabel}>{t.consent.agreed}</Text>
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
  tick: { color: color.onDark, fontSize: 16, fontWeight: '700' },
  checkLabel: { ...type.body, color: color.ink, flex: 1 },
});
