import { menu } from '../data/menu'
import { useLanguage } from '../context/LanguageContext'
import MenuCard from '../components/MenuCard'
import './Favourites.css'

export default function Favourites() {
  const { t } = useLanguage()
  const featured = menu.filter((i) => i.featured && !['streets-smoothie', 'brown-sugar-bubble-tea', 'signature-milkshake'].includes(i.id))
  return (
    <section className="section favourites" aria-labelledby="fav-title">
      <div className="container">
        <div className="section__head reveal">
          <div>
            <p className="eyebrow">{t('sections.favourites')}</p>
            <h2 id="fav-title" className="section__title">{t('sections.favouritesTitle')}</h2>
          </div>
        </div>
        <div className="favourites__grid">
          {featured.map((item, i) => (
            <div key={item.id} className="reveal" style={{ '--i': i }}>
              <MenuCard item={item} layout="tile" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
