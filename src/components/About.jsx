import { menuGroups, getItem } from '../data/menu';
import { restaurant } from '../data/restaurant';
import Reveal from './Reveal';
import DishImage from './DishImage';
import './About.css';

const counts = menuGroups.map((g) => ({
  label: g.label === 'Argili' ? 'Argili flavours' : g.label,
  value: g.categories.reduce((n, c) => n + c.items.length, 0),
}));

const collage = ['zaatar', 'cappuccino', 'strawberry-mojito'].map(getItem);

export default function About() {
  return (
    <section className="about section" id="about" aria-labelledby="about-title">
      <div className="container about__grid">
        <Reveal className="about__collage" aria-hidden="true">
          {collage.map((item, i) => (
            <figure key={item.id} className={`about__photo about__photo--${i + 1}`}>
              <DishImage item={item} size="lg" sizes="(max-width: 899px) 60vw, 360px" />
            </figure>
          ))}
        </Reveal>

        <div className="about__copy">
          <Reveal>
            <p className="eyebrow">About Talia</p>
            <h2 id="about-title" className="section-title">
              From the first coffee <em>to the last argili.</em>
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="about__text">
              Talia Resto Cafe sits on Bikkerman Street in Saida, a few steps from LIU. One menu covers the whole
              day: manakish and breakfast plates in the morning, sandwiches, pizza, pasta and platters for lunch, a
              coffee bar that runs from espresso to pistachio lattes, and argili whenever you want to stay a little
              longer.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <blockquote className="about__quote">
              <p>&ldquo;{restaurant.voice.drinks}&rdquo;</p>
              <cite>The Talia team</cite>
            </blockquote>
          </Reveal>
          <Reveal delay={200}>
            <dl className="about__counts">
              {counts.map((c) => (
                <div key={c.label}>
                  <dt>{c.label}</dt>
                  <dd>{c.value}</dd>
                </div>
              ))}
            </dl>
            <p className="about__counts-note">Items on the menu</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
