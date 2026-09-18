/**
 * ============================================================
 *  lib/cv/lector.js — Interpreta el texto de una hoja de vida
 *
 *  Convierte el texto plano (de un PDF o pegado) en una hoja de
 *  vida estructurada: nombre, contacto, secciones, cargos con sus
 *  fechas y logros, estudios, habilidades e idiomas.
 *
 *  Es heurístico y está pensado para hojas de vida en español del
 *  sector salud en Colombia. Lo que no reconoce no se inventa: queda
 *  vacío para que la persona lo complete en el creador.
 * ============================================================
 */

export const normalizar = (s) => String(s || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036F]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

/* ── Encabezados de sección ───────────────────────────────── */

const ENCABEZADOS = {
  perfil: ['perfil', 'perfil profesional', 'perfil laboral', 'resumen', 'resumen profesional', 'acerca de mi', 'sobre mi', 'objetivo', 'objetivo profesional', 'objetivo laboral', 'presentacion', 'extracto', 'summary', 'profile', 'about me', 'professional summary', 'perfil ocupacional', 'resumen de perfil', 'descripcion profesional', 'perfil personal'],
  experiencia: ['experiencia', 'experiencia laboral', 'experiencia profesional', 'experiencia relevante', 'trayectoria', 'trayectoria profesional', 'trayectoria laboral', 'historial laboral', 'experience', 'work experience', 'professional experience', 'employment history', 'experiencia laboral relevante', 'experiencia profesional relevante', 'historia laboral', 'experiencia y logros'],
  formacion: ['formacion', 'formacion academica', 'educacion', 'estudios', 'estudios realizados', 'informacion academica', 'formacion profesional', 'education', 'academic background', 'formacion academica y complementaria', 'estudios academicos', 'educacion formal', 'titulos', 'formacion superior'],
  habilidades: ['habilidades', 'competencias', 'aptitudes', 'conocimientos', 'habilidades tecnicas', 'competencias tecnicas', 'habilidades y competencias', 'herramientas', 'software', 'manejo de software', 'skills', 'technical skills', 'competencias laborales', 'habilidades blandas', 'competencias profesionales', 'competencias clave', 'conocimientos tecnicos', 'habilidades profesionales', 'herramientas y software', 'informatica', 'habilidades digitales'],
  certificaciones: ['certificaciones', 'certificados', 'cursos', 'cursos y certificaciones', 'formacion complementaria', 'educacion complementaria', 'diplomados', 'capacitaciones', 'seminarios', 'certifications', 'courses', 'certificaciones y cursos', 'cursos y diplomados', 'certificaciones y diplomados', 'formacion continua', 'educacion continua', 'cursos complementarios', 'certificados y cursos', 'cursos realizados'],
  idiomas: ['idiomas', 'idioma', 'lenguas', 'languages', 'manejo de idiomas', 'lenguas extranjeras'],
  referencias: ['referencias', 'referencias personales', 'referencias laborales', 'referencias familiares', 'references', 'referencias profesionales'],
  datos: ['datos personales', 'informacion personal', 'informacion de contacto', 'contacto', 'datos de contacto', 'personal information', 'contact'],
  logros: ['logros', 'logros destacados', 'premios', 'reconocimientos', 'distinciones'],
  publicaciones: ['publicaciones', 'investigacion', 'articulos', 'proyectos de investigacion'],
  otros: ['voluntariado', 'proyectos', 'intereses', 'actividades extracurriculares'],
};

const COMPACTOS = Object.fromEntries(
  Object.entries(ENCABEZADOS).map(([clave, lista]) => [clave, lista.map((h) => h.replace(/\s+/g, ''))]),
);

/** ¿Esta línea es un encabezado de sección? Devuelve la clave o null. */
export function detectarEncabezado(linea) {
  const limpia = normalizar(linea).replace(/[:.|•\-–—]+$/g, '').replace(/^[•\-–—\s]+/, '').trim();
  if (!limpia || /\d/.test(limpia)) return null;
  const partes = limpia.split(' ');
  // Letras espaciadas: «p e r f i l p r o f e s i o n a l» → «perfilprofesional»
  if (partes.length >= 4 && partes.filter((p) => p.length === 1).length / partes.length >= 0.7) {
    const compacta = limpia.replace(/\s+/g, '');
    for (const [clave, lista] of Object.entries(COMPACTOS)) {
      if (lista.includes(compacta)) return clave;
    }
    return null;
  }
  if (partes.length > 5) return null;
  for (const [clave, lista] of Object.entries(ENCABEZADOS)) {
    if (lista.includes(limpia)) return clave;
  }
  return null;
}

/* ── Contacto ─────────────────────────────────────────────── */

const RE_EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const RE_LINKEDIN = /(?:https?:\/\/)?(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%áéíóúñÁÉÍÓÚÑ]+\/?/i;
const RE_WEB = /(?:https?:\/\/|www\.)[^\s,;]+/i;
// Celular colombiano (3xx), fijo nuevo (60x) o internacional con prefijo.
const RE_TELEFONO = /(?:\+?\s?57[\s.-]?)?(?:\(?3\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}|60\d[\s.-]?\d{3}[\s.-]?\d{4})|\+\d{1,3}[\s.-]?\d{2,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4}/;

const CIUDADES = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Cúcuta', 'Pereira', 'Manizales',
  'Santa Marta', 'Ibagué', 'Villavicencio', 'Pasto', 'Montería', 'Neiva', 'Armenia', 'Popayán', 'Sincelejo',
  'Valledupar', 'Tunja', 'Riohacha', 'Quibdó', 'Florencia', 'Yopal', 'Soacha', 'Soledad', 'Bello', 'Envigado',
  'Itagüí', 'Funza', 'Mosquera', 'Chía', 'Zipaquirá', 'Palmira', 'Floridablanca', 'Girón', 'Malambo',
  'Rionegro', 'Sabaneta', 'Tuluá', 'Buenaventura', 'Barrancabermeja', 'Cajicá', 'Madrid', 'Facatativá',
];

/** La ciudad que aparece primero en el texto, como palabra completa. */
function primeraCiudad(texto) {
  const t = ` ${normalizar(texto)} `;
  let mejor = '';
  let posicion = Infinity;
  for (const c of CIUDADES) {
    const m = new RegExp(`[^a-z0-9ñ]${normalizar(c)}[^a-z0-9ñ]`).exec(t);
    if (m && m.index < posicion) { posicion = m.index; mejor = c; }
  }
  return mejor;
}

/* ── Fechas ───────────────────────────────────────────────── */

const MESES = {
  ene: 1, enero: 1, jan: 1, january: 1,
  feb: 2, febrero: 2, february: 2,
  mar: 3, marzo: 3, march: 3,
  abr: 4, abril: 4, apr: 4, april: 4,
  may: 5, mayo: 5,
  jun: 6, junio: 6, june: 6,
  jul: 7, julio: 7, july: 7,
  ago: 8, agosto: 8, aug: 8, august: 8,
  sep: 9, sept: 9, septiembre: 9, setiembre: 9, september: 9,
  oct: 10, octubre: 10, october: 10,
  nov: 11, noviembre: 11, november: 11,
  dic: 12, diciembre: 12, dec: 12, december: 12,
};
const MES_RE = Object.keys(MESES).sort((a, b) => b.length - a.length).join('|');
const FECHA = `(?:(?:(?:${MES_RE})\\.?(?:\\s+de)?\\s+)?(?:19|20)\\d{2}|\\d{1,2}[/.-](?:19|20)\\d{2}|(?:19|20)\\d{2}[/.-]\\d{1,2})`;
const FIN_ACTUAL = '(?:actual(?:mente)?|presente|hoy|a la fecha|la fecha|present|current|en curso)';
export const RE_RANGO = new RegExp(`(${FECHA})\\s*(?:-|–|—|a|al|hasta|to)\\s*(${FECHA}|${FIN_ACTUAL})`, 'i');

/** «ene 2020», «01/2020», «2020-01», «2020» → { anio, mes } */
function leerFecha(texto) {
  const t = normalizar(texto);
  let m = t.match(new RegExp(`^(${MES_RE})\\.?(?:\\s+de)?\\s+((?:19|20)\\d{2})$`));
  if (m) return { anio: Number(m[2]), mes: MESES[m[1]] };
  m = t.match(/^(\d{1,2})[/.-]((?:19|20)\d{2})$/);
  if (m) return { anio: Number(m[2]), mes: Math.min(12, Math.max(1, Number(m[1]))) };
  m = t.match(/^((?:19|20)\d{2})[/.-](\d{1,2})$/);
  if (m) return { anio: Number(m[1]), mes: Math.min(12, Math.max(1, Number(m[2]))) };
  m = t.match(/^((?:19|20)\d{2})$/);
  if (m) return { anio: Number(m[1]), mes: null };
  return null;
}

/** Busca un rango de fechas en la línea. Devuelve null si no hay. */
export function leerRango(linea, hoy = new Date()) {
  const m = String(linea || '').match(RE_RANGO);
  if (!m) return null;
  const inicio = leerFecha(m[1]);
  const actual = new RegExp(`^${FIN_ACTUAL}$`, 'i').test(normalizar(m[2]));
  const fin = actual ? { anio: hoy.getFullYear(), mes: hoy.getMonth() + 1 } : leerFecha(m[2]);
  if (!inicio || !fin) return null;
  const desde = inicio.anio * 12 + (inicio.mes || 1) - 1;
  const hasta = fin.anio * 12 + (fin.mes || 12) - 1;
  if (hasta < desde || hasta - desde > 12 * 50) return null;
  return {
    texto: m[0],
    inicio: m[1].trim(),
    fin: actual ? 'Actual' : m[2].trim(),
    actual,
    desde,
    hasta,
  };
}

/** Meses totales de experiencia, sin contar dos veces los periodos que se cruzan. */
export function mesesDeExperiencia(rangos) {
  const ordenados = rangos.filter(Boolean).map((r) => [r.desde, r.hasta]).sort((a, b) => a[0] - b[0]);
  let total = 0;
  let actual = null;
  for (const [d, h] of ordenados) {
    if (!actual) { actual = [d, h]; continue; }
    if (d <= actual[1] + 1) actual[1] = Math.max(actual[1], h);
    else { total += actual[1] - actual[0] + 1; actual = [d, h]; }
  }
  if (actual) total += actual[1] - actual[0] + 1;
  return total;
}

/* ── Utilidades de línea ──────────────────────────────────── */

const RE_VIÑETA = /^[•●○◦▪■►▸‣⁃∙·\-–—*✓✔➢➤]\s*/;
const esViñeta = (l) => RE_VIÑETA.test(l);
const sinViñeta = (l) => l.replace(RE_VIÑETA, '').trim();
// Razones sociales que terminan en punto y no son el fin de una frase.
const RE_SOCIEDAD = /\b(s\.?\s?a\.?\s?s\.?|s\.?\s?a\.|ltda\.?|inc\.?|e\.?\s?s\.?\s?e\.?)$/i;
/** Una línea sin viñeta que se lee como logro: larga o terminada en punto. */
const pareceLogro = (texto) => texto.split(' ').length > 8 || (/\.$/.test(texto) && !RE_SOCIEDAD.test(texto));
// Palabras con que suele empezar un cargo y palabras que delatan una organización.
// «farmacia» no está en las segundas: también es parte de cargos («Auxiliar de farmacia»).
const RE_CARGO = /^(analista|auxiliar|regente|jef[ea]|director[a]?|coordinador[a]?|gerente|qu[ií]mic[oa]|profesional|asistente|practicante|pasante|t[eé]cnic[oa]|tecn[oó]log[oa]|especialista|supervisor[a]?|l[ií]der|representante|visitador[a]?|asesor[a]?|investigador[a]?|docente|consultor[a]?|ingenier[oa]|administrador[a]?|farmac[eé]utic[oa]|vendedor[a]?|ejecutiv[oa]|operari[oa])\b/i;
const RE_ORGANIZACION = /\b(s\.?\s?a\.?\s?s\.?|ltda|s\.a\.|laboratorios?|cl[ií]nica|hospital|droguer[ií]as?|ips|eps|e\.?s\.?e|universidad|fundaci[oó]n|corporaci[oó]n|grupo|industrias?|cooperativa|compa[ñn][ií]a|inc)\b/i;
const RE_TITULO_DOC = /^(hoja de vida|curriculum vitae|curriculum|curr[ií]culo|cv|resume|resumen curricular)$/i;

const GRADOS = /(qu[ií]mic[oa]|farmac[eé]utic[oa]|regente|tecn[oó]log[oa]|t[eé]cnic[oa]|especializaci[oó]n|especialista|maestr[ií]a|mag[ií]ster|m[aá]ster|doctorado|phd|diplomado|profesional en|licenciad[oa]|ingenier[oa]|bachiller|pregrado|posgrado|administrador|auxiliar)/i;
const INSTITUCIONES = /(universidad|university|instituci[oó]n|instituto|sena|colegio|escuela|corporaci[oó]n|fundaci[oó]n|polit[eé]cnico|unad|uniatl[aá]ntico|pontificia)/i;

const IDIOMAS = ['español', 'inglés', 'ingles', 'francés', 'frances', 'portugués', 'portugues', 'alemán', 'aleman', 'italiano', 'chino', 'mandarín', 'japonés', 'coreano', 'english', 'spanish', 'french', 'portuguese', 'german'];
const RE_NIVEL = /\b(a1|a2|b1|b2|c1|c2|b[aá]sico|intermedio|avanzado|nativo|nativa|lengua materna|biling[uü]e|fluido|conversacional|native|basic|intermediate|advanced|fluent)\b/i;

function pareceNombre(linea) {
  const l = linea.trim();
  if (l.length < 5 || l.length > 60) return false;
  if (/[\d@/:|]/.test(l) || RE_TITULO_DOC.test(l) || detectarEncabezado(l)) return false;
  const palabras = l.split(/\s+/);
  if (palabras.length < 2 || palabras.length > 5) return false;
  return palabras.every((p) => /^[A-ZÁÉÍÓÚÑ][a-záéíóúñü'.-]*$|^[A-ZÁÉÍÓÚÑ'.-]{2,}$|^(de|del|la|las|los|y)$/i.test(p)
    && /[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(p));
}

/* ── Lectura principal ────────────────────────────────────── */

/**
 * Interpreta el texto de una hoja de vida.
 * @returns {{
 *   nombre, titulo, contacto: {email, telefono, linkedin, web, ciudad},
 *   secciones: Record<string, string[]>, seccionesDetectadas: string[],
 *   experiencia: Array<{cargo, empresa, inicio, fin, actual, rango, logros: string[]}>,
 *   educacion: Array<{titulo, institucion, anio}>, habilidades: string[],
 *   certificaciones: string[], idiomas: Array<{idioma, nivel}>,
 *   mesesExperiencia: number, palabras: number, lineas: string[]
 * }}
 */
export function leerHojaDeVida(texto, { hoy = new Date() } = {}) {
  const lineas = String(texto || '')
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim());
  const utiles = lineas.filter(Boolean);
  const todo = utiles.join('\n');

  // Contacto (en cualquier parte del documento)
  const email = (todo.match(RE_EMAIL) || [''])[0];
  const linkedinCrudo = (todo.match(RE_LINKEDIN) || [''])[0];
  const linkedin = linkedinCrudo ? linkedinCrudo.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '') : '';
  const webCruda = (todo.match(RE_WEB) || [''])[0];
  const web = webCruda && !/linkedin\.com/i.test(webCruda) ? webCruda : '';
  const telefono = ((todo.replace(RE_EMAIL, ' ').match(RE_TELEFONO) || [''])[0]).trim();
  const cabecera = utiles.slice(0, 14).join(' ');
  const ciudad = primeraCiudad(cabecera) || primeraCiudad(todo);

  // Nombre y título: en las primeras líneas
  let nombre = '';
  let titulo = '';
  const primeras = utiles.slice(0, 8).filter((l) => !RE_TITULO_DOC.test(l.trim()));
  const iNombre = primeras.findIndex(pareceNombre);
  if (iNombre >= 0) {
    nombre = primeras[iNombre].replace(/\s+/g, ' ');
    // Nombres en MAYÚSCULAS → «Nombre Apellido»
    if (nombre === nombre.toUpperCase()) {
      nombre = nombre.toLowerCase().replace(/(^|\s)([a-záéíóúñ])/g, (m, e, c) => e + c.toUpperCase())
        .replace(/\s(De|Del|La|Las|Los|Y)\s/g, (m) => m.toLowerCase());
    }
    const siguiente = primeras[iNombre + 1] || '';
    if (siguiente && siguiente.split(' ').length <= 9 && !RE_EMAIL.test(siguiente) && !RE_TELEFONO.test(siguiente)
      && !detectarEncabezado(siguiente) && !/\d{4}/.test(siguiente)) {
      titulo = siguiente;
    }
  }

  // Secciones
  const secciones = {};
  let actual = 'encabezado';
  secciones[actual] = [];
  for (const l of lineas) {
    const clave = l ? detectarEncabezado(l) : null;
    if (clave) {
      actual = clave;
      secciones[actual] = secciones[actual] || [];
      continue;
    }
    secciones[actual].push(l);
  }
  Object.keys(secciones).forEach((k) => {
    // Sin líneas en blanco al principio ni al final
    while (secciones[k].length && !secciones[k][0]) secciones[k].shift();
    while (secciones[k].length && !secciones[k][secciones[k].length - 1]) secciones[k].pop();
  });
  const seccionesDetectadas = Object.keys(secciones).filter((k) => k !== 'encabezado' && secciones[k].length);

  // Experiencia: bloques que arrancan con una línea de encabezado de cargo
  const experiencia = [];
  const lineasExp = secciones.experiencia || [];
  let bloque = null;
  const cerrar = () => {
    if (!bloque) return;
    const cab = bloque.cabecera.filter(Boolean);
    let cargo = '';
    let empresa = '';
    if (cab.length) {
      const partes = cab[0].split(/\s+[|·–—-]\s+|\s{2,}|,\s(?=[A-ZÁÉÍÓÚÑ])/).map((p) => p.trim()).filter(Boolean);
      cargo = partes[0] || '';
      empresa = partes.slice(1).join(' · ') || cab[1] || '';
      // Si la primera línea es la empresa y la segunda el cargo, se invierten.
      if (empresa && RE_ORGANIZACION.test(cargo) && !RE_CARGO.test(cargo) && RE_CARGO.test(empresa)) {
        [cargo, empresa] = [empresa, cargo];
      }
    }
    if (cargo || bloque.logros.length) {
      experiencia.push({
        cargo,
        empresa: empresa.replace(/\s{2,}/g, ' '),
        inicio: bloque.rango?.inicio || '',
        fin: bloque.rango?.fin || '',
        actual: Boolean(bloque.rango?.actual),
        rango: bloque.rango || null,
        logros: bloque.logros,
      });
    }
    bloque = null;
  };
  for (const l of lineasExp) {
    if (!l) continue;
    const rango = leerRango(l, hoy);
    const resto = rango ? l.replace(rango.texto, '').replace(/[|·(),\s–—-]+$/g, '').replace(/^[|·(),\s–—-]+/g, '').trim() : l;
    if (esViñeta(l)) {
      if (!bloque) bloque = { cabecera: [], logros: [], rango: null };
      bloque.logros.push(sinViñeta(l));
      continue;
    }
    // Empieza otro cargo si aparece un segundo rango de fechas, o una línea
    // corta (un nombre de cargo) después de que ya hubo logros.
    const empiezaOtro = bloque && ((rango && bloque.rango) || (bloque.logros.length > 0 && resto && !pareceLogro(resto)));
    if (!bloque || empiezaOtro) { cerrar(); bloque = { cabecera: [], logros: [], rango: null }; }
    if (rango && !bloque.rango) bloque.rango = rango;
    if (resto) {
      // Hasta dos líneas de encabezado (cargo y empresa); lo demás son logros.
      if (bloque.cabecera.length >= 2 || (bloque.cabecera.length >= 1 && pareceLogro(resto))) bloque.logros.push(resto);
      else bloque.cabecera.push(resto);
    }
  }
  cerrar();

  const mesesExperiencia = mesesDeExperiencia(experiencia.map((e) => e.rango));

  // Formación
  const educacion = [];
  let edu = null;
  for (const l of (secciones.formacion || []).filter(Boolean)) {
    const texto2 = sinViñeta(l);
    const anio = (texto2.match(/\b(19|20)\d{2}\b(?!.*\b(19|20)\d{2}\b)/) || [''])[0];
    const sinAnio = texto2.replace(RE_RANGO, '').replace(/\b(19|20)\d{2}\b/g, '').replace(/[|·(),\s–—-]+$/g, '').trim();
    const esGrado = GRADOS.test(sinAnio);
    const esInstitucion = INSTITUCIONES.test(sinAnio);
    if (esGrado && (!edu || edu.titulo)) {
      if (edu) educacion.push(edu);
      edu = { titulo: sinAnio, institucion: '', anio };
      if (esInstitucion) {
        const [t, ...i] = sinAnio.split(/\s+[|·–—-]\s+|,\s+/);
        edu.titulo = t.trim();
        edu.institucion = i.join(', ').trim();
      }
    } else if (esInstitucion) {
      if (!edu) edu = { titulo: '', institucion: '', anio: '' };
      if (!edu.institucion) edu.institucion = sinAnio;
      else { educacion.push(edu); edu = { titulo: '', institucion: sinAnio, anio: '' }; }
      if (anio && !edu.anio) edu.anio = anio;
    } else if (edu && anio && !edu.anio) {
      edu.anio = anio;
    }
  }
  if (edu) educacion.push(edu);

  // Habilidades
  const habilidades = [];
  for (const l of (secciones.habilidades || []).filter(Boolean)) {
    sinViñeta(l)
      .split(/\s*[,;|•·]\s*|\s+-\s+|\s{2,}/)
      .map((h) => h.replace(/[.:]$/, '').trim())
      .filter((h) => h.length >= 2 && h.length <= 48 && h.split(' ').length <= 6)
      .forEach((h) => { if (!habilidades.some((x) => normalizar(x) === normalizar(h))) habilidades.push(h); });
  }

  // Certificaciones
  const certificaciones = (secciones.certificaciones || [])
    .filter(Boolean)
    .map(sinViñeta)
    .filter((l) => l.length >= 4);

  // Idiomas
  const idiomas = [];
  for (const l of (secciones.idiomas || []).filter(Boolean)) {
    sinViñeta(l).split(/\s*[,;|•·]\s*/).forEach((trozo) => {
      const idioma = IDIOMAS.find((i) => normalizar(trozo).includes(normalizar(i)));
      if (!idioma) return;
      const nivel = (trozo.match(RE_NIVEL) || [''])[0];
      const nombreIdioma = idioma.charAt(0).toUpperCase() + idioma.slice(1);
      if (!idiomas.some((x) => normalizar(x.idioma) === normalizar(nombreIdioma))) {
        idiomas.push({ idioma: nombreIdioma.replace('Ingles', 'Inglés').replace('Frances', 'Francés').replace('Portugues', 'Portugués').replace('Aleman', 'Alemán'), nivel: nivel ? nivel.charAt(0).toUpperCase() + nivel.slice(1) : '' });
      }
    });
  }

  return {
    nombre,
    titulo,
    contacto: { email, telefono, linkedin, web, ciudad },
    secciones,
    seccionesDetectadas,
    experiencia,
    educacion,
    habilidades,
    certificaciones,
    idiomas,
    mesesExperiencia,
    palabras: todo.split(/\s+/).filter(Boolean).length,
    lineas: utiles,
  };
}

/**
 * Pasa lo leído al formato del creador de hoja de vida.
 * Lo que no se reconoció queda vacío para completarlo a mano.
 */
export function aHojaDelCreador(leida) {
  const perfil = (leida.secciones.perfil || []).filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  return {
    nombre: leida.nombre,
    titulo: leida.titulo,
    email: leida.contacto.email,
    telefono: leida.contacto.telefono,
    ciudad: leida.contacto.ciudad,
    linkedin: leida.contacto.linkedin,
    resumen: perfil,
    experiencia: leida.experiencia.map((e) => ({
      cargo: e.cargo,
      empresa: e.empresa,
      inicio: e.inicio,
      fin: e.actual ? '' : e.fin,
      logros: e.logros.join('\n'),
    })),
    educacion: leida.educacion.map((e) => ({ titulo: e.titulo, institucion: e.institucion, anio: e.anio })),
    habilidades: leida.habilidades.slice(0, 20),
    certificaciones: leida.certificaciones.slice(0, 12).map((c) => {
      const anio = (c.match(/\b(19|20)\d{2}\b/) || [''])[0];
      const sinAnio = c.replace(/\b(19|20)\d{2}\b/, '').replace(/[|·(),\s–—-]+$/g, '').trim();
      const [nombre, ...inst] = sinAnio.split(/\s+[|·–—-]\s+/);
      return { nombre: nombre.trim(), institucion: inst.join(' · ').trim(), anio };
    }),
    idiomas: leida.idiomas.map((i) => ({ idioma: i.idioma, nivel: i.nivel })),
    referencias: [],
  };
}
