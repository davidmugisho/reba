/**
 * Reba design tokens.
 *
 * Two constraints drive every choice here:
 *  1. The app is used outdoors, in sunlight, on cheap Android screens.
 *     High luminance and high contrast are functional, not decorative.
 *  2. It is used one-handed, next to a patient's face. Targets are large.
 *
 * One rule holds the palette together: colour means status, and nothing
 * else. Chrome, type and controls are navy, sky blue and white. The only
 * saturated colour anywhere in the app is the result band. A health worker
 * who is tired and outdoors does not read carefully — but they see a red
 * block.
 *
 * The sky blue is taken from the Rwandan flag, not from the default
 * medical palette, because this is built for Rwandan health workers first.
 */

export const color = {
  // Surfaces
  paper: '#FFFFFF',
  raised: '#F2F9FD',
  tint: '#E4F3FB',
  line: '#D5E2ED',

  // Ink — deep navy. Clinical without going cold.
  ink: '#07203C',
  inkMid: '#0E3A63',
  inkMuted: '#5B738C',
  inkFaint: '#93A7BA',

  // Accent — Rwanda's sky blue. Active states and step markers only.
  accent: '#00A1DE',
  accentSoft: '#E4F3FB',

  // Status. The only saturated colour in the app.
  // Note there is no green: Reba never clears anyone as healthy.
  clear: '#0E7C6B',
  clearSoft: '#E3F2EF',
  monitor: '#B06A0B',
  monitorSoft: '#FDF0DE',
  refer: '#BE2A2A',
  referSoft: '#FBE9E9',

  onDark: '#FFFFFF',
  onDarkMuted: '#A9C6DE',
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
} as const;

/**
 * Deliberately few sizes, deliberately heavy at the top. A CHW reading this
 * at arm's length in the sun needs weight, not nuance. Nothing drops below
 * 13px anywhere in the app.
 */
export const type = {
  display: { fontSize: 34, lineHeight: 38, fontWeight: '700' as const, letterSpacing: -0.5 },
  title: { fontSize: 26, lineHeight: 31, fontWeight: '700' as const, letterSpacing: -0.4 },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  label: { fontSize: 13, lineHeight: 16, fontWeight: '700' as const, letterSpacing: 1 },
};

/** Minimum touch target. Do not go below this anywhere. */
export const TAP = 56;
