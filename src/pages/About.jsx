import { Link } from 'react-router-dom'
import { phoneLink, restaurant, whatsappLink } from '../config/restaurant'
import { usePageMeta } from '../hooks/usePageMeta'
import OpenStatus from '../components/OpenStatus'
import Reveal from '../components/Reveal'
import SocialLinks from '../components/SocialLinks'
import logoMark from '../assets/images/logo-mark.webp'

export default function About() {
  usePageMeta('من نحن', `${restaurant.name} — ${restaurant.description}`)
  const { pickup, delivery } = restaurant.ordering

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow eyebrow--ember">من نحن</p>
          <h1 className="page-title">{restaurant.name}</h1>
          <p className="page-lead">{restaurant.tagline}</p>
        </div>
      </header>

      <section className="section">
        <div className="container about">
          <Reveal className="about__copy">
            <h2 className="section-title">المنقل هو الأساس</h2>
            <p>
              اسمنا من شغلنا: {restaurant.name}. منيو قصير وواضح أساسه المنقل: شقف غنم وبقر، كباب، طاووق أحمر وأبيض، سجق،
              مقانق، بيض غنم وحلويات، وبرغر وبطاطا.
            </p>
            <p>
              وإذا كنتو جمعة، في الوجبة والجاط العائلي: شقف وكباب وطاووق مع الثوم والكبيس والحمص وسلطة الملفوف، كلو بجاط واحد.
            </p>
            <div className="about__actions">
              <Link to="/menu" className="btn btn--primary">
                شوف المنيو
              </Link>
              <a href={whatsappLink()} className="btn btn--outline" target="_blank" rel="noopener noreferrer">
                راسلنا
              </a>
            </div>
          </Reveal>
          <Reveal className="about__mark" delay={80}>
            <img src={logoMark} alt={`شعار ${restaurant.name}`} width="258" height="301" loading="lazy" />
          </Reveal>
        </div>
      </section>

      <section className="section section--paper2" aria-labelledby="info-title">
        <div className="container">
          <h2 id="info-title" className="section-title">
            معلومات المطعم
          </h2>
          <dl className="info-grid">
            <Reveal className="info-grid__item">
              <dt>الدوام</dt>
              <dd>
                {restaurant.hoursLabel}
                <OpenStatus className="info-grid__status" />
              </dd>
            </Reveal>
            <Reveal className="info-grid__item" delay={60}>
              <dt>الطلبات</dt>
              <dd>
                {[delivery && 'توصيل', pickup && 'استلام من المحل'].filter(Boolean).join(' · ')}
                <br />
                <a href={phoneLink} dir="ltr">
                  {restaurant.phone.display}
                </a>
              </dd>
            </Reveal>
            <Reveal className="info-grid__item" delay={120}>
              <dt>الموقع</dt>
              <dd>
                {restaurant.address && <span>{restaurant.address}<br /></span>}
                <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                  افتح على خرائط Google
                </a>
              </dd>
            </Reveal>
            <Reveal className="info-grid__item" delay={180}>
              <dt>تابعنا</dt>
              <dd>
                <SocialLinks withLabels />
              </dd>
            </Reveal>
          </dl>
        </div>
      </section>
    </>
  )
}
