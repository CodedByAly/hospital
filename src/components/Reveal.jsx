import { useReveal } from '../hooks/useReveal.js'

export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...props }) {
  const ref = useReveal()
  return (
    <Tag ref={ref} data-reveal className={className} style={delay ? { '--reveal-delay': `${delay}ms` } : undefined} {...props}>
      {children}
    </Tag>
  )
}
