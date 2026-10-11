import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import Icon from './Icon';

export default function BackToTop() {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`to-top ${show ? 'is-shown' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t.common.backToTop}
      tabIndex={show ? 0 : -1}
    >
      <Icon name="up" size={20} />
    </button>
  );
}
