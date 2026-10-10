import { useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import type { PointerEvent } from 'react'

/**
 * Pointer-driven 3D tilt for a single element: returns spring-smoothed
 * rotateX / rotateY plus handlers. Mouse only (touch scrolling stays untouched),
 * and nothing moves when the visitor prefers reduced motion.
 */
export function useTilt(max = 10): {
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  px: MotionValue<number>
  py: MotionValue<number>
  onPointerMove: (e: PointerEvent<HTMLElement>) => void
  onPointerLeave: () => void
} {
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 140, damping: 18, mass: 0.6 })
  const sy = useSpring(py, { stiffness: 140, damping: 18, mass: 0.6 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max])
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max])
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  return {
    rotateX, rotateY, px: sx, py: sy,
    onPointerMove: (e) => {
      if (reduced || e.pointerType !== 'mouse') return
      const r = e.currentTarget.getBoundingClientRect()
      px.set((e.clientX - r.left) / r.width - 0.5)
      py.set((e.clientY - r.top) / r.height - 0.5)
    },
    onPointerLeave: () => {
      px.set(0)
      py.set(0)
    },
  }
}
