import { F } from '../fuentes.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/**
 * Grupo terapéutico: medicamentos para la tiroides. Datos verificados el
 * 16-nov-2026 en la ficha técnica de CIMA y el CUM del INVIMA. Las citas
 * [n] apuntan a `referencias`.
 */
export default {
  tipo: 'grupo',
  slug: 'medicamentos-para-la-tiroides',
  nombre: 'Medicamentos para la tiroides',
  titulo: 'Medicamentos para la tiroides: levotiroxina y atención farmacéutica en el hipotiroidismo',
  actualizado: '2026-11-16',
  resumen: 'La levotiroxina es uno de los medicamentos de uso crónico más dispensados: en Colombia hay 50 registros sanitarios vigentes. Es la misma hormona que produce la tiroides, y su éxito depende menos de la dosis que de la forma de tomarla: en ayunas, a la misma hora, lejos del calcio, el hierro y los antiácidos, y con controles de TSH. Este grupo reúne su farmacología y la atención farmacéutica que convierte una TSH inestable en una TSH en meta.',
  datosClave: [
    ['Grupo ATC', 'H03AA, hormonas tiroideas'],
    ['Registros vigentes en Colombia', '50 con el código H03AA01 [2]'],
    ['Toma', 'En ayunas, media hora antes del desayuno [1]'],
    ['Curso relacionado', 'Autocuidado de la tiroides, gratis en el aula de Edvanta'],
  ],
  secciones: [
    {
      id: 'mapa',
      titulo: 'Qué hace y para qué se usa',
      bloques: [
        { mapa: {
          centro: 'Levotiroxina',
          ramas: [
            { titulo: 'Hipotiroidismo', icono: 'RefreshCw', nodos: ['Sustitución [1]'] },
            { titulo: 'Bocio', icono: 'Shield', nodos: ['Tratamiento y prevención [1]'] },
            { titulo: 'Cáncer de tiroides', icono: 'Target', nodos: ['Supresión [1]'] },
            { titulo: 'Control', icono: 'LineChart', nodos: ['TSH [1]'] },
          ],
        } },
        { barras: {
          titulo: 'Dosis diaria de referencia según la indicación (µg, valor máximo)',
          unidad: 'µg',
          datos: [
            { etiqueta: 'Carcinoma tiroideo', valor: 300 },
            { etiqueta: 'Hipotiroidismo, mantenimiento', valor: 200 },
            { etiqueta: 'Bocio eutiroideo', valor: 200 },
            { etiqueta: 'Hipotiroidismo, inicio', valor: 50 },
          ],
          nota: 'Ficha técnica [1].',
        } },
      ],
    },
    {
      id: 'semaforo',
      titulo: 'Semáforo de la levotiroxina',
      bloques: [
        { alerta: { tono: 'alto', titulo: 'Corazón', texto: 'En mayores y cardiópatas se inicia con 12,5 µg y se sube cada 2 semanas [1].' } },
        { alerta: { tono: 'medio', titulo: 'Interacciones de absorción', texto: 'Calcio, hierro y antiácidos: separar 2 horas; resinas: 4 a 5 horas [1].' } },
        { alerta: { tono: 'bajo', titulo: 'Embarazo', texto: 'El tratamiento continúa y puede necesitar más dosis; TSH en cada trimestre [1].' } },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica en el hipotiroidismo',
      destacado: true,
      bloques: [
        'Una TSH fuera de meta suele esconder un problema de toma o una interacción, más que una dosis equivocada. Revisarlo es trabajo del farmacéutico [3].',
        { ciclo: {
          titulo: 'Revisión en cada dispensación',
          centro: 'TSH en meta',
          pasos: [
            { titulo: 'Hora', icono: 'Sunrise', texto: '¿Cada mañana, en ayunas? [1]' },
            { titulo: 'Separar', icono: 'Clock', texto: '¿Calcio, hierro o antiácidos cerca? [1]' },
            { titulo: 'Control', icono: 'LineChart', texto: '¿Cuándo fue la última TSH? [1]' },
            { titulo: 'Escuchar', icono: 'Users', texto: 'Cansancio, peso, ánimo [4].' },
          ],
        } },
        { cta: CURSOS.tiroides },
        { cta: GUIAS.levotiroxina },
      ],
    },
  ],
  referencias: [F.ftLevotiroxina, F.invimaCum16, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Guía gratuita: levotiroxina', '/recurso/levotiroxina'],
    ['Curso gratis: Autocuidado de la tiroides', '/curso-de-autocuidado-de-la-tiroides'],
    ['Corticoides sistémicos', '/vademecum/corticoides-sistemicos'],
  ],
  seo: {
    titulo: 'Medicamentos para la tiroides: levotiroxina',
    descripcion: 'Levotiroxina: cómo tomarla, dosis en hipotiroidismo, interacciones con calcio y hierro, TSH, embarazo y atención farmacéutica.',
  },
};
