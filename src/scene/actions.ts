// O que o personagem faz em cada seção, na ordem dos elementos [data-scene].

import type { ScreenMode } from './screen'

export type Action = {
  /** Giro da cadeira (0 = de frente para a mesa). */
  yaw: number
  /** Inclinação do tronco (+ para frente). */
  lean: number
  headYaw: number
  headPitch: number
  // pesos de cada gesto, 0..1
  type: number
  wave: number
  sip: number
  point: number
  // câmera: ponto observado e distância até ele
  tgtX: number
  tgtY: number
  tgtZ: number
  offX: number
  offY: number
  offZ: number
}

export type Beat = Action & { screen: ScreenMode }

// Giro da cadeira que deixa o personagem de frente para a câmera.
const TURNED = 1.05

const idle = { type: 0, wave: 0, sip: 0, point: 0 }

export const beats: Beat[] = [
  // hero: digitando
  { ...idle, yaw: 0, lean: 0.14, headYaw: 0, headPitch: 0.12, type: 1,
    tgtX: -0.1, tgtY: 1.05, tgtZ: 0.55, offX: 2.3, offY: 0.7, offZ: 4.3, screen: 'code' },
  // sobre: vira e acena
  { ...idle, yaw: TURNED, lean: 0, headYaw: 0.05, headPitch: 0.05, wave: 1,
    tgtX: 0.05, tgtY: 1.05, tgtZ: 0.5, offX: 1.6, offY: 0.45, offZ: 4.3, screen: 'build' },
  // competências: volta a digitar, vista mais frontal
  { ...idle, yaw: 0, lean: 0.18, headYaw: 0, headPitch: 0.12, type: 1,
    tgtX: -0.2, tgtY: 1.15, tgtZ: 0.65, offX: 0.5, offY: 0.9, offZ: 5.0, screen: 'skills' },
  // experiência: recosta e toma café
  { ...idle, yaw: 0.55, lean: -0.12, headYaw: -0.35, headPitch: 0.1, sip: 1,
    tgtX: 0, tgtY: 1.0, tgtZ: 0.5, offX: 2.9, offY: 0.35, offZ: 3.7, screen: 'git' },
  // projetos: aponta para o painel
  { ...idle, yaw: 0.1, lean: 0.05, headYaw: 0.05, headPitch: 0.2, point: 1,
    tgtX: -0.25, tgtY: 1.2, tgtZ: 0.7, offX: 1.5, offY: 0.35, offZ: 4.0, screen: 'intelivise' },
  // contato: vira e acena de novo
  { ...idle, yaw: TURNED, lean: 0.02, headYaw: 0, headPitch: 0.05, wave: 1,
    tgtX: 0.1, tgtY: 1.0, tgtZ: 0.5, offX: 1.9, offY: 0.4, offZ: 4.2, screen: 'contact' },
]

const keys = Object.keys(beats[0]).filter((k) => k !== 'screen') as (keyof Action)[]

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1)
  return t * t * (3 - 2 * t)
}

/** Interpola entre as ações. Segura a ação no início de cada seção e
 *  transita na segunda metade, para o personagem ficar estável enquanto se lê. */
export function actionAt(section: number, out: Action): Action {
  const i = Math.min(Math.floor(section), beats.length - 1)
  const j = Math.min(i + 1, beats.length - 1)
  const t = smoothstep(0.45, 1, section - i)
  for (const k of keys) out[k] = beats[i][k] + (beats[j][k] - beats[i][k]) * t
  return out
}

export function initialAction(): Action {
  const { screen: _screen, ...rest } = beats[0]
  return { ...rest }
}
