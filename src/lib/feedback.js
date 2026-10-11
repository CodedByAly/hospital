import restaurant from '../config/restaurant';
import strings from '../i18n/strings';
import { whatsappLink } from './links';

/**
 * Sends feedback. With `config.endpoints.feedback` set (e.g. a Formspree
 * URL), it POSTs JSON and resolves { via: 'endpoint' }. Without a backend it
 * hands the message to WhatsApp so it still reaches the restaurant.
 */
export async function sendFeedback(data, lang) {
  const url = restaurant.endpoints.feedback;
  if (url) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...data, lang, sentAt: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error(`Feedback endpoint responded ${res.status}`);
    return { via: 'endpoint' };
  }
  return { via: 'whatsapp', href: feedbackWhatsAppLink(data, lang) };
}

export function feedbackWhatsAppLink(data, lang) {
  const w = strings[lang].wa;
  const lines = [`*${w.feedback}*`, `${w.name}: ${data.name}`];
  if (data.contact) lines.push(`${w.contact}: ${data.contact}`);
  if (data.rating) lines.push(`${w.rating}: ${data.rating}/5`);
  lines.push('', data.message);
  return whatsappLink(lines.join('\n'));
}
