import { profile } from '../content/profile'

export function Skills() {
  return (
    <section id="competencias" className="section" data-scene aria-labelledby="skills-title">
      <div className="column">
        <h2 id="skills-title" className="section-title">
          Do modelo de IA ao dispositivo na ponta
        </h2>
        <p className="prose">
          As ferramentas que uso em cada camada de um sistema, da tela que o cliente abre até o hardware
          que roda na rede dele.
        </p>
        <dl className="skills">
          {profile.stack.map((layer) => (
            <div key={layer.id} className="skill">
              <dt className="skill-name">{layer.name}</dt>
              <dd className="skill-summary">{layer.summary}</dd>
              <dd className="skill-tools">{layer.tools.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
