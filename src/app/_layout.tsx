import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScreeningProvider } from '../context/ScreeningContext';
import { LocaleProvider, useT } from '../i18n';
import { color, type } from '../theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LocaleProvider>
        <ScreeningProvider>
          <StatusBar style="dark" />
          <RootStack />
        </ScreeningProvider>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}

/**
 * Split out so it sits inside LocaleProvider: header titles are strings like
 * any other, and they have to follow the language picker.
 */
function RootStack() {
  const t = useT();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: color.paper },
        headerTitleStyle: { ...type.heading, color: color.ink },
        headerTintColor: color.ink,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: color.paper },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="screening" options={{ headerShown: false }} />
      <Stack.Screen name="history/index" options={{ title: t.nav.screenings }} />
      <Stack.Screen name="history/[id]" options={{ title: t.nav.screening }} />
    </Stack>
  );
}
