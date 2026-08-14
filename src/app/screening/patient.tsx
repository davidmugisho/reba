import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Eyebrow, Screen, StepDots, Title } from '../../components/reba-kit';
import { useScreening } from '../../context/ScreeningContext';
import { color, radius, space, TAP, type } from '../../theme';

const SEX_OPTIONS = [
  { value: 'f' as const, label: 'Female' },
  { value: 'm' as const, label: 'Male' },
  { value: 'other' as const, label: 'Other' },
];

export default function Patient() {
  const router = useRouter();
  const { draft, update } = useScreening();
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
    <Screen footer={<Button label="Continue" onPress={next} disabled={!ready} />}>
      <StepDots current={1} total={6} />
      <Eyebrow>Step 2 of 6</Eyebrow>
      <Title>Who are you screening?</Title>

      <Field label="Age in years">
        <TextInput
          style={s.input}
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          placeholder="e.g. 6"
          placeholderTextColor={color.inkFaint}
          maxLength={3}
        />
      </Field>

      <Field label="Sex">
        <View style={s.row}>
          {SEX_OPTIONS.map((option) => (
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

      <Field label="Village">
        <TextInput
          style={s.input}
          value={village}
          onChangeText={setVillage}
          placeholder="Optional"
          placeholderTextColor={color.inkFaint}
        />
      </Field>

      <Field label="Facility code">
        <TextInput
          style={s.input}
          value={facility}
          onChangeText={setFacility}
          autoCapitalize="characters"
          placeholder="Optional"
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
