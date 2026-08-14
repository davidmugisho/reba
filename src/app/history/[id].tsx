import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Body, Card, Screen, Title } from '../../components/reba-kit';
import { getScreening } from '../../storage/screenings';
import type { Screening } from '../../types/screening';
import { color, space, type } from '../../theme';

export default function ScreeningDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Screening | null | undefined>(undefined);

  useEffect(() => {
    if (id) getScreening(id).then(setItem);
  }, [id]);

  if (item === undefined) return <Screen><Body muted>Loading…</Body></Screen>;
  if (item === null) return <Screen><Title>Not found</Title></Screen>;

  return (
    <Screen>
      <Title>{new Date(item.createdAt).toLocaleString()}</Title>
      <Card>
        <Row label="Age" value={item.patient.ageYears ? `${item.patient.ageYears} years` : '—'} />
        <Row label="Village" value={item.patient.village || '—'} />
        <Row label="Facility" value={item.patient.facilityCode || '—'} />
        <Row
          label="Acuity"
          value={item.acuity.right ? `R 6/${item.acuity.right} · L 6/${item.acuity.left}` : '—'}
        />
        <Row label="Outcome" value={item.risk ?? '—'} />
      </Card>
      {item.notes ? (
        <>
          <Text style={s.label}>NOTES</Text>
          <Body>{item.notes}</Body>
        </>
      ) : null}
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
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: space.md },
  rowLabel: { ...type.label, color: color.inkMuted },
  rowValue: { ...type.body, fontWeight: '600', color: color.ink },
  label: { ...type.label, color: color.inkMuted, marginTop: space.sm },
});
