import { Stack } from 'expo-router';
import { color, type } from '../../theme';

/**
 * The screening flow is linear on purpose. Each step is a screen so a CHW
 * can be interrupted — a crying child, a queue — and come back without
 * losing the thread.
 */
export default function ScreeningLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: color.paper },
        headerTitleStyle: { ...type.heading, color: color.ink },
        headerTintColor: color.ink,
        headerShadowVisible: false,
        headerBackTitle: 'Back',
        contentStyle: { backgroundColor: color.paper },
      }}
    >
      <Stack.Screen name="consent" options={{ title: 'Consent' }} />
      <Stack.Screen name="patient" options={{ title: 'Patient' }} />
      <Stack.Screen name="acuity" options={{ title: 'Visual acuity' }} />
      <Stack.Screen name="capture" options={{ title: 'Eye capture' }} />
      <Stack.Screen name="analysis" options={{ title: 'Analysing', headerBackVisible: false }} />
      <Stack.Screen name="result" options={{ title: 'Result', headerBackVisible: false }} />
      <Stack.Screen name="referral" options={{ title: 'Referral' }} />
    </Stack>
  );
}
