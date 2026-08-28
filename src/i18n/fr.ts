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
    explanation: 'Explication',
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
    unfinishedLabel: 'DÉPISTAGE INACHEVÉ',
    unfinishedStarted: (time: string): string => `Commencé à ${time}, non enregistré.`,
    resume: 'Reprendre',
    discard: 'Supprimer',
    artAlt: "Une ophtalmologue examinant l'œil d'une jeune femme",
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

    calibrateTitle: "Ajustez à une carte d'identité",
    calibrateLead:
      "Posez une carte bancaire debout sur le rectangle bleu. Préférez une carte bancaire : elles ont toutes exactement la même taille, alors qu'une carte d'identité ou une attestation peut varier. Elle dépassera en bas du téléphone, c'est normal. Appuyez sur + jusqu'à voir du bleu des deux côtés, puis sur − jusqu'à ce qu'il disparaisse.",
    narrower: 'Plus étroit',
    wider: 'Plus large',
    calibrateDone: 'La carte correspond',
    recalibrate: 'Réajuster la carte',
    tooBigTitle: "La carte n'a pas été ajustée",
    tooBigBody:
      "Les lettres demandées seraient plus larges que cet écran, ce qui veut dire que le cadre est resté trop large pour la carte. Revenez en arrière et faites-le correspondre exactement au petit côté de la carte. Rien n'a été enregistré.",

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
      "Décidé sur ce téléphone, à partir de l'acuité mesurée aujourd'hui et de la lumière renvoyée par les pupilles. Aucun modèle n'a examiné les photos.",
    reason: (r: TriageReason): string =>
      ({
        palePupil:
          "Une pupille a renvoyé du blanc au lieu du rouge sur la photo.",
        reflexDiffers: 'Les deux pupilles ont renvoyé la lumière différemment.',
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

  explain: {
    title: 'Ce que cela veut dire',
    lead: 'Lisez ceci au patient et à la famille. Reformulez avec leurs mots si cela aide.',
    clearPoints: [
      "Aujourd'hui, cet examen n'a rien trouvé qui nécessite une visite en clinique.",
      "Ce n'est pas la même chose que des yeux en bonne santé. Cet examen ne voit pas tout.",
      "Revenez si la vue change, si un œil commence à dévier, ou si la pupille paraît blanche sur une photo.",
    ],
    monitorPoints: [
      "Quelque chose était limite aujourd'hui. Ce n'est pas urgent.",
      "Il ne faut pas l'oublier pour autant : fixez un nouvel examen dans trois mois.",
      "Revenez plus tôt si la vue se dégrade, ou si un œil commence à dévier.",
    ],
    referPoints: [
      "Cet examen a trouvé quelque chose qu'un infirmier ou un médecin doit examiner correctement.",
      "Ce n'est pas un diagnostic, et cela ne veut pas dire que la vue se perd. Cela veut dire que quelqu'un avec le bon matériel doit regarder.",
      "Allez-y maintenant plutôt que plus tard. Quand une chose peut se soigner, la soigner tôt est ce qui sauve la vue.",
    ],
    readingLabel: 'LA MESURE DE LA VUE',
    readingLead: 'Ce que signifient les chiffres sur la fiche.',
    readingFor: (eye: string, denominator: number | null, belowChart: boolean): string =>
      belowChart
        ? `${eye} : n'a pas pu lire même la plus grande lettre.`
        : denominator === null
          ? `${eye} : non mesuré.`
          : denominator === 6
            ? `${eye} : 6/6, soit une vue normale.`
            : `${eye} : voit à 6 mètres ce qu'une vue nette voit à ${denominator}. Noté 6/${denominator}.`,
    askLabel: 'SI LA FAMILLE DEMANDE AUTRE CHOSE',
    askLead: 'Tapez leur question. Demande du réseau — le texte ci-dessus, non.',
    askPlaceholder: "Qu'a demandé la famille ?",
    askSend: 'Demander',
    askThinking: 'Recherche des mots…',
    askOffline:
      "Aucune réponse n'a pu être obtenue. C'est le texte ci-dessus qui compte, et il marche sans réseau.",
    askDisclaimer:
      "Une aide à l'explication. Cela ne pose pas de diagnostic et ne change pas le résultat.",
    clinicLabel: 'CE QUI SE PASSE À LA CLINIQUE',
    clinicLead:
      "Un infirmier ou un médecin examine les yeux avec de vrais instruments. Cela ne fait pas mal.",
    clinicAlt: 'Une jeune femme dont on examine les yeux dans une clinique',
    close: 'Retour au résultat',
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
    export: 'Exporter en tableur',
    exportNote:
      "Les photos ne sont pas incluses. Qui a besoin de voir un œil ouvre le dossier ici.",
    exportUnavailable: 'Ce téléphone ne peut pas partager de fichiers.',
    exportFailed: "Le fichier n'a pas pu être créé. Réessayez.",
    photosLabel: 'PHOTOS',
    reflexLabel: 'REFLET DES PUPILLES',
    reflexReading: (right: number, left: number, finding: string): string =>
      `droit ${right.toFixed(3)} · gauche ${left.toFixed(3)} · ${finding}`,
    photoMissing: "Cette photo n'est plus sur le téléphone.",
    delete: 'Supprimer ce dépistage',
    deleteConfirmTitle: 'Supprimer définitivement ?',
    deleteConfirmBody:
      'Le dossier et les deux photos sont retirés de ce téléphone. Cela ne peut pas être annulé.',
    deleteYes: 'Oui, supprimer',
    deleteNo: 'Le garder',
    deleteFailed: 'La suppression a échoué. Réessayez.',
  },
};
