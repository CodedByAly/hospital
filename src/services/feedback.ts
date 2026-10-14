/**
 * Feedback submission.
 *
 * Set VITE_FEEDBACK_ENDPOINT (e.g. a Formspree / Getform URL or your own API)
 * in a `.env` file to POST feedback as JSON. Without it, feedback is handed
 * to WhatsApp as a pre-written message so nothing is silently lost.
 */
import { whatsappLink } from '../config/restaurant'

export interface Feedback {
  name: string
  contact: string
  rating: number
  message: string
}

export type FeedbackResult = { via: 'endpoint' } | { via: 'whatsapp'; url: string }

const endpoint = import.meta.env.VITE_FEEDBACK_ENDPOINT as string | undefined

export async function sendFeedback(fb: Feedback): Promise<FeedbackResult> {
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...fb, source: 'website', sentAt: new Date().toISOString() }),
    })
    if (!res.ok) throw new Error(`Feedback failed: ${res.status}`)
    return { via: 'endpoint' }
  }
  const text = [
    '*Website feedback*',
    `Rating: ${'★'.repeat(fb.rating)}${'☆'.repeat(5 - fb.rating)} (${fb.rating}/5)`,
    `From: ${fb.name}${fb.contact ? ` · ${fb.contact}` : ''}`,
    '',
    fb.message,
  ].join('\n')
  return { via: 'whatsapp', url: whatsappLink(text) }
}
