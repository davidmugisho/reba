import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useScreening } from '../../context/ScreeningContext';
import { useT } from '../../i18n';
import { triageFromAcuity } from '../../triage';
import { color, space, type } from '../../theme';

/**
 * Decides the band.
 *
 * Until the on-device model lands, the only real signal Reba has is the
 * acuity measured at step 3, so that is what decides this — see src/triage.ts.
 * The photos are taken and kept, but nothing reads them yet, and the result
 * screen says so rather than implying a model looked.
 *
 * Day 7 adds TFLite inference over the captures and folds its score in
 * alongside the acuity.
 */
export default function Analysis() {
  const router = useRouter();
  const { draft, update } = useScreening();
  const t = useT();

  useEffect(() => {
    // The acuity is final by the time this screen mounts; the pause is a
    // transition, not a computation pretending to take time.
    const timer = setTimeout(() => {
      const triage = triageFromAcuity(draft.acuity);
      // No measurement means no band. The result screen shows an empty state
      // rather than inventing one.
      update({ risk: triage?.risk ?? null, triage: triage ?? null });
      router.replace('/screening/result');
    }, 900);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={s.wrap}>
      <ActivityIndicator size="large" color={color.accent} />
      <Text style={s.label}>{t.analysis.title}</Text>
      <Text style={s.sub}>{t.analysis.sub}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.md,
    padding: space.xl,
    backgroundColor: color.paper,
  },
  label: { ...type.heading, color: color.ink },
  sub: { ...type.body, color: color.inkMuted, textAlign: 'center' },
});
