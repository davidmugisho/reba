import type { Locale } from './i18n';
import type { Screening } from './types/screening';

/**
 * Asking EjoChat to help a health worker explain a result to a family.
 *
 * This is the only place in Reba that talks to a network, and it is
 * deliberately narrow. It never sees a decision: the band is already decided
 * on the device from the acuity and the reflex before this file is ever
 * called. All it does is put the finished result into words for a parent who
 * has just been told their child should see an eye clinic.
 *
 * If it is not configured, or the phone has no signal, the explain screen
 * still works — the written script is the primary content and this is an
 * addition to it. Reba's whole point is that it works without a signal.
 */

/**
 * Credentials come from the environment at build time.
 *
 * Put them in a .env file at the project root (it is gitignored):
 *
 *   EXPO_PUBLIC_EJOCHAT_URL=https://...
 *   EXPO_PUBLIC_EJOCHAT_KEY=...
 *
 * Note that EXPO_PUBLIC_ values are baked into the bundle and can be read out
 * of a shipped app. That is acceptable for a hackathon key. A real deployment
 * would put a small proxy in front so the secret never leaves a server.
 */
const URL = process.env.EXPO_PUBLIC_EJOCHAT_URL ?? '';
const KEY = process.env.EXPO_PUBLIC_EJOCHAT_KEY ?? '';

/** The screen hides the whole feature when this is false. */
export const isConfigured = (): boolean => URL.length > 0;

const LANGUAGE_NAME: Record<Locale, string> = {
  rw: 'Kinyarwanda',
  en: 'English',
  fr: 'French',
  de: 'German',
};

/**
 * What the model is told about its job.
 *
 * The constraints are not politeness — they are the same rule the rest of the
 * app follows. Reba does not diagnose, and a model that speculated about
 * cancer to a frightened parent would do real harm. It explains a result that
 * has already been decided, and sends every clinical question back to the
 * clinician.
 */
function systemPrompt(locale: Locale): string {
  return [
    'You are helping a community health worker in Rwanda explain the result of an eye screening to a patient and their family.',
    `Answer in ${LANGUAGE_NAME[locale]}, in short plain sentences that can be read aloud to someone with no medical training.`,
    '',
    'Rules you must follow:',
    '- Never give a diagnosis and never name a disease as the cause. The screening only flags eyes for a nurse or doctor to look at.',
    '- Never predict what will happen to the person\'s sight. You do not know.',
    '- Never contradict or soften the result you are given. If it says refer, the family should go.',
    '- Send anything clinical back to the nurse or doctor at the clinic.',
    '- If you do not know something, say plainly that the clinic will be able to answer it.',
    '- Do not invent findings. Use only what is in the screening below.',
    '- Be brief. Three or four sentences is usually enough.',
  ].join('\n');
}

/** Only what was actually measured, so the model cannot embellish. */
function screeningContext(screening: Screening): string {
  const eye = (d: number | null, below?: boolean) =>
    below ? 'worse than 6/60' : d === null ? 'not measured' : `6/${d}`;

  const lines = [
    `Result: ${screening.risk ?? 'not decided'}`,
    `Right eye vision: ${eye(screening.acuity.right, screening.acuity.rightBelowChart)}`,
    `Left eye vision: ${eye(screening.acuity.left, screening.acuity.leftBelowChart)}`,
  ];

  if (screening.reflex) {
    const finding = {
      symmetric: 'both pupils reflected the light the same way',
      asymmetric: 'the two pupils reflected the light differently',
      palePupil: 'one pupil reflected white rather than red',
      unreadable: 'the photographs could not be read',
    }[screening.reflex.finding];
    lines.push(`Photographs of the eyes: ${finding}`);
  }

  if (screening.patient.ageYears !== null) {
    lines.push(`Patient age: ${screening.patient.ageYears} years`);
  }

  return lines.join('\n');
}

export class EjoChatUnavailable extends Error {}

/**
 * Sends one question and returns the answer.
 *
 * Throws EjoChatUnavailable for anything the health worker can act on — no
 * signal, no configuration, a refusal — so the screen can say what happened
 * instead of showing an empty box.
 */
export async function askEjoChat(
  question: string,
  screening: Screening,
  locale: Locale,
  signal?: AbortSignal,
): Promise<string> {
  if (!isConfigured()) throw new EjoChatUnavailable('EjoChat is not configured');

  const body = {
    // ---------------------------------------------------------------------
    // ADJUST HERE once the EjoChat API documentation arrives. Everything else
    // in this file stays as it is.
    // ---------------------------------------------------------------------
    messages: [
      { role: 'system', content: systemPrompt(locale) },
      {
        role: 'user',
        content: `Screening just completed:\n${screeningContext(screening)}\n\nThe family asks: ${question}`,
      },
    ],
  };

  let response: Response;
  try {
    response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(KEY ? { Authorization: `Bearer ${KEY}` } : {}),
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (cause) {
    // No signal is the ordinary case in a village, not an exception.
    throw new EjoChatUnavailable(`could not reach EjoChat: ${cause}`);
  }

  if (!response.ok) {
    throw new EjoChatUnavailable(`EjoChat answered ${response.status}`);
  }

  const data = await response.json();
  const answer = extractAnswer(data);
  if (!answer) throw new EjoChatUnavailable('EjoChat returned nothing to read');
  return answer.trim();
}

/**
 * Pulls the text out of the response.
 *
 * Tries the shapes chat APIs commonly use, because the EjoChat documentation
 * was not to hand when this was written. Once the real shape is known this can
 * become a single line.
 */
function extractAnswer(data: unknown): string | null {
  if (typeof data === 'string') return data;
  if (!data || typeof data !== 'object') return null;

  const d = data as Record<string, any>;
  return (
    d.choices?.[0]?.message?.content ??
    d.choices?.[0]?.text ??
    d.message?.content ??
    d.reply ??
    d.response ??
    d.answer ??
    d.output ??
    d.content ??
    null
  );
}
