import { site } from '../data/site'
import './About.css'

const steps = [
  { title: 'Pick your food', body: 'Add dishes from the menu. Leave out anything you don’t like or add a note for the kitchen.' },
  { title: 'Delivery or pickup', body: 'Tell us where to bring it, or when you’ll pass by to collect it.' },
  { title: 'Send it on WhatsApp', body: 'Your order opens in WhatsApp, already written out. Press send and we confirm it there.' },
  { title: 'Pay in cash', body: 'Pay when the food reaches you, or when you pick it up. Nothing to pay online.' },
]

export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="about__grid wrap">
        <div className="about__intro">
          <p className="eyebrow" data-reveal>
            About
          </p>
          <h2 id="about-title" className="display section-title" data-reveal>
            {site.bio}
          </h2>
        </div>
        <div className="about__body" data-reveal>
          <p>
            {site.name} is a small kitchen in {site.town || site.country} doing what it does best:{' '}
            {site.specialties.join(', ').toLowerCase()}. Crispy paprika chicken, Philly and mushroom
            steak subs, proper burgers, and the Lebanese classics, taouk and kafta wrapped in bread
            with fries.
          </p>
          <p>
            Order to your door or pick it up yourself. We keep it simple: good food, good mood.
          </p>
        </div>

        <div className="steps">
          <h3 className="steps__title">How ordering works</h3>
          <ol className="steps__list">
            {steps.map((s, i) => (
              <li key={s.title} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <span className="steps__num">{i + 1}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
