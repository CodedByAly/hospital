// Renders the homepage to static HTML after `vite build`, so search
// engines and slow phones get the full menu without waiting for JS.
// dist/spa.html stays an empty shell for client-only routes.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href)
const html = render('/')

fs.writeFileSync(path.join(dist, 'spa.html'), template)
fs.writeFileSync(path.join(dist, 'index.html'), template.replace('<!--app-html-->', html))
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`Prerendered / (${(html.length / 1024).toFixed(1)} kB of HTML)`)
