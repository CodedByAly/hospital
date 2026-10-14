import { Link } from 'react-router-dom'
import { copy as t } from '../content/copy'
import { restaurant } from '../config/restaurant'
import { itemsByCategory } from '../data/menu'
import { clock, num } from '../utils/format'
import { usePageMeta } from '../hooks/usePageMeta'
import { Reveal } from '../components/Reveal'
import { TiltCard } from '../components/TiltCard'
import { imageUrl } from '../components/FoodImage'
import { Icon } from '../components/Icon'
import './About.css'

const COLLAGE = ['kukus-chix', 'abou-kukus-combo', 'shroom-lord', 'holy-stripinity']

export default function About() {
  usePageMeta(t.about.title, 'Kuku Chix Joint is a fried chicken spot in Khaldeh, Lebanon — Nashville chix, strips, wings, mac n cheese and burgers.')

  const facts = [
    { k: t.about.factHours, v: `${clock(restaurant.hours.open)} – ${clock(restaurant.hours.close)}` },
    { k: t.about.factPickup, v: restaurant.ordering.pickup ? t.about.yes : '—' },
    { k: t.about.factDelivery, v: restaurant.ordering.delivery ? t.about.yes : '—' },
    { k: t.about.factSauces, v: num(itemsByCategory('sauce-boss').length) },
  ]

  return (
    <div className="about">
      <section className="about__hero">
        <div className="container about__grid">
          <Reveal className="about__copy">
            <p className="eyebrow">{restaurant.tagline}</p>
            <h1 className="display">{t.about.title}</h1>
            <p className="about__lead">{t.about.lead}</p>
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <Link to="/menu" className="btn btn--yellow">
              {t.hero.ctaMenu} <Icon name="arrow" />
            </Link>
          </Reveal>
          <div className="about__collage" aria-hidden="true">
            {COLLAGE.map((id, i) => (
              <Reveal key={id} delay={i * 0.08} className={`about__tile about__tile--${i}`}>
                <TiltCard max={10}>
                  <img src={imageUrl(id)} alt="" loading={i < 2 ? 'eager' : 'lazy'} width="680" height="680" />
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container about__facts">
        {facts.map((f, i) => (
          <Reveal key={f.k} delay={i * 0.06} className="fact">
            <dt>{f.k}</dt>
            <dd>{f.v}</dd>
          </Reveal>
        ))}
      </section>
    </div>
  )
}
