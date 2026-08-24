import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { FadeIn } from '../../components/fade-in';
import { Body, Button, Card, Screen, Title } from '../../components/reba-kit';
import { useScreening } from '../../context/ScreeningContext';
import { askEjoChat, isConfigured } from '../../ejochat';
import { useLocale, useT } from '../../i18n';
import type { Strings } from '../../i18n/en';
import type { RiskLevel } from '../../types/screening';
import { color, radius, space, TAP, type } from '../../theme';

/**
 * The script a health worker reads to the family.
 *
 * The result screen shouts one line. This is the other half: what that line
 * means, what to do, and what it does not mean. Written to be read aloud, like
 * the consent script, because that is how it will actually be used — a CHW
 * with a phone in one hand explaining to a parent.
 *
 * It also explains the 6/x notation, since that number goes home on the
 * referral slip and means nothing to anyone who has not been taught it.
 */
function pointsFor(risk: RiskLevel, t: Strings): string[] {
  switch (risk) {
    case 'clear':
      return t.explain.clearPoints;
    case 'monitor':
      return t.explain.monitorPoints;
    case 'refer':
      return t.explain.referPoints;
  }
}

export default function Explain() {
  const router = useRouter();
  const { draft } = useScreening();
  const t = useT();

  // Reached only from a result, but a reload can land here with nothing.
  if (!draft.risk) {
    return (
      <Screen footer={<Button label={t.result.backToStart} onPress={() => router.replace('/')} />}>
        <Title>{t.result.noneTitle}</Title>
        <Body muted>{t.result.noneBody}</Body>
      </Screen>
    );
  }

  return (
    <Screen footer={<Button label={t.explain.close} onPress={() => router.back()} />}>
      <Title>{t.explain.title}</Title>
      <Body muted>{t.explain.lead}</Body>

      <Card style={s.script}>
        {pointsFor(draft.risk, t).map((point) => (
          <View key={point} style={s.point}>
            <View style={s.bullet} />
            <Text style={s.pointText}>{point}</Text>
          </View>
        ))}
      </Card>

      {/* Only for a referral. Showing a clinic to someone who is not going to
          one would worry a family for nothing. */}
      {draft.risk === 'refer' ? (
        <FadeIn delay={160}>
          <Text style={s.sectionLabel}>{t.explain.clinicLabel}</Text>
          <Body muted>{t.explain.clinicLead}</Body>
          <Image
            source={require('../../../assets/images/clinic-exam.jpg')}
            style={s.clinic}
            resizeMode="cover"
            accessible
            accessibilityLabel={t.explain.clinicAlt}
          />
        </FadeIn>
      ) : null}

      {isConfigured() ? <AskTheFamily /> : null}

      <Text style={s.sectionLabel}>{t.explain.readingLabel}</Text>
      <Body muted>{t.explain.readingLead}</Body>
      <Card style={s.reading}>
        <Text style={s.readingLine}>
          {t.explain.readingFor(
            t.acuity.rightEye,
            draft.acuity.right,
            draft.acuity.rightBelowChart ?? false,
          )}
        </Text>
        <Text style={s.readingLine}>
          {t.explain.readingFor(
            t.acuity.leftEye,
            draft.acuity.left,
            draft.acuity.leftBelowChart ?? false,
          )}
        </Text>
      </Card>
    </Screen>
  );
}

/**
 * The one part of Reba that needs a signal.
 *
 * A parent asks something the written script does not cover, and the health
 * worker has to answer standing in a courtyard. This puts the question to
 * EjoChat with the screening already decided, and shows what comes back.
 *
 * It sits below the script on purpose. The script is the answer; this is help
 * with the words. When there is no signal the screen loses nothing that
 * matters.
 */
function AskTheFamily() {
  const { draft } = useScreening();
  const { locale } = useLocale();
  const t = useT();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [failed, setFailed] = useState(false);

  async function ask() {
    const asked = question.trim();
    if (!asked || asking) return;

    setAsking(true);
    setFailed(false);
    setAnswer(null);
    try {
      setAnswer(await askEjoChat(asked, draft, locale));
    } catch (cause) {
      console.warn('[reba] EjoChat did not answer', cause);
      setFailed(true);
    } finally {
      setAsking(false);
    }
  }

  return (
    <FadeIn delay={200}>
      <Text style={s.sectionLabel}>{t.explain.askLabel}</Text>
      <Body muted>{t.explain.askLead}</Body>

      <TextInput
        style={s.askInput}
        value={question}
        onChangeText={setQuestion}
        multiline
        placeholder={t.explain.askPlaceholder}
        placeholderTextColor={color.inkFaint}
        editable={!asking}
      />
      <Button label={t.explain.askSend} onPress={ask} disabled={asking || !question.trim()} />

      {asking ? (
        <View style={s.thinking}>
          <ActivityIndicator color={color.accent} />
          <Text style={s.thinkingLabel}>{t.explain.askThinking}</Text>
        </View>
      ) : null}

      {failed ? <Text style={s.askFailed}>{t.explain.askOffline}</Text> : null}

      {answer ? (
        <FadeIn>
          <Card style={s.answer}>
            <Body>{answer}</Body>
            <Text style={s.answerNote}>{t.explain.askDisclaimer}</Text>
          </Card>
        </FadeIn>
      ) : null}
    </FadeIn>
  );
}

const s = StyleSheet.create({
  script: { gap: space.md, backgroundColor: color.raised, borderColor: color.tint },
  point: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.accent,
    marginTop: 8,
  },
  pointText: { ...type.body, color: color.ink, flex: 1 },
  sectionLabel: { ...type.label, color: color.inkMuted, marginTop: space.sm },
  clinic: {
    width: '100%',
    height: 200,
    borderRadius: radius.md,
    marginTop: space.sm,
    backgroundColor: color.raised,
  },

  askInput: {
    minHeight: TAP + 16,
    borderWidth: 1.5,
    borderColor: color.line,
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.sm,
    marginBottom: space.sm,
    textAlignVertical: 'top',
    ...type.body,
    color: color.ink,
  },
  thinking: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.sm },
  thinkingLabel: { ...type.body, color: color.inkMuted },
  askFailed: { ...type.body, color: color.inkMuted, marginTop: space.sm },
  answer: { marginTop: space.sm, gap: space.sm, backgroundColor: color.accentSoft, borderColor: color.tint },
  answerNote: { ...type.body, fontSize: 12, lineHeight: 17, color: color.inkMuted },
  reading: { gap: space.sm, borderRadius: radius.md },
  readingLine: { ...type.body, color: color.ink },
});
