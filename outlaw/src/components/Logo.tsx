import { asset } from '../lib/asset'

export default function Logo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return <img className={className} src={asset('img/brand/logo.png')} alt="" width={size} height={size} />
}
