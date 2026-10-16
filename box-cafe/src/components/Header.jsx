import { useEffect, useState } from 'react';
import { brand } from '../data/branches';
import { BoxCafeLogo } from './Logo';
import Icon from './Icon';
import './Header.css';

export default function Header({ branch, onChangeBranch }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap header__inner">
        <a href="#top" className="header__logo" aria-label="Box Cafe, back to top">
          <BoxCafeLogo decorative />
        </a>
        {branch && (
          <button type="button" className="header__branch" onClick={onChangeBranch} aria-label={`Branch: ${branch.name}. Change branch`}>
            <Icon name="pin" size={16} />
            <span>{branch.name}</span>
            <span className="header__change">Change</span>
          </button>
        )}
        <a className="header__ig" href={brand.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Box Cafe on Instagram">
          <Icon name="instagram" size={22} />
        </a>
      </div>
    </header>
  );
}
