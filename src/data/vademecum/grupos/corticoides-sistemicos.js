import { F } from '../fuentes.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/**
 * Grupo terapéutico: corticoides sistémicos. Datos verificados el
 * 16-nov-2026 en las fichas técnicas de CIMA y el CUM del INVIMA. Las
 * citas [n] apuntan a `referencias`.
 */
export default {
  tipo: 'grupo',
  slug: 'corticoides-sistemicos',
  nombre: 'Corticoides sistémicos',
  titulo: 'Corticoides sistémicos: prednisona, prednisolona, dexametasona, betametasona e hidrocortisona',
  actualizado: '2026-11-16',
  resumen: 'Cinco glucocorticoides que comparten mecanismo y riesgos, pero no potencia ni duración. La hidrocortisona es el cortisol y reemplaza la función suprarrenal; la prednisona y la prednisolona son los caballos de batalla de la inflamación y la autoinmunidad; la dexametasona y la betametasona son las más potentes y las de efecto más largo. Todos suprimen el eje suprarrenal cuando se usan por semanas, y por eso ninguno se suspende de golpe después de un tratamiento prolongado.',
  datosClave: [
    ['Grupo ATC', 'H02AB, glucocorticoides de uso sistémico'],
    ['Equivalencias de ficha técnica', '5 mg de prednisona = 20 mg de hidrocortisona = 0,75 mg de betametasona [1,4]'],
    ['El más potente', 'Dexametasona: 30 veces la hidrocortisona [3]'],
    ['Registros vigentes en Colombia', 'Dexametasona 27, betametasona 16, prednisolona 12 e hidrocortisona 10 [6]'],
    ['Curso relacionado', 'Farmacología Endocrina, gratis en el aula de Edvanta'],
  ],
  secciones: [
    {
      id: 'mapa-del-grupo',
      titulo: 'El mismo receptor, cinco perfiles distintos',
      bloques: [
        'Todos actúan sobre el receptor de glucocorticoides y reducen la inflamación y la respuesta inmune. Lo que cambia es cuánto efecto dan por miligramo, cuánto dura y si retienen sal [1-5].',
        { mapa: {
          centro: 'Glucocorticoides',
          ramas: [
            { titulo: 'Sustitución', icono: 'RefreshCw', nodos: ['Hidrocortisona [5]'] },
            { titulo: 'Acción intermedia', icono: 'Clock', nodos: ['Prednisona [1]', 'Prednisolona [2]'] },
            { titulo: 'Alta potencia', icono: 'Zap', nodos: ['Dexametasona [3]', 'Betametasona [4]'] },
            { titulo: 'Riesgos comunes', icono: 'AlertTriangle', nodos: ['Supresión suprarrenal', 'Hiperglucemia', 'Osteoporosis', 'Infecciones'] },
          ],
        } },
      ],
    },
    {
      id: 'equivalencias',
      titulo: 'Equivalencias y duración, según sus fichas técnicas',
      bloques: [
        { tabla: {
          columnas: ['', 'Dosis equivalente', 'Semivida biológica', 'Uso típico'],
          filas: [
            ['Hidrocortisona', '20 mg [1]', 'Semivida plasmática de 1,5 horas [5]', 'Insuficiencia suprarrenal [5]'],
            ['Prednisona', '5 mg [1]', '12 a 36 horas [1]', 'Inflamación y autoinmunidad [1]'],
            ['Prednisolona', 'Misma potencia que la prednisona [3]', '18 a 36 horas [2]', 'Asma y pediatría [2]'],
            ['Dexametasona', '7,5 veces más potente que la prednisona [3]', '36 horas [3]', 'Edema cerebral, oncología, COVID-19 [3]'],
            ['Betametasona', '0,75 mg [4]', '36 a 54 horas [4]', 'Alergia grave y autoinmunidad [4]'],
          ],
        } },
        { barras: {
          titulo: 'Semivida biológica máxima (horas)',
          unidad: ['hora', 'horas'],
          datos: [
            { etiqueta: 'Betametasona', valor: 54 },
            { etiqueta: 'Dexametasona', valor: 36 },
            { etiqueta: 'Prednisolona', valor: 36 },
            { etiqueta: 'Prednisona', valor: 36 },
          ],
          nota: 'Fichas técnicas [1-4]. La hidrocortisona solo informa la semivida plasmática, cerca de 1,5 horas [5].',
        } },
        { cta: CURSOS.endocrina },
      ],
    },
    {
      id: 'semaforo',
      titulo: 'Semáforo de seguridad del grupo',
      bloques: [
        { alerta: { tono: 'alto', titulo: 'Suspensión brusca', texto: 'Tras un tratamiento prolongado, suspender de golpe puede causar insuficiencia suprarrenal aguda; la supresión puede durar meses [1-3].' } },
        { alerta: { tono: 'alto', titulo: 'Infecciones', texto: 'Aumentan el riesgo de infecciones, pueden enmascararlas y reactivar la tuberculosis o la hepatitis B; las vacunas vivas se evitan alrededor del tratamiento [1-3].' } },
        { alerta: { tono: 'medio', titulo: 'Glucosa, presión y hueso', texto: 'Hiperglucemia, retención de sodio, hipertensión, pérdida de potasio y osteoporosis en los tratamientos largos [1-4].' } },
        { alerta: { tono: 'bajo', titulo: 'Hidrocortisona de sustitución', texto: 'En dosis fisiológicas para la insuficiencia suprarrenal, su uso en el embarazo es admisible [5].' } },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica con corticoides',
      destacado: true,
      bloques: [
        'El farmacéutico es quien ve los ciclos repetidos, las suspensiones bruscas y las combinaciones con AINE. Su aporte es convertir cada dispensación en una revisión de dosis, duración y protección [7].',
        { ciclo: {
          titulo: 'Revisión del corticoide en cuatro pasos',
          centro: 'Menor dosis, menor tiempo',
          pasos: [
            { titulo: 'Para qué', icono: 'Target', texto: 'Indicación y duración prevista [1-5].' },
            { titulo: 'Cuánto', icono: 'Scale', texto: 'Dosis traducida a su equivalente en prednisona [1,3,4].' },
            { titulo: 'Qué vigilar', icono: 'Eye', texto: 'Glucemia, presión, infecciones, hueso [1-4].' },
            { titulo: 'Cómo termina', icono: 'Hourglass', texto: 'Retirada gradual si el uso fue prolongado [1].' },
          ],
        } },
        'La experiencia del paciente cuenta: el miedo a engordar, el insomnio o la euforia explican muchas suspensiones por cuenta propia [8].',
        { cta: GUIAS.seguridad },
      ],
    },
  ],
  referencias: [
    F.ftPrednisona, F.ftPrednisolona, F.ftDexametasona, F.ftBetametasona, F.ftHidrocortisona,
    F.invimaCum16, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Prednisona: farmacología', '/vademecum/prednisona'],
    ['Dexametasona: farmacología', '/vademecum/dexametasona'],
    ['Curso gratis: Farmacología Endocrina', '/curso-de-farmacologia-endocrina'],
  ],
  seo: {
    titulo: 'Corticoides sistémicos: equivalencias y vademécum',
    descripcion: 'Prednisona, prednisolona, dexametasona, betametasona e hidrocortisona: equivalencias, duración, retirada gradual, riesgos y atención farmacéutica.',
  },
};
