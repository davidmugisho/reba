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
    explanation: 'Explanation',
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
    unfinishedLabel: 'UNFINISHED SCREENING',
    unfinishedStarted: (time: string): string => `Started at ${time}, not saved.`,
    resume: 'Carry on',
    discard: 'Discard',
    artAlt: "An eye specialist examining a young woman's eye",
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

    calibrateTitle: 'Match an ID card',
    calibrateLead:
      'Stand a bank or ID card against the screen, short edge across, and adjust until both sides line up with the outline. Only the width is matched, so the card is taller than the outline.',
    narrower: 'Narrower',
    wider: 'Wider',
    calibrateDone: 'The card matches',
    recalibrate: 'Match the card again',
    tooBigTitle: 'The card was not matched',
    tooBigBody:
      'The letters this calls for are wider than this screen, which means the outline was left too wide for the card. Go back and match it to the short edge of the card exactly. Nothing has been recorded.',

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
      'Decided on this phone, from the acuity measured today and the light the pupils reflected. No model has looked at the photographs.',
    reason: (r: TriageReason): string =>
      ({
        palePupil:
          'One pupil reflected white rather than red in the photograph.',
        reflexDiffers: 'The two pupils reflected the light differently.',
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

  explain: {
    title: 'What this means',
    lead: 'Read this to the patient and the family. Use their own words if it helps.',
    clearPoints: [
      'Today this check found nothing that needs a clinic visit.',
      'That is not the same as healthy eyes. This check cannot see everything.',
      'Come back if vision changes, if one eye starts to turn, or if the pupil ever looks white in a photo.',
    ],
    monitorPoints: [
      'Something was borderline today. It is not urgent.',
      'It should not be forgotten either, so book another check in three months.',
      'Come back sooner if vision gets worse, or if one eye starts to turn.',
    ],
    referPoints: [
      'This check found something a nurse or doctor needs to look at properly.',
      'It is not a diagnosis, and it does not mean sight is being lost. It means someone with the right equipment should look.',
      'Go now rather than later. When something can be treated, treating it early is what saves sight.',
    ],
    readingLabel: 'THE VISION READING',
    readingLead: 'What the numbers on the slip mean.',
    readingFor: (eye: string, denominator: number | null, belowChart: boolean): string =>
      belowChart
        ? `${eye}: could not read even the largest letter.`
        : denominator === null
          ? `${eye}: not measured.`
          : denominator === 6
            ? `${eye}: 6/6, which is normal sight.`
            : `${eye}: sees at 6 metres what clear sight sees at ${denominator}. Written 6/${denominator}.`,
    askLabel: 'IF THE FAMILY ASKS SOMETHING ELSE',
    askLead: 'Type their question. Needs a signal — the script above does not.',
    askPlaceholder: 'What did the family ask?',
    askSend: 'Ask',
    askThinking: 'Finding the words…',
    askOffline:
      'No answer could be fetched. The script above is what matters, and it works without a signal.',
    askDisclaimer: 'An aid to explaining. It does not diagnose, and it cannot change the result.',
    clinicLabel: 'WHAT HAPPENS AT THE CLINIC',
    clinicLead: 'A nurse or doctor looks at the eyes with proper instruments. It does not hurt.',
    clinicAlt: 'A young woman having her eyes examined at a clinic',
    close: 'Back to the result',
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
    export: 'Export as a spreadsheet',
    exportNote: 'The photos are not included. Whoever needs to see an eye opens the record here.',
    exportUnavailable: 'This phone cannot share files. Try from the app on a phone.',
    exportFailed: 'The file could not be made. Try again.',
    photosLabel: 'PHOTOS',
    reflexLabel: 'PUPIL REFLEX',
    reflexReading: (right: number, left: number, finding: string): string =>
      `right ${right.toFixed(3)} · left ${left.toFixed(3)} · ${finding}`,
    photoMissing: 'This photo is no longer on the phone.',
    delete: 'Delete this screening',
    deleteConfirmTitle: 'Delete it permanently?',
    deleteConfirmBody:
      'The record and both photos are removed from this phone. This cannot be undone.',
    deleteYes: 'Yes, delete',
    deleteNo: 'Keep it',
    deleteFailed: 'It could not be deleted. Try again.',
  },
};

export type Strings = typeof en;
