/**
 * ============================================================
 *  lib/cv/ejemplo.js — Hoja de vida de ejemplo
 *
 *  Se usa para dos cosas:
 *   · las muestras de las plantillas en la landing;
 *   · el botón «Ver un ejemplo» del creador, que rellena los
 *     campos para entender qué escribir en cada uno.
 *
 *  Es una persona ficticia. No se usa como dato real en ningún
 *  lado ni se guarda en la cuenta sin que la persona lo edite.
 * ============================================================
 */

export const CV_EJEMPLO = {
  nombre: 'Camila Rodríguez Peña',
  titulo: 'Química farmacéutica — Control de calidad',
  email: 'camila.rodriguez@correo.com',
  telefono: '+57 300 123 4567',
  ciudad: 'Barranquilla',
  linkedin: 'linkedin.com/in/camila-rodriguez',
  foto: '',
  resumen: 'Química farmacéutica con 5 años de experiencia en control de calidad de materias primas y producto terminado bajo BPM. Manejo de HPLC, validación de métodos analíticos y cierre de desviaciones con CAPA, con enfoque en integridad de datos y cero hallazgos críticos en auditorías.',
  experiencia: [
    {
      cargo: 'Analista de control de calidad',
      empresa: 'Laboratorios del Caribe S.A.S.',
      inicio: 'Feb 2022',
      fin: '',
      logros: 'Reduje 25 % el tiempo de liberación de lotes con un plan de muestreo por riesgo.\nLideré la validación de 4 métodos analíticos por HPLC sin desviaciones.\nCerré 18 desviaciones en menos de 30 días cada una, sin recurrencia.',
    },
    {
      cargo: 'Auxiliar de calidad',
      empresa: 'Droguerías La Salud',
      inicio: 'Mar 2019',
      fin: 'Ene 2022',
      logros: 'Implementé el control de temperatura de 3 bodegas y eliminé las pérdidas por cadena de frío.\nApoyé 6 auditorías internas de BPM sin hallazgos críticos.',
    },
  ],
  educacion: [
    { titulo: 'Química Farmacéutica', institucion: 'Universidad del Atlántico', anio: '2018' },
    { titulo: 'Especialización en Gerencia de la Calidad', institucion: 'Universidad del Norte', anio: '2021' },
  ],
  habilidades: ['BPM', 'HPLC', 'Validación de métodos', 'CAPA', 'Integridad de datos', 'Excel avanzado', 'Power BI'],
  certificaciones: [
    { nombre: 'Buenas Prácticas de Manufactura', institucion: 'INVIMA', anio: '2024' },
    { nombre: 'Auditor interno ISO 9001', institucion: 'Icontec', anio: '2023' },
  ],
  idiomas: [
    { idioma: 'Español', nivel: 'Nativo' },
    { idioma: 'Inglés', nivel: 'B2' },
  ],
  referencias: [],
};

/** Copia limpia del ejemplo (sin compartir referencias entre objetos). */
export const ejemploCv = () => JSON.parse(JSON.stringify(CV_EJEMPLO));
