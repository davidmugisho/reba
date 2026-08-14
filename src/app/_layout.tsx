import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScreeningProvider } from '../context/ScreeningContext';
import { color, type } from '../theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ScreeningProvider>
        <StatusBar style="dark" />
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
          <Stack.Screen name="history/index" options={{ title: 'Screenings' }} />
          <Stack.Screen name="history/[id]" options={{ title: 'Screening' }} />
        </Stack>
      </ScreeningProvider>
    </SafeAreaProvider>
  );
}
