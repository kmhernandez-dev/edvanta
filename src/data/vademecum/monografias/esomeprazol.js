import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Esomeprazol. Verificado el 16-nov-2026: ficha técnica de CIMA (Esomeprazol Stada) y CUM del INVIMA (63 registros con ATC A02BC05). */
export default crearMonografia({
  slug: 'esomeprazol',
  nombre: 'Esomeprazol',
  grupo: 'medicamentos-para-el-aparato-digestivo',
  clase: 'Inhibidor de la bomba de protones',
  atc: 'A02BC05',
  vias: ['Oral', 'Inyectable'],
  mecanismo: 'Inhibidor específico de la bomba de ácido de la célula parietal; reduce la secreción ácida basal y estimulada.',
  resumenCorto: 'IBP con 63 registros en Colombia: reflujo, H. pylori, úlcera por AINE y prevención del resangrado; máximo 20 mg en insuficiencia hepática grave.',
  resumen: 'El esomeprazol es un inhibidor de la bomba de protones indicado en el reflujo gastroesofágico, la erradicación de Helicobacter pylori, la úlcera asociada a AINE, la prevención del resangrado tras una úlcera tratada por vía intravenosa y el síndrome de Zollinger-Ellison. Comparte el perfil de seguridad de su grupo: en uso prolongado se asocia con hipomagnesemia y fracturas. En Colombia es el IBP con más registros vigentes. La atención farmacéutica se centra en la duración, las interacciones y la revisión del tratamiento crónico.',
  datosClave: [
    ['Clase', 'Inhibidor de la bomba de protones [FT]'],
    ['Código ATC', 'A02BC05 [CUM]'],
    ['Dosis habitual', '20 a 40 mg una vez al día según la indicación [FT]'],
    ['Metabolismo', 'Citocromo P450, sobre todo CYP2C19 y CYP3A4 [FT]'],
    ['Semivida', 'Cerca de 1,3 horas con dosis repetidas [FT]'],
    ['Colombia', '63 registros vigentes con el código ATC A02BC05 [CUM]'],
  ],
  quimica: [
    'La ficha técnica de referencia corresponde a comprimidos gastrorresistentes de 20 y 40 mg de esomeprazol magnésico [FT].',
    'Se une en un 97 % a las proteínas plasmáticas [FT].',
  ],
  dinamia: [
    'Es un inhibidor específico de la bomba de ácido de la célula parietal: reduce tanto la secreción ácida basal como la estimulada [FT].',
    { claves: [
      { icono: 'Target', titulo: 'Bomba de protones', texto: 'Bloquea el último paso de la secreción de ácido [FT].' },
      { icono: 'Flame', titulo: 'Reflujo', texto: '40 mg al día cicatrizan la esofagitis erosiva en 4 a 8 semanas [FT].' },
      { icono: 'Bug', titulo: 'H. pylori', texto: 'Base de la triple terapia de 7 días [FT].' },
    ] },
  ],
  cinetica: [
    T(['Parámetro', 'Valor'], [
      ['Concentración máxima', '1 a 2 horas [FT]'],
      ['Unión a proteínas', '97 % [FT]'],
      ['Metabolismo', 'Completo por citocromo P450, sobre todo CYP2C19 y CYP3A4 [FT]'],
      ['Semivida', 'Cerca de 1,3 horas con dosis repetidas [FT]'],
      ['Eliminación', 'Casi 80 % como metabolitos en orina; menos del 1 % inalterado [FT]'],
    ]),
  ],
  indicaciones: [
    { mapa: {
      centro: 'Esomeprazol',
      ramas: [
        { titulo: 'Reflujo', icono: 'Flame', nodos: ['Esofagitis erosiva', 'Prevención de recidivas', 'Tratamiento sintomático'] },
        { titulo: 'H. pylori', icono: 'Bug', nodos: ['Con amoxicilina y claritromicina', 'Úlcera duodenal'] },
        { titulo: 'AINE', icono: 'Shield', nodos: ['Cicatrización', 'Prevención'] },
        { titulo: 'Resangrado', icono: 'Droplet', nodos: ['Continuación tras la vía intravenosa'] },
        { titulo: 'Zollinger-Ellison', icono: 'AlertTriangle', nodos: ['80 a 160 mg al día'] },
      ],
    } },
    'En adolescentes desde 12 años está indicado en el reflujo y en la úlcera duodenal por H. pylori [FT].',
  ],
  posologia: [
    T(['Indicación', 'Dosis en adultos', 'Duración'], [
      ['Esofagitis erosiva', '40 mg al día', '4 semanas, ampliables 4 más [FT]'],
      ['Reflujo, control a largo plazo y sintomático', '20 mg al día', 'Según control [FT]'],
      ['H. pylori', '20 mg con amoxicilina 1 g y claritromicina 500 mg, cada uno dos veces al día', '7 días [FT]'],
      ['Úlcera por AINE', '20 mg al día', '4 a 8 semanas; prevención mientras dure el riesgo [FT]'],
      ['Prevención del resangrado', '40 mg al día', '4 semanas [FT]'],
      ['Zollinger-Ellison', '40 mg dos veces al día al inicio; 80 a 160 mg de mantenimiento', 'Según la clínica [FT]'],
    ]),
    L(['Insuficiencia renal y personas mayores: sin ajuste [FT].', 'Insuficiencia hepática grave: máximo 20 mg al día [FT].']),
  ],
  contraindicaciones: [
    'Contraindicado en hipersensibilidad a los benzimidazoles sustituidos y con nelfinavir [FT].',
    { alerta: { tono: 'medio', titulo: 'Tratamientos de más de un año', texto: 'Requieren seguimiento regular: riesgo de hipomagnesemia grave y aumento del riesgo de fracturas de cadera, muñeca y columna con dosis altas y periodos largos [FT].' } },
    'Ante síntomas de alarma o úlcera gástrica, descartar malignidad [FT].',
  ],
  interacciones: [
    T(['Medicamento', 'Efecto', 'Qué hacer'], [
      ['Nelfinavir', 'Baja su concentración', 'Contraindicado [FT]'],
      ['Atazanavir', 'Reducción sustancial de su exposición', 'No recomendado [FT]'],
      ['Clopidogrel', 'Menos metabolito activo', 'Desaconsejado [FT]'],
      ['Metotrexato', 'Aumentan sus niveles', 'Vigilar toxicidad [FT]'],
      ['Tacrolimus', 'Aumentan sus niveles', 'Vigilar niveles [FT]'],
      ['Digoxina', 'Más biodisponibilidad', 'Vigilar [FT]'],
    ]),
  ],
  adversas: [
    'Frecuentes: cefalea, dolor abdominal, estreñimiento, diarrea, flatulencia, náuseas o vómito y pólipos benignos de glándulas fúndicas [FT].',
    L(['Graves: agranulocitosis o pancitopenia, shock anafiláctico, insuficiencia hepática con encefalopatía, nefritis intersticial y reacciones cutáneas graves [FT].']),
  ],
  embarazo: [
    L([
      'Embarazo: datos clínicos insuficientes; usar con precaución [FT].',
      'Lactancia: se desconoce si pasa a la leche; no debe usarse [FT].',
    ]),
  ],
  evidencia: [
    'La ficha técnica define para cada indicación su dosis y su duración; la combinación con dos antibióticos durante 7 días es la base de la erradicación de H. pylori [FT].',
    { barras: {
      titulo: 'Dosis diaria según la indicación',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Zollinger-Ellison (inicio)', valor: 80 },
        { etiqueta: 'Esofagitis erosiva', valor: 40 },
        { etiqueta: 'Prevención del resangrado', valor: 40 },
        { etiqueta: 'H. pylori', valor: 40, texto: '20 mg dos veces al día [FT]' },
        { etiqueta: 'Úlcera por AINE', valor: 20 },
        { etiqueta: 'Reflujo, mantenimiento', valor: 20 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  regulacion: [
    L([
      'Colombia: 63 registros sanitarios vigentes con el código ATC A02BC05, el IBP con más registros de los consultados; consulta del 16-nov-2026 [CUM].',
      'España: autorizado en comprimidos gastrorresistentes de 20 y 40 mg [FT].',
    ]),
  ],
  atencion: {
    intro: 'Como con todo IBP, la pregunta clave es si sigue siendo necesario. Con el esomeprazol se suma la vigilancia del uso prolongado de dosis altas [FT,MN].',
    necesidades: [
      ['Indicación', 'Reflujo, H. pylori, AINE, resangrado o Zollinger-Ellison [FT]'],
      ['Efectividad', 'Síntomas y cicatrización según la duración prevista [FT]'],
      ['Seguridad', 'Más de un año: magnesio y riesgo de fracturas [FT]'],
      ['Interacciones', 'Clopidogrel, metotrexato, tacrolimus, antirretrovirales [FT]'],
    ],
    prf: [
      ['Farmacoterapia innecesaria', '40 mg al día desde hace años sin reevaluar', 'Proponer bajar a la dosis mínima o revisar [FT,MN]'],
      ['Interacción', 'Esomeprazol con metotrexato', 'Comunicar y vigilar [FT]'],
      ['Seguridad', 'Mujer mayor con osteoporosis y uso prolongado', 'Revisar necesidad por riesgo de fracturas [FT]'],
    ],
    plan: ['Dejar escrita la duración prevista [MN].', 'Revisar interacciones en cada cambio de tratamiento [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Quien siente alivio con el esomeprazol tiende a tomarlo «de por vida». Conviene explorar qué teme si lo deja y qué entiende por proteger el estómago [EX].',
    preguntas: ['¿Cuánto tiempo le dijeron que debía tomarlo?', '¿Ha tenido fracturas o le han dicho que tiene los huesos débiles?', '¿Qué otros medicamentos toma todos los días?'],
    quiz: {
      pregunta: '¿Cuál es la dosis máxima de esomeprazol en insuficiencia hepática grave según la ficha técnica?',
      opciones: [
        { texto: '20 mg al día', correcta: true, retro: 'En la insuficiencia hepática grave no se superan 20 mg al día [FT].' },
        { texto: '40 mg dos veces al día', correcta: false, retro: 'Esa es la dosis inicial del Zollinger-Ellison, no un ajuste hepático [FT].' },
        { texto: 'No requiere ajuste', correcta: false, retro: 'Sin ajuste en leve o moderada, pero sí en grave [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.gastro, GUIAS.farmacocinetica],
  refs: { FT: F.ftEsomeprazol, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [
    ['Omeprazol: farmacología', '/vademecum/omeprazol'],
    ['Lansoprazol: farmacología', '/vademecum/lansoprazol'],
    ['Medicamentos para el aparato digestivo', '/vademecum/medicamentos-para-el-aparato-digestivo'],
  ],
  seo: {
    titulo: 'Esomeprazol: farmacología y atención farmacéutica',
    descripcion: 'Esomeprazol: mecanismo, dosis por indicación, H. pylori, uso prolongado, fracturas, magnesio, interacciones y atención farmacéutica.',
  },
});
