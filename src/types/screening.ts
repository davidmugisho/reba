export type RiskLevel = 'clear' | 'monitor' | 'refer';

export type Eye = 'left' | 'right';

export interface PatientInfo {
  ageYears: number | null;
  sex: 'f' | 'm' | 'other' | null;
  village: string;
  facilityCode: string;
}

export interface AcuityResult {
  /** Denominator of the 6/x notation. 12 means 6/12. Null when not measured. */
  left: number | null;
  right: number | null;
  /**
   * Set when the patient missed even the largest line, which means vision is
   * worse than 6/60 — a finding in itself, and not the same as "not measured".
   *
   * Optional so that records written before the real test still parse.
   */
  leftBelowChart?: boolean;
  rightBelowChart?: boolean;
  /** Screen calibration, px per mm, from the card-on-screen step. */
  pxPerMm: number | null;
}

export interface EyeCapture {
  eye: Eye;
  uri: string;
  capturedAt: string;
}

export type TriageReason =
  /** Missed even the largest line: worse than 6/60. */
  | 'belowChart'
  /** 6/18 or worse in at least one eye. */
  | 'poorAcuity'
  /** Two lines or more between the eyes — the pattern amblyopia makes. */
  | 'eyesDiffer'
  /** 6/12 in at least one eye: not a referral, not nothing. */
  | 'borderlineAcuity'
  /** Nothing in the acuity to act on. Never a clean bill of health. */
  | 'noSignsOnAcuity';

/** Why a screening landed in the band it did, and what that was built from. */
export interface Triage {
  risk: RiskLevel;
  reason: TriageReason;
  basis: 'acuity';
}

export interface AnalysisResult {
  /** Model confidence that a referable sign is present, 0..1. */
  score: number;
  /** Threshold used. Tuned for sensitivity, not accuracy. */
  threshold: number;
  modelVersion: string;
}

export interface Screening {
  id: string;
  createdAt: string;
  consentGiven: boolean;
  patient: PatientInfo;
  acuity: AcuityResult;
  captures: EyeCapture[];
  analysis: AnalysisResult | null;
  risk: RiskLevel | null;
  /**
   * Why the band was chosen. Optional so records written before triage
   * existed still parse.
   */
  triage?: Triage | null;
  referred: boolean;
  notes: string;
}

export function emptyScreening(): Screening {
  return {
    id: `scr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    consentGiven: false,
    patient: { ageYears: null, sex: null, village: '', facilityCode: '' },
    acuity: { left: null, right: null, pxPerMm: null },
    captures: [],
    analysis: null,
    risk: null,
    referred: false,
    notes: '',
  };
}
