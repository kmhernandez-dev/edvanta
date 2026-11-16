import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Hidroxizina. Verificada el 16-nov-2026: ficha técnica de CIMA (Atarax 25 mg) y CUM del INVIMA (11 registros vigentes con ATC N05BB01). */
export default crearMonografia({
  slug: 'hidroxizina',
  nombre: 'Hidroxizina',
  grupo: 'alergia-y-vias-respiratorias',
  clase: 'Antihistamínico de primera generación con acción ansiolítica',
  atc: 'N05BB01',
  vias: ['Oral'],
  mecanismo: 'Suprime la actividad en regiones clave del área subcortical del sistema nervioso central; no es un depresor cortical. Su metabolito principal es la cetirizina.',
  resumenCorto: 'antihistamínico sedante para el prurito y la ansiedad: máximo 100 mg al día en adultos y 50 mg en mayores; prolonga el QT y se contraindica en el embarazo.',
  resumen: 'La hidroxizina es un antihistamínico de primera generación con acción sobre el sistema nervioso central: su ficha técnica la indica para el tratamiento sintomático de la ansiedad en adultos y del prurito desde los 12 meses de edad. Su metabolito principal es la cetirizina, que representa el 45 % de la dosis oral. Tiene dos riesgos que el farmacéutico no puede pasar por alto: prolonga el intervalo QT, por lo que se contraindica con factores de riesgo de arritmia y se vigila con otros fármacos que lo alargan, y produce sedación y efectos anticolinérgicos, sobre todo en personas mayores, en quienes la dosis máxima baja a 50 mg al día. Está contraindicada en el embarazo y la lactancia.',
  datosClave: [
    ['Clase', 'Antihistamínico con acción ansiolítica [FT]'],
    ['Código ATC', 'N05BB01 [CUM]'],
    ['Dosis máxima en adultos', '100 mg al día [FT]'],
    ['Dosis máxima en mayores', '50 mg al día [FT]'],
    ['Semivida', 'Unas 14 horas en adultos (7 a 20) [FT]'],
    ['Colombia', '11 registros vigentes con el código ATC N05BB01 [CUM]'],
  ],
  quimica: ['Derivado de la piperazina; la presentación de referencia son comprimidos recubiertos de 25 mg y jarabe de 2 mg/ml [FT].', 'Su metabolito principal es la cetirizina [FT].'],
  dinamia: [
    'Suprime la actividad en regiones clave del área subcortical del sistema nervioso central, sin ser un depresor cortical [FT].',
    { mapa: {
      centro: 'Hidroxizina',
      ramas: [
        { titulo: 'Prurito', icono: 'Layers', nodos: ['Desde los 12 meses'] },
        { titulo: 'Ansiedad', icono: 'Brain', nodos: ['Solo adultos'] },
        { titulo: 'Corazón', icono: 'HeartPulse', nodos: ['Prolonga el QT'] },
        { titulo: 'Sedación', icono: 'Moon', nodos: ['Somnolencia', 'Menos atención'] },
        { titulo: 'Metabolito', icono: 'FlaskConical', nodos: ['Cetirizina, 45 %'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Metabolito principal', 'Cetirizina, el 45 % de la dosis oral [FT]'],
    ['Semivida en adultos', 'Unas 14 horas (7 a 20) [FT]'],
    ['Personas mayores', 'Eliminación más lenta y más riesgo de efectos adversos [FT]'],
  ])],
  indicaciones: [L(['Tratamiento sintomático de la ansiedad en adultos [FT].', 'Tratamiento sintomático del prurito en adultos, adolescentes y niños desde 12 meses [FT].'])],
  posologia: [
    T(['Situación', 'Dosis'], [
      ['Ansiedad, adultos', '50 mg al día en 3 tomas (12,5 + 12,5 + 25 mg); hasta 100 mg en casos graves [FT]'],
      ['Prurito, adultos', '25 mg una hora antes de acostarse; luego hasta 25 mg 3 a 4 veces al día [FT]'],
      ['Personas mayores', 'Iniciar con la mitad; máximo 50 mg al día [FT]'],
      ['Prurito, niños desde 12 meses', '1 a 2 mg/kg/día repartidos [FT]'],
      ['Máximo en niños', 'Hasta 40 kg: 2 mg/kg/día; más de 40 kg: 100 mg al día [FT]'],
    ]),
    { barras: {
      titulo: 'Dosis máxima diaria según el paciente',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Adultos', valor: 100 },
        { etiqueta: 'Niños de más de 40 kg', valor: 100 },
        { etiqueta: 'Personas mayores', valor: 50 },
      ],
      nota: 'Ficha técnica [FT]. En niños de hasta 40 kg el máximo es 2 mg/kg/día.',
    } },
  ],
  contraindicaciones: [
    'Contraindicada en [FT]:',
    L(['Hipersensibilidad a la hidroxizina, la cetirizina, otros derivados de la piperazina, la aminofilina o la etilendiamina.', 'Porfiria.', 'Intervalo QT prolongado, congénito o adquirido, o factores de riesgo de prolongación del QT.', 'Embarazo y lactancia.']),
    { alerta: { tono: 'alto', titulo: 'Corazón', texto: 'Riesgo de prolongación del QT: se evita con antiarrítmicos de clase IA y III, algunos antipsicóticos, antidepresivos, antimaláricos, antibióticos, antifúngicos y metadona [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Efecto anticolinérgico', texto: 'Precaución en glaucoma, obstrucción vesical, menor motilidad intestinal, miastenia grave y demencia [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Fármacos que prolongan el QT', 'Riesgo de arritmia (torsade de pointes)', 'Evitar la combinación [FT]'],
    ['Depresores del sistema nervioso, alcohol', 'Más sedación', 'Evitar [FT]'],
    ['Inhibidores del CYP3A4', 'Más concentración de hidroxizina', 'Vigilar [FT]'],
    ['IMAO', 'Interacción descrita', 'Evitar [FT]'],
  ])],
  adversas: [
    'Frecuentes: somnolencia, cefalea, fatiga, boca seca y sedación [FT].',
    { claves: [
      { icono: 'Moon', titulo: 'Sedación', texto: 'Somnolencia y menor capacidad de reacción [FT].' },
      { icono: 'HeartPulse', titulo: 'QT', texto: 'Prolongación del intervalo QT [FT].' },
      { icono: 'Droplet', titulo: 'Boca seca', texto: 'Efecto anticolinérgico [FT].' },
    ] },
  ],
  embarazo: [L(['Embarazo y lactancia: contraindicada [FT].'])],
  evidencia: [
    'Su ficha técnica limita la ansiedad a los adultos y reserva el uso pediátrico para el prurito; la seguridad cardiaca es la condición para su uso [FT].',
    { triangulo: {
      titulo: 'Hidroxizina segura',
      centro: 'Antes de dispensar',
      vertices: [
        { titulo: 'Corazón', icono: 'HeartPulse', texto: 'Sin QT largo ni fármacos que lo alarguen [FT].' },
        { titulo: 'Edad', icono: 'PersonStanding', texto: 'Mitad de dosis en mayores [FT].' },
        { titulo: 'Embarazo', icono: 'Ban', texto: 'Contraindicada en embarazo y lactancia [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 11 registros sanitarios vigentes con el código ATC N05BB01; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Atarax 25 mg comprimidos y 2 mg/ml jarabe [FT].'])],
  atencion: {
    intro: 'La hidroxizina parece un antialérgico más, pero su ficha técnica exige revisar el corazón, la edad y el embarazo antes de cada dispensación [FT,MN].',
    necesidades: [
      ['Indicación', 'Prurito o ansiedad en adultos [FT]'],
      ['Efectividad', 'Alivio del picor o de la ansiedad [FT]'],
      ['Seguridad', 'QT, edad, embarazo, sedación [FT]'],
      ['Interacciones', 'Fármacos que prolongan el QT y depresores [FT]'],
    ],
    prf: [
      ['Interacción', 'Uso junto con un antipsicótico o metadona', 'Consultar al médico por el riesgo de QT [FT]'],
      ['Dosis demasiado alta', 'Persona de 80 años con 75 mg al día', 'Máximo 50 mg al día [FT]'],
      ['Seguridad', 'Mujer embarazada con prurito', 'Contraindicada: remitir [FT]'],
    ],
    plan: ['Revisar la lista completa de medicamentos en busca de fármacos que alarguen el QT [FT].', 'Advertir sobre la conducción [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Algunos pacientes la valoran porque «les ayuda a dormir». Ese beneficio percibido es también el riesgo de caídas en personas mayores [EX].',
    preguntas: ['¿Para qué se la recetaron?', '¿Le da mucho sueño durante el día?', '¿Toma medicamentos para el corazón, la mente o infecciones?'],
    quiz: {
      pregunta: '¿Cuál es la dosis máxima diaria de hidroxizina en personas mayores según su ficha técnica?',
      opciones: [
        { texto: '50 mg al día', correcta: true, retro: 'Además se inicia con la mitad de la dosis [FT].' },
        { texto: '100 mg al día', correcta: false, retro: 'Ese es el máximo de los adultos jóvenes [FT].' },
        { texto: '200 mg al día', correcta: false, retro: 'Supera cualquier máximo de la ficha técnica [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.psico, GUIAS.seguridad],
  refs: { FT: F.ftHidroxizina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Cetirizina: farmacología', '/vademecum/cetirizina'], ['Clorfeniramina: farmacología', '/vademecum/clorfeniramina'], ['Alergia y vías respiratorias', '/vademecum/alergia-y-vias-respiratorias']],
  seo: {
    titulo: 'Hidroxizina: dosis, QT y atención farmacéutica',
    descripcion: 'Hidroxizina: prurito y ansiedad, dosis máxima en adultos, mayores y niños, prolongación del QT, sedación, embarazo y atención farmacéutica.',
  },
});
