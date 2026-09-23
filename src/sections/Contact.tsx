import { profile } from '../content/profile'

export function Contact() {
  const { email, linkedin, github } = profile.contact
  return (
    <section id="contato" className="section contact" data-scene aria-labelledby="contact-title">
      <div className="column">
        <h2 id="contact-title" className="section-title">
          Tem um sistema para construir?
        </h2>
        <p className="prose">Escreva contando o contexto e o prazo. Respondo por e-mail.</p>
        <a className="contact-email" href={`mailto:${email}`}>
          {email}
        </a>
        <ul className="contact-links">
          <li>
            <a href={linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          {github ? (
            <li>
              <a href={github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
          ) : null}
        </ul>
        <p className="footer-note">
          © {new Date().getFullYear()} {profile.name}. Feito com React Three Fiber.
        </p>
      </div>
    </section>
  )
}
