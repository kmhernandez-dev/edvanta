/**
 * ============================================================
 *  lib/cv/diagnostico.js — Diagnóstico completo de una hoja de vida
 *
 *  Recibe la hoja de vida ya interpretada (lector.js) y, si vino de
 *  un PDF, lo que se sabe del archivo (pdfText.js). Devuelve:
 *
 *   · puntaje 0-100 repartido en seis categorías con su máximo
 *   · lo que se detectó (para que la persona confirme la lectura)
 *   · hallazgos con qué pasa, por qué importa y cómo corregirlo
 *   · prioridades ordenadas por los puntos que se recuperan
 *   · palabras clave del cargo encontradas y faltantes
 *   · reescritura sugerida de las frases débiles
 *
 *  Todo es local y determinista: no se envía nada a terceros.
 * ============================================================
 */

import { cargosEmpleo, keywordsTransversales } from '../../data/empleo/cargos.js';
import { normalizar } from './lector.js';

export const CATEGORIAS = [
  { id: 'estructura', nombre: 'Estructura', max: 20, que: 'Secciones que los filtros buscan por su nombre' },
  { id: 'contacto', nombre: 'Contacto', max: 10, que: 'Correo, teléfono, LinkedIn y ciudad' },
  { id: 'logros', nombre: 'Logros', max: 25, que: 'Resultados con cifras y verbos de acción' },
  { id: 'palabras', nombre: 'Palabras clave', max: 25, que: 'Términos del cargo y del sector' },
  { id: 'formato', nombre: 'Formato ATS', max: 15, que: 'Que una máquina lo pueda leer en orden' },
  { id: 'redaccion', nombre: 'Redacción', max: 5, que: 'Tono profesional y sin datos sensibles' },
];

/* ── Detectores ───────────────────────────────────────────── */

const RE_CIFRA = /\d|%|millones|\bmil\b|\$/i;

const IRREGULARES = new Set([
  'reduje', 'hice', 'obtuve', 'mantuve', 'conduje', 'produje', 'introduje', 'traduje', 'dirigi', 'construi',
  'contribui', 'distribui', 'atendi', 'aprendi', 'escribi', 'resolvi', 'cumpli', 'asumi', 'promovi', 'puse',
  'propuse', 'dispuse', 'compuse', 'elegi', 'corregi', 'recibi', 'diseñe', 'abri',
]);

/** ¿La frase empieza con un verbo de acción en pasado (Implementé, Reduje…)? */
export function empiezaConVerbo(frase) {
  const primera = String(frase || '').trim().split(/\s+/)[0] || '';
  const limpia = primera.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g, '');
  if (limpia.length < 4) return false;
  if (/[éÉ]$/.test(limpia)) return true; // lideré, implementé, gestioné
  if (/[íÍ]$/.test(limpia) && limpia.length >= 5) return true; // dirigí, construí
  return IRREGULARES.has(normalizar(limpia));
}

// El grupo 1 es la preposición: «del» y «al» esconden el artículo «el»,
// que se devuelve para que la frase siga sonando natural.
const DEBILES = [
  { re: /^(?:fui\s+|era\s+)?responsables?\s+(del|de)\s+/i, verbo: 'Lideré' },
  { re: /^(?:me\s+encargaba|encargad[oa]s?)\s+(del|de)\s+/i, verbo: 'Gestioné' },
  { re: /^(?:apoyo|apoy[ée]|apoyaba|apoyar)\s+(en|al|a)\s+/i, verbo: 'Contribuí a' },
  { re: /^(?:colabor[ée]|colaboraba|colaborar|colaboraci[oó]n)\s+(en|con)\s+/i, verbo: 'Contribuí a' },
  { re: /^(?:particip[ée]|participaba|participar|participaci[oó]n)\s+(en)\s+/i, verbo: 'Participé en' },
  { re: /^(?:realizaba|realizar|realizaci[oó]n\s+de)\s+/i, verbo: 'Realicé' },
  { re: /^(?:manejo\s+de|manejaba|manejar)\s+/i, verbo: 'Administré' },
  { re: /^(?:elaboraci[oó]n\s+de|elaboraba|elaborar)\s+/i, verbo: 'Elaboré' },
  { re: /^(?:control\s+de|controlaba|controlar)\s+/i, verbo: 'Controlé' },
  { re: /^(?:seguimiento\s+(?:a|de)|hacía\s+seguimiento\s+a)\s+/i, verbo: 'Hice seguimiento a' },
];

/** Une verbo y complemento corrigiendo «a el» → «al». */
function unir(verbo, resto) {
  if (/\sa$/.test(verbo) && /^el\s/i.test(resto)) return `${verbo}l ${resto.slice(3)}`;
  return `${verbo} ${resto}`;
}

/** Propone una versión con verbo de acción y hueco para el resultado. */
export function reescribir(frase) {
  const original = String(frase || '').trim();
  for (const { re, verbo } of DEBILES) {
    const m = original.match(re);
    if (!m) continue;
    let resto = original.slice(m[0].length).replace(/\.$/, '');
    const prep = (m[1] || '').toLowerCase();
    if (prep === 'del' || prep === 'al') resto = `el ${resto}`;
    resto = resto.charAt(0).toLowerCase() + resto.slice(1);
    const cifra = RE_CIFRA.test(original);
    return `${unir(verbo, resto)}${cifra ? '.' : ', logrando [resultado medible: %, tiempo o cantidad].'}`;
  }
  return null;
}

const DATOS_SENSIBLES = [
  { re: /\b(c[ée]dula|c\.\s?c\.|documento de identidad|n[uú]mero de identificaci[oó]n)\b|\bcc\s*[:.]?\s*\d/i, que: 'número de cédula' },
  { re: /fecha de nacimiento|lugar de nacimiento|\bnacid[oa] el\b/i, que: 'fecha o lugar de nacimiento' },
  { re: /\bedad\s*[:.]?\s*\d{2}|\b\d{2}\s+años de edad\b/i, que: 'edad' },
  { re: /estado civil|\b(solter[oa]|casad[oa]|uni[oó]n libre|divorciad[oa])\b/i, que: 'estado civil' },
  { re: /libreta militar/i, que: 'libreta militar' },
  { re: /\breligi[oó]n\b/i, que: 'religión' },
  { re: /tipo de sangre|\brh\s*[:.]?\s*[abo]{1,2}\s*[+-]/i, que: 'tipo de sangre' },
  { re: /\bnacionalidad\b/i, que: 'nacionalidad' },
];

const RE_PRIMERA_PERSONA = /\b(yo|mi|mis|me|conmigo)\b/i;

/* ── Diagnóstico ──────────────────────────────────────────── */

const VACIAS = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'en', 'y', 'o', 'con', 'para', 'profesional', 'farmacia']);
const tokens = (s) => normalizar(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !VACIAS.has(w));

/**
 * Cargo más probable. Cuenta los términos del cargo que aparecen en el
 * texto y suma 3 puntos por cada palabra del nombre del cargo que esté
 * en los títulos reales de la persona (su título y los cargos que tuvo).
 */
export function detectarCargo(texto, titulos = []) {
  const t = normalizar(texto);
  const enTitulos = new Set(titulos.flatMap(tokens));
  let mejor = null;
  let mejorPts = 0;
  cargosEmpleo.forEach((c) => {
    const pts = c.palabras.filter((k) => t.includes(normalizar(k))).length
      + tokens(c.cargo).filter((w) => enTitulos.has(w)).length * 3;
    if (pts > mejorPts) { mejorPts = pts; mejor = c; }
  });
  return mejorPts > 0 ? mejor : null;
}

/**
 * @param {ReturnType<import('./lector.js').leerHojaDeVida>} leida
 * @param {object|null} meta  lo que devuelve leerPdf (null si el texto se pegó)
 * @param {string} cargoSlug  cargo elegido; vacío para detectarlo
 */
export function diagnosticar(leida, meta = null, cargoSlug = '') {
  const texto = leida.lineas.join('\n');
  const t = normalizar(texto);
  const elegido = cargoSlug ? cargosEmpleo.find((c) => c.slug === cargoSlug) : null;
  const cargo = elegido || detectarCargo(texto, [leida.titulo, ...leida.experiencia.map((e) => e.cargo)]);
  const hallazgos = [];
  const puntos = {};
  const agregar = (h) => hallazgos.push({ impacto: 0, ...h });

  const secc = new Set(leida.seccionesDetectadas);
  const tienePerfil = secc.has('perfil') || (leida.secciones.encabezado || []).join(' ').split(/\s+/).length > 45;

  /* 1. Estructura */
  {
    let p = 0;
    const faltan = [];
    if (tienePerfil) p += 5; else faltan.push({ n: 'Perfil profesional', pts: 5 });
    if (secc.has('experiencia')) p += 6; else faltan.push({ n: 'Experiencia', pts: 6 });
    if (secc.has('formacion')) p += 4; else faltan.push({ n: 'Formación', pts: 4 });
    if (secc.has('habilidades')) p += 3; else faltan.push({ n: 'Habilidades', pts: 3 });
    if (secc.has('idiomas')) p += 2; else faltan.push({ n: 'Idiomas', pts: 2 });
    puntos.estructura = p;
    if (!faltan.length) {
      agregar({ tipo: 'ok', categoria: 'estructura', titulo: 'Secciones completas', detalle: 'Perfil, experiencia, formación, habilidades e idiomas están con encabezados que los filtros reconocen.' });
    } else {
      agregar({
        tipo: faltan.some((f) => f.pts >= 4) ? 'error' : 'warn',
        categoria: 'estructura',
        titulo: `Falta ${faltan.length === 1 ? 'la sección' : 'secciones'}: ${faltan.map((f) => f.n).join(', ')}`,
        detalle: 'Los sistemas de selección ubican tu información por el nombre de la sección. Si no la encuentran, para ellos no existe.',
        como: `Agrega los encabezados con su nombre estándar: ${faltan.map((f) => `«${f.n}»`).join(', ')}. Evita títulos creativos como «Mi camino» o «Lo que sé hacer».`,
        impacto: faltan.reduce((s, f) => s + f.pts, 0),
      });
    }
  }

  /* 2. Contacto */
  {
    const c = leida.contacto;
    let p = 0;
    const faltan = [];
    if (c.email) p += 4; else faltan.push({ n: 'correo', pts: 4 });
    if (c.telefono) p += 3; else faltan.push({ n: 'teléfono', pts: 3 });
    if (c.linkedin) p += 2; else faltan.push({ n: 'LinkedIn', pts: 2 });
    if (c.ciudad) p += 1; else faltan.push({ n: 'ciudad', pts: 1 });
    puntos.contacto = p;
    if (!faltan.length) {
      agregar({ tipo: 'ok', categoria: 'contacto', titulo: 'Datos de contacto completos', detalle: 'Correo, teléfono, LinkedIn y ciudad a la vista.' });
    } else {
      const graves = faltan.filter((f) => f.pts >= 3);
      agregar({
        tipo: graves.length ? 'error' : 'warn',
        categoria: 'contacto',
        titulo: `No encontramos: ${faltan.map((f) => f.n).join(', ')}`,
        detalle: graves.length
          ? 'Sin correo o teléfono legibles, el reclutador no tiene cómo llamarte aunque tu perfil encaje.'
          : 'El perfil de LinkedIn y la ciudad suman: los reclutadores los consultan antes de llamar.',
        como: 'Pon los datos en texto normal en el encabezado, no dentro de una imagen ni en el pie de página: +57 300 000 0000 · nombre@correo.com · linkedin.com/in/tu-perfil · Ciudad.',
        impacto: faltan.reduce((s, f) => s + f.pts, 0),
      });
    }
  }

  /* 3. Logros */
  const logros = leida.experiencia.flatMap((e) => e.logros);
  const reescrituras = [];
  {
    let p = 0;
    if (!leida.experiencia.length) {
      agregar({
        tipo: 'error',
        categoria: 'logros',
        titulo: 'No identificamos cargos con logros',
        detalle: 'Sin experiencia legible (cargo, empresa, fechas y logros) el filtro no puede medir tu trayectoria.',
        como: 'Por cada cargo: nombre del cargo, empresa, mes y año de inicio y fin, y de 2 a 4 logros en viñetas.',
        impacto: 25,
      });
    } else if (!logros.length) {
      p = 3;
      agregar({
        tipo: 'error',
        categoria: 'logros',
        titulo: 'Tus cargos no tienen logros',
        detalle: `Encontramos ${leida.experiencia.length} ${leida.experiencia.length === 1 ? 'cargo' : 'cargos'} pero sin viñetas de lo que lograste. La preselección con IA ordena a los candidatos por resultados.`,
        como: 'Escribe 2 a 4 viñetas por cargo con la fórmula Acción + Resultado: «Reduje 30 % el tiempo de liberación de lotes implementando un plan de muestreo».',
        impacto: 22,
      });
    } else {
      const conCifra = logros.filter((l) => RE_CIFRA.test(l)).length;
      const conVerbo = logros.filter(empiezaConVerbo).length;
      const debiles = logros.filter((l) => DEBILES.some((d) => d.re.test(l)));
      p = Math.min(7, Math.round(logros.length * 1.2))
        + Math.min(10, Math.round((conCifra / logros.length) * 14))
        + Math.min(8, Math.round((conVerbo / logros.length) * 11));
      const ratioCifra = conCifra / logros.length;
      if (ratioCifra >= 0.5) {
        agregar({ tipo: 'ok', categoria: 'logros', titulo: 'Logros con cifras', detalle: `${conCifra} de ${logros.length} logros tienen un dato concreto. Así se ve el impacto de tu trabajo.` });
      } else {
        agregar({
          tipo: ratioCifra === 0 ? 'error' : 'warn',
          categoria: 'logros',
          titulo: `Solo ${conCifra} de ${logros.length} logros tienen un dato`,
          detalle: 'Un logro sin número se lee como una función. Las cifras son lo que diferencia tu hoja de vida de las demás del mismo cargo.',
          como: 'Agrega porcentaje, tiempo, cantidad o dinero: «Cerré 18 desviaciones en menos de 30 días cada una», «Atendí 120 pacientes al mes».',
          impacto: 10 - Math.min(10, Math.round(ratioCifra * 14)),
        });
      }
      if (conVerbo / logros.length < 0.5) {
        agregar({
          tipo: 'warn',
          categoria: 'logros',
          titulo: 'Pocos logros empiezan con un verbo de acción',
          detalle: 'Frases como «Responsable de…» o «Apoyo en…» describen tareas, no resultados.',
          como: 'Empieza cada viñeta con un verbo en pasado: Implementé, Reduje, Lideré, Validé, Coordiné, Optimicé.',
          impacto: 8 - Math.min(8, Math.round((conVerbo / logros.length) * 11)),
        });
      }
      debiles.slice(0, 5).forEach((l) => {
        const sugerencia = reescribir(l);
        if (sugerencia) reescrituras.push({ original: l, sugerencia });
      });
    }
    puntos.logros = Math.min(25, p);
  }

  /* 4. Palabras clave */
  let encontradas = [];
  let faltantes = [];
  {
    const trans = keywordsTransversales.filter((k) => t.includes(normalizar(k)));
    let p;
    if (cargo) {
      encontradas = cargo.palabras.filter((k) => t.includes(normalizar(k)));
      faltantes = cargo.palabras.filter((k) => !t.includes(normalizar(k)));
      const meta10 = Math.min(10, cargo.palabras.length);
      p = Math.min(20, Math.round((encontradas.length / meta10) * 20)) + Math.min(5, trans.length);
      const ratio = encontradas.length / meta10;
      if (ratio >= 0.7) {
        agregar({ tipo: 'ok', categoria: 'palabras', titulo: `Buen vocabulario para ${cargo.cargo}`, detalle: `Aparecen ${encontradas.length} términos del cargo: ${encontradas.slice(0, 6).join(', ')}.` });
      } else {
        agregar({
          tipo: ratio < 0.35 ? 'error' : 'warn',
          categoria: 'palabras',
          titulo: `Faltan términos clave de ${cargo.cargo}`,
          detalle: `Encontramos ${encontradas.length} de los términos que suelen pedir estas vacantes. El filtro compara tu texto con el anuncio palabra por palabra.`,
          como: `Incluye, solo si los manejas, términos como: ${faltantes.slice(0, 6).join(', ')}. Ponlos en el perfil y en los logros, tal como aparecen en la oferta.`,
          impacto: 20 - Math.min(20, Math.round(ratio * 20)),
        });
      }
    } else {
      encontradas = trans;
      p = Math.min(25, trans.length * 3);
      agregar({
        tipo: trans.length >= 5 ? 'info' : 'warn',
        categoria: 'palabras',
        titulo: 'Elige el cargo al que te postulas',
        detalle: 'No identificamos un cargo del sector en el texto. Con el cargo elegido comparamos tu hoja de vida con los términos que piden esas vacantes.',
        como: 'Elige el cargo en la lista de arriba para ver qué términos te faltan.',
        impacto: trans.length >= 5 ? 0 : 8,
      });
    }
    puntos.palabras = Math.min(25, p);
  }

  /* 5. Formato ATS */
  {
    let p = 0;
    if (meta?.escaneado) {
      agregar({
        tipo: 'error',
        categoria: 'formato',
        titulo: 'Tu PDF es una imagen: no tiene texto',
        detalle: 'Parece un documento escaneado o exportado como imagen. Un filtro ATS lo recibe en blanco: no puede leer tu nombre, tu experiencia ni tus palabras clave.',
        como: 'Expórtalo desde Word o Google Docs con «Guardar como PDF», o créalo en el creador de Edvanta y descárgalo: sale con texto seleccionable.',
        impacto: 15,
      });
    } else {
      p += 4;
      if (meta && meta.columnas > 1) {
        agregar({
          tipo: 'warn',
          categoria: 'formato',
          titulo: 'Diseño a dos columnas',
          detalle: 'Muchos filtros leen de izquierda a derecha y mezclan las dos columnas: tu experiencia puede quedar partida con tus habilidades.',
          como: 'Usa una sola columna de lectura. La plantilla oficial de Edvanta es de una columna y conserva un diseño moderno.',
          impacto: 4,
        });
      } else {
        p += 4;
      }
      if (meta && meta.imagenes > 0) {
        agregar({
          tipo: 'info',
          categoria: 'formato',
          titulo: `El PDF tiene ${meta.imagenes === 1 ? 'una imagen' : `${meta.imagenes} imágenes`}`,
          detalle: 'Foto, íconos o gráficos no se leen: si algún dato importante está dentro de una imagen (por ejemplo, el teléfono con un ícono dibujado), el filtro no lo verá.',
          como: 'Deja los datos en texto. En Colombia la foto no es obligatoria; si la pides, que no reemplace información.',
          impacto: 2,
        });
      } else {
        p += 2;
      }
      if (meta && meta.paginas > 2) {
        agregar({
          tipo: 'warn',
          categoria: 'formato',
          titulo: `Tiene ${meta.paginas} páginas`,
          detalle: 'Quien revisa decide en segundos y la primera página pesa más. Más de dos páginas diluye lo importante.',
          como: 'Deja una página si tienes menos de 10 años de experiencia y dos como máximo. Resume los cargos antiguos en una línea.',
          impacto: 3,
        });
      } else {
        p += 3;
      }
      if (leida.palabras < 180) {
        agregar({
          tipo: 'warn',
          categoria: 'formato',
          titulo: 'Texto muy corto',
          detalle: `Leímos unas ${leida.palabras} palabras. Con tan poco contenido el filtro no encuentra coincidencias con la vacante.`,
          como: 'Desarrolla el perfil (3 a 5 líneas) y agrega logros concretos en cada cargo.',
          impacto: 2,
        });
      } else if (leida.palabras > 950) {
        agregar({
          tipo: 'warn',
          categoria: 'formato',
          titulo: 'Texto demasiado extenso',
          detalle: `Leímos unas ${leida.palabras} palabras: más de lo que cabe bien en dos páginas.`,
          como: 'Recorta funciones repetidas y deja los logros que más se relacionan con el cargo.',
          impacto: 2,
        });
      } else {
        p += 2;
      }
    }
    puntos.formato = p;
  }

  /* 6. Redacción y datos sensibles */
  {
    let p = 0;
    const sensibles = DATOS_SENSIBLES.filter((d) => d.re.test(texto)).map((d) => d.que);
    if (sensibles.length) {
      agregar({
        tipo: 'error',
        categoria: 'redaccion',
        titulo: `Datos personales que sobran: ${sensibles.join(', ')}`,
        detalle: 'No aportan a la selección, ocupan espacio y exponen información protegida (Ley 1581 de 2012). Hoy muchas empresas piden no incluirlos.',
        como: 'Quítalos. Si un proceso los necesita, te los pedirán en la contratación.',
        impacto: 3,
      });
    } else {
      p += 3;
    }
    const perfil = (leida.secciones.perfil || []).join(' ');
    if (perfil && RE_PRIMERA_PERSONA.test(perfil)) {
      agregar({
        tipo: 'info',
        categoria: 'redaccion',
        titulo: 'El perfil está en primera persona',
        detalle: '«Yo soy», «mi experiencia», «me considero»: se lee informal y ocupa palabras que pueden ser términos clave.',
        como: 'Escríbelo impersonal: «Químico farmacéutico con 5 años en control de calidad…».',
        impacto: 1,
      });
    } else {
      p += 1;
    }
    const debiles = logros.filter((l) => DEBILES.some((d) => d.re.test(l))).length;
    if (!logros.length || debiles / logros.length <= 0.3) p += 1;
    puntos.redaccion = p;
  }

  /* Total */
  let puntaje = CATEGORIAS.reduce((s, c) => s + Math.min(c.max, puntos[c.id] || 0), 0);
  if (meta?.escaneado) puntaje = Math.min(puntaje, 15);
  puntaje = Math.max(0, Math.min(100, Math.round(puntaje)));
  const nivel = puntaje >= 80 ? 'alto' : puntaje >= 60 ? 'medio' : 'bajo';
  const mensaje = {
    alto: 'Tu hoja de vida está lista para pasar filtros. Ajusta las palabras clave a cada oferta antes de enviarla.',
    medio: 'Buena base. Con las prioridades de abajo puedes subir varios puntos en pocos minutos.',
    bajo: 'Así como está, es probable que un filtro automático la descarte. Empieza por las prioridades de abajo.',
  }[nivel];

  const prioridades = hallazgos
    .filter((h) => h.tipo === 'error' || h.tipo === 'warn')
    .sort((a, b) => (b.impacto - a.impacto) || (a.tipo === 'error' ? -1 : 1))
    .slice(0, 6);

  const fortalezas = hallazgos.filter((h) => h.tipo === 'ok').map((h) => h.titulo);

  return {
    puntaje,
    nivel,
    mensaje,
    cargo: cargo ? { slug: cargo.slug, nombre: cargo.cargo, detectado: !elegido } : null,
    categorias: CATEGORIAS.map((c) => ({ ...c, puntos: Math.min(c.max, puntos[c.id] || 0) })),
    detectado: {
      nombre: leida.nombre,
      titulo: leida.titulo,
      contacto: leida.contacto,
      secciones: leida.seccionesDetectadas,
      cargos: leida.experiencia.length,
      anosExperiencia: Math.round((leida.mesesExperiencia / 12) * 10) / 10,
      estudios: leida.educacion.length,
      habilidades: leida.habilidades.length,
      idiomas: leida.idiomas.length,
      logros: logros.length,
      palabras: leida.palabras,
      paginas: meta?.paginas ?? null,
      columnas: meta?.columnas ?? null,
      imagenes: meta?.imagenes ?? null,
      creador: meta?.creador || '',
    },
    palabrasClave: { encontradas, faltantes },
    hallazgos,
    prioridades,
    reescrituras,
    fortalezas,
  };
}
