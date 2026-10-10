/** Accent/diacritic-insensitive matching for English and Arabic. */
export function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // latin accents
    .replace(/[ً-ْـ]/g, '') // arabic harakat + tatweel
    .replace(/[إأآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const haystack = (item, categoryName) =>
  normalize(
    [
      item.name.en, item.name.ar,
      item.description?.en, item.description?.ar,
      categoryName?.en, categoryName?.ar,
      ...(item.options ?? []).flatMap((g) => g.choices.flatMap((c) => [c.label.en, c.label.ar])),
    ].join(' '),
  )

export function searchMenu(items, categories, query) {
  const terms = normalize(query).split(' ').filter(Boolean)
  if (!terms.length) return items
  const catName = Object.fromEntries(categories.map((c) => [c.id, c.name]))
  return items.filter((item) => {
    const text = haystack(item, catName[item.category])
    return terms.every((term) => text.includes(term))
  })
}
