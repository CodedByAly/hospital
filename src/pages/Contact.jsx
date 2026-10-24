import Hours from '../components/Hours';
import FeedbackForm from '../components/FeedbackForm';
import { ClockIcon, InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '../components/Icons';
import Reveal from '../components/Reveal';
import { restaurant, socialLinks, telLink, whatsappLink } from '../data/restaurant';
import useDocumentMeta from '../hooks/useDocumentMeta';

export default function Contact() {
  useDocumentMeta(
    'Contact',
    `Call or WhatsApp Chicago Burgers on ${restaurant.phone.international}. Gallery Semaan, Kamil Shamoun Blvd, Keserwani Center, Beirut.`,
  );

  return (
    <>
      <header className="page-hero on-dark">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1 className="display h1">
            Call, message
            <br />
            <span className="accent">or come by</span>
          </h1>
        </div>
      </header>

      <section className="section contact">
        <div className="container contact__grid">
          <Reveal className="contact__cards">
            <a href={telLink} className="contact-card">
              <PhoneIcon />
              <span>
                <span className="contact-card__label">Phone</span>
                <span className="contact-card__value">{restaurant.phone.international}</span>
              </span>
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="contact-card contact-card--wa">
              <WhatsAppIcon />
              <span>
                <span className="contact-card__label">WhatsApp</span>
                <span className="contact-card__value">{restaurant.whatsapp.display}</span>
              </span>
            </a>
            {socialLinks.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="contact-card">
                <InstagramIcon />
                <span>
                  <span className="contact-card__label">{s.label}</span>
                  <span className="contact-card__value">{s.handle}</span>
                </span>
              </a>
            ))}
            <div className="contact-card contact-card--static">
              <ClockIcon />
              <span>
                <span className="contact-card__label">Hours</span>
                <Hours />
              </span>
            </div>
          </Reveal>

          <Reveal className="contact__map" delay={80}>
            <div className="contact__map-frame">
              <iframe
                title={`Map showing ${restaurant.address.street}`}
                src={restaurant.address.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="contact__address">
              <PinIcon />
              <address>
                {restaurant.address.lines.join(', ')}
                <br />
                {restaurant.city}, {restaurant.country}
              </address>
              <a href={restaurant.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn--dark">
                Directions
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section feedback on-dark" aria-labelledby="feedback-title">
        <div className="container feedback__grid">
          <Reveal>
            <p className="eyebrow">Feedback</p>
            <h2 id="feedback-title" className="display h2">
              Tell us how
              <br />
              it went
            </h2>
            <p className="lede">Good or bad, we want to hear it. If something was off with an order, include your order number.</p>
          </Reveal>
          <Reveal delay={80}>
            <FeedbackForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
