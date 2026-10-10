import { useMeta } from '../hooks/useMeta'
import Visit from '../sections/Visit'
import Feedback from '../sections/Feedback'

export default function VisitPage() {
  useMeta({ title: 'Visit & contact — Outlaw Sushi Bar', description: 'Find Outlaw Sushi Bar on the Mansourieh main road, facing the municipality. WhatsApp 78 997 164 or 78 944 899.', path: '/visit' })
  return (
    <div className="page-top">
      <Visit headingLevel={1} id="visit-page" />
      <Feedback />
    </div>
  )
}
