import { useLanguage } from '../context/LanguageContext'
import { useMeta } from '../hooks/useMeta'
import { useReveal } from '../hooks/useReveal'
import Hero from '../sections/Hero'
import CategoryRail from '../sections/CategoryRail'
import { CheesyDuo, Sides, StudentOffer } from '../sections/Features'
import Favourites from '../sections/Favourites'
import Visit from '../sections/Visit'

export default function Home() {
  const { t, lang } = useLanguage()
  useMeta({ title: t('meta.homeTitle'), description: t('meta.homeDescription'), path: '/' })
  useReveal([lang])
  return (
    <>
      <Hero />
      <CategoryRail />
      <Favourites />
      <CheesyDuo />
      <Sides />
      <StudentOffer />
      <Visit />
    </>
  )
}
