import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Screen, Title } from '../../components/reba-kit';
import { useT } from '../../i18n';
import { listScreenings } from '../../storage/screenings';
import type { RiskLevel, Screening } from '../../types/screening';
import { color, radius, space, type } from '../../theme';

const BAND_COLOR: Record<RiskLevel, string> = {
  clear: color.clear,
  monitor: color.monitor,
  refer: color.refer,
};

export default function History() {
  const router = useRouter();
  const t = useT();
  const bandLabel: Record<RiskLevel, string> = {
    clear: t.history.bandClear,
    monitor: t.history.bandMonitor,
    refer: t.history.bandRefer,
  };
  const [items, setItems] = useState<Screening[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      listScreenings().then(setItems);
    }, []),
  );

  if (items === null) return <Screen><Body muted>{t.common.loading}</Body></Screen>;

  if (items.length === 0) {
    return (
      <Screen>
        <Title>{t.history.emptyTitle}</Title>
        <Body muted>{t.history.emptyBody}</Body>
      </Screen>
    );
  }

  return (
    <Screen>
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => router.push(`/history/${item.id}`)}
          style={({ pressed }) => [s.row, pressed && { backgroundColor: color.raised }]}
        >
          <View style={s.rowMain}>
            <Text style={s.rowTitle}>
              {item.patient.ageYears ? t.history.years(item.patient.ageYears) : t.history.noAge}
              {item.patient.village ? ` · ${item.patient.village}` : ''}
            </Text>
            <Text style={s.rowDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          {item.risk ? (
            <View style={[s.tag, { borderColor: BAND_COLOR[item.risk] }]}>
              <Text style={[s.tagLabel, { color: BAND_COLOR[item.risk] }]}>
                {bandLabel[item.risk]}
              </Text>
            </View>
          ) : null}
        </Pressable>
      ))}
    </Screen>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.md,
    borderBottomWidth: 1,
    borderBottomColor: color.line,
  },
  rowMain: { flex: 1, gap: 2 },
  rowTitle: { ...type.body, fontWeight: '600', color: color.ink },
  rowDate: { ...type.body, fontSize: 13, color: color.inkMuted },
  tag: { borderWidth: 1.5, borderRadius: radius.sm, paddingHorizontal: space.sm, paddingVertical: 4 },
  tagLabel: { ...type.label },
});
