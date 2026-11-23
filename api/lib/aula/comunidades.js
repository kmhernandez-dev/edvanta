/**
 * ============================================================
 *  comunidades.js — Inscripción y encuesta de los grupos de apoyo
 *
 *  POST /api/aula/comunidades/:slug/inscripcion (público) llega aquí.
 *  El panel del aula lee la lista, el resumen de la encuesta y el CSV.
 *
 *  Las listas de identificadores son una copia de
 *  src/data/encuestaComunidades.js y src/data/comunidadesSalud.js (la
 *  imagen de la API solo lleva la carpeta api/); la prueba
 *  src/__tests__/encuesta-comunidades.test.js revisa que coincidan.
 *
 *  Datos sensibles (Ley 1581 de 2012): el tiempo con el diagnóstico,
 *  las dificultades y la pregunta libre solo se guardan si la persona
 *  autoriza de forma expresa el tratamiento de datos sensibles. Sin esa
 *  casilla se descartan aquí, y la base de datos tampoco los acepta.
 *  El aviso por correo a administración no lleva datos de salud.
 * ============================================================
 */

import { badRequest, bool, email, notFound, oneOf, str, strList } from './http.js';
import { audit } from './audit.js';

/** slug → forma corta («grupo de apoyo de …»). Copia de `apoyo.corto`. */
export const GRUPOS = {
  tiroides: 'tiroides',
  'hipertension-arterial': 'hipertensión',
  'diabetes-tipo-2': 'diabetes tipo 2',
  'colesterol-alto': 'colesterol alto',
  'insuficiencia-cardiaca': 'insuficiencia cardíaca',
  asma: 'asma',
  epoc: 'EPOC',
  obesidad: 'obesidad',
  'higado-graso': 'hígado graso',
  'gastritis-y-reflujo': 'gastritis y reflujo',
  'colon-irritable': 'colon irritable',
  estrenimiento: 'estreñimiento',
  'infeccion-urinaria': 'infección urinaria',
  'artrosis-y-dolor-cronico': 'dolor crónico y artrosis',
  migrana: 'migraña',
  'ansiedad-e-insomnio': 'ansiedad e insomnio',
  'gota-y-acido-urico': 'gota y ácido úrico',
  'enfermedad-renal-cronica': 'enfermedad renal crónica',
  'fibrilacion-auricular': 'fibrilación auricular',
  'salud-mental': 'depresión y ansiedad',
  'piel-y-dermatologia': 'acné y dermatitis atópica',
  'osteoporosis-y-menopausia': 'menopausia y osteoporosis',
  'calculos-renales': 'cálculos renales',
};

/**
 * slug → enlace de invitación del grupo de WhatsApp, solo para los grupos
 * que ya tienen uno. Copia de `grupoWhatsapp` en src/data/comunidadesSalud.js.
 * El enlace se entrega después de inscribirse: en el espacio del grupo y en
 * el correo de bienvenida. Los grupos sin enlace siguen entrando por el
 * WhatsApp de Karla.
 */
export const GRUPOS_WHATSAPP = {
  tiroides: 'https://chat.whatsapp.com/EBk67w0Xy88FFWpZVmmdJf',
  'diabetes-tipo-2': 'https://chat.whatsapp.com/FSdupEkOaqf1IpViuxbTf0',
};

export const ROLES = ['paciente', 'cuidador', 'en-estudio', 'profesional', 'otro'];
export const TIEMPOS = ['menos-1', '1-5', 'mas-5', 'sin'];
export const INTERESES = ['experiencias', 'medicamentos', 'alimentacion', 'consultas', 'emocional', 'guias', 'cursos', 'en-vivo'];
export const FORMATOS = ['whatsapp', 'videos', 'articulos', 'en-vivo'];
export const ESTADOS = ['nueva', 'en_grupo', 'baja'];
export const MAX_DIFICULTADES = 3;

const ID_OPCION = /^[a-z0-9-]{1,40}$/;
const TELEFONO = /^[+\d\s().-]{7,40}$/;

const utm = (v) => {
  if (v === undefined || v === null) return null;
  const limpio = String(v).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  return limpio || null;
};

export const grupoDeSlug = (slug) => (Object.hasOwn(GRUPOS, slug) ? slug : null);

/** Valida y limpia lo que manda el formulario. Lanza 400 con el campo. */
export function leerInscripcion(slug, body = {}) {
  const comunidad = grupoDeSlug(String(slug || ''));
  if (!comunidad) throw notFound('Este grupo de apoyo no existe.');

  if (body.aceptaTratamiento !== true) {
    throw badRequest('Para inscribirte necesitamos tu autorización para usar estos datos.', { field: 'aceptaTratamiento' });
  }

  const whatsapp = str(body.whatsapp, 'whatsapp', 'El WhatsApp', { optional: true, max: 40 });
  if (whatsapp && !TELEFONO.test(whatsapp)) {
    throw badRequest('El WhatsApp solo puede tener números, espacios y el signo +.', { field: 'whatsapp' });
  }

  const intereses = strList(body.intereses, 'intereses', 'Lo que te gustaría encontrar', { maxItems: INTERESES.length, maxLength: 40 });
  for (const i of intereses) {
    if (!INTERESES.includes(i)) throw badRequest('Una de las opciones de interés no es válida. Recarga la página.', { field: 'intereses' });
  }

  const sensibles = bool(body.aceptaDatosSensibles, 'aceptaDatosSensibles', 'La autorización de datos sensibles', { optional: true, fallback: false });
  let tiempo = null;
  let dificultades = [];
  let pregunta = null;
  if (sensibles) {
    tiempo = oneOf(body.tiempo, 'tiempo', 'El tiempo con el diagnóstico', TIEMPOS, { optional: true }) || null;
    dificultades = [...new Set(strList(body.dificultades, 'dificultades', 'Lo que más te cuesta', { maxItems: MAX_DIFICULTADES, maxLength: 40 }))];
    for (const d of dificultades) {
      if (!ID_OPCION.test(d)) throw badRequest('Una de las dificultades no es válida. Recarga la página.', { field: 'dificultades' });
    }
    pregunta = str(body.pregunta, 'pregunta', 'Tu pregunta', { optional: true, max: 500 }) || null;
  }

  return {
    comunidad,
    nombre: str(body.nombre, 'nombre', 'Tu nombre', { max: 120 }),
    correo: email(body.correo, 'correo', 'El correo').toLowerCase(),
    whatsapp: whatsapp || null,
    pais: str(body.pais, 'pais', 'El país', { optional: true, max: 80 }) || null,
    ciudad: str(body.ciudad, 'ciudad', 'La ciudad', { optional: true, max: 80 }) || null,
    rol: oneOf(body.rol, 'rol', 'Quién eres', ROLES),
    tiempo,
    dificultades,
    intereses: [...new Set(intereses)],
    formato: oneOf(body.formato, 'formato', 'Cómo prefieres aprender', FORMATOS, { optional: true }) || null,
    pregunta,
    aceptaDatosSensibles: sensibles,
    aceptaNovedades: bool(body.aceptaNovedades, 'aceptaNovedades', 'La autorización de novedades', { optional: true, fallback: false }),
    origen: str(body.origen, 'origen', 'La página de origen', { optional: true, max: 255 }) || null,
    utmSource: utm(body.utmSource),
    utmMedium: utm(body.utmMedium),
    utmCampaign: utm(body.utmCampaign),
    utmContent: utm(body.utmContent),
  };
}

const aFila = (r) => ({
  id: Number(r.id),
  comunidad: r.comunidad,
  grupo: GRUPOS[r.comunidad] || r.comunidad,
  nombre: r.nombre,
  correo: r.correo,
  whatsapp: r.whatsapp,
  pais: r.pais,
  ciudad: r.ciudad,
  rol: r.rol,
  tiempo: r.tiempo,
  dificultades: r.dificultades || [],
  intereses: r.intereses || [],
  formato: r.formato,
  pregunta: r.pregunta,
  aceptaDatosSensibles: r.acepta_datos_sensibles,
  aceptaNovedades: r.acepta_novedades,
  origen: r.origen,
  utm: { source: r.utm_source, medium: r.utm_medium, campaign: r.utm_campaign, content: r.utm_content },
  estado: r.estado,
  notaInterna: r.nota_interna,
  veces: Number(r.veces),
  fecha: r.created_at,
  actualizada: r.updated_at,
});

/**
 * Guarda la inscripción. Si la persona ya estaba en ese grupo, se
 * actualizan sus respuestas (no se duplica) y se suma una vez más.
 * Si ya no autoriza datos sensibles, los anteriores se borran.
 */
export async function guardarInscripcion(db, s) {
  const { rows } = await db.query(
    `INSERT INTO comunidad_inscripciones
       (comunidad, nombre, correo, whatsapp, pais, ciudad, rol, tiempo, dificultades, intereses,
        formato, pregunta, acepta_tratamiento, acepta_datos_sensibles, acepta_novedades, origen,
        utm_source, utm_medium, utm_campaign, utm_content)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, TRUE, $13, $14, $15, $16, $17, $18, $19)
     ON CONFLICT (comunidad, correo) DO UPDATE SET
       nombre = EXCLUDED.nombre,
       whatsapp = COALESCE(EXCLUDED.whatsapp, comunidad_inscripciones.whatsapp),
       pais = COALESCE(EXCLUDED.pais, comunidad_inscripciones.pais),
       ciudad = COALESCE(EXCLUDED.ciudad, comunidad_inscripciones.ciudad),
       rol = EXCLUDED.rol,
       tiempo = EXCLUDED.tiempo,
       dificultades = EXCLUDED.dificultades,
       intereses = EXCLUDED.intereses,
       formato = EXCLUDED.formato,
       pregunta = EXCLUDED.pregunta,
       acepta_datos_sensibles = EXCLUDED.acepta_datos_sensibles,
       acepta_novedades = EXCLUDED.acepta_novedades,
       origen = EXCLUDED.origen,
       estado = CASE WHEN comunidad_inscripciones.estado = 'baja' THEN 'nueva' ELSE comunidad_inscripciones.estado END,
       veces = comunidad_inscripciones.veces + 1,
       updated_at = NOW()
     RETURNING *, (xmax = 0) AS nueva`,
    [
      s.comunidad, s.nombre, s.correo, s.whatsapp, s.pais, s.ciudad, s.rol, s.tiempo, s.dificultades,
      s.intereses, s.formato, s.pregunta, s.aceptaDatosSensibles, s.aceptaNovedades, s.origen,
      s.utmSource, s.utmMedium, s.utmCampaign, s.utmContent,
    ],
  );
  return { ...aFila(rows[0]), primeraVez: Boolean(rows[0].nueva) };
}

export async function listarInscripciones(db, { comunidad, estado, pagina = 1, tamano = 30 } = {}) {
  const filtros = [];
  const params = [];
  if (comunidad && grupoDeSlug(comunidad)) { params.push(comunidad); filtros.push(`comunidad = $${params.length}`); }
  const where = (extra) => {
    const f = [...filtros, ...(extra ? [extra] : [])];
    return f.length ? `WHERE ${f.join(' AND ')}` : '';
  };
  const porEstado = {};
  const { rows: cuentas } = await db.query(
    `SELECT estado, COUNT(*)::int AS n FROM comunidad_inscripciones ${where()} GROUP BY estado`,
    params,
  );
  for (const c of cuentas) porEstado[c.estado] = c.n;

  const p = [...params];
  let filtroEstado = null;
  if (estado && ESTADOS.includes(estado)) { p.push(estado); filtroEstado = `estado = $${p.length}`; }
  p.push(tamano + 1, (Math.max(1, pagina) - 1) * tamano);
  const { rows } = await db.query(
    `SELECT * FROM comunidad_inscripciones ${where(filtroEstado)}
      ORDER BY created_at DESC, id DESC LIMIT $${p.length - 1} OFFSET $${p.length}`,
    p,
  );
  return {
    inscripciones: rows.slice(0, tamano).map(aFila),
    hayMas: rows.length > tamano,
    porEstado,
  };
}

/**
 * Resumen de la encuesta: cuántas personas por grupo y, del grupo
 * elegido (o de todos), quién llega, qué les cuesta y qué quieren.
 */
export async function resumenDeComunidades(db, { comunidad } = {}) {
  const { rows: porGrupo } = await db.query(
    `SELECT comunidad, COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int AS semana
       FROM comunidad_inscripciones WHERE estado <> 'baja' GROUP BY comunidad ORDER BY total DESC`,
  );
  const params = [];
  let where = "WHERE estado <> 'baja'";
  if (comunidad && grupoDeSlug(comunidad)) { params.push(comunidad); where += ` AND comunidad = $${params.length}`; }
  const { rows } = await db.query(
    `SELECT rol, tiempo, dificultades, intereses, formato, acepta_novedades, acepta_datos_sensibles, whatsapp
       FROM comunidad_inscripciones ${where}`,
    params,
  );
  const contar = (mapa, k) => { if (k) mapa[k] = (mapa[k] || 0) + 1; };
  const r = {
    total: rows.length, rol: {}, tiempo: {}, dificultades: {}, intereses: {}, formato: {},
    novedades: 0, sensibles: 0, conWhatsapp: 0,
  };
  for (const x of rows) {
    contar(r.rol, x.rol);
    contar(r.tiempo, x.tiempo);
    contar(r.formato, x.formato);
    for (const d of x.dificultades || []) contar(r.dificultades, d);
    for (const i of x.intereses || []) contar(r.intereses, i);
    if (x.acepta_novedades) r.novedades += 1;
    if (x.acepta_datos_sensibles) r.sensibles += 1;
    if (x.whatsapp) r.conWhatsapp += 1;
  }
  return {
    porGrupo: porGrupo.map((g) => ({ comunidad: g.comunidad, grupo: GRUPOS[g.comunidad] || g.comunidad, total: g.total, semana: g.semana })),
    resumen: r,
  };
}

export async function actualizarInscripcion(db, id, { estado, notaInterna }, { actor, ip } = {}) {
  const cambios = [];
  const params = [id];
  if (estado !== undefined) {
    params.push(oneOf(estado, 'estado', 'El estado', ESTADOS));
    cambios.push(`estado = $${params.length}`);
  }
  if (notaInterna !== undefined) {
    params.push(str(notaInterna, 'notaInterna', 'La nota', { optional: true, max: 2000 }) || null);
    cambios.push(`nota_interna = $${params.length}`);
  }
  if (!cambios.length) throw badRequest('No hay nada que cambiar.');
  const { rows } = await db.query(
    `UPDATE comunidad_inscripciones SET ${cambios.join(', ')}, updated_at = NOW() WHERE id = $1 RETURNING *`,
    params,
  );
  if (!rows.length) throw notFound('No encontramos esa inscripción.');
  await audit(db, {
    actor,
    action: 'comunidad.inscripcion.actualizar',
    entityType: 'comunidad_inscripcion',
    entityId: id,
    summary: `Inscripción del grupo de ${GRUPOS[rows[0].comunidad] || rows[0].comunidad}: ${rows[0].estado}`,
    after: { estado: rows[0].estado },
    ip,
  });
  return aFila(rows[0]);
}

const celda = (v) => {
  const t = Array.isArray(v) ? v.join(' | ') : (v === null || v === undefined ? '' : String(v));
  // Evita fórmulas al abrir en Excel.
  const seguro = /^[=+\-@]/.test(t) ? `'${t}` : t;
  return /[",\n;]/.test(seguro) ? `"${seguro.replace(/"/g, '""')}"` : seguro;
};

export async function inscripcionesCsv(db, { comunidad } = {}) {
  const params = [];
  let where = '';
  if (comunidad && grupoDeSlug(comunidad)) { params.push(comunidad); where = 'WHERE comunidad = $1'; }
  const { rows } = await db.query(`SELECT * FROM comunidad_inscripciones ${where} ORDER BY created_at DESC, id DESC`, params);
  const cols = [
    ['Fecha', (r) => new Date(r.created_at).toISOString()],
    ['Grupo', (r) => GRUPOS[r.comunidad] || r.comunidad],
    ['Nombre', (r) => r.nombre],
    ['Correo', (r) => r.correo],
    ['WhatsApp', (r) => r.whatsapp],
    ['País', (r) => r.pais],
    ['Ciudad', (r) => r.ciudad],
    ['Rol', (r) => r.rol],
    ['Tiempo con el diagnóstico', (r) => r.tiempo],
    ['Dificultades', (r) => r.dificultades],
    ['Intereses', (r) => r.intereses],
    ['Formato', (r) => r.formato],
    ['Pregunta', (r) => r.pregunta],
    ['Autoriza datos sensibles', (r) => (r.acepta_datos_sensibles ? 'sí' : 'no')],
    ['Acepta novedades', (r) => (r.acepta_novedades ? 'sí' : 'no')],
    ['Estado', (r) => r.estado],
    ['Veces', (r) => r.veces],
    ['Origen', (r) => r.origen],
    ['utm_source', (r) => r.utm_source],
    ['utm_campaign', (r) => r.utm_campaign],
  ];
  return [cols.map(([h]) => h).join(','), ...rows.map((r) => cols.map(([, f]) => celda(f(r))).join(','))].join('\r\n');
}

/** Aviso a administración: sin datos de salud, solo que llegó alguien y a qué grupo. */
export function avisoDeInscripcion(i, siteUrl) {
  const sitio = String(siteUrl || 'https://edvanta.co').replace(/\/+$/, '');
  const grupo = GRUPOS[i.comunidad] || i.comunidad;
  return {
    subject: `Nueva inscripción en el grupo de apoyo de ${grupo}`,
    text: [
      `${i.nombre} se inscribió en el grupo de apoyo de ${grupo}.`,
      i.whatsapp ? `WhatsApp: ${i.whatsapp}` : 'Sin WhatsApp: respóndele por correo.',
      `Correo: ${i.correo}`,
      '',
      `Sus respuestas están en el panel: ${sitio}/aula/admin/comunidades`,
    ].join('\n'),
  };
}
