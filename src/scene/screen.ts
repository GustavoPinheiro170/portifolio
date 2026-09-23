// Desenha o conteúdo do painel holográfico num canvas 2D, usado como textura.
// Cada seção da página tem uma "tela" própria.

import { profile } from '../content/profile'

export const SCREEN_W = 1024
export const SCREEN_H = 640

const C = {
  bg: '#0D1B2E',
  panel: '#15263F',
  line: '#24385A',
  text: '#E6ECF5',
  dim: '#7D8AA0',
  cobalt: '#6F86FF',
  key: '#8FA2FF',
  str: '#9FE0C8',
  warm: '#F2C27B',
}

const MONO = '500 26px ui-monospace, "Cascadia Code", Consolas, monospace'
const MONO_SM = '500 22px ui-monospace, "Cascadia Code", Consolas, monospace'
const SANS = (w: number, s: number) => `${w} ${s}px "IBM Plex Sans", system-ui, sans-serif`

type Token = [string, string]

// Trecho de código com a cor de cada pedaço.
const code: Token[][] = [
  [['const ', C.key], ['gustavo', C.text], [' = {', C.dim]],
  [['  role: ', C.text], [`'${profile.headline}'`, C.str], [',', C.dim]],
  [['  stack: [', C.text], [profile.stack.flatMap((l) => l.tools).filter((t) => ['Java 8–21', 'Spring Boot', 'Angular'].includes(t)).map((t) => `'${t}'`).join(', '), C.str], ['],', C.dim]],
  [['  building: [', C.text], [profile.projects.map((p) => `'${p.name}'`).join(', '), C.str], ['],', C.dim]],
  [['}', C.dim]],
  [['', C.dim]],
  [['await ', C.key], ['deploy', C.warm], ['(gustavo)', C.text]],
]
const codeLength = code.reduce((n, line) => n + line.reduce((m, [s]) => m + s.length, 0) + 1, 0)

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function chrome(ctx: CanvasRenderingContext2D, title: string) {
  ctx.clearRect(0, 0, SCREEN_W, SCREEN_H)
  roundRect(ctx, 0, 0, SCREEN_W, SCREEN_H, 28)
  ctx.fillStyle = C.bg
  ctx.fill()
  ctx.strokeStyle = C.cobalt
  ctx.lineWidth = 3
  ctx.stroke()
  ;['#FF6B6B', '#F2C27B', '#6FD3A8'].forEach((color, i) => {
    ctx.beginPath()
    ctx.arc(40 + i * 30, 38, 8, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  })
  ctx.font = SANS(500, 22)
  ctx.fillStyle = C.dim
  ctx.fillText(title, 150, 46)
  ctx.fillStyle = C.line
  ctx.fillRect(0, 72, SCREEN_W, 2)
}

function drawCode(ctx: CanvasRenderingContext2D, chars: number, cursorOn: boolean) {
  chrome(ctx, 'gustavo.ts')
  ctx.font = MONO
  let left = chars
  let cx = 0
  let cy = 0
  code.forEach((line, row) => {
    const y = 130 + row * 50
    ctx.fillStyle = C.dim
    ctx.fillText(String(row + 1).padStart(2, ' '), 36, y)
    let x = 100
    for (const [text, color] of line) {
      const shown = text.slice(0, Math.max(left, 0))
      left -= text.length
      ctx.fillStyle = color
      ctx.fillText(shown, x, y)
      x += ctx.measureText(shown).width
      if (left <= 0 && left + text.length >= 0) {
        cx = x
        cy = y
      }
      if (left < 0) break
    }
    left -= 1
    if (left >= 0) {
      cx = 100
      cy = y + 50
    }
  })
  if (cursorOn) {
    ctx.fillStyle = C.cobalt
    ctx.fillRect(cx + 2, cy - 24, 14, 30)
  }
}

function drawTerminal(ctx: CanvasRenderingContext2D, title: string, lines: Token[][], shown: number, cursorOn: boolean) {
  chrome(ctx, title)
  ctx.font = MONO_SM
  const visible = lines.slice(0, shown)
  const start = Math.max(0, visible.length - 11)
  visible.slice(start).forEach((line, i) => {
    let x = 40
    for (const [text, color] of line) {
      ctx.fillStyle = color
      ctx.fillText(text, x, 122 + i * 44)
      x += ctx.measureText(text).width
    }
  })
  if (cursorOn) {
    const y = 122 + Math.min(visible.length - start, 11) * 44
    ctx.fillStyle = C.cobalt
    ctx.fillRect(40, y - 20, 12, 26)
  }
}

const buildLines: Token[][] = [
  [['$ ', C.cobalt], ['npm run build', C.text]],
  [['> tsc && vite build', C.dim]],
  [['✓ ', C.str], ['612 módulos transformados', C.text]],
  [['✓ ', C.str], ['testes passando', C.text]],
  [['✓ ', C.str], ['build pronto em 1.3s', C.text]],
  [['$ ', C.cobalt], ['git push origin main', C.text]],
  [['→ deploy em produção', C.warm]],
]

const nameWidth = Math.max(...profile.stack.map((l) => l.name.length)) + 2
const skillLines: Token[][] = [
  [['$ ', C.cobalt], ['gustavo --skills', C.text]],
  ...profile.stack.map((layer): Token[] => [
    ['✓ ', C.str],
    [layer.name.padEnd(nameWidth, ' '), C.text],
    [layer.tools.slice(0, 2).join(', '), C.dim],
  ]),
]

const gitLines: Token[][] = [
  [['$ ', C.cobalt], ['git log --carreira', C.text]],
  ...profile.experience.map((role, i): Token[] => [
    ['* ', i === 0 ? C.cobalt : C.dim],
    [role.start.padEnd(10, ' '), C.warm],
    [role.company.split(',')[0].padEnd(30, ' '), C.text],
    [role.title.split(',')[0], C.dim],
  ]),
]

function drawIntelivise(ctx: CanvasRenderingContext2D, t: number) {
  chrome(ctx, 'Intelivise — monitoramento')
  const labels = ['Portão', 'Garagem', 'Recepção', 'Perímetro']
  const gw = 300
  const gh = 250
  labels.forEach((label, i) => {
    const x = 32 + (i % 2) * (gw + 16)
    const y = 96 + Math.floor(i / 2) * (gh + 16)
    const grad = ctx.createLinearGradient(x, y, x, y + gh)
    grad.addColorStop(0, '#1C2E4C')
    grad.addColorStop(1, '#0A1424')
    roundRect(ctx, x, y, gw, gh, 12)
    ctx.fillStyle = grad
    ctx.fill()
    // chão e horizonte
    ctx.fillStyle = '#233A5E'
    ctx.fillRect(x, y + gh * 0.62, gw, 2)
    ctx.font = SANS(500, 18)
    ctx.fillStyle = C.text
    ctx.fillText(label, x + 14, y + 28)
    ctx.fillStyle = '#FF6B6B'
    ctx.beginPath()
    ctx.arc(x + gw - 22, y + 22, 6, 0, Math.PI * 2)
    ctx.fill()
  })
  // carro passando na câmera do portão, com a placa detectada
  const carX = 60 + ((t * 60) % 200)
  ctx.fillStyle = '#9AA8BE'
  roundRect(ctx, carX, 250, 150, 50, 14)
  ctx.fill()
  roundRect(ctx, carX + 25, 222, 95, 36, 12)
  ctx.fill()
  ctx.strokeStyle = C.cobalt
  ctx.lineWidth = 3
  ctx.strokeRect(carX + 45, 280, 60, 20)
  ctx.font = SANS(600, 15)
  ctx.fillStyle = C.cobalt
  ctx.fillText('ABC1D23', carX + 40, 318)
  // alerta
  const ax = 680
  roundRect(ctx, ax, 96, 312, 180, 16)
  ctx.fillStyle = C.panel
  ctx.fill()
  ctx.font = SANS(600, 22)
  ctx.fillStyle = C.text
  ctx.fillText('Placa lida no Portão', ax + 22, 140)
  ctx.font = SANS(400, 19)
  ctx.fillStyle = C.dim
  ctx.fillText('ABC1D23, não autorizada', ax + 22, 174)
  ctx.fillStyle = C.str
  ctx.fillText('Enviado no WhatsApp em 1,4 s', ax + 22, 212)
  ctx.fillStyle = C.dim
  ctx.fillText('com foto do recorte', ax + 22, 244)
  roundRect(ctx, ax, 292, 312, 316, 16)
  ctx.fillStyle = C.panel
  ctx.fill()
  ctx.font = SANS(500, 19)
  ;['Agente de borda: online', 'Gravadores: 3 conectados', 'Câmeras com IA: 12', 'VPN WireGuard: ativa'].forEach(
    (row, i) => {
      ctx.fillStyle = C.str
      ctx.beginPath()
      ctx.arc(ax + 30, 336 + i * 64, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = C.text
      ctx.fillText(row, ax + 48, 343 + i * 64)
    },
  )
}

function drawPrecedentia(ctx: CanvasRenderingContext2D, t: number) {
  chrome(ctx, 'PrecedentIA — pesquisa de precedentes')
  const query = 'responsabilidade civil por dano moral em atraso de voo'
  const typed = query.slice(0, Math.min(query.length, Math.floor((t % 9) * 14)))
  roundRect(ctx, 40, 100, 944, 64, 14)
  ctx.fillStyle = C.panel
  ctx.fill()
  ctx.strokeStyle = C.cobalt
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.font = SANS(400, 22)
  ctx.fillStyle = C.text
  ctx.fillText(typed, 70, 141)
  const results: [string, string, string][] = [
    ['STJ', 'Tema repetitivo', 'Dano moral presumido em atraso superior a 4 horas'],
    ['STF', 'Repercussão geral', 'Aplicação da Convenção de Montreal a voos internacionais'],
    ['TJSP', 'Acórdão', 'Distinguishing: atraso causado por condições climáticas'],
  ]
  const ready = typed.length === query.length
  results.forEach(([court, kind, title], i) => {
    const y = 196 + i * 132
    const alpha = ready ? Math.min(1, ((t % 9) - query.length / 14 - i * 0.3) * 2) : 0
    ctx.globalAlpha = Math.max(alpha, 0)
    roundRect(ctx, 40, y, 944, 112, 14)
    ctx.fillStyle = C.panel
    ctx.fill()
    roundRect(ctx, 64, y + 22, 74, 32, 8)
    ctx.fillStyle = i === 0 ? '#2E4BFF' : C.line
    ctx.fill()
    ctx.font = SANS(600, 18)
    ctx.fillStyle = C.text
    ctx.fillText(court, 76, y + 45)
    ctx.fillStyle = C.dim
    ctx.font = SANS(500, 18)
    ctx.fillText(kind, 156, y + 45)
    ctx.font = SANS(500, 22)
    ctx.fillStyle = C.text
    ctx.fillText(title, 64, y + 88)
    ctx.globalAlpha = 1
  })
}

function drawPlano(ctx: CanvasRenderingContext2D, t: number) {
  chrome(ctx, 'Plano & Corte — plano de corte')
  // chapa 2750 x 1850 com as peças encaixadas
  const sx = 40
  const sy = 100
  const sw = 600
  const sh = 404
  ctx.fillStyle = '#E9D9BC'
  ctx.fillRect(sx, sy, sw, sh)
  const pieces: [number, number, number, number, string][] = [
    [0, 0, 0.42, 0.55, 'Lateral'],
    [0.42, 0, 0.42, 0.55, 'Lateral'],
    [0.84, 0, 0.16, 0.55, 'Prat.'],
    [0, 0.55, 0.3, 0.45, 'Porta'],
    [0.3, 0.55, 0.3, 0.45, 'Porta'],
    [0.6, 0.55, 0.26, 0.24, 'Gaveta'],
    [0.6, 0.79, 0.26, 0.21, 'Gaveta'],
  ]
  const shown = Math.min(pieces.length, Math.floor((t % 7) * 2.2) + 1)
  pieces.slice(0, shown).forEach(([x, y, w, h, label]) => {
    const px = sx + x * sw + 3
    const py = sy + y * sh + 3
    const pw = w * sw - 6
    const ph = h * sh - 6
    ctx.fillStyle = '#C79B62'
    ctx.fillRect(px, py, pw, ph)
    // veio da madeira
    ctx.strokeStyle = 'rgba(120, 80, 40, 0.25)'
    ctx.lineWidth = 1
    for (let k = 12; k < ph; k += 14) {
      ctx.beginPath()
      ctx.moveTo(px, py + k)
      ctx.lineTo(px + pw, py + k)
      ctx.stroke()
    }
    ctx.font = SANS(600, 18)
    ctx.fillStyle = '#3B2A17'
    ctx.fillText(label, px + 10, py + 26)
  })
  ctx.font = SANS(400, 18)
  ctx.fillStyle = C.dim
  ctx.fillText('Chapa MDF 18 mm, 2750 × 1850, kerf 4 mm', sx, sy + sh + 40)
  ctx.fillStyle = C.str
  ctx.fillText(`Aproveitamento ${Math.round(70 + (shown / pieces.length) * 22)}%`, sx, sy + sh + 72)
  // orçamento
  const ax = 668
  roundRect(ctx, ax, 100, 324, 508, 16)
  ctx.fillStyle = C.panel
  ctx.fill()
  ctx.font = SANS(600, 24)
  ctx.fillStyle = C.text
  ctx.fillText('Orçamento', ax + 24, 146)
  const rows: [string, string][] = [
    ['Chapas', 'R$ 612,00'],
    ['Fita de borda', 'R$ 84,50'],
    ['Ferragens', 'R$ 236,00'],
    ['Mão de obra', 'R$ 780,00'],
    ['Margem e impostos', 'R$ 548,20'],
  ]
  ctx.font = SANS(400, 19)
  rows.forEach(([k, v], i) => {
    const y = 196 + i * 50
    ctx.fillStyle = C.dim
    ctx.fillText(k, ax + 24, y)
    ctx.fillStyle = C.text
    ctx.fillText(v, ax + 300 - ctx.measureText(v).width, y)
  })
  ctx.fillStyle = C.line
  ctx.fillRect(ax + 24, 452, 276, 2)
  ctx.font = SANS(700, 30)
  ctx.fillStyle = C.text
  ctx.fillText('R$ 2.260,70', ax + 24, 500)
  roundRect(ctx, ax + 24, 530, 276, 52, 12)
  ctx.fillStyle = '#2E4BFF'
  ctx.fill()
  ctx.font = SANS(600, 19)
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText('Gerar proposta em PDF', ax + 52, 563)
}

function drawContact(ctx: CanvasRenderingContext2D, cursorOn: boolean) {
  chrome(ctx, 'nova mensagem')
  ctx.font = SANS(700, 64)
  ctx.fillStyle = C.text
  ctx.fillText('Vamos conversar?', 60, 250)
  ctx.font = SANS(500, 32)
  ctx.fillStyle = C.cobalt
  ctx.fillText(profile.contact.email, 60, 330)
  if (cursorOn) {
    const w = ctx.measureText(profile.contact.email).width
    ctx.fillRect(66 + w, 302, 4, 36)
  }
  ctx.font = SANS(400, 24)
  ctx.fillStyle = C.dim
  ctx.fillText('Respondo por e-mail.', 60, 400)
}

export type ScreenMode =
  | 'code'
  | 'build'
  | 'skills'
  | 'git'
  | 'intelivise'
  | 'precedentia'
  | 'planoecorte'
  | 'contact'

/** Desenha a tela; `t` é o tempo em segundos desde que o modo começou. */
export function drawScreen(ctx: CanvasRenderingContext2D, mode: ScreenMode, t: number, still: boolean) {
  const cursorOn = still || Math.floor(t * 2) % 2 === 0
  switch (mode) {
    case 'code': {
      const cycle = codeLength + 50
      drawCode(ctx, still ? codeLength : Math.floor(t * 22) % cycle, cursorOn)
      break
    }
    case 'build':
      drawTerminal(ctx, 'terminal', buildLines, still ? buildLines.length : Math.floor(t * 2.2) + 1, cursorOn)
      break
    case 'skills':
      drawTerminal(ctx, 'terminal', skillLines, still ? skillLines.length : Math.floor(t * 2.5) + 1, cursorOn)
      break
    case 'git':
      drawTerminal(ctx, 'terminal', gitLines, still ? gitLines.length : Math.floor(t * 3) + 1, cursorOn)
      break
    case 'intelivise':
      drawIntelivise(ctx, still ? 1.5 : t)
      break
    case 'precedentia':
      drawPrecedentia(ctx, still ? 8.9 : t)
      break
    case 'planoecorte':
      drawPlano(ctx, still ? 6.9 : t)
      break
    case 'contact':
      drawContact(ctx, cursorOn)
      break
  }
}
