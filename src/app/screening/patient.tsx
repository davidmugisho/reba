import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Eyebrow, Screen, StepDots, Title } from '../../components/reba-kit';
import { useScreening } from '../../context/ScreeningContext';
import { useT } from '../../i18n';
import { color, radius, space, TAP, type } from '../../theme';

export default function Patient() {
  const router = useRouter();
  const { draft, update } = useScreening();
  const t = useT();
  const sexOptions = [
    { value: 'f' as const, label: t.patient.female },
    { value: 'm' as const, label: t.patient.male },
    { value: 'other' as const, label: t.patient.other },
  ];
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'f' | 'm' | 'other' | null>(null);
  const [village, setVillage] = useState('');
  const [facility, setFacility] = useState('');

  const ready = age.trim().length > 0 && sex !== null;

  function next() {
    update({
      patient: {
        ...draft.patient,
        ageYears: Number(age) || null,
        sex,
        village: village.trim(),
        facilityCode: facility.trim(),
      },
    });
    router.push('/screening/acuity');
  }

  return (
    <Screen footer={<Button label={t.common.continue} onPress={next} disabled={!ready} />}>
      <StepDots current={1} total={6} />
      <Eyebrow>{t.patient.step}</Eyebrow>
      <Title>{t.patient.title}</Title>

      <Field label={t.patient.age}>
        <TextInput
          style={s.input}
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          placeholder={t.patient.agePlaceholder}
          placeholderTextColor={color.inkFaint}
          maxLength={3}
        />
      </Field>

      <Field label={t.patient.sex}>
        <View style={s.row}>
          {sexOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setSex(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: sex === option.value }}
              style={[s.chip, sex === option.value && s.chipOn]}
            >
              <Text style={[s.chipLabel, sex === option.value && s.chipLabelOn]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Field>

      <Field label={t.patient.village}>
        <TextInput
          style={s.input}
          value={village}
          onChangeText={setVillage}
          placeholder={t.common.optional}
          placeholderTextColor={color.inkFaint}
        />
      </Field>

      <Field label={t.patient.referTo}>
        <TextInput
          style={s.input}
          value={facility}
          onChangeText={setFacility}
          placeholder={t.patient.referToPlaceholder}
          placeholderTextColor={color.inkFaint}
        />
      </Field>
    </Screen>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label.toUpperCase()}</Text>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  field: { gap: space.sm },
  fieldLabel: { ...type.label, color: color.inkMuted },
  input: {
    minHeight: TAP,
    borderWidth: 1.5,
    borderColor: color.line,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    ...type.body,
    color: color.ink,
  },
  row: { flexDirection: 'row', gap: space.sm },
  chip: {
    flex: 1,
    minHeight: TAP,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: { backgroundColor: color.ink, borderColor: color.ink },
  chipLabel: { ...type.body, color: color.ink, fontWeight: '600' },
  chipLabelOn: { color: color.onDark },
});
