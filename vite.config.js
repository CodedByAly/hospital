import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  ssr: {
    // Bundle these into the prerender build so Node doesn't try to load CSS files.
    noExternal: ['@fontsource/anton', '@fontsource-variable/dm-sans'],
  },
})
