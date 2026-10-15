import { restaurant } from '../config/restaurant';
import { whatsappLink } from '../lib/whatsapp';

export function usesFeedbackEndpoint() {
  return Boolean(restaurant.endpoints.feedback);
}

export function feedbackMessage({ name, contact, rating, message }) {
  return [
    'Feedback for Life Kitchen',
    name && `Name: ${name}`,
    contact && `Contact: ${contact}`,
    rating && `Rating: ${rating}/5`,
    '',
    message,
  ]
    .filter((row) => row !== false && row !== undefined && row !== null)
    .join('\n');
}

export function feedbackWhatsappUrl(data) {
  return whatsappLink(feedbackMessage(data));
}

/** POST as JSON. Works with Formspree, Getform, or any endpoint that accepts JSON. */
export async function sendFeedback(data) {
  const response = await fetch(restaurant.endpoints.feedback, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...data, source: 'website' }),
  });
  if (!response.ok) throw new Error(`Feedback endpoint responded ${response.status}`);
}
