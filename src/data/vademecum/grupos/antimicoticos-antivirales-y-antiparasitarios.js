import { F } from '../fuentes.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/**
 * Grupo terapéutico: antimicóticos, antivirales y antiparasitarios. Datos
 * verificados el 16-nov-2026 en las fichas técnicas de CIMA y el CUM del
 * INVIMA. Las citas [n] apuntan a `referencias`.
 */
export default {
  tipo: 'grupo',
  slug: 'antimicoticos-antivirales-y-antiparasitarios',
  nombre: 'Antimicóticos, antivirales y antiparasitarios',
  titulo: 'Antimicóticos, antivirales y antiparasitarios: fluconazol, clotrimazol, nistatina, ketoconazol, aciclovir, albendazol e ivermectina',
  actualizado: '2026-11-16',
  resumen: 'Siete antiinfecciosos que no son antibióticos y que se piden a diario en la farmacia: cuatro antifúngicos (fluconazol oral, clotrimazol y ketoconazol tópicos y nistatina de acción local), un antiviral (aciclovir) y dos antiparasitarios (albendazol e ivermectina). Comparten un principio de uso racional: tratar solo infecciones diagnosticadas, con la duración completa, y vigilar las interacciones, el riñón, el hígado y el embarazo según el fármaco.',
  datosClave: [
    ['Grupos ATC', 'J02 y D01 (antifúngicos), A07AA (nistatina), J05 (aciclovir) y P02 (antihelmínticos)'],
    ['Con más registros vigentes en Colombia', 'Clotrimazol ginecológico (56), fluconazol (39) y clotrimazol cutáneo (33) [8]'],
    ['Contraindicado en el embarazo', 'Albendazol [6]'],
    ['Guía relacionada', 'Stewardship farmacéutico (PROA) de Edvanta'],
  ],
  secciones: [
    {
      id: 'mapa-del-grupo',
      titulo: 'Contra qué actúa cada uno',
      bloques: [
        { mapa: {
          centro: 'Antiinfecciosos no antibióticos',
          ramas: [
            { titulo: 'Hongos, vía oral', icono: 'Pill', nodos: ['Fluconazol [1]'] },
            { titulo: 'Hongos, en la piel', icono: 'Layers', nodos: ['Clotrimazol [2]', 'Ketoconazol [4]'] },
            { titulo: 'Hongos, en la boca', icono: 'Droplets', nodos: ['Nistatina [3]'] },
            { titulo: 'Virus herpes', icono: 'Sparkles', nodos: ['Aciclovir [5]'] },
            { titulo: 'Parásitos', icono: 'Bug', nodos: ['Albendazol [6]', 'Ivermectina [7]'] },
          ],
        } },
      ],
    },
    {
      id: 'comparacion',
      titulo: 'Pautas y alertas, comparadas',
      bloques: [
        { tabla: {
          columnas: ['', 'Pauta de referencia', 'Absorción', 'Alerta principal'],
          filas: [
            ['Fluconazol', '150 mg única en candidiasis vaginal [1]', 'Más del 90 % [1]', 'Interacciones por CYP y QT [1]'],
            ['Clotrimazol crema', '2 a 3 veces al día, 1 a 4 semanas [2]', 'Indetectable [2]', 'Daña el látex [2]'],
            ['Nistatina', 'Cada 6 a 12 horas, 48 h más tras mejorar [3]', 'Mínima [3]', 'Sacarosa en la suspensión [3]'],
            ['Ketoconazol crema', '1 a 2 veces al día, 2 a 6 semanas [4]', 'No cuantificable en adultos [4]', 'Retirar corticoides tópicos de forma gradual [4]'],
            ['Aciclovir', '800 mg cinco veces al día, 7 días [5]', 'Parcial [5]', 'Ajuste renal [5]'],
            ['Albendazol', '400 mg dos veces al día en ciclos [6]', 'Menos del 5 % [6]', 'Hígado y embarazo [6]'],
            ['Ivermectina', '200 µg/kg en dosis única [7]', 'Concentración máxima a las 4 h [7]', 'Toma lejos de las comidas [7]'],
          ],
        } },
        { barras: {
          titulo: 'Registros sanitarios vigentes en Colombia por código ATC',
          datos: [
            { etiqueta: 'Clotrimazol ginecológico', valor: 56 },
            { etiqueta: 'Fluconazol', valor: 39 },
            { etiqueta: 'Clotrimazol cutáneo', valor: 33 },
            { etiqueta: 'Aciclovir sistémico', valor: 28 },
            { etiqueta: 'Albendazol', valor: 25 },
            { etiqueta: 'Ketoconazol tópico', valor: 19 },
            { etiqueta: 'Ivermectina', valor: 9 },
            { etiqueta: 'Nistatina oral', valor: 8 },
          ],
          nota: 'CUM del INVIMA, consulta del 16-nov-2026 [8].',
        } },
        { cta: GUIAS.proa },
      ],
    },
    {
      id: 'semaforo',
      titulo: 'Semáforo de seguridad del grupo',
      bloques: [
        { alerta: { tono: 'alto', titulo: 'Fluconazol e interacciones', texto: 'Contraindicado con fármacos que prolongan el QT metabolizados por el CYP3A4; potencia los anticoagulantes [1].' } },
        { alerta: { tono: 'alto', titulo: 'Albendazol', texto: 'Contraindicado en el embarazo; control hepático en los tratamientos largos [6].' } },
        { alerta: { tono: 'medio', titulo: 'Aciclovir y riñón', texto: 'Ajustar la dosis en insuficiencia renal; más riesgo neurológico en mayores [5].' } },
        { alerta: { tono: 'bajo', titulo: 'Tópicos y acción local', texto: 'Clotrimazol, ketoconazol y nistatina casi no se absorben [2-4].' } },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica con antiinfecciosos',
      destacado: true,
      bloques: [
        'El uso racional de antimicrobianos no termina en los antibióticos. El farmacéutico confirma el diagnóstico, ajusta la dosis al peso o al riñón y asegura que el tratamiento se complete [9].',
        { ciclo: {
          titulo: 'Antes de dispensar un antiinfeccioso',
          centro: 'Uso racional',
          pasos: [
            { titulo: 'Diagnóstico', icono: 'Search', texto: '¿Infección confirmada o probable? [3,7]' },
            { titulo: 'Paciente', icono: 'Users', texto: 'Peso, riñón, embarazo, otros fármacos [1,5,6,7].' },
            { titulo: 'Pauta', icono: 'Clock', texto: 'Dosis, horarios y duración completa [2-5].' },
            { titulo: 'Seguimiento', icono: 'CalendarClock', texto: 'Cuándo volver si no mejora [10].' },
          ],
        } },
        { cta: GUIAS.problemas },
        { cta: CURSOS.gastro },
      ],
    },
  ],
  referencias: [
    F.ftFluconazol, F.ftClotrimazol, F.ftNistatina, F.ftKetoconazol, F.ftAciclovir, F.ftAlbendazol, F.ftIvermectina,
    F.invimaCum16, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Antibióticos de uso ambulatorio', '/vademecum/antibioticos-de-uso-ambulatorio'],
    ['Metronidazol: farmacología', '/vademecum/metronidazol'],
    ['Guía: Stewardship farmacéutico (PROA)', '/guia/stewardship-farmaceutico-proa'],
  ],
  seo: {
    titulo: 'Antimicóticos, antivirales y antiparasitarios',
    descripcion: 'Fluconazol, clotrimazol, nistatina, ketoconazol, aciclovir, albendazol e ivermectina: pautas, alertas de seguridad y atención farmacéutica.',
  },
};
