import { BRANCHES, EMAIL, INSTAGRAM } from '../data/menu.js'

const tel = (p) => `tel:+961${p.replace(/\s/g, '').replace(/^0/, '')}`

export default function Locations() {
  return (
    <section className="find" id="locations" aria-labelledby="find-title">
      <div className="wrap">
        <h2 id="find-title">Find us</h2>
        <p className="find__hours">From 11:30 AM till midnight, every day.</p>
        <div className="find__grid">
          {BRANCHES.map((b) => (
            <div key={b.id} className="branch">
              <span className="pill">{b.name}</span>
              <p className="branch__area">{b.area}</p>
              <ul className="branch__phones">
                {b.phones.map((p) => (
                  <li key={p}>
                    <a href={tel(p)}>{p}</a>
                  </li>
                ))}
              </ul>
              <a href={b.map} target="_blank" rel="noreferrer" className="link">
                Directions
              </a>
            </div>
          ))}
          <div className="branch branch--contact">
            <span className="pill pill--teal">Online</span>
            <ul className="branch__phones">
              <li>
                <a href={INSTAGRAM} target="_blank" rel="noreferrer">@taktawook</a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
