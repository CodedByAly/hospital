import { branches, site } from '../config/site.js';
import { formatPhone, whatsappHref } from '../lib/format.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import SectionTitle from '../components/SectionTitle.jsx';
import BranchCard from '../components/BranchCard.jsx';
import FeedbackForm from '../components/FeedbackForm.jsx';
import Icon, { InstagramIcon, WhatsAppIcon } from '../components/Icon.jsx';
import './Contact.css';

export default function Contact() {
  useDocumentMeta('Contact & Branches', "Phone numbers, WhatsApp and locations for Zaher's in Tyre, Hamra (Beirut) and Batroun.");

  return (
    <div className="contact">
      <header className="container contact__head">
        <h1 className="page-title">Contact</h1>
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
          <SectionTitle id="branches-title">Branches</SectionTitle>
          <div className="branches-grid">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      </section>

      <section id="feedback" className="section feedback-section" aria-labelledby="feedback-title">
        <div className="container feedback-section__grid">
          <div>
            <SectionTitle id="feedback-title">Feedback</SectionTitle>
            <p>Tell us about your last order.</p>
          </div>
          <FeedbackForm />
        </div>
      </section>
    </div>
  );
}
