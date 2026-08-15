import type { Strings } from './en';

export const de: Strings = {
  code: 'DE',
  name: 'Deutsch',

  nav: {
    consent: 'Einwilligung',
    patient: 'Patient',
    acuity: 'Sehschärfe',
    capture: 'Augenaufnahme',
    analysing: 'Auswertung',
    result: 'Ergebnis',
    referral: 'Überweisung',
    screenings: 'Untersuchungen',
    screening: 'Untersuchung',
    back: 'Zurück',
  },

  common: {
    continue: 'Weiter',
    optional: 'Optional',
    loading: 'Wird geladen…',
    notes: 'NOTIZEN',
    none: '—',
  },

  home: {
    tagline: 'Sehtest, der ohne Netz funktioniert.',
    blurb:
      'Eine geführte Untersuchung auf Anzeichen vermeidbarer Erblindung. Fünf Minuten, ohne Internet, nichts verlässt dieses Telefon.',
    tally: (n: number) =>
      n === 1 ? 'Untersuchung auf diesem Gerät' : 'Untersuchungen auf diesem Gerät',
    start: 'Untersuchung beginnen',
    past: 'Frühere Untersuchungen',
    language: 'SPRACHE',
    artAlt: 'Eine Gesundheitsfachkraft hält ein Telefon vor das Auge einer Patientin',
  },

  consent: {
    step: 'Schritt 1 von 6',
    title: 'Lesen Sie dies der Patientin vor',
    lead: 'Nutzen Sie eigene Worte, wenn es hilft. Warten Sie auf ein klares Ja.',
    points: [
      'Diese Untersuchung sucht nach Anzeichen dafür, dass die Augen von einer Pflegekraft oder einer Ärztin genauer angesehen werden sollten.',
      'Das ist keine Diagnose. Nichts hier ersetzt den Besuch in einer Klinik.',
      'Es werden zwei Fotos der Augen gemacht. Sie bleiben auf diesem Telefon.',
      'Sie können jederzeit abbrechen.',
    ],
    agreed: 'Die Patientin oder ihre Begleitperson hat laut zugestimmt.',
  },

  patient: {
    step: 'Schritt 2 von 6',
    title: 'Wen untersuchen Sie?',
    age: 'Alter in Jahren',
    agePlaceholder: 'z. B. 6',
    sex: 'Geschlecht',
    female: 'Weiblich',
    male: 'Männlich',
    other: 'Divers',
    village: 'Dorf',
    referTo: 'Überweisen an',
    referToPlaceholder: 'Klinik oder Gesundheitszentrum',
  },

  acuity: {
    step: 'Schritt 3 von 6',
    title: 'In welche Richtung zeigen die Balken?',
    lead: 'Stellen Sie die Patientin drei Meter entfernt auf. Decken Sie zuerst das linke Auge ab. Bitten Sie sie zu zeigen.',
    next: 'Weiter zur Augenaufnahme',
    up: 'Oben',
    down: 'Unten',
    left: 'Links',
    right: 'Rechts',
  },

  capture: {
    step: 'Schritt 4 von 6',
    titleRight: 'Rechtes Auge aufnehmen',
    titleLeft: 'Linkes Auge aufnehmen',
    bothDone: 'Beide Augen aufgenommen',
    lead: 'Verdunkeln Sie den Raum, wenn möglich. Halten Sie das Telefon einen Meter entfernt, Blitz an, und füllen Sie den Ring mit dem Auge.',
    placeholder: 'Kamera — Tag 4',
    rightEye: 'Rechtes Auge',
    leftEye: 'Linkes Auge',
    captureRight: 'Rechtes Auge aufnehmen',
    captureLeft: 'Linkes Auge aufnehmen',
    analyse: 'Auswerten',
  },

  analysis: {
    title: 'Beide Augen werden geprüft',
    sub: 'Das läuft auf dem Telefon. Es wird nichts hochgeladen.',
  },

  result: {
    label: 'ERGEBNIS',
    clearTitle: 'Heute keine Anzeichen',
    clearBody:
      'Bei dieser Untersuchung wurde nichts gefunden. Das ist nicht dasselbe wie gesunde Augen. Kommen Sie wieder, wenn sich das Sehen ändert, wenn ein Auge abweicht, oder wenn die Pupille auf einem Foto jemals weiß aussieht.',
    monitorTitle: 'In 3 Monaten erneut prüfen',
    monitorBody:
      'Etwas war grenzwertig. Nicht dringend, aber es sollte nicht vergessen werden. Vereinbaren Sie eine Nachkontrolle und sagen Sie der Familie, worauf sie achten soll.',
    referTitle: 'An eine Augenklinik überweisen',
    referBody:
      'Es wurde ein Anzeichen gefunden, das eine Fachkraft genauer ansehen muss. Überweisen Sie jetzt, nicht später. Frühe Behandlung ist es, was das Augenlicht rettet.',
    notLabel: 'WAS DIES NICHT IST',
    notBody:
      'Reba stellt keine Diagnose. Es markiert Augen, die eine Pflegekraft oder eine Ärztin ansehen sollte. Die Entscheidung liegt immer bei ihnen.',
    fillReferral: 'Überweisung ausfüllen',
    explain: 'Erklären Sie mir das',
    meta: (version: string) =>
      `Modell ${version} · auf Sensitivität eingestellt · Grenzfälle werden absichtlich markiert`,
    noneTitle: 'Kein Ergebnis vorhanden',
    noneBody:
      'Diese Untersuchung läuft nicht mehr, es gibt also nichts zu berichten. Führen Sie die Prüfung von vorne durch.',
    backToStart: 'Zurück zum Anfang',
  },

  referral: {
    step: 'Schritt 6 von 6',
    title: 'Überweisungsschein',
    lead: 'Zeigen Sie ihn der Familie, oder übertragen Sie ihn auf das Papierformular.',
    age: 'Alter',
    village: 'Dorf',
    referTo: 'Überweisen an',
    acuity: 'Sehschärfe',
    outcome: 'Befund',
    referNow: 'Jetzt überweisen',
    recheck: 'Nachkontrolle',
    notesPlaceholder: 'Was die Klinik wissen sollte',
    save: 'Speichern und beenden',
    saving: 'Wird gespeichert…',
    retry: 'Erneut speichern',
    failed:
      'Nicht gespeichert. Übertragen Sie diesen Schein auf das Papierformular, bevor die Patientin geht, und versuchen Sie es dann erneut.',
  },

  history: {
    emptyTitle: 'Noch keine Untersuchungen',
    emptyBody:
      'Abgeschlossene Untersuchungen werden hier gespeichert, nur auf diesem Telefon.',
    years: (n: number) => `${n} Jahre`,
    noAge: 'Alter nicht erfasst',
    bandClear: 'Keine Anzeichen',
    bandMonitor: 'Nachkontrolle',
    bandRefer: 'Überwiesen',
    notFound: 'Nicht gefunden',
  },
};
