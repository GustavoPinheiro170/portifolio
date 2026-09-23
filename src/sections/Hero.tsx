import type { CSSProperties } from 'react'
import { profile } from '../content/profile'

// Ordem da sequência de entrada (a única animação automática da página).
const step = (i: number) => ({ '--i': i }) as CSSProperties

export function Hero() {
  const [first, ...rest] = profile.name.split(' ')
  return (
    <section id="inicio" className="section hero" data-scene>
      <div className="column">
        <p className="hero-role intro" style={step(0)}>
          {profile.headline}
          <span className="hero-place">{profile.location}</span>
        </p>
        <h1 className="hero-name">
          <span className="intro" style={step(1)}>
            {first}
          </span>
          <span className="intro" style={step(2)}>
            {rest.join(' ')}
          </span>
        </h1>
        <p className="hero-pitch intro" style={step(3)}>
          {profile.pitch}
        </p>
        <div className="hero-actions intro" style={step(4)}>
          <a className="button button-primary" href="#contato">
            Entrar em contato
          </a>
          <a className="button" href="#experiencia">
            Ver experiência
          </a>
        </div>
        {profile.available ? (
          <p className="status intro" style={step(5)}>
            <span className="status-dot" aria-hidden="true" />
            Aberto a novas oportunidades
          </p>
        ) : null}
      </div>
    </section>
  )
}
