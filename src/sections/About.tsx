import { profile } from '../content/profile'

export function About() {
  return (
    <section id="sobre" className="section" data-scene aria-labelledby="sobre-title">
      <div className="column">
        <h2 id="sobre-title" className="section-title">
          Do cabo de rede ao microsserviço
        </h2>
        {profile.about.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="prose">
            {paragraph}
          </p>
        ))}
        <dl className="facts">
          <div>
            <dt>Base</dt>
            <dd>{profile.location}</dd>
          </div>
          <div>
            <dt>Atuação</dt>
            <dd>Back-end Java e front-end Angular</dd>
          </div>
          <div>
            <dt>Formação</dt>
            <dd>MBA em Engenharia de Software, USP/Esalq</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
