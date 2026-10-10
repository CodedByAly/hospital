import { asset } from '../lib/asset'
import { Link } from 'react-router-dom'
import { restaurant } from '../config/restaurant'
import { useLanguage } from '../context/LanguageContext'
import { useMeta } from '../hooks/useMeta'
import { useReveal } from '../hooks/useReveal'
import Icon from '../components/Icon'
import SocialLinks from '../components/SocialLinks'
import Visit from '../sections/Visit'
import './About.css'

export default function About() {
  const { t, pick, lang } = useLanguage()
  useMeta({ title: t('meta.aboutTitle'), description: t('about.p1'), path: '/about' })
  useReveal([lang])
  return (
    <>
      <section className="about-hero">
        <img className="about-hero__bg" src={asset('img/brand/adams-post.webp')} alt="" width="886" height="1106" />
        <div className="container about-hero__inner">
          <img className="about-hero__logo" src={asset('img/brand/logo-badge.png')} alt={restaurant.fullName} width="200" height="200" />
          <p className="about-hero__tagline">{pick(restaurant.tagline)}</p>
        </div>
      </section>

      <section className="section container about" aria-labelledby="about-title">
        <div className="about__copy reveal">
          <p className="eyebrow">{t('about.eyebrow')}</p>
          <h1 id="about-title" className="page-title">{t('about.title')}</h1>
          <p className="about__lead">{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <div className="about__ctas">
            <Link to="/menu" className="btn btn--primary">{t('common.viewMenu')} <Icon name="arrow" size={18} className="flip-rtl" /></Link>
          </div>
        </div>
        <aside className="about__aside reveal">
          <p className="about__quote">{t('about.global')}</p>
          <p className="muted">{t('about.follow')}</p>
          <SocialLinks className="about__social" showHandle />
        </aside>
      </section>

      <Visit showPhoto={false} id="about-visit" />
    </>
  )
}
