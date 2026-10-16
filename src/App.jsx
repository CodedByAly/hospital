import Splash from './components/Splash';
import Header from './components/Header';
import MobileDock from './components/MobileDock';
import Hero from './components/Hero';
import Menu from './components/menu/Menu';
import ItemSheet from './components/menu/ItemSheet';
import About from './components/About';
import Visit from './components/Visit';
import Feedback from './components/Feedback';
import Footer from './components/Footer';
import { BackToTop } from './components/Extras';

export default function App() {
  return (
    <>
      <Splash />
      <a className="skip-link" href="#menu">
        Skip to the menu
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
      <MobileDock />
      <ItemSheet />
      <BackToTop />
    </>
  );
}
