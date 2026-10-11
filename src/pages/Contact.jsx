import { branches, site } from '../config/site.js';
import { formatPhone, telHref, whatsappHref } from '../lib/format.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import BranchCard from '../components/BranchCard.jsx';
import FeedbackForm from '../components/FeedbackForm.jsx';
import Icon, { InstagramIcon, WhatsAppIcon } from '../components/Icon.jsx';
import './Contact.css';

export default function Contact() {
  useDocumentMeta('Contact & Branches', "Phone numbers, WhatsApp and locations for Zaher's in Tyre, Hamra (Beirut) and Batroun.");

  return (
    <div className="contact">
      <header className="container contact__head">
        <p className="eyebrow">Contact</p>
        <h1 className="page-title">Talk to us</h1>
        <p className="contact__lede">The quickest way to reach us is your nearest branch. For anything else, WhatsApp or email works.</p>
      </header>

      <section className="container contact__quick" aria-label="Quick contact">
        <a className="quick" href={whatsappHref(site.whatsapp)} target="_blank" rel="noopener noreferrer">
          <span className="quick__icon quick__icon--wa"><WhatsAppIcon size={22} /></span>
          <span>
            <strong>WhatsApp</strong>
            <small>{formatPhone(site.whatsapp)}</small>
          </span>
        </a>
        <a className="quick" href={site.social.instagram.url} target="_blank" rel="noopener noreferrer">
          <span className="quick__icon"><InstagramIcon size={22} /></span>
          <span>
            <strong>Instagram</strong>
            <small>@{site.social.instagram.handle}</small>
          </span>
        </a>
        <a className="quick" href={`mailto:${site.email}`}>
          <span className="quick__icon"><Icon name="mail" size={22} /></span>
          <span>
            <strong>Email</strong>
            <small>{site.email}</small>
          </span>
        </a>
      </section>

      <section className="section section--tight" aria-labelledby="branches-title">
        <div className="container">
          <h2 id="branches-title" className="section-title">Branches</h2>
          <div className="branches-grid">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
          <p className="contact__phones">
            Calling? {branches.map((b, i) => (
              <span key={b.id}>
                {i > 0 && ' · '}
                {b.name} <a href={telHref(b.phone)}>{formatPhone(b.phone)}</a>
              </span>
            ))}
          </p>
        </div>
      </section>

      <section id="feedback" className="section feedback-section" aria-labelledby="feedback-title">
        <div className="container feedback-section__grid">
          <div>
            <p className="eyebrow">Feedback</p>
            <h2 id="feedback-title" className="section-title">How did we do?</h2>
            <p>
              Good or bad, tell us about your last order. If something went wrong with an order today, calling the branch is the fastest fix.
            </p>
          </div>
          <FeedbackForm />
        </div>
      </section>
    </div>
  );
}
