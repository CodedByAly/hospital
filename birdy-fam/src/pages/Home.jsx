import { useEffect } from 'react'
import { restaurant } from '../data/restaurant.js'
import Hero from '../sections/Hero.jsx'
import Signatures from '../sections/Signatures.jsx'
import Menu from '../sections/Menu.jsx'
import About from '../sections/About.jsx'
import Contact from '../sections/Contact.jsx'

export default function Home() {
  useEffect(() => {
    document.title = `${restaurant.name} | Crispy chicken in Achrafieh & Jal el Dib`
    // Deep links like /#menu: wait for layout, then jump.
    const id = window.location.hash.slice(1)
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
  }, [])

  return (
    <main id="main">
      <Hero />
      <Signatures />
      <Menu />
      <About />
      <Contact />
    </main>
  )
}
