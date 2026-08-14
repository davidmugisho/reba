export type RiskLevel = 'clear' | 'monitor' | 'refer';

export type Eye = 'left' | 'right';

export interface PatientInfo {
  ageYears: number | null;
  sex: 'f' | 'm' | 'other' | null;
  village: string;
  facilityCode: string;
}

export interface AcuityResult {
  /** Denominator of the 6/x notation. 12 means 6/12. */
  left: number | null;
  right: number | null;
  /** Screen calibration, px per mm, from the card-on-screen step. */
  pxPerMm: number | null;
}

export interface EyeCapture {
  eye: Eye;
  uri: string;
  capturedAt: string;
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
