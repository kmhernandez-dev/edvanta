import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Dexametasona. Verificada el 16-nov-2026: ficha técnica de CIMA (Fortecortin 4 mg comprimidos) y CUM del INVIMA (27 registros vigentes con ATC H02AB02). */
export default crearMonografia({
  slug: 'dexametasona',
  nombre: 'Dexametasona',
  grupo: 'corticoides-sistemicos',
  clase: 'Glucocorticoide sistémico fluorado de acción prolongada',
  atc: 'H02AB02',
  vias: ['Oral'],
  mecanismo: 'Glucocorticoide fluorado con acción antiinflamatoria e inmunosupresora; su efecto glucocorticoide es 7,5 veces el de la prednisona y 30 veces el de la hidrocortisona.',
  resumenCorto: 'glucocorticoide potente y de acción prolongada: edema cerebral, asma grave, náusea por quimioterapia y COVID-19 con oxígeno (6 mg al día hasta 10 días).',
  resumen: 'La dexametasona es un glucocorticoide fluorado muy potente: según su ficha técnica, su efecto glucocorticoide es 7,5 veces el de la prednisona y 30 veces el de la hidrocortisona, con una semivida biológica de 36 horas. Esa potencia la hace útil en el edema cerebral por tumores o neurocirugía, el asma grave aguda, las dermatosis y enfermedades autoinmunes graves, la artritis reumatoide activa, la profilaxis de la náusea y el vómito por citostáticos y la COVID-19 en pacientes que necesitan oxígeno. También explica sus riesgos: supresión suprarrenal que puede durar meses, infecciones, reactivación de tuberculosis o hepatitis B, hiperglucemia y osteoporosis.',
  datosClave: [
    ['Clase', 'Glucocorticoide fluorado [FT]'],
    ['Código ATC', 'H02AB02 [CUM]'],
    ['Potencia', '7,5 veces la prednisona; 30 veces la hidrocortisona [FT]'],
    ['Semivida biológica', '36 horas [FT]'],
    ['COVID-19 con oxígeno', '6 mg una vez al día, hasta 10 días [FT]'],
    ['Colombia', '27 registros vigentes con el código ATC H02AB02 [CUM]'],
  ],
  quimica: ['Es un glucocorticoide fluorado; la presentación de referencia son comprimidos de 1 mg, 4 mg y 8 mg [FT].'],
  dinamia: [
    'Tiene acción antiinflamatoria e inmunosupresora. Su efecto glucocorticoide es 7,5 veces mayor que el de la prednisona o la prednisolona y 30 veces mayor que el de la hidrocortisona [FT].',
    { barras: {
      titulo: 'Potencia glucocorticoide relativa (hidrocortisona = 1)',
      unidad: ['vez', 'veces'],
      datos: [
        { etiqueta: 'Dexametasona', valor: 30 },
        { etiqueta: 'Prednisona o prednisolona', valor: 4 },
        { etiqueta: 'Hidrocortisona', valor: 1 },
      ],
      nota: 'Calculado con las relaciones de la ficha técnica: 30 veces la hidrocortisona y 7,5 veces la prednisona [FT].',
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Biodisponibilidad oral', '80 % a 90 %; concentración máxima en 1 a 2 horas [FT]'],
    ['Semivida plasmática', 'Unos 250 minutos [FT]'],
    ['Semivida biológica', '36 horas [FT]'],
    ['Eliminación', 'Renal, libre y como glucurónidos o sulfatos [FT]'],
  ])],
  indicaciones: [
    { mapa: {
      centro: 'Dexametasona',
      ramas: [
        { titulo: 'Cerebro', icono: 'Brain', nodos: ['Edema por tumor', 'Neurocirugía', 'Absceso'] },
        { titulo: 'Pulmón', icono: 'Wind', nodos: ['Asma grave aguda', 'COVID-19 con oxígeno'] },
        { titulo: 'Oncología', icono: 'Pill', nodos: ['Náusea por citostáticos'] },
        { titulo: 'Autoinmunidad', icono: 'Shield', nodos: ['Lupus', 'Artritis reumatoide'] },
        { titulo: 'Piel', icono: 'Layers', nodos: ['Dermatosis agudas graves'] },
      ],
    } },
    'Indicada en edema cerebral, asma grave aguda, tratamiento inicial de dermatosis agudas graves y enfermedades autoinmunes, artritis reumatoide activa, náuseas y vómitos por citostáticos y COVID-19 en adultos y adolescentes de al menos 12 años y 40 kg que requieren oxígeno [FT].',
  ],
  posologia: [T(['Indicación', 'Dosis en adultos'], [
    ['Edema cerebral', '16 a 24 mg al día (hasta 48 mg) en 3 a 4 tomas, 4 a 8 días [FT]'],
    ['Asma grave aguda', '8 a 20 mg; repetir 8 mg cada 4 horas si hace falta [FT]'],
    ['Dermatosis agudas graves', '8 a 40 mg al día (hasta 100 mg), luego en descenso [FT]'],
    ['Lupus y autoinmunes', '6 a 16 mg al día [FT]'],
    ['Artritis reumatoide activa', '6 a 16 mg al día según la forma [FT]'],
    ['Náusea por citostáticos', '10 a 20 mg antes de la quimioterapia; luego 4 a 8 mg, 2 a 3 veces al día [FT]'],
    ['COVID-19 con oxígeno', '6 mg una vez al día, hasta 10 días [FT]'],
  ])],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad al principio activo o a los excipientes [FT].',
    { alerta: { tono: 'alto', titulo: 'Infecciones latentes', texto: 'Puede reactivar la tuberculosis y la hepatitis B y enmascarar infecciones. Las vacunas vivas se evitan desde 8 semanas antes hasta 2 semanas después [FT].' } },
    { alerta: { tono: 'alto', titulo: 'Supresión suprarrenal duradera', texto: 'La insuficiencia suprarrenal inducida puede persistir meses después de suspenderla [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Intestino y tendones', texto: 'Riesgo de perforación intestinal en colitis ulcerosa grave o diverticulitis, y de lesiones tendinosas con fluoroquinolonas [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Rifampicina, fenitoína, carbamazepina, barbitúricos, primidona', 'Inducen el metabolismo y reducen el efecto', 'Vigilar la respuesta [FT]'],
    ['Ketoconazol, itraconazol, cobicistat', 'Inhiben el CYP3A y aumentan las reacciones adversas sistémicas', 'Evitar o vigilar [FT]'],
    ['Fluoroquinolonas', 'Más riesgo de lesión tendinosa', 'Advertir al paciente [FT]'],
  ])],
  adversas: [
    'Frecuentes [FT]:',
    { claves: [
      { icono: 'Gauge', titulo: 'Eje suprarrenal', texto: 'Supresión suprarrenal y síndrome de Cushing [FT].' },
      { icono: 'Activity', titulo: 'Metabolismo', texto: 'Aumento de peso y alteración de la glucosa [FT].' },
      { icono: 'Droplets', titulo: 'Agua y sal', texto: 'Retención de sodio con edema [FT].' },
      { icono: 'Bone', titulo: 'Hueso y músculo', texto: 'Osteoporosis y debilidad muscular [FT].' },
      { icono: 'Moon', titulo: 'Ánimo y sueño', texto: 'Depresión y alteraciones del sueño [FT].' },
      { icono: 'Bandage', titulo: 'Tejidos', texto: 'Úlcera péptica y retraso de la cicatrización [FT].' },
    ] },
  ],
  embarazo: [L([
    'Embarazo: atraviesa la placenta; en el primer trimestre se valora riesgo y beneficio por el riesgo de atrofia suprarrenal fetal [FT].',
    'Lactancia: pasa a la leche; solo si es imprescindible y, con dosis altas, se recomienda destetar [FT].',
  ])],
  evidencia: [
    'La ficha técnica incorpora la indicación en COVID-19 con necesidad de oxígeno, con una pauta fija de 6 mg al día hasta 10 días, además de sus usos clásicos en edema cerebral y oncología [FT].',
    { triangulo: {
      titulo: 'Tres razones para elegir dexametasona',
      centro: 'Potencia y duración',
      vertices: [
        { titulo: 'Potencia', icono: 'Zap', texto: '30 veces la hidrocortisona [FT].' },
        { titulo: 'Duración', icono: 'Clock', texto: 'Semivida biológica de 36 horas [FT].' },
        { titulo: 'Usos agudos', icono: 'Siren', texto: 'Edema cerebral, asma grave y náusea por quimioterapia [FT].' },
      ],
    } },
  ],
  regulacion: [L([
    'Colombia: 27 registros sanitarios vigentes con el código ATC H02AB02; consulta del 16-nov-2026 [CUM].',
    'España: autorizada, entre otras, como Fortecortin 1 mg, 4 mg y 8 mg comprimidos [FT].',
  ])],
  atencion: {
    intro: 'La dexametasona suele llegar en esquemas cortos y potentes: quimioterapia, edema cerebral, crisis de asma. El farmacéutico vigila la glucemia, el sueño y las infecciones, y que el ciclo termine cuando debe [FT,MN].',
    necesidades: [
      ['Indicación', 'Indicación precisa y duración definida [FT]'],
      ['Efectividad', 'Respuesta en la enfermedad que se trata [FT]'],
      ['Seguridad', 'Glucemia, infecciones, tuberculosis, hepatitis B [FT]'],
      ['Interacciones', 'Inductores e inhibidores del CYP3A [FT]'],
    ],
    prf: [
      ['Seguridad', 'Paciente diabético con quimioterapia y dexametasona', 'Plan de vigilancia de glucemia con el equipo [FT]'],
      ['Interacción', 'Uso con carbamazepina', 'Avisar que el efecto puede ser menor [FT]'],
      ['Farmacoterapia innecesaria', 'Sigue tomándola después del ciclo indicado', 'Confirmar con el médico y planear la retirada [FT]'],
    ],
    plan: ['Escribir el calendario del ciclo con la fecha de fin [FT].', 'Explicar las señales de infección que obligan a consultar [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'En oncología, la dexametasona trae insomnio, hambre y euforia que el paciente no siempre asocia con el medicamento. Nombrarlos alivia y orienta [EX].',
    preguntas: ['¿A qué hora la toma?', '¿Cómo ha dormido desde que la inició?', '¿Le han medido el azúcar?'],
    quiz: {
      pregunta: 'Según su ficha técnica, ¿cuántas veces más potente es la dexametasona que la prednisona?',
      opciones: [
        { texto: '7,5 veces', correcta: true, retro: 'Y 30 veces más que la hidrocortisona [FT].' },
        { texto: 'Igual de potente', correcta: false, retro: 'Es bastante más potente [FT].' },
        { texto: '100 veces', correcta: false, retro: 'La relación con la prednisona es de 7,5 [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.endocrina, GUIAS.seguridad],
  refs: { FT: F.ftDexametasona, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Ondansetrón: farmacología', '/vademecum/ondansetron'], ['Betametasona: farmacología', '/vademecum/betametasona'], ['Corticoides sistémicos', '/vademecum/corticoides-sistemicos']],
  seo: {
    titulo: 'Dexametasona: dosis, potencia y atención farmacéutica',
    descripcion: 'Dexametasona: mecanismo, potencia frente a prednisona, dosis en edema cerebral, asma, quimioterapia y COVID-19, riesgos y atención farmacéutica.',
  },
});
