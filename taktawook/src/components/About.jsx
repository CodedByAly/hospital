import { INSTAGRAM } from '../data/menu.js'

export default function About() {
  return (
    <section className="about" aria-labelledby="about-title">
      <div className="wrap about__grid">
        <img
          className="about__img"
          src="/images/fries-burger.webp"
          alt="A burger, curly fries in a Taktawook box and a glass of orange juice on a teal table"
          loading="lazy"
        />
        <div className="about__copy">
          <h2 id="about-title">Lebanese chicken, done our way.</h2>
          <p>
            Taktawook is a Lebanese chicken place in Sarba, Jounieh and in Dora. Tawook sandwiches, subs,
            burgers, wings and grilled platters.
          </p>
          <p>
            Come in, take it away, or message us on WhatsApp and we'll bring it to you.
          </p>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="link">
            Follow @taktawook on Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
