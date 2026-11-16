import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Desloratadina. Verificada el 16-nov-2026: ficha técnica de CIMA (Aerius 5 mg) y CUM del INVIMA (57 registros vigentes con ATC R06AX27). */
export default crearMonografia({
  slug: 'desloratadina',
  nombre: 'Desloratadina',
  grupo: 'alergia-y-vias-respiratorias',
  clase: 'Antihistamínico H1 de segunda generación',
  atc: 'R06AX27',
  vias: ['Oral'],
  mecanismo: 'Metabolito activo primario de la loratadina; antagonista selectivo, no sedante y de acción prolongada del receptor H1 periférico.',
  resumenCorto: 'metabolito activo de la loratadina: 5 mg una vez al día para rinitis alérgica y urticaria, con semivida de unas 27 horas.',
  resumen: 'La desloratadina es el metabolito activo primario de la loratadina, comercializado como medicamento propio. Es un antagonista selectivo del receptor H1 periférico, no sedante y de acción prolongada: se detecta en sangre antes de 30 minutos y su semivida es de unas 27 horas. Su ficha técnica la indica en la rinitis alérgica y la urticaria en adultos y adolescentes desde 12 años, con una dosis única diaria de 5 mg. Un dato que pocos conocen: cerca del 4 % de las personas son metabolizadores lentos y alcanzan concentraciones tres veces mayores, con una semivida de unas 89 horas.',
  datosClave: [
    ['Clase', 'Antihistamínico H1 de segunda generación [FT]'],
    ['Código ATC', 'R06AX27 [CUM]'],
    ['Dosis', '5 mg una vez al día desde los 12 años [FT]'],
    ['Semivida', 'Unas 27 horas [FT]'],
    ['Metabolizadores lentos', 'Cerca del 4 %: semivida de unas 89 horas [FT]'],
    ['Colombia', '57 registros vigentes con el código ATC R06AX27 [CUM]'],
  ],
  quimica: ['Es el metabolito activo primario de la loratadina; la presentación de referencia son comprimidos recubiertos de 5 mg [FT].'],
  dinamia: [
    'Antagonista selectivo del receptor H1 periférico, de acción prolongada y no sedante [FT].',
    { mapa: {
      centro: 'Desloratadina',
      ramas: [
        { titulo: 'Origen', icono: 'FlaskConical', nodos: ['Metabolito de la loratadina'] },
        { titulo: 'Rinitis alérgica', icono: 'Wind', nodos: ['Alivio sintomático'] },
        { titulo: 'Urticaria', icono: 'Layers', nodos: ['Alivio sintomático'] },
        { titulo: 'Duración', icono: 'Clock', nodos: ['27 horas', '89 en metabolizadores lentos'] },
      ],
    } },
  ],
  cinetica: [
    T(['Parámetro', 'Valor'], [
      ['Inicio', 'Detectable en sangre antes de 30 minutos [FT]'],
      ['Semivida', 'Unas 27 horas [FT]'],
      ['Metabolizadores lentos', 'Cerca del 4 %: concentración 3 veces mayor y semivida de unas 89 horas [FT]'],
    ]),
    { barras: {
      titulo: 'Semivida de eliminación (horas)',
      unidad: ['hora', 'horas'],
      datos: [
        { etiqueta: 'Metabolizadores lentos', valor: 89 },
        { etiqueta: 'Población general', valor: 27 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  indicaciones: ['Alivio de los síntomas de la rinitis alérgica y de la urticaria en adultos y adolescentes desde 12 años [FT].'],
  posologia: [T(['Situación', 'Dosis'], [
    ['Adultos y adolescentes desde 12 años', '5 mg una vez al día [FT]'],
  ])],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad a la desloratadina, a los excipientes o a la loratadina [FT].',
    { alerta: { tono: 'medio', titulo: 'Convulsiones', texto: 'Usar con precaución en personas con antecedentes personales o familiares de crisis convulsivas [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Eritromicina, ketoconazol', 'Estudiados en ensayos de interacción', 'Vigilar [FT]'],
    ['Alcohol', 'Estudiado en ensayos de interacción', 'Prudencia hasta conocer la respuesta [FT]'],
  ])],
  adversas: [{ barras: {
    titulo: 'Reacciones adversas más notificadas',
    unidad: '%',
    datos: [
      { etiqueta: 'Cansancio', valor: 1.2 },
      { etiqueta: 'Boca seca', valor: 0.8 },
      { etiqueta: 'Cefalea', valor: 0.6 },
    ],
    nota: 'Ficha técnica [FT].',
  } }],
  embarazo: [L(['Embarazo: es preferible evitarla [FT].', 'Lactancia: se ha detectado en lactantes de madres tratadas; decidir entre suspender la lactancia o el tratamiento [FT].'])],
  evidencia: [
    'En los ensayos clínicos su influencia sobre la conducción fue nula o insignificante; aun así, se aconseja esperar a conocer la respuesta individual antes de actividades que requieran alerta [FT].',
    { triangulo: {
      titulo: 'Loratadina o desloratadina',
      centro: 'La misma familia',
      vertices: [
        { titulo: 'Relación', icono: 'GitBranch', texto: 'La desloratadina es el metabolito activo de la loratadina [FT].' },
        { titulo: 'Dosis', icono: 'Pill', texto: '5 mg de desloratadina; 10 mg de loratadina [FT].' },
        { titulo: 'Alergia cruzada', icono: 'AlertTriangle', texto: 'La hipersensibilidad a la loratadina la contraindica [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 57 registros sanitarios vigentes con el código ATC R06AX27; consulta del 16-nov-2026 [CUM].', 'Unión Europea: autorizada como Aerius 5 mg comprimidos recubiertos con película [FT].'])],
  atencion: {
    intro: 'Con tantos registros disponibles, el reto no es conseguir desloratadina sino evitar duplicidades: que el paciente no la tome junto con loratadina u otro antihistamínico [FT,MN].',
    necesidades: [
      ['Indicación', 'Rinitis alérgica o urticaria [FT]'],
      ['Efectividad', 'Control de síntomas con una toma diaria [FT]'],
      ['Seguridad', 'Convulsiones, embarazo, lactancia [FT]'],
      ['Adherencia', 'Una toma al día [FT]'],
    ],
    prf: [
      ['Farmacoterapia innecesaria', 'Toma loratadina y desloratadina a la vez', 'Dejar un solo antihistamínico [FT]'],
      ['Seguridad', 'Antecedente de convulsiones', 'Usar con precaución y consultar [FT]'],
      ['Reacción adversa', 'Cansancio persistente', 'Valorar metabolizador lento o cambio [FT]'],
    ],
    plan: ['Revisar la lista completa de antihistamínicos que usa [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Quien probó varios antihistamínicos tiene preferencias firmes. Escucharlas evita cambios que el paciente no aceptará [EX].',
    preguntas: ['¿Qué antihistamínicos ha usado antes y cómo le fue?', '¿Toma otro medicamento para la alergia?', '¿Ha tenido convulsiones o alguien en su familia?'],
    quiz: {
      pregunta: '¿Qué relación tiene la desloratadina con la loratadina?',
      opciones: [
        { texto: 'Es su metabolito activo primario', correcta: true, retro: 'Así la describe su ficha técnica [FT].' },
        { texto: 'Son antihistamínicos sin relación', correcta: false, retro: 'Son de la misma familia [FT].' },
        { texto: 'Es su forma inyectable', correcta: false, retro: 'Se usa por vía oral [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.respiratoria, GUIAS.problemas],
  refs: { FT: F.ftDesloratadina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Loratadina: farmacología', '/vademecum/loratadina'], ['Alergia y vías respiratorias', '/vademecum/alergia-y-vias-respiratorias']],
  seo: {
    titulo: 'Desloratadina: dosis, farmacología y consejería',
    descripcion: 'Desloratadina: metabolito de la loratadina, dosis de 5 mg, semivida de 27 horas, metabolizadores lentos, efectos adversos y atención farmacéutica.',
  },
});
