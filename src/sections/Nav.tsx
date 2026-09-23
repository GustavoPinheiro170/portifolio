import { profile } from '../content/profile'

const links = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#competencias', label: 'Competências' },
  { href: '#experiencia', label: 'Experiência' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#contato', label: 'Contato' },
]

export function Nav() {
  return (
    <header className="nav">
      <a className="nav-home" href="#inicio">
        {profile.name}
      </a>
      <nav aria-label="Seções">
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
