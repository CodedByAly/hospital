import { site } from '../data/site'
import './About.css'

const instagram = site.social.find((s) => s.id === 'instagram')

const notes = [
  {
    title: 'Work & study',
    body: 'Bring your laptop or your books and settle in. Long sessions are welcome here.',
  },
  {
    title: 'Events',
    body: 'We host events at the café. Dates and details go up on our Instagram first.',
    link: instagram && { href: instagram.href, label: `Follow ${instagram.handle}` },
  },
  {
    title: 'Now serving sushi',
    body: 'Fresh sushi has joined the coffee. Ask us about it when you come by.',
  },
]

export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="about__grid wrap">
        <div className="about__head">
          <p className="eyebrow" data-reveal>
            About
          </p>
          <h2 id="about-title" className="display section-title" data-reveal>
            Brews, bonds <span className="about__amp">&amp;</span> business
          </h2>
        </div>

        <div className="about__body" data-reveal>
          <p>
            Bean Avenue is a coffee house in {site.town}. We open at seven in the morning and close at
            midnight, so whatever your day looks like, there’s a table and a cup waiting for you.
          </p>
          <p>
            The three words on our menu sum it up. Grab a quick espresso before work, catch up with
            friends over a frappé, or open the laptop and get things done. Your coffee, your space.
          </p>
        </div>

        <ol className="about__notes">
          {notes.map((n, i) => (
            <li key={n.title} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="about__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{n.title}</h3>
              <p>{n.body}</p>
              {n.link && (
                <a href={n.link.href} target="_blank" rel="noopener noreferrer" className="about__link">
                  {n.link.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
