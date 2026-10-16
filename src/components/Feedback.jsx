import { useState } from 'react';
import { restaurant, whatsappLink } from '../data/restaurant';
import Icon from './Icon';
import Reveal from './Reveal';
import './Feedback.css';

const ratingWords = ['', 'Poor', 'Could be better', 'Good', 'Very good', 'Excellent'];

function validate(v) {
  const e = {};
  if (!v.message.trim()) e.message = 'Tell us a little about your visit.';
  else if (v.message.trim().length < 5) e.message = 'A few more words would help us.';
  if (v.contact.trim() && !/^(\+?[\d\s\-()]{7,}|[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(v.contact.trim())) {
    e.contact = 'Enter a phone number or email, or leave it empty.';
  }
  return e;
}

function feedbackText(v) {
  return [
    'Feedback for Talia',
    v.rating ? `Rating: ${v.rating}/5 (${ratingWords[v.rating]})` : null,
    v.name.trim() ? `From: ${v.name.trim()}` : null,
    v.contact.trim() ? `Contact: ${v.contact.trim()}` : null,
    '',
    v.message.trim(),
  ]
    .filter((x) => x !== null)
    .join('\n');
}

export default function Feedback() {
  const [values, setValues] = useState({ rating: 0, name: '', contact: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | whatsapp | error
  const [hover, setHover] = useState(0);

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`fb-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    if (!restaurant.feedbackEndpoint) {
      window.open(whatsappLink(feedbackText(values)), '_blank', 'noopener');
      setStatus('whatsapp');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(restaurant.feedbackEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, sentAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      setValues({ rating: 0, name: '', contact: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const shown = hover || values.rating;

  return (
    <section className="feedback section" id="feedback" aria-labelledby="feedback-title">
      <div className="container feedback__grid">
        <Reveal className="feedback__intro">
          <p className="eyebrow">Feedback</p>
          <h2 id="feedback-title" className="section-title">
            How was <em>your visit?</em>
          </h2>
          <p className="lede">
            Good or bad, we read every message. It goes straight to the team at Talia, not to a public review site.
          </p>
        </Reveal>

        <Reveal delay={80}>
          {status === 'sent' || status === 'whatsapp' ? (
            <div className="feedback__done" role="status">
              <div className="feedback__done-icon" aria-hidden="true">
                <Icon name="check" size={26} strokeWidth={2.2} />
              </div>
              <h3>{status === 'sent' ? 'Thank you, we got it.' : 'Almost there'}</h3>
              <p>
                {status === 'sent'
                  ? 'Your feedback has been sent to the Talia team.'
                  : 'WhatsApp opened with your message already written. Tap send there and it reaches us directly.'}
              </p>
              {status === 'whatsapp' && (
                <a className="btn btn--olive btn--sm" href={whatsappLink(feedbackText(values))} target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" size={16} /> Open WhatsApp again
                </a>
              )}
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setStatus('idle');
                  setValues({ rating: 0, name: '', contact: '', message: '' });
                }}
              >
                Write another message
              </button>
            </div>
          ) : (
            <form className="feedback__form" onSubmit={submit} noValidate>
              <fieldset className="field feedback__rating">
                <legend>
                  Your rating <span className="optional">(optional)</span>
                </legend>
                <div className="stars" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n} className={`star ${n <= shown ? 'is-on' : ''}`} onMouseEnter={() => setHover(n)}>
                      <input
                        type="radio"
                        name="rating"
                        value={n}
                        checked={values.rating === n}
                        onChange={() => setValues((v) => ({ ...v, rating: n }))}
                        className="visually-hidden"
                      />
                      <Icon name="star" size={30} strokeWidth={1.4} />
                      <span className="visually-hidden">
                        {n} {n === 1 ? 'star' : 'stars'}, {ratingWords[n]}
                      </span>
                    </label>
                  ))}
                  <span className="stars__word" aria-hidden="true">
                    {ratingWords[shown]}
                  </span>
                </div>
              </fieldset>

              <div className="feedback__row">
                <div className="field">
                  <label htmlFor="fb-name">
                    Name <span className="optional">(optional)</span>
                  </label>
                  <input id="fb-name" className="input" autoComplete="name" value={values.name} onChange={set('name')} />
                </div>
                <div className="field">
                  <label htmlFor="fb-contact">
                    Phone or email <span className="optional">(optional)</span>
                  </label>
                  <input
                    id="fb-contact"
                    className="input"
                    autoComplete="email"
                    value={values.contact}
                    onChange={set('contact')}
                    aria-invalid={errors.contact ? 'true' : undefined}
                    aria-describedby={errors.contact ? 'fb-contact-error' : 'fb-contact-hint'}
                  />
                  {errors.contact ? (
                    <p className="field-error" id="fb-contact-error">
                      {errors.contact}
                    </p>
                  ) : (
                    <p className="field-hint" id="fb-contact-hint">
                      Only if you&rsquo;d like us to get back to you.
                    </p>
                  )}
                </div>
              </div>

              <div className="field">
                <label htmlFor="fb-message">Your message</label>
                <textarea
                  id="fb-message"
                  className="input"
                  rows={4}
                  maxLength={1000}
                  value={values.message}
                  onChange={set('message')}
                  aria-invalid={errors.message ? 'true' : undefined}
                  aria-describedby={errors.message ? 'fb-message-error' : undefined}
                />
                {errors.message && (
                  <p className="field-error" id="fb-message-error">
                    {errors.message}
                  </p>
                )}
              </div>

              {status === 'error' && (
                <p className="field-error" role="alert">
                  We couldn&rsquo;t send that just now. Please try again, or message us on WhatsApp.
                </p>
              )}

              <div className="feedback__submit">
                <button type="submit" className="btn btn--wine" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : restaurant.feedbackEndpoint ? 'Send feedback' : 'Send via WhatsApp'}
                  {!restaurant.feedbackEndpoint && status !== 'sending' && <Icon name="whatsapp" size={18} />}
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
