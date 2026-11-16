import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Carvedilol. Verificado el 16-nov-2026: ficha técnica de CIMA (Coropres 25 mg) y CUM del INVIMA (13 registros vigentes con ATC C07AG02). */
export default crearMonografia({
  slug: 'carvedilol',
  nombre: 'Carvedilol',
  grupo: 'medicamentos-para-la-hipertension-arterial',
  clase: 'Betabloqueador con acción alfa-bloqueante',
  atc: 'C07AG02',
  vias: ['Oral'],
  mecanismo: 'Mezcla racémica que bloquea los receptores beta y alfa-1 adrenérgicos.',
  resumenCorto: 'alfa y betabloqueador para hipertensión, cardiopatía isquémica e insuficiencia cardiaca: en la insuficiencia se inicia con 3,125 mg dos veces al día y se sube cada 2 semanas; nunca se suspende de golpe.',
  resumen: 'El carvedilol es una mezcla racémica que bloquea los receptores beta y alfa-1 adrenérgicos. Su ficha técnica lo indica en la hipertensión esencial, la cardiopatía isquémica y la insuficiencia cardiaca. En la hipertensión se empieza con 12,5 mg al día dos días y luego 25 mg, hasta 50 mg. En la insuficiencia cardiaca la regla es «empezar bajo e ir despacio»: 3,125 mg dos veces al día durante 2 semanas, con aumentos cada 2 semanas hasta 25 mg dos veces al día (50 mg si pesa más de 85 kg), vigilando el empeoramiento de la insuficiencia en cada paso. No debe suspenderse bruscamente, sobre todo en la cardiopatía isquémica, y se contraindica en la EPOC con broncoespasmo.',
  datosClave: [
    ['Clase', 'Bloqueador alfa y beta [FT]'],
    ['Código ATC', 'C07AG02 [CUM]'],
    ['Insuficiencia cardiaca, inicio', '3,125 mg dos veces al día, 2 semanas [FT]'],
    ['Máximo en insuficiencia', '25 mg dos veces al día; 50 mg si pesa más de 85 kg [FT]'],
    ['Biodisponibilidad', 'Cerca del 25 % [FT]'],
    ['Colombia', '13 registros vigentes con el código ATC C07AG02 [CUM]'],
  ],
  quimica: ['Mezcla racémica de los estereoisómeros R y S; la presentación de referencia son comprimidos de 25 mg (también de 6,25 mg) [FT].'],
  dinamia: [
    'Agente bloqueante alfa y beta adrenérgico de acción múltiple [FT].',
    { mapa: {
      centro: 'Carvedilol',
      ramas: [
        { titulo: 'Beta', icono: 'HeartPulse', nodos: ['Menos frecuencia', 'Menos consumo de oxígeno'] },
        { titulo: 'Alfa-1', icono: 'Gauge', nodos: ['Vasodilatación'] },
        { titulo: 'Usos', icono: 'Activity', nodos: ['Hipertensión', 'Cardiopatía isquémica', 'Insuficiencia cardiaca'] },
        { titulo: 'Pulmón', icono: 'Wind', nodos: ['Contraindicado en EPOC con broncoespasmo'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción', 'Rápida; máximo hacia 1,5 horas [FT]'],
    ['Biodisponibilidad', 'Cerca del 25 % por primer paso [FT]'],
    ['Semivida', 'Unas 6,5 horas con la vía oral [FT]'],
  ])],
  indicaciones: [L(['Hipertensión esencial, sola o con diuréticos tiazídicos [FT].', 'Cardiopatía isquémica: angina estable e inestable, isquemia silente y disfunción isquémica del ventrículo izquierdo [FT].', 'Insuficiencia cardiaca [FT].'])],
  posologia: [
    T(['Indicación', 'Inicio', 'Ajuste'], [
      ['Hipertensión', '12,5 mg al día durante 2 días; luego 25 mg [FT]', 'Cada 2 semanas hasta 50 mg al día [FT]'],
      ['Insuficiencia cardiaca', '3,125 mg dos veces al día, 2 semanas [FT]', '6,25 → 12,5 → 25 mg dos veces al día, cada 2 semanas [FT]'],
    ]),
    { ciclo: {
      titulo: 'Titulación en la insuficiencia cardiaca',
      centro: 'Cada 2 semanas',
      pasos: [
        { titulo: '3,125 mg', icono: 'Sprout', texto: 'Dos veces al día, 2 semanas [FT].' },
        { titulo: '6,25 mg', icono: 'LineChart', texto: 'Dos veces al día si se tolera [FT].' },
        { titulo: '12,5 mg', icono: 'LineChart', texto: 'Dos veces al día [FT].' },
        { titulo: '25 mg', icono: 'Target', texto: 'Dos veces al día; 50 mg si pesa más de 85 kg [FT].' },
      ],
    } },
    'Si se interrumpe más de una semana, se reinicia desde 3,125 mg dos veces al día [FT].',
  ],
  contraindicaciones: [
    'Contraindicado en hipersensibilidad, insuficiencia cardiaca descompensada clase IV que requiere inotrópicos intravenosos, EPOC con componente broncoespástico en tratamiento y disfunción hepática, entre otras [FT].',
    { alerta: { tono: 'alto', titulo: 'No suspender de golpe', texto: 'Sobre todo en la cardiopatía isquémica: la retirada se hace en 1 a 2 semanas [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Al subir la dosis', texto: 'La insuficiencia cardiaca o la retención de líquidos pueden empeorar; se aumenta el diurético y no se sube el carvedilol hasta estabilizar [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Antihipertensivos, alfabloqueadores', 'Más hipotensión', 'Vigilar presión [FT]'],
    ['Digoxina', 'Ambos enlentecen la conducción', 'Precaución [FT]'],
    ['Sustratos e inhibidores de glicoproteína P', 'Carvedilol es sustrato e inhibidor', 'Vigilar [FT]'],
  ])],
  adversas: ['En los ensayos pivotales: muy frecuente, insuficiencia cardiaca; frecuentes, bradicardia, sobrecarga de líquidos, anemia, alteraciones de la visión y ojo seco, entre otras [FT].'],
  embarazo: [L(['Embarazo: no recomendado; los betabloqueadores reducen la perfusión placentaria [FT].'])],
  evidencia: [
    { barras: {
      titulo: 'Escalones de dosis en la insuficiencia cardiaca (mg dos veces al día)',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Máximo, más de 85 kg', valor: 50 },
        { etiqueta: 'Máximo, menos de 85 kg', valor: 25 },
        { etiqueta: 'Tercer escalón', valor: 12.5 },
        { etiqueta: 'Segundo escalón', valor: 6.25 },
        { etiqueta: 'Inicio', valor: 3.125 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  regulacion: [L(['Colombia: 13 registros sanitarios vigentes con el código ATC C07AG02; consulta del 16-nov-2026 [CUM].', 'España: autorizado como Coropres 6,25 mg y 25 mg comprimidos [FT].'])],
  atencion: {
    intro: 'La titulación del carvedilol en la insuficiencia cardiaca dura meses. El farmacéutico ayuda a que cada escalón se cumpla y detecta pronto el empeoramiento [FT,MN].',
    necesidades: [
      ['Indicación', 'Hipertensión, cardiopatía isquémica o insuficiencia cardiaca [FT]'],
      ['Efectividad', 'Llegar a la dosis objetivo tolerada [FT]'],
      ['Seguridad', 'Bradicardia, hipotensión, edema, broncoespasmo [FT]'],
      ['Adherencia', 'Dos tomas diarias sin suspender [FT]'],
    ],
    prf: [
      ['Seguridad', 'Aumento de peso y edema al subir la dosis', 'Remitir para ajustar el diurético [FT]'],
      ['Adherencia', 'Lo dejó una semana y quiere retomar la misma dosis', 'Reiniciar con 3,125 mg dos veces al día [FT]'],
      ['Seguridad', 'Paciente con EPOC y broncoespasmo', 'Consultar al médico [FT]'],
    ],
    plan: ['Llevar un calendario de titulación [FT].', 'Pesarse a diario en la insuficiencia cardiaca.', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Al iniciar el carvedilol, muchos pacientes con insuficiencia cardiaca se sienten más cansados. Saber que suele ser transitorio evita abandonos [EX].',
    preguntas: ['¿En qué dosis va?', '¿Se ha sentido más cansado o mareado?', '¿Ha subido de peso esta semana?'],
    quiz: {
      pregunta: '¿Con qué dosis se inicia el carvedilol en la insuficiencia cardiaca según su ficha técnica?',
      opciones: [
        { texto: '3,125 mg dos veces al día durante 2 semanas', correcta: true, retro: 'Luego se sube cada 2 semanas [FT].' },
        { texto: '25 mg dos veces al día', correcta: false, retro: 'Es la dosis objetivo, no la inicial [FT].' },
        { texto: '50 mg una vez al día', correcta: false, retro: 'No es el inicio en insuficiencia cardiaca [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.ic, GUIAS.afHta],
  refs: { FT: F.ftCarvedilol, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Metoprolol: farmacología', '/vademecum/metoprolol'], ['Espironolactona: farmacología', '/vademecum/espironolactona'], ['Medicamentos para la hipertensión arterial', '/vademecum/medicamentos-para-la-hipertension-arterial']],
  seo: {
    titulo: 'Carvedilol: titulación, riesgos y consejería',
    descripcion: 'Carvedilol: alfa y betabloqueador para hipertensión, cardiopatía isquémica e insuficiencia cardiaca; titulación, suspensión gradual y consejería.',
  },
});
