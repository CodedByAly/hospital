import { site } from '../config/site.js';
import { whatsappHref } from '../lib/format.js';
import { InstagramIcon, WhatsAppIcon } from './Icon.jsx';

// Only platforms configured in site.social are rendered.
export default function SocialLinks({ className = '', withLabels = false }) {
  const links = [];
  if (site.social.instagram) links.push({ href: site.social.instagram.url, label: `@${site.social.instagram.handle}`, name: 'Instagram', icon: <InstagramIcon /> });
  if (site.whatsapp) links.push({ href: whatsappHref(site.whatsapp), label: 'WhatsApp', name: 'WhatsApp', icon: <WhatsAppIcon /> });

  return (
    <ul className={`social-links ${className}`}>
      {links.map((link) => (
        <li key={link.name}>
          <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={withLabels ? undefined : `Burger Bar on ${link.name}`}>
            {link.icon}
            {withLabels && <span>{link.label}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
