import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Body, Button, Card, Screen, Title } from '../../components/reba-kit';
import { useScreening } from '../../context/ScreeningContext';
import type { RiskLevel } from '../../types/screening';
import { color, radius, space, type } from '../../theme';

/**
 * The one screen that carries the whole product. It is a full-bleed band
 * because a CHW reads it at arm's length, outdoors, and sometimes shows it
 * to the patient. Everything else in the app stays quiet so this can shout.
 *
 * Note there is no "healthy" band. The app never clears anyone.
 */
const BANDS: Record<RiskLevel, { title: string; body: string; bg: string; fg: string }> = {
  clear: {
    title: 'No signs today',
    body: 'Nothing was picked up in this check. That is not the same as healthy eyes. Come back if vision changes, if one eye turns, or if the pupil ever looks white in a photo.',
    bg: color.clearSoft,
    fg: color.clear,
  },
  monitor: {
    title: 'Check again in 3 months',
    body: 'Something was borderline. Not urgent, but it should not be forgotten. Book a repeat check and tell the family what to watch for.',
    bg: color.monitorSoft,
    fg: color.monitor,
  },
  refer: {
    title: 'Refer to an eye clinic',
    body: 'A sign was picked up that needs a clinician to look properly. Refer now, not later. Early treatment is what saves sight.',
    bg: color.referSoft,
    fg: color.refer,
  },
};

export default function Result() {
  const router = useRouter();
  const { draft } = useScreening();
  const band = draft.risk ? BANDS[draft.risk] : null;

  // No analysis in hand — the screen was reached by a reload or a link into a
  // flow that has already finished. Never fall back to a band: the mildest one
  // reads as "recheck in 3 months" and would quietly stand down a patient who
  // was in fact referred.
  if (!band) {
    return (
      <Screen footer={<Button label="Back to start" onPress={() => router.replace('/')} />}>
        <Title>No result to show</Title>
        <Body muted>
          This screening is not in progress any more, so there is nothing to report. Run the check
          again from the beginning.
        </Body>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <>
          <Button label="Fill in referral" onPress={() => router.push('/screening/referral')} />
          <Button label="Explain this to me" variant="secondary" onPress={() => {}} />
        </>
      }
    >
      <View style={[s.band, { backgroundColor: band.bg }]}>
        <Text style={[s.bandLabel, { color: band.fg }]}>RESULT</Text>
        <Text style={[s.bandTitle, { color: band.fg }]}>{band.title}</Text>
      </View>

      <Body>{band.body}</Body>

      <Card>
        <Text style={s.cardLabel}>WHAT THIS IS NOT</Text>
        <Body muted>
          Reba does not diagnose. It flags eyes that a nurse or doctor should look at. The
          decision is always theirs.
        </Body>
      </Card>

      {draft.analysis ? (
        <Text style={s.meta}>
          Model {draft.analysis.modelVersion} · tuned for sensitivity · borderline cases are
          flagged on purpose
        </Text>
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
  meta: { ...type.body, fontSize: 14, color: color.inkFaint },
});
