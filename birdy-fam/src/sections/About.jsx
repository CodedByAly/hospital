import { restaurant } from '../data/restaurant.js'
import { useReveal } from '../hooks/useReveal.js'
import { hoursLabel } from '../lib/hours.js'

const facts = [
  { label: 'Halal', text: 'Everything on the menu is halal.' },
  { label: 'Every day', text: `Open seven days a week, ${hoursLabel}.` },
  { label: 'Two branches', text: restaurant.branches.map((b) => b.name).join(' and ') + '.' },
  { label: 'Pickup or delivery', text: 'Order here or on WhatsApp, then pick it up or have it brought to you.' },
]

export default function About() {
  const ref = useReveal()
  return (
    <section className="about section" id="about" aria-labelledby="about-title">
      <div ref={ref} className="container about__grid reveal">
        <div className="about__copy">
          <p className="eyebrow">About us</p>
          <h2 id="about-title" className="section-title">A family of birds that takes chicken seriously</h2>
          <p>
            Birdy Fam is built around one thing done properly: chicken strips in our signature chips crust, big, crispy and juicy, served with
            fluffy brioche and a side of our legendary Chico sauce.
          </p>
          <p>
            From there it's burgers, BBQ and honey chipotle sliders, wraps and Road Kill Fries, plus a sweet side of the family with Creggs,
            éclairs, tartes and eggs filled with cream, fruit and chocolate.
          </p>
        </div>
        <dl className="about__facts">
          {facts.map((f) => (
            <div key={f.label} className="fact">
              <dt>{f.label}</dt>
              <dd>{f.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
