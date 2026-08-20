import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Body, Card, Screen, Title } from '../../components/reba-kit';
import { bothEyesLine } from '../../acuity';
import { useT } from '../../i18n';
import { getScreening } from '../../storage/screenings';
import type { RiskLevel, Screening } from '../../types/screening';
import { color, space, type } from '../../theme';

export default function ScreeningDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const outcome: Record<RiskLevel, string> = {
    clear: t.history.bandClear,
    monitor: t.history.bandMonitor,
    refer: t.history.bandRefer,
  };
  const [item, setItem] = useState<Screening | null | undefined>(undefined);

  useEffect(() => {
    if (id) getScreening(id).then(setItem);
  }, [id]);

  if (item === undefined) return <Screen><Body muted>{t.common.loading}</Body></Screen>;
  if (item === null) return <Screen><Title>{t.history.notFound}</Title></Screen>;

  return (
    <Screen>
      <Title>{new Date(item.createdAt).toLocaleString()}</Title>
      <Card>
        <Row
          label={t.referral.age}
          value={item.patient.ageYears ? t.history.years(item.patient.ageYears) : t.common.none}
        />
        <Row label={t.referral.village} value={item.patient.village || t.common.none} />
        <Row label={t.referral.referTo} value={item.patient.facilityCode || t.common.none} />
        <Row
          label={t.referral.acuity}
          value={bothEyesLine(item.acuity, t.acuity.eyeReading, t.common.none)}
        />
        <Row
          label={t.referral.outcome}
          value={item.risk ? outcome[item.risk] : t.common.none}
        />
      </Card>
      {item.notes ? (
        <>
          <Text style={s.label}>{t.common.notes}</Text>
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
