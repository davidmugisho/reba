import { Stack } from 'expo-router';
import { useT } from '../../i18n';
import { color, type } from '../../theme';

/**
 * The screening flow is linear on purpose. Each step is a screen so a CHW
 * can be interrupted — a crying child, a queue — and come back without
 * losing the thread.
 */
export default function ScreeningLayout() {
  const t = useT();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: color.paper },
        headerTitleStyle: { ...type.heading, color: color.ink },
        headerTintColor: color.ink,
        headerShadowVisible: false,
        headerBackTitle: t.nav.back,
        contentStyle: { backgroundColor: color.paper },
      }}
    >
      <Stack.Screen name="consent" options={{ title: t.nav.consent }} />
      <Stack.Screen name="patient" options={{ title: t.nav.patient }} />
      <Stack.Screen name="acuity" options={{ title: t.nav.acuity }} />
      <Stack.Screen name="capture" options={{ title: t.nav.capture }} />
      <Stack.Screen
        name="analysis"
        options={{ title: t.nav.analysing, headerBackVisible: false }}
      />
      <Stack.Screen name="result" options={{ title: t.nav.result, headerBackVisible: false }} />
      <Stack.Screen name="referral" options={{ title: t.nav.referral }} />
      <Stack.Screen name="explain" options={{ title: t.nav.explanation }} />
    </Stack>
  );
}
