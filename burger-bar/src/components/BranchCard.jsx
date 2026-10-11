import { formatPhone, mapsHref, telHref, whatsappHref } from '../lib/format.js';
import HoursList from './HoursList.jsx';
import Icon, { WhatsAppIcon } from './Icon.jsx';
import './BranchCard.css';

export default function BranchCard({ branch, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const services = [branch.pickup && 'Pickup', branch.delivery && 'Delivery'].filter(Boolean).join(' · ');
  return (
    <article className="branch">
      <p className="branch__area">{branch.area}</p>
      <Heading className="branch__name">{branch.name}</Heading>
      <ul className="branch__facts">
        <li>
          <Icon name="pin" size={18} />
          <span>{branch.address}</span>
        </li>
        <li>
          <Icon name="phone" size={18} />
          <a href={telHref(branch.phone)}>{formatPhone(branch.phone)}</a>
        </li>
        <li>
          <Icon name="clock" size={18} />
          <HoursList branch={branch} />
        </li>
        {services && (
          <li>
            <Icon name="store" size={18} />
            <span>{services}</span>
          </li>
        )}
      </ul>
      <div className="branch__actions">
        <a className="btn btn--outline btn--sm" href={telHref(branch.phone)}>
          <Icon name="phone" size={16} /> Call
        </a>
        {branch.whatsapp && (
          <a className="btn btn--outline btn--sm" href={whatsappHref(branch.whatsapp)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={16} /> WhatsApp
          </a>
        )}
        <a className="btn btn--ghost btn--sm" href={mapsHref(branch)} target="_blank" rel="noopener noreferrer">
          <Icon name="pin" size={16} /> Map
        </a>
      </div>
    </article>
  );
}
