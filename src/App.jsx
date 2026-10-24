// Base styles first so component styles can override them.
import './styles/base.css'
import './styles/extras.css'
import Splash from './components/Splash'
import Header from './components/Header'
import Hero from './components/Hero'
import Menu from './components/menu/Menu'
import About from './components/About'
import Visit from './components/Visit'
import Feedback from './components/Feedback'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <>
      <Splash />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Menu />
        <About />
        <Visit />
        <Feedback />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
