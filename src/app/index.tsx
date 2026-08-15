import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Screen } from '../components/reba-kit';
import { useScreening } from '../context/ScreeningContext';
import { LOCALES, LOCALE_NAMES, useLocale, useT } from '../i18n';
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
  const t = useT();
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
      edges={['top', 'bottom']}
      footer={
        <>
          <Button label={t.home.start} onPress={startScreening} />
          <Button
            label={t.home.past}
            variant="secondary"
            onPress={() => router.push('/history')}
          />
          <LanguagePicker />
        </>
      }
    >
      <View style={s.hero}>
        <Text style={s.wordmark}>
          Reba<Text style={s.dot}>.</Text>
        </Text>
        <Text style={s.heroTitle}>{t.home.tagline}</Text>
        <Text style={s.heroBody}>{t.home.blurb}</Text>

        <Image
          source={require('../../assets/images/hero-screening.png')}
          style={s.heroArt}
          resizeMode="contain"
          accessible
          accessibilityLabel={t.home.artAlt}
        />
      </View>

      <View style={s.tally}>
        <Text style={s.tallyNumber}>{count === null ? '—' : count}</Text>
        <Text style={s.tallyLabel}>{t.home.tally(count ?? 0)}</Text>
      </View>
    </Screen>
  );
}

/**
 * Set once at the start of a shift, so it lives under the two real actions
 * rather than competing with them. Each language is written in itself — a
 * Kinyarwanda speaker should not have to read English to find it.
 */
function LanguagePicker() {
  const { locale, setLocale } = useLocale();
  const t = useT();

  return (
    <View style={s.langWrap}>
      <Text style={s.langLabel}>{t.home.language}</Text>
      <View style={s.langRow}>
        {LOCALES.map((code) => {
          const active = code === locale;
          return (
            <Pressable
              key={code}
              onPress={() => setLocale(code)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={LOCALE_NAMES[code].name}
              style={[s.langChip, active && s.langChipOn]}
            >
              <Text style={[s.langChipLabel, active && s.langChipLabelOn]}>
                {LOCALE_NAMES[code].code}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
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
  // Explicit height, not aspectRatio: on react-native-web the <img> keeps its
  // intrinsic height and the ratio is ignored, which blows the hero open to
  // full-screen and pushes the tally off the bottom.
  heroArt: {
    width: '100%',
    height: 172,
    marginTop: space.xs,
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

  langWrap: { gap: space.sm, marginTop: space.xs },
  langLabel: { ...type.label, color: color.inkFaint, textAlign: 'center' },
  langRow: { flexDirection: 'row', gap: space.sm, justifyContent: 'center' },
  langChip: {
    minWidth: 56,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: color.line,
    alignItems: 'center',
  },
  langChipOn: { backgroundColor: color.ink, borderColor: color.ink },
  langChipLabel: { ...type.label, color: color.inkMuted },
  langChipLabelOn: { color: color.onDark },
});
