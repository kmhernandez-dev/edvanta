export const CURSO = 'Curso de Farmacoterapia del Asma y la EPOC';
export const MIGRACION = '141_experiencias_farmacoterapia_asma_epoc_5.sql';

export const CLASES = [
  {
    titulo: 'Caso integrador: paciente con rasgos de asma y EPOC, sin corticoide inhalado y con reacción adversa',
    duracion: 30,
    gancho: {
      titulo: 'El caso que une todo el curso',
      texto: 'Jorge tiene 58 años, asma desde niño, 25 paquetes-año de tabaquismo y cinco inhaladores de salbutamol al año. Nunca ha recibido corticoide inhalado y tiene pesadillas desde que empezó montelukast. El caso integra diagnóstico, tratamiento, seguridad y educación.',
    },
    objetivos: [
      'Integrar diagnóstico de asma y EPOC.',
      'Aplicar el tratamiento escalonado.',
      'Detectar y reportar reacciones adversas.',
      'Diseñar educación y seguimiento.',
    ],
    conceptos: [
      { icono: 'Network', termino: 'Superposición', definicion: 'Rasgos de asma y EPOC en el mismo paciente.' },
      { icono: 'ShieldCheck', termino: 'ICS', definicion: 'Obligatorio cuando hay rasgos de asma.' },
      { icono: 'AlertTriangle', termino: 'Reacción adversa', definicion: 'Pesadillas por montelukast.' },
      { icono: 'Flame', termino: 'Tabaquismo', definicion: 'Factor modificable central.' },
    ],
    mapa: {
      centro: 'Jorge',
      ramas: [
        { titulo: 'Diagnóstico', icono: 'LineChart', nodos: ['Asma', 'EPOC', 'Superposición'] },
        { titulo: 'Tratamiento', icono: 'Pill', nodos: ['ICS', 'LABA', 'Rescate'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Montelukast', 'INVIMA', 'Reporte'] },
        { titulo: 'Educación', icono: 'Users', nodos: ['Técnica', 'Vacunas', 'Cesación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Evaluación',
        parrafos: [
          'Jorge tiene asma desde la infancia, fumó 25 paquetes-año y presenta obstrucción persistente con reversibilidad de 14 % y 260 mL; FEV1/FVC de 0,64 y FEV1 de 55 %. Los eosinófilos son 380 células/µL. El cuadro combina rasgos de asma y de EPOC, lo que se conoce como superposición.',
          'Su tratamiento actual es montelukast 10 mg por la noche, salbutamol a necesidad con cinco inhaladores al año y nebulizaciones caseras. Tuvo una hospitalización y un ciclo de corticoide oral en el último año. CAT 22 y ACT 13 indican mal control. Refiere pesadillas desde que inició montelukast y no tiene vacuna de influenza.',
        ],
      },
      {
        titulo: 'Análisis e intervención',
        parrafos: [
          'La ausencia de corticoide inhalado es inadecuada porque hay rasgos claros de asma. El sobreuso de salbutamol y las exacerbaciones confirman el mal control. El montelukast puede explicar las pesadillas, una reacción neuropsiquiátrica descrita en la alerta del INVIMA. El tabaquismo, la técnica, la adherencia y la vacunación son factores modificables.',
          'El QF remite al neumólogo con un resumen estructurado: rasgos de superposición, dos exacerbaciones, eosinófilos de 380 y ausencia de ICS. Sugiere un esquema con ICS, por ejemplo ICS-LABA o triple terapia según el especialista. Reporta las pesadillas al Programa Nacional de Farmacovigilancia y recomienda que el médico valore suspender el montelukast.',
        ],
      },
      {
        titulo: 'Educación y seguimiento',
        parrafos: [
          'Se entrena la técnica del nuevo dispositivo y se evalúa el flujo inspiratorio. Se inicia una intervención breve para dejar de fumar y se remite al programa de cesación. Se gestiona la vacuna de influenza y se orienta sobre neumococo y VSR. Se entrega un plan de acción escrito con signos de alarma.',
          'Se agenda control en cuatro semanas con CAT, ACT, uso de rescate, técnica y adherencia. Se revisan los eosinófilos y la respuesta al nuevo esquema. El caso muestra que la seguridad, la educación y el tratamiento deben avanzar juntos: corregir un fármaco sin educación no cambia el pronóstico.',
        ],
      },
    ],
    proceso: {
      titulo: 'Abordaje integrador',
      pasos: [
        { titulo: 'Integrar', detalle: 'Rasgos de asma y EPOC.', icono: 'Network', evidencia: 'Diagnóstico.' },
        { titulo: 'Revisar', detalle: 'Fármacos y control.', icono: 'ClipboardList', evidencia: 'Lista.' },
        { titulo: 'Intervenir', detalle: 'ICS, técnica y cesación.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Reportar', detalle: 'Reacción al INVIMA.', icono: 'FileCheck', evidencia: 'Reporte.' },
        { titulo: 'Seguir', detalle: 'CAT, ACT y rescate.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Jorge en Barranquilla',
      contexto: 'Hombre de 58 años con asma desde niño, 25 paquetes-año, FEV1 55 %, eosinófilos 380, sin ICS, con montelukast y pesadillas.',
      pregunta: '¿Cuál es la prioridad?',
      opciones: [
        { texto: 'Aumentar el salbutamol.', correcta: false, retro: 'No controla la inflamación.' },
        { texto: 'Remitir para ICS, reportar la reacción y educar.', correcta: true, retro: 'Aborda tratamiento, seguridad y factores modificables.' },
        { texto: 'Mantener montelukast y nada más.', correcta: false, retro: 'Hay una reacción adversa y falta ICS.' },
      ],
    },
    errores: [
      { error: 'No indicar ICS si hay asma.', correccion: 'Es obligatorio en el asma.' },
      { error: 'No reportar la reacción adversa.', correccion: 'La farmacovigilancia es parte del plan.' },
      { error: 'No abordar el tabaquismo.', correccion: 'Es el factor modificable más importante.' },
    ],
    comprueba: [
      { pregunta: '¿Qué rasgos de asma tiene Jorge?', respuesta: 'Inicio en la infancia, reversibilidad y eosinófilos altos.' },
      { pregunta: '¿Qué fármaco falta?', respuesta: 'El corticoide inhalado.' },
      { pregunta: '¿Qué se reporta al INVIMA?', respuesta: 'Las pesadillas por montelukast.' },
    ],
    resumen: [
      'La superposición asma-EPOC exige ICS.',
      'El sobreuso de SABA revela mal control.',
      'La reacción adversa se documenta y reporta.',
      'La educación y el seguimiento cierran el caso.',
    ],
    referencias: [
      { cita: 'Global Initiative for Asthma. GINA 2026 Summary Guide. GINA; 2026.', url: 'https://ginasthma.org/2026-gina-strategy-report/' },
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
      { cita: 'INVIMA. Informe de seguridad No. 349-2024: riesgo de reacciones neuropsiquiátricas asociadas al tratamiento con montelukast. Bogotá; 2024.', url: 'https://www.invima.gov.co/alertas-sanitarias/riesgo-de-reacciones-neuropsiquiatricas-asociadas-al-tratamiento-con-montelukast' },
    ],
    imagenes: [
      { ubicacion: 'Caso integrador', descripcion: 'Ficha de Jorge con espirometría, medicación y plan.', alt: 'Caso integrador de asma y EPOC' },
    ],
    keywords: ['caso integrador asma EPOC', 'superposición asma EPOC', 'montelukast reacción adversa', 'ICS asma'],
  },
];
