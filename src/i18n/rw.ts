import type { TriageReason } from '../types/screening';
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
    explanation: 'Ibisobanuro',
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
    unfinishedLabel: 'ISUZUMA RITARARANGIRA',
    unfinishedStarted: (time: string): string => `Ryatangiye saa ${time}, ntiryabitswe.`,
    resume: 'Komeza',
    discard: 'Hanagura',
    artAlt: 'Umuganga w’amaso asuzuma ijisho ry’umukobwa',
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

    calibrateTitle: 'Gereranya n’indangamuntu',
    calibrateLead:
      'Hagarika ikarita ya banki ku kazu k’ubururu. Koresha ikarita ya banki niba ubishoboye: zose zifite ingano imwe rwose, mu gihe indangamuntu cyangwa uruhushya bishobora gutandukana. Izasohoka hasi ya telefone, ni ibisanzwe. Kanda kuri + kugeza ubururu bugaragara impande zombi, hanyuma ukande kuri − kugeza bushira.',
    narrower: 'Gabanya',
    wider: 'Ongera',
    calibrateDone: 'Ikarita irahuye',
    recalibrate: 'Ongera ugereranye ikarita',
    tooBigTitle: 'Ikarita ntiyagereranyijwe',
    tooBigBody:
      'Inyuguti zisabwa zaba zigari kurusha iyi ecran, bivuze ko agasanduku kagumye kagari kurusha ikarita. Subira inyuma maze ukagereranye neza n’uruhande rugufi rw’ikarita. Nta kintu cyanditswe.',

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
    rightEye: 'Ijisho ry’iburyo',
    leftEye: 'Ijisho ry’ibumoso',
    captureRight: 'Fata ijisho ry’iburyo',
    captureLeft: 'Fata ijisho ry’ibumoso',
    analyse: 'Sesengura',
    permissionTitle: 'Reba ikeneye kamera',
    permissionBody:
      'Hafatwa amafoto abiri y’amaso. Asigara kuri iyi telefone, nta kintu koherezwa.',
    permissionGrant: 'Emerera kamera',
    permissionDenied:
      'Kamera yafunzwe kuri Reba. Fungura igenamiterere rya telefone, wemerere kamera, hanyuma ugaruke kuri iyi paji.',
    retake: 'Ongera ufate ifoto',
    saveFailed: 'Iyi foto ntiyashoboye kubikwa kuri iyi telefone. Ongera uyifate.',
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
    basis:
      'Byemejwe kuri iyi telefone, hashingiwe ku bushobozi bwo kureba bwapimwe uyu munsi no ku rumuri imboni zagaragaje. Nta moderi yarebye amafoto.',
    reason: (r: TriageReason): string =>
      ({
        palePupil:
          'Imboni imwe yagaragaye yera aho kuba umutuku ku ifoto.',
        reflexDiffers: 'Imboni zombi zagaragaje urumuri mu buryo butandukanye.',
        belowChart: 'Ijisho rimwe ntiryashoboye gusoma n’umurongo munini kurusha iyindi.',
        poorAcuity: 'Ubushobozi bwo kureba ni 6/18 cyangwa buri hasi ku ijisho nibura rimwe.',
        eyesDiffer: 'Amaso yombi atandukanyijwe n’imirongo ibiri cyangwa irenga.',
        borderlineAcuity: 'Ubushobozi bwo kureba ntiburagaragara neza ku ijisho nibura rimwe.',
        noSignsOnAcuity: 'Ikizamini cy’ubushobozi bwo kureba nta kintu cyabonye.',
      })[r],
    noneTitle: 'Nta gisubizo cyo kwerekana',
    noneBody:
      'Iri suzuma ntirikiriho, nta kintu cyo gutanga. Ongera utangire isuzuma bundi bushya.',
    backToStart: 'Subira ku ntangiriro',
  },

  explain: {
    title: 'Icyo ibi bisobanura',
    lead: 'Soma ibi ubwire umurwayi n’umuryango. Koresha amagambo yabo niba bifasha.',
    clearPoints: [
      'Uyu munsi iri suzuma nta kintu ryabonye gisaba kujya ku ivuriro.',
      'Ibyo ntibisobanura ko amaso ari mazima. Iri suzuma ntirishobora kubona byose.',
      'Garuka niba kureba bihindutse, niba ijisho rimwe ritangiye kwerekera ku ruhande, cyangwa niba imboni igaragara yera ku ifoto.',
    ],
    monitorPoints: [
      'Hari ikintu kitagaragaye neza uyu munsi. Si ibyihutirwa.',
      'Ariko ntibigomba kwibagirana: tegura irindi suzuma nyuma y’amezi atatu.',
      'Garuka hakiri kare niba kureba bigenda bigabanuka, cyangwa niba ijisho rimwe ritangiye kwerekera ku ruhande.',
    ],
    referPoints: [
      'Iri suzuma ryabonye ikintu umuforomo cyangwa umuganga agomba kureba neza.',
      'Si isuzuma rya muganga, kandi ntibisobanura ko kureba biri gutakara. Bisobanura ko umuntu ufite ibikoresho bikwiye agomba kureba.',
      'Genda ubu aho kugenda ejo. Iyo ikintu gishobora kuvurwa, kukivura hakiri kare ni byo bikiza kureba.',
    ],
    readingLabel: 'IBIPIMO BY’AMASO',
    readingLead: 'Icyo imibare iri ku rupapuro isobanura.',
    readingFor: (eye: string, denominator: number | null, belowChart: boolean): string =>
      belowChart
        ? `${eye}: ntiryashoboye gusoma n’inyuguti nini kurusha izindi.`
        : denominator === null
          ? `${eye}: ntibyapimwe.`
          : denominator === 6
            ? `${eye}: 6/6, ni ukuvuga kureba gusanzwe.`
            : `${eye}: kuri metero 6 ribona ibyo ijisho rireba neza ribona kuri ${denominator}. Byandikwa 6/${denominator}.`,
    askLabel: 'NIBA UMURYANGO UBAJIJE IKINDI',
    askLead: 'Andika ikibazo cyabo. Bisaba umurongo — inyandiko yo hejuru ntibiwukeneye.',
    askPlaceholder: 'Umuryango wabajije iki?',
    askSend: 'Baza',
    askThinking: 'Gushaka amagambo…',
    askOffline:
      'Nta gisubizo cyabonetse. Icy’ingenzi ni inyandiko yo hejuru, kandi ikora nta murongo.',
    askDisclaimer:
      'Ni ubufasha mu gusobanura. Ntisuzuma nka muganga kandi ntihindura igisubizo.',
    clinicLabel: 'IBIBERA KU IVURIRO',
    clinicLead:
      'Umuforomo cyangwa umuganga areba amaso akoresheje ibikoresho bikwiye. Ntibibabaza.',
    clinicAlt: 'Umukobwa arimo asuzumwa amaso ku ivuriro',
    close: 'Subira ku gisubizo',
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
    export: 'Sohora nk’imbonerahamwe',
    exportNote:
      'Amafoto ntabwo ari muri iyi dosiye. Ukeneye kureba ijisho afungura dosiye hano.',
    exportUnavailable: 'Iyi telefone ntishobora gusangira dosiye.',
    exportFailed: 'Dosiye ntiyashoboye gukorwa. Ongera ugerageze.',
    photosLabel: 'AMAFOTO',
    reflexLabel: 'URUMURI RW’IMBONI',
    reflexReading: (right: number, left: number, finding: string): string =>
      `iburyo ${right.toFixed(3)} · ibumoso ${left.toFixed(3)} · ${finding}`,
    photoMissing: 'Iyi foto ntikiri kuri iyi telefone.',
    delete: 'Siba iri suzuma',
    deleteConfirmTitle: 'Gusiba burundu?',
    deleteConfirmBody:
      'Dosiye n’amafoto yombi bizakurwa kuri iyi telefone. Ibi ntibishobora gusubizwa inyuma.',
    deleteYes: 'Yego, siba',
    deleteNo: 'Bigumeho',
    deleteFailed: 'Ntibyashoboye gusibwa. Ongera ugerageze.',
  },
};
