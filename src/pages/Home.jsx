import { Link } from 'react-router-dom';
import CategoryVisual from '../components/CategoryVisual';
import Hours from '../components/Hours';
import { ArrowRightIcon, ClockIcon, InstagramIcon, PhoneIcon, PinIcon, PlusIcon, WhatsAppIcon } from '../components/Icons';
import Reveal from '../components/Reveal';
import { useCart } from '../context/CartContext';
import { basePrice, categories, categoriesById } from '../data/menu';
import { restaurant, telLink, whatsappLink } from '../data/restaurant';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { money } from '../lib/format';
import heroImg from '../assets/food/tall-stack.webp';
import heroImgSm from '../assets/food/tall-stack-sm.webp';
import igCaramel from '../assets/instagram/caramel-onion.webp';
import igBuffalo from '../assets/instagram/buffalo-loop.webp';
import igSwiss from '../assets/instagram/swiss-mushroom.webp';
import igWrigley from '../assets/instagram/wrigley-field.webp';
import igStacked from '../assets/instagram/stacked.webp';
import igOnion from '../assets/instagram/onion-ring.webp';
import './Home.css';

const instagramPosts = [
  { src: igCaramel, alt: 'Caramelized onions spooned over a smashed cheeseburger patty' },
  { src: igSwiss, alt: 'Swiss Mushroom burger with melted Swiss cheese and mushroom sauce' },
  { src: igWrigley, alt: 'Wrigley Field loaded fries with grilled beef and beef bacon' },
  { src: igBuffalo, alt: 'The Buffalo Loop chicken burger' },
  { src: igStacked, alt: 'Three Chicago burgers held up one above the other' },
  { src: igOnion, alt: 'Beef burger topped with onion rings and cheddar' },
];

const signature = categoriesById.get('signature-beef-burgers');

export default function Home() {
  const { openItem } = useCart();
  useDocumentMeta(
    null,
    'Chicago Burgers, Beirut. Smashed and flame-grilled beef burgers, chicken burgers, loaded fries and subs on Kamil Shamoun Blvd. Order online for pickup or delivery.',
  );

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero on-dark" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow hero__eyebrow">Beirut · Pickup &amp; Delivery</p>
            <h1 id="hero-title" className="display hero__title">
              <span className="visually-hidden">{restaurant.name}: </span>
              <span className="hero__line">Stacked high.</span>
              <span className="hero__line hero__line--accent">Smashed right.</span>
            </h1>
            <p className="lede hero__lede">
              Smashed and flame-grilled beef, crispy chicken, loaded fries and subs, made on Kamil Shamoun Blvd. Order here and pick it up, or
              have it brought to you.
            </p>
            <div className="hero__ctas">
              <Link to="/menu" className="btn btn--primary btn--lg">
                Order now <ArrowRightIcon size={18} />
              </Link>
              <a href={whatsappLink('Hi Chicago Burgers, I would like to place an order.')} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--lg">
                <WhatsAppIcon size={18} /> Order on WhatsApp
              </a>
            </div>
            <ul className="hero__facts">
              <li>
                <PinIcon size={16} /> {restaurant.address.lines[0]}
              </li>
              <li>
                <PhoneIcon size={16} /> <a href={telLink}>{restaurant.phone.display}</a>
              </li>
            </ul>
          </div>
          <div className="hero__media">
            <div className="hero__ring" aria-hidden="true" />
            <img
              src={heroImg}
              srcSet={`${heroImgSm} 560w, ${heroImg} 1100w`}
              sizes="(min-width: 900px) 34vw, 70vw"
              alt="Two flame-grilled beef burgers stacked on top of each other"
              className="hero__img"
              fetchPriority="high"
              decoding="async"
              width="622"
              height="1606"
            />
          </div>
        </div>
        <div className="checker hero__checker" aria-hidden="true" />
      </section>

      {/* ---------- Categories ---------- */}
      <section className="section home-cats" aria-labelledby="cats-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">The menu</p>
            <h2 id="cats-title" className="display h2">
              Seven things we do
            </h2>
            <Link to="/menu" className="text-link section-head__link">
              Full menu <ArrowRightIcon size={16} />
            </Link>
          </Reveal>
        </div>
        <div className="home-cats__rail" role="list">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={Math.min(i, 4) * 60} className="home-cat" role="listitem">
              <Link to={`/menu#${cat.id}`} className="home-cat__link">
                <CategoryVisual category={cat} size="small" />
                <span className="home-cat__meta">
                  <span className="home-cat__name">{cat.name}</span>
                  <span className="home-cat__count">{cat.items.length} items</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Signature beef ---------- */}
      <section className="section signature on-dark" aria-labelledby="sig-title">
        <div className="container signature__grid">
          <Reveal className="signature__media">
            <CategoryVisual category={signature} />
          </Reveal>
          <div className="signature__copy">
            <Reveal>
              <p className="eyebrow">Signature beef burgers</p>
              <h2 id="sig-title" className="display h2">
                Thin, smashed, <br />
                stacked
              </h2>
              <p className="lede">Beef smashed thin so the edges crisp up, then stacked with provolone, cheddar, Gouda or Swiss.</p>
            </Reveal>
            <ul className="sig-list">
              {signature.items.slice(0, 4).map((item, i) => (
                <Reveal as="li" key={item.id} delay={i * 70}>
                  <button type="button" className="sig-item" onClick={() => openItem(item.id)}>
                    <span className="sig-item__text">
                      <span className="sig-item__name">{item.name}</span>
                      <span className="sig-item__desc">{item.description}</span>
                    </span>
                    <span className="price-tag">{money(basePrice(item))}</span>
                    <span className="sig-item__add" aria-hidden="true">
                      <PlusIcon size={18} />
                    </span>
                    <span className="visually-hidden">, view and add to order</span>
                  </button>
                </Reveal>
              ))}
            </ul>
            <Link to="/menu#signature-beef-burgers" className="text-link">
              All signature burgers <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- How ordering works ---------- */}
      <section className="section how" aria-labelledby="how-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Ordering</p>
            <h2 id="how-title" className="display h2">
              Pickup or delivery
            </h2>
          </Reveal>
          <ol className="how__steps">
            {[
              ['Build your order', 'Choose from the menu, pick sizes and leave out anything you don’t want.'],
              ['Pickup or delivery', 'Tell us when you’re coming, or where to bring it.'],
              ['Pay how you like', `Cash when it reaches you, or a Whish Money transfer to ${restaurant.whish.number}.`],
              ['Send it on WhatsApp', 'Your order opens in WhatsApp, ready to send. We reply to confirm.'],
            ].map(([title, text], i) => (
              <Reveal as="li" key={title} delay={i * 80} className="how__step">
                <span className="how__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="display h3">{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="how__cta">
            <Link to="/menu" className="btn btn--dark btn--lg">
              Start your order <ArrowRightIcon size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- Instagram ---------- */}
      <section className="section insta on-dark" aria-labelledby="insta-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">On Instagram</p>
            <h2 id="insta-title" className="display h2">
              {restaurant.social.instagram.handle}
            </h2>
            <a href={restaurant.social.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn--ghost section-head__link">
              <InstagramIcon size={18} /> Follow us
            </a>
          </Reveal>
          <div className="insta__grid">
            {instagramPosts.map((post, i) => (
              <Reveal key={post.src} delay={(i % 3) * 70} className="insta__tile">
                <a href={restaurant.social.instagram.url} target="_blank" rel="noopener noreferrer">
                  <img src={post.src} alt={post.alt} loading="lazy" decoding="async" width="507" height="634" />
                  <span className="insta__overlay" aria-hidden="true">
                    <InstagramIcon size={28} />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Visit ---------- */}
      <section className="section visit" aria-labelledby="visit-title">
        <div className="container visit__grid">
          <Reveal>
            <p className="eyebrow">Come by</p>
            <h2 id="visit-title" className="display h2">
              Gallery Semaan,
              <br /> Kamil Shamoun Blvd
            </h2>
          </Reveal>
          <Reveal className="visit__cards" delay={80}>
            <div className="visit__card">
              <PinIcon />
              <div>
                <h3 className="visit__label">Address</h3>
                <address>
                  {restaurant.address.street}, {restaurant.city}
                </address>
                <a href={restaurant.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                  Get directions
                </a>
              </div>
            </div>
            <div className="visit__card">
              <PhoneIcon />
              <div>
                <h3 className="visit__label">Phone &amp; WhatsApp</h3>
                <p>
                  <a href={telLink}>{restaurant.phone.international}</a>
                </p>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-link">
                  Chat on WhatsApp
                </a>
              </div>
            </div>
            <div className="visit__card">
              <ClockIcon />
              <div>
                <h3 className="visit__label">Hours</h3>
                <Hours />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
