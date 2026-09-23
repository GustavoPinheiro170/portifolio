// Estado transitório compartilhado entre o DOM e a cena 3D.
// Mutável de propósito: a cena lê a cada frame em useFrame, e nada aqui
// deve provocar re-render do React.

export const sceneState = {
  /** Índice fracionário da seção no centro da tela (0 = hero, 1 = sobre…). */
  section: 0,
  /** Ponteiro normalizado em -1..1. */
  pointerX: 0,
  pointerY: 0,
  /** Projeto em foco na seção de projetos; -1 segue o scroll. */
  activeProject: -1,
  reducedMotion: false,
}

let offsets: number[] = []

export function measureSections() {
  const nodes = document.querySelectorAll<HTMLElement>('[data-scene]')
  offsets = Array.from(nodes, (node) => node.getBoundingClientRect().top + window.scrollY)
}

export function updateSection(scrollY: number) {
  if (offsets.length === 0) return
  const probe = scrollY + window.innerHeight * 0.5
  let i = 0
  while (i < offsets.length - 1 && probe >= offsets[i + 1]) i++
  if (i === offsets.length - 1) {
    sceneState.section = i
    return
  }
  const span = offsets[i + 1] - offsets[i]
  sceneState.section = i + Math.min(Math.max((probe - offsets[i]) / span, 0), 1)
}
