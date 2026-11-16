import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Lactulosa. Verificada el 16-nov-2026: ficha técnica de CIMA (Duphalac 667 mg/ml) y CUM del INVIMA (3 registros con ATC A06AD11). */
export default crearMonografia({
  slug: 'lactulosa',
  nombre: 'Lactulosa',
  grupo: 'medicamentos-para-el-aparato-digestivo',
  clase: 'Laxante osmótico',
  atc: 'A06AD11',
  vias: ['Oral'],
  mecanismo: 'Las bacterias del colon la transforman en ácidos orgánicos que bajan el pH y aumentan el volumen por efecto osmótico; en la encefalopatía hepática atrapa amonio.',
  resumenCorto: 'laxante osmótico para el estreñimiento y la encefalopatía hepática; tarda 2 a 3 días en actuar y puede usarse en embarazo y lactancia.',
  resumen: 'La lactulosa es un azúcar sintético que casi no se absorbe. En el colon, las bacterias la convierten en ácidos orgánicos que bajan el pH y atraen agua, con lo que ablandan las heces y estimulan el peristaltismo. Se usa en el estreñimiento, para facilitar la defecación en enfermedades anorrectales y en el tratamiento y la prevención de la encefalopatía hepática, donde también reduce el amonio. Su efecto tarda 2 a 3 días y puede usarse en el embarazo y la lactancia. La atención farmacéutica se centra en la dosis adecuada y en los electrolitos.',
  datosClave: [
    ['Clase', 'Laxante osmótico [FT]'],
    ['Código ATC', 'A06AD11 [CUM]'],
    ['Dosis en estreñimiento', '10 a 30 g al día al inicio; 10 a 20 g de mantenimiento [FT]'],
    ['Inicio del efecto', '2 a 3 días [FT]'],
    ['Absorción', 'Menos del 3 % [FT]'],
    ['Colombia', '3 registros vigentes con el código ATC A06AD11 [CUM]'],
  ],
  quimica: ['La presentación de referencia es una solución oral de 667 mg/ml (también en sobres de 10 g) [FT].', 'Contiene lactosa, galactosa y fructosa como residuos de fabricación [FT].'],
  dinamia: [
    'Las bacterias del colon la descomponen en ácidos orgánicos: baja el pH y aumenta el volumen por efecto osmótico, lo que favorece el peristaltismo [FT].',
    'En la encefalopatía hepática suprime bacterias proteolíticas, capta el ion amonio y altera el metabolismo del nitrógeno bacteriano [FT].',
    { mapa: {
      centro: 'Lactulosa',
      ramas: [
        { titulo: 'Colon', icono: 'Bug', nodos: ['Fermentación bacteriana', 'Ácidos orgánicos'] },
        { titulo: 'Osmosis', icono: 'Droplets', nodos: ['Más agua', 'Heces blandas'] },
        { titulo: 'Amonio', icono: 'Atom', nodos: ['Lo atrapa', 'Encefalopatía hepática'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción', 'Menos del 3 %; lo absorbido se excreta inalterado en orina en 24 horas [FT]'],
    ['Destino', 'La flora del colon la metaboliza por completo hasta 20 a 50 g [FT]'],
    ['Inicio del efecto', 'Pueden pasar 2 a 3 días [FT]'],
  ])],
  indicaciones: [L(['Estreñimiento [FT].', 'Ablandar las heces y facilitar la defecación en hemorroides, fisura anal, fístulas, abscesos, úlceras o después de cirugía anorrectal [FT].', 'Tratamiento y prevención de la encefalopatía hepática portosistémica [FT].'])],
  posologia: [
    T(['Indicación', 'Dosis en adultos'], [
      ['Estreñimiento, inicio', '10 a 30 g al día (15 a 45 ml o 1 a 3 sobres) [FT]'],
      ['Estreñimiento, mantenimiento', '10 a 20 g al día (15 a 30 ml o 1 a 2 sobres) [FT]'],
      ['Encefalopatía portosistémica, inicio', '20 a 30 g, 3 a 4 veces al día [FT]'],
    ]),
    { barras: {
      titulo: 'Gramos de lactulosa al día según el uso (valor máximo del rango inicial)',
      unidad: 'g',
      datos: [
        { etiqueta: 'Encefalopatía hepática', valor: 120, texto: '20 a 30 g, 3 a 4 veces al día [FT]' },
        { etiqueta: 'Estreñimiento, inicio', valor: 30 },
        { etiqueta: 'Estreñimiento, mantenimiento', valor: 20 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad, galactosemia y obstrucción o perforación digestiva o riesgo de perforación [FT].',
    { alerta: { tono: 'medio', titulo: 'Diabetes y electrolitos', texto: 'Con las dosis altas de la encefalopatía hay que tener precaución en diabéticos por su contenido de azúcares; el uso prolongado o a dosis altas puede causar hipopotasemia e hipernatremia [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Mesalazina y fármacos de liberación dependiente del pH', 'Menor efecto', 'Considerar al combinar [FT]'],
    ['Diuréticos, corticoides, anfotericina B', 'Más pérdida de potasio', 'Vigilar potasio [FT]'],
    ['Glucósidos cardiacos', 'Más efecto si hay hipopotasemia', 'Vigilar potasio [FT]'],
    ['Antiácidos', 'Contrarrestan el efecto acidificante', 'Separar [FT]'],
  ])],
  adversas: [
    'Muy frecuente: diarrea. Frecuentes: flatulencia, dolor abdominal, náuseas y vómito [FT].',
    L(['Poco frecuentes: desequilibrio de electrolitos por la diarrea [FT].']),
  ],
  embarazo: [L(['Embarazo y lactancia: exposición sistémica insignificante; puede usarse si es necesario [FT].'])],
  evidencia: [
    'Su ficha técnica la indica tanto en el estreñimiento como en la encefalopatía hepática, donde la dosis es varias veces mayor [FT].',
    { triangulo: {
      titulo: 'Tres usos, tres metas',
      centro: 'Lactulosa',
      vertices: [
        { titulo: 'Estreñimiento', icono: 'Repeat', texto: 'Heces blandas con 10 a 20 g de mantenimiento [FT].' },
        { titulo: 'Anorrectal', icono: 'Bandage', texto: 'Defecación sin esfuerzo tras cirugía o con fisuras [FT].' },
        { titulo: 'Hígado', icono: 'Atom', texto: 'Menos amonio en la encefalopatía portosistémica [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 3 registros sanitarios vigentes con el código ATC A06AD11; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Duphalac 667 mg/ml solución oral y en sobres [FT].'])],
  atencion: {
    intro: 'La lactulosa exige paciencia: tarda días en actuar. Explicarlo evita que se sume otro laxante al segundo día [FT,MN].',
    necesidades: [
      ['Indicación', 'Estreñimiento, enfermedad anorrectal o encefalopatía hepática [FT]'],
      ['Efectividad', 'Deposiciones blandas en 2 a 3 días [FT]'],
      ['Seguridad', 'Diabetes, potasio, sodio, galactosemia [FT]'],
      ['Adherencia', 'Dosis diaria constante [FT]'],
    ],
    prf: [
      ['Dosis demasiado alta', 'Diarrea intensa por subir la dosis muy rápido', 'Ajustar con el prescriptor [FT]'],
      ['Interacción', 'Paciente con diurético y digoxina', 'Vigilar el potasio [FT]'],
      ['Adherencia', 'Abandono al segundo día por «no funcionar»', 'Explicar el tiempo de inicio [FT]'],
    ],
    plan: ['Explicar que el efecto tarda 2 a 3 días [FT].', 'En la encefalopatía, coordinar con el equipo de hepatología.', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Los gases y el sabor dulce son motivos frecuentes de abandono. Hablar de ellos al inicio mejora la adherencia [EX].',
    preguntas: ['¿Cuánto toma y cuántas deposiciones tiene al día?', '¿Tiene diabetes?', '¿Le molestan los gases o el sabor?'],
    quiz: {
      pregunta: '¿Cuánto tiempo puede tardar la lactulosa en hacer efecto?',
      opciones: [
        { texto: '2 a 3 días', correcta: true, retro: 'Así lo indica la ficha técnica [FT].' },
        { texto: '30 minutos', correcta: false, retro: 'No es un laxante de efecto inmediato [FT].' },
        { texto: '6 a 12 horas, como el bisacodilo', correcta: false, retro: 'Ese es el tiempo de un laxante estimulante [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.gastro, GUIAS.problemas],
  refs: { FT: F.ftLactulosa, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Bisacodilo: farmacología', '/vademecum/bisacodilo'], ['Medicamentos para el aparato digestivo', '/vademecum/medicamentos-para-el-aparato-digestivo']],
  seo: {
    titulo: 'Lactulosa: farmacología y atención farmacéutica',
    descripcion: 'Lactulosa: mecanismo osmótico, dosis en estreñimiento y encefalopatía hepática, inicio en 2 a 3 días, embarazo, electrolitos y consejería.',
  },
});
