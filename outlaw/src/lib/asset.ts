/** URL for a file in /public, respecting Vite's `base` (so the site also works from a sub-path). */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')

export const photoUrl = (slug?: string, size: 'lg' | 'sm' = 'lg') =>
  slug ? asset(size === 'sm' ? `img/menu/sm/${slug}.webp` : `img/menu/${slug}.webp`) : undefined

export const cutoutUrl = (slug?: string) => (slug ? asset(`img/cut/${slug}.webp`) : undefined)
