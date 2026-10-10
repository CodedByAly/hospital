import { asset } from '../lib/asset'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useItemDialog } from '../context/ItemContext'
import FloatStage from '../components/FloatStage'
import Icon from '../components/Icon'
import { burgerHero } from './floatSets'
import './Hero.css'

export default function Hero() {
  const { t } = useLanguage()
  const { openItem } = useItemDialog()

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner container">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--light hero__eyebrow">{t('hero.eyebrow')}</p>
          <h1 id="hero-title" className="hero__title">{t('hero.title')}</h1>
          <p className="hero__lead">{t('hero.lead')}</p>
          <div className="hero__ctas">
            <Link to="/menu" className="btn btn--accent btn--lg">
              {t('hero.primary')}
              <Icon name="arrow" className="flip-rtl" />
            </Link>
            <Link to="/menu" className="btn btn--ghost-light btn--lg">{t('hero.secondary')}</Link>
          </div>
          <ul className="hero__modes" aria-label={t('modes.title')}>
            <li><Icon name="table" size={18} />{t('modes.dineIn')}</li>
            <li><Icon name="walk" size={18} />{t('modes.pickup')}</li>
            <li><Icon name="scooter" size={18} />{t('modes.delivery')}</li>
            <li><Icon name="wallet" size={18} />{t('modes.payment')}</li>
          </ul>
        </div>

        <div className="hero__stage-wrap">
          <FloatStage
            className="hero__stage"
            priority
            items={burgerHero}
            subject={{ src: asset('img/float/adams-burger.webp'), alt: t('hero.stageCaption'), width: 900, height: 684 }}
          >
            <span className="hero__arch" aria-hidden="true">
              <span className="hero__word" dir="ltr">Adam’s</span>
            </span>
            <span className="hero__ground" aria-hidden="true" />
          </FloatStage>
          <button type="button" className="hero__tag" onClick={() => openItem('adams-burger')}>
            <span className="hero__tag-name">{t('hero.stageCaption')}</span>
            <span className="hero__tag-note">{t('hero.stageNote')}</span>
            <span className="hero__tag-add" aria-hidden="true"><Icon name="plus" size={16} /></span>
          </button>
        </div>
      </div>
    </section>
  )
}
