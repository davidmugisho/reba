import type { TriageReason } from '../types/screening';
import type { Strings } from './en';

export const fr: Strings = {
  code: 'FR',
  name: 'Français',

  nav: {
    consent: 'Consentement',
    patient: 'Patient',
    acuity: 'Acuité visuelle',
    capture: 'Photo des yeux',
    analysing: 'Analyse',
    result: 'Résultat',
    referral: 'Orientation',
    screenings: 'Dépistages',
    screening: 'Dépistage',
    back: 'Retour',
  },

  common: {
    continue: 'Continuer',
    optional: 'Facultatif',
    loading: 'Chargement…',
    notes: 'NOTES',
    none: '—',
  },

  home: {
    tagline: 'Un dépistage de la vue qui marche sans réseau.',
    blurb:
      "Un examen guidé pour repérer les signes de cécité évitable. Cinq minutes, sans internet, rien ne quitte ce téléphone.",
    tally: (n: number) => (n === 1 ? 'dépistage sur cet appareil' : 'dépistages sur cet appareil'),
    start: 'Commencer un dépistage',
    past: 'Dépistages passés',
    language: 'LANGUE',
    artAlt: "Un agent de santé tenant un téléphone devant l'œil d'un patient",
  },

  consent: {
    step: 'Étape 1 sur 6',
    title: 'Lisez ceci au patient',
    lead: 'Reformulez avec ses mots si cela aide. Attendez un oui clair.',
    points: [
      "Cet examen cherche des signes indiquant que les yeux doivent être vus de plus près par un infirmier ou un médecin.",
      "Ce n'est pas un diagnostic. Rien ici ne remplace une visite en clinique.",
      'Deux photos des yeux sont prises. Elles restent sur ce téléphone.',
      "Vous pouvez arrêter à tout moment.",
    ],
    agreed: 'Le patient, ou son tuteur, a donné son accord à voix haute.',
  },

  patient: {
    step: 'Étape 2 sur 6',
    title: 'Qui dépistez-vous ?',
    age: 'Âge en années',
    agePlaceholder: 'ex. 6',
    sex: 'Sexe',
    female: 'Féminin',
    male: 'Masculin',
    other: 'Autre',
    village: 'Village',
    referTo: 'Orienter vers',
    referToPlaceholder: 'Clinique ou centre de santé',
  },

  acuity: {
    step: 'Étape 3 sur 6',

    calibrateTitle: 'Ajustez à une carte bancaire',
    calibrateLead:
      "Posez une carte bancaire ou une carte d'identité à plat sur l'écran et ajustez le cadre jusqu'à ce qu'il fasse exactement sa largeur. Chaque écran a une taille différente, et c'est ce qui donne aux lettres la bonne taille sur celui-ci.",
    narrower: 'Plus étroit',
    wider: 'Plus large',
    calibrateDone: 'La carte correspond',

    title: 'Dans quel sens pointent les branches ?',
    coverLeft: "Couvrez l'œil GAUCHE. Placez le patient à trois mètres et demandez-lui de pointer.",
    coverRight: "Couvrez maintenant l'œil DROIT. Recommencez.",
    rightEye: 'Œil droit',
    leftEye: 'Œil gauche',
    lineOf: (d: number): string => `Ligne 6/${d}`,
    cannotSee: 'Ne voit pas',
    up: 'Haut',
    down: 'Bas',
    left: 'Gauche',
    right: 'Droite',

    resultTitle: 'Acuité mesurée',
    redo: 'Refaire cet œil',
    next: 'Continuer vers la photo des yeux',
    eyeReading: (denominator: number | null, belowChart: boolean): string =>
      belowChart ? 'moins de 6/60' : denominator !== null ? `6/${denominator}` : '—',
  },

  capture: {
    step: 'Étape 4 sur 6',
    titleRight: "Photographiez l'œil droit",
    titleLeft: "Photographiez l'œil gauche",
    bothDone: 'Les deux yeux sont photographiés',
    lead: "Assombrissez la pièce si possible. Tenez le téléphone à un mètre, flash allumé, et remplissez le cercle avec l'œil.",
    rightEye: 'Œil droit',
    leftEye: 'Œil gauche',
    captureRight: "Photographier l'œil droit",
    captureLeft: "Photographier l'œil gauche",
    analyse: 'Analyser',
    permissionTitle: 'Reba a besoin de la caméra',
    permissionBody:
      "Deux photos des yeux sont prises. Elles restent sur ce téléphone et rien n'est envoyé.",
    permissionGrant: 'Autoriser la caméra',
    permissionDenied:
      "La caméra est bloquée pour Reba. Ouvrez les réglages du téléphone, autorisez la caméra, puis revenez sur cet écran.",
    retake: 'Reprendre la photo',
    saveFailed: "Cette photo n'a pas pu être enregistrée sur ce téléphone. Reprenez-la.",
  },

  analysis: {
    title: 'Examen des deux yeux',
    sub: "Tout se fait sur le téléphone. Rien n'est envoyé.",
  },

  result: {
    label: 'RÉSULTAT',
    clearTitle: "Aucun signe aujourd'hui",
    clearBody:
      "Rien n'a été repéré lors de cet examen. Ce n'est pas la même chose que des yeux en bonne santé. Revenez si la vue change, si un œil dévie, ou si la pupille paraît blanche sur une photo.",
    monitorTitle: 'À revoir dans 3 mois',
    monitorBody:
      "Quelque chose était limite. Ce n'est pas urgent, mais il ne faut pas l'oublier. Fixez un nouveau contrôle et dites à la famille ce qu'il faut surveiller.",
    referTitle: 'Orienter vers une clinique ophtalmologique',
    referBody:
      "Un signe repéré doit être examiné correctement par un clinicien. Orientez maintenant, pas plus tard. C'est le traitement précoce qui sauve la vue.",
    notLabel: "CE QUE CECI N'EST PAS",
    notBody:
      "Reba ne pose pas de diagnostic. Il signale les yeux qu'un infirmier ou un médecin devrait examiner. La décision leur revient toujours.",
    fillReferral: "Remplir l'orientation",
    explain: 'Expliquez-moi',
    basis:
      "Décidé par l'acuité mesurée aujourd'hui. Les photos restent sur ce téléphone mais rien ne les analyse encore.",
    reason: (r: TriageReason): string =>
      ({
        belowChart: "Un œil n'a pas pu lire même la plus grande ligne.",
        poorAcuity: "L'acuité est de 6/18 ou moins sur au moins un œil.",
        eyesDiffer: 'Les deux yeux sont séparés de deux lignes ou plus.',
        borderlineAcuity: "L'acuité est limite sur au moins un œil.",
        noSignsOnAcuity: "Le test d'acuité n'a rien repéré.",
      })[r],
    noneTitle: 'Aucun résultat à afficher',
    noneBody:
      "Ce dépistage n'est plus en cours, il n'y a donc rien à rapporter. Refaites l'examen depuis le début.",
    backToStart: 'Retour au début',
  },

  referral: {
    step: 'Étape 6 sur 6',
    title: "Fiche d'orientation",
    lead: 'Montrez-la à la famille, ou recopiez-la sur le formulaire papier.',
    age: 'Âge',
    village: 'Village',
    referTo: 'Orienter vers',
    acuity: 'Acuité',
    outcome: 'Conclusion',
    referNow: 'Orienter maintenant',
    recheck: 'À recontrôler',
    notesPlaceholder: 'Ce que la clinique doit savoir',
    save: 'Enregistrer et terminer',
    saving: 'Enregistrement…',
    retry: 'Réessayer',
    failed:
      "Non enregistré. Recopiez cette fiche sur le formulaire papier avant que le patient parte, puis réessayez.",
  },

  history: {
    emptyTitle: 'Aucun dépistage pour le moment',
    emptyBody: 'Les dépistages que vous terminez sont enregistrés ici, sur ce téléphone seulement.',
    years: (n: number) => `${n} ans`,
    noAge: 'Âge non renseigné',
    bandClear: 'Aucun signe',
    bandMonitor: 'À recontrôler',
    bandRefer: 'Orienté',
    notFound: 'Introuvable',
  },
};
