import { lazy, Suspense, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { measureSections, sceneState, updateSection } from './lib/sceneState'
import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Skills } from './sections/Skills'
import { Experience } from './sections/Experience'
import { Projects } from './sections/Projects'
import { Contact } from './sections/Contact'
import { SceneFallback } from './sections/SceneFallback'

// A cena 3D é o maior pedaço do bundle; o texto aparece antes dela.
const DevScene = lazy(() => import('./scene/DevScene'))

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const [webgl] = useState(hasWebGL)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    sceneState.reducedMotion = motionQuery.matches

    const lenis = motionQuery.matches ? null : new Lenis({ lerp: 0.1, anchors: true })
    let raf = 0
    const loop = (time: number) => {
      lenis?.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const stage = document.querySelector<HTMLElement>('.stage')
    const onScroll = () => {
      updateSection(window.scrollY)
      stage?.toggleAttribute('data-hero', sceneState.section < 0.6)
    }
    const onResize = () => {
      measureSections()
      onScroll()
    }
    const onPointer = (e: PointerEvent) => {
      sceneState.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      sceneState.pointerY = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onMotionChange = (e: MediaQueryListEvent) => {
      sceneState.reducedMotion = e.matches
    }

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(document.body)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    motionQuery.addEventListener('change', onMotionChange)
    onResize()

    return () => {
      cancelAnimationFrame(raf)
      lenis?.destroy()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointer)
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  return (
    <>
      <div className="stage" aria-hidden="true">
        {webgl ? (
          <Suspense fallback={null}>
            <DevScene />
          </Suspense>
        ) : (
          <SceneFallback />
        )}
      </div>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
