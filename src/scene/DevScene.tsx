import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree, type ThreeElements } from '@react-three/fiber'
import { ContactShadows, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { sceneState } from '../lib/sceneState'
import { profile } from '../content/profile'
import { actionAt, beats, initialAction, type Action } from './actions'
import { drawScreen, SCREEN_H, SCREEN_W, type ScreenMode } from './screen'

const { damp } = THREE.MathUtils

/* ---------- materiais ---------- */

const mat = {
  skin: new THREE.MeshStandardMaterial({ color: '#D8A07C', roughness: 0.7 }),
  hair: new THREE.MeshStandardMaterial({ color: '#1B1F2A', roughness: 0.9 }),
  hoodie: new THREE.MeshStandardMaterial({ color: '#1E2B45', roughness: 0.85 }),
  pants: new THREE.MeshStandardMaterial({ color: '#46566F', roughness: 0.9 }),
  shoe: new THREE.MeshStandardMaterial({ color: '#F4F6FA', roughness: 0.6 }),
  ink: new THREE.MeshStandardMaterial({ color: '#0D1B2E', roughness: 0.4 }),
  cobalt: new THREE.MeshStandardMaterial({ color: '#2E4BFF', roughness: 0.35, metalness: 0.2 }),
  glow: new THREE.MeshBasicMaterial({ color: '#6F86FF', toneMapped: false }),
  desk: new THREE.MeshStandardMaterial({ color: '#F4F6FA', roughness: 0.5 }),
  steel: new THREE.MeshStandardMaterial({ color: '#7D8AA0', roughness: 0.35, metalness: 0.6 }),
  chair: new THREE.MeshStandardMaterial({ color: '#2A3850', roughness: 0.8 }),
  mug: new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.4 }),
  platform: new THREE.MeshStandardMaterial({ color: '#E3E8F0', roughness: 0.9 }),
  eye: new THREE.MeshBasicMaterial({ color: '#0D1B2E' }),
}

/* ---------- posição da estação no mundo ---------- */

// O personagem fica de frente para -z no espaço local; a estação inteira é
// girada para ele aparecer de três quartos para a câmera.
const STATION_POS = new THREE.Vector3(0.4, 0, 0.2)
const STATION_YAW = 2.4
const PANEL_LOCAL = new THREE.Vector3(0.05, 1.55, -1.05)
const PANEL_WORLD = PANEL_LOCAL.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), STATION_YAW).add(STATION_POS)
const PANEL_W = 1.15

function Capsule({ r, len, material, ...props }: { r: number; len: number; material: THREE.Material } & ThreeElements['mesh']) {
  return (
    <mesh material={material} castShadow {...props}>
      <capsuleGeometry args={[r, len, 6, 14]} />
    </mesh>
  )
}

/* ---------- braço ---------- */

type ArmRefs = {
  shoulder: React.RefObject<THREE.Group | null>
  elbow: React.RefObject<THREE.Group | null>
  hand: React.RefObject<THREE.Group | null>
}

function Arm({ side, refs, children }: { side: 1 | -1; refs: ArmRefs; children?: React.ReactNode }) {
  return (
    <group ref={refs.shoulder} position={[0.2 * side, 0.46, 0]}>
      <Capsule r={0.058} len={0.16} material={mat.hoodie} position={[0, -0.12, 0]} />
      <group ref={refs.elbow} position={[0, -0.26, 0]}>
        <Capsule r={0.052} len={0.15} material={mat.hoodie} position={[0, -0.11, 0]} />
        <group ref={refs.hand} position={[0, -0.25, 0]}>
          <mesh material={mat.skin} scale={[1, 1.15, 0.8]}>
            <sphereGeometry args={[0.052, 16, 16]} />
          </mesh>
          {children}
        </group>
      </group>
    </group>
  )
}

/* ---------- personagem ---------- */

type ArmAngles = { sx: number; sz: number; ex: number; ez: number }

function blendArm(out: ArmAngles, parts: [number, ArmAngles][]) {
  out.sx = out.sz = out.ex = out.ez = 0
  let total = 0
  for (const [w] of parts) total += w
  for (const [w, a] of parts) {
    const k = total > 0 ? w / total : 0
    out.sx += a.sx * k
    out.sz += a.sz * k
    out.ex += a.ex * k
    out.ez += a.ez * k
  }
  return out
}

function Developer({ action }: { action: Action }) {
  const chair = useRef<THREE.Group>(null)
  const torso = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const eyes = useRef<THREE.Group>(null)
  const handMug = useRef<THREE.Group>(null)
  const deskMug = useRef<THREE.Group>(null)
  const right: ArmRefs = { shoulder: useRef(null), elbow: useRef(null), hand: useRef(null) }
  const left: ArmRefs = { shoulder: useRef(null), elbow: useRef(null), hand: useRef(null) }

  const tmp = useMemo(
    () => ({
      r: { sx: 0, sz: 0, ex: 0, ez: 0 },
      l: { sx: 0, sz: 0, ex: 0, ez: 0 },
    }),
    [],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const still = sceneState.reducedMotion
    const a = action
    const rest = Math.max(0, 1 - a.type - a.wave - a.sip - a.point)

    if (chair.current) chair.current.rotation.y = a.yaw
    if (torso.current) {
      torso.current.rotation.x = -a.lean
      torso.current.scale.y = 1 + (still ? 0 : Math.sin(t * 1.6) * 0.012)
    }
    if (head.current) {
      const nod = still ? 0 : Math.sin(t * 9) * 0.02 * a.type
      head.current.rotation.set(a.headPitch + nod + a.lean * 0.6, a.headYaw, 0)
    }
    if (eyes.current) {
      const blink = !still && t % 3.7 < 0.12 ? 0.1 : 1
      eyes.current.scale.y = blink
    }

    const osc = (speed: number, phase = 0) => (still ? 0 : Math.sin(t * speed + phase))

    // Braço direito
    const typeR = { sx: 0.5 + osc(15, 1) * 0.04, sz: -0.12, ex: 1.2 + osc(19, 0.5) * 0.12, ez: 0 }
    const sipR = { sx: 0.75, sz: -0.3, ex: 2.1 + osc(1.4) * 0.28, ez: 0 }
    const pointR = { sx: 2.2, sz: -0.1, ex: 0.1, ez: 0 }
    const restR = { sx: 0.35, sz: -0.05, ex: 0.7, ez: 0 }
    blendArm(tmp.r, [
      [a.type, typeR],
      [a.sip, sipR],
      [a.point, pointR],
      [a.wave + rest, restR],
    ])

    // Braço esquerdo: digita, acena, ou descansa na mesa/colo.
    // O aceno é com a esquerda para a mão não passar atrás do painel.
    const waveL = { sx: 0.25, sz: -2.5, ex: 0.55, ez: osc(7) * 0.4 }
    const typeL = { sx: 0.5 + osc(17, 2) * 0.04, sz: 0.12, ex: 1.2 + osc(21, 2.4) * 0.12, ez: 0 }
    const deskL = { sx: 0.5, sz: 0.12, ex: 1.15, ez: 0 }
    const lapL = { sx: 0.3, sz: 0.08, ex: 0.75, ez: 0 }
    blendArm(tmp.l, [
      [a.type, typeL],
      [a.wave, waveL],
      [a.sip + a.point, deskL],
      [rest, lapL],
    ])

    for (const [refs, ang] of [
      [right, tmp.r],
      [left, tmp.l],
    ] as const) {
      refs.shoulder.current?.rotation.set(ang.sx, 0, ang.sz)
      refs.elbow.current?.rotation.set(ang.ex, 0, ang.ez)
    }

    // A caneca muda da mesa para a mão durante o café.
    const holding = a.sip > 0.5
    if (handMug.current) handMug.current.visible = holding
    if (deskMug.current) deskMug.current.visible = !holding
  })

  return (
    <>
      {/* caneca na mesa (coordenadas da estação) */}
      <group ref={deskMug} position={[0.42, 0.815, -0.62]}>
        <Mug />
      </group>

      <group ref={chair}>
        {/* cadeira */}
        <mesh material={mat.chair} position={[0, 0.46, 0.02]} castShadow>
          <boxGeometry args={[0.5, 0.07, 0.48]} />
        </mesh>
        <RoundedBox args={[0.46, 0.55, 0.07]} radius={0.03} position={[0, 0.82, 0.27]} rotation-x={-0.08} material={mat.chair} castShadow />
        <mesh material={mat.steel} position={[0, 0.24, 0.02]}>
          <cylinderGeometry args={[0.03, 0.03, 0.42, 12]} />
        </mesh>
        {[0, 1, 2, 3, 4].map((k) => (
          <mesh key={k} material={mat.steel} position={[0, 0.04, 0.02]} rotation-y={(k / 5) * Math.PI * 2}>
            <boxGeometry args={[0.05, 0.04, 0.6]} />
          </mesh>
        ))}

        {/* quadril */}
        <group position={[0, 0.55, 0.04]}>
          {/* pernas */}
          {[-1, 1].map((s) => (
            <group key={s} position={[0.1 * s, 0, 0]}>
              <group rotation-x={Math.PI / 2}>
                <Capsule r={0.07} len={0.26} material={mat.pants} position={[0, -0.18, 0]} />
                <group position={[0, -0.38, 0]} rotation-x={-Math.PI / 2}>
                  <Capsule r={0.058} len={0.3} material={mat.pants} position={[0, -0.2, 0]} />
                  <mesh material={mat.shoe} position={[0, -0.47, -0.05]}>
                    <boxGeometry args={[0.11, 0.08, 0.22]} />
                  </mesh>
                </group>
              </group>
            </group>
          ))}

          {/* tronco */}
          <group ref={torso}>
            <Capsule r={0.18} len={0.26} material={mat.hoodie} position={[0, 0.25, 0]} scale={[1, 1, 0.78]} />
            {/* capuz */}
            <mesh material={mat.hoodie} position={[0, 0.5, 0.1]} scale={[1, 0.6, 0.7]}>
              <sphereGeometry args={[0.17, 20, 16]} />
            </mesh>
            {/* fone de ouvido no pescoço */}
            <mesh material={mat.cobalt} position={[0, 0.54, -0.01]} rotation-x={Math.PI / 2 - 0.2}>
              <torusGeometry args={[0.105, 0.022, 10, 32]} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} material={mat.ink} position={[0.1 * s, 0.53, -0.04]} rotation-z={Math.PI / 2}>
                <cylinderGeometry args={[0.045, 0.045, 0.04, 20]} />
              </mesh>
            ))}

            <Arm side={1} refs={right}>
              <group ref={handMug} position={[-0.02, -0.03, -0.06]} rotation-x={-1.9}>
                <Mug />
              </group>
            </Arm>
            <Arm side={-1} refs={left} />

            {/* cabeça */}
            <group ref={head} position={[0, 0.6, 0]}>
              <mesh material={mat.skin} position={[0, 0.03, 0]}>
                <cylinderGeometry args={[0.05, 0.055, 0.08, 14]} />
              </mesh>
              <mesh material={mat.skin} position={[0, 0.17, 0]} scale={[0.95, 1.05, 1]} castShadow>
                <sphereGeometry args={[0.16, 28, 24]} />
              </mesh>
              {/* orelhas */}
              {[-1, 1].map((s) => (
                <mesh key={s} material={mat.skin} position={[0.155 * s, 0.16, 0.01]} scale={[0.5, 1, 0.8]}>
                  <sphereGeometry args={[0.04, 12, 12]} />
                </mesh>
              ))}
              {/* cabelo */}
              <mesh material={mat.hair} position={[0, 0.235, 0.02]} scale={[1.02, 0.72, 1.04]}>
                <sphereGeometry args={[0.162, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
              </mesh>
              <mesh material={mat.hair} position={[0, 0.25, -0.1]} rotation-x={0.5} scale={[1, 0.45, 0.7]}>
                <sphereGeometry args={[0.13, 20, 14]} />
              </mesh>
              {/* olhos */}
              <group ref={eyes} position={[0, 0.17, -0.148]}>
                {[-1, 1].map((s) => (
                  <mesh key={s} material={mat.eye} position={[0.058 * s, 0, 0]}>
                    <sphereGeometry args={[0.017, 12, 12]} />
                  </mesh>
                ))}
              </group>
              {/* óculos */}
              <group position={[0, 0.175, -0.158]}>
                {[-1, 1].map((s) => (
                  <mesh key={s} material={mat.ink} position={[0.06 * s, 0, 0]}>
                    <torusGeometry args={[0.042, 0.008, 8, 28]} />
                  </mesh>
                ))}
                <mesh material={mat.ink} position={[0, 0.005, 0]} rotation-z={Math.PI / 2}>
                  <cylinderGeometry args={[0.006, 0.006, 0.04, 6]} />
                </mesh>
              </group>
              {/* nariz e boca */}
              <mesh material={mat.skin} position={[0, 0.135, -0.16]}>
                <sphereGeometry args={[0.022, 12, 12]} />
              </mesh>
              <mesh material={mat.ink} position={[0, 0.085, -0.148]} rotation={[0.3, 0, Math.PI]}>
                <torusGeometry args={[0.028, 0.006, 6, 16, Math.PI]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </>
  )
}

function Mug() {
  return (
    <group>
      <mesh material={mat.mug} castShadow>
        <cylinderGeometry args={[0.04, 0.036, 0.1, 20]} />
      </mesh>
      <mesh material={mat.mug} position={[0.045, 0, 0]}>
        <torusGeometry args={[0.025, 0.008, 8, 16]} />
      </mesh>
      <mesh material={mat.cobalt} position={[0, 0.001, 0]}>
        <cylinderGeometry args={[0.0405, 0.0405, 0.02, 20]} />
      </mesh>
    </group>
  )
}

/* ---------- mesa ---------- */

function Desk() {
  return (
    <group position={[0, 0, -0.78]}>
      <RoundedBox args={[1.5, 0.05, 0.72]} radius={0.02} position={[0, 0.74, 0]} material={mat.desk} castShadow receiveShadow />
      {[
        [-0.68, -0.3],
        [0.68, -0.3],
        [-0.68, 0.3],
        [0.68, 0.3],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} material={mat.steel} position={[x, 0.36, z]}>
          <cylinderGeometry args={[0.022, 0.022, 0.72, 10]} />
        </mesh>
      ))}
      {/* teclado */}
      <RoundedBox args={[0.46, 0.025, 0.16]} radius={0.008} position={[0, 0.778, 0.26]} material={mat.ink} />
      <mesh material={mat.glow} position={[0, 0.792, 0.335]}>
        <boxGeometry args={[0.4, 0.004, 0.008]} />
      </mesh>
      {/* projetor do holograma */}
      <mesh material={mat.ink} position={[0.05, 0.775, -0.18]}>
        <cylinderGeometry args={[0.1, 0.12, 0.03, 32]} />
      </mesh>
      <mesh material={mat.glow} position={[0.05, 0.792, -0.27]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.08, 0.008, 8, 40]} />
      </mesh>
      {/* planta */}
      <group position={[-0.6, 0.765, -0.2]}>
        <mesh material={mat.desk}>
          <cylinderGeometry args={[0.06, 0.05, 0.1, 16]} />
        </mesh>
        {[0, 1, 2, 3, 4].map((k) => (
          <mesh
            key={k}
            position={[Math.cos(k * 1.3) * 0.03, 0.12, Math.sin(k * 1.3) * 0.03]}
            rotation={[Math.sin(k * 1.3) * 0.5, 0, Math.cos(k * 1.3) * 0.5]}
            scale={[0.5, 1.6, 0.25]}
          >
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color="#3E8F6E" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ---------- painel holográfico ---------- */

function HoloPanel({ modeRef }: { modeRef: React.RefObject<ScreenMode> }) {
  const group = useRef<THREE.Group>(null)
  const { ctx, texture } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = SCREEN_W
    canvas.height = SCREEN_H
    const ctx = canvas.getContext('2d')!
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return { ctx, texture }
  }, [])
  const clock = useRef({ mode: '' as ScreenMode | '', since: 0, last: -1 })

  useEffect(() => () => texture.dispose(), [texture])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const still = sceneState.reducedMotion
    const mode = modeRef.current
    const c = clock.current
    if (mode !== c.mode) {
      c.mode = mode
      c.since = t
      c.last = -1
    }
    // 20 quadros por segundo bastam para o conteúdo da tela
    const frame = Math.floor(t * 20)
    if (frame !== c.last && !(still && c.last >= 0)) {
      c.last = frame
      drawScreen(ctx, mode, t - c.since, still)
      texture.needsUpdate = true
    }
    const g = group.current
    if (!g) return
    g.position.y = PANEL_WORLD.y + (still ? 0 : Math.sin(t * 1.1) * 0.02)
    // O painel gira devagar para ficar sempre legível para a câmera.
    const cam = state.camera.position
    const facing = Math.atan2(cam.x - PANEL_WORLD.x, cam.z - PANEL_WORLD.z)
    g.rotation.y = damp(g.rotation.y, facing, 4, Math.min(delta, 1 / 30))
  })

  return (
    <group ref={group} position={PANEL_WORLD} rotation-y={0.4}>
      <mesh>
        <planeGeometry args={[PANEL_W, PANEL_W * (SCREEN_H / SCREEN_W)]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Feixe de luz do projetor da mesa até o painel (coordenadas da estação). */
function Beam() {
  const beam = useRef<THREE.MeshBasicMaterial>(null)
  useFrame((state) => {
    if (beam.current && !sceneState.reducedMotion) beam.current.opacity = 0.09 + Math.sin(state.clock.elapsedTime * 3) * 0.02
  })
  return (
    <mesh position={[0.05, 1.0, -1.05]}>
      <cylinderGeometry args={[0.42, 0.07, 0.42, 32, 1, true]} />
      <meshBasicMaterial ref={beam} color="#6F86FF" transparent opacity={0.09} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}

/* ---------- plataforma ---------- */

function Platform() {
  return (
    <group>
      <mesh material={mat.platform} position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[2.1, 2.1, 0.04, 72]} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.02, 2.05, 96]} />
        <meshBasicMaterial color="#2E4BFF" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

/* ---------- cena ---------- */

function Rig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)
  // A ação começa com a câmera afastada: a entrada da página é ela se aproximando.
  const action = useMemo(() => {
    const a = initialAction()
    a.offX *= 1.7
    a.offY += 0.9
    a.offZ *= 1.7
    return a
  }, [])
  const target = useMemo(initialAction, [])
  const lookAt = useMemo(() => new THREE.Vector3(), [])
  const modeRef = useRef<ScreenMode>('code')

  // O conteúdo 3D fica à direita no desktop e no topo no celular.
  useEffect(() => {
    const desktop = size.width >= 900
    camera.setViewOffset(
      size.width,
      size.height,
      desktop ? -size.width * 0.23 : 0,
      desktop ? 0 : size.height * 0.2,
      size.width,
      size.height,
    )
    camera.updateProjectionMatrix()
  }, [camera, size])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30)
    const still = sceneState.reducedMotion
    actionAt(sceneState.section, target)
    const lambda = still ? 20 : 3.2
    for (const k of Object.keys(target) as (keyof Action)[]) {
      action[k] = damp(action[k], target[k], lambda, dt)
    }

    // No celular (tela em pé) a câmera se afasta para caber a cena inteira.
    const aspect = size.width / size.height
    const zoom = size.width >= 900 ? 1 : Math.max(1, 0.95 / Math.pow(aspect, 0.8))
    const px = still ? 0 : sceneState.pointerX * 0.25
    const py = still ? 0 : sceneState.pointerY * 0.12
    camera.position.set(
      action.tgtX + action.offX * zoom + px,
      action.tgtY + action.offY * zoom - py,
      action.tgtZ + action.offZ * zoom,
    )
    lookAt.set(action.tgtX, action.tgtY, action.tgtZ)
    camera.lookAt(lookAt)

    const index = Math.min(Math.floor(sceneState.section), beats.length - 1)
    let mode = beats[index].screen
    if (index === 4) {
      const projects = profile.projects
      const auto = Math.min(Math.floor((sceneState.section - 4) * projects.length), projects.length - 1)
      const chosen = sceneState.activeProject >= 0 ? sceneState.activeProject : auto
      mode = projects[chosen]?.screen ?? 'code'
    }
    modeRef.current = mode
  })

  return (
    <>
      <group position={STATION_POS} rotation-y={STATION_YAW}>
        <Desk />
        <Beam />
        <Developer action={action} />
      </group>
      <HoloPanel modeRef={modeRef} />
    </>
  )
}

export default function DevScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [4, 2.5, 6.5], fov: 32, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <hemisphereLight args={['#FFFFFF', '#C9D3E6', 1.4]} />
      <directionalLight position={[3, 5, 4]} intensity={1.8} />
      <directionalLight position={[-4, 3, -2]} intensity={0.6} color="#C9D3FF" />
      <Platform />
      <ContactShadows position={[0, 0.003, 0]} scale={5} blur={2.4} opacity={0.35} far={2} resolution={512} />
      <Rig />
    </Canvas>
  )
}
