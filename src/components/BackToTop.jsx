import { useEffect, useState } from 'react'
import { ArrowUpIcon } from './Icons'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.5)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a href="#top" className={`to-top${show ? ' is-shown' : ''}`} aria-label="Back to top" tabIndex={show ? 0 : -1}>
      <ArrowUpIcon />
    </a>
  )
}
