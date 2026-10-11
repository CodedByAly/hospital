import { useLanguage } from '../i18n/LanguageContext';
import useDocumentMeta from '../hooks/useDocumentMeta';
import restaurant from '../config/restaurant';
import { tr } from '../lib/format';
import { mailLink, telLink, whatsappLink } from '../lib/links';
import SocialLinks from '../components/SocialLinks';
import FeedbackForm from '../components/FeedbackForm';
import Hours from '../components/Hours';
import Reveal from '../components/Reveal';
import Icon from '../components/Icon';

export default function Contact() {
  const { t, lang } = useLanguage();
  const c = t.contact;
  useDocumentMeta(t.meta.contact, t.meta.contactDescription);

  return (
    <div className="contact">
      <section className="contact__top">
        <div className="container contact__grid">
          <div className="contact__intro">
            <h1 className="page-title page-title--xl">{c.title}</h1>
            <p className="contact__lead">{c.lead}</p>
            <div className="contact__ctas">
              <a href={whatsappLink()} className="btn btn--whatsapp btn--lg" target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" size={21} />
                {c.whatsappCta}
              </a>
              <a href={telLink} className="btn btn--outline btn--lg">
                <Icon name="phone" size={19} />
                <span dir="ltr">{restaurant.phone.display}</span>
              </a>
            </div>
          </div>

          <dl className="contact__list">
            <div className="contact__item">
              <dt><Icon name="pin" size={20} />{c.address}</dt>
              <dd>
                <address>{tr(restaurant.address, lang)}</address>
                <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer" className="link">{t.common.openMaps}</a>
              </dd>
            </div>
            <div className="contact__item">
              <dt><Icon name="phone" size={20} />{c.phone}</dt>
              <dd><a href={telLink} className="link" dir="ltr">{restaurant.phone.display}</a></dd>
            </div>
            <div className="contact__item">
              <dt><Icon name="whatsapp" size={20} />{c.whatsapp}</dt>
              <dd><a href={whatsappLink()} className="link" target="_blank" rel="noopener noreferrer" dir="ltr">+961 {restaurant.phone.display}</a></dd>
            </div>
            <div className="contact__item">
              <dt><Icon name="mail" size={20} />{c.email}</dt>
              <dd><a href={mailLink} className="link">{restaurant.email}</a></dd>
            </div>
            <div className="contact__item">
              <dt><Icon name="clock" size={20} />{c.hours}</dt>
              <dd><Hours /></dd>
            </div>
            <div className="contact__item">
              <dt><Icon name="link" size={20} />{c.social}</dt>
              <dd>
                <SocialLinks labels withWhatsApp={false} />
                <a href={restaurant.social.linktree} target="_blank" rel="noopener noreferrer" className="link" dir="ltr">linktr.ee/qambriseafood</a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="feedback" className="section feedback" aria-labelledby="feedback-title">
        <div className="container feedback__grid">
          <Reveal className="feedback__intro">
            <p className="sticker sticker--blue" lang="ar" aria-hidden={lang === 'ar' ? 'true' : undefined}>عندك تعليق، وصّينا يا ريس</p>
            <h2 id="feedback-title" className="section-title">{t.feedback.title}</h2>
            <p className="section-lead">{t.feedback.lead}</p>
          </Reveal>
          <Reveal delay={80}>
            <FeedbackForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
