import { cloneElement, useState } from 'react';
import { StarIcon } from './Icons.jsx';
import { restaurant, whatsappLink } from '../data/restaurant.js';

const EMPTY = { name: '', contact: '', rating: 0, message: '' };
const RATING_LABELS = ['', 'Poor', 'Could be better', 'Good', 'Very good', 'Excellent'];

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = 'Please tell us your name.';
  if (v.message.trim().length < 5) errors.message = 'A few words, so we know what to work on.';
  const c = v.contact.trim();
  if (c && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) && !/^\+?[\d\s-]{7,}$/.test(c)) {
    errors.contact = 'Enter a phone number or an email address, or leave it empty.';
  }
  return errors;
}

function toText(v) {
  const lines = ['Feedback for Sukun', `Name: ${v.name.trim()}`];
  if (v.contact.trim()) lines.push(`Contact: ${v.contact.trim()}`);
  if (v.rating) lines.push(`Rating: ${v.rating}/5`);
  lines.push('', v.message.trim());
  return lines.join('\n');
}

export default function Feedback() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | handed-off | error
  const [hover, setHover] = useState(0);

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

    if (!restaurant.feedbackEndpoint) {
      window.open(whatsappLink(toText(values)), '_blank', 'noopener');
      setStatus('handed-off');
      setValues(EMPTY);
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(restaurant.feedbackEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      setValues(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  const shown = hover || values.rating;

  return (
    <section id="feedback" className="feedback" aria-labelledby="feedback-title">
      <div className="container feedback__grid">
        <div className="feedback__intro" data-reveal>
          <p className="eyebrow">Feedback</p>
          <h2 id="feedback-title" className="section-title">
            How was your <em>visit?</em>
          </h2>
          <p>
            Good or bad, we read every message. If something wasn&rsquo;t right, tell us, and leave a number if
            you&rsquo;d like the team to get back to you.
          </p>
          <p className="feedback__alt">
            Rather talk? Call <a href={`tel:${restaurant.phones[0].tel}`}>{restaurant.phones[0].display}</a>.
          </p>
        </div>

        <form className="form" onSubmit={onSubmit} noValidate data-reveal>
          {status === 'sent' || status === 'handed-off' ? (
            <div className="form__done" role="status">
              <p className="form__done-title">Thank you.</p>
              <p>
                {status === 'sent'
                  ? 'Your feedback reached us. We appreciate you taking the time.'
                  : 'WhatsApp opened with your message ready. Just press send and it reaches the team.'}
              </p>
              <button type="button" className="btn btn--ghost" onClick={() => setStatus('idle')}>
                Write another
              </button>
            </div>
          ) : (
            <>
              <div className="form__row">
                <Field label="Name" error={errors.name} required>
                  <input name="name" type="text" autoComplete="name" value={values.name} onChange={set('name')} />
                </Field>
                <Field label="Phone or email" hint="Optional" error={errors.contact}>
                  <input
                    name="contact"
                    type="text"
                    autoComplete="tel"
                    placeholder="If you'd like a reply"
                    value={values.contact}
                    onChange={set('contact')}
                  />
                </Field>
              </div>

              <fieldset className="field rating" onMouseLeave={() => setHover(0)}>
                <legend className="field__label">
                  Rating <span className="field__hint">Optional</span>
                </legend>
                <div className="rating__stars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n} className={`rating__star ${n <= shown ? 'is-on' : ''}`} onMouseEnter={() => setHover(n)}>
                      <input
                        type="radio"
                        name="rating"
                        value={n}
                        checked={values.rating === n}
                        onChange={() => set('rating')(n)}
                        className="visually-hidden"
                      />
                      <StarIcon filled={n <= shown} width={26} height={26} />
                      <span className="visually-hidden">{n} out of 5, {RATING_LABELS[n]}</span>
                    </label>
                  ))}
                  <span className="rating__label" aria-hidden="true">{RATING_LABELS[shown]}</span>
                </div>
              </fieldset>

              <Field label="Your message" error={errors.message} required>
                <textarea name="message" rows={5} value={values.message} onChange={set('message')} />
              </Field>

              {status === 'error' && (
                <p className="form__error" role="alert">
                  Something went wrong sending that. Please try again, or reach us on WhatsApp.
                </p>
              )}

              <div className="form__foot">
                <button type="submit" className="btn btn--solid" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send feedback'}
                </button>
                {!restaurant.feedbackEndpoint && (
                  <p className="form__note">Sends through WhatsApp, straight to the café.</p>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({ label, hint, error, required, children }) {
  const id = `f-${children.props.name}`;
  const errId = `${id}-err`;
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required && <span className="field__req" aria-hidden="true"> *</span>}
        {hint && <span className="field__hint">{hint}</span>}
      </label>
      {cloneElement(children, {
        id,
        required,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errId : undefined,
      })}
      {error && (
        <p className="field__error" id={errId}>
          {error}
        </p>
      )}
    </div>
  );
}
