import { useRef } from 'react'
import Highlight from './Highlight'
import { PlusIcon } from '../Icons'
import { useCart } from '../../cart/CartContext'
import { flyToCart } from '../../cart/flyToCart'
import { money } from '../../data/site'

export default function Dish({ item, query }) {
  const { add, openItem } = useCart()
  const thumbRef = useRef(null)
  const addRef = useRef(null)

  const quickAdd = (e) => {
    e.stopPropagation()
    add({ id: item.id, qty: 1, removed: [], flavor: '', note: '' })
    flyToCart(thumbRef.current || addRef.current)
  }

  return (
    <li className="dish">
      <button
        type="button"
        className="dish__open"
        onClick={() => openItem(item)}
        aria-label={`${item.name}, ${money(item.price)}. View details`}
      />
      {item.image && (
        <div className="dish__thumb" ref={thumbRef}>
          <img src={`/images/${item.image}-420.webp`} alt="" width="420" height="372" loading="lazy" decoding="async" />
        </div>
      )}
      <div className="dish__text">
        <h4 className="dish__name">
          <Highlight text={item.name} query={query} />
        </h4>
        <p className="dish__desc">{item.desc}</p>
      </div>
      <p className="dish__price">{money(item.price)}</p>
      <button
        type="button"
        ref={addRef}
        className="dish__add"
        onClick={quickAdd}
        aria-label={`Add ${item.name} to your order`}
      >
        <PlusIcon />
      </button>
    </li>
  )
}
