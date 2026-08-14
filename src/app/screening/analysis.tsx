import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useScreening } from '../../context/ScreeningContext';
import type { RiskLevel } from '../../types/screening';
import { color, space, type } from '../../theme';

/**
 * Day 7 swaps the timeout for real TFLite inference. The threshold is
 * deliberately low: a false positive costs one consultation, a false
 * negative can cost an eye.
 */
const THRESHOLD = 0.35;

function bandFor(score: number): RiskLevel {
  if (score >= 0.6) return 'refer';
  if (score >= THRESHOLD) return 'monitor';
  return 'clear';
}

export default function Analysis() {
  const router = useRouter();
  const { update } = useScreening();

  useEffect(() => {
    const timer = setTimeout(() => {
      const score = 0.72; // placeholder until the model lands
      update({
        analysis: { score, threshold: THRESHOLD, modelVersion: 'stub-0' },
        risk: bandFor(score),
      });
      router.replace('/screening/result');
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={s.wrap}>
      <ActivityIndicator size="large" color={color.accent} />
      <Text style={s.label}>Checking both eyes</Text>
      <Text style={s.sub}>This runs on the phone. Nothing is uploaded.</Text>
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
