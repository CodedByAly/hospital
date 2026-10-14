/**
 * Hero 3D scene — a slowly turning ring of the restaurant's real food
 * photos, mounted on glossy cards above a reflective floor.
 * Drag to spin, hover to lift, click to open the item.
 *
 * Loaded lazily (own chunk) so the rest of the site never waits on three.js.
 */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Environment, Image, Lightformer, MeshReflectorMaterial, PerformanceMonitor, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

export interface HeroCard {
  id: string
  image: string
}

interface Props {
  cards: HeroCard[]
  active: boolean
  rtl: boolean
  onSelect: (id: string) => void
  onFront: (id: string) => void
  onReady: () => void
}

const TAU = Math.PI * 2

function Card({ card, index, count, radius, hovered, setHovered, onSelect }: {
  card: HeroCard
  index: number
  count: number
  radius: number
  hovered: number | null
  setHovered: (i: number | null) => void
  onSelect: (id: string) => void
}) {
  const ref = useRef<THREE.Group>(null)
  const angle = (index / count) * TAU
  const isHover = hovered === index

  useFrame((state, dt) => {
    const g = ref.current
    if (!g) return
    const t = state.clock.elapsedTime
    const lift = isHover ? 0.55 : 0
    const targetR = radius + lift
    const bob = Math.sin(t * 0.9 + index * 1.7) * 0.07
    const k = 1 - Math.exp(-dt * 8)
    const r = THREE.MathUtils.lerp(Math.hypot(g.position.x, g.position.z), targetR, k)
    g.position.set(Math.sin(angle) * r, THREE.MathUtils.lerp(g.position.y, bob + (isHover ? 0.12 : 0), k), Math.cos(angle) * r)
    const s = THREE.MathUtils.lerp(g.scale.x, isHover ? 1.08 : 1, k)
    g.scale.setScalar(s)
  })

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(index)
    document.body.style.cursor = 'pointer'
  }
  const out = () => {
    setHovered(null)
    document.body.style.cursor = ''
  }

  return (
    <group ref={ref} position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]} rotation={[0, angle, 0]}>
      <RoundedBox args={[2.5, 2.5, 0.1]} radius={0.08} smoothness={4} castShadow>
        <meshPhysicalMaterial color="#0f2536" roughness={0.32} metalness={0.15} clearcoat={1} clearcoatRoughness={0.18} />
      </RoundedBox>
      <Image
        url={card.image}
        position={[0, 0, 0.056]}
        scale={[2.36, 2.36]}
        radius={0.07}
        onPointerOver={over}
        onPointerOut={out}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(card.id)
        }}
      />
    </group>
  )
}

function Ring({ cards, rtl, onSelect, onFront, active }: Omit<Props, 'onReady'>) {
  const group = useRef<THREE.Group>(null)
  const { size, camera, pointer, gl } = useThree()
  const [hovered, setHovered] = useState<number | null>(null)
  const velocity = useRef(0)
  const drag = useRef<{ x: number; moved: number } | null>(null)
  const front = useRef(-1)
  const portrait = size.width < size.height * 1.05
  const radius = portrait ? 4.2 : 4.8
  const count = cards.length

  // Drag-to-spin on the canvas element (works for mouse, pen and touch).
  useEffect(() => {
    const el = gl.domElement
    const down = (e: PointerEvent) => {
      drag.current = { x: e.clientX, moved: 0 }
    }
    const move = (e: PointerEvent) => {
      if (!drag.current) return
      const dx = e.clientX - drag.current.x
      drag.current.x = e.clientX
      drag.current.moved += Math.abs(dx)
      velocity.current = THREE.MathUtils.clamp(velocity.current + dx * 0.0009, -0.09, 0.09)
    }
    const up = () => {
      drag.current = null
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [gl])

  useFrame((_, dt) => {
    const g = group.current
    if (!g || !active) return
    const idle = hovered === null && !drag.current ? (rtl ? -0.11 : 0.11) * dt : 0
    g.rotation.y += idle + velocity.current
    velocity.current *= Math.pow(0.04, dt) // friction

    // Camera drifts with the pointer for depth.
    const k = Math.min(1, dt * 2.5)
    const cx = pointer.x * 0.8
    const cy = (portrait ? 2.9 : 2.4) + pointer.y * 0.4
    const cz = portrait ? 19 : 15.5
    camera.position.x += (cx - camera.position.x) * k
    camera.position.y += (cy - camera.position.y) * k
    camera.position.z += (cz - camera.position.z) * k
    camera.lookAt(0, -0.15, 0)

    // Which card faces the camera right now?
    const rot = ((-g.rotation.y % TAU) + TAU) % TAU
    const idx = Math.round((rot / TAU) * count) % count
    if (idx !== front.current) {
      front.current = idx
      onFront(cards[idx].id)
    }
  })

  return (
    <group ref={group} rotation={[0.05, 0, 0]} position={[0, 0.25, 0]}>
      {cards.map((c, i) => (
        <Card key={c.id} card={c} index={i} count={count} radius={radius} hovered={hovered} setHovered={setHovered} onSelect={(id) => {
          if ((drag.current?.moved ?? 0) < 6) onSelect(id)
        }} />
      ))}
    </group>
  )
}

function Floor({ low }: { low: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
      <planeGeometry args={[60, 60]} />
      {low ? (
        <meshStandardMaterial color="#0a1520" roughness={0.9} />
      ) : (
        <MeshReflectorMaterial
          blur={[320, 90]}
          resolution={512}
          mixBlur={1}
          mixStrength={28}
          roughness={1}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          color="#0a1724"
          metalness={0.55}
          mirror={0}
        />
      )}
    </mesh>
  )
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady()
  }, [onReady])
  return null
}

export default function HeroScene({ cards, active, rtl, onSelect, onFront, onReady }: Props) {
  const [dpr, setDpr] = useState(1.5)
  const low = useMemo(() => window.matchMedia('(max-width: 700px)').matches || (navigator.hardwareConcurrency ?? 8) <= 4, [])

  return (
    <Canvas
      dpr={low ? [1, 1.5] : dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 2.4, 15.5], fov: 30, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      style={{ touchAction: 'pan-y' }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.75)} />
      <fog attach="fog" args={['#0b1622', 13, 26]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 6, 5]} intensity={1.2} />
      <Suspense fallback={null}>
        <Ring cards={cards} rtl={rtl} onSelect={onSelect} onFront={onFront} active={active} />
        <Floor low={low} />
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, 6]} scale={[10, 3, 1]} />
          <Lightformer form="rect" intensity={2} color="#1ba6ea" position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={1.5} color="#ffc81e" position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
        </Environment>
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
