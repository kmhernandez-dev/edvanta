import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { GUIAS } from '../lib/ofertas.js';

/** Albendazol. Verificado el 16-nov-2026: ficha técnica de CIMA (Eskazole 400 mg) y CUM del INVIMA (25 registros vigentes con ATC P02CA03). */
export default crearMonografia({
  slug: 'albendazol',
  nombre: 'Albendazol',
  grupo: 'antimicoticos-antivirales-y-antiparasitarios',
  clase: 'Antihelmíntico benzimidazólico',
  atc: 'P02CA03',
  vias: ['Oral'],
  mecanismo: 'Carbamato benzimidazólico que inhibe la polimerización de la tubulina del parásito; tiene actividad larvicida, ovicida y vermicida.',
  resumenCorto: 'antihelmíntico benzimidazólico; su ficha técnica española cubre hidatidosis y neurocisticercosis con ciclos de 400 mg dos veces al día, control hepático y contraindicación en el embarazo.',
  resumen: 'El albendazol es un carbamato benzimidazólico que inhibe la polimerización de la tubulina del parásito, con actividad larvicida, ovicida y vermicida frente a parásitos tisulares e intestinales. Se absorbe poco (menos del 5 %) y su forma activa es el sulfóxido de albendazol. La ficha técnica española de referencia, Eskazole, lo indica en infecciones helmínticas sistémicas: la equinococosis o enfermedad hidatídica y la neurocisticercosis, con 400 mg dos veces al día en ciclos de 28 días o de 7 a 30 días. Exige pruebas hepáticas antes y durante cada ciclo y está contraindicado en el embarazo. Las pautas cortas para parásitos intestinales dependen del registro sanitario de cada producto en Colombia.',
  datosClave: [
    ['Clase', 'Antihelmíntico benzimidazólico [FT]'],
    ['Código ATC', 'P02CA03 [CUM]'],
    ['Dosis en más de 60 kg', '400 mg dos veces al día [FT]'],
    ['Dosis en menos de 60 kg', '15 mg/kg/día en 2 tomas; máximo 800 mg [FT]'],
    ['Absorción', 'Menos del 5 % [FT]'],
    ['Colombia', '25 registros vigentes con el código ATC P02CA03 [CUM]'],
  ],
  quimica: ['Carbamato benzoimidazólico; la presentación de referencia son comprimidos de 400 mg. Su metabolito activo es el sulfóxido de albendazol [FT].'],
  dinamia: [
    'Tiene efectos antihelmínticos y antiprotozoarios frente a parásitos tisulares e intestinales; se cree que actúa inhibiendo la polimerización de la tubulina [FT].',
    { mapa: {
      centro: 'Albendazol',
      ramas: [
        { titulo: 'Tubulina', icono: 'Atom', nodos: ['Sin polimerización'] },
        { titulo: 'Acción', icono: 'Target', nodos: ['Larvicida', 'Ovicida', 'Vermicida'] },
        { titulo: 'Sistémicas', icono: 'Brain', nodos: ['Hidatidosis', 'Neurocisticercosis'] },
        { titulo: 'Hígado', icono: 'FlaskConical', nodos: ['Primer paso', 'Transaminasas'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción oral', 'Menos del 5 % [FT]'],
    ['Metabolismo', 'Primer paso hepático rápido; el albendazol no suele detectarse en plasma [FT]'],
    ['Metabolito activo', 'Sulfóxido de albendazol [FT]'],
  ])],
  indicaciones: [L(['Equinococosis (enfermedad hidatídica): quistes hepáticos, pulmonares y peritoneales, cuando la cirugía no es posible o como coadyuvante [FT].', 'Neurocisticercosis por larvas de Taenia solium [FT].'])],
  posologia: [
    T(['Indicación', 'Más de 60 kg', 'Menos de 60 kg', 'Duración'], [
      ['Equinococosis quística', '400 mg dos veces al día [FT]', '15 mg/kg/día en 2 tomas, máx. 800 mg [FT]', 'Ciclos de 28 días, con 14 de descanso, hasta 3 ciclos [FT]'],
      ['Neurocisticercosis', '400 mg dos veces al día [FT]', '15 mg/kg/día en 2 tomas, máx. 800 mg [FT]', '7 a 30 días según la respuesta [FT]'],
    ]),
    { alerta: { tono: 'medio', titulo: 'Parásitos intestinales', texto: 'La ficha técnica española de referencia solo incluye infecciones sistémicas. Las pautas cortas para parásitos intestinales se consultan en el registro sanitario de cada producto disponible en Colombia [FT,CUM].' } },
  ],
  contraindicaciones: [
    'Contraindicado en hipersensibilidad y durante el embarazo o si la mujer puede estar embarazada [FT].',
    { alerta: { tono: 'alto', titulo: 'Hígado', texto: 'Puede elevar las transaminasas y causar hepatitis. Pruebas hepáticas antes de cada ciclo y cada dos semanas; suspender si superan el doble del límite normal [FT].' } },
    { alerta: { tono: 'alto', titulo: 'Embarazo', texto: 'No administrar durante el embarazo ni en mujeres que puedan estarlo [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Cimetidina, prazicuantel, dexametasona', 'Aumentan el metabolito activo', 'Vigilar [FT]'],
    ['Ritonavir, fenitoína, carbamazepina, fenobarbital', 'Reducen el metabolito activo', 'Vigilar la eficacia [FT]'],
  ])],
  adversas: ['Muy frecuente: cefalea. Frecuentes: mareo y alteraciones gastrointestinales (dolor abdominal, náuseas, vómitos); elevación de enzimas hepáticas [FT].'],
  embarazo: [L(['Embarazo: contraindicado [FT].', 'Lactancia: no se debe usar por falta de información [FT].'])],
  evidencia: [
    { barras: {
      titulo: 'Duración máxima de un ciclo (días)',
      unidad: ['día', 'días'],
      datos: [
        { etiqueta: 'Neurocisticercosis', valor: 30 },
        { etiqueta: 'Equinococosis (por ciclo)', valor: 28 },
        { etiqueta: 'Descanso entre ciclos de equinococosis', valor: 14 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
    { triangulo: {
      titulo: 'Albendazol en tratamientos largos',
      centro: 'Vigilancia',
      vertices: [
        { titulo: 'Hígado', icono: 'FlaskConical', texto: 'Transaminasas cada 2 semanas [FT].' },
        { titulo: 'Embarazo', icono: 'Ban', texto: 'Contraindicado [FT].' },
        { titulo: 'Interacciones', icono: 'Shuffle', texto: 'Antiepilépticos y dexametasona [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 25 registros sanitarios vigentes con el código ATC P02CA03; consulta del 16-nov-2026 [CUM].', 'España: autorizado como Eskazole 400 mg comprimidos para infecciones sistémicas [FT].'])],
  atencion: {
    intro: 'El albendazol se pide con frecuencia para «desparasitar». El farmacéutico pregunta por embarazo, revisa la pauta del producto y reserva los tratamientos largos al seguimiento médico [FT,MN].',
    necesidades: [
      ['Indicación', 'Parasitosis diagnosticada [FT]'],
      ['Efectividad', 'Según la pauta del producto y la indicación [FT]'],
      ['Seguridad', 'Embarazo, hígado [FT]'],
      ['Interacciones', 'Antiepilépticos, dexametasona [FT]'],
    ],
    prf: [
      ['Seguridad', 'Mujer que podría estar embarazada', 'No dispensar y remitir [FT]'],
      ['Seguridad', 'Tratamiento largo sin control hepático', 'Remitir para pruebas [FT]'],
      ['Interacción', 'Paciente con carbamazepina', 'Avisar al médico por menor eficacia [FT]'],
    ],
    plan: ['Preguntar siempre por embarazo [FT].', 'Leer la pauta del registro del producto dispensado [CUM].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Desparasitar a toda la familia es una costumbre arraigada. Escucharla y orientarla hacia el diagnóstico evita tratamientos innecesarios y riesgos en el embarazo [EX].',
    preguntas: ['¿Para quién es y por qué?', '¿Hay alguna mujer embarazada en casa?', '¿Toma medicamentos para convulsiones?'],
    quiz: {
      pregunta: '¿En cuál de estas situaciones está contraindicado el albendazol según su ficha técnica?',
      opciones: [
        { texto: 'Embarazo', correcta: true, retro: 'No se administra en el embarazo ni si la mujer puede estar embarazada [FT].' },
        { texto: 'Adulto de 70 kg con hidatidosis', correcta: false, retro: 'Es una de sus indicaciones [FT].' },
        { texto: 'Niño de 8 años con neurocisticercosis', correcta: false, retro: 'Está indicado desde los 6 años [FT].' },
      ],
    },
  },
  ofertas: [GUIAS.proa, GUIAS.seguridad],
  refs: { FT: F.ftAlbendazol, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Ivermectina: farmacología', '/vademecum/ivermectina'], ['Antimicóticos, antivirales y antiparasitarios', '/vademecum/antimicoticos-antivirales-y-antiparasitarios']],
  seo: {
    titulo: 'Albendazol: dosis, hígado y embarazo',
    descripcion: 'Albendazol: mecanismo, dosis en hidatidosis y neurocisticercosis, control hepático, contraindicación en el embarazo, interacciones y consejería.',
  },
});
