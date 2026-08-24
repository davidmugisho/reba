import { useRouter } from 'expo-router';
import { resumeRoute } from '../resume';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { FadeIn } from '../components/fade-in';
import { Body, Button, Card, Screen } from '../components/reba-kit';
import { useActiveScreeningIds, useScreening } from '../context/ScreeningContext';
import { LOCALES, LOCALE_NAMES, useLocale, useT, type Locale } from '../i18n';
import { sweepOrphanPhotos } from '../storage/photos';
import { listScreenings } from '../storage/screenings';
import { color, radius, space, TAP, type } from '../theme';

/**
 * The first thing anyone sees — a health worker at the start of a shift,
 * and the panel watching the demo video. The navy block does the
 * introducing so the rest of the app can stay plain white.
 */
export default function Home() {
  const router = useRouter();
  const { reset, pending, resume, discardPending } = useScreening();
  // The screening in progress owns photos too. Sparing it is what keeps the
  // sweep below from deleting the pictures out from under a live screening.
  const activeIds = useActiveScreeningIds();
  const t = useT();
  const [count, setCount] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      listScreenings().then((all) => {
        setCount(all.length);
        // A screening can be abandoned halfway, and the consent script promises
        // the patient they can stop at any point. Reconciling the photo folders
        // against the records that exist clears anything left behind, without
        // having to catch every way out of the flow.
        sweepOrphanPhotos([...all.map((s) => s.id), ...activeIds]);
      });
    }, [activeIds]),
  );

  function startScreening() {
    // Starting fresh with something unfinished on screen is a choice to drop
    // it, and the card above made that visible.
    if (pending) discardPending();
    reset();
    router.push('/screening/consent');
  }

  function carryOn() {
    const restored = resume();
    if (restored) router.push(resumeRoute(restored));
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

        <FadeIn delay={120}>
          <Image
            source={require('../../assets/images/hero-exam.jpg')}
            style={s.heroArt}
            resizeMode="cover"
            accessible
            accessibilityLabel={t.home.artAlt}
          />
        </FadeIn>
      </View>

      {pending ? (
        <Card style={s.pending}>
          <Text style={s.pendingLabel}>{t.home.unfinishedLabel}</Text>
          <Text style={s.pendingWho}>
            {pending.patient.ageYears
              ? t.history.years(pending.patient.ageYears)
              : t.history.noAge}
            {pending.patient.village ? ` · ${pending.patient.village}` : ''}
          </Text>
          <Body muted>
            {t.home.unfinishedStarted(
              new Date(pending.createdAt).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              }),
            )}
          </Body>
          <View style={s.pendingActions}>
            <View style={s.pendingAction}>
              <Button label={t.home.resume} onPress={carryOn} />
            </View>
            <View style={s.pendingAction}>
              <Button label={t.home.discard} variant="secondary" onPress={discardPending} />
            </View>
          </View>
        </Card>
      ) : null}

      <View style={s.tally}>
        <Text style={s.tallyNumber}>{count === null ? '—' : count}</Text>
        <Text style={s.tallyLabel}>{t.home.tally(count ?? 0)}</Text>
      </View>
    </Screen>
  );
}

/**
 * Flags are drawn assets rather than emoji: flag emoji fall back to bare
 * letters on a lot of cheap Android builds, which is exactly the hardware
 * this runs on.
 */
const FLAGS: Record<Locale, ImageSourcePropType> = {
  rw: require('../../assets/images/flags/rw.png'),
  en: require('../../assets/images/flags/gb.png'),
  fr: require('../../assets/images/flags/fr.png'),
  de: require('../../assets/images/flags/de.png'),
};

/**
 * Set once at the start of a shift, so it sits under the two real actions
 * rather than competing with them. Collapsed to the current language until
 * tapped — four chips side by side read as four choices to make before
 * starting, which is not what this is.
 *
 * Each language is written in itself: a Kinyarwanda speaker should not have
 * to read English to find it.
 */
function LanguagePicker() {
  const { locale, setLocale } = useLocale();
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t.home.language}: ${LOCALE_NAMES[locale].name}`}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [s.langButton, pressed && { backgroundColor: color.raised }]}
      >
        <Image source={FLAGS[locale]} style={s.flag} resizeMode="cover" />
        <Text style={s.langCurrent}>{LOCALE_NAMES[locale].name}</Text>
        <Text style={s.chevron}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        {/* Tapping anywhere off the sheet closes it. */}
        <Pressable style={s.backdrop} onPress={() => setOpen(false)}>
          {/* Swallows taps so choosing inside the sheet does not dismiss it. */}
          <Pressable style={s.sheet} onPress={() => {}}>
            <Text style={s.sheetLabel}>{t.home.language}</Text>
            {LOCALES.map((code) => {
              const active = code === locale;
              return (
                <Pressable
                  key={code}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  onPress={() => {
                    setLocale(code);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    s.option,
                    pressed && { backgroundColor: color.raised },
                  ]}
                >
                  <Image source={FLAGS[code]} style={s.flag} resizeMode="cover" />
                  <Text style={[s.optionLabel, active && s.optionLabelOn]}>
                    {LOCALE_NAMES[code].name}
                  </Text>
                  {active ? <Text style={s.tick}>✓</Text> : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
    fontSize: 34,
    lineHeight: 36,
    color: color.onDark,
    letterSpacing: -1.4,
  },
  dot: { color: color.accent },
  heroTitle: {
    ...type.heading,
    fontSize: 18,
    lineHeight: 24,
    color: color.onDark,
    letterSpacing: -0.2,
  },
  heroBody: {
    ...type.body,
    fontSize: 14,
    lineHeight: 21,
    color: color.onDarkMuted,
  },
  // Explicit height, not aspectRatio: on react-native-web the <img> keeps its
  // intrinsic height and the ratio is ignored, which blows the hero open to
  // full-screen and pushes the tally off the bottom.
  heroArt: {
    width: '100%',
    height: 190,
    marginTop: space.sm,
    borderRadius: radius.md,
    // The photograph is bright and clinical; a rounded edge and a hairline keep
    // it reading as an inset image rather than a hole punched in the navy.
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.inkMid,
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
  pending: {
    marginTop: space.sm,
    gap: space.xs,
    borderColor: color.accent,
    backgroundColor: color.accentSoft,
  },
  pendingLabel: { ...type.label, color: color.accent },
  pendingWho: { ...type.heading, color: color.ink },
  pendingActions: { flexDirection: 'row', gap: space.sm, marginTop: space.sm },
  pendingAction: { flex: 1 },
  tallyNumber: { ...type.title, fontSize: 24, color: color.ink },
  tallyLabel: { ...type.body, color: color.inkMuted },

  // Collapsed control. Deliberately lighter than the two buttons above it.
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    minHeight: TAP,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
  },
  langCurrent: { ...type.body, fontWeight: '600', color: color.inkMuted },
  chevron: { ...type.body, color: color.inkFaint },

  flag: {
    width: 30,
    height: 20,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.line,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(7, 32, 60, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: color.paper,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: space.lg,
    paddingBottom: space.xl,
    gap: space.xs,
  },
  sheetLabel: { ...type.label, color: color.inkMuted, marginBottom: space.xs },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: TAP,
    paddingHorizontal: space.sm,
    borderRadius: radius.md,
  },
  optionLabel: { ...type.body, color: color.ink, flex: 1 },
  optionLabelOn: { fontWeight: '700' },
  tick: { ...type.heading, color: color.accent },
});
