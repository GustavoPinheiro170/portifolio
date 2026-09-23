// Todo o conteúdo do site vive aqui. Experiência e formação vieram do LinkedIn.

export type Layer = {
  id: string
  name: string
  summary: string
  tools: string[]
}

export type Role = {
  company: string
  title: string
  start: string
  end: string
  location?: string
  highlights: string[]
}

export type Project = {
  name: string
  kind: string
  role: string
  summary: string
  features: string[]
  stack: string[]
  href?: string
  /** Mockup exibido no painel holográfico quando o projeto está em foco. */
  screen?: 'intelivise' | 'precedentia' | 'planoecorte'
}

export type Education = {
  school: string
  course: string
  period: string
  /** Curso em andamento. */
  current?: boolean
}

export const profile = {
  name: 'Gustavo Pinheiro',
  headline: 'Senior Software Engineer, Java e Angular',
  location: 'São Paulo, Brasil',
  available: true,
  pitch:
    'Construo APIs e microsserviços em Java para sistemas críticos de grandes empresas, e produtos próprios com inteligência artificial.',
  about: [
    'Comecei em 2018 administrando redes e sistemas de CFTV. Passei pelo front-end e hoje trabalho como engenheiro de software sênior, construindo APIs e microsserviços em Java e Spring Boot para bancos, seguradoras e grandes clientes corporativos.',
    'Fora dos clientes, fundei e desenvolvo meus próprios produtos: o Intelivise junta a experiência com CFTV à inteligência artificial na borda, o PrecedentIA leva RAG à pesquisa jurídica e o Plano & Corte automatiza o orçamento de marcenarias.',
  ],

  // Competências agrupadas por camada do sistema.
  stack: [
    {
      id: 'backend',
      name: 'Back-end',
      summary: 'APIs e microsserviços para sistemas críticos, com foco em estabilidade.',
      tools: ['Java 8–21', 'Spring Boot', 'Microsserviços', 'APIs REST', 'WebSockets'],
    },
    {
      id: 'frontend',
      name: 'Front-end',
      summary: 'Interfaces integradas aos serviços, com testes e arquitetura padronizada.',
      tools: ['Angular', 'TypeScript', 'React', 'Jasmine e Karma', 'SCSS'],
    },
    {
      id: 'mensageria',
      name: 'Mensageria e integração',
      summary: 'Sistemas distribuídos conversando de forma assíncrona e confiável.',
      tools: ['Kafka', 'RabbitMQ', 'Integração com legados', 'WhatsApp e Telegram'],
    },
    {
      id: 'dados',
      name: 'Dados',
      summary: 'Bancos relacionais e NoSQL, com versionamento do esquema.',
      tools: ['Oracle', 'MongoDB', 'MySQL', 'Liquibase'],
    },
    {
      id: 'cloud',
      name: 'Cloud e operação',
      summary: 'Deploy previsível, observabilidade e modernização de plataformas legadas.',
      tools: ['AWS (ECS, ECR, Lambda, S3, SNS)', 'Kubernetes', 'Observabilidade', 'Linux', 'Redes e firewall'],
    },
    {
      id: 'ia',
      name: 'Inteligência artificial',
      summary: 'IA aplicada nos meus produtos, da busca jurídica à visão computacional.',
      tools: ['RAG', 'LLMs', 'Visão computacional', 'Leitura de placas (LPR)'],
    },
  ] as Layer[],

  // Da mais recente para a mais antiga.
  experience: [
    {
      company: 'FCamara',
      title: 'Senior Software Engineer, Java e Angular',
      start: 'out 2024',
      end: 'hoje',
      location: 'Remoto',
      highlights: [
        'Desenvolvo e sustento APIs REST e microsserviços em Java (8–21) com Spring Boot para clientes corporativos de grande porte, garantindo alta disponibilidade em sistemas críticos.',
        'Atuo em ambiente AWS (ECS, ECR, Lambda, S3, SNS) e na operação de clusters Kubernetes, apoiando a modernização de plataformas legadas.',
        'Integro sistemas distribuídos com mensageria assíncrona (Kafka e RabbitMQ) e persistência em bancos SQL e MongoDB.',
        'Lidero iniciativas de observabilidade e de melhoria do deploy, para releases mais estáveis e previsíveis.',
        'Faço code review e ajudo a definir boas práticas, elevando a qualidade e a manutenibilidade do código.',
      ],
    },
    {
      company: 'Porto',
      title: 'Senior Software Engineer, Back-end',
      start: 'jan 2024',
      end: 'out 2024',
      location: 'São Paulo, híbrido',
      highlights: [
        'Desenvolvi e sustentei APIs e serviços em Java 8+ com Spring Boot para sistemas críticos do setor de seguros, com foco em estabilidade e performance.',
        'Modernizei aplicações legadas e otimizei rotinas, com mais confiabilidade e melhor tempo de resposta.',
        'Trabalhei com Oracle e MongoDB e integrei sistemas legados por mensageria corporativa (Kafka e RabbitMQ).',
        'Participei de refinamentos técnicos e code review com times multidisciplinares.',
      ],
    },
    {
      company: 'Santander Tecnologia Brasil',
      title: 'Full-stack Developer',
      start: 'ago 2021',
      end: 'jan 2024',
      location: 'São Paulo, híbrido',
      highlights: [
        'Desenvolvi sistemas financeiros de alta criticidade com back-end Java (Spring Boot) em arquitetura de microsserviços.',
        'Construí APIs REST e regras de negócio para sistemas internos do banco, seguindo padrões de segurança e performance.',
        'Gerenciei versionamento e procedures de banco com Liquibase e mantive webservices Java em WebSphere.',
        'Atuei também no front-end em Angular, integrando as interfaces aos serviços.',
      ],
    },
    {
      company: 'BRQ Digital Solutions',
      title: 'Front-end Angular Developer, alocado no Santander',
      start: 'mar 2021',
      end: 'ago 2021',
      location: 'São Paulo',
      highlights: [
        'Desenvolvi sistemas em Angular 8+ integrados a serviços Java via WebSockets (Spring Boot).',
        'Implementei testes unitários com Jasmine e Karma, aumentando a confiabilidade das entregas.',
        'Apliquei arquitetura front-end e pré-processadores CSS, padronizando o desenvolvimento da equipe.',
      ],
    },
    {
      company: 'Afresp',
      title: 'Front-end Developer',
      start: 'mar 2020',
      end: 'mar 2021',
      location: 'São Paulo',
      highlights: [
        'Desenvolvi aplicações web com HTML, SCSS, JavaScript e PHP, integradas a APIs REST.',
        'Usei ReactJS, React Native e Vue, e criei um ambiente de testes com Node.js.',
        'Atendi demandas em sistemas TOTVS e .NET e mantive bancos MySQL.',
      ],
    },
    {
      company: 'Digital DEV, Desenvolvimento & 3D',
      title: 'Web Developer, Front-end (autônomo)',
      start: 'out 2019',
      end: 'mar 2020',
      location: 'São Paulo',
      highlights: [
        'Criei, mantive e hospedei sites para pequenas empresas, com identidade visual, SEO e objetos e logotipos 3D.',
      ],
    },
    {
      company: 'C4i Monitoramento 360º',
      title: 'Analista de TI',
      start: 'jun 2018',
      end: 'jun 2019',
      location: 'São Paulo',
      highlights: [
        'Administrei redes e fiz a manutenção de sistemas de CFTV (Intelbras, Hikvision, Axis) e controle de acesso.',
        'Cuidei de Active Directory, firewall (DDNS, PAT, NAT) e servidores Linux e Windows Server.',
        'Montei o monitoramento com GLPI, Zabbix e Power BI e dei suporte remoto e presencial a clientes.',
      ],
    },
  ] as Role[],

  // Produtos próprios: fundador e único desenvolvedor de todos.
  // Descrições tiradas dos sites públicos de cada produto.
  projects: [
    {
      name: 'Intelivise',
      role: 'Fundador e desenvolvedor',
      kind: 'CFTV com inteligência artificial na borda',
      summary:
        'Transforma câmeras e gravadores comuns (Intelbras, Hikvision e outros) em monitoramento inteligente: lê placas de veículos e avisa no WhatsApp ou Telegram, com foto, em menos de 2 segundos.',
      features: [
        'Agente de borda em Raspberry Pi na rede do cliente, ligado à nuvem por VPN WireGuard',
        'Leitura de placas (LPR) com listas de autorizados e bloqueados',
        'Mosaico ao vivo de até 16 câmeras no celular, tablet ou computador',
      ],
      stack: ['Angular', 'RTSP e HLS', 'WebRTC', 'WireGuard', 'Raspberry Pi', 'JWT'],
      href: 'https://intelivise.com.br/',
      screen: 'intelivise',
    },
    {
      name: 'PrecedentIA',
      role: 'Fundador e desenvolvedor',
      kind: 'Inteligência artificial jurídica',
      summary:
        'Pesquisa de precedentes qualificados, súmulas e acórdãos no STF, STJ, TST e tribunais de justiça, com respostas fundamentadas na jurisprudência real.',
      features: [
        'Busca com RAG sobre a base de jurisprudência',
        'Auditor de petições com cotejo analítico',
        'Identificação de overruling e distinguishing',
      ],
      stack: ['Angular', 'IA generativa', 'RAG', 'LegalTech'],
      href: 'https://precedentia.cloud/',
      screen: 'precedentia',
    },
    {
      name: 'Plano & Corte',
      role: 'Fundador e desenvolvedor',
      kind: 'SaaS para marcenarias',
      summary:
        'Plano de corte de MDF, orçamento e projeto de móveis em 3D numa só plataforma, para a marcenaria sair do projeto à proposta sem planilha nem CAD.',
      features: [
        'Otimização de chapas de MDF e MDP com controle de veio, kerf e fita de borda',
        'Orçamento automático com material, mão de obra, margem, impostos e comissão',
        'Móvel em 3D ajustável que gera a lista de peças e a proposta em PDF com a marca do cliente',
      ],
      stack: ['Angular', 'Three.js', 'Otimização de corte', 'Geração de PDF', 'Assinatura recorrente'],
      href: 'https://planoecorte.com.br/',
      screen: 'planoecorte',
    },
  ] as Project[],

  // Da mais recente para a mais antiga.
  education: [
    {
      school: 'FIAP',
      course: 'MBA em Arquitetura de Software',
      period: 'ago 2026 – jun 2027',
      current: true,
    },
    {
      school: 'USP/Esalq',
      course: 'MBA em Engenharia de Software',
      period: 'jan 2024 – jul 2025',
    },
    {
      school: 'UNINOVE',
      course: 'Tecnologia em Análise e Desenvolvimento de Sistemas',
      period: 'jul 2017 – dez 2020',
    },
    {
      school: 'Impacta Tecnologia',
      course: 'Desenvolvimento em ReactJS e React Native',
      period: '2020',
    },
    {
      school: 'Senai São Paulo',
      course: 'Eletricista automotivo',
      period: '2014',
    },
  ] as Education[],

  contact: {
    email: 'gustavocampos170@gmail.com',
    linkedin: 'https://www.linkedin.com/in/gustavo-pinheiro-dev/',
    // TODO: usuário do GitHub
    github: '',
  },
}
