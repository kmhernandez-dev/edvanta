export const BRASIL_META_MENSAL_COP = 50_000_000_000;

export const BRASIL_NAV = [
  { label: 'Artigos', to: '/br/artigos' },
  { label: 'Cursos', to: '/br/cursos' },
  { label: 'Guias', to: '/br/guias' },
];

export const BRASIL_CURSOS = [
  {
    slug: 'farmacoterapia-do-diabetes',
    titulo: 'Farmacoterapia do Diabetes',
    categoria: 'Farmácia clínica',
    resumo: 'Tratamento do diabetes tipo 1 e 2, metas terapêuticas, segurança, monitoramento e cuidado farmacêutico.',
    publico: 'Farmacêuticos e estudantes de Farmácia',
    modulos: ['Diagnóstico e metas', 'Antidiabéticos não insulínicos', 'Insulinas e dispositivos', 'Risco cardiorrenal', 'Seguimento farmacoterapêutico'],
    origem: '/curso-de-farmacoterapia-de-la-diabetes',
  },
  {
    slug: 'farmacoterapia-da-hipertensao-arterial',
    titulo: 'Farmacoterapia da Hipertensão Arterial',
    categoria: 'Farmácia clínica',
    resumo: 'Estratificação de risco, classes anti-hipertensivas, combinações, populações especiais e acompanhamento.',
    publico: 'Farmacêuticos clínicos e hospitalares',
    modulos: ['Diagnóstico e risco cardiovascular', 'IECA, BRA e bloqueadores de cálcio', 'Diuréticos e betabloqueadores', 'Hipertensão resistente', 'Acompanhamento'],
    origem: '/curso-de-farmacoterapia-de-la-hipertension-arterial',
  },
  {
    slug: 'boas-praticas-de-fabricacao',
    titulo: 'Boas Práticas de Fabricação de Medicamentos',
    categoria: 'Qualidade e produção',
    resumo: 'Sistema da qualidade, pessoal, instalações, documentação, produção, validação e autoinspeção.',
    publico: 'Profissionais da indústria farmacêutica',
    modulos: ['Sistema da qualidade', 'Pessoal e instalações', 'Documentação', 'Produção e controle', 'Validação e autoinspeção'],
    origem: '/curso-de-buenas-practicas-de-manufactura-bpm',
  },
  {
    slug: 'controle-de-qualidade-de-medicamentos',
    titulo: 'Controle de Qualidade de Medicamentos',
    categoria: 'Qualidade e produção',
    resumo: 'Especificações, amostragem, métodos analíticos, microbiologia, estabilidade e investigação de resultados.',
    publico: 'Analistas e responsáveis por controle de qualidade',
    modulos: ['Especificações e compêndios', 'Amostragem', 'Análises físico-químicas', 'Controle microbiológico', 'Estabilidade e OOS'],
    origem: '/curso-de-control-de-calidad-de-medicamentos',
  },
  {
    slug: 'farmacovigilancia',
    titulo: 'Farmacovigilância e Segurança de Medicamentos',
    categoria: 'Segurança do paciente',
    resumo: 'Detecção, avaliação, notificação e prevenção de eventos adversos e outros problemas relacionados a medicamentos.',
    publico: 'Farmacêuticos, equipes de qualidade e segurança',
    modulos: ['Fundamentos', 'Notificação individual', 'Avaliação de causalidade', 'Detecção de sinais', 'Gestão de risco'],
    origem: '/curso-de-farmacologia-oncologica',
  },
  {
    slug: 'assuntos-regulatorios-no-brasil',
    titulo: 'Assuntos Regulatórios Farmacêuticos no Brasil',
    categoria: 'Assuntos regulatórios',
    resumo: 'Introdução ao ciclo regulatório de medicamentos, documentação, mudanças pós-registro e vigilância sanitária.',
    publico: 'Profissionais que atuam ou querem atuar em assuntos regulatórios',
    modulos: ['Sistema regulatório brasileiro', 'Dossiê e regularização', 'Pós-registro', 'Rotulagem e publicidade', 'Farmacovigilância'],
    origem: '/curso-de-asuntos-regulatorios-farmaceuticos-en-colombia',
  },
].map((curso) => ({ ...curso, estado: 'Pré-inscrição em português' }));

export const BRASIL_GUIAS = [
  {
    slug: 'rotina-de-levotiroxina',
    titulo: 'Como organizar sua rotina de levotiroxina',
    categoria: 'Saúde da tireoide',
    resumo: 'Horário, água, café, alimentos, cálcio, ferro e perguntas para levar à consulta.',
    paraQuem: 'Pessoas que usam levotiroxina e seus cuidadores',
    origem: '/guia/levotiroxina-sin-sorpresas',
  },
  {
    slug: 'atencao-farmaceutica-na-pratica',
    titulo: 'Atenção farmacêutica na prática',
    categoria: 'Farmácia clínica',
    resumo: 'Um roteiro para entrevistar, identificar necessidades, documentar e acompanhar resultados.',
    paraQuem: 'Farmacêuticos clínicos e estudantes',
    origem: '/guia/fundamentos-gestion-integral-farmacoterapia',
  },
  {
    slug: 'notificacao-em-farmacovigilancia',
    titulo: 'Notificação em farmacovigilância',
    categoria: 'Segurança do paciente',
    resumo: 'Dados mínimos, linha do tempo, causalidade e comunicação clara de uma suspeita de evento adverso.',
    paraQuem: 'Serviços de saúde, indústria e profissionais notificadores',
    origem: '/guia/seguridad-del-medicamento',
  },
  {
    slug: 'checklist-de-boas-praticas',
    titulo: 'Checklist de Boas Práticas de Fabricação',
    categoria: 'Qualidade',
    resumo: 'Pontos essenciais para revisar sistema da qualidade, instalações, registros, produção e autoinspeção.',
    paraQuem: 'Qualidade, produção e auditoria',
    origem: '/guia/claude-aseguramiento-de-calidad-farmaceutica',
  },
  {
    slug: 'investigacao-de-resultados-oos',
    titulo: 'Guia para investigação de resultados fora de especificação',
    categoria: 'Controle de qualidade',
    resumo: 'Como estruturar a investigação laboratorial, registrar evidências e definir ações sem pular etapas.',
    paraQuem: 'Laboratórios de controle de qualidade',
    origem: '/guia/claude-control-de-calidad-farmaceutica',
  },
  {
    slug: 'primeiros-passos-em-assuntos-regulatorios',
    titulo: 'Primeiros passos em assuntos regulatórios',
    categoria: 'Assuntos regulatórios',
    resumo: 'Mapa de competências, documentos e decisões para começar uma carreira regulatória no setor farmacêutico.',
    paraQuem: 'Estudantes e profissionais em transição de carreira',
    origem: '/guia/metodo-linkedin-edutin',
  },
].map((guia) => ({ ...guia, estado: 'Edição brasileira em preparação' }));

export const BRASIL_ARTIGOS_SEMENTE = [
  {
    slug: 'como-tomar-levotiroxina-correctamente',
    titulo: 'Como organizar uma rotina de levotiroxina',
    descricao: 'Uma rotina útil é constante e realista. Veja como separar café, alimentos e suplementos e preparar sua consulta.',
    categoria: 'Saúde da tireoide',
    mdPath: '/br/artigos/como-tomar-levotiroxina-correctamente.md',
    origem: '/articulos/como-tomar-levotiroxina-correctamente',
    revisao: 'pendente',
  },
  {
    slug: 'que-es-atencion-farmaceutica',
    titulo: 'O que é atenção farmacêutica e como aplicar na prática',
    descricao: 'Entenda a diferença entre dispensação, farmácia clínica e atenção farmacêutica e veja um processo passo a passo.',
    categoria: 'Atenção farmacêutica',
    mdPath: '/br/artigos/que-es-atencion-farmaceutica.md',
    origem: '/articulos/que-es-atencion-farmaceutica',
    revisao: 'pendente',
  },
  {
    slug: 'diferencia-prm-rnm',
    titulo: 'Diferença entre PRM e RNM na atenção farmacêutica',
    descricao: 'Como distinguir problemas relacionados a medicamentos de resultados negativos associados à farmacoterapia.',
    categoria: 'Atenção farmacêutica',
    mdPath: '/br/artigos/diferencia-prm-rnm.md',
    origem: '/articulos/diferencia-prm-rnm',
    revisao: 'pendente',
  },
  {
    slug: 'iso-9001-explicada',
    titulo: 'ISO 9001 explicada para profissionais farmacêuticos',
    descricao: 'Princípios, processos, riscos, informação documentada e melhoria contínua em linguagem prática.',
    categoria: 'Qualidade',
    mdPath: '/br/artigos/iso-9001-explicada.md',
    origem: '/articulos/iso-9001-explicada',
    revisao: 'pendente',
  },
];

export const artigoBrasil = (slug) => BRASIL_ARTIGOS_SEMENTE.find((artigo) => artigo.slug === slug) || null;
export const cursoBrasil = (slug) => BRASIL_CURSOS.find((curso) => curso.slug === slug) || null;
export const guiaBrasil = (slug) => BRASIL_GUIAS.find((guia) => guia.slug === slug) || null;
