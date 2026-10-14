import { restaurant, whatsappLink } from '../config/restaurant'
import { useLang } from '../i18n/LanguageProvider'
import { Icon, type IconName } from './Icon'

/** Only renders platforms that have a real link in the config. */
export function SocialLinks({ className = '', withWhatsapp = false }: { className?: string; withWhatsapp?: boolean }) {
  const { t } = useLang()
  const links: { name: IconName; href: string; label: string }[] = []
  if (restaurant.socials.instagram) links.push({ name: 'instagram', href: restaurant.socials.instagram, label: t.social.instagram })
  if (restaurant.socials.facebook) links.push({ name: 'facebook', href: restaurant.socials.facebook, label: t.social.facebook })
  if (restaurant.socials.tiktok) links.push({ name: 'tiktok', href: restaurant.socials.tiktok, label: t.social.tiktok })
  if (withWhatsapp) links.push({ name: 'whatsapp', href: whatsappLink(), label: t.social.whatsapp })

  return (
    <ul className={`socials ${className}`}>
      {links.map((s) => (
        <li key={s.name}>
          <a className="icon-btn" href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>
            <Icon name={s.name} />
          </a>
        </li>
      ))}
    </ul>
  )
}
