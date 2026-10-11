import { branches, site } from '../config/site.js';
import { formatPhone, mapsHref, telHref, whatsappHref } from '../lib/format.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import SectionTitle from '../components/SectionTitle.jsx';
import FeedbackForm from '../components/FeedbackForm.jsx';
import HoursList from '../components/HoursList.jsx';
import Icon, { InstagramIcon, WhatsAppIcon } from '../components/Icon.jsx';
import OpenStatus from '../components/OpenStatus.jsx';
import Reveal from '../components/Reveal.jsx';
import './Contact.css';

const branch = branches[0];

export default function Contact() {
  useDocumentMeta('Contact', 'Call, WhatsApp or visit Burger Bar on Al-Manara main road, West Bekaa. Opening hours and directions.');

  return (
    <div className="contact">
      <header className="container contact__head">
        <h1 className="page-title">Contact</h1>
        <OpenStatus className="contact__status" />
      </header>

      <section className="container contact__quick" aria-label="Quick contact">
        <a className="quick" href={telHref(branch.phone)}>
          <span className="quick__icon"><Icon name="phone" size={22} /></span>
          <span>
            <strong>Call</strong>
            <small>{formatPhone(branch.phone)}</small>
          </span>
        </a>
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
      </section>

      <section className="section section--tight" aria-labelledby="visit-title">
        <div className="container contact__visit">
          <Reveal className="contact__card">
            <SectionTitle id="visit-title" className="section-title--sm">Location</SectionTitle>
            <p className="contact__address">{branch.address}</p>
            <p className="contact__modes">Dine-in · Delivery · Takeaway</p>
            <a className="btn btn--primary" href={mapsHref(branch)} target="_blank" rel="noopener noreferrer">
              <Icon name="pin" size={18} /> Open in Google Maps
            </a>
          </Reveal>
          <Reveal className="contact__card" delay={80}>
            <h2 className="section-title section-title--sm">Opening hours</h2>
            <HoursList />
          </Reveal>
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
