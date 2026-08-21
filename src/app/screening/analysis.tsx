import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useScreening } from '../../context/ScreeningContext';
import { useT } from '../../i18n';
import { readReflex } from '../../photoReflex';
import { triageScreening } from '../../triage';
import { color, space, type } from '../../theme';

/**
 * Decides the band.
 *
 * Two real signals, both measured on this phone: the acuity from step 3, and
 * the red reflex read out of the two photographs — see src/triage.ts and
 * src/reflex.ts. There is still no model; this is arithmetic, and the result
 * screen says as much rather than implying one looked.
 *
 * The photo check may only raise the band, never lower it, because its
 * thresholds have not yet met a real eye.
 */
export default function Analysis() {
  const router = useRouter();
  const { draft, update } = useScreening();
  const t = useT();

  useEffect(() => {
    let cancelled = false;

    // Reading two shrunken photographs is quick, but it is real work, so the
    // screen waits for it rather than moving on and patching the band later.
    (async () => {
      const reflex = await readReflex(draft.captures);
      if (cancelled) return;

      const triage = triageScreening(draft.acuity, reflex);
      // No measurement means no band. The result screen shows an empty state
      // rather than inventing one.
      update({ reflex, risk: triage?.risk ?? null, triage: triage ?? null });
      router.replace('/screening/result');
    })();

    return () => {
      cancelled = true;
    };
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
