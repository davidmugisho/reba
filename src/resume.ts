import type { Screening } from './types/screening';

/**
 * Where an unfinished screening should pick up.
 *
 * Derived from what the record actually holds rather than from a stored step
 * number: the data is the truth, and a step counter written at the wrong
 * moment would drop a health worker back into a screen they had finished.
 */
/** Typed so it satisfies expo-router's generated route union. */
export type ResumeRoute =
  | '/screening/consent'
  | '/screening/patient'
  | '/screening/acuity'
  | '/screening/capture'
  | '/screening/analysis'
  | '/screening/result';

export function resumeRoute(draft: Screening): ResumeRoute {
  if (!draft.consentGiven) return '/screening/consent';
  if (draft.patient.ageYears === null || draft.patient.sex === null) return '/screening/patient';

  const acuityMeasured =
    draft.acuity.right !== null ||
    draft.acuity.left !== null ||
    draft.acuity.rightBelowChart === true ||
    draft.acuity.leftBelowChart === true;
  if (!acuityMeasured) return '/screening/acuity';

  const eyes = draft.captures.map((c) => c.eye);
  if (!eyes.includes('right') || !eyes.includes('left')) return '/screening/capture';

  // Photos are in but no band yet — let the analysis step decide it.
  if (!draft.risk) return '/screening/analysis';

  return '/screening/result';
}
