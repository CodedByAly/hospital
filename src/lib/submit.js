import { restaurant } from '../config/restaurant.js'
import { whatsappLink } from './format.js'
import { orderMessage } from './order.js'

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
}

export const ordersGoToWhatsApp = !restaurant.endpoints.orders
export const feedbackGoesToWhatsApp = !restaurant.endpoints.feedback

// With no order endpoint configured the order is handed to WhatsApp, prefilled.
// window.open must run inside the click handler or mobile browsers block it, so this stays synchronous in that case.
export function submitOrder(order) {
  if (ordersGoToWhatsApp) {
    window.open(whatsappLink(orderMessage(order)), '_blank', 'noopener')
    return Promise.resolve()
  }
  return postJSON(restaurant.endpoints.orders, order)
}

export function feedbackMessage(f) {
  return [
    'Website feedback',
    f.rating ? `Rating: ${f.rating}/5` : null,
    `Name: ${f.name}`,
    f.contact ? `Contact: ${f.contact}` : null,
    '',
    f.message,
  ]
    .filter((l) => l !== null)
    .join('\n')
}

export function submitFeedback(feedback) {
  if (feedbackGoesToWhatsApp) {
    window.open(whatsappLink(feedbackMessage(feedback)), '_blank', 'noopener')
    return Promise.resolve()
  }
  return postJSON(restaurant.endpoints.feedback, feedback)
}
