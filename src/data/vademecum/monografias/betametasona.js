import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Betametasona. Verificada el 16-nov-2026: ficha técnica de CIMA (Betametasona Sonphar 0,5 mg/ml gotas) y CUM del INVIMA (16 registros vigentes con ATC H02AB01). */
export default crearMonografia({
  slug: 'betametasona',
  nombre: 'Betametasona',
  grupo: 'corticoides-sistemicos',
  clase: 'Glucocorticoide sistémico de alta potencia',
  atc: 'H02AB01',
  vias: ['Oral'],
  mecanismo: 'Glucocorticoide sintético de alta potencia: 0,75 mg equivalen a 5 mg de prednisona; acción antiinflamatoria e inmunosupresora prolongada.',
  resumenCorto: 'glucocorticoide de alta potencia: 0,75 mg equivalen a 5 mg de prednisona; semivida biológica de 36 a 54 horas y dosis pediátrica por gotas y peso.',
  resumen: 'La betametasona es un glucocorticoide sintético de alta potencia: según su ficha técnica, 0,75 mg equivalen a 5 mg de prednisona. Su semivida biológica, de 36 a 54 horas, es de las más largas del grupo. La ficha de referencia, en gotas orales, la indica en asma, reacciones de hipersensibilidad graves y anafilaxia, enfermedades reumáticas y autoinmunes, dermatosis graves, enfermedades renales, digestivas y hematológicas, y en la inmunosupresión de trasplantes en niños. El farmacéutico vigila que la potencia no se subestime: dosis pequeñas en miligramos pueden ser dosis altas de corticoide.',
  datosClave: [
    ['Clase', 'Glucocorticoide de alta potencia [FT]'],
    ['Código ATC', 'H02AB01 [CUM]'],
    ['Equivalencia', '0,75 mg equivalen a 5 mg de prednisona [FT]'],
    ['Presentación de referencia', '40 gotas = 1 ml = 0,5 mg [FT]'],
    ['Semivida biológica', '36 a 54 horas [FT]'],
    ['Colombia', '16 registros vigentes con el código ATC H02AB01 [CUM]'],
  ],
  quimica: ['Glucocorticoide sintético. La presentación de referencia son gotas orales en solución de 0,5 mg/ml: 40 gotas equivalen a 1 ml y a 0,5 mg [FT].', 'Contiene sacarosa, sorbitol y propilenglicol como excipientes [FT].'],
  dinamia: [
    'Glucocorticoide sintético de elevada potencia, con acción antiinflamatoria e inmunosupresora: 0,75 mg de betametasona equivalen a 5 mg de prednisona [FT].',
    { claves: [
      { icono: 'Zap', titulo: 'Alta potencia', texto: '0,75 mg rinden lo que 5 mg de prednisona [FT].' },
      { icono: 'Clock', titulo: 'Acción larga', texto: 'Semivida biológica de 36 a 54 horas [FT].' },
      { icono: 'Pipette', titulo: 'Dosis en gotas', texto: '40 gotas son 0,5 mg [FT].' },
    ] },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción', 'Rápida; niveles en sangre a los 20 minutos y máximo a las 2 horas [FT]'],
    ['Semivida plasmática', 'De 3 a 3,6 horas, hasta más de 5 horas [FT]'],
    ['Semivida biológica', '36 a 54 horas [FT]'],
    ['Eliminación', 'Renal, como metabolitos inactivos conjugados [FT]'],
  ])],
  indicaciones: [
    { mapa: {
      centro: 'Betametasona',
      ramas: [
        { titulo: 'Alergia', icono: 'Siren', nodos: ['Asma', 'Anafilaxia', 'Hipersensibilidad grave'] },
        { titulo: 'Autoinmunidad', icono: 'Shield', nodos: ['Lupus', 'Artritis juvenil', 'Dermatomiositis'] },
        { titulo: 'Piel', icono: 'Layers', nodos: ['Pénfigo', 'Penfigoide'] },
        { titulo: 'Riñón e intestino', icono: 'Droplets', nodos: ['Síndrome nefrótico', 'Colitis ulcerosa', 'Crohn'] },
        { titulo: 'Sangre', icono: 'Droplet', nodos: ['Anemia hemolítica', 'Leucemias', 'Linfomas'] },
      ],
    } },
    'Indicada en asma bronquial, reacciones de hipersensibilidad graves y anafilaxia, artritis reumatoide juvenil, lupus, dermatomiositis, poliarteritis nudosa, pénfigo y penfigoide, síndrome nefrótico, nefritis intersticial aguda, colitis ulcerosa, enfermedad de Crohn, sarcoidosis, carditis reumática, enfermedades hematológicas y en la inmunosupresión de trasplantes en niños [FT].',
  ],
  posologia: [
    T(['Situación', 'Dosis'], [
      ['Adultos', 'Individualizada según la enfermedad [FT]'],
      ['Niños, ataque', '0,075 mg/kg/día (6 gotas/kg) a 0,3 mg/kg/día (24 gotas/kg) [FT]'],
      ['Niños, mantenimiento', '0,03 mg/kg/día (3 gotas/kg) [FT]'],
    ]),
    { barras: {
      titulo: 'Gotas por kilo al día en niños',
      unidad: ['gota', 'gotas'],
      datos: [
        { etiqueta: 'Ataque, dosis alta', valor: 24 },
        { etiqueta: 'Ataque, dosis baja', valor: 6 },
        { etiqueta: 'Mantenimiento', valor: 3 },
      ],
      nota: 'Ficha técnica de las gotas de 0,5 mg/ml [FT].',
    } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad y en infecciones sistémicas sin tratamiento antiinfeccioso adecuado [FT].',
    { alerta: { tono: 'alto', titulo: 'Retirada gradual', texto: 'La suspensión se hace de forma escalonada para evitar la insuficiencia suprarrenal [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Precauciones', texto: 'Úlcera, diabetes, hipertensión, glaucoma, osteoporosis, trastornos psiquiátricos, contacto con varicela o sarampión y controles de dopaje [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Fármacos que inducen torsades de pointes, antiarrítmicos', 'Más riesgo si baja el potasio', 'Vigilar potasio y ECG [FT]'],
    ['Diuréticos hipopotasemiantes, digitálicos', 'Hipopotasemia y toxicidad digitálica', 'Vigilar potasio [FT]'],
    ['AINE, salicilatos, alcohol', 'Más riesgo digestivo', 'Evitar o proteger [FT]'],
    ['Insulina, metformina, sulfonilureas', 'Hiperglucemia', 'Ajustar con el médico [FT]'],
    ['Inductores e inhibidores del CYP3A4, macrólidos', 'Cambian sus concentraciones', 'Vigilar [FT]'],
    ['Vacunas vivas atenuadas', 'Riesgo de enfermedad vacunal', 'Evitar [FT]'],
  ])],
  adversas: [
    'Frecuentes: euforia, insomnio y agitación [FT].',
    L(['Según la dosis y la duración: retención de sodio y edema, hiperglucemia, aumento de peso, supresión suprarrenal, síndrome de Cushing, osteoporosis, úlcera, infecciones, acné, cataratas y glaucoma [FT].']),
  ],
  embarazo: [L([
    'Embarazo: atraviesa la placenta; posible retraso del crecimiento intrauterino y vigilancia de insuficiencia suprarrenal neonatal [FT].',
    'Lactancia: pasa a la leche; se desaconseja amamantar durante el tratamiento [FT].',
  ])],
  evidencia: [
    'Su alta potencia y su larga duración permiten dosis pequeñas en miligramos; por la misma razón, la supresión suprarrenal puede aparecer con dosis que parecen bajas [FT].',
    { triangulo: {
      titulo: 'Leer bien una dosis de betametasona',
      centro: 'Miligramos engañosos',
      vertices: [
        { titulo: 'Potencia', icono: 'Zap', texto: '0,75 mg equivalen a 5 mg de prednisona [FT].' },
        { titulo: 'Duración', icono: 'Clock', texto: 'Hasta 54 horas de efecto biológico [FT].' },
        { titulo: 'Retirada', icono: 'Hourglass', texto: 'Escalonada tras uso prolongado [FT].' },
      ],
    } },
  ],
  regulacion: [L([
    'Colombia: 16 registros sanitarios vigentes con el código ATC H02AB01 (uso sistémico); consulta del 16-nov-2026 [CUM].',
    'España: autorizada, entre otras, como Betametasona Sonphar 0,5 mg/ml gotas orales en solución [FT].',
  ])],
  atencion: {
    intro: 'Con la betametasona, el riesgo está en subestimar la dosis: 1 mg parece poco y no lo es. Traducirla a su equivalente en prednisona ayuda a todo el equipo [FT,MN].',
    necesidades: [
      ['Indicación', 'Enfermedad que justifica un corticoide potente [FT]'],
      ['Efectividad', 'Control con la menor dosis [FT]'],
      ['Seguridad', 'Glucemia, presión, potasio, infecciones [FT]'],
      ['Adherencia', 'Gotas medidas con exactitud [FT]'],
    ],
    prf: [
      ['Dosis demasiado alta', 'Cálculo de gotas pediátricas con el peso equivocado', 'Recalcular y explicar [FT]'],
      ['Interacción', 'Uso con diurético y digoxina', 'Vigilar potasio [FT]'],
      ['Seguridad', 'Niño expuesto a varicela', 'Consultar al médico [FT]'],
    ],
    plan: ['Traducir la dosis a su equivalente en prednisona en la historia [FT].', 'Explicar la retirada gradual [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Preguntar cuántas veces ha recibido corticoides, en gotas, tabletas o inyección, revela exposiciones acumuladas que nadie suma [EX].',
    preguntas: ['¿Cuántas veces ha recibido corticoides este año?', '¿En gotas, tabletas o inyección?', '¿Ha notado hinchazón, insomnio o azúcar alto?'],
    quiz: {
      pregunta: '¿A cuántos miligramos de prednisona equivalen 0,75 mg de betametasona según su ficha técnica?',
      opciones: [
        { texto: '5 mg', correcta: true, retro: 'Es la equipotencia que indica la ficha técnica [FT].' },
        { texto: '0,75 mg', correcta: false, retro: 'La betametasona es bastante más potente [FT].' },
        { texto: '50 mg', correcta: false, retro: 'La ficha técnica indica 5 mg [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.endocrina, GUIAS.workup],
  refs: { FT: F.ftBetametasona, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Dexametasona: farmacología', '/vademecum/dexametasona'], ['Prednisona: farmacología', '/vademecum/prednisona'], ['Corticoides sistémicos', '/vademecum/corticoides-sistemicos']],
  seo: {
    titulo: 'Betametasona: potencia, dosis y atención farmacéutica',
    descripcion: 'Betametasona: equivalencia con prednisona, dosis en gotas para niños, semivida, indicaciones, interacciones, riesgos y atención farmacéutica.',
  },
});
