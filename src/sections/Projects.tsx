import { profile } from '../content/profile'
import { sceneState } from '../lib/sceneState'

// Focar um projeto troca o mockup no painel holográfico.
const focus = (index: number) => () => {
  sceneState.activeProject = index
}
const release = () => {
  sceneState.activeProject = -1
}

export function Projects() {
  return (
    <section id="projetos" className="section" data-scene aria-labelledby="proj-title">
      <div className="column">
        <h2 id="proj-title" className="section-title">
          Produtos no ar
        </h2>
        <ul className="projects">
          {profile.projects.map((project, i) => (
            <li
              key={project.name}
              className="project"
              onPointerEnter={focus(i)}
              onPointerLeave={release}
              onFocus={focus(i)}
              onBlur={release}
            >
              <p className="project-kind">
                {project.kind}
                <span className="role-place">{project.role}</span>
              </p>
              <h3 className="project-name">
                {project.href ? (
                  <a href={project.href} target="_blank" rel="noreferrer">
                    {project.name}
                  </a>
                ) : (
                  project.name
                )}
              </h3>
              <p className="project-summary">{project.summary}</p>
              <ul className="project-features">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <ul className="tags" aria-label="Tecnologias">
                {project.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
