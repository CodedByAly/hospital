import { feedback, site } from '../config/site.js';
import { whatsappHref } from '../lib/format.js';

/*
 * Sends feedback to the endpoint configured in src/config/site.js.
 * Without an endpoint, WhatsApp opens with the message ready to send to the
 * restaurant, so nothing is silently lost. Returns 'sent' or 'whatsapp'.
 */
export async function sendFeedback(entry) {
  if (feedback.endpoint) {
    const response = await fetch(feedback.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...entry, submittedAt: new Date().toISOString(), source: 'website' }),
    });
    if (!response.ok) throw new Error(`Feedback endpoint responded ${response.status}`);
    return 'sent';
  }

  const text = [
    'Feedback from the website',
    entry.rating ? `Rating: ${entry.rating}/5` : null,
    '',
    entry.message,
    '',
    `${entry.name}${entry.contact ? ` (${entry.contact})` : ''}`,
  ]
    .filter((l) => l !== null)
    .join('\n');
  window.open(whatsappHref(site.whatsapp, text), '_blank', 'noopener');
  return 'whatsapp';
}
