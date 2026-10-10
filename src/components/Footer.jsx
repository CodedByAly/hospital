import { Link } from 'react-router-dom'
import { restaurant, whatsappLink } from '../config/restaurant'
import { useLanguage } from '../context/LanguageContext'
import { NAV } from './Header'
import Hours from './Hours'
import Icon from './Icon'
import SocialLinks from './SocialLinks'
import './Footer.css'

export default function Footer() {
  const { t, pick } = useLanguage()
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <img src="/img/brand/logo-mark-white.png" alt={restaurant.fullName} width="150" height="116" loading="lazy" />
          <p>{t('footer.blurb')}</p>
          <SocialLinks className="site-footer__social" />
        </div>

        <nav aria-label={t('footer.explore')}>
          <h2 className="site-footer__title">{t('footer.explore')}</h2>
          <ul className="site-footer__list">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to}>{t(`nav.${n.key}`)}</Link></li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="site-footer__title">{t('footer.visit')}</h2>
          <ul className="site-footer__list site-footer__contact">
            <li>
              <Icon name="pin" size={18} />
              <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">{pick(restaurant.address)}</a>
            </li>
            <li>
              <Icon name="phone" size={18} />
              <a href={`tel:${restaurant.phone}`} dir="ltr">{restaurant.phoneDisplay}</a>
            </li>
            <li>
              <Icon name="whatsapp" size={18} />
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">{t('common.whatsapp')}</a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="site-footer__title">{t('info.hours')}</h2>
          <Hours className="site-footer__hours" />
        </div>
      </div>
      <div className="container site-footer__base">
        <p>© {new Date().getFullYear()} {restaurant.fullName}. {t('footer.rights')}</p>
        <p className="site-footer__tagline">{pick(restaurant.tagline)}</p>
      </div>
    </footer>
  )
}
