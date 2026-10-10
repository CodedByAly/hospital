import { restaurant, whatsappLink } from '../config/restaurant'
import { makeT } from '../i18n/translate'

export const hasFeedbackEndpoint = () => Boolean(restaurant.feedback.endpoint)

/** POSTs feedback to the configured endpoint (see config/restaurant.js). */
export async function postFeedback(data, lang) {
  const res = await fetch(restaurant.feedback.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...data, language: lang }),
  })
  if (!res.ok) throw new Error(`Feedback failed: ${res.status}`)
}

/** Fallback while no endpoint is configured: the same message, ready to send on WhatsApp. */
export function feedbackWhatsappLink({ name, contact, rating, message }, lang) {
  const t = makeT(lang)
  const lines = [`*${t('whatsapp.feedback')}*`, `${t('whatsapp.name')}: ${name}`]
  if (contact) lines.push(`${t('whatsapp.contact')}: ${contact}`)
  lines.push(`${t('whatsapp.rating')}: ${rating}/5`, '', message)
  return whatsappLink(lines.join('\n'))
}
