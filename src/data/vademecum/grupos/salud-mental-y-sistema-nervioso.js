import { F } from '../fuentes.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/**
 * Grupo terapéutico: salud mental y sistema nervioso. Datos verificados el
 * 16-nov-2026 en las fichas técnicas de CIMA, el índice ATC de la OMS y el
 * CUM del INVIMA. Las citas [n] apuntan a `referencias`.
 */
export default {
  tipo: 'grupo',
  slug: 'salud-mental-y-sistema-nervioso',
  nombre: 'Salud mental y sistema nervioso',
  titulo: 'Medicamentos para la salud mental y el sistema nervioso: antidepresivos, antipsicóticos, benzodiacepinas y gabapentinoides',
  actualizado: '2026-11-16',
  resumen: 'Ocho medicamentos que exigen el seguimiento más cuidadoso de la farmacia: dos ISRS (sertralina y fluoxetina), un tricíclico (amitriptilina), un antidepresivo sedante (trazodona), un antipsicótico atípico (quetiapina), una benzodiacepina (clonazepam) y dos gabapentinoides (pregabalina y gabapentina). Comparten tres riesgos que el farmacéutico puede prevenir: la suma de sedantes, el síndrome serotoninérgico y la suspensión brusca. Y comparten un reto humano: la adherencia a tratamientos que tardan semanas en mostrar su efecto.',
  datosClave: [
    ['Grupos ATC', 'N06A (antidepresivos), N05A (antipsicóticos), N03 (antiepilépticos) y N02BF (gabapentinoides)'],
    ['Con más registros vigentes en Colombia', 'Pregabalina (46), sertralina (33) y quetiapina (28) [9]'],
    ['Riesgo común', 'Sedación sumada con alcohol, opioides y otros depresores [3-8]'],
    ['Curso relacionado', 'Psicofarmacología, gratis en el aula de Edvanta'],
  ],
  secciones: [
    {
      id: 'mapa-del-grupo',
      titulo: 'Cómo se agrupan',
      bloques: [
        { mapa: {
          centro: 'Sistema nervioso',
          ramas: [
            { titulo: 'ISRS', icono: 'Brain', nodos: ['Sertralina [1]', 'Fluoxetina [2]'] },
            { titulo: 'Otros antidepresivos', icono: 'Moon', nodos: ['Amitriptilina [3]', 'Trazodona [4]'] },
            { titulo: 'Antipsicótico', icono: 'Shield', nodos: ['Quetiapina [5]'] },
            { titulo: 'Benzodiacepina', icono: 'Lock', nodos: ['Clonazepam [6]'] },
            { titulo: 'Gabapentinoides', icono: 'Zap', nodos: ['Pregabalina [7]', 'Gabapentina [8]'] },
          ],
        } },
      ],
    },
    {
      id: 'comparacion',
      titulo: 'Datos que cambian la decisión',
      bloques: [
        { tabla: {
          columnas: ['', 'Semivida', 'Dosis de referencia', 'Alerta principal'],
          filas: [
            ['Sertralina', '24 horas [1]', '50 a 200 mg al día [1]', 'Síndrome serotoninérgico y sangrado [1]'],
            ['Fluoxetina', '4 a 6 días; metabolito hasta 16 [2]', '20 a 60 mg al día [2]', 'Interacciones que duran semanas [2]'],
            ['Amitriptilina', 'Unas 25 horas [3]', '10 a 75 mg de noche en dolor [3]', 'QT y arritmias [3]'],
            ['Trazodona', '13 horas terminal [4]', '100 a 400 mg al día [4]', 'Sedación, QT, priapismo [4]'],
            ['Quetiapina', 'Unas 7 horas [5]', '300 a 800 mg según indicación [5]', 'Metabolismo; contraindicada con inhibidores del CYP3A4 [5]'],
            ['Clonazepam', '30 a 40 horas [6]', '3 a 6 mg al día en epilepsia [6]', 'Dependencia y abstinencia [6]'],
            ['Pregabalina', '6,3 horas [7]', '150 a 600 mg al día [7]', 'Abuso; ajuste renal [7]'],
            ['Gabapentina', '5 a 7 horas [8]', '900 a 3.600 mg al día [8]', 'Opioides; ajuste renal [8]'],
          ],
        } },
        { barras: {
          titulo: 'Registros sanitarios vigentes en Colombia por código ATC',
          datos: [
            { etiqueta: 'Pregabalina', valor: 46 },
            { etiqueta: 'Sertralina', valor: 33 },
            { etiqueta: 'Quetiapina', valor: 28 },
            { etiqueta: 'Fluoxetina', valor: 16 },
            { etiqueta: 'Trazodona', valor: 9 },
            { etiqueta: 'Clonazepam', valor: 8 },
            { etiqueta: 'Amitriptilina', valor: 7 },
            { etiqueta: 'Gabapentina', valor: 5 },
          ],
          nota: 'CUM del INVIMA, consulta del 16-nov-2026 [9]. Pregabalina y gabapentina figuran en el CUM como N03AX16 y N03AX12; la OMS las clasifica hoy en N02BF [10].',
        } },
        { cta: CURSOS.psico },
      ],
    },
    {
      id: 'semaforo',
      titulo: 'Semáforo de seguridad del grupo',
      bloques: [
        { alerta: { tono: 'alto', titulo: 'Sedantes que se suman', texto: 'Benzodiacepinas, gabapentinoides, trazodona, quetiapina y amitriptilina suman sedación con el alcohol y los opioides; con gabapentina y pregabalina se ha descrito depresión respiratoria grave [3-8].' } },
        { alerta: { tono: 'alto', titulo: 'Síndrome serotoninérgico', texto: 'ISRS, tricíclicos y quetiapina con otros serotoninérgicos, triptanes u opioides; los IMAO están contraindicados [1-3,5].' } },
        { alerta: { tono: 'medio', titulo: 'Corazón', texto: 'Amitriptilina y trazodona pueden prolongar el QT [3,4].' } },
        { alerta: { tono: 'medio', titulo: 'Riñón', texto: 'Pregabalina y gabapentina se eliminan inalteradas: la dosis depende del aclaramiento de creatinina [7,8].' } },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica en salud mental',
      destacado: true,
      bloques: [
        'En salud mental, el éxito depende de que el paciente siga el tratamiento durante semanas sin ver resultados inmediatos. El farmacéutico sostiene esa adherencia y vigila lo que el médico no ve entre consultas [11].',
        { ciclo: {
          titulo: 'Seguimiento en cuatro pasos',
          centro: 'Adherencia segura',
          pasos: [
            { titulo: 'Escuchar', icono: 'Users', texto: 'Cómo se siente y qué teme del tratamiento [12].' },
            { titulo: 'Revisar', icono: 'Search', texto: 'Sedantes, serotoninérgicos y alcohol [1-8].' },
            { titulo: 'Ajustar', icono: 'Scale', texto: 'Función renal en gabapentinoides [7,8].' },
            { titulo: 'Acompañar', icono: 'CalendarClock', texto: 'Nunca suspender de golpe; retirada con el médico [1,6,8].' },
          ],
        } },
        { cta: CURSOS.snc },
        { cta: GUIAS.entrevista },
      ],
    },
  ],
  referencias: [
    F.ftSertralina, F.ftFluoxetina, F.ftAmitriptilina, F.ftTrazodona, F.ftQuetiapina, F.ftClonazepam,
    F.ftPregabalina, F.ftGabapentina, F.invimaCum16, F.whoccAtc, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Sertralina: para qué sirve', '/articulos/sertralina-para-que-sirve'],
    ['Tramadol: farmacología', '/vademecum/tramadol'],
    ['Curso gratis: Psicofarmacología', '/curso-de-psicofarmacologia'],
  ],
  seo: {
    titulo: 'Psicofármacos: vademécum para farmacéuticos',
    descripcion: 'Sertralina, fluoxetina, amitriptilina, trazodona, quetiapina, clonazepam, pregabalina y gabapentina: dosis, riesgos y atención farmacéutica.',
  },
};
