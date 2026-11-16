import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Cetirizina. Verificada el 16-nov-2026: ficha técnica de CIMA (Zyrtec 10 mg) y CUM del INVIMA (53 registros vigentes con ATC R06AE07). */
export default crearMonografia({
  slug: 'cetirizina',
  nombre: 'Cetirizina',
  grupo: 'alergia-y-vias-respiratorias',
  clase: 'Antihistamínico H1 de segunda generación',
  atc: 'R06AE07',
  vias: ['Oral'],
  mecanismo: 'Inhibidor potente y selectivo de los receptores H1 periféricos; es el metabolito humano de la hidroxizina.',
  resumenCorto: 'antihistamínico para rinitis alérgica y urticaria crónica: 10 mg al día, se elimina por el riñón y da más sueño que la loratadina.',
  resumen: 'La cetirizina es un antihistamínico H1 de segunda generación y el metabolito humano de la hidroxizina. Su ficha técnica la indica en los síntomas nasales y oculares de la rinitis alérgica estacional y perenne, y en la urticaria crónica idiopática, desde los 6 años. Alcanza su concentración máxima en una hora y se elimina sobre todo por el riñón: dos tercios de la dosis salen sin cambios por la orina, por lo que la dosis se ajusta según la función renal y está contraindicada en la enfermedad renal terminal. La somnolencia es su efecto adverso más frecuente: 9,6 % frente a 5 % con placebo.',
  datosClave: [
    ['Clase', 'Antihistamínico H1 de segunda generación [FT]'],
    ['Código ATC', 'R06AE07 [CUM]'],
    ['Dosis en adultos', '10 mg una vez al día [FT]'],
    ['Eliminación', 'Dos tercios sin cambios por la orina [FT]'],
    ['Somnolencia', '9,63 % frente a 5,00 % con placebo [FT]'],
    ['Colombia', '53 registros vigentes con el código ATC R06AE07 [CUM]'],
  ],
  quimica: ['Derivado piperazínico; la presentación de referencia son comprimidos recubiertos de 10 mg [FT].', 'Es el metabolito humano de la hidroxizina: quien es alérgico a una puede serlo a la otra [FT].'],
  dinamia: [
    'Inhibe de forma potente y selectiva los receptores H1 periféricos [FT].',
    { claves: [
      { icono: 'Wind', titulo: 'Rinitis', texto: 'Síntomas nasales y oculares, estacional y perenne [FT].' },
      { icono: 'Layers', titulo: 'Urticaria', texto: 'Urticaria crónica idiopática [FT].' },
      { icono: 'Droplets', titulo: 'Vía renal', texto: 'Dos tercios se eliminan sin cambios por la orina [FT].' },
    ] },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Concentración máxima', '1,0 ± 0,5 horas [FT]'],
    ['Semivida', 'Unas 10 horas en adultos; 6 horas de 6 a 12 años; 5 horas de 2 a 6 años [FT]'],
    ['Eliminación', 'Renal: dos tercios sin cambios [FT]'],
  ])],
  indicaciones: ['Alivio de los síntomas nasales y oculares de la rinitis alérgica estacional y perenne, y de la urticaria crónica idiopática, en adultos y niños desde 6 años [FT].'],
  posologia: [
    T(['Situación', 'Dosis'], [
      ['Adultos y mayores de 12 años', '10 mg una vez al día [FT]'],
      ['Niños de 6 a 12 años', '5 mg dos veces al día [FT]'],
      ['Menores de 6 años', 'Comprimidos no recomendados [FT]'],
    ]),
    'Ajuste según la tasa de filtración glomerular estimada (ml/min) [FT]:',
    T(['Función renal', 'Dosis'], [
      ['90 o más, y 60 a menos de 90', '10 mg una vez al día [FT]'],
      ['30 a menos de 60', '5 mg una vez al día [FT]'],
      ['15 a menos de 30, sin diálisis', '5 mg cada 2 días [FT]'],
      ['Menos de 15, con diálisis', 'Contraindicada [FT]'],
    ]),
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad a la cetirizina, a la hidroxizina o a derivados piperazínicos, y en la enfermedad renal terminal [FT].',
    { alerta: { tono: 'medio', titulo: 'Precauciones', texto: 'Retención urinaria (lesión medular, hiperplasia prostática), epilepsia o riesgo de convulsiones y consumo de alcohol [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Picor al suspender', texto: 'Al dejarla puede aparecer prurito o urticaria, a veces intensos [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Alcohol y otros depresores del sistema nervioso', 'Puede disminuir más la atención en personas sensibles', 'Evitar la combinación [FT]'],
    ['Pseudoefedrina, teofilina', 'Sin interacción en los estudios', 'Sin restricción específica [FT]'],
  ])],
  adversas: [
    { barras: {
      titulo: 'Reacciones adversas en adultos: cetirizina frente a placebo',
      unidad: '%',
      datos: [
        { etiqueta: 'Somnolencia con cetirizina', valor: 9.63 },
        { etiqueta: 'Somnolencia con placebo', valor: 5 },
        { etiqueta: 'Boca seca con cetirizina', valor: 2.09 },
        { etiqueta: 'Fatiga con cetirizina', valor: 1.63 },
      ],
      nota: 'Ficha técnica [FT]. La cefalea fue similar con cetirizina (7,42 %) y con placebo (8,07 %).',
    } },
  ],
  embarazo: [L(['Embarazo: los datos no sugieren toxicidad; usar con precaución [FT].', 'Lactancia: pasa a la leche entre el 25 % y el 90 % de la concentración plasmática; usar con precaución [FT].'])],
  evidencia: [
    'A la dosis de 10 mg no muestra efectos clínicos relevantes sobre la conducción, pero quien sienta somnolencia no debe conducir [FT].',
    { triangulo: {
      titulo: 'Antes de dispensar cetirizina',
      centro: 'Revisión rápida',
      vertices: [
        { titulo: 'Riñón', icono: 'Droplets', texto: 'Ajustar según la filtración glomerular [FT].' },
        { titulo: 'Sueño', icono: 'Moon', texto: 'Somnolencia en casi 1 de cada 10 [FT].' },
        { titulo: 'Próstata', icono: 'AlertTriangle', texto: 'Precaución si hay riesgo de retención urinaria [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 53 registros sanitarios vigentes con el código ATC R06AE07; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Zyrtec 10 mg comprimidos recubiertos con película [FT].'])],
  atencion: {
    intro: 'La cetirizina funciona bien, pero su eliminación renal y su perfil de somnolencia piden una pregunta más que otros antihistamínicos [FT,MN].',
    necesidades: [
      ['Indicación', 'Rinitis alérgica o urticaria crónica [FT]'],
      ['Efectividad', 'Alivio de los síntomas [FT]'],
      ['Seguridad', 'Función renal, somnolencia, retención urinaria [FT]'],
      ['Adherencia', 'Una toma al día, o dos en niños [FT]'],
    ],
    prf: [
      ['Dosis demasiado alta', 'Adulto mayor con filtración de 40 ml/min tomando 10 mg', 'Proponer 5 mg al día [FT]'],
      ['Reacción adversa', 'Somnolencia al conducir', 'Cambiar la hora o el antihistamínico con el médico [FT]'],
      ['Seguridad', 'Picor intenso al suspender', 'Explicar que puede pasar y consultar [FT]'],
    ],
    plan: ['Preguntar por la función renal en mayores [FT].', 'Advertir sobre el alcohol y la conducción [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'En la urticaria crónica, el paciente convive meses con el picor y con el miedo a que «no se le quite». Acompañar ese proceso es tan importante como la dosis [EX].',
    preguntas: ['¿Le da sueño? ¿A qué hora la toma?', '¿Toma alcohol?', '¿Ha tenido problemas para orinar?'],
    quiz: {
      pregunta: 'Paciente con filtración glomerular de 45 ml/min. ¿Qué dosis de cetirizina indica la ficha técnica?',
      opciones: [
        { texto: '5 mg una vez al día', correcta: true, retro: 'Es la dosis para una función renal de 30 a menos de 60 ml/min [FT].' },
        { texto: '10 mg una vez al día', correcta: false, retro: 'Esa es la dosis con función renal de 60 ml/min o más [FT].' },
        { texto: 'Está contraindicada', correcta: false, retro: 'Solo se contraindica por debajo de 15 ml/min con diálisis [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.respiratoria, GUIAS.farmacocinetica],
  refs: { FT: F.ftCetirizina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Hidroxizina: farmacología', '/vademecum/hidroxizina'], ['Loratadina: farmacología', '/vademecum/loratadina'], ['Alergia y vías respiratorias', '/vademecum/alergia-y-vias-respiratorias']],
  seo: {
    titulo: 'Cetirizina: dosis, ajuste renal y atención farmacéutica',
    descripcion: 'Cetirizina: mecanismo, dosis en adultos y niños, ajuste por función renal, somnolencia frente a placebo, embarazo y atención farmacéutica.',
  },
});
