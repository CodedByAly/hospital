import { Link } from 'react-router-dom'
import { categories, imageUrl, itemsIn } from '../data/menu'
import { useLanguage } from '../context/LanguageContext'
import Icon from '../components/Icon'
import './CategoryRail.css'

export default function CategoryRail() {
  const { t, pick } = useLanguage()
  return (
    <section className="section cat-rail" aria-labelledby="browse-title">
      <div className="container section__head reveal">
        <div>
          <p className="eyebrow">{t('sections.browse')}</p>
          <h2 id="browse-title" className="section__title">{t('sections.browseTitle')}</h2>
        </div>
        <Link to="/menu" className="link-arrow">
          {t('common.viewMenu')} <Icon name="arrow" size={18} className="flip-rtl" />
        </Link>
      </div>
      <ul className="cat-rail__list container">
        {categories.map((c, i) => (
          <li key={c.id} className="reveal" style={{ '--i': i }}>
            <Link to={`/menu#${c.id}`} className="cat-tile">
              <img src={imageUrl(c.cover)} alt="" loading="lazy" decoding="async" width="320" height="400" />
              <span className="cat-tile__name">{pick(c.name)}</span>
              <span className="cat-tile__count">{t('menu.items', { count: itemsIn(c.id).length })}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
