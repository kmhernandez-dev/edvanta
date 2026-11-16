import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { GUIAS } from '../lib/ofertas.js';

/** Ivermectina oral. Verificada el 16-nov-2026: ficha técnica de CIMA (Ivergalen 3 mg) y CUM del INVIMA (9 registros vigentes con ATC P02CF01). */
export default crearMonografia({
  slug: 'ivermectina',
  nombre: 'Ivermectina',
  grupo: 'antimicoticos-antivirales-y-antiparasitarios',
  clase: 'Antiparasitario (avermectina)',
  atc: 'P02CF01',
  vias: ['Oral'],
  mecanismo: 'Derivado de las avermectinas que se une con gran afinidad a los canales de cloruro activados por glutamato de las células nerviosas y musculares de los invertebrados.',
  resumenCorto: 'antiparasitario oral de dosis única por peso (200 µg/kg) para estrongiloidosis y sarna; se toma lejos de las comidas y no es un tratamiento preventivo.',
  resumen: 'La ivermectina deriva de las avermectinas de Streptomyces avermitilis y actúa sobre los canales de cloruro activados por glutamato de los nervios y músculos de los parásitos invertebrados. Su ficha técnica la indica en la estrongiloidosis digestiva, la microfilaremia por Wuchereria bancrofti y la sarna sarcóptica confirmada clínica o parasitológicamente. La dosis habitual es de 200 µg/kg en una sola toma, que se traduce en un número de comprimidos de 3 mg según el peso, sin alimentos dos horas antes ni después. En la sarna, la curación solo se considera definitiva a las 4 semanas: el picor que persiste no justifica por sí solo repetir la dosis. No es un tratamiento preventivo.',
  datosClave: [
    ['Clase', 'Antiparasitario derivado de avermectinas [FT]'],
    ['Código ATC', 'P02CF01 [CUM]'],
    ['Dosis', '200 µg/kg en dosis única [FT]'],
    ['Toma', 'Sin alimentos 2 horas antes ni después [FT]'],
    ['Sarna', 'Curación definitiva valorable a las 4 semanas [FT]'],
    ['Colombia', '9 registros vigentes con el código ATC P02CF01 [CUM]'],
  ],
  quimica: ['Derivada de las avermectinas aisladas de Streptomyces avermitilis; la presentación de referencia son comprimidos de 3 mg [FT].'],
  dinamia: [
    'Se une con gran afinidad a los canales de cloruro activados por glutamato de las células nerviosas y musculares de los invertebrados, aumenta la permeabilidad al cloruro y paraliza al parásito [FT].',
    { mapa: {
      centro: 'Ivermectina',
      ramas: [
        { titulo: 'Intestino', icono: 'Bug', nodos: ['Estrongiloidosis'] },
        { titulo: 'Piel', icono: 'Layers', nodos: ['Sarna sarcóptica'] },
        { titulo: 'Sangre', icono: 'Droplet', nodos: ['Microfilaremia por W. bancrofti'] },
        { titulo: 'No es', icono: 'Ban', nodos: ['Profilaxis'] },
      ],
    } },
  ],
  cinetica: ['Tras una dosis única de 12 mg, la concentración máxima aparece hacia las 4 horas. Se metaboliza en el organismo y se excreta casi por completo por las heces [FT].'],
  indicaciones: [L(['Estrongiloidosis digestiva (anguilulosis) [FT].', 'Microfilaremia en la filariasis linfática por Wuchereria bancrofti [FT].', 'Sarna sarcóptica con diagnóstico clínico o parasitológico; el prurito sin diagnóstico no justifica el tratamiento [FT].'])],
  posologia: [
    T(['Peso (kg)', 'Comprimidos de 3 mg en dosis única (estrongiloidosis y sarna)'], [
      ['15 a 24', '1 [FT]'],
      ['25 a 35', '2 [FT]'],
      ['36 a 50', '3 [FT]'],
      ['51 a 65', '4 [FT]'],
      ['66 a 79', '5 [FT]'],
      ['80 o más', '6 [FT]'],
    ]),
    { barras: {
      titulo: 'Comprimidos de 3 mg según el peso',
      unidad: ['comprimido', 'comprimidos'],
      datos: [
        { etiqueta: '80 kg o más', valor: 6 },
        { etiqueta: '66 a 79 kg', valor: 5 },
        { etiqueta: '51 a 65 kg', valor: 4 },
        { etiqueta: '36 a 50 kg', valor: 3 },
        { etiqueta: '25 a 35 kg', valor: 2 },
        { etiqueta: '15 a 24 kg', valor: 1 },
      ],
      nota: 'Ficha técnica, dosis de 200 µg/kg [FT].',
    } },
    'En la sarna común, una segunda dosis en las 2 semanas siguientes solo se considera si aparecen lesiones nuevas o la exploración parasitológica es positiva. La sarna profusa y costrosa puede necesitar una segunda dosis [FT].',
  ],
  contraindicaciones: [
    'Contraindicada solo en hipersensibilidad [FT].',
    { alerta: { tono: 'alto', titulo: 'Loa loa', texto: 'En personas con muchas microfilarias de Loa loa se han descrito encefalopatías tras el tratamiento [FT].' } },
    { alerta: { tono: 'medio', titulo: 'No previene', texto: 'No es un tratamiento profiláctico de la filariasis ni de la estrongiloidosis. En inmunodeprimidos puede persistir la infección tras una dosis única [FT].' } },
  ],
  interacciones: ['No se han realizado estudios de interacción [FT].'],
  adversas: ['Frecuentes: dolor abdominal, diarrea, náuseas, vómitos, elevación de transaminasas, leucopenia y linfadenopatía, según la indicación [FT].'],
  embarazo: [L(['Embarazo: en unas 300 embarazadas tratadas en campañas contra la oncocercosis no se observaron anomalías congénitas ni abortos asociados, pero los datos son limitados [FT].'])],
  evidencia: [
    'Su ficha técnica restringe el uso a infecciones diagnosticadas y marca un plazo de 4 semanas para valorar la curación de la sarna [FT].',
    { triangulo: {
      titulo: 'Ivermectina bien usada',
      centro: 'Dosis única por peso',
      vertices: [
        { titulo: 'Peso', icono: 'Scale', texto: 'Contar comprimidos según los kilos [FT].' },
        { titulo: 'Ayunas', icono: 'Utensils', texto: 'Sin comida 2 horas antes ni después [FT].' },
        { titulo: 'Diagnóstico', icono: 'Search', texto: 'Solo con infección confirmada [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 9 registros sanitarios vigentes con el código ATC P02CF01; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Ivergalen 3 mg comprimidos [FT].'])],
  atencion: {
    intro: 'Con la ivermectina, el aporte del farmacéutico es calcular bien los comprimidos por peso, explicar la toma en ayunas y evitar segundas dosis sin motivo [FT,MN].',
    necesidades: [
      ['Indicación', 'Estrongiloidosis o sarna diagnosticada [FT]'],
      ['Efectividad', 'Curación valorada a las 4 semanas en la sarna [FT]'],
      ['Seguridad', 'Loa loa, inmunodepresión [FT]'],
      ['Adherencia', 'Toma única correcta [FT]'],
    ],
    prf: [
      ['Dosis demasiado baja', 'Adulto de 70 kg con 2 comprimidos', 'Corresponden 5 [FT]'],
      ['Farmacoterapia innecesaria', 'Quiere repetir la dosis por picor a la semana', 'Explicar el plazo de 4 semanas [FT]'],
      ['Indicación', 'Pide ivermectina «para prevenir»', 'No es profiláctica [FT]'],
    ],
    plan: ['Pesar o confirmar el peso antes de dispensar [FT].', 'Escribir la hora de la toma lejos de las comidas [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'La sarna genera estigma y picor que no se va de inmediato. Explicar que el picor puede durar semanas tras la curación evita frustración y dosis innecesarias [EX].',
    preguntas: ['¿Cuánto pesa?', '¿Quién en la casa tiene síntomas?', '¿Le confirmaron el diagnóstico?'],
    quiz: {
      pregunta: 'Adulto de 58 kg con estrongiloidosis. ¿Cuántos comprimidos de 3 mg indica la ficha técnica?',
      opciones: [
        { texto: '4 comprimidos en una sola toma', correcta: true, retro: 'Corresponde al rango de 51 a 65 kg [FT].' },
        { texto: '1 comprimido al día por 4 días', correcta: false, retro: 'Es una dosis única [FT].' },
        { texto: '6 comprimidos', correcta: false, retro: 'Esa es la dosis para 80 kg o más [FT].' },
      ],
    },
  },
  ofertas: [GUIAS.proa, GUIAS.problemas],
  refs: { FT: F.ftIvermectina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Albendazol: farmacología', '/vademecum/albendazol'], ['Antimicóticos, antivirales y antiparasitarios', '/vademecum/antimicoticos-antivirales-y-antiparasitarios']],
  seo: {
    titulo: 'Ivermectina: dosis por peso, sarna y estrongiloidosis',
    descripcion: 'Ivermectina oral: mecanismo, dosis única de 200 µg/kg, comprimidos por peso, sarna, estrongiloidosis, toma en ayunas y atención farmacéutica.',
  },
});
