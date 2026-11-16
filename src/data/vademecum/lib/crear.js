/**
 * ============================================================
 *  crearMonografia — arma una monografía completa a partir de sus datos
 *
 *  Las citas se escriben con claves ([FT], [CUM], [FT,MN]) y se convierten
 *  a números según el orden de `refs`: así no se desordenan al editar.
 *  Claves habituales: FT ficha técnica, CUM registros del INVIMA, MN modelo
 *  de Minnesota (Cipolle), EX experiencia farmacoterapéutica (Ramalho).
 *
 *  Cada sección recibe sus bloques tal cual (párrafos, listas, tablas y los
 *  visuales de src/components/vademecum/Visuales.jsx). La atención
 *  farmacéutica y la experiencia se arman con la estructura del modelo de
 *  Minnesota, con datos propios de cada medicamento, y cierran con los
 *  llamados a un curso y a una guía de Edvanta.
 * ============================================================
 */

const TITULOS = {
  farmacoquimica: 'Farmacoquímica',
  farmacodinamia: 'Farmacodinamia',
  farmacocinetica: 'Farmacocinética',
  indicaciones: 'Indicaciones',
  posologia: 'Posología y administración',
  'contraindicaciones-y-advertencias': 'Contraindicaciones y advertencias',
  interacciones: 'Interacciones',
  'reacciones-adversas': 'Reacciones adversas',
  'embarazo-y-lactancia': 'Embarazo y lactancia',
  evidencia: 'Evidencia clínica',
  regulacion: 'Situación regulatoria',
};
const CLAVES = {
  farmacoquimica: 'quimica', farmacodinamia: 'dinamia', farmacocinetica: 'cinetica', indicaciones: 'indicaciones',
  posologia: 'posologia', 'contraindicaciones-y-advertencias': 'contraindicaciones', interacciones: 'interacciones',
  'reacciones-adversas': 'adversas', 'embarazo-y-lactancia': 'embarazo', evidencia: 'evidencia', regulacion: 'regulacion',
};

const RE_CLAVE = /\[([A-Z][A-Z0-9]*(?:\s*,\s*[A-Z][A-Z0-9]*)*)\]/g;

/** Recorre cualquier estructura y reemplaza las claves de cita por números. */
function numerar(valor, indice) {
  if (typeof valor === 'string') {
    return valor.replace(RE_CLAVE, (m, grupo) => {
      const nums = grupo.split(',').map((c) => {
        const n = indice[c.trim()];
        if (!n) throw new Error(`Cita sin referencia: ${c.trim()} en «${valor.slice(0, 60)}»`);
        return n;
      });
      return `[${[...new Set(nums)].sort((a, b) => a - b).join(',')}]`;
    });
  }
  if (Array.isArray(valor)) return valor.map((v) => numerar(v, indice));
  if (valor && typeof valor === 'object') return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, k === 'url' ? v : numerar(v, indice)]));
  return valor;
}

export function crearMonografia(m) {
  const claves = Object.keys(m.refs);
  const indice = Object.fromEntries(claves.map((c, i) => [c, i + 1]));

  const secciones = Object.keys(TITULOS).map((id) => ({ id, titulo: TITULOS[id], bloques: m[CLAVES[id]] }));

  const a = m.atencion;
  secciones.push({
    id: 'atencion-farmaceutica',
    titulo: 'Atención farmacéutica (modelo de Minnesota)',
    destacado: true,
    bloques: [
      ...[].concat(a.intro),
      { subtitulo: '1. Valoración de las necesidades' },
      { tabla: { columnas: ['Necesidad', 'Qué revisar'], filas: a.necesidades } },
      { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
      { tabla: { columnas: ['Categoría', 'Situación típica', 'Intervención'], filas: a.prf } },
      { subtitulo: '3. Plan de cuidado y seguimiento' },
      ...(a.ciclo ? [{ ciclo: a.ciclo }] : []),
      { lista: a.plan },
      ...(m.ofertas || []).map((cta) => ({ cta })),
    ],
  });

  const e = m.experiencia;
  secciones.push({
    id: 'experiencia-farmacoterapeutica',
    titulo: 'Experiencia farmacoterapéutica',
    destacado: true,
    bloques: [
      ...[].concat(e.intro),
      ...(e.explorar ? [{ subtitulo: 'Lo que conviene explorar' }, { lista: e.explorar }] : []),
      { subtitulo: 'Preguntas para la entrevista' },
      { lista: e.preguntas },
      ...(e.quiz ? [{ quiz: e.quiz }] : []),
    ],
  });

  const pagina = {
    tipo: 'medicamento',
    slug: m.slug,
    nombre: m.nombre,
    titulo: m.titulo || `${m.nombre}: farmacología y atención farmacéutica`,
    grupo: m.grupo,
    clase: m.clase,
    atc: m.atc,
    marcas: m.marcas || [m.nombre],
    vias: m.vias,
    mecanismo: m.mecanismo,
    actualizado: m.actualizado || '2026-11-16',
    resumenCorto: m.resumenCorto,
    resumen: m.resumen,
    datosClave: m.datosClave,
    secciones,
    referencias: claves.map((c) => m.refs[c]),
    enlaces: m.enlaces,
    seo: m.seo,
  };
  return numerar(pagina, indice);
}

/** Atajos para escribir bloques. */
export const T = (columnas, filas) => ({ tabla: { columnas, filas } });
export const L = (lista) => ({ lista });
export const S = (subtitulo) => ({ subtitulo });
export const N = (nota) => ({ nota });
