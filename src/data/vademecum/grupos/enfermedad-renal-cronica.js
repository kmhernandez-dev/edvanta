import { F } from '../fuentes.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/**
 * Grupo terapéutico: medicamentos para la enfermedad renal crónica.
 * Datos verificados el 17-nov-2026 en la ficha técnica de CIMA (Kerendia),
 * la guía KDIGO 2024 y los ensayos FIDELIO-DKD, FIGARO-DKD y FINEARTS-HF.
 * Las citas [n] apuntan a `referencias`.
 */
export default {
  tipo: 'grupo',
  slug: 'medicamentos-para-la-enfermedad-renal-cronica',
  nombre: 'Medicamentos para la enfermedad renal crónica',
  titulo: 'Medicamentos para la enfermedad renal crónica: finerenona, SGLT2 y protección cardiorrenal',
  actualizado: '2026-11-17',
  resumen: 'La enfermedad renal crónica se trata con más que «bajar la creatinina»: control de la presión, inhibidores del SRAA cuando hay albuminuria, inhibidores de SGLT2, finerenona en la ERC con diabetes tipo 2 y estatinas según el riesgo. La meta es retrasar la progresión, evitar eventos cardiovasculares y controlar el potasio. Este grupo reúne la farmacología de la finerenona y el lugar de la protección cardiorrenal en la práctica.',
  datosClave: [
    ['Grupo ATC', 'C03DA, antagonistas de la aldosterona; A10BK, inhibidores de SGLT2'],
    ['Finerenona', '10 o 20 mg una vez al día según la TFGe y el potasio [1]'],
    ['Población', 'ERC con albuminuria asociada a diabetes tipo 2; también IC con FEVI ≥40 % [1,5]'],
    ['Control', 'Potasio y TFGe a las 4 semanas de iniciar o ajustar [1]'],
    ['Registros en Colombia', 'El CUM registra presentaciones de finerenona [6]'],
    ['Guía de referencia', 'KDIGO 2024 [2]'],
    ['Curso relacionado', 'Farmacología Renal, gratis en el aula de Edvanta'],
  ],
  secciones: [
    {
      id: 'mapa',
      titulo: 'Qué protege el riñón y con qué',
      bloques: [
        { mapa: {
          centro: 'Protección cardiorrenal',
          ramas: [
            { titulo: 'Presión', icono: 'HeartPulse', nodos: ['IECA/ARA-II si hay albuminuria [2]'] },
            { titulo: 'Glucosa', icono: 'Activity', nodos: ['SGLT2 [2]'] },
            { titulo: 'Inflamación', icono: 'Shield', nodos: ['Finerenona [1,3,4]'] },
            { titulo: 'Riesgo vascular', icono: 'LineChart', nodos: ['Estatina según riesgo [2]'] },
          ],
        } },
        { barras: {
          titulo: 'Dosis inicial de finerenona según la TFGe (mg/día)',
          unidad: 'mg',
          datos: [
            { etiqueta: 'TFGe ≥60', valor: 20 },
            { etiqueta: 'TFGe 25-59', valor: 10 },
            { etiqueta: 'TFGe <25', valor: 0 },
          ],
          nota: 'La dosis se titula según el potasio; no se inicia si el potasio es >5,0 mmol/l [1].',
        } },
      ],
    },
    {
      id: 'semaforo',
      titulo: 'Semáforo de la finerenona',
      bloques: [
        { alerta: { tono: 'alto', titulo: 'Hiperpotasemia', texto: 'Fue la reacción adversa más frecuente (12,6 %). No iniciar con potasio >5,0 mmol/l; suspender si supera 5,5 mmol/l [1].' } },
        { alerta: { tono: 'medio', titulo: 'Interacciones CYP3A4', texto: 'Contraindicada con inhibidores fuertes como itraconazol, claritromicina o ketoconazol; evitar rifampicina y hierba de San Juan [1].' } },
        { alerta: { tono: 'bajo', titulo: 'Función renal', texto: 'No iniciar con TFGe <25 ml/min. Medir TFGe y potasio a las 4 semanas y luego periódicamente [1].' } },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica en la ERC',
      destacado: true,
      bloques: [
        'La protección renal se pierde por tres motivos evitables: potasio sin control, interacciones y falta de adherencia. El farmacéutico revisa los tres en cada dispensación [7].',
        { ciclo: {
          titulo: 'Revisión en cada dispensación',
          centro: 'TFG estable',
          pasos: [
            { titulo: 'Potasio', icono: 'FlaskConical', texto: '¿Cuándo fue el último control? [1]' },
            { titulo: 'TFGe', icono: 'Droplets', texto: '¿Se ajustó la dosis? [1]' },
            { titulo: 'Interacción', icono: 'ShieldCheck', texto: '¿Azoles, macrólidos, rifampicina? [1]' },
            { titulo: 'Adherencia', icono: 'Users', texto: '¿Qué le preocupa del tratamiento? [8]' },
          ],
        } },
        { cta: CURSOS.renal },
        { cta: GUIAS.seguridad },
      ],
    },
  ],
  referencias: [
    F.ftFinerenona, F.kdigoCkd2024, F.fidelio, F.figaro, F.finearts, F.invimaCum17, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Finerenona: farmacología y potasio', '/vademecum/finerenona'],
    ['Dapagliflozina: corazón y riñón', '/vademecum/dapagliflozina'],
    ['Enfermedad renal crónica: síntomas y etapas', '/articulos/enfermedad-renal-cronica-sintomas-y-etapas'],
    ['Curso gratis: Farmacología Renal', '/curso-de-farmacologia-renal'],
  ],
  seo: {
    titulo: 'Medicamentos para la enfermedad renal crónica',
    descripcion: 'ERC: finerenona, SGLT2, control de potasio y presión, KDIGO 2024, FIDELIO, FIGARO, FINEARTS y atención farmacéutica.',
  },
};
