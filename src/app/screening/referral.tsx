import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Body, Button, Card, Eyebrow, Screen, Title } from '../../components/reba-kit';
import { useScreening } from '../../context/ScreeningContext';
import { saveScreening } from '../../storage/screenings';
import { color, radius, space, type } from '../../theme';

export default function Referral() {
  const router = useRouter();
  const { draft, update, reset } = useScreening();
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function finish() {
    setSaving(true);
    const record = { ...draft, notes: notes.trim(), referred: draft.risk === 'refer' };
    update(record);
    await saveScreening(record);
    reset();
    router.dismissAll();
    router.replace('/');
  }

  return (
    <Screen
      footer={
        <Button label={saving ? 'Saving…' : 'Save and finish'} onPress={finish} disabled={saving} />
      }
    >
      <Eyebrow>Step 6 of 6</Eyebrow>
      <Title>Referral slip</Title>
      <Body muted>Show this to the family, or copy it onto the paper form.</Body>

      <Card style={s.slip}>
        <Row label="Age" value={draft.patient.ageYears ? `${draft.patient.ageYears} years` : '—'} />
        <Row label="Village" value={draft.patient.village || '—'} />
        <Row label="Facility" value={draft.patient.facilityCode || '—'} />
        <Row
          label="Acuity"
          value={draft.acuity.right ? `R 6/${draft.acuity.right} · L 6/${draft.acuity.left}` : '—'}
        />
        <Row label="Outcome" value={draft.risk === 'refer' ? 'Refer now' : 'Recheck'} />
      </Card>

      <Text style={s.fieldLabel}>NOTES</Text>
      <TextInput
        style={s.notes}
        value={notes}
        onChangeText={setNotes}
        multiline
        placeholder="Anything the clinic should know"
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
