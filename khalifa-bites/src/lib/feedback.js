import restaurant from '../config/restaurant';
import { whatsappLink } from './links';

export function feedbackWhatsAppLink(data) {
  const lines = ['*Feedback for Khalifa Bites*', `Name: ${data.name}`];
  if (data.contact) lines.push(`Contact: ${data.contact}`);
  if (data.rating) lines.push(`Rating: ${data.rating}/5`);
  lines.push('', data.message);
  return whatsappLink(lines.join('\n'));
}

/**
 * Sends feedback to `config.endpoints.feedback` (e.g. a Formspree URL) as JSON.
 * Throws on failure so the form can show an error state.
 */
export async function sendFeedback(data) {
  const res = await fetch(restaurant.endpoints.feedback, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...data, sentAt: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`Feedback endpoint responded ${res.status}`);
}
