import { useLanguage } from '../i18n/LanguageContext';
import { formatPrice } from '../lib/format';

export default function Price({ value, className = '' }) {
  const { lang } = useLanguage();
  return (
    <span className={`price ${className}`} dir="ltr">
      {formatPrice(value, lang)}
    </span>
  );
}
