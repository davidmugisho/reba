import { bothEyesLine } from './acuity';
import type { Screening } from './types/screening';

/**
 * Turning saved screenings into a file a health centre can read.
 *
 * Kept pure and separate from the sharing so the escaping can be tested. A CSV
 * that corrupts on the first village name containing a comma is worse than no
 * export: it arrives looking complete and is quietly wrong.
 *
 * Photos are deliberately not in here. They are the most identifying thing the
 * app holds, a spreadsheet is no place for them, and the moment a file leaves
 * the phone it can be forwarded anywhere. Whoever needs to see an eye opens the
 * record on the device.
 */

export const EXPORT_COLUMNS = [
  'date',
  'time',
  'age_years',
  'sex',
  'village',
  'refer_to',
  'acuity_right',
  'acuity_left',
  'outcome',
  'reason',
  'notes',
] as const;

/**
 * RFC 4180: wrap in quotes when the value contains a comma, a quote or a line
 * break, and double any quote inside.
 */
export function csvCell(value: string): string {
  if (!/[",\r\n]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

const plainAcuity = (denominator: number | null, belowChart: boolean): string =>
  belowChart ? 'worse than 6/60' : denominator === null ? '' : `6/${denominator}`;

/**
 * One row per screening, newest first, with a header.
 *
 * `describeReason` comes from the caller so the file is written in whichever
 * language the health worker is using.
 */
export function toCsv(
  screenings: Screening[],
  describeReason: (reason: NonNullable<Screening['triage']>['reason']) => string,
): string {
  const rows = screenings.map((s) => {
    const at = new Date(s.createdAt);
    return [
      at.toISOString().slice(0, 10),
      at.toISOString().slice(11, 16),
      s.patient.ageYears === null ? '' : String(s.patient.ageYears),
      s.patient.sex ?? '',
      s.patient.village,
      s.patient.facilityCode,
      plainAcuity(s.acuity.right, s.acuity.rightBelowChart ?? false),
      plainAcuity(s.acuity.left, s.acuity.leftBelowChart ?? false),
      s.risk ?? '',
      s.triage ? describeReason(s.triage.reason) : '',
      s.notes,
    ].map(csvCell);
  });

  return [EXPORT_COLUMNS.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/** Stable, sortable, and says what it is when it lands in someone's inbox. */
export function exportFileName(now: Date): string {
  return `reba-screenings-${now.toISOString().slice(0, 10)}.csv`;
}

/** How the acuity reads on the slip, reused so the file matches the app. */
export { bothEyesLine };
