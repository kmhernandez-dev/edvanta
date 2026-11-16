import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Prednisona. Verificada el 16-nov-2026: ficha técnica de CIMA (Dacortin 5 mg) y CUM del INVIMA (1 registro vigente con ATC H02AB07). */
export default crearMonografia({
  slug: 'prednisona',
  nombre: 'Prednisona',
  grupo: 'corticoides-sistemicos',
  clase: 'Glucocorticoide sistémico de acción intermedia',
  atc: 'H02AB07',
  vias: ['Oral'],
  mecanismo: 'Profármaco que el hígado convierte en prednisolona; actúa sobre el receptor de glucocorticoides con efecto antiinflamatorio, inmunosupresor y metabólico.',
  resumenCorto: 'glucocorticoide oral que el hígado convierte en prednisolona; 5 mg equivalen a 20 mg de hidrocortisona y, tras un uso prolongado, se retira de forma gradual.',
  resumen: 'La prednisona es el corticoide oral de referencia para tratar enfermedades inflamatorias y autoinmunes. Es un profármaco: el hígado convierte entre el 80 % y el 100 % de la dosis en prednisolona, su forma activa. Se usa como tratamiento sustitutivo en la insuficiencia suprarrenal y, a dosis farmacológicas, en enfermedades reumáticas, asma, dermatosis graves, enfermedad inflamatoria intestinal, síndrome nefrótico y enfermedades hematológicas. Su eficacia viene con un precio conocido: supresión suprarrenal, síndrome de Cushing, hiperglucemia, osteoporosis e infecciones. Por eso, después de un tratamiento prolongado nunca se suspende de golpe, y la retirada sigue un esquema escalonado.',
  datosClave: [
    ['Clase', 'Glucocorticoide no fluorado [FT]'],
    ['Código ATC', 'H02AB07 [CUM]'],
    ['Equivalencia', '5 mg de prednisona equivalen a 20 mg de hidrocortisona [FT]'],
    ['Dosis de mantenimiento', '5 a 10 mg al día [FT]'],
    ['Semivida biológica', '12 a 36 horas [FT]'],
    ['Advertencia clave', 'Retirada gradual tras tratamientos prolongados [FT]'],
  ],
  quimica: [
    'Es un glucocorticoide sintético no fluorado; la presentación de referencia son comprimidos de 2,5 mg, 5 mg y 30 mg [FT].',
    'Es un profármaco: necesita el metabolismo hepático para transformarse en prednisolona, que es la molécula que actúa [FT].',
  ],
  dinamia: [
    'Tiene acción antiinflamatoria, inmunosupresora y metabólica: inhibe la quimiotaxis y la liberación de mediadores de la inflamación [FT].',
    { mapa: {
      centro: 'Prednisona',
      ramas: [
        { titulo: 'Inflamación', icono: 'Flame', nodos: ['Menos mediadores', 'Menos quimiotaxis'] },
        { titulo: 'Inmunidad', icono: 'Shield', nodos: ['Inmunosupresión', 'Más infecciones'] },
        { titulo: 'Metabolismo', icono: 'Activity', nodos: ['Hiperglucemia', 'Redistribución de grasa'] },
        { titulo: 'Hueso y músculo', icono: 'Bone', nodos: ['Osteoporosis', 'Miopatía'] },
        { titulo: 'Eje suprarrenal', icono: 'Gauge', nodos: ['Supresión', 'Crisis al retirar de golpe'] },
      ],
    } },
  ],
  cinetica: [
    T(['Parámetro', 'Valor'], [
      ['Absorción oral', 'Rápida y casi completa; concentración máxima en 1 a 3 horas [FT]'],
      ['Activación', 'El 80 % al 100 % pasa a prednisolona en el primer paso hepático [FT]'],
      ['Semivida plasmática', 'Unas 3 horas [FT]'],
      ['Semivida biológica', '12 a 36 horas [FT]'],
      ['Eliminación', 'Renal, casi toda como metabolitos [FT]'],
    ]),
    { claves: [
      { icono: 'FlaskConical', titulo: 'Profármaco', texto: 'El hígado la convierte en prednisolona [FT].' },
      { icono: 'Clock', titulo: 'Efecto que dura', texto: 'La semivida biológica, de 12 a 36 horas, supera a la plasmática [FT].' },
      { icono: 'Sunrise', titulo: 'Toma matutina', texto: 'La dosis única se da por la mañana [FT].' },
    ] },
  ],
  indicaciones: [
    'La ficha técnica distingue dos usos [FT]:',
    L([
      'Tratamiento sustitutivo: insuficiencia suprarrenal (enfermedad de Addison, insuficiencia hipofisaria anterior, síndrome adrenogenital).',
      'Tratamiento antiinflamatorio e inmunosupresor: enfermedades reumáticas y del colágeno, lupus, asma y enfermedades pulmonares, dermatosis graves (urticaria aguda, pénfigo), enfermedades hematológicas y tumorales, colitis ulcerosa, enfermedad de Crohn, hepatitis autoinmune, síndrome nefrótico e inflamaciones oculares.',
    ]),
  ],
  posologia: [
    T(['Fase', 'Dosis en adultos'], [
      ['Inicio (según la enfermedad)', '20 a 90 mg al día [FT]'],
      ['Mantenimiento', '5 a 10 mg al día [FT]'],
      ['Horario', 'Dosis única por la mañana o repartida después de las comidas [FT]'],
    ]),
    'Esquema de retirada orientativo de la ficha técnica [FT]:',
    T(['Dosis actual', 'Cómo reducir'], [
      ['Más de 30 mg al día', 'Bajar 10 mg cada 2 a 5 días [FT]'],
      ['30 a 15 mg al día', 'Bajar 5 mg cada semana [FT]'],
      ['15 a 10 mg al día', 'Bajar 2,5 mg cada 1 a 2 semanas [FT]'],
      ['10 a 6 mg al día', 'Bajar 1 mg cada 2 a 4 semanas [FT]'],
      ['Menos de 6 mg al día', 'Bajar 0,5 mg cada 4 a 8 semanas [FT]'],
    ]),
    { ciclo: {
      titulo: 'La retirada escalonada, paso a paso',
      centro: 'Nunca de golpe',
      pasos: [
        { titulo: 'Más de 30 mg', icono: 'Gauge', texto: 'Bajadas de 10 mg cada 2 a 5 días [FT].' },
        { titulo: '30 a 15 mg', icono: 'LineChart', texto: 'Bajadas de 5 mg por semana [FT].' },
        { titulo: '15 a 6 mg', icono: 'Timer', texto: 'Bajadas de 2,5 mg y luego de 1 mg [FT].' },
        { titulo: 'Menos de 6 mg', icono: 'Hourglass', texto: 'Bajadas de 0,5 mg cada 4 a 8 semanas [FT].' },
      ],
    } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad. En tratamientos prolongados, además, en infecciones víricas agudas (herpes, varicela) y desde 8 semanas antes hasta 2 semanas después de una vacuna profiláctica [FT].',
    'La ficha técnica pide precaución, entre otras, en osteoporosis, diabetes grave, psicosis, úlcera péptica y tuberculosis activa [FT].',
    { alerta: { tono: 'alto', titulo: 'Infecciones enmascaradas', texto: 'Aumenta el riesgo de infecciones graves y puede ocultar sus síntomas. Con 15 mg al día o más hay riesgo de crisis renal esclerodérmica en pacientes con esclerodermia [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Hueso, ojos y tendones', texto: 'Riesgo de osteoporosis (conviene asegurar calcio y vitamina D), de cataratas y glaucoma, y de rotura tendinosa si se combina con fluoroquinolonas [FT].' } },
  ],
  interacciones: [
    T(['Medicamento', 'Efecto', 'Qué hacer'], [
      ['AINE', 'Más riesgo de úlcera y sangrado digestivo', 'Evitar o proteger el estómago [FT]'],
      ['Insulina y antidiabéticos', 'Menor efecto hipoglucemiante', 'Vigilar la glucemia [FT]'],
      ['Rifampicina, fenitoína, carbamazepina, barbitúricos', 'Inducen el CYP3A4 y reducen el efecto', 'Puede requerir más dosis [FT]'],
      ['Ketoconazol, itraconazol', 'Inhiben el CYP3A y aumentan los efectos adversos', 'Vigilar [FT]'],
      ['Digoxina, diuréticos, laxantes', 'Más pérdida de potasio', 'Vigilar potasio [FT]'],
      ['Antiácidos', 'Menor absorción', 'Separar las tomas [FT]'],
    ]),
  ],
  adversas: [
    'Dependen de la dosis y la duración [FT]:',
    { claves: [
      { icono: 'Gauge', titulo: 'Eje suprarrenal', texto: 'Supresión suprarrenal y síndrome de Cushing [FT].' },
      { icono: 'Droplets', titulo: 'Agua y sal', texto: 'Retención de sodio, edema, pérdida de potasio e hipertensión [FT].' },
      { icono: 'Activity', titulo: 'Glucosa', texto: 'Menor tolerancia a la glucosa y aumento de peso [FT].' },
      { icono: 'Bone', titulo: 'Hueso y músculo', texto: 'Osteoporosis, atrofia y miopatía [FT].' },
      { icono: 'Brain', titulo: 'Ánimo y sueño', texto: 'Insomnio, cambios de humor y, a veces, psicosis [FT].' },
      { icono: 'Shield', titulo: 'Infecciones', texto: 'Más infecciones y úlcera péptica [FT].' },
    ] },
  ],
  embarazo: [L([
    'Embarazo: evaluar riesgo y beneficio; en tratamientos prolongados hay riesgo de retraso del crecimiento intrauterino y de atrofia suprarrenal fetal [FT].',
    'Lactancia: pasa a la leche; con dosis altas se recomienda interrumpir la lactancia [FT].',
  ])],
  evidencia: [
    'La ficha técnica respalda su uso en un abanico amplio de enfermedades inflamatorias y autoinmunes, y como sustitución en la insuficiencia suprarrenal. El reto clínico no es la eficacia sino usar la menor dosis por el menor tiempo [FT].',
    { triangulo: {
      titulo: 'El corticoide bien usado',
      centro: 'Prednisona con propósito',
      vertices: [
        { titulo: 'Dosis mínima', icono: 'Gauge', texto: 'Mantenimiento de 5 a 10 mg al día [FT].' },
        { titulo: 'Tiempo justo', icono: 'CalendarClock', texto: 'Retirada escalonada al terminar [FT].' },
        { titulo: 'Protección', icono: 'ShieldCheck', texto: 'Calcio, vitamina D, glucemia y estómago [FT].' },
      ],
    } },
  ],
  regulacion: [L([
    'Colombia: en la consulta del CUM de registros vigentes del 16-nov-2026 aparece 1 registro con el código ATC H02AB07 [CUM].',
    'España: autorizada, entre otros, como Dacortin 2,5 mg, 5 mg y 30 mg comprimidos [FT].',
  ])],
  atencion: {
    intro: 'La prednisona se dispensa con fórmula, pero el farmacéutico ve lo que pasa después: los ciclos repetidos, la suspensión brusca y los efectos que nadie vigila [FT,MN].',
    necesidades: [
      ['Indicación', '¿Para qué enfermedad y por cuánto tiempo? [FT]'],
      ['Efectividad', 'Control de la enfermedad con la menor dosis [FT]'],
      ['Seguridad', 'Glucemia, presión arterial, hueso, infecciones [FT]'],
      ['Adherencia', 'Toma matutina y retirada sin saltos [FT]'],
    ],
    prf: [
      ['Seguridad', 'Suspensión brusca tras semanas de tratamiento', 'Explicar el riesgo y el esquema de retirada [FT]'],
      ['Interacción', 'Prednisona con un AINE por dolor', 'Evitar o proteger el estómago [FT]'],
      ['Efectividad', 'Diabético con glucemias altas desde que inició', 'Coordinar el ajuste con el médico [FT]'],
    ],
    plan: ['Entregar por escrito el esquema de retirada que indique el médico [FT].', 'Revisar calcio, vitamina D y protección gástrica [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Muchos pacientes temen engordar o «quedar dependientes» del corticoide. Otros, al sentirse bien, lo dejan de golpe. Hablar de ese miedo y de ese alivio es parte del tratamiento [EX].',
    preguntas: ['¿Desde cuándo lo toma y a qué dosis?', '¿Le explicaron cómo bajarlo?', '¿Ha notado cambios en el sueño, el ánimo o el azúcar?'],
    quiz: {
      pregunta: 'Un paciente toma 20 mg de prednisona hace 2 meses y quiere dejarla hoy. ¿Qué dice la ficha técnica?',
      opciones: [
        { texto: 'Que se reduce de forma gradual, por ejemplo 5 mg por semana en ese rango', correcta: true, retro: 'Entre 30 y 15 mg al día la ficha propone bajar 5 mg cada semana [FT].' },
        { texto: 'Que puede suspenderla porque ya se siente bien', correcta: false, retro: 'Tras un tratamiento prolongado, la suspensión brusca puede causar insuficiencia suprarrenal [FT].' },
        { texto: 'Que debe pasar a tomarla día de por medio sin cambiar la dosis', correcta: false, retro: 'La ficha describe un descenso escalonado de la dosis [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.endocrina, GUIAS.seguridad],
  refs: { FT: F.ftPrednisona, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Prednisolona: farmacología', '/vademecum/prednisolona'], ['Dexametasona: farmacología', '/vademecum/dexametasona'], ['Corticoides sistémicos', '/vademecum/corticoides-sistemicos']],
  seo: {
    titulo: 'Prednisona: dosis, retirada y atención farmacéutica',
    descripcion: 'Prednisona: mecanismo, conversión a prednisolona, dosis, esquema de retirada gradual, equivalencias, efectos adversos y atención farmacéutica.',
  },
});
