import { strings } from './strings'

const lookup = (dict, path) => path.split('.').reduce((node, part) => node?.[part], dict)

/** t('cart.items', { count: 3 }) for a given language — usable outside React too. */
export function makeT(lang) {
  return (path, vars) => {
    let text = lookup(strings[lang], path) ?? lookup(strings.en, path) ?? path
    if (vars && typeof text === 'string') text = text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`))
    return text
  }
}

export const makePick = (lang) => (value) => (value && typeof value === 'object' ? value[lang] ?? value.en : value)
