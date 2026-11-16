import { F } from '../fuentes.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/**
 * Grupo terapéutico: medicamentos para el aparato digestivo. Datos
 * verificados el 16-nov-2026 en las fichas técnicas de CIMA y el CUM del
 * INVIMA. Las citas [n] apuntan a `referencias`.
 */
export default {
  tipo: 'grupo',
  slug: 'medicamentos-para-el-aparato-digestivo',
  nombre: 'Medicamentos para el aparato digestivo',
  titulo: 'Medicamentos para el aparato digestivo: antisecretores, antieméticos, antiespasmódicos, antidiarreicos y laxantes',
  actualizado: '2026-11-16',
  resumen: 'Doce medicamentos que resuelven buena parte de las consultas de la droguería: omeprazol, esomeprazol y lansoprazol para el ácido; metoclopramida, domperidona, ondansetrón y dimenhidrinato para la náusea y el vómito; butilescopolamina y simeticona para el cólico y los gases; loperamida para la diarrea; y bisacodilo y lactulosa para el estreñimiento. Cada uno tiene un límite que no se negocia: la duración de los inhibidores de la bomba, los 5 días de la metoclopramida, el riesgo cardiaco de la domperidona o la diarrea que la loperamida nunca debe frenar.',
  datosClave: [
    ['Grupos ATC', 'A02 (antisecretores), A03 (antiespasmódicos y procinéticos), A04 (antieméticos), A06 (laxantes), A07 (antidiarreicos) y R06 (dimenhidrinato)'],
    ['Con más registros vigentes en Colombia', 'Esomeprazol (63), omeprazol (36) y metoclopramida (22) [13]'],
    ['Límites clave', 'Metoclopramida 5 días; domperidona una semana; loperamida 2 días [4,5,10]'],
    ['Curso relacionado', 'Farmacología Gastrointestinal, gratis en el aula de Edvanta'],
  ],
  secciones: [
    {
      id: 'dianas',
      titulo: 'Dónde actúa cada medicamento',
      bloques: [
        { mapa: {
          centro: 'Tubo digestivo',
          ramas: [
            { titulo: 'Ácido', icono: 'Flame', nodos: ['Omeprazol [1]', 'Esomeprazol [2]', 'Lansoprazol [3]'] },
            { titulo: 'Náusea', icono: 'Waves', nodos: ['Metoclopramida [4]', 'Domperidona [5]', 'Ondansetrón [6]', 'Dimenhidrinato [7]'] },
            { titulo: 'Espasmo', icono: 'Activity', nodos: ['Butilescopolamina [8]'] },
            { titulo: 'Gases', icono: 'Wind', nodos: ['Simeticona [9]'] },
            { titulo: 'Diarrea', icono: 'Droplets', nodos: ['Loperamida [10]'] },
            { titulo: 'Estreñimiento', icono: 'Repeat', nodos: ['Bisacodilo [11]', 'Lactulosa [12]'] },
          ],
        } },
      ],
    },
    {
      id: 'inhibidores-de-la-bomba',
      titulo: 'Los tres inhibidores de la bomba de protones, comparados',
      bloques: [
        { tabla: {
          columnas: ['', 'Omeprazol', 'Esomeprazol', 'Lansoprazol'],
          filas: [
            ['Dosis habitual', '20 mg al día [1]', '20 a 40 mg al día [2]', '15 a 30 mg al día [3]'],
            ['Semivida', 'Menos de 1 hora [1]', 'Cerca de 1,3 horas [2]', '1 a 2 horas [3]'],
            ['Ajuste hepático', '10 a 20 mg al día [1]', 'Máximo 20 mg en la grave [2]', 'Reducir 50 % en moderada o grave [3]'],
            ['Interacción destacada', 'Clopidogrel, CYP2C19 [1]', 'Clopidogrel, metotrexato [2]', 'Atazanavir, tacrolimus [3]'],
            ['Registros en Colombia', '36 [13]', '63 [13]', '13 [13]'],
          ],
        } },
        { barras: {
          titulo: 'Registros sanitarios vigentes en Colombia por código ATC',
          datos: [
            { etiqueta: 'Esomeprazol', valor: 63 },
            { etiqueta: 'Omeprazol', valor: 36 },
            { etiqueta: 'Metoclopramida', valor: 22 },
            { etiqueta: 'Ondansetrón', valor: 21 },
            { etiqueta: 'Butilescopolamina', valor: 20 },
            { etiqueta: 'Lansoprazol', valor: 13 },
            { etiqueta: 'Simeticona', valor: 12 },
          ],
          nota: 'CUM del INVIMA, consulta del 16-nov-2026 [13].',
        } },
      ],
    },
    {
      id: 'semaforo',
      titulo: 'Semáforo de seguridad del grupo',
      bloques: [
        { alerta: { tono: 'alto', titulo: 'Domperidona y metoclopramida', texto: 'La domperidona prolonga el QT y se asocia con muerte súbita; la metoclopramida puede causar discinesia tardía. Ambas tienen límites estrictos de dosis y duración [4,5].' } },
        { alerta: { tono: 'alto', titulo: 'Loperamida', texto: 'Nunca en diarrea con sangre y fiebre, colitis pseudomembranosa o enterocolitis invasiva; en sobredosis causa arritmias graves [10].' } },
        { alerta: { tono: 'medio', titulo: 'Inhibidores de la bomba en uso prolongado', texto: 'Hipomagnesemia, déficit de vitamina B12 y fracturas: el tratamiento crónico necesita una razón y una revisión [1-3].' } },
        { alerta: { tono: 'bajo', titulo: 'Simeticona y lactulosa', texto: 'Casi no se absorben y pueden usarse en el embarazo y la lactancia [9,12].' } },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica en el aparato digestivo',
      destacado: true,
      bloques: [
        'La mayoría de estos medicamentos se dispensan sin fórmula. El aporte del farmacéutico es reconocer los signos de alarma que obligan a consultar y cortar los usos prolongados sin revisión [14].',
        { ciclo: {
          titulo: 'Ante cualquier síntoma digestivo',
          centro: '¿Tratar o remitir?',
          pasos: [
            { titulo: 'Escuchar', icono: 'Users', texto: 'Qué siente, desde cuándo y qué ha tomado [15].' },
            { titulo: 'Alarmas', icono: 'Siren', texto: 'Sangre, fiebre, dolor intenso, pérdida de peso o vómito persistente: remitir [8,10,11].' },
            { titulo: 'Elegir', icono: 'Pill', texto: 'El medicamento justo, a la dosis y por el tiempo de su ficha técnica [1-12].' },
            { titulo: 'Seguir', icono: 'CalendarClock', texto: 'Acordar cuándo volver si no mejora [14].' },
          ],
        } },
        { cta: CURSOS.gastro },
        { cta: GUIAS.problemas },
      ],
    },
  ],
  referencias: [
    F.ftOmeprazol, F.ftEsomeprazol, F.ftLansoprazol, F.ftMetoclopramida, F.ftDomperidona, F.ftOndansetron,
    F.ftDimenhidrinato, F.ftButilescopolamina, F.ftSimeticona, F.ftLoperamida, F.ftBisacodilo, F.ftLactulosa,
    F.invimaCum16, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Omeprazol: para qué sirve', '/articulos/omeprazol-para-que-sirve'],
    ['Buscapina: para qué sirve', '/articulos/buscapina-para-que-sirve'],
    ['Dieta para la gastritis', '/articulos/dieta-para-la-gastritis'],
    ['Curso gratis: Farmacología Gastrointestinal', '/curso-de-farmacologia-gastrointestinal'],
  ],
  seo: {
    titulo: 'Medicamentos para el aparato digestivo: vademécum',
    descripcion: 'Omeprazol, esomeprazol, metoclopramida, domperidona, ondansetrón, loperamida, laxantes y más: mecanismos, límites de seguridad y atención farmacéutica.',
  },
};
