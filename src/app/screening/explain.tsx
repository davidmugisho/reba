import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Body, Button, Card, Screen, Title } from '../../components/reba-kit';
import { useScreening } from '../../context/ScreeningContext';
import { useT } from '../../i18n';
import type { Strings } from '../../i18n/en';
import type { RiskLevel } from '../../types/screening';
import { color, radius, space, type } from '../../theme';

/**
 * The script a health worker reads to the family.
 *
 * The result screen shouts one line. This is the other half: what that line
 * means, what to do, and what it does not mean. Written to be read aloud, like
 * the consent script, because that is how it will actually be used — a CHW
 * with a phone in one hand explaining to a parent.
 *
 * It also explains the 6/x notation, since that number goes home on the
 * referral slip and means nothing to anyone who has not been taught it.
 */
function pointsFor(risk: RiskLevel, t: Strings): string[] {
  switch (risk) {
    case 'clear':
      return t.explain.clearPoints;
    case 'monitor':
      return t.explain.monitorPoints;
    case 'refer':
      return t.explain.referPoints;
  }
}

export default function Explain() {
  const router = useRouter();
  const { draft } = useScreening();
  const t = useT();

  // Reached only from a result, but a reload can land here with nothing.
  if (!draft.risk) {
    return (
      <Screen footer={<Button label={t.result.backToStart} onPress={() => router.replace('/')} />}>
        <Title>{t.result.noneTitle}</Title>
        <Body muted>{t.result.noneBody}</Body>
      </Screen>
    );
  }

  return (
    <Screen footer={<Button label={t.explain.close} onPress={() => router.back()} />}>
      <Title>{t.explain.title}</Title>
      <Body muted>{t.explain.lead}</Body>

      <Card style={s.script}>
        {pointsFor(draft.risk, t).map((point) => (
          <View key={point} style={s.point}>
            <View style={s.bullet} />
            <Text style={s.pointText}>{point}</Text>
          </View>
        ))}
      </Card>

      <Text style={s.sectionLabel}>{t.explain.readingLabel}</Text>
      <Body muted>{t.explain.readingLead}</Body>
      <Card style={s.reading}>
        <Text style={s.readingLine}>
          {t.explain.readingFor(
            t.acuity.rightEye,
            draft.acuity.right,
            draft.acuity.rightBelowChart ?? false,
          )}
        </Text>
        <Text style={s.readingLine}>
          {t.explain.readingFor(
            t.acuity.leftEye,
            draft.acuity.left,
            draft.acuity.leftBelowChart ?? false,
          )}
        </Text>
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  script: { gap: space.md, backgroundColor: color.raised, borderColor: color.tint },
  point: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.accent,
    marginTop: 8,
  },
  pointText: { ...type.body, color: color.ink, flex: 1 },
  sectionLabel: { ...type.label, color: color.inkMuted, marginTop: space.sm },
  reading: { gap: space.sm, borderRadius: radius.md },
  readingLine: { ...type.body, color: color.ink },
});
