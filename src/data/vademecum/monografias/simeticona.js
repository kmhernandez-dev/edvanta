import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Simeticona. Verificada el 16-nov-2026: ficha técnica de CIMA (Aero Red 40 mg) y CUM del INVIMA (12 registros con ATC A03AX13, siliconas). */
export default crearMonografia({
  slug: 'simeticona',
  nombre: 'Simeticona',
  grupo: 'medicamentos-para-el-aparato-digestivo',
  clase: 'Antiflatulento (silicona)',
  atc: 'A03AX13',
  vias: ['Oral'],
  mecanismo: 'Sustancia inerte que no se absorbe; modifica la tensión superficial de las burbujas de gas y facilita que se unan y se eliminen.',
  resumenCorto: 'antiflatulento que no se absorbe: 80 mg después de las comidas, máximo 480 mg al día; consultar si los gases persisten más de 10 días.',
  resumen: 'La simeticona es una silicona fisiológicamente inerte que no se absorbe. Cambia la tensión superficial de las burbujas de gas en el intestino para que se unan y se eliminen, y así alivia la sensación de gases. Al no absorberse, casi no tiene efectos sistémicos y puede usarse en el embarazo y la lactancia. Su ficha técnica pide evaluar al paciente si los síntomas empeoran, duran más de 10 días o hay estreñimiento prolongado, y no la recomienda para el cólico del lactante. La atención farmacéutica se centra en no tapar un problema digestivo de fondo.',
  datosClave: [
    ['Clase', 'Antiflatulento [FT]'],
    ['Código ATC', 'A03AX13 (siliconas) [CUM]'],
    ['Dosis habitual', '80 mg tres veces al día después de las comidas [FT]'],
    ['Máximo diario', '480 mg [FT]'],
    ['Absorción', 'No se absorbe [FT]'],
    ['Colombia', '12 registros vigentes con el código ATC A03AX13 [CUM]'],
  ],
  quimica: ['Es una silicona fisiológicamente inerte; la presentación de referencia son comprimidos masticables de 40 mg [FT].'],
  dinamia: [
    'No tiene actividad farmacológica: actúa físicamente, modificando la tensión superficial de las burbujas de gas para que coalescan y se eliminen [FT].',
    { claves: [
      { icono: 'Waves', titulo: 'Acción física', texto: 'Une las burbujas pequeñas en burbujas grandes que se expulsan [FT].' },
      { icono: 'ShieldCheck', titulo: 'No se absorbe', texto: 'Por eso casi no tiene efectos sistémicos [FT].' },
      { icono: 'Utensils', titulo: 'Con las comidas', texto: 'Se toma después de las comidas principales [FT].' },
    ] },
  ],
  cinetica: ['No se absorbe a través de la mucosa gastrointestinal [FT].'],
  indicaciones: ['Alivio sintomático de los gases en adultos [FT].'],
  posologia: [
    T(['Situación', 'Dosis'], [
      ['Adultos', '80 mg (2 comprimidos de 40 mg) tres veces al día, después de las comidas principales [FT]'],
      ['Máximo diario', '480 mg (12 comprimidos de 40 mg) [FT]'],
    ]),
    { barras: {
      titulo: 'Dosis habitual frente a dosis máxima diaria',
      unidad: 'mg al día',
      datos: [
        { etiqueta: 'Máximo diario', valor: 480 },
        { etiqueta: 'Dosis habitual (80 mg × 3)', valor: 240 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad y en perforación u obstrucción intestinal conocida o sospechada [FT].',
    { alerta: { tono: 'medio', titulo: 'Cuándo dejar de tratar el síntoma', texto: 'Si los síntomas empeoran, persisten más de 10 días o hay estreñimiento prolongado, hay que evaluar al paciente. No se recomienda para el cólico del lactante [FT].' } },
  ],
  interacciones: ['No se han realizado estudios de interacciones [FT]. Al no absorberse, no se esperan interacciones sistémicas relevantes.'],
  adversas: [L(['Frecuencia no conocida: reacciones de hipersensibilidad (erupción, picor, edema de cara o lengua, dificultad para respirar), estreñimiento transitorio y náuseas [FT].'])],
  embarazo: [L(['Embarazo y lactancia: la exposición sistémica es insignificante; puede usarse [FT].'])],
  evidencia: ['Su perfil se explica por su acción física y su falta de absorción: alivia el síntoma sin efectos sistémicos, pero no trata la causa de los gases [FT].'],
  regulacion: [L(['Colombia: 12 registros sanitarios vigentes con el código ATC A03AX13 (siliconas); consulta del 16-nov-2026 [CUM].', 'España: autorizada como Aero Red 40 mg comprimidos masticables [FT].'])],
  atencion: {
    intro: 'La simeticona es segura; el riesgo está en usarla semanas para un síntoma que necesita evaluación [FT,MN].',
    necesidades: [
      ['Indicación', 'Gases y distensión ocasional [FT]'],
      ['Efectividad', 'Alivio en días; si no, evaluar [FT]'],
      ['Seguridad', 'Signos de obstrucción, síntomas de más de 10 días [FT]'],
      ['Adherencia', 'Después de las comidas, sin pasar de 480 mg [FT]'],
    ],
    prf: [
      ['Farmacoterapia innecesaria', 'Uso diario por meses sin evaluación', 'Remitir para estudiar la causa [FT]'],
      ['Seguridad', 'Distensión con vómito y sin deposiciones', 'Remitir de urgencia [FT]'],
      ['Indicación', 'Cólico del lactante', 'No recomendada por la ficha técnica [FT]'],
    ],
    plan: ['Explicar el límite de 10 días sin mejoría [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Los gases afectan la vida social y generan ansiedad. Preguntar por la dieta, el estrés y los hábitos ayuda más que repetir el antiflatulento [EX].',
    preguntas: ['¿Desde cuándo tiene los gases?', '¿Ha cambiado su alimentación o sus deposiciones?', '¿Ha tenido vómito o dolor fuerte?'],
    quiz: {
      pregunta: '¿Por qué la simeticona puede usarse en el embarazo según su ficha técnica?',
      opciones: [
        { texto: 'Porque su exposición sistémica es insignificante', correcta: true, retro: 'No se absorbe por la mucosa intestinal [FT].' },
        { texto: 'Porque protege el estómago del bebé', correcta: false, retro: 'No tiene ese efecto [FT].' },
        { texto: 'Porque es un antibiótico suave', correcta: false, retro: 'Es una silicona inerte sin acción farmacológica [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.gastro, GUIAS.problemas],
  refs: { FT: F.ftSimeticona, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Butilescopolamina: farmacología', '/vademecum/butilescopolamina'], ['Medicamentos para el aparato digestivo', '/vademecum/medicamentos-para-el-aparato-digestivo']],
  seo: {
    titulo: 'Simeticona: farmacología y atención farmacéutica',
    descripcion: 'Simeticona: cómo actúa sobre los gases, dosis después de las comidas, máximo 480 mg al día, embarazo, señales para consultar y atención farmacéutica.',
  },
});
