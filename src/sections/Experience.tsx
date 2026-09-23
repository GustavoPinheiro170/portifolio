import { profile } from '../content/profile'

export function Experience() {
  return (
    <section id="experiencia" className="section" data-scene aria-labelledby="exp-title">
      <div className="column">
        <h2 id="exp-title" className="section-title">
          Onde isso foi posto à prova
        </h2>
        <ol className="timeline">
          {profile.experience.map((role) => (
            <li key={`${role.company}-${role.start}`} className="role">
              <p className="role-period">
                {role.start} – {role.end}
                {role.location ? <span className="role-place">{role.location}</span> : null}
              </p>
              <h3 className="role-title">
                {role.title}
                <span className="role-company">{role.company}</span>
              </h3>
              <ul className="role-highlights">
                {role.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <h3 className="subsection-title">Formação</h3>
        <ul className="education">
          {profile.education.map((item) => (
            <li key={item.course} className="course">
              <p className="course-name">
                {item.course}
                {item.current ? <span className="course-status">em andamento</span> : null}
              </p>
              <p className="course-meta">
                {item.school}
                <span className="role-place">{item.period}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
