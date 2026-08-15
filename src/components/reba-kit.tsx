import { Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { color, radius, space, TAP, type } from '../theme';

/**
 * Page shell. Scrolls, keeps the primary action pinned to the bottom.
 *
 * Only the bottom edge is inset by default, because every screen in the
 * flow sits under a navigator header that has already cleared the status
 * bar. A screen with `headerShown: false` has nothing above it and must
 * ask for the top edge itself, or its first block runs into the clock.
 */
export function Screen({
  children,
  footer,
  edges = ['bottom'],
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  edges?: readonly Edge[];
}) {
  return (
    <SafeAreaView style={s.safe} edges={edges}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      {footer ? <View style={s.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

/** Small uppercase eyebrow. Used to name the step, nothing else. */
export function Eyebrow({ children }: { children: string }) {
  return <Text style={s.eyebrow}>{children.toUpperCase()}</Text>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={s.title}>{children}</Text>;
}

export function Body({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return <Text style={[s.body, muted && { color: color.inkMuted }]}>{children}</Text>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.button,
        isPrimary ? s.buttonPrimary : s.buttonSecondary,
        pressed && { opacity: 0.85 },
        disabled && { opacity: 0.4 },
      ]}
    >
      <Text style={[s.buttonLabel, !isPrimary && { color: color.ink }]}>{label}</Text>
    </Pressable>
  );
}

/** Bordered block used for grouped content. */
export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

/**
 * Step counter. The flow is a real sequence — the CHW cannot skip ahead —
 * so numbering here carries information rather than decorating.
 */
export function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={s.dots}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            s.dot,
            i < current && { backgroundColor: color.ink },
            i === current && { backgroundColor: color.accent, width: 22 },
          ]}
        />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.paper },
  scroll: { flex: 1 },
  scrollContent: { padding: space.lg, paddingBottom: space.xl, gap: space.md },
  footer: {
    padding: space.lg,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: color.line,
    gap: space.sm,
    backgroundColor: color.paper,
  },
  eyebrow: { ...type.label, color: color.accent },
  title: { ...type.title, color: color.ink },
  body: { ...type.body, color: color.ink },
  button: {
    minHeight: TAP,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  buttonPrimary: { backgroundColor: color.ink },
  buttonSecondary: { backgroundColor: color.paper, borderWidth: 1.5, borderColor: color.line },
  buttonLabel: { ...type.heading, color: color.onDark },
  card: {
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.sm,
    backgroundColor: color.paper,
  },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.line },
});
