import { ArrowUpRight, Clock, MapPin, Phone } from 'lucide-react'
import { BRANCHES } from '../data/menu.js'
import OpenBadge from './OpenBadge.jsx'

const tel = (p) => `tel:+961${p.replace(/\s/g, '').replace(/^0/, '')}`

export default function Locations() {
  return (
    <section className="locations section" id="locations" aria-labelledby="loc-title">
      <div className="container">
        <header className="section__head reveal">
          <p className="eyebrow">Come hungry</p>
          <h2 id="loc-title">Find a Taktawook</h2>
        </header>

        <div className="loc__grid">
          {BRANCHES.map((b, i) => (
            <article key={b.id} className={`branch branch--${i} reveal`}>
              <div className="branch__top">
                <h3>{b.name}</h3>
                <OpenBadge />
              </div>
              <p className="branch__row">
                <MapPin size={20} aria-hidden="true" /> {b.area}
              </p>
              <p className="branch__row">
                <Clock size={20} aria-hidden="true" /> Daily, 11:30 AM until midnight
              </p>
              <div className="branch__phones">
                {b.phones.map((p) => (
                  <a key={p} href={tel(p)} className="phone">
                    <Phone size={18} aria-hidden="true" /> {p}
                  </a>
                ))}
              </div>
              <a href={b.map} target="_blank" rel="noreferrer" className="btn btn--dark btn--small">
                Get directions <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
