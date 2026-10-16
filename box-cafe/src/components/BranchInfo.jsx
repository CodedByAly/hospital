import { branches } from '../data/branches';
import { BoxCafeLogo } from './Logo';
import Icon from './Icon';
import './BranchInfo.css';

export default function BranchInfo({ branch, brand, onChangeBranch }) {
  const others = branches.filter((b) => b.id !== branch.id);

  return (
    <footer className="info">
      <div className="wrap info__grid">
        <div className="info__here">
          <p className="info__label">You&rsquo;re at</p>
          <h2 className="info__name">Box Cafe {branch.name}</h2>
          {branch.hours ? (
            <ul className="info__hours">
              {branch.hours.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          ) : null}
          <div className="info__actions">
            <a className="btn btn--yellow" href={branch.mapsUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="pin" size={18} /> Directions
            </a>
            <button type="button" className="btn btn--ghost info__ghost" onClick={onChangeBranch}>
              Change branch
            </button>
          </div>
        </div>

        <div className="info__col">
          <h3>Contact</h3>
          <p className="info__phone">{brand.phoneDisplay}</p>
          <a className="info__link" href={`tel:${brand.phone}`}>
            <Icon name="phone" size={16} /> Call
          </a>
          <a className="info__link" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">
            <Icon name="instagram" size={16} /> {brand.instagram.handle}
          </a>
          {branch.boxBun && (
            <a className="info__link" href={brand.boxBunInstagram.url} target="_blank" rel="noopener noreferrer">
              <Icon name="instagram" size={16} /> {brand.boxBunInstagram.handle}
            </a>
          )}
        </div>

        <div className="info__col">
          <h3>Other branches</h3>
          {others.map((b) => (
            <a key={b.id} className="info__link" href={b.mapsUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="pin" size={16} /> {b.name}
            </a>
          ))}
        </div>
      </div>
      <div className="wrap info__bottom">
        <BoxCafeLogo className="info__logo" decorative />
        <p>{brand.by}</p>
      </div>
    </footer>
  );
}
