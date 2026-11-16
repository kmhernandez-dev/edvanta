import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Clonazepam. Verificado el 16-nov-2026: ficha técnica de CIMA (Rivotril 0,5 mg) y CUM del INVIMA (8 registros vigentes con ATC N03AE01). */
export default crearMonografia({
  slug: 'clonazepam',
  nombre: 'Clonazepam',
  grupo: 'salud-mental-y-sistema-nervioso',
  clase: 'Benzodiacepina antiepiléptica',
  atc: 'N03AE01',
  vias: ['Oral'],
  mecanismo: 'Benzodiacepina que aumenta la neurotransmisión GABAérgica en las sinapsis inhibitorias: anticonvulsivante, sedante, miorrelajante y ansiolítica.',
  resumenCorto: 'benzodiacepina de semivida larga (30 a 40 horas) indicada en la epilepsia; genera dependencia, no se suspende de golpe y se evita con alcohol y otros sedantes.',
  resumen: 'El clonazepam es una benzodiacepina con todos los efectos del grupo —anticonvulsivante, sedante, miorrelajante y ansiolítico— por aumento de la neurotransmisión GABAérgica. En su ficha técnica española, la de referencia en CIMA, está indicado en las epilepsias del lactante, del niño y del adulto, las crisis focales y el estado epiléptico. Tiene una semivida larga, de 30 a 40 horas, y una biodisponibilidad cercana al 90 %. En adultos se inicia con no más de 1,5 mg al día en 3 tomas y se mantiene en 3 a 6 mg, con un máximo absoluto de 20 mg. Sus riesgos son los de toda benzodiacepina: dependencia, síntomas de abstinencia si se suspende bruscamente, sedación y depresión respiratoria con otros depresores.',
  datosClave: [
    ['Clase', 'Benzodiacepina [FT]'],
    ['Código ATC', 'N03AE01 [CUM]'],
    ['Inicio en adultos', 'No más de 1,5 mg al día en 3 tomas [FT]'],
    ['Mantenimiento', '3 a 6 mg al día; máximo 20 mg [FT]'],
    ['Semivida', '30 a 40 horas [FT]'],
    ['Colombia', '8 registros vigentes con el código ATC N03AE01 [CUM]'],
  ],
  quimica: ['Derivado de las benzodiacepinas; la presentación de referencia son comprimidos ranurados de 0,5 mg, que pueden partirse por la mitad [FT].'],
  dinamia: [
    'Tiene los efectos característicos de las benzodiacepinas: anticonvulsivante, sedante, miorrelajante y ansiolítico, mediados por el aumento de la neurotransmisión GABAérgica en las sinapsis inhibitorias [FT].',
    { mapa: {
      centro: 'Clonazepam',
      ramas: [
        { titulo: 'Anticonvulsivante', icono: 'Zap', nodos: ['Epilepsia', 'Crisis focales'] },
        { titulo: 'Ansiolítico', icono: 'Waves', nodos: ['Efecto de grupo'] },
        { titulo: 'Sedante', icono: 'Moon', nodos: ['Somnolencia', 'Menos reflejos'] },
        { titulo: 'Dependencia', icono: 'Lock', nodos: ['Tolerancia', 'Abstinencia'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción', 'Rápida y casi total; máximo en 1 a 4 horas [FT]'],
    ['Biodisponibilidad oral', 'Cerca del 90 % [FT]'],
    ['Semivida', '30 a 40 horas, independiente de la dosis [FT]'],
  ])],
  indicaciones: ['Epilepsias del lactante y del niño (pequeño mal y crisis tónico-clónicas generalizadas), epilepsias del adulto, crisis focales y estado epiléptico [FT].'],
  posologia: [
    T(['Paciente', 'Inicio', 'Mantenimiento'], [
      ['Adultos', 'No más de 1,5 mg al día en 3 tomas; subir 0,5 mg cada 72 horas [FT]', '3 a 6 mg al día; nunca más de 20 mg [FT]'],
      ['10 a 16 años', '1 a 1,5 mg al día en 2 o 3 tomas; subir 0,25 a 0,5 mg cada 72 horas [FT]', '3 a 6 mg al día [FT]'],
      ['Hasta 10 años o 30 kg', '0,01 a 0,03 mg/kg/día en 2 o 3 tomas [FT]', 'Cerca de 0,1 mg/kg/día [FT]'],
    ]),
    { barras: {
      titulo: 'Rango de dosis en adultos (mg al día)',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Máximo absoluto', valor: 20 },
        { etiqueta: 'Mantenimiento habitual, máximo', valor: 6 },
        { etiqueta: 'Mantenimiento habitual, mínimo', valor: 3 },
        { etiqueta: 'Inicio, máximo', valor: 1.5 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  contraindicaciones: [
    'Contraindicado en hipersensibilidad, insuficiencia respiratoria grave, alteración hepática grave (puede precipitar una encefalopatía), coma y en personas con farmacodependencia, drogodependencia o dependencia alcohólica [FT].',
    { alerta: { tono: 'alto', titulo: 'Abstinencia', texto: 'Con dependencia física, la suspensión brusca puede causar síntomas de abstinencia: temblor, sudoración, agitación y trastornos del sueño, entre otros. Se retira de forma gradual [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Ideación suicida', texto: 'Como otros antiepilépticos, se asocia con un pequeño aumento del riesgo de ideación y conducta suicida: vigilar y consultar si aparece [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Otros antiepilépticos', 'Más sedación y apatía', 'Ajustar las dosis [FT]'],
    ['Fenitoína, primidona', 'Interacción descrita', 'Vigilar la respuesta [FT]'],
    ['Alcohol y depresores del sistema nervioso', 'Más sedación', 'Evitar [FT]'],
  ])],
  adversas: ['La frecuencia no puede estimarse con los datos disponibles. Incluyen alteraciones emocionales y del ánimo, confusión, desorientación, somnolencia y reacciones alérgicas [FT].'],
  embarazo: [L(['Embarazo: no puede excluirse que cause malformaciones; los antiepilépticos en conjunto muestran indicios de teratogenia. Requiere valoración especializada [FT].'])],
  evidencia: [
    'Su ficha técnica española limita las indicaciones a la epilepsia. Cualquier uso fuera de ellas es una decisión médica que exige seguimiento de la dependencia [FT].',
    { triangulo: {
      titulo: 'Benzodiacepina segura',
      centro: 'Clonazepam',
      vertices: [
        { titulo: 'Dosis mínima', icono: 'Gauge', texto: 'Empezar bajo y subir cada 72 horas [FT].' },
        { titulo: 'Sin mezclas', icono: 'Wine', texto: 'Nada de alcohol ni otros sedantes [FT].' },
        { titulo: 'Retirada lenta', icono: 'Hourglass', texto: 'Nunca suspender de golpe [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 8 registros sanitarios vigentes con el código ATC N03AE01; consulta del 16-nov-2026 [CUM].', 'España: autorizado como Rivotril 0,5 mg y 2 mg comprimidos, gotas e inyectable [FT].'])],
  atencion: {
    intro: 'El clonazepam se usa durante años en muchos pacientes. El farmacéutico detecta la escalada de dosis, las mezclas con alcohol y la suspensión brusca [FT,MN].',
    necesidades: [
      ['Indicación', 'Epilepsia u otra indicación médica documentada [FT]'],
      ['Efectividad', 'Control de crisis o síntomas [FT]'],
      ['Seguridad', 'Dependencia, caídas, sedación, respiración [FT]'],
      ['Adherencia', 'Dosis estable, sin aumentos por cuenta propia [FT]'],
    ],
    prf: [
      ['Seguridad', 'Pide la fórmula antes de tiempo con frecuencia', 'Hablar del uso y avisar al médico [FT]'],
      ['Interacción', 'Lo combina con alcohol', 'Explicar el riesgo [FT]'],
      ['Seguridad', 'Quiere dejarlo de golpe', 'Plan de retirada gradual con el médico [FT]'],
    ],
    plan: ['Registrar la frecuencia de dispensación [FT].', 'Advertir sobre la conducción [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Muchos pacientes sienten que no pueden dormir o calmarse sin el clonazepam. Escuchar ese miedo sin juzgar es el primer paso para una retirada posible [EX].',
    preguntas: ['¿Desde cuándo lo toma y cuánto?', '¿Qué pasa si no lo toma un día?', '¿Toma alcohol u otros medicamentos para dormir?'],
    quiz: {
      pregunta: '¿Cuál es la dosis máxima de clonazepam en adultos que, según su ficha técnica, no debe superarse nunca?',
      opciones: [
        { texto: '20 mg al día', correcta: true, retro: 'El mantenimiento habitual es de 3 a 6 mg [FT].' },
        { texto: '1,5 mg al día', correcta: false, retro: 'Ese es el máximo de inicio [FT].' },
        { texto: '100 mg al día', correcta: false, retro: 'Supera la dosis máxima de la ficha técnica [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.snc, GUIAS.seguridad],
  refs: { FT: F.ftClonazepam, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Pregabalina: farmacología', '/vademecum/pregabalina'], ['Salud mental y sistema nervioso', '/vademecum/salud-mental-y-sistema-nervioso']],
  seo: {
    titulo: 'Clonazepam: dosis, dependencia y atención farmacéutica',
    descripcion: 'Clonazepam: benzodiacepina para la epilepsia, dosis de inicio y máxima, semivida de 30 a 40 horas, dependencia, abstinencia y atención farmacéutica.',
  },
});
