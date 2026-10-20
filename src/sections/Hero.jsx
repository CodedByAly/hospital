import { Link } from 'react-router-dom'
import FoodImage from '../components/FoodImage'
import Icon from '../components/Icon'
import { restaurant, whatsappLink, fullAddress } from '../config/restaurant'
import { menuById } from '../data/menu'
import { money } from '../utils/format'
import { useUI } from '../context/UIContext'

export default function Hero() {
  const { openItem } = useUI()
  const shrimp = menuById['chippy-shrimp']
  const bun = menuById['golden-bun']

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__waves" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="hero__place">
            <Icon name="pin" size={16} />
            {fullAddress}
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="sr-only">{restaurant.legalName}: </span>
            <span className="hero__line">A taste</span>
            <span className="hero__line hero__line--accent">to remember</span>
          </h1>
          <p className="hero__lead">
            Jumbo shrimp, fish and crispy Chippy Chicken, fried to order in Hleliyeh. Grab a box on your way, or have it
            delivered.
          </p>
          <div className="hero__actions">
            <Link to="/#menu" className="btn btn--primary btn--lg">
              <span>Order now</span>
              <Icon name="arrowRight" size={18} />
            </Link>
            <a href={whatsappLink('Hi Chippy, I would like to place an order.')} className="btn btn--ghost btn--lg" target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={18} />
              <span>WhatsApp {restaurant.phone.display}</span>
            </a>
          </div>
          <ul className="hero__modes">
            <li><Icon name="store" size={18} /> Pickup</li>
            <li><Icon name="truck" size={18} /> Delivery</li>
            <li><Icon name="cash" size={18} /> Cash or Whish</li>
          </ul>
        </div>

        <div className="hero__visual">
          <button type="button" className="hero__dish hero__dish--main" onClick={() => openItem(shrimp.id)} aria-label={`${shrimp.name}, ${money(shrimp.price)}. View dish`}>
            <FoodImage name={shrimp.image} alt={shrimp.imageAlt} sizes="(min-width: 900px) 560px, 88vw" eager />
            <span className="tag">
              <span className="tag__name">{shrimp.name}</span>
              <span className="tag__price">{money(shrimp.price)}</span>
            </span>
          </button>
          <button type="button" className="hero__dish hero__dish--side" onClick={() => openItem(bun.id)} aria-label={`${bun.name}, ${money(bun.price)}. View dish`}>
            <FoodImage name={bun.image} alt={bun.imageAlt} sizes="(min-width: 900px) 260px, 40vw" eager />
            <span className="tag tag--small">
              <span className="tag__name">{bun.name}</span>
              <span className="tag__price">{money(bun.price)}</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
