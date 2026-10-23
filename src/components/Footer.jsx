import { Link } from 'react-router-dom'
import { phoneLink, restaurant, whatsappLink } from '../config/restaurant'
import { useI18n } from '../i18n/I18nProvider'
import HoursList from './HoursList'
import Logo from './Logo'
import SocialLinks from './SocialLinks'
import Icon from './Icon'
import { navItems } from './Header'
import './Footer.css'

export default function Footer() {
  const { t, pick } = useI18n()
  const address = pick(restaurant.address)

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo size={76} />
          <p className="site-footer__tagline">{pick(restaurant.tagline)}</p>
          <p className="site-footer__blurb">{t('footer.blurb')}</p>
          <SocialLinks size={20} />
        </div>

        <nav aria-label={t('footer.explore')}>
          <h2 className="site-footer__title">{t('footer.explore')}</h2>
          <ul className="site-footer__list">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link to={item.to}>{t(`nav.${item.key}`)}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="site-footer__title">{t('footer.visit')}</h2>
          <address className="site-footer__address">
            {address.area}
            <br />
            {address.street}
            <br />
            {address.landmark}
          </address>
          <a className="site-footer__map" href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="pin" size={16} /> {t('home.directions')}
          </a>
          <HoursList className="site-footer__hours" />
        </div>

        <div>
          <h2 className="site-footer__title">{t('footer.reach')}</h2>
          <ul className="site-footer__list">
            <li>
              <a href={phoneLink}>
                <span className="num">{restaurant.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                {t('common.whatsapp')}
              </a>
            </li>
            <li>
              <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>
          © <span className="num">{new Date().getFullYear()}</span> Moods Burger. {t('footer.rights')}
        </p>
        <button type="button" className="site-footer__top" onClick={() => window.scrollTo({ top: 0 })}>
          {t('footer.top')} <Icon name="arrowUp" size={16} />
        </button>
      </div>
    </footer>
  )
}
