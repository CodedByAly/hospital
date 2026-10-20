import Hero from '../sections/Hero'
import Lineup from '../sections/Lineup'
import MenuSection from '../sections/MenuSection'
import About from '../sections/About'
import Contact from '../sections/Contact'
import useReveal from '../hooks/useReveal'
import usePageTitle from '../hooks/usePageTitle'

export default function Home() {
  usePageTitle(null)
  useReveal()
  return (
    <main id="main">
      <Hero />
      <Lineup />
      <MenuSection />
      <About />
      <Contact />
    </main>
  )
}
