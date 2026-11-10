/**
 * ============================================================
 *  generar-habilidades-blandas.mjs — Escuela de Habilidades Blandas
 *
 *  Lee Edvanta_Cursos_Habilidades_Blandas.xlsx (curaduría nov. 2026) y
 *  genera:
 *
 *   1. api/migrations/075_cursos_habilidades_blandas.sql (pública): los
 *      10 cursos, sus 40 unidades y 80 clases en texto, y la aprobación
 *      de publicación (la hace el servidor al arrancar).
 *   2. api/migrations/076_evaluacion_habilidades_blandas.sql (PRIVADA,
 *      .gitignore): 40 quizzes con sus claves, 40 actividades con
 *      rúbrica, 40 foros y la política de nota. Se aplica a mano, como
 *      las demás capas de evaluación.
 *   3. src/data/edvanta/cursosHabilidadesBlandas.js: la lista estática
 *      con la que el HTML de la escuela enlaza sus cursos.
 *   4. Las portadas de los cursos y la imagen de la escuela.
 *
 *   node scripts/generar-habilidades-blandas.mjs <ruta al .xlsx>
 *
 *  Falla si el archivo no trae lo que declara su índice, si queda un
 *  marcador sin resolver o si un bloque no pasa el validador del editor.
 * ============================================================
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { strFromU8, unzipSync } from 'fflate';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as Lucide from 'lucide-react';
import { readBlockData } from '../api/lib/aula/blocks.js';
import { slugBaseDeCurso } from '../api/lib/slugs-publicos.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const archivoXlsx = process.argv[2];
if (!archivoXlsx) {
  console.error('Uso: node scripts/generar-habilidades-blandas.mjs <ruta al .xlsx>');
  process.exit(2);
}

/* ── 1. Lectura del .xlsx (ZIP de XML, conservando la columna real) ── */

const zip = unzipSync(new Uint8Array(readFileSync(archivoXlsx)));
const leer = (n) => (zip[n] ? strFromU8(zip[n]) : '');
const desescapar = (t) => t
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&amp;/g, '&');
const compartidas = [...leer('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)]
  .map((si) => [...si[1].matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((m) => desescapar(m[1])).join(''));
const destino = new Map([...leer('xl/_rels/workbook.xml.rels').matchAll(/<Relationship\s[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g)].map((m) => [m[1], m[2]]));
const hojas = new Map([...leer('xl/workbook.xml').matchAll(/<sheet\s[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/g)]
  .map((m) => [desescapar(m[1]), `xl/${destino.get(m[2]).replace(/^\/?xl\//, '')}`]));

/** Filas de una hoja: [{ r, A, B, ... }] con texto plano. */
function filas(nombre) {
  const ruta = hojas.get(nombre);
  if (!ruta) throw new Error(`Falta la hoja «${nombre}»`);
  const out = [];
  for (const fila of leer(ruta).matchAll(/<row\s[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
    const f = { r: Number(fila[1]) };
    for (const c of fila[2].matchAll(/<c\s([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const ref = /r="([A-Z]+)\d+"/.exec(c[1]);
      if (!ref) continue;
      const tipo = /t="([^"]+)"/.exec(c[1])?.[1];
      const cuerpo = c[2] || '';
      let v = '';
      if (tipo === 's') v = compartidas[Number(/<v>([\s\S]*?)<\/v>/.exec(cuerpo)?.[1])] ?? '';
      else if (tipo === 'inlineStr') v = [...cuerpo.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((m) => desescapar(m[1])).join('');
      else v = desescapar(/<v>([\s\S]*?)<\/v>/.exec(cuerpo)?.[1] ?? '');
      if (v !== '') f[ref[1]] = v.trim();
    }
    out.push(f);
  }
  return out;
}

/* ── 2. Lo que decide Edvanta para cada curso ─────────────────────── */

// Área grande (escuela) y etiqueta fina de cada curso. El slug lo pone el
// servidor con slugBaseDeCurso; aquí se comprueba que sea el esperado.
const AREA = 'Habilidades Blandas';
const CURSOS = [
  {
    hoja: '01 Oratoria', clave: 'hb01', slug: 'curso-de-oratoria', portada: 'oratoria',
    categoria: 'Oratoria y presentaciones', nivel: 'basico',
    etiquetas: ['Oratoria', 'Hablar en público', 'Comunicación', 'Presentaciones', 'Habilidades blandas'],
    resultados: [
      'Explicar los pilares de la oratoria y diagnosticar tu punto de partida al hablar en público.',
      'Estructurar un discurso con apertura, cuerpo y cierre alrededor de un mensaje central.',
      'Usar la voz y el lenguaje corporal para reforzar tu mensaje.',
      'Ensayar con método, improvisar y responder preguntas del público sin quedarte en blanco.',
    ],
    arte: { centro: 'Mic', satelites: ['MessageSquareText', 'Users', 'AudioLines'], tarjeta: 'barras' },
  },
  {
    hoja: '02 Miedo escénico', clave: 'hb02', slug: 'curso-para-perder-el-miedo-a-hablar-en-publico', portada: 'miedo-a-hablar-en-publico',
    categoria: 'Oratoria y presentaciones', nivel: 'basico',
    etiquetas: ['Miedo escénico', 'Hablar en público', 'Ansiedad', 'Glosofobia', 'Habilidades blandas'],
    resultados: [
      'Entender qué es el miedo a hablar en público, por qué ocurre y qué pensamientos lo alimentan.',
      'Aplicar técnicas de respiración y de reinterpretación para regular los nervios.',
      'Avanzar con una escalera de exposición gradual y una rutina previa a cada presentación.',
      'Rescatarte cuando te quedas en blanco y seguir un plan de 30 días, sabiendo cuándo buscar ayuda profesional.',
    ],
    arte: { centro: 'Wind', satelites: ['HeartPulse', 'Footprints', 'Brain'], tarjeta: 'escalera' },
  },
  {
    hoja: '03 Presentaciones', clave: 'hb03', slug: 'curso-de-presentaciones-efectivas-y-storytelling', portada: 'presentaciones-efectivas',
    categoria: 'Oratoria y presentaciones', nivel: 'intermedio',
    etiquetas: ['Presentaciones', 'Storytelling', 'Diapositivas', 'Pitch', 'Habilidades blandas'],
    resultados: [
      'Definir la audiencia, el objetivo y el mensaje antes de diseñar una presentación.',
      'Estructurar historias y comunicar datos y resultados para que se entiendan.',
      'Diseñar diapositivas basadas en evidencia y presentar datos clínicos y técnicos con claridad.',
      'Presentar en Teams, Zoom o Meet y preparar un pitch de 3 minutos.',
    ],
    arte: { centro: 'Presentation', satelites: ['ChartColumn', 'BookOpen', 'Lightbulb'], tarjeta: 'linea' },
  },
  {
    hoja: '04 Comunicación asertiva', clave: 'hb04', slug: 'curso-de-comunicacion-asertiva', portada: 'comunicacion-asertiva',
    categoria: 'Comunicación interpersonal', nivel: 'basico',
    etiquetas: ['Comunicación asertiva', 'Escucha activa', 'Comunicación no violenta', 'Retroalimentación', 'Habilidades blandas'],
    resultados: [
      'Reconocer los estilos de comunicación y tu nivel de asertividad.',
      'Expresar desacuerdos con mensajes yo y la técnica DESC, y decir no sin culpa.',
      'Escuchar activamente y aplicar los cuatro pasos de la comunicación no violenta.',
      'Dar y recibir retroalimentación con el modelo SBI y manejar conflictos con método.',
    ],
    arte: { centro: 'MessagesSquare', satelites: ['Ear', 'Handshake', 'ShieldCheck'], tarjeta: 'chat' },
  },
  {
    hoja: '05 Lenguaje corporal', clave: 'hb05', slug: 'curso-de-lenguaje-corporal-y-comunicacion-no-verbal', portada: 'lenguaje-corporal',
    categoria: 'Comunicación interpersonal', nivel: 'basico',
    etiquetas: ['Lenguaje corporal', 'Comunicación no verbal', 'Proxémica', 'Paralenguaje', 'Habilidades blandas'],
    resultados: [
      'Reconocer los canales de la comunicación no verbal y desmontar sus mitos más comunes.',
      'Proyectar seguridad y apertura con la postura, los gestos, la mirada y la expresión facial.',
      'Usar la voz y el espacio en el mostrador, la consulta y las reuniones.',
      'Leer señales no verbales en su contexto y cuidar tu presencia en videollamadas y entrevistas.',
    ],
    arte: { centro: 'PersonStanding', satelites: ['Eye', 'Hand', 'Smile'], tarjeta: 'lista' },
  },
  {
    hoja: '06 Negociación', clave: 'hb06', slug: 'curso-de-negociacion-y-persuasion', portada: 'negociacion-persuasion',
    categoria: 'Liderazgo y relaciones laborales', nivel: 'intermedio',
    etiquetas: ['Negociación', 'Persuasión', 'Método Harvard', 'Manejo de objeciones', 'Habilidades blandas'],
    resultados: [
      'Distinguir la negociación distributiva de la integrativa y prepararla con MAAN, precio de reserva y ZOPA.',
      'Negociar con los principios del método Harvard, preguntas calibradas y escucha táctica.',
      'Aplicar los principios de persuasión de Cialdini dentro de un marco ético propio del sector salud.',
      'Responder objeciones y cerrar acuerdos con concesiones y seguimiento.',
    ],
    arte: { centro: 'Handshake', satelites: ['Scale', 'Target', 'MessageSquareQuote'], tarjeta: 'barras' },
  },
  {
    hoja: '07 Inteligencia emocional', clave: 'hb07', slug: 'curso-de-inteligencia-emocional', portada: 'inteligencia-emocional',
    categoria: 'Liderazgo y relaciones laborales', nivel: 'basico',
    etiquetas: ['Inteligencia emocional', 'Empatía', 'Burnout', 'Resiliencia', 'Habilidades blandas'],
    resultados: [
      'Explicar qué es la inteligencia emocional e identificar y nombrar tus emociones.',
      'Regular tus reacciones y prevenir el estrés laboral y el burnout.',
      'Responder con empatía a pacientes y compañeros con el protocolo NURSE.',
      'Fortalecer tus habilidades sociales y tu resiliencia con un plan de desarrollo emocional.',
    ],
    arte: { centro: 'Brain', satelites: ['Heart', 'Smile', 'Sprout'], tarjeta: 'linea' },
  },
  {
    hoja: '08 Liderazgo', clave: 'hb08', slug: 'curso-de-liderazgo-y-trabajo-en-equipo', portada: 'liderazgo-trabajo-en-equipo',
    categoria: 'Liderazgo y relaciones laborales', nivel: 'intermedio',
    etiquetas: ['Liderazgo', 'Trabajo en equipo', 'Delegación', 'Gestión del cambio', 'Habilidades blandas'],
    resultados: [
      'Elegir el estilo de liderazgo adecuado y asumir tu primer cargo de coordinación.',
      'Construir seguridad psicológica y superar las disfunciones de un equipo.',
      'Delegar con claridad y hacer reuniones y conversaciones 1:1 que valgan la pena.',
      'Motivar a tu equipo y liderar un cambio con los 8 pasos de Kotter.',
    ],
    arte: { centro: 'Flag', satelites: ['Users', 'Compass', 'Award'], tarjeta: 'lista' },
  },
  {
    hoja: '09 Servicio al paciente', clave: 'hb09', slug: 'curso-de-servicio-al-cliente', portada: 'servicio-al-cliente',
    categoria: 'Servicio al paciente', nivel: 'basico',
    etiquetas: ['Servicio al cliente', 'Atención al paciente', 'Droguería', 'Manejo de quejas', 'Habilidades blandas'],
    resultados: [
      'Aplicar un protocolo de atención en farmacia y droguería centrado en la experiencia del paciente.',
      'Comunicar la información de los medicamentos con lenguaje sencillo y verificar que se entendió (teach-back).',
      'Manejar quejas con el método LAST y desescalar situaciones tensas cuidando la seguridad.',
      'Atender por WhatsApp y teléfono protegiendo los datos del paciente, y medir la satisfacción con NPS, CSAT y PQRS.',
    ],
    arte: { centro: 'HeartHandshake', satelites: ['Pill', 'Star', 'MessageCircle'], tarjeta: 'chat' },
  },
  {
    hoja: '10 Hablar en cámara', clave: 'hb10', slug: 'curso-para-hablar-frente-a-la-camara', portada: 'hablar-frente-a-la-camara',
    categoria: 'Oratoria y presentaciones', nivel: 'basico',
    etiquetas: ['Oratoria digital', 'Video', 'Webinars', 'Redes sociales', 'Habilidades blandas'],
    resultados: [
      'Perder el miedo a la cámara y grabar con el celular con buena luz, encuadre y audio.',
      'Escribir guiones de 60 segundos y hablar con naturalidad sin leer.',
      'Conectar a través del lente y conducir videollamadas y webinars.',
      'Publicar contenido de salud ético y conforme a la normativa, con un plan de contenido de 30 días.',
    ],
    arte: { centro: 'Video', satelites: ['Smartphone', 'Sun', 'Mic'], tarjeta: 'video' },
  },
];

// Correcciones verificadas contra la fuente oficial antes de publicar.
const CORRECCIONES = [
  {
    hoja: '09 Servicio al paciente',
    codigo: '1.1',
    // Decreto 2200 de 2005, art. 19, num. 6 (compilado en el Decreto 780
    // de 2016, art. 2.5.3.10.18), consultado en el normograma del INVIMA
    // el 10-nov-2026: es una obligación de quien dispensa, no un principio.
    de: 'Entre sus principios está ofrecer información sobre el uso adecuado de los medicamentos al momento de la dispensación.',
    a: 'El Decreto 780 de 2016 (artículo 2.5.3.10.18) incluye entre las obligaciones de quien dispensa informar al usuario lo indispensable para lograr el efecto terapéutico y el uso adecuado de los medicamentos.',
  },
];

/* ── 3. Modelo de cada curso desde el archivo ─────────────────────── */

const clases = filas('Clases en texto').filter((f) => f.r >= 5 && f.A);
const actividades = filas('Actividades').filter((f) => f.r >= 5 && f.A);
const quizzes = filas('Quizzes').filter((f) => f.r >= 5 && f.A);
const foros = filas('Foros').filter((f) => f.r >= 5 && f.A);
const indice = filas('Índice').filter((f) => f.r >= 5 && /^\d+$/.test(f.A || ''));

const MARCADOR_TEXTO = /por confirmar|pendiente de revisi|\[pendiente|\[autor|lorem ipsum/i;
// En mayúsculas a propósito: «todo» y «método» son palabras normales.
const MARCADOR_CODIGO = /\bTODO\b|XXX|\?\?\?/;
const MARCADOR = { test: (t) => MARCADOR_TEXTO.test(t) || MARCADOR_CODIGO.test(t) };

function curso(conf) {
  const hoja = filas(conf.hoja);
  const ficha = Object.fromEntries(hoja.filter((f) => f.r >= 2 && f.r <= 16 && f.A).map((f) => [f.A, f.B || '']));
  const titulo = ficha.Curso;
  const unidades = [];
  for (const f of hoja.filter((x) => x.r >= 19)) {
    const codigo = f.A || '';
    if (/^Unidad \d+$/.test(codigo)) {
      unidades.push({ numero: Number(codigo.slice(7)), titulo: f.B, minutos: Number(f.F) || 0, clases: [], actividad: null, quiz: [], foro: null });
      continue;
    }
    const u = unidades[unidades.length - 1];
    if (!u) continue;
    if (/^\d+\.\d+$/.test(codigo)) {
      const t = clases.find((c) => c.A === titulo && c.B === codigo);
      if (!t) throw new Error(`${titulo}: falta el texto de la clase ${codigo}`);
      let md = t.G || '';
      for (const c of CORRECCIONES.filter((x) => x.hoja === conf.hoja && x.codigo === codigo)) {
        if (!md.includes(c.de)) throw new Error(`${titulo} ${codigo}: no está el texto a corregir`);
        md = md.replace(c.de, c.a);
      }
      u.clases.push({ codigo, titulo: f.B, minutos: Number(f.F) || 15, meta: t.F || '', md, palabraClave: t.E || '' });
    } else if (/^A\d+$/.test(codigo)) {
      const a = actividades.find((x) => x.A === titulo && x.B === codigo);
      if (!a) throw new Error(`${titulo}: falta la actividad ${codigo}`);
      u.actividad = { codigo, titulo: a.D, tipo: a.E, instrucciones: a.F, entregable: a.G, rubrica: a.H, minutos: Number(a.I) || 0 };
    } else if (/^Q\d+$/.test(codigo)) {
      u.quiz = quizzes.filter((x) => x.A === titulo && new RegExp(`^Q${u.numero}\\.\\d+$`).test(x.C || ''))
        .map((x) => ({ codigo: x.C, pregunta: x.D, opciones: [x.E, x.F, x.G, x.H], correcta: 'ABCD'.indexOf(x.I), feedback: x.J || '' }));
    } else if (/^F\d+$/.test(codigo)) {
      const fo = foros.find((x) => x.A === titulo && x.C === codigo);
      if (!fo) throw new Error(`${titulo}: falta el foro ${codigo}`);
      u.foro = { codigo, titulo: fo.D, pregunta: fo.E, instrucciones: fo.F, criterios: fo.G };
    }
  }
  const idx = indice.find((x) => x.B === titulo);
  return {
    ...conf,
    titulo,
    descripcion: ficha['Descripción'],
    objetivo: ficha['Objetivo general'],
    publico: ficha['Público'],
    horas: Number(ficha['Duración estimada (h)']) || 0,
    referentes: ficha['Referentes curados'] || '',
    unidades,
    indice: idx,
  };
}

const modelo = CURSOS.map(curso);

// El archivo debe traer lo que declara su índice.
const total = { clases: 0, actividades: 0, preguntas: 0, foros: 0 };
for (const c of modelo) {
  const n = {
    unidades: c.unidades.length,
    clases: c.unidades.reduce((s, u) => s + u.clases.length, 0),
    actividades: c.unidades.filter((u) => u.actividad).length,
    preguntas: c.unidades.reduce((s, u) => s + u.quiz.length, 0),
    foros: c.unidades.filter((u) => u.foro).length,
  };
  if (!c.indice) throw new Error(`${c.titulo}: no está en el índice`);
  const esperado = { unidades: 4, clases: Number(c.indice.G), actividades: Number(c.indice.I), preguntas: Number(c.indice.J), foros: Number(c.indice.K) };
  for (const k of Object.keys(esperado)) {
    if (n[k] !== esperado[k]) throw new Error(`${c.titulo}: ${k} = ${n[k]}, el índice dice ${esperado[k]}`);
  }
  for (const u of c.unidades) {
    if (u.quiz.length !== 4) throw new Error(`${c.titulo} unidad ${u.numero}: el quiz trae ${u.quiz.length} preguntas`);
    for (const q of u.quiz) {
      if (q.correcta < 0 || q.opciones.some((o) => !o)) throw new Error(`${c.titulo} ${q.codigo}: opciones o clave incompletas`);
    }
  }
  if (slugBaseDeCurso(c.titulo) !== c.slug) throw new Error(`${c.titulo}: el servidor le daría ${slugBaseDeCurso(c.titulo)}, no ${c.slug}`);
  total.clases += n.clases; total.actividades += n.actividades; total.preguntas += n.preguntas; total.foros += n.foros;
}
const fila = filas('Índice').find((f) => f.B === 'TOTAL');
if (total.clases !== Number(fila.G) || total.actividades !== Number(fila.I) || total.preguntas !== Number(fila.J) || total.foros !== Number(fila.K)) {
  throw new Error(`Totales distintos del índice: ${JSON.stringify(total)}`);
}

/* ── 4. Clases en texto → bloques del aula ────────────────────────── */

const mdAHtml = (md) => renderToStaticMarkup(React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, md));
const esc = (t) => String(t ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const parrafos = (t) => String(t || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');

// Secciones que se muestran como recuadro, con su tono.
const RECUADROS = [
  [/^ejemplo aplicado/i, 'consejo'],
  [/^errores comunes/i, 'advertencia'],
  [/^puntos clave/i, 'importante'],
  [/^siguiente paso/i, 'info'],
];

function bloquesDeClase(clase, cursoTitulo) {
  const lineas = clase.md.replace(/\r\n/g, '\n').split('\n');
  if (!/^# /.test(lineas[0] || '')) throw new Error(`${cursoTitulo} ${clase.codigo}: la clase no empieza por su título`);
  const h1 = lineas[0].slice(2).trim();
  if (h1 !== clase.titulo) throw new Error(`${cursoTitulo} ${clase.codigo}: el título del texto no coincide con la malla`);
  // Secciones por H2; lo anterior al primer H2 es la introducción.
  const secciones = [{ titulo: null, lineas: [] }];
  for (const l of lineas.slice(1)) {
    if (/^## /.test(l)) secciones.push({ titulo: l.slice(3).trim(), lineas: [] });
    else secciones[secciones.length - 1].lineas.push(l);
  }
  const bloques = [];
  const pendiente = [];
  const vaciarTexto = () => {
    if (!pendiente.length) return;
    bloques.push(['texto', { html: pendiente.join('') }]);
    pendiente.length = 0;
  };
  bloques.push(['destacado', { tone: 'info', title: 'En esta clase', html: `<p>${esc(clase.meta)}</p>` }]);
  for (const s of secciones) {
    const cuerpo = s.lineas.join('\n').trim();
    if (!s.titulo) { if (cuerpo) pendiente.push(mdAHtml(cuerpo)); continue; }
    const recuadro = RECUADROS.find(([re]) => re.test(s.titulo));
    if (recuadro) {
      vaciarTexto();
      bloques.push(['destacado', { tone: recuadro[1], title: s.titulo, html: mdAHtml(cuerpo) }]);
    } else {
      pendiente.push(`<h2>${esc(s.titulo)}</h2>${mdAHtml(cuerpo)}`);
    }
  }
  vaciarTexto();
  // Cada bloque pasa por el mismo validador que usa el editor del aula.
  return bloques.map(([tipo, data]) => {
    const { data: limpio } = readBlockData(tipo, data);
    const texto = JSON.stringify(limpio);
    if (MARCADOR.test(texto)) throw new Error(`${cursoTitulo} ${clase.codigo}: queda un marcador sin resolver`);
    return [tipo, limpio];
  });
}

/* ── 5. SQL ───────────────────────────────────────────────────────── */

const lit = (s) => `'${String(s ?? '').replaceAll("'", "''")}'`;
const arr = (a) => `ARRAY[${a.map(lit).join(', ')}]::text[]`;
const dolar = (tag, s) => {
  if (String(s).includes(`$${tag}$`)) throw new Error(`El contenido contiene el delimitador $${tag}$`);
  return `$${tag}$${s}$${tag}$`;
};

const minutosDeClases = (c) => c.unidades.reduce((s, u) => s + u.clases.reduce((x, cl) => x + cl.minutos, 0), 0);
const unidadTitulo = (u) => `Unidad ${u.numero}. ${u.titulo}`;

function descripcionHtml(c) {
  return [
    `<p>${esc(c.descripcion)}</p>`,
    `<h2>Objetivo</h2><p>${esc(c.objetivo)}</p>`,
    `<h2>Para quién es</h2><p>${esc(c.publico)}</p>`,
    '<h2>Cómo está organizado</h2><p>Cuatro unidades con dos clases en texto cada una. Cada clase trae un ejemplo aplicado al sector farmacéutico y de la salud, puntos clave y el siguiente paso.</p>',
    c.referentes ? `<h2>Referentes</h2><p>${esc(c.referentes)}</p>` : '',
  ].join('');
}

const publica = [];
publica.push(`-- ============================================================
--  075_cursos_habilidades_blandas.sql — Escuela de Habilidades Blandas
--
--  Generado por scripts/generar-habilidades-blandas.mjs a partir de
--  Edvanta_Cursos_Habilidades_Blandas.xlsx (curaduría nov. 2026). No
--  editar a mano: se corrige el archivo y se vuelve a generar.
--
--  Diez cursos propios: oratoria, miedo a hablar en público,
--  presentaciones y storytelling, comunicación asertiva, lenguaje
--  corporal, negociación, inteligencia emocional, liderazgo, servicio al
--  cliente y hablar frente a la cámara. 40 unidades y 80 clases en texto
--  con ejemplos del sector farmacéutico y de la salud.
--
--  Área: ${AREA} (escuela /escuelas/habilidades-blandas).
--
--  La duración de cada curso es la de sus clases. Las prácticas, los
--  quizzes y los foros están en la migración privada 076 (lleva claves),
--  que al aplicarse sube la duración a la del diseño completo.
--
--  Se crean en BORRADOR, como todos los cursos sembrados. La dirección
--  académica aprobó publicarlos el 9-nov-2026 («todo está aprobado»): se
--  registra en aula_publicaciones_aprobadas y el servidor los publica al
--  arrancar con el mismo publishCourse del botón «Publicar».
-- ============================================================
`);

for (const c of modelo) {
  const tag = c.clave;
  const t = `${tag}t`;
  const j = `${tag}j`;
  const partes = [];
  partes.push(`
-- ─── ${c.titulo} (${c.unidades.reduce((s, u) => s + u.clases.length, 0)} clases) ───
DO $${tag}$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = ${lit(c.titulo)} AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, area, level, tags,
     objective, learning_outcomes, audience, duration_minutes, author_name, status, modality, cover_url, publico)
  VALUES ('edvanta', ${lit(c.titulo)}, ${dolar(t, c.descripcion)},
          ${dolar(t, descripcionHtml(c))},
          ${lit(c.categoria)}, ${lit(AREA)}, ${lit(c.nivel)}, ${arr(c.etiquetas)},
          ${dolar(t, c.objetivo)},
          ${arr(c.resultados)},
          ${dolar(t, c.publico)},
          ${minutosDeClases(c)}, 'Edvanta', 'borrador', 'asincronica', ${lit(`/img/cursos/${c.portada}.webp`)}, 'profesionales')
  RETURNING id INTO v_curso;
`);
  c.unidades.forEach((u, iu) => {
    partes.push(`
  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, ${lit(unidadTitulo(u))}, ${iu})
  RETURNING id INTO v_unidad;
`);
    u.clases.forEach((cl, ic) => {
      partes.push(`  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule, duration_minutes, is_required)
  VALUES (v_curso, v_unidad, ${lit(cl.titulo)}, ${lit(`Unidad ${u.numero} · Clase ${cl.codigo}`)}, ${ic}, 'manual', ${cl.minutos}, TRUE)
  RETURNING id INTO v_clase;
`);
      bloquesDeClase(cl, c.titulo).forEach(([tipo, data], ib) => {
        partes.push(`  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, ${lit(tipo)}, ${ib}, ${dolar(j, JSON.stringify(data))}::jsonb);
`);
      });
    });
  });
  partes.push(`END
$${tag}$;
`);
  publica.push(partes.join(''));
}

publica.push(`
-- ─── Publicación aprobada ───
-- Solo los que acaban de crearse aquí: si alguien ya los publicó a mano
-- o los borró, no se toca nada.
INSERT INTO aula_publicaciones_aprobadas (course_id, aprobado_por, nota)
SELECT c.id, 'Dirección académica de Edvanta',
       'Aprobado para publicar el 9-nov-2026 (Edvanta_Cursos_Habilidades_Blandas.xlsx).'
  FROM aula_courses c
 WHERE c.kind = 'edvanta' AND c.deleted_at IS NULL
   AND c.status = 'borrador' AND c.current_version_id IS NULL
   AND c.title IN (${modelo.map((c) => lit(c.titulo)).join(', ')})
ON CONFLICT (course_id) DO NOTHING;
`);

/* ── 6. Evaluación (privada) ──────────────────────────────────────── */

const PESOS = { quiz: 7.5, actividad: 15, foro: 2.5 }; // 4 de cada uno: 30 + 60 + 10
const NIVELES = [
  [4, 'Destacado', 'Cumple el criterio por completo, con evidencia clara y aplicada a su contexto.'],
  [3, 'Logrado', 'Cumple el criterio; quedan detalles menores por mejorar.'],
  [2, 'En desarrollo', 'Cumple el criterio de forma parcial.'],
  [1, 'Inicial', 'Lo intenta, pero con vacíos importantes.'],
  [0, 'Sin evidencia', 'No presenta evidencia de este criterio.'],
];
const idDe = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);

function rubrica(texto, ref) {
  const criterios = String(texto).replace(/\.\s*$/, '').split(/;\s*/).map((p) => {
    const m = /^(.*?)\s*\((\d+)\s*%\)\s*$/.exec(p.trim());
    if (!m) throw new Error(`${ref}: criterio de rúbrica sin peso: «${p}»`);
    const nombre = m[1].charAt(0).toUpperCase() + m[1].slice(1);
    return { id: idDe(nombre), name: nombre, weight: Number(m[2]), levels: NIVELES.map(([level, label, description]) => ({ level, label, description })) };
  });
  const suma = criterios.reduce((s, c) => s + c.weight, 0);
  if (suma !== 100) throw new Error(`${ref}: la rúbrica suma ${suma} %`);
  return { version: 1, total: 100, criteria: criterios };
}

const INSTRUCCIONES_QUIZ = 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.';

const privada = [];
privada.push(`-- ============================================================
--  076_evaluacion_habilidades_blandas.sql — evaluación de la Escuela de
--  Habilidades Blandas
--
--  Generado por scripts/generar-habilidades-blandas.mjs. Contiene claves
--  de quiz: es un archivo PRIVADO (.gitignore) y se aplica a mano, como
--  las demás capas de evaluación:
--
--    psql --single-transaction -f 076_evaluacion_habilidades_blandas.sql
--
--  En cada curso de la 075, si todavía no tiene matrículas:
--   1. Nota mínima 70, 2 intentos y política 60/30/10 (actividades,
--      quizzes, foros), y la duración del diseño completo.
--   2. Crea PUBLICADOS un quiz de cuatro preguntas por unidad, una
--      actividad con rúbrica por unidad (la 4 es el proyecto final) y un
--      foro por unidad. Todo quedó aprobado el 9-nov-2026.
--  Si el curso ya tiene matrículas, crea lo mismo en BORRADOR y no toca
--  la política ni la duración: activar requisitos a mitad de curso es
--  una decisión del panel.
--  Es idempotente: lo que ya existe (por título) no se duplica.
-- ============================================================
`);

for (const c of modelo) {
  const tag = `ev${c.clave}`;
  const h = `${tag}h`;
  const jj = `${tag}j`;
  const p = [];
  p.push(`
-- ════ ${c.titulo} ════
DO $${tag}$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_estado   TEXT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = ${lit(c.titulo)} AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe ${c.titulo.replaceAll("'", "''")}: aplica primero la migración 075.';
    RETURN;
  END IF;

  IF EXISTS (SELECT 1 FROM aula_enrollments WHERE course_id = v_curso) THEN
    v_estado := 'borrador';
    RAISE NOTICE '${c.titulo.replaceAll("'", "''")} tiene matrículas: la evaluación queda en borrador.';
  ELSE
    v_estado := 'publicado';
    UPDATE aula_courses
       SET passing_score = 70, max_attempts = 2, duration_minutes = ${c.horas * 60},
           grade_policy = ${dolar(jj, JSON.stringify({ version: 1, components: { activities: 60, quizzes: 30, forums: 10 }, rounding: 'half_up' }))}::jsonb,
           updated_at = NOW()
     WHERE id = v_curso;
  END IF;
`);
  for (const u of c.unidades) {
    const ref = `${c.titulo} unidad ${u.numero}`;
    const quizTitulo = `Quiz de la unidad ${u.numero}: ${u.titulo}`;
    p.push(`
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = ${lit(unidadTitulo(u))} AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = ${lit(quizTitulo)} AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, ${lit(quizTitulo)}, ${lit(INSTRUCCIONES_QUIZ)})
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, ${lit(quizTitulo)}, ${lit(`<p>${INSTRUCCIONES_QUIZ}</p>`)}, TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, ${u.numero}, ${PESOS.quiz})
    RETURNING id INTO v_eval;
`);
    u.quiz.forEach((q, iq) => {
      const config = JSON.stringify({ external_id: `${c.clave}-${q.codigo.toLowerCase()}` });
      p.push(`    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', ${dolar(h, `<p>${esc(q.pregunta)}</p>`)}, 25, ${dolar(h, q.feedback)}, ${dolar(h, q.feedback)}, ${dolar(jj, config)}::jsonb)
    RETURNING id INTO v_pregunta;
${q.opciones.map((o, io) => `    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, ${dolar(h, o)}, ${io === q.correcta ? 'TRUE' : 'FALSE'}, '', ${io});`).join('\n')}
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, ${iq}, 25);
`);
    });
    p.push(`  END IF;
`);
    // Actividad
    const a = u.actividad;
    const rub = rubrica(a.rubrica, `${ref} ${a.codigo}`);
    const actHtml = [
      `<h2>Qué vas a hacer</h2>${parrafos(a.instrucciones)}`,
      `<h2>Qué entregas</h2>${parrafos(a.entregable)}`,
      `<h2>Cómo se evalúa</h2><ul>${rub.criteria.map((r) => `<li>${esc(r.name)} (${r.weight} %)</li>`).join('')}</ul>`,
      a.minutos ? `<p>Tiempo estimado: ${a.minutos} minutos.</p>` : '',
      /grab|video/i.test(`${a.tipo} ${a.entregable}`) ? '<p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>' : '',
    ].join('');
    p.push(`
  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = ${lit(a.titulo)} AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, ${lit(a.titulo)}, ${dolar(h, actHtml)}, ${dolar(jj, JSON.stringify(rub))}::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, ${u.numero}, ${PESOS.actividad}, 'rubrica');
  END IF;
`);
    // Foro
    const f = u.foro;
    p.push(`
  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = ${lit(f.titulo)} AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', ${lit(f.titulo)}, ${lit(`Aplicar lo de la unidad ${u.numero} a tu trabajo y aprender de los compañeros.`)},
            ${dolar(h, `<p>${esc(f.pregunta)}</p>`)}, ${dolar(h, f.pregunta)}, '{}'::text[],
            ${dolar(h, `<p>${esc(f.instrucciones)}</p>`)},
            ${dolar(h, `<h2>Criterios de valoración</h2><p>${esc(f.criterios)}</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>`)},
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', ${PESOS.foro}, NULL, FALSE, FALSE, v_estado, ${u.numero});
  END IF;
`);
  }
  p.push(`END
$${tag}$;
`);
  privada.push(p.join(''));
}

/* ── 7. Lista estática para el HTML de la escuela ─────────────────── */

const lista = modelo.map((c) => ({
  titulo: c.titulo,
  to: `/${c.slug}`,
  portada: `/img/cursos/${c.portada}.webp`,
  categoria: c.categoria,
  resumen: c.descripcion,
}));
const modulo = `/**
 * ============================================================
 *  cursosHabilidadesBlandas.js — Los cursos de la Escuela de
 *  Habilidades Blandas
 *
 *  Generado por scripts/generar-habilidades-blandas.mjs (migración 075).
 *  Los cursos viven en el aula; esta lista solo sirve para que el HTML
 *  de la escuela (prerender, sin base de datos) enlace sus fichas. Las
 *  direcciones son las que el servidor les da al publicar
 *  (slugBaseDeCurso, con SLUGS_ELEGIDOS).
 * ============================================================
 */

export const CURSOS_HABILIDADES_BLANDAS = ${JSON.stringify(lista, null, 2).replace(/"([a-z]+)":/g, '$1:')};
`;

/* ── 8. Portadas e imagen de la escuela ───────────────────────────── */

const requireApi = createRequire(path.join(raiz, 'api', 'package.json'));
const sharp = requireApi('sharp');

function icono(nombre, { x, y, size, color, grosor = 1.75 }) {
  const Icono = Lucide[nombre];
  if (!Icono) throw new Error(`No existe el ícono ${nombre}`);
  return renderToStaticMarkup(React.createElement(Icono, { size, color, strokeWidth: grosor }))
    .replace('<svg ', `<svg x="${x}" y="${y}" `);
}

const TARJETAS = {
  barras: () => `<rect x="84" y="196" width="80" height="34" rx="9" fill="#DDF1EE"/><rect x="176" y="196" width="80" height="34" rx="9" fill="#E9E6F8"/><rect x="268" y="196" width="80" height="34" rx="9" fill="#EEF1F6"/>
    ${[52, 86, 64, 112, 96].map((alto, i) => `<rect x="${98 + i * 52}" y="${392 - alto}" width="30" height="${alto}" rx="6" fill="${i === 3 ? '#2BA8A1' : '#BFE5E1'}"/>`).join('')}`,
  linea: () => `<rect x="84" y="196" width="80" height="34" rx="9" fill="#DDF1EE"/><rect x="176" y="196" width="80" height="34" rx="9" fill="#E9E6F8"/><rect x="268" y="196" width="80" height="34" rx="9" fill="#EEF1F6"/>
    <line x1="84" y1="296" x2="368" y2="296" stroke="#E6E9F2" stroke-width="2"/><line x1="84" y1="336" x2="368" y2="336" stroke="#E6E9F2" stroke-width="2"/>
    <path d="M86 380 L150 352 L210 362 L270 318 L330 300 L362 272" fill="none" stroke="#2BA8A1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="362" cy="272" r="8" fill="#fff" stroke="#2BA8A1" stroke-width="4"/>`,
  chat: () => `<rect x="84" y="196" width="190" height="46" rx="16" fill="#E9E6F8"/><rect x="176" y="258" width="190" height="46" rx="16" fill="#DDF1EE"/><rect x="84" y="320" width="160" height="46" rx="16" fill="#E9E6F8"/>
    <circle cx="352" cy="372" r="6" fill="#2BA8A1"/><circle cx="330" cy="372" r="6" fill="#7FCBC5"/><circle cx="308" cy="372" r="6" fill="#BFE5E1"/>`,
  lista: () => [0, 1, 2, 3].map((i) => `<rect x="84" y="${196 + i * 50}" width="30" height="30" rx="8" fill="${i < 3 ? '#2BA8A1' : '#fff'}" stroke="#2BA8A1" stroke-width="2.5"/>${i < 3 ? `<path d="M${92} ${211 + i * 50} l6 6 l11 -12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` : ''}<rect x="128" y="${204 + i * 50}" width="${[210, 170, 230, 150][i]}" height="14" rx="7" fill="${i % 2 ? '#E9E6F8' : '#EEF1F6'}"/>`).join(''),
  escalera: () => [0, 1, 2, 3, 4].map((i) => `<rect x="${92 + i * 54}" y="${376 - i * 40}" width="54" height="${24 + i * 40}" rx="6" fill="${i === 4 ? '#2BA8A1' : ['#E9E6F8', '#DDF1EE', '#E9E6F8', '#BFE5E1'][i]}"/>`).join('')
    + '<circle cx="335" cy="196" r="10" fill="#fff" stroke="#2BA8A1" stroke-width="4"/>',
  video: () => `<rect x="84" y="196" width="284" height="150" rx="14" fill="#EEF1F6"/><circle cx="226" cy="271" r="34" fill="#2BA8A1"/><path d="M216 255 L244 271 L216 287 Z" fill="#fff"/>
    <rect x="84" y="370" width="284" height="10" rx="5" fill="#E6E9F2"/><rect x="84" y="370" width="120" height="10" rx="5" fill="#7E7BD0"/>`,
};

function svgPortada(arte) {
  const sat = [[848, 96], [888, 270], [848, 444]];
  const colores = ['#1E2A6E', '#1F9B94', '#7E6CC9'];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <defs>
    <linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EFEBFA"/><stop offset="1" stop-color="#E2F3F0"/></linearGradient>
    <radialGradient id="mancha1"><stop offset="0" stop-color="#B9B2EA" stop-opacity=".75"/><stop offset="1" stop-color="#B9B2EA" stop-opacity="0"/></radialGradient>
    <radialGradient id="mancha2"><stop offset="0" stop-color="#9DDAD3" stop-opacity=".7"/><stop offset="1" stop-color="#9DDAD3" stop-opacity="0"/></radialGradient>
    <linearGradient id="aro" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#7E7BD0"/><stop offset="1" stop-color="#2BA8A1"/></linearGradient>
    <linearGradient id="disco" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4CC1B9"/><stop offset="1" stop-color="#1F938D"/></linearGradient>
    <pattern id="puntos" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#C4BEE6" fill-opacity=".55"/></pattern>
    <filter id="sombra" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="16"/></filter>
  </defs>
  <rect width="960" height="540" fill="url(#fondo)"/>
  <circle cx="150" cy="80" r="260" fill="url(#mancha1)"/>
  <circle cx="400" cy="520" r="280" fill="url(#mancha2)"/>
  <circle cx="900" cy="250" r="260" fill="url(#mancha2)"/>
  <rect width="960" height="540" fill="url(#puntos)"/>
  <rect x="64" y="134" width="324" height="290" rx="20" fill="#5E62B0" fill-opacity=".18" filter="url(#sombra)"/>
  <rect x="56" y="118" width="340" height="300" rx="18" fill="#fff"/>
  <rect x="56" y="118" width="340" height="6" rx="3" fill="url(#aro)"/>
  <rect x="84" y="148" width="120" height="12" rx="6" fill="#E9E6F8"/><rect x="84" y="170" width="190" height="10" rx="5" fill="#EEF1F6"/>
  ${TARJETAS[arte.tarjeta]()}
  ${sat.map(([x, y]) => `<line x1="640" y1="270" x2="${x}" y2="${y}" stroke="#7FBDB8" stroke-width="2"/>`).join('')}
  <circle cx="640" cy="270" r="160" fill="#F7F9FC" stroke="url(#aro)" stroke-width="16"/>
  <circle cx="640" cy="270" r="128" fill="none" stroke="#C3D6E2" stroke-width="2" stroke-dasharray="3 7"/>
  <circle cx="640" cy="270" r="84" fill="url(#disco)"/>
  ${icono(arte.centro, { x: 640 - 46, y: 270 - 46, size: 92, color: '#FFFFFF', grosor: 1.6 })}
  ${sat.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="54" fill="#fff" stroke="url(#aro)" stroke-width="3"/>${icono(arte.satelites[i], { x: x - 24, y: y - 24, size: 48, color: colores[i], grosor: 2 })}`).join('\n  ')}
</svg>`;
}

/* ── 9. Escritura ─────────────────────────────────────────────────── */

const salidaPublica = path.join(raiz, 'api', 'migrations', '075_cursos_habilidades_blandas.sql');
const salidaPrivada = path.join(raiz, 'api', 'migrations', '076_evaluacion_habilidades_blandas.sql');
const salidaLista = path.join(raiz, 'src', 'data', 'edvanta', 'cursosHabilidadesBlandas.js');
writeFileSync(salidaPublica, publica.join(''), 'utf8');
writeFileSync(salidaPrivada, privada.join(''), 'utf8');
writeFileSync(salidaLista, modulo, 'utf8');

for (const c of modelo) {
  await sharp(Buffer.from(svgPortada(c.arte))).webp({ quality: 86 }).toFile(path.join(raiz, 'public', 'img', 'cursos', `${c.portada}.webp`));
}
// Imagen de la escuela: la foto de la comunidad, al tamaño de las demás escuelas.
await sharp(path.join(raiz, 'public', 'img', 'comunidad', 'encuentro-comunidad-farmaceutica.webp'))
  .resize(1200, 800, { fit: 'cover', position: 'attention' })
  .webp({ quality: 82 })
  .toFile(path.join(raiz, 'public', 'img', 'escuelas', 'habilidades-blandas.webp'));

console.log(`075: ${(publica.join('').length / 1024).toFixed(0)} KB · 076 (privada): ${(privada.join('').length / 1024).toFixed(0)} KB`);
console.log(`${modelo.length} cursos · ${total.clases} clases · ${total.actividades} actividades · ${total.preguntas} preguntas · ${total.foros} foros`);
for (const c of modelo) console.log(`  /${c.slug} · ${minutosDeClases(c)} min de clases · ${c.horas} h de diseño`);
