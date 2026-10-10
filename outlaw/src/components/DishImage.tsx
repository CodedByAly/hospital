import { useState } from 'react'
import type { MenuItem } from '../data/menu'
import { cutoutUrl, photoUrl } from '../lib/asset'
import Logo from './Logo'
import './DishImage.css'

/**
 * The item's own menu photo, or its bottle/can cut-out on a dark plate.
 * Missing or broken photos fall back to a quiet branded placeholder,
 * never to another dish.
 */
export default function DishImage({ item, size = 'sm', eager = false, className = '' }: { item: MenuItem; size?: 'sm' | 'lg'; eager?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false)
  const src = item.photo ? photoUrl(item.photo, size) : cutoutUrl(item.cutout)
  const kind = item.photo ? 'photo' : item.cutout ? 'cutout' : 'none'
  if (!src || failed) {
    return (
      <div className={`dish-img dish-img--none ${className}`} role="img" aria-label={`${item.name}, photo coming soon`}>
        <Logo size={44} />
      </div>
    )
  }
  return (
    <div className={`dish-img dish-img--${kind} ${className}`}>
      <img src={src} alt={item.name} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
    </div>
  )
}
