import { useEffect, useState } from 'react';
import { useUI } from '../context/UIContext';
import { whatsappLink } from '../data/restaurant';
import Icon from './Icon';
import './MobileDock.css';

const tabs = [
  { id: 'top', label: 'Home', icon: 'home' },
  { id: 'menu', label: 'Menu', icon: 'book' },
  { id: 'visit', label: 'Visit', icon: 'pin' },
];

// Thumb-reach navigation for phones.
export default function MobileDock() {
  const { focusSearch } = useUI();
  const [active, setActive] = useState('top');

  useEffect(() => {
    const ids = ['top', 'menu', 'about', 'visit'];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!('IntersectionObserver' in window) || sections.length === 0) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id === 'about' ? 'visit' : e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="dock" aria-label="Quick navigation">
      <div className="dock__tabs">
        {tabs.map((t) => (
          <a key={t.id} href={`#${t.id}`} className={`dock__tab ${active === t.id ? 'is-active' : ''}`} aria-current={active === t.id ? 'true' : undefined}>
            <Icon name={t.icon} size={22} />
            <span>{t.label}</span>
          </a>
        ))}
        <button type="button" className="dock__tab" onClick={focusSearch}>
          <Icon name="search" size={22} />
          <span>Search</span>
        </button>
      </div>
      <a className="dock__order" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Message Talia on WhatsApp">
        <Icon name="whatsapp" size={22} />
        <span className="dock__order-text">Chat</span>
      </a>
    </nav>
  );
}
