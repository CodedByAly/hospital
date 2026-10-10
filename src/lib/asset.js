/** URL for a file in /public, respecting Vite's `base` (so the site also works from a sub-path). */
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '')
