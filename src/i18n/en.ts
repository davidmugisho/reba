import type { TriageReason } from '../types/screening';

/**
 * English is the source language. Every other locale is typed against this
 * object, so a missing or misspelt key is a compile error rather than a blank
 * label in front of a patient.
 *
 * Values that vary with data are functions, not template strings assembled at
 * the call site — word order moves between languages and a sentence glued
 * together from fragments cannot follow it.
 */
export const en = {
  code: 'EN',
  /** Written in the language itself, so a speaker can find it without reading English. */
  name: 'English',

  nav: {
    consent: 'Consent',
    patient: 'Patient',
    acuity: 'Visual acuity',
    capture: 'Eye capture',
    analysing: 'Analysing',
    result: 'Result',
    referral: 'Referral',
    screenings: 'Screenings',
    screening: 'Screening',
    back: 'Back',
  },

  common: {
    continue: 'Continue',
    optional: 'Optional',
    loading: 'Loading…',
    notes: 'NOTES',
    none: '—',
  },

  home: {
    tagline: 'Vision screening that works without a signal.',
    blurb:
      'A guided check for signs of avoidable sight loss. Five minutes, no internet, nothing leaves this phone.',
    tally: (n: number): string =>
      n === 1 ? 'screening on this device' : 'screenings on this device',
    start: 'Start a screening',
    past: 'Past screenings',
    language: 'LANGUAGE',
    artAlt: "A health worker holding a phone up to a patient's eye",
  },

  consent: {
    step: 'Step 1 of 6',
    title: 'Read this to the patient',
    lead: 'Use their own words if it helps. Wait for a clear yes.',
    points: [
      'This check looks for signs that the eyes need a closer look by a nurse or doctor.',
      'It is not a diagnosis. Nothing here replaces a clinic visit.',
      'Two photos of the eyes are taken. They stay on this phone.',
      'You can stop at any point.',
    ],
    agreed: 'The patient, or their guardian, agreed out loud.',
  },

  patient: {
    step: 'Step 2 of 6',
    title: 'Who are you screening?',
    age: 'Age in years',
    agePlaceholder: 'e.g. 6',
    sex: 'Sex',
    female: 'Female',
    male: 'Male',
    other: 'Other',
    village: 'Village',
    referTo: 'Refer to',
    referToPlaceholder: 'Clinic or health centre',
  },

  acuity: {
    step: 'Step 3 of 6',

    calibrateTitle: 'Match a bank card',
    calibrateLead:
      'Hold any bank or ID card flat against the screen and adjust the outline until it is exactly the width of the card. Every screen is a different size, and this is what makes the letters the right size on this one.',
    narrower: 'Narrower',
    wider: 'Wider',
    calibrateDone: 'The card matches',

    title: 'Which way do the legs point?',
    coverLeft: 'Cover the LEFT eye. Stand the patient three metres away and ask them to point.',
    coverRight: 'Now cover the RIGHT eye. Ask again.',
    rightEye: 'Right eye',
    leftEye: 'Left eye',
    lineOf: (d: number): string => `Line 6/${d}`,
    cannotSee: 'Cannot see it',
    up: 'Up',
    down: 'Down',
    left: 'Left',
    right: 'Right',

    resultTitle: 'Acuity measured',
    redo: 'Test this eye again',
    next: 'Continue to eye capture',
    /** One eye's reading, for the slip and the saved record. */
    eyeReading: (denominator: number | null, belowChart: boolean): string =>
      belowChart ? 'worse than 6/60' : denominator !== null ? `6/${denominator}` : '—',
  },

  capture: {
    step: 'Step 4 of 6',
    titleRight: 'Capture the right eye',
    titleLeft: 'Capture the left eye',
    bothDone: 'Both eyes captured',
    lead: 'Darken the room if you can. Hold the phone one metre away, flash on, and fill the ring with the eye.',
    rightEye: 'Right eye',
    leftEye: 'Left eye',
    captureRight: 'Capture right eye',
    captureLeft: 'Capture left eye',
    analyse: 'Analyse',
    permissionTitle: 'Reba needs the camera',
    permissionBody:
      'Two photos of the eyes are taken. They stay on this phone and nothing is uploaded.',
    permissionGrant: 'Allow the camera',
    permissionDenied:
      'The camera is blocked for Reba. Open the phone settings, allow the camera, then come back to this screen.',
    retake: 'Take it again',
    saveFailed: 'That photo could not be saved to this phone. Take it again.',
  },

  analysis: {
    title: 'Checking both eyes',
    sub: 'This runs on the phone. Nothing is uploaded.',
  },

  result: {
    label: 'RESULT',
    clearTitle: 'No signs today',
    clearBody:
      'Nothing was picked up in this check. That is not the same as healthy eyes. Come back if vision changes, if one eye turns, or if the pupil ever looks white in a photo.',
    monitorTitle: 'Check again in 3 months',
    monitorBody:
      'Something was borderline. Not urgent, but it should not be forgotten. Book a repeat check and tell the family what to watch for.',
    referTitle: 'Refer to an eye clinic',
    referBody:
      'A sign was picked up that needs a clinician to look properly. Refer now, not later. Early treatment is what saves sight.',
    notLabel: 'WHAT THIS IS NOT',
    notBody:
      'Reba does not diagnose. It flags eyes that a nurse or doctor should look at. The decision is always theirs.',
    fillReferral: 'Fill in referral',
    explain: 'Explain this to me',
    /** What decided the band. It must never imply the photos were read. */
    basis:
      'Decided by the acuity measured today. The photos are kept on this phone but nothing reads them yet.',
    reason: (r: TriageReason): string =>
      ({
        belowChart: 'One eye could not read even the largest line.',
        poorAcuity: 'Acuity is 6/18 or worse in at least one eye.',
        eyesDiffer: 'The two eyes are two lines apart or more.',
        borderlineAcuity: 'Acuity is borderline in at least one eye.',
        noSignsOnAcuity: 'The acuity test picked nothing up.',
      })[r],
    noneTitle: 'No result to show',
    noneBody:
      'This screening is not in progress any more, so there is nothing to report. Run the check again from the beginning.',
    backToStart: 'Back to start',
  },

  referral: {
    step: 'Step 6 of 6',
    title: 'Referral slip',
    lead: 'Show this to the family, or copy it onto the paper form.',
    age: 'Age',
    village: 'Village',
    referTo: 'Refer to',
    acuity: 'Acuity',
    outcome: 'Outcome',
    referNow: 'Refer now',
    recheck: 'Recheck',
    notesPlaceholder: 'Anything the clinic should know',
    save: 'Save and finish',
    saving: 'Saving…',
    retry: 'Try saving again',
    failed:
      'Not saved. Copy this slip onto the paper form before the patient leaves, then try again.',
  },

  history: {
    emptyTitle: 'No screenings yet',
    emptyBody: 'Screenings you complete are saved here, on this phone only.',
    years: (n: number): string => `${n} years`,
    noAge: 'Age not recorded',
    bandClear: 'No signs',
    bandMonitor: 'Recheck',
    bandRefer: 'Referred',
    notFound: 'Not found',
  },
};

export type Strings = typeof en;
