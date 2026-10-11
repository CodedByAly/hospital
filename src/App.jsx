import { useCallback, useEffect, useState } from 'react';
import Splash from './components/Splash.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Story from './components/Story.jsx';
import MenuSection from './components/MenuSection.jsx';
import Offer from './components/Offer.jsx';
import Gallery from './components/Gallery.jsx';
import Visit from './components/Visit.jsx';
import Feedback from './components/Feedback.jsx';
import Footer from './components/Footer.jsx';
import BackToTop from './components/BackToTop.jsx';
import { useRevealOnScroll } from './hooks/useRevealOnScroll.js';

const SPLASH_KEY = 'sukun:splash-seen';

function shouldShowSplash() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !sessionStorage.getItem(SPLASH_KEY);
  } catch {
    return true;
  }
}

export default function App() {
  const [showSplash, setShowSplash] = useState(shouldShowSplash);
  const [ready, setReady] = useState(!showSplash);

  useRevealOnScroll();

  const finishSplash = useCallback(() => {
    try {
      sessionStorage.setItem(SPLASH_KEY, '1');
    } catch {
      /* storage unavailable: splash simply shows again next visit */
    }
    setShowSplash(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('is-ready', ready);
  }, [ready]);

  return (
    <>
      {showSplash && <Splash onReveal={() => setReady(true)} onDone={finishSplash} />}
      <a className="skip-link" href="#menu">Skip to the menu</a>
      <Header />
      <main id="top">
        <Hero />
        <Story />
        <MenuSection />
        <Offer />
        <Gallery />
        <Visit />
        <Feedback />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
