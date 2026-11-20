/**
 * Amplía los artículos «para qué sirve» con estructura de blog SEO.
 *
 *   node scripts/ampliar-articulos-para-que-sirve.mjs --solo ibuprofeno
 *   node scripts/ampliar-articulos-para-que-sirve.mjs --write
 *
 * Usa la monografía del vademécum como fuente de mecanismo, indicaciones,
 * farmacocinética, interacciones, efectos adversos, embarazo, evidencia y
 * regulación. No inventa datos clínicos: lo que no está en la monografía o
 * en el artículo original no se agrega.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dirArticulos = path.join(raiz, 'public', 'articulos', 'articulos_edvanta', 'salud');
const dirMonografias = path.join(raiz, 'src', 'data', 'vademecum', 'monografias');
const solo = process.argv.includes('--solo') ? process.argv[process.argv.indexOf('--solo') + 1] : null;
const escribir = process.argv.includes('--write');

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

const monografias = new Map();
for (const file of readdirSync(dirMonografias).filter((f) => f.endsWith('.js'))) {
  const m = (await import(pathToFileURL(path.join(dirMonografias, file)).href)).default;
  monografias.set(m.slug, m);
}

const especiales = {
  buscapina: 'butilescopolamina',
  'amoxicilina-con-acido-clavulanico': 'amoxicilina-acido-clavulanico',
};

const seccion = (mono, id) => mono?.secciones?.find((s) => s.id === id) || null;

function tablaMarkdown(tabla, maxFilas = 12) {
  if (!tabla?.columnas?.length) return '';
  const filas = (tabla.filas || []).slice(0, maxFilas);
  const lineas = [
    `| ${tabla.columnas.join(' | ')} |`,
    `| ${tabla.columnas.map(() => '---').join(' | ')} |`,
    ...filas.map((f) => `| ${f.map((c) => String(c).replaceAll('|', '\\|')).join(' | ')} |`),
  ];
  return lineas.join('\n');
}

function bloquesMarkdown(bloques = [], maxTabla = 12) {
  const salida = [];
  for (const b of bloques) {
    if (typeof b === 'string') { salida.push(b); continue; }
    if (b.lista) { salida.push(b.lista.map((x) => `- ${x}`).join('\n')); continue; }
    if (b.tabla) { const t = tablaMarkdown(b.tabla, maxTabla); if (t) salida.push(t); continue; }
    if (b.subtitulo) { salida.push(`### ${b.subtitulo}`); continue; }
  }
  return salida.join('\n\n');
}

const palabras = (texto) => texto.replace(/[#>*|\-]/g, ' ').split(/\s+/).filter(Boolean).length;
const recortar = (texto, max) => {
  const t = String(texto || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).replace(/\s+\S*$/, '')}…`;
};

function parsear(md) {
  const partes = md.split(/^## /m);
  const front = partes.shift()?.trim() || '';
  const secciones = partes.map((p) => {
    const [cabecera, ...resto] = p.split('\n');
    return { titulo: cabecera.trim(), cuerpo: resto.join('\n').trim() };
  });
  return { front, secciones };
}

const buscar = (secciones, ...claves) => {
  for (const s of secciones) {
    const t = norm(s.titulo);
    if (claves.some((k) => t.includes(norm(k)))) return s;
  }
  return null;
};

function faqsExistentes(secciones) {
  const s = buscar(secciones, 'preguntas frecuentes', 'faq');
  if (!s) return [];
  const bloques = s.cuerpo.split(/^### /m).slice(1);
  return bloques.map((b) => {
    const [pregunta, ...resto] = b.split('\n');
    return { pregunta: pregunta.trim(), respuesta: resto.join('\n').trim() };
  });
}

function fuentesExistentes(secciones) {
  const s = buscar(secciones, 'fuentes', 'referencias');
  return s ? s.cuerpo : '';
}

function enlacesRelacionados(mono, monoSlug) {
  const propios = (mono?.enlaces || []).filter(([, url]) => !String(url).includes('/vademecum/' + monoSlug));
  const base = [
    [`Monografía de ${mono?.nombre || 'este medicamento'} en el vademécum`, `/vademecum/${monoSlug}`],
    ...propios.slice(0, 4),
  ];
  return [...new Map(base.map((e) => [e[1], e])).values()];
}

function generar(articulo, mono, monoSlug) {
  const { front, secciones } = parsear(articulo);
  const existentes = new Set(secciones.map((s) => norm(s.titulo)));
  const tomar = (...claves) => buscar(secciones, ...claves)?.cuerpo || '';
  const nombre = mono?.nombre || 'este medicamento';
  const nombreMin = nombre.charAt(0).toLowerCase() + nombre.slice(1);
  const articuloDef = /^(amoxicilina|dipirona|naltrexona)/i.test(nombre) || /a$/i.test(nombre) ? 'la' : 'el';
  const conArticulo = `${articuloDef} ${nombreMin}`;

  const yaTiene = (clave) => [...existentes].some((t) => t.includes(norm(clave)));

  const faq = faqsExistentes(secciones);
  const preguntas = new Set(faq.map((f) => norm(f.pregunta)));
  const nuevasFaq = [];

  if (mono) {
    const farmacocinetica = seccion(mono, 'farmacocinetica');
    const cmax = farmacocinetica?.bloques?.find((b) => b?.tabla)?.tabla?.filas?.find((f) => /concentraci[oó]n m[aá]xima|tiempo hasta/i.test(f[0]));
    const semivida = farmacocinetica?.bloques?.find((b) => b?.tabla)?.tabla?.filas?.find((f) => /semivida|vida media/i.test(f[0]));
    if (cmax && !preguntas.has(norm(`¿Cuánto tarda en hacer efecto ${nombre}?`))) {
      nuevasFaq.push({ pregunta: `¿Cuánto tarda en hacer efecto ${nombre}?`, respuesta: `${cmax[1]}${semivida ? ` Su efecto se mantiene mientras el medicamento permanece en el cuerpo; la semivida es de ${semivida[1].toLowerCase()}.` : ''} La respuesta completa depende de la indicación y del paciente, así que el seguimiento lo define el profesional.` });
    }
    const embarazo = seccion(mono, 'embarazo-y-lactancia');
    if (embarazo && !preguntas.has(norm(`¿Se puede usar ${nombre} en el embarazo?`))) {
      nuevasFaq.push({ pregunta: `¿Se puede usar ${nombre} en el embarazo?`, respuesta: recortar(bloquesMarkdown(embarazo.bloques, 4).replace(/^###.*$/gm, '').replace(/\n+/g, ' '), 600) });
    }
    const reacciones = seccion(mono, 'reacciones-adversas');
    if (reacciones && !preguntas.has(norm(`¿Qué efectos secundarios de ${nombre} son graves?`))) {
      nuevasFaq.push({ pregunta: `¿Qué efectos secundarios de ${nombre} son graves?`, respuesta: recortar(bloquesMarkdown(reacciones.bloques, 4).replace(/^###.*$/gm, '').replace(/\n+/g, ' '), 600) });
    }
  }

  const queEs = tomar('qué es', 'que es') || [
    mono?.resumen || '',
    mono ? `Pertenece al grupo farmacológico de ${mono.clase || 'medicamentos'}.` : '',
  ].filter(Boolean).join('\n\n');

  const paraQue = tomar('para qué sirve', 'para que sirve', 'usos principales');
  const comoFunciona = tomar('cómo funciona', 'como funciona', 'mecanismo') || (mono ? bloquesMarkdown(seccion(mono, 'farmacodinamia')?.bloques || [], 4) : '');
  const comoSeToma = tomar('cómo se toma', 'como se toma', 'cómo tomarlo', 'como tomarlo', 'dosis', 'cómo se usa');
  const efectos = tomar('efectos secundarios', 'reacciones adversas');
  const interacciones = tomar('interacciones');
  const errores = tomar('errores frecuentes');
  const quienNo = tomar('quién no debe', 'quien no debe', 'quién debe tener precaución', 'quien debe tener precaucion', 'contraindicaciones');
  const embarazo = tomar('embarazo');
  const cuandoConsultar = tomar('cuándo consultar', 'cuando consultar');
  const profesionales = tomar('para profesionales', 'profesionales de la salud');
  const farmacocinetica = mono ? bloquesMarkdown(seccion(mono, 'farmacocinetica')?.bloques || [], 6) : '';
  const evidencia = mono ? bloquesMarkdown(seccion(mono, 'evidencia')?.bloques || [], 4) : '';
  const regulacion = mono ? bloquesMarkdown(seccion(mono, 'regulacion')?.bloques || [], 5) : '';
  const reacciones = mono ? bloquesMarkdown(seccion(mono, 'reacciones-adversas')?.bloques || [], 6) : '';
  const interaccionesMono = mono ? bloquesMarkdown(seccion(mono, 'interacciones')?.bloques || [], 10) : '';
  const contraMono = mono ? bloquesMarkdown(seccion(mono, 'contraindicaciones-y-advertencias')?.bloques || [], 8) : '';
  const embarazoMono = mono ? bloquesMarkdown(seccion(mono, 'embarazo-y-lactancia')?.bloques || [], 5) : '';

  const otras = secciones.filter((s) => {
    const t = norm(s.titulo);
    return !/para que sirve|usos principales|que es|como funciona|mecanismo|cuanto tarda|farmacocinetica|como se toma|como tomarlo|dosis|como se usa|efectos secundarios|reacciones adversas|interacciones|quien no debe|contraindicaciones|embarazo|cuando consultar|para profesionales|profesionales de la salud|preguntas frecuentes|faq|fuentes|referencias|articulos relacionados|errores frecuentes|evidencia|situacion|sobre este articulo|tabla de contenido/.test(t);
  });

  const seccionesSalida = [];
  const añadir = (titulo, cuerpo) => {
    if (cuerpo && String(cuerpo).trim()) seccionesSalida.push({ titulo, cuerpo: String(cuerpo).trim() });
  };

  añadir(`¿Qué es ${conArticulo}?`, queEs);
  añadir(`¿Para qué sirve ${conArticulo}?`, paraQue);
  añadir('Cómo funciona', comoFunciona);
  if (!yaTiene('cuánto tarda')) añadir('Cuánto tarda en hacer efecto', farmacocinetica);
  añadir('Cómo se toma', comoSeToma);
  añadir('Efectos secundarios', [efectos, reacciones && !efectos.includes(reacciones) ? reacciones : ''].filter(Boolean).join('\n\n'));
  añadir('Interacciones', [interacciones, interaccionesMono && !interacciones.includes(interaccionesMono) ? interaccionesMono : ''].filter(Boolean).join('\n\n'));
  añadir('Quién no debe tomarlo', [quienNo, contraMono && !quienNo.includes(contraMono) ? contraMono : ''].filter(Boolean).join('\n\n'));
  añadir('Embarazo, lactancia y niños', [embarazo, embarazoMono && !embarazo.includes(embarazoMono) ? embarazoMono : ''].filter(Boolean).join('\n\n'));
  for (const s of otras) añadir(s.titulo, s.cuerpo);
  añadir('Evidencia y situación en Colombia', [evidencia, regulacion].filter(Boolean).join('\n\n'));
  añadir('Errores frecuentes', errores || [
    `- **Automedicarse o repetir la dosis antes de tiempo** para buscar un efecto más rápido. Más dosis no significa más beneficio y sí puede significar más riesgo.`,
    `- **Suspenderlo sin consultar** cuando la indicación exige completar un tiempo o un tratamiento. La duración la define el profesional.`,
    `- **No contar los otros productos que toma**: antigripales, suplementos, plantas medicinales y medicamentos de venta libre también interactúan.`,
    `- **Confundir alivio con cura**: si el síntoma mejora, no necesariamente desapareció la causa. Si el problema vuelve o empeora, hay que evaluarlo.`,
    `- **No revisar la técnica de uso** cuando se trata de un inhalador, una crema, gotas o un dispositivo: una técnica incorrecta hace que el medicamento no llegue donde debe.`,
  ].join('\n'));
  añadir('Cuándo consultar', cuandoConsultar || [
    'Consulta si el síntoma no mejora en el plazo esperado, si empeora rápido o si aparece un signo de alarma: dificultad para respirar, dolor en el pecho, desmayo, sangrado, hinchazón de cara o garganta, confusión, fiebre alta persistente o reducción de la orina.',
    'Si estás embarazada, en lactancia, tienes enfermedad renal o hepática, tomas anticoagulantes o tienes varias enfermedades crónicas, consulta antes de empezar cualquier medicamento.',
  ].join('\n\n'));
  añadir('Para profesionales', profesionales || (mono ? `Si eres profesional de la salud, consulta la [monografía de ${nombre}](/vademecum/${monoSlug}) del vademécum de Edvanta, con farmacología, interacciones, evidencia y atención farmacéutica. También puedes revisar el [grupo terapéutico](/vademecum/${mono.grupo}) y los cursos de farmacología clínica.` : ''));
  añadir('Preguntas frecuentes', [
    ...faq.map((f) => `### ${f.pregunta}\n\n${f.respuesta}`),
    ...nuevasFaq.map((f) => `### ${f.pregunta}\n\n${f.respuesta}`),
  ].join('\n\n'));
  añadir('Artículos relacionados', enlacesRelacionados(mono, monoSlug).map(([texto, url]) => `- [${texto}](${url})`).join('\n'));
  añadir('Fuentes', [
    fuentesExistentes(secciones),
    (mono?.referencias || []).slice(0, 4).map((r) => `- ${r.texto}`).join('\n'),
  ].filter(Boolean).join('\n\n'));
  añadir('Sobre este artículo', [
    'Este artículo es información educativa y no reemplaza la consulta con un profesional de la salud. No es una fórmula médica ni una recomendación de tratamiento para una persona concreta.',
    '**Autor:** Equipo editorial de Edvanta. **Revisión clínica:** pendiente de asignación. Si encuentras un error o una fuente desactualizada, escríbenos para corregirlo.',
  ].join('\n\n'));

  return [
    front,
    ...seccionesSalida.map((s) => `## ${s.titulo}\n\n${s.cuerpo}`),
  ].join('\n\n').replace(/\n{4,}/g, '\n\n\n').trim() + '\n';
}

const archivos = readdirSync(dirArticulos)
  .filter((f) => f.endsWith('.md') && /para-que-sirve/.test(f))
  .sort();

const resultados = [];
for (const archivo of archivos) {
  const slug = archivo.replace(/\.md$/, '');
  if (solo && !slug.startsWith(solo)) continue;
  const base = slug.replace(/-para-que-sirve.*$/, '');
  const monoSlug = especiales[base] || base;
  const mono = monografias.get(monoSlug) || null;
  if (!mono) {
    resultados.push({ archivo, slug, mono: monoSlug, palabras: palabras(readFileSync(path.join(dirArticulos, archivo), 'utf8')), estado: 'sin monografía' });
    continue;
  }
  const original = readFileSync(path.join(dirArticulos, archivo), 'utf8');
  const nuevo = generar(original, mono, monoSlug);
  const n = palabras(nuevo);
  resultados.push({ archivo, slug, mono: monoSlug, palabras: n, estado: 'ok' });
  if (escribir) writeFileSync(path.join(dirArticulos, archivo), nuevo, 'utf8');
  if (solo) console.log(nuevo.slice(0, 6000));
}

console.log(JSON.stringify(resultados, null, 2));
if (!escribir) console.log('\nModo vista previa. Usa --write para guardar.');
