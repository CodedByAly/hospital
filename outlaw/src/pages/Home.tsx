import { useMeta } from '../hooks/useMeta'
import Hero from '../sections/Hero'
import HouseRolls from '../sections/HouseRolls'
import DealFan from '../sections/DealFan'
import MenuIndex from '../sections/MenuIndex'
import Visit from '../sections/Visit'

export default function Home() {
  useMeta({
    title: 'Outlaw Sushi Bar — Sushi in Mansourieh',
    description: 'Outlaw Sushi Bar in Mansourieh, facing the municipality. Dragon maki, ura maki, futo, burritos, platters and sushi cakes. Order for take away or delivery on WhatsApp.',
    path: '/',
  })
  return (
    <>
      <Hero />
      <HouseRolls />
      <MenuIndex />
      <DealFan />
      <Visit />
    </>
  )
}
