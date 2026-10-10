import { useEffect, useRef } from 'react'
import './FloatStage.css'

/**
 * A product shot with ingredients hanging in the air around it, cut out of
 * the shop's own campaign photos. Pieces fly in once, then follow the
 * pointer (desktop) and scroll very slightly according to their depth.
 *
 * items: [{ src, x, y, w, rotate, depth, blur, delay }]  — x/y/w in % of the stage
 */
export default function FloatStage({ subject, items = [], className = '', children, priority = false }) {
  const stage = useRef(null)

  useEffect(() => {
    const el = stage.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    let px = 0, py = 0, sy = 0
    const apply = () => {
      frame = 0
      el.style.setProperty('--px', px.toFixed(3))
      el.style.setProperty('--py', py.toFixed(3))
      el.style.setProperty('--sy', sy.toFixed(3))
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(apply) }
    const onPointer = (e) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      px = (e.clientX - (r.left + r.width / 2)) / r.width
      py = (e.clientY - (r.top + r.height / 2)) / r.height
      queue()
    }
    const onLeave = () => { px = 0; py = 0; queue() }
    const onScroll = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < 0 || r.top > vh) return
      sy = (r.top + r.height / 2 - vh / 2) / vh // -1 … 1 while on screen
      queue()
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.classList.add('is-in')
    }, { threshold: 0.25 })
    io.observe(el)
    el.addEventListener('pointermove', onPointer)
    el.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onPointer)
      el.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div ref={stage} className={`float-stage ${className}`}>
      {children}
      {items.map((it, i) => (
        <span
          key={i}
          className="float-stage__piece"
          aria-hidden="true"
          style={{
            '--x': `${it.x}%`, '--y': `${it.y}%`, '--w': `${it.w}%`, '--r': `${it.rotate ?? 0}deg`,
            '--d': it.depth ?? 1, '--delay': `${it.delay ?? i * 70}ms`, '--blur': `${it.blur ?? 0}px`,
            zIndex: (it.depth ?? 1) > 1 ? 3 : 1,
          }}
        >
          <img src={it.src} alt="" loading={priority ? 'eager' : 'lazy'} decoding="async" />
        </span>
      ))}
      {subject && (
        <img
          className="float-stage__subject"
          src={subject.src}
          alt={subject.alt}
          width={subject.width}
          height={subject.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : undefined}
          decoding="async"
          style={subject.style}
        />
      )}
    </div>
  )
}
