import { Clock, MapPin, MessageCircle, Navigation } from 'lucide-react'
import Instagram from '../components/InstagramIcon'
import { lines, mapsEmbed, mapsUrl, restaurant, whatsappLink } from '../config/restaurant'
import './Visit.css'

function Hours() {
  if (!restaurant.hours?.length) {
    return <p className="muted">Hours aren't listed yet. Message either line on WhatsApp to check before you come.</p>
  }
  return (
    <dl className="visit__hours">
      {restaurant.hours.map((h) => (
        <div key={h.days}>
          <dt>{h.days}</dt>
          <dd>{h.closed ? 'Closed' : `${h.open} – ${h.close}`}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Where to find the restaurant and how to reach it. Used on Home and Visit. */
export default function Visit({ headingLevel = 2, id = 'visit' }: { headingLevel?: 1 | 2; id?: string }) {
  const H = headingLevel === 1 ? 'h1' : 'h2'
  return (
    <section className="visit" aria-labelledby={`${id}-title`}>
      <div className="container visit__grid">
        <div className="visit__copy">
          <p className="mark mark--ember">Visit</p>
          <H id={`${id}-title`} className="visit__title">On the Mansourieh main road, facing the municipality.</H>

          <div className="visit__block">
            <h3 className="mark"><MapPin size={14} aria-hidden="true" /> Address</h3>
            <p>{restaurant.address}, {restaurant.locality}</p>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="link-arrow">
              <Navigation size={15} aria-hidden="true" /> Get directions
            </a>
          </div>

          <div className="visit__block">
            <h3 className="mark"><MessageCircle size={14} aria-hidden="true" /> WhatsApp &amp; phone</h3>
            <p className="muted">Two lines, both take orders.</p>
            <div className="visit__lines">
              {lines.map((l) => (
                <a key={l.id} href={whatsappLink(l)} target="_blank" rel="noopener noreferrer" className="btn btn--wasabi">
                  {l.display}
                </a>
              ))}
            </div>
          </div>

          <div className="visit__block">
            <h3 className="mark"><Clock size={14} aria-hidden="true" /> Hours</h3>
            <Hours />
          </div>

          <div className="visit__block">
            <h3 className="mark">Services</h3>
            <p>{restaurant.services.join(' · ')}</p>
            <a href={restaurant.instagram.url} target="_blank" rel="noopener noreferrer" className="link-arrow">
              <Instagram size={15} /> {restaurant.instagram.handle}
            </a>
          </div>
        </div>

        <div className="visit__map">
          <iframe title={`Map showing ${restaurant.name}`} src={mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </section>
  )
}
