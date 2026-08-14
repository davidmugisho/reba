import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Screen } from '../components/reba-kit';
import { useScreening } from '../context/ScreeningContext';
import { listScreenings } from '../storage/screenings';
import { color, radius, space, type } from '../theme';

/**
 * The first thing anyone sees — a health worker at the start of a shift,
 * and the panel watching the demo video. The navy block does the
 * introducing so the rest of the app can stay plain white.
 */
export default function Home() {
  const router = useRouter();
  const { reset } = useScreening();
  const [count, setCount] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      listScreenings().then((all) => setCount(all.length));
    }, []),
  );

  function startScreening() {
    reset();
    router.push('/screening/consent');
  }

  return (
    <Screen
      footer={
        <>
          <Button label="Start a screening" onPress={startScreening} />
          <Button
            label="Past screenings"
            variant="secondary"
            onPress={() => router.push('/history')}
          />
        </>
      }
    >
      <View style={s.hero}>
        <Text style={s.wordmark}>
          Reba<Text style={s.dot}>.</Text>
        </Text>
        <Text style={s.heroTitle}>Vision screening that works without a signal.</Text>
        <Text style={s.heroBody}>
          A guided check for signs of avoidable sight loss. Five minutes, no internet, nothing
          leaves this phone.
        </Text>
      </View>

      <View style={s.tally}>
        <Text style={s.tallyNumber}>{count === null ? '—' : count}</Text>
        <Text style={s.tallyLabel}>
          {count === 1 ? 'screening on this device' : 'screenings on this device'}
        </Text>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: {
    backgroundColor: color.ink,
    borderRadius: radius.lg,
    padding: space.lg,
    paddingBottom: space.lg + space.xs,
    gap: space.sm + 2,
    marginTop: space.sm,
  },
  wordmark: {
    ...type.display,
    fontSize: 42,
    lineHeight: 44,
    color: color.onDark,
    letterSpacing: -1.4,
  },
  dot: { color: color.accent },
  heroTitle: {
    ...type.heading,
    fontSize: 21,
    lineHeight: 27,
    color: color.onDark,
    letterSpacing: -0.2,
  },
  heroBody: {
    ...type.body,
    fontSize: 15,
    lineHeight: 23,
    color: color.onDarkMuted,
  },
  tally: {
    marginTop: space.sm,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: color.line,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space.sm + 2,
  },
  tallyNumber: { ...type.title, fontSize: 28, color: color.ink },
  tallyLabel: { ...type.body, color: color.inkMuted },
});
