#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BLOG_CURSOS_500 } from '../src/data/blogCursos500.js';
import { cargarCursos, normalizar } from './lib/cursos-blogs-datos.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA_CSV = path.join(raiz, 'seo', 'keywords-30000-cursos.csv');
const SALIDA_MD = path.join(raiz, 'seo', 'plan-30000-keywords-cursos.md');
const META = 30000;
const NOTA = 'Volumen sin medir: validar en Search Console antes de priorizar';

const cursos = cargarCursos();
const cursoPorUrl = new Map(cursos.map((c) => [c.url, c]));
const articulosPorCurso = new Map();
for (const a of BLOG_CURSOS_500) {
  if (!articulosPorCurso.has(a.curso.url)) articulosPorCurso.set(a.curso.url, {});
  articulosPorCurso.get(a.curso.url)[a.tipo] = a;
}

function csvCell(v) {
  return `"${String(v ?? '').replaceAll('"', '""')}"`;
}

function filaCsv(linea, sep) {
  const celdas = [];
  let actual = '';
  let comillas = false;
  for (let i = 0; i < linea.length; i += 1) {
    const c = linea[i];
    if (comillas) {
      if (c === '"' && linea[i + 1] === '"') { actual += '"'; i += 1; } else if (c === '"') comillas = false; else actual += c;
    } else if (c === '"') comillas = true;
    else if (c === sep) { celdas.push(actual); actual = ''; } else actual += c;
  }
  celdas.push(actual);
  return celdas;
}

function keywordsDeArchivo(archivo) {
  let texto = '';
  try { texto = readFileSync(archivo, 'utf8').replace(/^\uFEFF/, ''); } catch { return []; }
  const lineas = texto.split(/\r?\n/).filter((l) => l.trim());
  if (!lineas.length) return [];
  const primera = lineas[0];
  const sep = (primera.match(/;/g) || []).length > (primera.match(/,/g) || []).length ? ';' : ',';
  const cabecera = filaCsv(primera, sep).map((c) => c.trim().toLowerCase().replace(/^"|"$/g, ''));
  const columnas = cabecera
    .map((c, i) => (/^(keyword(_\d+)?|semilla|consulta)$/.test(c) ? i : -1))
    .filter((i) => i >= 0);
  if (!columnas.length) return [];
  const out = [];
  for (const linea of lineas.slice(1)) {
    const campos = filaCsv(linea, sep);
    for (const i of columnas) {
      const valor = (campos[i] || '').trim();
      if (valor && valor.length >= 3) out.push(valor);
    }
  }
  return out;
}

function archivosCsv(dir) {
  const out = [];
  for (const entrada of readdirSync(dir)) {
    const p = path.join(dir, entrada);
    if (statSync(p).isDirectory()) out.push(...archivosCsv(p));
    else if (entrada.toLowerCase().endsWith('.csv')) out.push(p);
  }
  return out;
}

const existentes = new Set();
for (const archivo of archivosCsv(path.join(raiz, 'seo'))) {
  if (path.basename(archivo).includes('keywords-30000-cursos')) continue;
  for (const kw of keywordsDeArchivo(archivo)) existentes.add(normalizar(kw));
}
console.log(`Keywords ya planeadas en seo/: ${existentes.size.toLocaleString('es-CO')}`);

const PAISES = ['Colombia', 'México', 'Perú', 'Chile', 'Argentina', 'Ecuador', 'Bolivia', 'Costa Rica', 'Panamá', 'España'];
const SECTORES = ['hospitales', 'clínicas', 'droguerías', 'farmacias', 'industria farmacéutica', 'servicios farmacéuticos', 'IPS', 'laboratorios'];
const ROLES_EXTRA = ['regentes de farmacia', 'auxiliares de farmacia', 'químicos farmacéuticos', 'farmacéuticos clínicos', 'estudiantes de química farmacéutica', 'jefes de servicio farmacéutico', 'auditores de calidad', 'profesionales de asuntos regulatorios'];

const vistos = new Set();
const filas = [];
const porGrupo = new Map();

function valida(keyword) {
  const limpio = String(keyword).toLowerCase().replace(/\s+/g, ' ').trim();
  if (limpio.length < 9 || limpio.length > 92) return false;
  const palabras = limpio.split(' ');
  if (palabras.length < 3 || palabras.length > 13) return false;
  if (/(de de|para para|en en|la la|el el|curso curso|como como|que que)\b/.test(limpio)) return false;
  if (!/^[a-z0-9áéíóúüñ ]+$/.test(limpio)) return false;
  if (/(gratis|presencial|garantizado|barato|descuento|promoción|promocion|regalo|curso curso)/.test(limpio)) return false;
  return true;
}

function agregar(keyword, datos) {
  const limpio = String(keyword).toLowerCase().replace(/\s+/g, ' ').trim();
  if (!valida(limpio)) return false;
  const clave = normalizar(limpio);
  if (!clave || existentes.has(clave) || vistos.has(clave)) return false;
  vistos.add(clave);
  const fila = {
    keyword: limpio,
    grupo: datos.grupo,
    curso: datos.curso,
    area: datos.area,
    publico: datos.publico,
    intencion: datos.intencion,
    embudo: datos.embudo,
    formato: datos.formato,
    url: datos.url,
    estado_pagina: datos.estado_pagina,
    cta: datos.cta,
    prioridad: datos.prioridad,
    nota: NOTA,
    tipo_blog: datos.tipo_blog || '',
    clase: datos.clase || '',
  };
  filas.push(fila);
  if (!porGrupo.has(datos.grupo)) porGrupo.set(datos.grupo, []);
  porGrupo.get(datos.grupo).push(fila);
  return true;
}

function urlBlog(cursoUrl, tipo) {
  return articulosPorCurso.get(cursoUrl)?.[tipo]?.mdPath ? `/articulos/${articulosPorCurso.get(cursoUrl)[tipo].slug}` : cursoUrl;
}

const POOLS_BLOG = {
  'guia-de-estudio': (t) => [
    `cómo estudiar ${t}`, `guía de estudio ${t}`, `método de estudio ${t}`, `estudiar ${t} sin memorizar`,
    `rutina para estudiar ${t}`, `plan de estudio ${t}`, `cómo aprender ${t}`, `técnicas para estudiar ${t}`,
    `${t} para estudiantes`, `${t} desde cero`, `cómo organizar el estudio de ${t}`, `sesiones de estudio ${t}`,
    `apuntes de ${t}`, `resumen de ${t}`, `cómo tomar apuntes de ${t}`, `repaso espaciado ${t}`,
    `cómo preparar un examen de ${t}`, `estudiar ${t} y trabajar`, `hábitos de estudio ${t}`, `cómo avanzar en ${t}`,
    `guía práctica ${t}`, `estudiar ${t} paso a paso`, `método para aprender ${t}`, `cómo entender ${t}`,
    `cómo estudiar ${t} en poco tiempo`, `cómo estudiar ${t} online`, `cómo aprovechar un curso de ${t}`,
    `cómo usar las evaluaciones de ${t}`, `cómo participar en foros de ${t}`, `estudiar ${t} con casos`,
    `cómo repasar ${t}`, `cómo saber si aprendí ${t}`, `dificultades para estudiar ${t}`, `cómo estudiar ${t} si trabajo`,
  ],
  'para-que-sirve': (t) => [
    `para qué sirve ${t}`, `qué es ${t}`, `${t} aplicaciones`, `${t} en el trabajo`, `${t} salidas`,
    `${t} utilidad`, `importancia de ${t}`, `${t} beneficios`, `dónde se aplica ${t}`, `${t} en farmacia`,
    `${t} en salud`, `${t} para profesionales`, `qué se aprende en ${t}`, `${t} qué resuelve`, `${t} alcance`,
    `${t} límites`, `${t} para qué se estudia`, `${t} en la práctica`, `${t} casos de uso`, `${t} roles`,
    `${t} perfil profesional`, `${t} competencias`, `qué puedes hacer con ${t}`, `${t} aplicado`,
    `${t} para principiantes`, `${t} nivel`, `${t} objetivos`, `${t} resultados`, `${t} en Colombia`,
    `${t} en hospitales`, `${t} en droguerías`, `${t} en industria`, `${t} en calidad`, `${t} en asuntos regulatorios`,
  ],
  temario: (t) => [
    `temario de ${t}`, `unidades de ${t}`, `clases de ${t}`, `contenido de ${t}`, `programa de ${t}`,
    `módulos de ${t}`, `plan de estudios de ${t}`, `qué se estudia en ${t}`, `${t} temario completo`,
    `${t} estructura`, `${t} unidades y clases`, `${t} clases online`, `${t} curso completo`, `${t} evaluación`,
    `${t} actividades`, `${t} foros`, `${t} nivel`, `${t} duración`, `${t} certificado`, `${t} requisitos`,
    `${t} temario pdf`, `${t} programa académico`, `${t} contenido del curso`, `${t} clases virtuales`,
    `${t} curso online`, `curso ${t} temario`, `descargar temario ${t}`, `ver temario ${t}`, `${t} qué incluye`,
    `${t} número de clases`, `${t} unidades`, `temario ${t} 2026`,
  ],
  'plan-30-dias': (t) => [
    `plan de 30 días ${t}`, `estudiar ${t} en 30 días`, `ruta de aprendizaje ${t}`, `cronograma de ${t}`,
    `plan semanal ${t}`, `cómo estudiar ${t} en un mes`, `reto de 30 días ${t}`, `plan de estudio ${t} pdf`,
    `organizar el estudio de ${t}`, `calendario de estudio ${t}`, `cómo distribuir el estudio de ${t}`,
    `objetivos de aprendizaje ${t}`, `metas de estudio ${t}`, `seguimiento de ${t}`, `progreso en ${t}`,
    `cómo medir el avance en ${t}`, `cómo retomar ${t}`, `cómo estudiar ${t} con poco tiempo`, `plan de 4 semanas ${t}`,
    `estudiar ${t} por semana`, `hábitos para aprender ${t}`, `productividad para estudiar ${t}`,
    `cómo evitar abandonar ${t}`, `plan de estudio para ${t}`, `agenda de estudio ${t}`,
    `cómo preparar ${t} en 30 días`, `ruta de 30 días ${t}`, `entregables de ${t}`, `evidencia de aprendizaje ${t}`,
    `plan personalizado ${t}`, `organización semanal ${t}`,
  ],
  errores: (t) => [
    `errores en ${t}`, `errores frecuentes ${t}`, `qué evitar en ${t}`, `${t} mal hecho`, `${t} errores comunes`,
    `${t} fallos`, `${t} consejos`, `${t} buenas prácticas`, `${t} qué no hacer`, `${t} señales de error`,
    `cómo detectar errores en ${t}`, `cómo corregir ${t}`, `${t} revisión`, `${t} checklist`,
    `${t} lista de verificación`, `${t} calidad`, `problemas frecuentes ${t}`, `dificultades en ${t}`,
    `mitos de ${t}`, `${t} mitos`, `${t} creencias erróneas`, `cómo evitar errores en ${t}`,
    `errores de novato en ${t}`, `errores de estudio en ${t}`, `errores al aplicar ${t}`, `${t} supervisión`,
    `qué revisar antes de ${t}`, `${t} control`, `${t} verificación`, `${t} documentación`, `${t} trazabilidad`,
    `${t} auditoría`,
  ],
  aplicacion: (t, roles) => [
    `aplicar ${t} en el trabajo`, `${t} en el puesto de trabajo`, `${t} ejemplos`, `${t} casos prácticos`,
    `${t} en la práctica`, `cómo aplicar ${t}`, `cómo usar ${t}`, `${t} tareas`, `${t} funciones`,
    `${t} responsabilidades`, `${t} evidencia`, `${t} indicadores`, `${t} documentación`, `${t} proyecto`,
    `${t} implementación`, `${t} mejora`, `${t} proceso`, `${t} procedimiento`, `${t} caso real`,
    `${t} ejercicio`, `${t} simulación`, `${t} rol`, `${t} competencias`, `${t} entrevista`, `${t} hoja de vida`,
    ...roles.slice(0, 6).map((rol) => `${t} para ${rol}`),
  ],
  faq: (t) => [
    `preguntas frecuentes ${t}`, `dudas sobre ${t}`, `${t} preguntas y respuestas`, `${t} opinion`,
    `${t} opiniones`, `${t} vale la pena`, `${t} precio`, `${t} costo`, `${t} duración`, `${t} certificado`,
    `${t} requisitos`, `${t} nivel`, `${t} online`, `${t} virtual`, `${t} a distancia`, `${t} para principiantes`,
    `${t} desde cero`, `${t} sirve`, `${t} es bueno`, `mejor curso de ${t}`, `dónde estudiar ${t}`,
    `dónde aprender ${t}`, `cuánto cuesta ${t}`, `cuánto dura ${t}`, `${t} primera unidad gratis`,
    `${t} acceso`, `${t} plataforma`, `${t} certificado verificable`, `${t} título`, `${t} salida laboral`,
    `${t} comparativa`, `${t} alternativas`, `${t} vs`, `curso ${t} opiniones`,
  ],
  comparativa: (t) => [
    `curso o autoaprendizaje ${t}`, `aprender ${t} por mi cuenta`, `${t} autodidacta`, `estudiar ${t} solo`,
    `curso ${t} o aprender solo`, `${t} autoaprendizaje`, `cómo aprender ${t} sin curso`, `${t} sin curso`,
    `curso de ${t} vs autoaprendizaje`, `${t} curso o tutorial`, `${t} curso o libro`, `${t} curso o diplomado`,
    `diferencia entre curso y autoaprendizaje ${t}`, `ventajas de un curso de ${t}`,
    `desventajas de aprender ${t} solo`, `cómo elegir un curso de ${t}`, `qué mirar en un curso de ${t}`,
    `curso de ${t} vale la pena`, `curso de ${t} o estudiar solo`, `${t} aprendizaje guiado`,
    `${t} aprendizaje autónomo`, `${t} estructura de aprendizaje`, `${t} ruta guiada`, `${t} curso estructurado`,
    `${t} curso completo`, `${t} formación reglada`, `${t} certificación o autoaprendizaje`,
    `${t} curso o especialización`, `${t} curso corto`, `${t} formación continua`, `${t} educación continua`,
  ],
};

const EXTRA_BLOG = {
  'guia-de-estudio': (t) => [
    `cómo estudiar ${t} paso a paso`, `método de estudio para ${t}`, `cómo aprender ${t} desde cero`,
    `cómo estudiar ${t} sin experiencia`, `cómo estudiar ${t} para un examen`, `cómo hacer un resumen de ${t}`,
    `cómo hacer un mapa conceptual de ${t}`, `técnicas de memoria para ${t}`, `cómo organizar apuntes de ${t}`,
    `cómo estudiar ${t} en equipo`, `cómo enseñar ${t}`, `cómo repasar ${t} antes de un examen`,
    `cómo evaluar si entendí ${t}`, `cómo crear un hábito de estudio de ${t}`, `cómo tomar notas de ${t}`,
    `cómo preparar una exposición de ${t}`, `cómo estudiar ${t} desde el celular`, `cómo estudiar ${t} sin distracciones`,
  ],
  'para-que-sirve': (t) => [
    `qué es ${t} y para qué sirve`, `${t} para qué sirve en farmacia`, `${t} para qué sirve en salud`,
    `${t} en la industria`, `${t} en la atención al paciente`, `${t} en la gestión`, `${t} en la regulación`,
    `${t} en la práctica profesional`, `${t} competencias laborales`, `${t} perfil de egreso`, `${t} campo laboral`,
    `${t} oportunidades`, `${t} demanda laboral`, `${t} en Colombia 2026`, `para qué estudiar ${t}`,
    `por qué estudiar ${t}`, `por qué aprender ${t}`, `qué aporta ${t}`, `qué mejora ${t}`,
    `qué problema resuelve ${t}`, `qué decisiones permite ${t}`,
  ],
  temario: (t) => [
    `temario ${t} pdf`, `programa ${t} pdf`, `contenido ${t} pdf`, `unidades ${t} pdf`, `clases ${t} pdf`,
    `${t} temario y precio`, `${t} temario y duración`, `${t} temario y certificado`, `${t} contenido completo`,
    `${t} plan de estudios completo`, `${t} asignaturas`, `${t} temas`, `${t} módulos y clases`, `${t} curso virtual`,
    `${t} curso a distancia`, `${t} curso con certificado`, `${t} curso con evaluaciones`, `${t} curso con foros`,
    `${t} curso con actividades`, `${t} curso con videos`, `${t} curso con casos`, `${t} curso actualizado 2026`,
  ],
  'plan-30-dias': (t) => [
    `cómo estudiar ${t} en cuatro semanas`, `plan de estudio semanal ${t}`, `cómo organizar cuatro semanas de ${t}`,
    `reto de estudio ${t}`, `cómo crear un cronograma de ${t}`, `cómo distribuir las clases de ${t}`,
    `cómo medir el progreso en ${t}`, `cómo mantener la constancia en ${t}`, `cómo retomar el estudio de ${t}`,
    `plan de estudio intensivo ${t}`, `plan de estudio flexible ${t}`, `cómo estudiar ${t} los fines de semana`,
    `cómo estudiar ${t} antes del trabajo`, `cómo estudiar ${t} después del trabajo`, `agenda semanal ${t}`,
    `objetivos semanales ${t}`, `metas de aprendizaje ${t}`, `seguimiento semanal ${t}`,
    `cómo evitar procrastinar ${t}`, `cómo terminar un curso de ${t}`,
  ],
  errores: (t) => [
    `errores al estudiar ${t}`, `errores al documentar ${t}`, `errores al interpretar ${t}`, `errores al decidir en ${t}`,
    `señales de alerta en ${t}`, `qué revisar en ${t}`, `cómo auditar ${t}`, `cómo verificar ${t}`,
    `cómo controlar ${t}`, `cómo mejorar ${t}`, `cómo evitar reprocesos en ${t}`, `cómo reducir errores en ${t}`,
    `errores de comunicación en ${t}`, `errores de registro en ${t}`, `errores de seguimiento en ${t}`,
    `errores de supervisión en ${t}`, `errores de planificación en ${t}`, `errores de ejecución en ${t}`,
    `qué hace mal un principiante en ${t}`, `qué hace mal un experto en ${t}`,
  ],
  aplicacion: (t, roles) => [
    `cómo aplicar ${t} en el hospital`, `cómo aplicar ${t} en la droguería`, `cómo aplicar ${t} en la industria`,
    `cómo aplicar ${t} en la calidad`, `cómo aplicar ${t} en asuntos regulatorios`, `cómo aplicar ${t} en la farmacia`,
    `${t} en la práctica diaria`, `${t} en la operación`, `${t} en la gestión del servicio`,
    `${t} en la atención farmacéutica`, `${t} en la seguridad del paciente`, `${t} en la documentación`,
    `${t} en la auditoría`, `${t} en la capacitación`, `${t} en la mejora continua`,
    `${t} en la toma de decisiones`, `${t} en la resolución de problemas`, `${t} en el seguimiento`,
    `${t} en la comunicación`, `${t} en el trabajo en equipo`,
    ...roles.slice(0, 4).map((rol) => `cómo aplicar ${t} como ${rol}`),
  ],
  faq: (t) => [
    `${t} es difícil`, `${t} es fácil`, `${t} requiere experiencia`, `${t} requiere título`, `${t} requiere certificado`,
    `${t} tiene salida laboral`, `${t} tiene demanda`, `${t} paga bien`, `${t} se puede estudiar online`,
    `${t} se puede estudiar desde casa`, `${t} se puede estudiar sin título`, `${t} se puede estudiar en Colombia`,
    `${t} se puede estudiar en México`, `${t} se puede estudiar en Perú`, `${t} se puede estudiar en Chile`,
    `${t} se puede estudiar en Argentina`, `${t} se puede estudiar en Ecuador`, `${t} es para mí`,
    `${t} sirve para trabajar`, `${t} sirve para el currículum`, `${t} sirve para una entrevista`,
    `${t} se aprende en un curso`, `${t} se aprende en la universidad`, `${t} se aprende con práctica`,
    `${t} tiene futuro`, `${t} está en demanda`, `${t} es rentable`, `${t} vale la inversión`,
    `${t} tiene certificado oficial`, `${t} tiene certificado verificable`, `${t} tiene primera unidad gratis`,
  ],
  comparativa: (t) => [
    `${t} curso o universidad`, `${t} curso o especialización`, `${t} curso o maestría`, `${t} curso o diplomado`,
    `${t} curso corto o largo`, `${t} curso online o presencial`, `${t} curso pagado o autoaprendizaje`,
    `${t} curso con certificado o sin certificado`, `${t} aprender con curso o con libro`, `${t} aprender con curso o con video`,
    `${t} aprender con curso o con práctica`, `${t} aprender con curso o con mentor`, `${t} curso individual o grupal`,
    `${t} curso teórico o práctico`, `${t} curso básico o avanzado`, `${t} curso intensivo o flexible`,
    `${t} formación continua`, `${t} actualización profesional`, `${t} curso de actualización`, `${t} curso de profundización`,
  ],
};

for (const [tipo, fn] of Object.entries(POOLS_BLOG)) {
  POOLS_BLOG[tipo] = (t, roles) => [...fn(t, roles), ...(EXTRA_BLOG[tipo] ? EXTRA_BLOG[tipo](t, roles) : [])];
}

const POOLS_GEO = (t, roles) => [
  `qué curso de ${t} me recomiendan`, `dónde puedo estudiar ${t} en Colombia`, `cuánto dura un curso de ${t}`,
  `qué incluye un curso de ${t}`, `sirve un curso de ${t} para trabajar`, `puedo aprender ${t} desde cero`,
  `qué diferencia hay entre curso y diplomado de ${t}`, `cómo saber si un curso de ${t} es bueno`,
  `qué curso de ${t} tiene certificado`, `cuánto tiempo debo estudiar ${t} al día`,
  `qué necesito saber antes de estudiar ${t}`, `cuál es la mejor forma de aprender ${t}`,
  `vale la pena estudiar ${t} en 2026`, `qué salidas laborales tiene ${t}`, `cómo aplicar ${t} en mi trabajo`,
  `qué errores evitar al aprender ${t}`, `cómo estudiar ${t} sin memorizar`, `cómo elegir un curso de ${t} online`,
  `qué tan difícil es aprender ${t}`, `se puede estudiar ${t} mientras trabajo`,
  `qué curso de ${t} está actualizado`, `qué curso de ${t} recomienda un químico farmacéutico`,
  `cuántas clases tiene un curso de ${t}`, `qué evaluaciones tiene un curso de ${t}`,
  `cómo se estudia ${t} online`, `qué certificado necesito para trabajar en ${t}`,
  `dónde encontrar un curso de ${t} con certificado`, `qué plataforma tiene cursos de ${t}`,
  `hay cursos de ${t} en español`, `qué curso de ${t} tiene primera unidad gratis`,
  `cómo aprovechar un curso de ${t}`, `qué sigue después de aprender ${t}`, `cómo mantenerse actualizado en ${t}`,
  ...roles.slice(0, 6).map((rol) => `qué curso de ${t} es mejor para ${rol}`),
  ...SECTORES.slice(0, 6).map((sector) => `qué curso de ${t} sirve para ${sector}`),
];

for (const curso of cursos) {
  const t = curso.tema;
  const roles = curso.areaInfo.roles || [];
  const tipos = articulosPorCurso.get(curso.url) || {};
  for (const [tipo, articulo] of Object.entries(tipos)) {
    const pool = POOLS_BLOG[tipo];
    if (!pool) continue;
    for (const keyword of pool(t, roles)) {
      agregar(keyword, {
        grupo: 'Blogs de curso',
        curso: curso.titulo,
        area: curso.area,
        publico: curso.publico,
        intencion: ['faq', 'comparativa'].includes(tipo) ? 'comercial' : 'informacional',
        embudo: ['faq', 'comparativa'].includes(tipo) ? 'consideracion' : 'atraccion',
        formato: 'blog',
        url: `/articulos/${articulo.slug}`,
        estado_pagina: 'nueva',
        cta: 'Leer el artículo',
        prioridad: ['faq', 'comparativa'].includes(tipo) ? 'Media' : 'Baja',
        tipo_blog: tipo,
      });
    }
  }

  const cursoPool = [
    `curso de ${t}`, `curso online de ${t}`, `curso virtual de ${t}`, `curso de ${t} con certificado`,
    `curso de ${t} certificado`, `curso de ${t} precio`, `curso de ${t} costo`, `curso de ${t} opiniones`,
    `curso de ${t} 2026`, `curso de ${t} actualizado`, `curso de ${t} desde cero`,
    `curso de ${t} para principiantes`, `curso de ${t} intermedio`, `curso de ${t} avanzado`,
    `curso de ${t} intensivo`, `curso de ${t} a distancia`, `curso de ${t} online con certificado`,
    `curso de ${t} virtual con certificado`, `curso de ${t} para profesionales`,
    `curso de ${t} para estudiantes`, `certificación en ${t}`, `diplomado en ${t}`, `taller de ${t}`,
    `capacitación en ${t}`, `formación en ${t}`, `clases de ${t}`, `aprender ${t}`, `estudiar ${t} online`,
    `dónde estudiar ${t}`, `dónde aprender ${t}`, `mejor curso de ${t}`, `mejores cursos de ${t}`,
    `comparativa de cursos de ${t}`, `curso de ${t} vale la pena`, `curso de ${t} sirve`,
    `cuánto dura un curso de ${t}`, `cuánto cuesta un curso de ${t}`,
    `curso de ${t} con certificado verificable`, `curso de ${t} primera unidad gratis`,
    `curso de ${t} online 2026`, `curso de ${t} actualizado 2026`, `curso de ${t} para el trabajo`,
    `curso de ${t} con casos prácticos`, `curso de ${t} con evaluaciones`, `curso de ${t} con foros`,
    `curso de ${t} con videos`, `curso de ${t} virtual 2026`, `curso de ${t} online para profesionales`,
    ...roles.map((rol) => `curso de ${t} para ${rol}`),
    ...roles.map((rol) => `curso online de ${t} para ${rol}`),
    ...roles.map((rol) => `curso virtual de ${t} para ${rol}`),
    ...roles.map((rol) => `capacitación en ${t} para ${rol}`),
    ...roles.map((rol) => `formación en ${t} para ${rol}`),
    ...PAISES.map((pais) => `curso de ${t} en ${pais}`),
    ...PAISES.map((pais) => `curso online de ${t} en ${pais}`),
    ...PAISES.map((pais) => `curso de ${t} en ${pais} con certificado`),
    ...SECTORES.map((sector) => `curso de ${t} para ${sector}`),
    ...SECTORES.map((sector) => `capacitación en ${t} para ${sector}`),
    ...ROLES_EXTRA.map((rol) => `curso de ${t} para ${rol}`),
    ...PAISES.flatMap((pais) => roles.slice(0, 8).map((rol) => `curso de ${t} para ${rol} en ${pais}`)),
    ...PAISES.flatMap((pais) => SECTORES.slice(0, 8).map((sector) => `curso de ${t} para ${sector} en ${pais}`)),
    ...roles.slice(0, 8).flatMap((rol) => [
      `curso de ${t} con certificado para ${rol}`,
      `curso de ${t} online con certificado para ${rol}`,
      `curso de ${t} virtual con certificado para ${rol}`,
    ]),
    ...SECTORES.map((sector) => `curso online de ${t} para ${sector}`),
    ...SECTORES.map((sector) => `curso virtual de ${t} para ${sector}`),
    `curso de ${t} con certificado y casos`, `curso de ${t} con certificado y evaluaciones`,
    `curso de ${t} con certificado y foros`, `curso de ${t} con certificado y videos`,
    `curso de ${t} online con casos prácticos`, `curso de ${t} virtual con casos prácticos`,
    `curso de ${t} para actualización profesional`, `curso de ${t} para formación continua`,
    `curso de ${t} para mejorar el currículum`, `curso de ${t} para conseguir empleo`,
    `curso de ${t} para cambiar de área`, `curso de ${t} para crecer profesionalmente`,
  ];
  for (const keyword of cursoPool) {
    agregar(keyword, {
      grupo: 'Cursos',
      curso: curso.titulo,
      area: curso.area,
      publico: curso.publico,
      intencion: 'transaccional',
      embudo: 'conversion',
      formato: 'curso',
      url: curso.url,
      estado_pagina: 'existe',
      cta: 'Ver el curso',
      prioridad: 'Alta',
    });
  }

  const clases = curso.clases
    .map((c) => String(c.titulo).replace(/[¿?¡!]/g, '').replace(/\s+/g, ' ').trim())
    .filter((titulo) => titulo.length >= 12 && titulo.length <= 82 && titulo.split(' ').length >= 3 && titulo.split(' ').length <= 12)
    .filter((titulo) => !/^(bienvenida|introducción|introduccion|cierre|evaluación|evaluacion|repaso)/i.test(titulo));
  for (const clase of clases) {
    const variantes = [clase];
    if (!/^(qué|que|cómo|como|cuál|cual|por qué|por que)/i.test(clase)) {
      variantes.push(`qué es ${clase}`, `${clase} explicación`, `${clase} paso a paso`, `${clase} ejemplo`);
      variantes.push(`cómo se hace ${clase}`, `${clase} resumen`, `${clase} para qué sirve`);
      variantes.push(`preguntas de ${clase}`, `ejemplos de ${clase}`, `resumen de ${clase}`);
      variantes.push(`explicación de ${clase}`, `cómo aplicar ${clase}`, `para qué sirve ${clase}`);
      variantes.push(`${clase} preguntas`, `${clase} ejemplos`, `${clase} aplicación`);
    }
    for (const keyword of variantes) {
      agregar(keyword, {
        grupo: 'Clases',
        curso: curso.titulo,
        area: curso.area,
        publico: curso.publico,
        intencion: 'informacional',
        embudo: 'atraccion',
        formato: 'clase',
        url: curso.url,
        estado_pagina: 'existe',
        cta: 'Ver la clase en el curso',
        prioridad: 'Baja',
        clase,
      });
    }
  }

  const geo = POOLS_GEO(t, roles);
  for (const keyword of geo) {
    const tipo = /cómo estudiar|sin memorizar/.test(keyword) ? 'guia-de-estudio'
      : /incluye|temario|clases|evaluaciones/.test(keyword) ? 'temario'
        : /cuánto dura|precio|costo|certificado|vale la pena|primera unidad/.test(keyword) ? 'faq'
          : /aplicar|salidas|trabajo|sirve/.test(keyword) ? 'aplicacion'
            : /errores/.test(keyword) ? 'errores'
              : /curso o|autoaprendizaje|elegir/.test(keyword) ? 'comparativa'
                : 'faq';
    const articulo = tipos[tipo];
    agregar(keyword, {
      grupo: 'Preguntas GEO',
      curso: curso.titulo,
      area: curso.area,
      publico: curso.publico,
      intencion: 'informacional',
      embudo: 'consideracion',
      formato: 'pregunta',
      url: articulo ? `/articulos/${articulo.slug}` : curso.url,
      estado_pagina: articulo ? 'nueva' : 'existe',
      cta: articulo ? 'Leer la respuesta' : 'Ver el curso',
      prioridad: 'Media',
      tipo_blog: articulo?.tipo || '',
    });
  }
}

console.log('Universo generado:', filas.length.toLocaleString('es-CO'));
for (const [grupo, lista] of [...porGrupo.entries()].sort()) {
  console.log(`  ${grupo}: ${lista.length.toLocaleString('es-CO')}`);
}

const MINIMOS = {
  'Blogs de curso': 12000,
  Cursos: 10000,
  Clases: 6000,
  'Preguntas GEO': 2000,
};
const seleccion = [];
const usadas = new Set();
const tomar = (fila) => {
  const clave = normalizar(fila.keyword);
  if (usadas.has(clave) || seleccion.length >= META) return false;
  usadas.add(clave);
  seleccion.push(fila);
  return true;
};

function roundRobin(lista, cupo) {
  const grupos = new Map();
  for (const f of lista) {
    if (usadas.has(normalizar(f.keyword))) continue;
    const k = f.url || f.curso || 'otros';
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(f);
  }
  const orden = [...grupos.keys()].sort();
  let agregados = 0;
  while (agregados < cupo && orden.length) {
    let hubo = false;
    for (const k of orden) {
      const cola = grupos.get(k);
      if (!cola.length) continue;
      const f = cola.shift();
      if (tomar(f)) { agregados += 1; hubo = true; }
      if (agregados >= cupo) break;
    }
    if (!hubo) break;
  }
  return agregados;
}

for (const [grupo, minimo] of Object.entries(MINIMOS)) {
  const lista = porGrupo.get(grupo) || [];
  roundRobin(lista, Math.min(minimo, META - seleccion.length));
  console.log(`Seleccionados ${grupo}: ${seleccion.filter((f) => f.grupo === grupo).length.toLocaleString('es-CO')}`);
}

if (seleccion.length < META) {
  const restantes = filas.filter((f) => !usadas.has(normalizar(f.keyword)));
  const peso = { Alta: 0, Media: 1, Baja: 2 };
  restantes.sort((a, b) => (peso[a.prioridad] ?? 3) - (peso[b.prioridad] ?? 3));
  roundRobin(restantes, META - seleccion.length);
}

if (seleccion.length !== META) {
  console.error(`No se alcanzaron ${META} keywords únicas. Se obtuvieron ${seleccion.length}.`);
  process.exit(1);
}

const claves = new Set(seleccion.map((f) => normalizar(f.keyword)));
if (claves.size !== META) {
  console.error(`Hay keywords duplicadas: ${META - claves.size}`);
  process.exit(1);
}

const urlsValidas = new Set([
  ...cursos.map((c) => c.url),
  ...BLOG_CURSOS_500.map((a) => `/articulos/${a.slug}`),
]);
for (const fila of seleccion) {
  if (!urlsValidas.has(fila.url)) {
    console.error(`URL inválida: ${fila.url} (keyword: ${fila.keyword})`);
    process.exit(1);
  }
}

const columnas = ['n', 'keyword', 'grupo', 'curso', 'area', 'publico', 'intencion', 'embudo', 'formato', 'url_destino', 'estado_pagina', 'cta', 'prioridad', 'tipo_blog', 'clase', 'nota_verificacion'];
const lineas = [columnas.join(',')];
seleccion.forEach((f, i) => {
  lineas.push([
    i + 1, f.keyword, f.grupo, f.curso, f.area, f.publico, f.intencion, f.embudo, f.formato,
    f.url, f.estado_pagina, f.cta, f.prioridad, f.tipo_blog, f.clase, f.nota,
  ].map(csvCell).join(','));
});
writeFileSync(SALIDA_CSV, `${lineas.join('\n')}\n`, 'utf8');

const contar = (campo) => {
  const m = new Map();
  for (const f of seleccion) m.set(f[campo], (m.get(f[campo]) || 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

const tabla = (titulo, pares) => `### ${titulo}\n\n| Valor | Keywords |\n|---|---:|\n${pares.map(([k, v]) => `| ${k || '(sin dato)'} | ${v.toLocaleString('es-CO')} |`).join('\n')}\n`;

const urls = new Set(seleccion.map((f) => f.url));
const blogsConKeywords = new Set(seleccion.filter((f) => f.estado_pagina === 'nueva').map((f) => f.url));
const clasesConKeywords = new Set(seleccion.filter((f) => f.formato === 'clase').map((f) => f.curso));

const md = `# Plan de 30.000 keywords para los cursos de Edvanta

Generado con \`scripts/generar-30000-keywords-cursos.mjs\` el 26-nov-2026.

## Qué se construyó

- **30.000 keywords únicas**, sin repetir las ${existentes.size.toLocaleString('es-CO')} consultas que ya viven en \`seo/*.csv\`.
- **${BLOG_CURSOS_500.length} artículos nuevos** que responden a las búsquedas de blog.
- **${cursos.length} fichas de curso** con keywords transaccionales.
- **${clasesConKeywords.size} de ${cursos.length} cursos** con keywords derivadas de sus clases reales.
- **${urls.size} URLs de destino**, todas existentes o creadas en esta campaña.

## Decisión importante: 30.000 keywords, no 30.000 páginas

Publicar una página por keyword sería contenido delgado y pondría en riesgo el dominio. El plan concentra las consultas en **${BLOG_CURSOS_500.length} artículos** (ocho ángulos por curso, aproximadamente), **${cursos.length} fichas** y las páginas de curso que ya contienen las clases. Cada keyword declara la URL que la responde.

## Distribución por grupo

${tabla('Grupos', contar('grupo'))}
${tabla('Intención', contar('intencion'))}
${tabla('Etapa del embudo', contar('embudo'))}
${tabla('Prioridad', contar('prioridad'))}
${tabla('Público', contar('publico'))}

## Cómo se conecta el embudo

| Público | Entrada (atracción) | Consideración | Conversión |
|---|---|---|---|
| Profesionales | Clases, guías de estudio y errores frecuentes | Temario, aplicación y comparativas | Ficha del curso, primera unidad y certificado |
| Estudiantes | Cómo estudiar, apuntes y preguntas frecuentes | Plan de 30 días y utilidad laboral | Curso completo |
| Regentes y auxiliares | Aplicación en el trabajo y errores frecuentes | Preguntas frecuentes y temario | Curso y capacitación |
| Instituciones | Aplicación por rol y sector | Comparativa y programa | Ficha y propuesta institucional |

## Los ocho ángulos de cada curso

| Ángulo | Qué responde | Destino |
|---|---|---|
| Guía de estudio | Cómo estudiar, en qué orden y con qué método | Artículo + ficha |
| Para qué sirve | Utilidad, roles y límites | Artículo + ficha |
| Temario | Unidades, clases y evaluaciones | Artículo + ficha |
| Plan de 30 días | Ruta semanal y entregables | Artículo + ficha |
| Errores frecuentes | Qué evitar y cómo corregirlo | Artículo + ficha |
| Aplicación en el trabajo | Tareas, evidencia y proyecto | Artículo + ficha |
| Preguntas frecuentes | Nivel, tiempo, certificado, acceso | Artículo + ficha |
| Curso o autoaprendizaje | Comparación honesta y ruta propia | Artículo + ficha |

## Cómo aumentar las keywords en las clases

Las clases reales del Aula ya tienen texto y video. Para que esa inversión se refleje en búsqueda:

1. **Título de clase como H2 visible** en la página del curso y en el aula, con la misma redacción con la que se busca.
2. **Bloque “Qué vas a aprender”** al inicio de cada clase, con 3 a 5 frases que incluyan el nombre del tema y una pregunta frecuente.
3. **Preguntas frecuentes al final de la unidad**, no solo al final del curso.
4. **Enlaces internos** desde la clase al artículo del mismo tema y desde el artículo a la ficha del curso.
5. **Una sola URL canónica** por clase; si hay una versión abierta y una privada, la abierta es la que se indexa y la privada queda en \`noindex\`.
6. **Datos estructurados** de curso y FAQ en la ficha, sin inventar precios ni fechas.

## Enlazado interno

- Cada artículo enlaza a su ficha de curso en la introducción y en el cierre.
- Cada artículo enlaza a 2 o 3 artículos hermanos del mismo curso.
- Cada ficha debe enlazar a los artículos de su curso (guía, temario, FAQ y aplicación).
- Los artículos de un área enlazan a 2 cursos relacionados del mismo campo.
- No se enlaza a clases privadas ni a pagos desde el texto editorial.

## Reglas editoriales que no se negocian

- No se inventan precios, fechas, cupos, certificados ni grabaciones.
- La primera unidad gratis y el certificado se mencionan solo como los declara la ficha.
- Los temas clínicos son educativos: no indican dosis ni cambios de tratamiento.
- Los artículos generados son borradores editoriales: se revisan antes de una campaña pagada.
- No se publica una página nueva si la intención ya está cubierta; se agrega una sección o una pregunta.

## Cómo usar el CSV

1. Prioriza \`prioridad = Alta\` y \`grupo = Cursos\`: sostienen la conversión.
2. Trabaja los artículos con \`grupo = Blogs de curso\` por curso, no por keyword individual.
3. Usa \`grupo = Clases\` para mejorar los títulos y bloques “qué aprenderás” de las clases.
4. Usa \`grupo = Preguntas GEO\` para FAQ y respuestas de asistentes de IA.
5. Mide en Search Console por página y por consulta; no por keyword aislada.
6. Revisa cada trimestre: impresiones sin clics piden mejorar título y descripción; clics sin conversión piden mejorar la ficha.

## Muestra de keywords prioritarias

${seleccion.filter((f) => f.prioridad === 'Alta').slice(0, 50).map((f) => `- **${f.keyword}** → \`${f.url}\``).join('\n')}

## Archivos

- \`seo/keywords-30000-cursos.csv\`
- \`seo/plan-30000-keywords-cursos.md\`
- \`src/data/blogCursos500.js\`
- \`public/articulos/articulos_edvanta/cursos-recomendados/*.md\`
- \`scripts/generar-blogs-cursos.mjs\`
- \`scripts/generar-30000-keywords-cursos.mjs\`
`;

writeFileSync(SALIDA_MD, md, 'utf8');

console.log(`\nCSV: ${SALIDA_CSV}`);
console.log(`Plan: ${SALIDA_MD}`);
console.log(`Keywords: ${seleccion.length.toLocaleString('es-CO')} · URLs: ${urls.size} · Blogs con keywords: ${blogsConKeywords.size}`);
