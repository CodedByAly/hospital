import { Link } from 'react-router-dom'
import { restaurant, whatsappLink } from '../config/restaurant'
import { categories, getItem, menuItems } from '../data/menu'
import { usePageMeta } from '../hooks/usePageMeta'
import { useQuickAdd, FeatureCard, MenuRow } from '../components/MenuRow'
import { useRef } from 'react'
import { formatPrice } from '../lib/format'
import OpenStatus from '../components/OpenStatus'
import Reveal from '../components/Reveal'
import SocialLinks from '../components/SocialLinks'
import { ArrowIcon, ClockIcon, InstagramIcon, PinIcon, StoreIcon, TruckIcon, WhatsAppIcon } from '../components/Icons'
import tawookWrap from '../assets/images/tawook-wrap.webp'
import wingsPoster from '../assets/images/wings-poster.webp'

export default function Home() {
  usePageMeta(null)
  const featured = menuItems.filter((i) => i.featured)
  const sandwiches = menuItems.filter((i) => i.category === 'sandwiches')

  return (
    <>
      <Hero />

      <section className="section" aria-labelledby="featured-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">عالمنقل</p>
            <h2 id="featured-title" className="section-title">
              الأكتر طلباً
            </h2>
            <Link to="/menu" className="link-arrow">
              كل المنيو <ArrowIcon size={18} />
            </Link>
          </Reveal>
          <div className="feature-grid">
            {featured.map((item, i) => (
              <Reveal key={item.id} delay={i * 70}>
                <FeatureCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WingsOffer />

      <section className="section board" aria-labelledby="board-title">
        <div className="container board__inner">
          <Reveal className="board__head">
            <p className="eyebrow eyebrow--ember">{categories.find((c) => c.id === 'sandwiches').name}</p>
            <h2 id="board-title" className="section-title section-title--light">
              ساندويشات عالمنقل
            </h2>
            <p className="board__lead">متل اللوح بالمحل، بس فيك تطلب من هون.</p>
            <Link to="/menu" className="btn btn--primary">
              اطلب من المنيو
            </Link>
          </Reveal>
          <Reveal as="ul" className="menu-list menu-list--board" delay={80}>
            {sandwiches.map((item) => (
              <MenuRow key={item.id} item={item} />
            ))}
          </Reveal>
        </div>
      </section>

      <ServiceStrip />

      <section className="section insta" aria-labelledby="insta-title">
        <Reveal className="container insta__inner">
          <InstagramIcon size={30} />
          <div>
            <h2 id="insta-title" className="insta__title">
              العروض الجديدة بتنزل أول بأول على إنستغرام
            </h2>
            <a href={restaurant.social.instagram.url} target="_blank" rel="noopener noreferrer" className="insta__handle" dir="ltr">
              @{restaurant.social.instagram.handle}
            </a>
          </div>
          <a href={restaurant.social.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
            تابعنا
          </a>
        </Reveal>
      </section>
    </>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <OpenStatus className="hero__status" />
          <h1 id="hero-title" className="hero__title">
            <span className="hero__name">
              {restaurant.name.split(' ').map((word, i) => (
                <span key={word} className={i === 0 ? 'hero__name-accent' : undefined}>
                  {i > 0 && ' '}
                  {word}
                </span>
              ))}
            </span>
            <span className="hero__line">من أول لقمة بتعرف الفرق.</span>
          </h1>
          <p className="hero__lead">
            شقف غنم وبقر، كباب، طاووق أحمر وأبيض، سجق ومقانق — ساندويشات ووجبات وجاط عائلي عالمنقل. اطلب توصيل أو مرّ خدها من المحل.
          </p>
          <div className="hero__actions">
            <Link to="/menu" className="btn btn--primary btn--large">
              اطلب أونلاين
            </Link>
            <a href={whatsappLink('مرحبا، بدي اطلب')} className="btn btn--outline btn--large" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={20} />
              اطلب عالواتساب
            </a>
          </div>
          <ul className="hero__facts">
            <li>
              <ClockIcon size={18} />
              {restaurant.hoursLabel}
            </li>
            <li>
              <TruckIcon size={18} />
              توصيل واستلام
            </li>
          </ul>
        </div>

        <div className="hero__visual">
          <div className="hero__photo">
            <img src={tawookWrap} alt="ساندويش طاووق من عل منقل" width="483" height="905" fetchPriority="high" decoding="async" />
          </div>
          <HeroTag />
        </div>
      </div>
    </section>
  )
}

function HeroTag() {
  const item = getItem('tawook')
  const ref = useRef(null)
  const quickAdd = useQuickAdd(item, ref)
  return (
    <div className="hero__tag" ref={ref}>
      <span className="hero__tag-name">{item.name}</span>
      <span className="hero__tag-price">{formatPrice(item.price)}</span>
      <button type="button" className="add-btn add-btn--light" onClick={quickAdd} aria-label={`زيد ${item.name} عالسلة`}>
        +
      </button>
    </div>
  )
}

function WingsOffer() {
  const item = getItem('wings-box')
  const ref = useRef(null)
  const quickAdd = useQuickAdd(item, ref)
  return (
    <section className="offer" aria-labelledby="offer-title">
      <div className="container offer__grid">
        <Reveal className="offer__media">
          <img ref={ref} src={wingsPoster} alt="بوكس الجوانح: 12 جوانح مع ثوم وكول سلو وبطاطا ومشروب غازي بـ 10$" width="739" height="879" loading="lazy" decoding="async" />
        </Reveal>
        <Reveal className="offer__copy" delay={80}>
          <p className="eyebrow">جديد عالمنيو</p>
          <h2 id="offer-title" className="offer__title">
            {item.name}
          </h2>
          <ul className="offer__list">
            {item.contents.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div className="offer__foot">
            <span className="offer__price">{formatPrice(item.price)}</span>
            <button type="button" className="btn btn--dark btn--large" onClick={quickAdd}>
              زيد عالسلة
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ServiceStrip() {
  return (
    <section className="section service" aria-label="الدوام والتوصيل">
      <div className="container">
      <div className="service__grid">
        <Reveal className="service__item">
          <ClockIcon size={26} />
          <h3>الدوام</h3>
          <p>{restaurant.hoursLabel}</p>
        </Reveal>
        <Reveal className="service__item" delay={60}>
          <TruckIcon size={26} />
          <h3>توصيل</h3>
          <p>
            اطلب من الموقع أو عالرقم{' '}
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" dir="ltr">
              {restaurant.phone.display}
            </a>
          </p>
        </Reveal>
        <Reveal className="service__item" delay={120}>
          <StoreIcon size={26} />
          <h3>استلام من المحل</h3>
          <p>اختار وقت الاستلام يلي بيناسبك ومرّ خده.</p>
        </Reveal>
        <Reveal className="service__item" delay={180}>
          <PinIcon size={26} />
          <h3>الموقع</h3>
          <p>
            <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
              {restaurant.address || 'افتح الخريطة'}
            </a>
          </p>
          <SocialLinks className="service__social" whatsapp={false} />
        </Reveal>
      </div>
      </div>
    </section>
  )
}
