import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import Icon from './Icon';
import './BackToTop.css';

export default function BackToTop() {
  const { t } = useI18n();
  const { count } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? 'is-visible' : ''} ${count ? 'has-cart-bar' : ''}`}
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label={t('common.backToTop')}
      tabIndex={visible ? 0 : -1}
    >
      <Icon name="arrowUp" size={20} />
    </button>
  );
}
