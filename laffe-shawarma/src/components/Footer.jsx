import { Link } from 'react-router-dom'
import { phoneLink, restaurant } from '../config/restaurant'
import { useLang } from '../i18n/LanguageContext'
import { NAV } from './Header'
import Logo from './Logo'
import SocialLinks from './SocialLinks'

export default function Footer() {
  const { t, pick } = useLang()
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo size={72} />
          <p className="site-footer__name">{pick(restaurant.name)}</p>
          <p className="site-footer__desc">{pick(restaurant.description)}</p>
          <SocialLinks className="site-footer__social" />
        </div>

        <nav aria-label={t('footer.site')}>
          <h2 className="site-footer__heading">{t('footer.site')}</h2>
          <ul className="site-footer__list">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{t(item.key)}</Link>
              </li>
            ))}
            <li>
              <Link to="/checkout">{t('nav.checkout')}</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="site-footer__heading">{t('footer.contact')}</h2>
          <ul className="site-footer__list">
            <li>
              <a href={phoneLink} dir="ltr">
                {restaurant.phone.display}
              </a>
            </li>
            <li>
              <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                {pick(restaurant.address)}
              </a>
            </li>
            <li>
              <a href={restaurant.social.instagram.url} target="_blank" rel="noopener noreferrer" dir="ltr">
                @{restaurant.social.instagram.handle}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="site-footer__heading">{t('footer.hours')}</h2>
          <p className="site-footer__hours">{pick(restaurant.hoursLabel)}</p>
          <p className="muted-light">{t('footer.services')}</p>
        </div>
      </div>

      <div className="container site-footer__base">
        <p>
          © {new Date().getFullYear()} {pick(restaurant.name)}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}
