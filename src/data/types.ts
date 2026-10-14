export type Lang = 'en' | 'ar'
export type Localized = { en: string; ar: string }

export interface Choice {
  id: string
  label: Localized
  /** Extra cost in USD added per unit selected. */
  price?: number
}

export interface OptionGroup {
  id: string
  label: Localized
  hint?: Localized
  /**
   * single — pick exactly one (radio)
   * multi  — pick any number (checkbox), bounded by max
   * count  — distribute a number of units across choices (steppers), e.g. "2 sauces of your choice"
   */
  type: 'single' | 'multi' | 'count'
  required?: boolean
  min?: number
  max?: number
  choices: Choice[]
}

export interface MenuItem {
  id: string
  category: CategoryId
  name: string
  description: Localized
  price: number
  /** Original price shown struck-through on bundles. */
  compareAt?: number
  /** Base name of the image in /public/images/menu (without extension). */
  image?: string
  options?: OptionGroup[]
  /** Ingredients the customer may ask to leave out. */
  removable?: Localized[]
  /** Hint shown in the notes field (e.g. which drink). */
  notesHint?: Localized
  /** Internal note for whoever maintains the menu — never shown. */
  verify?: string
}

export type CategoryId =
  | 'bundles'
  | 'starters'
  | 'mac-mania'
  | 'deluxe-fries'
  | 'finest-burgers'
  | 'grilled-bliss'
  | 'kids-meal'
  | 'combos-extras'
  | 'sauce-boss'
  | 'pudding'
  | 'drinks'

export interface Category {
  id: CategoryId
  name: Localized
  blurb?: Localized
}
