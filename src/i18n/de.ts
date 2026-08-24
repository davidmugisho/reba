import type { TriageReason } from '../types/screening';
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
    explanation: 'Erklärung',
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
    unfinishedLabel: 'UNFERTIGE UNTERSUCHUNG',
    unfinishedStarted: (time: string): string => `Um ${time} begonnen, nicht gespeichert.`,
    resume: 'Weitermachen',
    discard: 'Verwerfen',
    artAlt: 'Eine Augenärztin untersucht das Auge einer jungen Frau',
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

    calibrateTitle: 'An einen Ausweis anpassen',
    calibrateLead:
      'Halten Sie einen Personalausweis flach an den Bildschirm und passen Sie den Rahmen an, bis er genau so breit ist wie die Karte. Eine Bankkarte oder ein Führerschein hat dieselbe Größe und geht auch. Jeder Bildschirm ist anders groß, und das gibt den Buchstaben auf diesem Gerät die richtige Größe.',
    narrower: 'Schmaler',
    wider: 'Breiter',
    calibrateDone: 'Die Karte passt',

    title: 'In welche Richtung zeigen die Balken?',
    coverLeft:
      'Decken Sie das LINKE Auge ab. Stellen Sie die Patientin drei Meter entfernt auf und bitten Sie sie zu zeigen.',
    coverRight: 'Decken Sie jetzt das RECHTE Auge ab. Noch einmal.',
    rightEye: 'Rechtes Auge',
    leftEye: 'Linkes Auge',
    lineOf: (d: number): string => `Zeile 6/${d}`,
    cannotSee: 'Sieht es nicht',
    up: 'Oben',
    down: 'Unten',
    left: 'Links',
    right: 'Rechts',

    resultTitle: 'Sehschärfe gemessen',
    redo: 'Dieses Auge erneut prüfen',
    next: 'Weiter zur Augenaufnahme',
    eyeReading: (denominator: number | null, belowChart: boolean): string =>
      belowChart ? 'schlechter als 6/60' : denominator !== null ? `6/${denominator}` : '—',
  },

  capture: {
    step: 'Schritt 4 von 6',
    titleRight: 'Rechtes Auge aufnehmen',
    titleLeft: 'Linkes Auge aufnehmen',
    bothDone: 'Beide Augen aufgenommen',
    lead: 'Verdunkeln Sie den Raum, wenn möglich. Halten Sie das Telefon einen Meter entfernt, Blitz an, und füllen Sie den Ring mit dem Auge.',
    rightEye: 'Rechtes Auge',
    leftEye: 'Linkes Auge',
    captureRight: 'Rechtes Auge aufnehmen',
    captureLeft: 'Linkes Auge aufnehmen',
    analyse: 'Auswerten',
    permissionTitle: 'Reba braucht die Kamera',
    permissionBody:
      'Es werden zwei Fotos der Augen gemacht. Sie bleiben auf diesem Telefon, und es wird nichts hochgeladen.',
    permissionGrant: 'Kamera erlauben',
    permissionDenied:
      'Die Kamera ist für Reba gesperrt. Öffnen Sie die Telefoneinstellungen, erlauben Sie die Kamera, und kommen Sie dann auf diesen Bildschirm zurück.',
    retake: 'Noch einmal aufnehmen',
    saveFailed:
      'Dieses Foto konnte nicht auf dem Telefon gespeichert werden. Nehmen Sie es noch einmal auf.',
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
    basis:
      'Auf diesem Telefon entschieden, aus der heute gemessenen Sehschärfe und dem Licht, das die Pupillen zurückwarfen. Kein Modell hat die Fotos angesehen.',
    reason: (r: TriageReason): string =>
      ({
        palePupil:
          'Eine Pupille hat auf dem Foto weiß statt rot zurückgeworfen.',
        reflexDiffers: 'Die beiden Pupillen haben das Licht unterschiedlich zurückgeworfen.',
        belowChart: 'Ein Auge konnte nicht einmal die größte Zeile lesen.',
        poorAcuity: 'Die Sehschärfe beträgt auf mindestens einem Auge 6/18 oder schlechter.',
        eyesDiffer: 'Die beiden Augen liegen zwei Zeilen oder mehr auseinander.',
        borderlineAcuity: 'Die Sehschärfe ist auf mindestens einem Auge grenzwertig.',
        noSignsOnAcuity: 'Der Sehschärfetest hat nichts gefunden.',
      })[r],
    noneTitle: 'Kein Ergebnis vorhanden',
    noneBody:
      'Diese Untersuchung läuft nicht mehr, es gibt also nichts zu berichten. Führen Sie die Prüfung von vorne durch.',
    backToStart: 'Zurück zum Anfang',
  },

  explain: {
    title: 'Was das bedeutet',
    lead: 'Lesen Sie dies der Patientin und der Familie vor. Nutzen Sie eigene Worte, wenn es hilft.',
    clearPoints: [
      'Heute hat diese Untersuchung nichts gefunden, das einen Klinikbesuch nötig macht.',
      'Das ist nicht dasselbe wie gesunde Augen. Diese Untersuchung kann nicht alles sehen.',
      'Kommen Sie wieder, wenn sich das Sehen ändert, wenn ein Auge abzuweichen beginnt, oder wenn die Pupille auf einem Foto weiß aussieht.',
    ],
    monitorPoints: [
      'Etwas war heute grenzwertig. Es ist nicht dringend.',
      'Vergessen werden sollte es trotzdem nicht: Vereinbaren Sie in drei Monaten eine neue Kontrolle.',
      'Kommen Sie früher, wenn das Sehen schlechter wird oder ein Auge abzuweichen beginnt.',
    ],
    referPoints: [
      'Diese Untersuchung hat etwas gefunden, das eine Pflegekraft oder eine Ärztin genau ansehen muss.',
      'Das ist keine Diagnose, und es heißt nicht, dass das Augenlicht verloren geht. Es heißt, dass jemand mit der richtigen Ausrüstung nachsehen sollte.',
      'Gehen Sie jetzt und nicht später. Wenn sich etwas behandeln lässt, rettet die frühe Behandlung das Sehen.',
    ],
    readingLabel: 'DER SEHWERT',
    readingLead: 'Was die Zahlen auf dem Schein bedeuten.',
    readingFor: (eye: string, denominator: number | null, belowChart: boolean): string =>
      belowChart
        ? `${eye}: konnte nicht einmal den größten Buchstaben lesen.`
        : denominator === null
          ? `${eye}: nicht gemessen.`
          : denominator === 6
            ? `${eye}: 6/6, also normales Sehen.`
            : `${eye}: sieht auf 6 Meter das, was klares Sehen auf ${denominator} sieht. Geschrieben 6/${denominator}.`,
    askLabel: 'WENN DIE FAMILIE ETWAS ANDERES FRAGT',
    askLead: 'Tippen Sie ihre Frage ein. Braucht Empfang — der Text oben nicht.',
    askPlaceholder: 'Was hat die Familie gefragt?',
    askSend: 'Fragen',
    askThinking: 'Suche nach den Worten…',
    askOffline:
      'Es konnte keine Antwort geholt werden. Entscheidend ist der Text oben, und der funktioniert ohne Empfang.',
    askDisclaimer:
      'Eine Hilfe beim Erklären. Sie stellt keine Diagnose und ändert das Ergebnis nicht.',
    clinicLabel: 'WAS IN DER KLINIK PASSIERT',
    clinicLead:
      'Eine Pflegekraft oder eine Ärztin sieht sich die Augen mit richtigen Instrumenten an. Es tut nicht weh.',
    clinicAlt: 'Einer jungen Frau werden in einer Klinik die Augen untersucht',
    close: 'Zurück zum Ergebnis',
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
    export: 'Als Tabelle exportieren',
    exportNote:
      'Die Fotos sind nicht enthalten. Wer ein Auge sehen muss, öffnet den Eintrag hier.',
    exportUnavailable: 'Dieses Telefon kann keine Dateien teilen.',
    exportFailed: 'Die Datei konnte nicht erstellt werden. Versuchen Sie es erneut.',
    photosLabel: 'FOTOS',
    reflexLabel: 'PUPILLENREFLEX',
    reflexReading: (right: number, left: number, finding: string): string =>
      `rechts ${right.toFixed(3)} · links ${left.toFixed(3)} · ${finding}`,
    photoMissing: 'Dieses Foto ist nicht mehr auf dem Telefon.',
    delete: 'Diese Untersuchung löschen',
    deleteConfirmTitle: 'Endgültig löschen?',
    deleteConfirmBody:
      'Der Eintrag und beide Fotos werden von diesem Telefon entfernt. Das lässt sich nicht rückgängig machen.',
    deleteYes: 'Ja, löschen',
    deleteNo: 'Behalten',
    deleteFailed: 'Löschen fehlgeschlagen. Versuchen Sie es erneut.',
  },
};
