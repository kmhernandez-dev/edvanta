import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Espironolactona. Verificada el 16-nov-2026: ficha técnica de CIMA (Aldactone 25 mg) y CUM del INVIMA (15 registros vigentes con ATC C03DA01). */
export default crearMonografia({
  slug: 'espironolactona',
  nombre: 'Espironolactona',
  grupo: 'medicamentos-para-la-hipertension-arterial',
  clase: 'Diurético antagonista de la aldosterona (ahorrador de potasio)',
  atc: 'C03DA01',
  vias: ['Oral'],
  mecanismo: 'Antagonista específico de la aldosterona que compite por sus receptores en el túbulo contorneado distal: elimina sodio y agua y retiene potasio.',
  resumenCorto: 'antagonista de la aldosterona para insuficiencia cardiaca grave, hipertensión, hiperaldosteronismo y edemas; el riesgo número uno es la hiperpotasemia.',
  resumen: 'La espironolactona es un antagonista específico de la aldosterona: compite por sus receptores en el túbulo distal, de modo que el riñón elimina sodio y agua pero retiene potasio. Su ficha técnica la indica en la hipertensión esencial, la insuficiencia cardiaca crónica clases III y IV junto al tratamiento convencional, el hiperaldosteronismo primario y los edemas por hiperaldosteronismo secundario (cirrosis, insuficiencia cardiaca, síndrome nefrótico). En la insuficiencia cardiaca, siguiendo el estudio RALES, se inicia con 25 mg al día si el potasio y la creatinina lo permiten. Su gran riesgo es la hiperpotasemia, sobre todo con IECA, ARA-II, suplementos de potasio o AINE. La ginecomastia es su reacción adversa más frecuente.',
  datosClave: [
    ['Clase', 'Antagonista de la aldosterona [FT]'],
    ['Código ATC', 'C03DA01 [CUM]'],
    ['Insuficiencia cardiaca', '25 mg al día; puede subir a 50 mg [FT]'],
    ['Hipertensión', '50 a 100 mg al día; hasta 200 mg [FT]'],
    ['Biodisponibilidad', 'Cerca del 90 % [FT]'],
    ['Colombia', '15 registros vigentes con el código ATC C03DA01 [CUM]'],
  ],
  quimica: ['La presentación de referencia son comprimidos recubiertos de 25 mg (también de 100 mg) [FT].'],
  dinamia: [
    'Antagonista farmacológico específico de la aldosterona, que actúa por unión competitiva a los receptores del intercambio sodio-potasio dependiente de aldosterona en el túbulo contorneado distal [FT].',
    { mapa: {
      centro: 'Espironolactona',
      ramas: [
        { titulo: 'Corazón', icono: 'HeartPulse', nodos: ['Insuficiencia cardiaca III y IV'] },
        { titulo: 'Presión', icono: 'Gauge', nodos: ['Hipertensión esencial'] },
        { titulo: 'Edemas', icono: 'Droplets', nodos: ['Cirrosis', 'Síndrome nefrótico'] },
        { titulo: 'Potasio', icono: 'AlertTriangle', nodos: ['Hiperpotasemia'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Biodisponibilidad oral', 'Cerca del 90 %; los alimentos la aumentan un poco [FT]'],
    ['Concentración máxima', 'Unas 2,6 horas con 100 mg diarios [FT]'],
  ])],
  indicaciones: [L(['Hipertensión arterial esencial [FT].', 'Insuficiencia cardiaca crónica clases III y IV de la NYHA, con el tratamiento convencional [FT].', 'Hiperaldosteronismo primario [FT].', 'Edemas por hiperaldosteronismo secundario: cirrosis, insuficiencia cardiaca y síndrome nefrótico [FT].'])],
  posologia: [
    T(['Indicación', 'Dosis'], [
      ['Hipertensión esencial', '50 a 100 mg al día; hasta 200 mg, en intervalos de 2 semanas [FT]'],
      ['Insuficiencia cardiaca grave', '25 mg una vez al día si el potasio y la creatinina lo permiten; puede subir a 50 mg [FT]'],
    ]),
    { barras: {
      titulo: 'Dosis diaria según la indicación (mg)',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Hipertensión, máximo', valor: 200 },
        { etiqueta: 'Hipertensión, inicio alto', valor: 100 },
        { etiqueta: 'Insuficiencia cardiaca, máximo habitual', valor: 50 },
        { etiqueta: 'Insuficiencia cardiaca, inicio', valor: 25 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  contraindicaciones: [
    'Contraindicada en insuficiencia renal moderada a grave, insuficiencia renal aguda o anuria, hiperpotasemia, enfermedad de Addison, uso de eplerenona e hipersensibilidad [FT].',
    { alerta: { tono: 'alto', titulo: 'Hiperpotasemia', texto: 'Puede ser grave con otros ahorradores de potasio, IECA, ARA-II, heparinas, suplementos de potasio, sustitutos de la sal con potasio, AINE y betabloqueadores [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Suplementos de potasio, otros ahorradores', 'Hiperpotasemia', 'Evitar [FT]'],
    ['IECA, ARA-II', 'Hiperpotasemia', 'Vigilar potasio [FT]'],
    ['AINE', 'Hiperpotasemia y menos efecto', 'Evitar o vigilar [FT]'],
    ['Eplerenona', 'Doble bloqueo de la aldosterona', 'Contraindicado [FT]'],
  ])],
  adversas: ['La ginecomastia es la más frecuente, sobre todo en tratamientos de 2 a 7 meses; con dosis de hasta 100 mg aparece en el 13 % y suele revertir al suspender [FT].'],
  embarazo: [L(['Embarazo: datos limitados; toxicidad reproductiva en animales por su efecto antiandrogénico [FT].'])],
  evidencia: [
    'Su pauta en la insuficiencia cardiaca grave proviene del estudio RALES, citado en la ficha técnica, con controles de potasio y creatinina [FT].',
    { triangulo: {
      titulo: 'Los tres controles de la espironolactona',
      centro: 'Potasio bajo control',
      vertices: [
        { titulo: 'Potasio', icono: 'FlaskConical', texto: 'Antes de iniciar y durante el tratamiento [FT].' },
        { titulo: 'Riñón', icono: 'Droplets', texto: 'Contraindicada en insuficiencia moderada a grave [FT].' },
        { titulo: 'Combinaciones', icono: 'Shuffle', texto: 'IECA, ARA-II, AINE y suplementos [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 15 registros sanitarios vigentes con el código ATC C03DA01; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Aldactone 25 mg y 100 mg comprimidos [FT].'])],
  atencion: {
    intro: 'La espironolactona salva vidas en la insuficiencia cardiaca, y por eso el control del potasio no puede fallar. El farmacéutico revisa cada combinación [FT,MN].',
    necesidades: [
      ['Indicación', 'Insuficiencia cardiaca, hipertensión, hiperaldosteronismo o edemas [FT]'],
      ['Efectividad', 'Menos síntomas y edema [FT]'],
      ['Seguridad', 'Potasio, riñón, ginecomastia [FT]'],
      ['Interacciones', 'IECA, ARA-II, AINE, suplementos [FT]'],
    ],
    prf: [
      ['Interacción', 'Le recetan un AINE para el dolor', 'Consultar al médico por el potasio [FT]'],
      ['Seguridad', 'Toma un suplemento con potasio', 'Suspender y consultar [FT]'],
      ['Reacción adversa', 'Ginecomastia dolorosa', 'Remitir [FT]'],
    ],
    plan: ['Verificar la fecha del último potasio [FT].', 'Revisar sustitutos de la sal y suplementos [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'La ginecomastia avergüenza a muchos hombres, que suspenden el medicamento sin contarlo. Preguntar con naturalidad abre la conversación [EX].',
    preguntas: ['¿Cuándo le midieron el potasio?', '¿Toma algo para el dolor?', '¿Ha notado cambios en el pecho?'],
    quiz: {
      pregunta: '¿Cuál es la reacción adversa más frecuente de la espironolactona según su ficha técnica?',
      opciones: [
        { texto: 'Ginecomastia', correcta: true, retro: 'Con dosis de hasta 100 mg aparece en el 13 % [FT].' },
        { texto: 'Tos seca', correcta: false, retro: 'Es típica de los IECA [FT].' },
        { texto: 'Hipopotasemia', correcta: false, retro: 'Retiene potasio: el riesgo es la hiperpotasemia [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.ic, GUIAS.afHta],
  refs: { FT: F.ftEspironolactona, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Furosemida: farmacología', '/vademecum/furosemida'], ['Valsartán: farmacología', '/vademecum/valsartan'], ['Medicamentos para la hipertensión arterial', '/vademecum/medicamentos-para-la-hipertension-arterial']],
  seo: {
    titulo: 'Espironolactona: dosis, potasio y consejería',
    descripcion: 'Espironolactona: antagonista de la aldosterona para insuficiencia cardiaca, hipertensión y edemas; dosis, hiperpotasemia, ginecomastia y consejería.',
  },
});
