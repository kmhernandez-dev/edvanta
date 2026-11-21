import { F } from '../fuentes.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/**
 * Grupo terapéutico: alergia y vías respiratorias. Datos verificados el
 * 16-nov-2026 en las fichas técnicas de CIMA y el CUM del INVIMA. Las
 * citas [n] apuntan a `referencias`.
 */
export default {
  tipo: 'grupo',
  slug: 'alergia-y-vias-respiratorias',
  nombre: 'Alergia y vías respiratorias',
  titulo: 'Medicamentos para la alergia y las vías respiratorias: antihistamínicos, antileucotrienos, broncodilatadores y mucolíticos',
  actualizado: '2026-11-16',
  resumen: 'Ocho medicamentos que llenan el mostrador en cada temporada de alergias y gripas: cinco antihistamínicos (loratadina, desloratadina, cetirizina, clorfeniramina e hidroxizina), un antileucotrieno (montelukast), el broncodilatador de rescate (salbutamol) y un mucolítico (acetilcisteína). La diferencia entre un antihistamínico de primera y de segunda generación se mide en sueño, caídas y accidentes; la diferencia entre un rescate bien usado y uno abusado se mide en crisis de asma evitables.',
  datosClave: [
    ['Grupos ATC', 'R06 (antihistamínicos), N05BB (hidroxizina), R03 (asma) y R05 (mucolíticos)'],
    ['Con más registros vigentes en Colombia', 'Desloratadina (57), cetirizina (53), montelukast y acetilcisteína (41 cada uno) [9]'],
    ['Señal de alarma', 'Salbutamol a demanda más de 2 veces por semana: reevaluar el asma [7]'],
    ['Curso relacionado', 'Farmacología Respiratoria, en el aula de Edvanta'],
  ],
  secciones: [
    {
      id: 'mapa-del-grupo',
      titulo: 'Qué hace cada medicamento',
      bloques: [
        { mapa: {
          centro: 'Alergia y vía aérea',
          ramas: [
            { titulo: 'Antihistamínicos modernos', icono: 'Sun', nodos: ['Loratadina [1]', 'Desloratadina [3]', 'Cetirizina [2]'] },
            { titulo: 'Antihistamínicos sedantes', icono: 'Moon', nodos: ['Clorfeniramina [4]', 'Hidroxizina [5]'] },
            { titulo: 'Asma: control', icono: 'Shield', nodos: ['Montelukast [6]'] },
            { titulo: 'Asma: rescate', icono: 'Zap', nodos: ['Salbutamol [7]'] },
            { titulo: 'Moco', icono: 'Droplets', nodos: ['Acetilcisteína [8]'] },
          ],
        } },
      ],
    },
    {
      id: 'antihistaminicos-comparados',
      titulo: 'Los antihistamínicos, comparados',
      bloques: [
        { tabla: {
          columnas: ['', 'Dosis habitual en adultos', 'Somnolencia', 'Dato que cambia la decisión'],
          filas: [
            ['Loratadina', '10 mg al día [1]', '1,2 % [1]', 'Ajuste solo en insuficiencia hepática grave [1]'],
            ['Desloratadina', '5 mg al día [3]', 'No sedante según su ficha [3]', '4 % son metabolizadores lentos [3]'],
            ['Cetirizina', '10 mg al día [2]', '9,63 % frente a 5 % con placebo [2]', 'Se ajusta por función renal [2]'],
            ['Dexclorfeniramina', '2 mg, 3 o 4 veces al día [4]', 'Ligera o moderada, la más frecuente [4]', 'Contraindicada en glaucoma y próstata [4]'],
            ['Hidroxizina', 'Hasta 100 mg al día [5]', 'Frecuente [5]', 'Prolonga el QT [5]'],
          ],
        } },
        { barras: {
          titulo: 'Registros sanitarios vigentes en Colombia por código ATC',
          datos: [
            { etiqueta: 'Desloratadina', valor: 57 },
            { etiqueta: 'Cetirizina', valor: 53 },
            { etiqueta: 'Montelukast', valor: 41 },
            { etiqueta: 'Acetilcisteína', valor: 41 },
            { etiqueta: 'Loratadina', valor: 33 },
            { etiqueta: 'Salbutamol inhalado', valor: 13 },
            { etiqueta: 'Hidroxizina', valor: 11 },
            { etiqueta: 'Clorfenamina', valor: 10 },
          ],
          nota: 'CUM del INVIMA, consulta del 16-nov-2026 [9].',
        } },
        { cta: CURSOS.respiratoria },
      ],
    },
    {
      id: 'semaforo',
      titulo: 'Semáforo de seguridad del grupo',
      bloques: [
        { alerta: { tono: 'alto', titulo: 'Hidroxizina y el corazón', texto: 'Contraindicada con QT prolongado o factores de riesgo; se evita con otros fármacos que alargan el QT. Contraindicada en el embarazo y la lactancia [5].' } },
        { alerta: { tono: 'alto', titulo: 'Salbutamol de más', texto: 'Usarlo a demanda más de dos veces por semana indica que el asma no está controlada [7].' } },
        { alerta: { tono: 'medio', titulo: 'Montelukast y conducta', texto: 'Vigilar cambios de comportamiento, depresión o ideas suicidas; no sirve para la crisis [6].' } },
        { alerta: { tono: 'medio', titulo: 'Clorfeniramina en niños y mayores', texto: 'Contraindicada en menores de 2 años; los mayores de 60 son más sensibles a la sedación [4].' } },
        { alerta: { tono: 'bajo', titulo: 'Loratadina y desloratadina', texto: 'Influencia nula o insignificante sobre la conducción en sus ensayos [1,3].' } },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica en alergia y asma',
      destacado: true,
      bloques: [
        'La mayoría de estos medicamentos se piden sin fórmula. El farmacéutico decide si el síntoma es alérgico, si el asma está controlada y si la combinación con otros productos suma sedación o anula el efecto [10].',
        { ciclo: {
          titulo: 'Ante una consulta por alergia o tos',
          centro: '¿Tratar o remitir?',
          pasos: [
            { titulo: 'Escuchar', icono: 'Users', texto: 'Síntomas, duración y qué ha usado [11].' },
            { titulo: 'Alarmas', icono: 'Siren', texto: 'Rescate más de 2 veces por semana o sin mejoría en 5 a 7 días: remitir [1,7,8].' },
            { titulo: 'Elegir', icono: 'Pill', texto: 'Antihistamínico moderno si conduce o es mayor [1,3,4].' },
            { titulo: 'Combinar bien', icono: 'Ban', texto: 'Nada de antitusígeno con mucolítico [8].' },
          ],
        } },
        { cta: CURSOS.asma },
        { cta: GUIAS.problemas },
      ],
    },
  ],
  referencias: [
    F.ftLoratadina, F.ftCetirizina, F.ftDesloratadina, F.ftDexclorfeniramina, F.ftHidroxizina, F.ftMontelukast,
    F.ftSalbutamol, F.ftAcetilcisteina, F.invimaCum16, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Loratadina: para qué sirve', '/articulos/loratadina-para-que-sirve'],
    ['Corticoides sistémicos', '/vademecum/corticoides-sistemicos'],
    ['Curso: Farmacología Respiratoria', '/curso-de-farmacologia-respiratoria'],
  ],
  seo: {
    titulo: 'Antihistamínicos y medicamentos respiratorios',
    descripcion: 'Loratadina, cetirizina, desloratadina, clorfeniramina, hidroxizina, montelukast, salbutamol y acetilcisteína: diferencias, riesgos y consejería.',
  },
};
