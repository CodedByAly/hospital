import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { UpIcon } from './Icons'

export default function BackToTop() {
  const { t } = useLang()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.5)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      className={`back-to-top ${show ? 'is-shown' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('top')}
      tabIndex={show ? 0 : -1}
    >
      <UpIcon size={20} />
    </button>
  )
}
