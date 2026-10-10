import { Clock, MapPin, MessageCircle, Utensils } from 'lucide-react'
import FlyingItems from './FlyingItems.jsx'
import FootprintTrail from './FootprintTrail.jsx'

const POINTS = [
  { icon: Utensils, title: 'The original taste', text: 'Lebanese tawook the way it should be: marinated, grilled and wrapped with garlic sauce.' },
  { icon: MapPin, title: 'Two homes', text: 'Find us in Sarba, Jounieh and in Dora. Same recipes, same flavor.' },
  { icon: Clock, title: 'Open late', text: 'From 11:30 AM until midnight, every day. Late cravings are covered.' },
  { icon: MessageCircle, title: 'Order in a tap', text: 'Build your bag here and send it on WhatsApp. No apps, no accounts.' },
]

const FLYERS = [
  { type: 'Chick', x: '86%', y: '8%', size: 110, depth: 2, rotate: -8 },
  { type: 'Wrap', x: '3%', y: '70%', size: 90, depth: 3, rotate: 20, hideMobile: true },
]

export default function Story() {
  return (
    <section className="story section" id="story" aria-labelledby="story-title">
      <FlyingItems items={FLYERS} mouse={false} />
      <FootprintTrail className="story__trail" />
      <div className="container story__grid">
        <div className="story__copy reveal">
          <p className="eyebrow eyebrow--light">Our story</p>
          <h2 id="story-title">Born from one simple wrap.</h2>
          <p>
            Taktawook started with a single obsession: the perfect chicken tawook. Today the menu goes from crispy
            subs to stacked burgers and charcoal-grilled platters, but every bite still chases that same original
            Lebanese taste.
          </p>
          <p className="story__tagline">Sauce. Bite. Repeat.</p>
        </div>
        <ul className="story__points">
          {POINTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="point reveal">
              <span className="point__icon">
                <Icon size={26} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
