/**
 * Hero 3D scene — "the studio".
 *
 * Every Kuku food photo is shot on the same seamless blue backdrop, so the
 * scene uses that exact blue as its world: each photo is a plane whose edges
 * feather out into the backdrop, which makes the dishes read as objects
 * floating in one continuous blue space. Scrolling flies the camera forward
 * through them; the pointer adds parallax; hovering lifts a dish and shows
 * its name and price; clicking opens it.
 *
 * Loaded lazily (own chunk) so nothing else waits on three.js.
 */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'
import type { MotionValue } from 'framer-motion'
import * as THREE from 'three'

export interface HeroDish {
  id: string
  image: string
  name: string
  price: string
}

interface Props {
  dishes: HeroDish[]
  progress: MotionValue<number>
  active: boolean
  compact: boolean
  onSelect: (id: string) => void
  onReady: () => void
}

/** Camera travel along -Z over the full scroll of the hero. */
const CAMERA_START = 9
const CAMERA_END = -21
const FOG = new THREE.Color('#1c9fe4')

const vertex = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`

// Chroma-key: every photo is shot on the same blue sweep, so blue-dominant
// pixels are keyed out and the food reads as a real object in the scene.
// The darker blue under each dish survives partially, which keeps a soft
// contact shadow. A rounded-rect feather hides anything left at the edges,
// blue spill on the food is pulled back, and distance fog pushes far
// dishes into the backdrop.
const fragment = /* glsl */ `
  uniform sampler2D map;
  uniform float uOpacity;
  uniform float uHover;
  uniform vec3 uFog;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec2 vUv;
  varying float vDepth;

  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec4 tex = texture2D(map, vUv);
    vec3 srgb = pow(max(tex.rgb, 0.0), vec3(1.0 / 2.2));

    // How "studio blue" is this pixel? (blue well above red; the sweep is cyan, so green counts less)
    float blueness = srgb.b - max(srgb.r, srgb.g * 0.55);
    float key = smoothstep(0.14, 0.32, blueness);
    // Keep a little of darker blues: that is the dish's shadow on the sweep.
    float shade = 1.0 - smoothstep(0.35, 0.85, srgb.b);
    float alpha = max(1.0 - key, shade * 0.55 * key);

    // Despill the blue cast along the food edges.
    vec3 col = tex.rgb;
    float spill = max(0.0, col.b - max(col.r, col.g));
    col.b -= spill * 0.55 * (1.0 - key);
    col *= 1.0 + uHover * 0.08;

    vec2 p = vUv - 0.5;
    float d = roundedBox(p, vec2(0.5), 0.22);
    float edge = 1.0 - smoothstep(-0.16, -0.01, d);

    float fog = smoothstep(uFogNear, uFogFar, vDepth);
    col = mix(col, uFog, fog);
    gl_FragColor = vec4(col, alpha * edge * uOpacity);
    #include <colorspace_fragment>
  }
`

/** Deterministic pseudo-random so the layout is the same on every visit. */
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

interface Placement {
  pos: THREE.Vector3
  size: number
  phase: number
  yaw: number
}

function layout(count: number, compact: boolean): Placement[] {
  const out: Placement[] = []
  // The first few are composed by hand so the opening frame looks deliberate.
  const opening: [number, number, number, number][] = compact
    ? [
        [1.3, -1.9, 1.2, 2.6],
        [-1.7, -2.6, -1.8, 2.2],
        [1.9, 0.6, -4.2, 2.4],
      ]
    : [
        [3.6, -0.2, 2.2, 3.4],
        [6.6, 1.9, -2.2, 2.8],
        [1.4, 2.4, -5.5, 2.6],
        [5.2, -2.6, -6.5, 2.7],
      ]
  for (let i = 0; i < count; i++) {
    if (i < opening.length) {
      const [x, y, z, s] = opening[i]
      out.push({ pos: new THREE.Vector3(x, y, z), size: s, phase: rand(i + 1) * 6.28, yaw: (rand(i + 7) - 0.5) * 0.5 })
      continue
    }
    const t = (i - opening.length) / Math.max(1, count - opening.length - 1)
    const z = -7 - t * 24
    const side = i % 2 === 0 ? 1 : -1
    const spreadX = compact ? 2.2 : 5.4
    const x = side * (1.6 + rand(i * 3.1) * spreadX)
    const y = (rand(i * 5.7) - 0.5) * (compact ? 5.2 : 5)
    out.push({ pos: new THREE.Vector3(x, y, z), size: 2.3 + rand(i * 9.3) * 1.3, phase: rand(i + 3) * 6.28, yaw: (rand(i + 11) - 0.5) * 0.6 })
  }
  return out
}

function Dish({ dish, place, texture, hovered, setHovered, onSelect }: {
  dish: HeroDish
  place: Placement
  texture: THREE.Texture
  hovered: boolean
  setHovered: (id: string | null) => void
  onSelect: (id: string) => void
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          map: { value: texture },
          uOpacity: { value: 0 },
          uHover: { value: 0 },
          uFog: { value: FOG },
          uFogNear: { value: 9 },
          uFogFar: { value: 30 },
        },
      }),
    [texture],
  )
  useEffect(() => () => material.dispose(), [material])

  useFrame((state, dt) => {
    const m = mesh.current
    if (!m) return
    const t = state.clock.elapsedTime
    const k = 1 - Math.exp(-dt * 6)
    // Gentle float, like the dishes are hanging in the studio air.
    m.position.set(
      place.pos.x + Math.sin(t * 0.35 + place.phase) * 0.12,
      place.pos.y + Math.sin(t * 0.6 + place.phase) * 0.18,
      place.pos.z + (hovered ? 0.6 : 0),
    )
    m.rotation.y = place.yaw + Math.sin(t * 0.3 + place.phase) * 0.06
    m.rotation.x = Math.sin(t * 0.4 + place.phase) * 0.04
    const s = THREE.MathUtils.lerp(m.scale.x, place.size * (hovered ? 1.08 : 1), k)
    m.scale.set(s, s, 1)

    // Fade in on load, fade out just before the camera passes through.
    const dist = state.camera.position.z - m.position.z
    const near = THREE.MathUtils.smoothstep(dist, 0.6, 3.2)
    const u = material.uniforms
    u.uOpacity.value = THREE.MathUtils.lerp(u.uOpacity.value, near, k)
    u.uHover.value = THREE.MathUtils.lerp(u.uHover.value, hovered ? 1 : 0, k)
    m.visible = dist > 0.2
  })

  return (
    <mesh
      ref={mesh}
      material={material}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(dish.id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(null)
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(dish.id)
      }}
    >
      <planeGeometry args={[1, 1]} />
      {hovered && (
        <Html center position={[0, -0.62, 0.01]} distanceFactor={7} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className="dish-tag">
            <strong>{dish.name}</strong>
            <span>{dish.price}</span>
          </div>
        </Html>
      )}
    </mesh>
  )
}

function Studio({ dishes, progress, compact, onSelect, active }: Omit<Props, 'onReady'>) {
  const textures = useTexture(dishes.map((d) => d.image))
  const { camera, pointer } = useThree()
  const [hovered, setHovered] = useState<string | null>(null)
  const places = useMemo(() => layout(dishes.length, compact), [dishes.length, compact])

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
    })
  }, [textures])

  useFrame((_, dt) => {
    if (!active) return
    const k = Math.min(1, dt * 3)
    const p = progress.get()
    const ease = p * p * (3 - 2 * p)
    const targetZ = THREE.MathUtils.lerp(CAMERA_START, CAMERA_END, ease)
    camera.position.z += (targetZ - camera.position.z) * k
    camera.position.x += (pointer.x * 0.9 - camera.position.x) * k
    camera.position.y += (pointer.y * 0.5 - camera.position.y) * k
    camera.rotation.set(pointer.y * 0.04, -pointer.x * 0.06, -pointer.x * 0.015)
  })

  return (
    <group>
      {dishes.map((d, i) => (
        <Dish key={d.id} dish={d} place={places[i]} texture={textures[i]} hovered={hovered === d.id} setHovered={setHovered} onSelect={onSelect} />
      ))}
    </group>
  )
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady()
  }, [onReady])
  return null
}

export default function HeroScene({ dishes, progress, active, compact, onSelect, onReady }: Props) {
  return (
    <Canvas
      dpr={compact ? [1, 1.5] : [1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, CAMERA_START], fov: compact ? 58 : 46, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}
    >
      <Suspense fallback={null}>
        <Studio dishes={dishes} progress={progress} compact={compact} onSelect={onSelect} active={active} />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
