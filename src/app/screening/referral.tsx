import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Body, Button, Card, Eyebrow, Screen, Title } from '../../components/reba-kit';
import { useScreening } from '../../context/ScreeningContext';
import { useT } from '../../i18n';
import { saveScreening } from '../../storage/screenings';
import { color, radius, space, type } from '../../theme';

export default function Referral() {
  const router = useRouter();
  const { draft, reset } = useScreening();
  const t = useT();
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  async function finish() {
    setSaving(true);
    setFailed(false);
    const record = { ...draft, notes: notes.trim(), referred: draft.risk === 'refer' };

    try {
      await saveScreening(record);
    } catch (cause) {
      // The draft is left intact so the button is a real retry, and the slip
      // stays on screen to be copied onto paper.
      console.warn('[reba] could not save screening', cause);
      setFailed(true);
      setSaving(false);
      return;
    }

    reset();
    router.replace('/');
  }

  return (
    <Screen
      footer={
        <>
          {failed ? <Text style={s.failure}>{t.referral.failed}</Text> : null}
          <Button
            label={saving ? t.referral.saving : failed ? t.referral.retry : t.referral.save}
            onPress={finish}
            disabled={saving}
          />
        </>
      }
    >
      <Eyebrow>{t.referral.step}</Eyebrow>
      <Title>{t.referral.title}</Title>
      <Body muted>{t.referral.lead}</Body>

      <Card style={s.slip}>
        <Row
          label={t.referral.age}
          value={
            draft.patient.ageYears
              ? t.history.years(draft.patient.ageYears)
              : t.common.none
          }
        />
        <Row label={t.referral.village} value={draft.patient.village || t.common.none} />
        <Row label={t.referral.referTo} value={draft.patient.facilityCode || t.common.none} />
        <Row
          label={t.referral.acuity}
          value={
            draft.acuity.right
              ? `R 6/${draft.acuity.right} · L 6/${draft.acuity.left}`
              : t.common.none
          }
        />
        <Row
          label={t.referral.outcome}
          value={draft.risk === 'refer' ? t.referral.referNow : t.referral.recheck}
        />
      </Card>

      <Text style={s.fieldLabel}>{t.common.notes}</Text>
      <TextInput
        style={s.notes}
        value={notes}
        onChangeText={setNotes}
        multiline
        placeholder={t.referral.notesPlaceholder}
        placeholderTextColor={color.inkFaint}
      />
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  failure: {
    ...type.body,
    color: color.refer,
    fontWeight: '600',
    borderWidth: 1.5,
    borderColor: color.refer,
    borderRadius: radius.md,
    padding: space.md,
  },
  slip: { backgroundColor: color.raised, gap: space.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: space.md },
  rowLabel: { ...type.label, color: color.inkMuted },
  rowValue: { ...type.body, fontWeight: '600', color: color.ink, flexShrink: 1, textAlign: 'right' },
  fieldLabel: { ...type.label, color: color.inkMuted, marginTop: space.sm },
  notes: {
    minHeight: 110,
    borderWidth: 1.5,
    borderColor: color.line,
    borderRadius: radius.md,
    padding: space.md,
    textAlignVertical: 'top',
    ...type.body,
    color: color.ink,
  },
});
