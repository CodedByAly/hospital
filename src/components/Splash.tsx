import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { restaurant } from '../config/restaurant'
import './Splash.css'

const KEY = 'kuku.splashSeen'

const shouldShow = () => {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (sessionStorage.getItem(KEY)) return false
    // Bots and headless renderers skip the intro.
    if (/bot|crawl|spider|lighthouse/i.test(navigator.userAgent)) return false
    return true
  } catch {
    return false
  }
}

/**
 * Short branded intro (~1.4s), shown once per browser session.
 * The page renders underneath the whole time, so it never blocks content or SEO.
 */
export function Splash() {
  const [visible, setVisible] = useState(shouldShow)

  useEffect(() => {
    if (!visible) return
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
    const id = window.setTimeout(() => setVisible(false), 1450)
    return () => window.clearTimeout(id)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="splash"
          aria-hidden="true"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          onClick={() => setVisible(false)}
        >
          <div className="splash__stage">
            <motion.img
              src="/images/logo.webp"
              alt=""
              className="splash__logo"
              width="440"
              height="228"
              initial={{ rotateY: -78, rotateX: 18, z: -260, opacity: 0 }}
              animate={{ rotateY: 0, rotateX: 0, z: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.span
              className="splash__shadow"
              initial={{ scaleX: 0.2, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="splash__bars">
            {['var(--red)', 'var(--yellow)', 'var(--blue)'].map((c, i) => (
              <motion.span
                key={c}
                style={{ background: c }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
              />
            ))}
          </div>
          <span className="sr-only">{restaurant.name}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
