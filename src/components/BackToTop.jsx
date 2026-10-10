import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import Icon from './Icon'

export default function BackToTop() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const [scrolled, setShow] = useState(false)
  const show = scrolled && pathname !== '/checkout'
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.5)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      type="button"
      className="back-to-top"
      data-show={show || undefined}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      aria-label={t('common.backToTop')}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <Icon name="up" size={20} />
    </button>
  )
}
