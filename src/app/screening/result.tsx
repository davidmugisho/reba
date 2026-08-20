import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Body, Button, Card, Screen, Title } from '../../components/reba-kit';
import { useScreening } from '../../context/ScreeningContext';
import { useT } from '../../i18n';
import type { Strings } from '../../i18n/en';
import type { RiskLevel } from '../../types/screening';
import { color, radius, space, type } from '../../theme';

/**
 * The one screen that carries the whole product. It is a full-bleed band
 * because a CHW reads it at arm's length, outdoors, and sometimes shows it
 * to the patient. Everything else in the app stays quiet so this can shout.
 *
 * Note there is no "healthy" band. The app never clears anyone.
 */
function bandFor(risk: RiskLevel, t: Strings) {
  switch (risk) {
    case 'clear':
      return { title: t.result.clearTitle, body: t.result.clearBody, bg: color.clearSoft, fg: color.clear };
    case 'monitor':
      return {
        title: t.result.monitorTitle,
        body: t.result.monitorBody,
        bg: color.monitorSoft,
        fg: color.monitor,
      };
    case 'refer':
      return { title: t.result.referTitle, body: t.result.referBody, bg: color.referSoft, fg: color.refer };
  }
}

export default function Result() {
  const router = useRouter();
  const { draft } = useScreening();
  const t = useT();
  const band = draft.risk ? bandFor(draft.risk, t) : null;

  // No analysis in hand — the screen was reached by a reload or a link into a
  // flow that has already finished. Never fall back to a band: the mildest one
  // reads as "recheck in 3 months" and would quietly stand down a patient who
  // was in fact referred.
  if (!band) {
    return (
      <Screen footer={<Button label={t.result.backToStart} onPress={() => router.replace('/')} />}>
        <Title>{t.result.noneTitle}</Title>
        <Body muted>{t.result.noneBody}</Body>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <>
          <Button
            label={t.result.fillReferral}
            onPress={() => router.push('/screening/referral')}
          />
          <Button
            label={t.result.explain}
            variant="secondary"
            onPress={() => router.push('/screening/explain')}
          />
        </>
      }
    >
      <View style={[s.band, { backgroundColor: band.bg }]}>
        <Text style={[s.bandLabel, { color: band.fg }]}>{t.result.label}</Text>
        <Text style={[s.bandTitle, { color: band.fg }]}>{band.title}</Text>
      </View>

      <Body>{band.body}</Body>

      <Card>
        <Text style={s.cardLabel}>{t.result.notLabel}</Text>
        <Body muted>{t.result.notBody}</Body>
      </Card>

      {draft.triage ? (
        <>
          <Text style={s.reason}>{t.result.reason(draft.triage.reason)}</Text>
          <Text style={s.meta}>{t.result.basis}</Text>
        </>
      ) : null}
    </Screen>
  );
}

const s = StyleSheet.create({
  band: {
    borderRadius: radius.lg,
    padding: space.lg,
    paddingVertical: space.xl,
    gap: space.sm,
  },
  bandLabel: { ...type.label },
  bandTitle: { ...type.display },
  cardLabel: { ...type.label, color: color.inkMuted },
  reason: { ...type.body, fontWeight: '600', color: color.ink },
  meta: { ...type.body, fontSize: 13, lineHeight: 19, color: color.inkFaint },
});
