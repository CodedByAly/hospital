import { restaurant } from '../config/restaurant'

// Sends feedback to `restaurant.feedbackEndpoint` when one is set
// (any service accepting a JSON POST). Without an endpoint it opens the
// customer's email app with the message filled in.
export async function submitFeedback({ name, contact, rating, message }) {
  const payload = { name, contact, rating, message, source: 'website', sentAt: new Date().toISOString() }

  if (restaurant.feedbackEndpoint) {
    const res = await fetch(restaurant.feedbackEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`Feedback failed with status ${res.status}`)
    return { via: 'endpoint' }
  }

  const lines = [
    message,
    '',
    rating ? `Rating: ${rating}/5` : null,
    `From: ${name}`,
    contact ? `Contact: ${contact}` : null,
  ].filter((l) => l !== null)
  const subject = `Website feedback${rating ? ` (${rating}/5)` : ''}`
  window.location.href = `mailto:${restaurant.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
  return { via: 'email' }
}
