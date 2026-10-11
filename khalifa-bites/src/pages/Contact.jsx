import useDocumentMeta from '../hooks/useDocumentMeta';
import restaurant from '../config/restaurant';
import { telLink, whatsappLink } from '../lib/links';
import SocialLinks from '../components/SocialLinks';
import FeedbackForm from '../components/FeedbackForm';
import Hours from '../components/Hours';
import Reveal from '../components/Reveal';
import Icon from '../components/Icon';

export default function Contact() {
  useDocumentMeta('Contact', 'Call or WhatsApp Khalifa Bites on 76 086 068, or find us in Saida. Send us your feedback.');
  return (
    <div className="contact">
      <section className="contact__top">
        <div className="container contact__grid">
          <div>
            <h1 className="page-title page-title--xl">Contact</h1>
            <p className="contact__lead">The fastest way to reach us is a call or a WhatsApp message to {restaurant.phone.display}.</p>
            <div className="contact__ctas">
              <a href={whatsappLink()} className="btn btn--whatsapp btn--lg" target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" size={21} /> Message us on WhatsApp
              </a>
              <a href={telLink} className="btn btn--outline btn--lg">
                <Icon name="phone" size={19} /> {restaurant.phone.display}
              </a>
            </div>
          </div>

          <dl className="contact__list">
            <div className="contact__item">
              <dt><Icon name="pin" size={20} />Address</dt>
              <dd>
                <address>{restaurant.address.full}</address>
                <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer" className="link">Open in Google Maps</a>
              </dd>
            </div>
            <div className="contact__item">
              <dt><Icon name="phone" size={20} />Phone</dt>
              <dd><a href={telLink} className="link">{restaurant.phone.display}</a></dd>
            </div>
            <div className="contact__item">
              <dt><Icon name="whatsapp" size={20} />WhatsApp</dt>
              <dd><a href={whatsappLink()} className="link" target="_blank" rel="noopener noreferrer">+961 {restaurant.phone.display}</a></dd>
            </div>
            <div className="contact__item">
              <dt><Icon name="clock" size={20} />Hours</dt>
              <dd><Hours /></dd>
            </div>
            <div className="contact__item">
              <dt><Icon name="link" size={20} />Social</dt>
              <dd><SocialLinks labels withWhatsApp={false} /></dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="feedback" className="section feedback" aria-labelledby="feedback-title">
        <div className="container feedback__grid">
          <Reveal>
            <p className="eyebrow">Feedback</p>
            <h2 id="feedback-title" className="section-title">Tell us how it was.</h2>
            <p className="section-lead">Loved it or not, we want to hear it. Your message comes straight to us.</p>
          </Reveal>
          <Reveal delay={80}>
            <FeedbackForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
