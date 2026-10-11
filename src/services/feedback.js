import { feedback, site } from '../config/site.js';

/*
 * Sends feedback to the endpoint configured in src/config/site.js.
 * Without an endpoint, the customer's email app opens with the message ready,
 * addressed to the restaurant — nothing is silently lost.
 * Returns 'sent' or 'mailto'.
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

  const body = [
    entry.message,
    '',
    entry.rating ? `Rating: ${entry.rating}/5` : null,
    entry.branch ? `Branch: ${entry.branch}` : null,
    `From: ${entry.name}${entry.contact ? ` (${entry.contact})` : ''}`,
  ]
    .filter((l) => l !== null)
    .join('\n');
  const subject = `Website feedback${entry.branch ? ` – ${entry.branch}` : ''}`;
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return 'mailto';
}
