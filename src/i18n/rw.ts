import type { Strings } from './en';

/**
 * ⚠️ NOT REVIEWED BY A NATIVE SPEAKER.
 *
 * These strings were drafted, not translated by a Kinyarwanda speaker, and
 * they must be read by one before this app is used with a real patient.
 *
 * The consent screen is the reason. A health worker reads it aloud, and it is
 * where the patient is told this is *not* a diagnosis. If that sentence lands
 * wrong, someone walks away believing their eyes have been examined when they
 * have not. The result bands carry the same weight.
 *
 * Sentences are kept short and plain on purpose: it is easier for a reviewer
 * to correct, and it survives being read aloud to someone who is anxious.
 */
export const rw: Strings = {
  code: 'RW',
  name: 'Kinyarwanda',

  nav: {
    consent: 'Uruhushya',
    patient: 'Umurwayi',
    acuity: 'Ubushobozi bwo kureba',
    capture: 'Gufata amafoto y’amaso',
    analysing: 'Gusesengura',
    result: 'Igisubizo',
    referral: 'Kohereza',
    screenings: 'Isuzuma ryakozwe',
    screening: 'Isuzuma',
    back: 'Subira inyuma',
  },

  common: {
    continue: 'Komeza',
    optional: 'Si itegeko',
    loading: 'Biratangira…',
    notes: 'INYANDIKO',
    none: '—',
  },

  home: {
    tagline: 'Isuzuma ry’amaso rikora nta murongo.',
    blurb:
      'Isuzuma riyoborwa rishakisha ibimenyetso by’ubuhumyi bushobora kwirindwa. Iminota itanu, nta interineti, nta kintu kiva kuri iyi telefone.',
    tally: (n: number) => (n === 1 ? 'isuzuma kuri iyi telefone' : 'amasuzuma kuri iyi telefone'),
    start: 'Tangira isuzuma',
    past: 'Amasuzuma yashize',
    language: 'URURIMI',
    artAlt: 'Umujyanama w’ubuzima afashe telefone imbere y’ijisho ry’umurwayi',
  },

  consent: {
    step: 'Intambwe ya 1 kuri 6',
    title: 'Soma ibi umubwire umurwayi',
    lead: 'Koresha amagambo ye niba bifasha. Tegereza yego isobanutse.',
    points: [
      'Iri suzuma rishakisha ibimenyetso byerekana ko amaso akwiye kurebwa neza n’umuforomo cyangwa umuganga.',
      'Si isuzuma rya muganga. Nta kintu hano gisimbura kujya ku ivuriro.',
      'Hafatwa amafoto abiri y’amaso. Asigara kuri iyi telefone.',
      'Ushobora guhagarara igihe icyo ari cyo cyose.',
    ],
    agreed: 'Umurwayi, cyangwa umurera, yemeye mu ijwi riranguruye.',
  },

  patient: {
    step: 'Intambwe ya 2 kuri 6',
    title: 'Ni nde urimo gusuzuma?',
    age: 'Imyaka',
    agePlaceholder: 'urugero 6',
    sex: 'Igitsina',
    female: 'Gore',
    male: 'Gabo',
    other: 'Ikindi',
    village: 'Umudugudu',
    referTo: 'Kohereza kuri',
    referToPlaceholder: 'Ivuriro cyangwa ikigo nderabuzima',
  },

  acuity: {
    step: 'Intambwe ya 3 kuri 6',

    calibrateTitle: 'Gereranya n’ikarita ya banki',
    calibrateLead:
      'Shyira ikarita ya banki cyangwa indangamuntu kuri ecran, uhindure kugeza ubugari bw’agasanduku bungana n’ubw’ikarita. Buri telefone ifite ecran itandukanye, ni yo mpamvu ibi bituma inyuguti zigira ingano ikwiye kuri iyi.',
    narrower: 'Gabanya',
    wider: 'Ongera',
    calibrateDone: 'Ikarita irahuye',

    title: 'Amaguru yerekeye he?',
    coverLeft:
      'Pfuka ijisho ry’IBUMOSO. Shyira umurwayi ku ntera ya metero eshatu umusabe kwerekana.',
    coverRight: 'Ubu pfuka ijisho ry’IBURYO. Ongera.',
    rightEye: 'Ijisho ry’iburyo',
    leftEye: 'Ijisho ry’ibumoso',
    lineOf: (d: number): string => `Umurongo 6/${d}`,
    cannotSee: 'Ntabibona',
    up: 'Hejuru',
    down: 'Hasi',
    left: 'Ibumoso',
    right: 'Iburyo',

    resultTitle: 'Ubushobozi bwo kureba bwapimwe',
    redo: 'Ongera upime iri jisho',
    next: 'Komeza ku mafoto y’amaso',
    eyeReading: (denominator: number | null, belowChart: boolean): string =>
      belowChart ? 'munsi ya 6/60' : denominator !== null ? `6/${denominator}` : '—',
  },

  capture: {
    step: 'Intambwe ya 4 kuri 6',
    titleRight: 'Fata ifoto y’ijisho ry’iburyo',
    titleLeft: 'Fata ifoto y’ijisho ry’ibumoso',
    bothDone: 'Amaso yombi yafashwe',
    lead: 'Niba bishoboka, gabanya urumuri mu cyumba. Fata telefone ku ntera ya metero imwe, ucane itara, wuzuze uruziga n’ijisho.',
    placeholder: 'Kamera — umunsi wa 4',
    rightEye: 'Ijisho ry’iburyo',
    leftEye: 'Ijisho ry’ibumoso',
    captureRight: 'Fata ijisho ry’iburyo',
    captureLeft: 'Fata ijisho ry’ibumoso',
    analyse: 'Sesengura',
  },

  analysis: {
    title: 'Amaso yombi ararebwa',
    sub: 'Ibi bikorerwa kuri telefone. Nta kintu koherezwa.',
  },

  result: {
    label: 'IGISUBIZO',
    clearTitle: 'Nta kimenyetso uyu munsi',
    clearBody:
      'Nta kintu cyabonetse muri iri suzuma. Ibyo ntibisobanura ko amaso ari mazima. Garuka niba kureba bihindutse, niba ijisho rimwe ryerekeye ku ruhande, cyangwa niba imboni igaragara yera ku ifoto.',
    monitorTitle: 'Ongera urebe nyuma y’amezi 3',
    monitorBody:
      'Hari ikintu kitagaragara neza. Si ibyihutirwa, ariko ntibigomba kwibagirana. Tegura irindi suzuma kandi ubwire umuryango icyo bagomba kwitondera.',
    referTitle: 'Ohereza ku ivuriro ry’amaso',
    referBody:
      'Habonetse ikimenyetso gisaba ko umuganga akireba neza. Ohereza ubu, atari ejo. Kuvurwa hakiri kare ni byo bikiza kureba.',
    notLabel: 'ICYO ITARI CYO',
    notBody:
      'Reba ntisuzuma nka muganga. Yerekana amaso umuforomo cyangwa umuganga agomba kureba. Icyemezo ni icyabo buri gihe.',
    fillReferral: 'Uzuza urupapuro rwo kohereza',
    explain: 'Mbisobanurire',
    meta: (version: string) =>
      `Moderi ${version} · yateguwe kumenya byinshi · ibitagaragara neza byerekanwa ku bushake`,
    noneTitle: 'Nta gisubizo cyo kwerekana',
    noneBody:
      'Iri suzuma ntirikiriho, nta kintu cyo gutanga. Ongera utangire isuzuma bundi bushya.',
    backToStart: 'Subira ku ntangiriro',
  },

  referral: {
    step: 'Intambwe ya 6 kuri 6',
    title: 'Urupapuro rwo kohereza',
    lead: 'Rwereke umuryango, cyangwa urwandike ku ipapuro.',
    age: 'Imyaka',
    village: 'Umudugudu',
    referTo: 'Kohereza kuri',
    acuity: 'Kureba',
    outcome: 'Umwanzuro',
    referNow: 'Ohereza ubu',
    recheck: 'Ongera urebe',
    notesPlaceholder: 'Icyo ivuriro rigomba kumenya',
    save: 'Bika urangize',
    saving: 'Kubika…',
    retry: 'Ongera ugerageze kubika',
    failed:
      'Ntibyabitswe. Andika uru rupapuro ku ipapuro mbere y’uko umurwayi agenda, hanyuma wongere ugerageze.',
  },

  history: {
    emptyTitle: 'Nta suzuma rirabaho',
    emptyBody: 'Amasuzuma urangiza abikwa hano, kuri iyi telefone gusa.',
    years: (n: number) => `imyaka ${n}`,
    noAge: 'Imyaka ntiyanditswe',
    bandClear: 'Nta kimenyetso',
    bandMonitor: 'Ongera urebe',
    bandRefer: 'Yoherejwe',
    notFound: 'Ntibyabonetse',
  },
};
