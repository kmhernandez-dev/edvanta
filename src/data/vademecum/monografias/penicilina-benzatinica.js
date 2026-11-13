import { F } from '../fuentes.js';

/**
 * Monografía: penicilina benzatínica. Verificada el 13-nov-2026 en la
 * etiqueta de Bicillin L-A (DailyMed), AWaRe y el CUM del INVIMA.
 */
export default {
  tipo: 'medicamento',
  slug: 'penicilina-benzatinica',
  nombre: 'Penicilina benzatínica',
  titulo: 'Penicilina benzatínica: farmacología y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Penicilina natural de depósito',
  atc: 'J01CE08',
  marcas: ['Bicillin L-A', 'Penicilina G benzatínica'],
  vias: ['Intramuscular'],
  mecanismo: 'Libera penicilina G de forma lenta desde el músculo e inhibe la síntesis de la pared bacteriana; es bactericida frente a espiroquetas y estreptococos sensibles.',
  actualizado: '2026-11-13',
  resumenCorto: 'penicilina de depósito para sífilis y profilaxis de fiebre reumática; solo por vía intramuscular.',
  resumen: 'La penicilina benzatínica es una sal de depósito de penicilina G que se administra por vía intramuscular. Mantiene concentraciones durante días o semanas y es el tratamiento de elección para la sífilis y la profilaxis de la fiebre reumática. Sus riesgos principales son la anafilaxia, la reacción de Jarisch-Herxheimer y las reacciones locales. La atención farmacéutica incluye verificar la alergia, la vía, la dosis, la adherencia a la profilaxis y la educación sobre la sífilis y sus parejas.',
  datosClave: [
    ['Clase', 'Penicilina natural de depósito [1,2]'],
    ['Código ATC', 'J01CE08 [1]'],
    ['Dosis habitual', '2,4 millones de unidades IM en sífilis temprana; 1,2 millones cada 3 a 4 semanas en profilaxis reumática [1,2]'],
    ['Vía', 'Intramuscular profunda; nunca intravenosa [1]'],
    ['Semivida', 'La sal de depósito mantiene niveles durante días o semanas [1]'],
    ['Colombia', 'Registros vigentes en el CUM; verificar presentación [3]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La penicilina benzatínica es una sal de penicilina G con una molécula de bencilamina que forma un complejo de baja solubilidad. Su fórmula es C48H56N6O8S2 y su peso molecular es 909,1 [1,2].',
        'La baja solubilidad es la responsable de su liberación lenta y de su efecto prolongado después de la inyección intramuscular [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La penicilina G se une a las proteínas fijadoras de penicilina e inhibe la transpeptidación del peptidoglucano. La bacteria se lisa y muere; el efecto es bactericida y depende del tiempo por encima de la CMI [1,2].',
        'Es activa frente a *Treponema pallidum*, *Streptococcus pyogenes* y otros estreptococos sensibles. No cubre estafilococos productores de penicilinasa ni gramnegativos [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Intramuscular; liberación lenta desde el depósito [1]'],
            ['Concentración máxima', 'A las 12 a 24 horas de la inyección [1]'],
            ['Unión a proteínas', 'Alta [1]'],
            ['Metabolismo', 'Hepático parcial [1]'],
            ['Semivida', 'La sal de depósito mantiene niveles detectables durante 2 a 4 semanas [1]'],
            ['Eliminación', 'Renal [1]'],
            ['Insuficiencia renal', 'Puede requerir ajuste o vigilancia [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'La penicilina benzatínica está indicada en [1,2]:',
        { lista: [
          'Sífilis primaria, secundaria y latente temprana.',
          'Sífilis latente tardía o de duración desconocida.',
          'Sífilis congénita, en esquemas específicos.',
          'Profilaxis de fiebre reumática recurrente.',
          'Algunas infecciones estreptocócicas que requieren penicilina de depósito.',
        ] },
        'No se usa para neurosífilis ni para infecciones graves que requieren penicilina intravenosa en dosis altas.',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Indicación', 'Esquema orientativo en adultos'],
          filas: [
            ['Sífilis primaria, secundaria o latente temprana', '2,4 millones de unidades IM en dosis única [1,2]'],
            ['Sífilis latente tardía o desconocida', '2,4 millones de unidades IM una vez por semana durante 3 semanas [1,2]'],
            ['Profilaxis de fiebre reumática', '1,2 millones de unidades IM cada 3 a 4 semanas [1,2]'],
            ['Sífilis congénita', 'Según peso y protocolo hospitalario [1]'],
          ],
        } },
        { lista: [
          'Inyección intramuscular profunda en el glúteo; nunca por vía intravenosa [1].',
          'No se debe mezclar con otros medicamentos en la misma jeringa [1].',
          'Verificar alergia a penicilina antes de la administración [1,2].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones [1,2]:',
        { lista: [
          'Hipersensibilidad a penicilina o a otros betalactámicos.',
          'Antecedente de anafilaxia con penicilina.',
        ] },
        'Advertencias: anafilaxia, reacción de Jarisch-Herxheimer, reacción de Hoigné por inyección intravascular accidental, neurotoxicidad con dosis altas o insuficiencia renal, y dolor local intenso [1,2].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Warfarina', 'Puede alterar el INR', 'Controlar el INR [2]'],
            ['Metotrexato', 'Aumenta su toxicidad', 'Vigilar y ajustar [2]'],
            ['Probenecid', 'Aumenta y prolonga la penicilina', 'Considerar la interacción [2]'],
            ['Tetraciclinas y cloranfenicol', 'Posible antagonismo', 'Evitar combinaciones innecesarias [2]'],
            ['Aminoglucósidos', 'No mezclar en la misma jeringa', 'Administrar por separado [2]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las más frecuentes son dolor, inflamación y endurecimiento en el sitio de la inyección [1,2].',
        { lista: [
          'Frecuentes: dolor local, fiebre, malestar y cefalea.',
          'Poco frecuentes: urticaria, rash y reacción de Jarisch-Herxheimer.',
          'Raras: anafilaxia, reacción de Hoigné, convulsiones, neuropatía y reacciones cutáneas graves.',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: es el tratamiento de elección para la sífilis y previene la sífilis congénita [1,2].',
          'Lactancia: pasa en pequeñas cantidades y se considera compatible; vigilar diarrea o candidiasis en el bebé [1].',
          'Fertilidad: no se han descrito efectos adversos [2].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'La penicilina benzatínica sigue siendo el estándar para la sífilis porque mantiene concentraciones treponemicidas durante el tiempo necesario y previene la transmisión maternoinfantil [1,2].',
        'En la profilaxis de la fiebre reumática, las inyecciones cada 3 a 4 semanas reducen las recurrencias y la progresión de la valvulopatía [1].',
        'La adherencia a la profilaxis es un determinante mayor de la eficacia; la atención farmacéutica puede mejorar el cumplimiento y la continuidad [1,2].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra penicilina benzatínica en polvo para suspensión inyectable [3].',
          'Estados Unidos: la FDA mantiene la etiqueta de Bicillin L-A [1].',
          'Es un medicamento de uso institucional y requiere personal entrenado [1,2].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'La penicilina benzatínica plantea retos de adherencia, miedo a la inyección y manejo de parejas sexuales; la revisión debe integrar esos aspectos [4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Sífilis o profilaxis de fiebre reumática [1,2]'],
            ['Efectividad', 'Cumplimiento del esquema y seguimiento serológico [1]'],
            ['Seguridad', 'Alergia, reacciones previas, función renal y acceso a atención [1,2]'],
            ['Adherencia', 'Fechas de la profilaxis y tolerancia a la inyección [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Dosis demasiado baja', 'Esquema incompleto en sífilis latente tardía', 'Completar las tres dosis semanales [1]'],
            ['Reacción adversa', 'Dolor local, fiebre o Jarisch-Herxheimer', 'Explicar y tratar sintomáticamente [1,2]'],
            ['Incumplimiento', 'Olvido de la profilaxis reumática', 'Recordatorios y seguimiento [1]'],
            ['Farmacoterapia innecesaria', 'Uso en neurosífilis sin penicilina IV', 'Cambiar al esquema correcto [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Confirmar la alergia y la vía de administración [1].',
          'Explicar la reacción de Jarisch-Herxheimer y los signos de anafilaxia [1,2].',
          'Coordinar el tratamiento de las parejas sexuales [1].',
          'Registrar el estado de cada problema según el modelo [4].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La penicilina benzatínica se recuerda por el dolor de la inyección y por el estigma de la sífilis. Esas dos percepciones pueden retrasar el tratamiento o hacer que se abandone la profilaxis [4,5].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'Qué sabe de la sífilis y de la importancia de tratar a la pareja [1].',
          'Si ha tenido reacciones alérgicas a la penicilina [1].',
          'Cómo tolera las inyecciones intramusculares [1].',
          'Si cumple las fechas de la profilaxis reumática [1].',
          'Qué barreras de acceso o costo enfrenta [4].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Sabe por qué necesita esta inyección y cuántas dosis?',
          '¿Su pareja también fue evaluada?',
          '¿Ha tenido fiebre o dolor después de una inyección previa?',
          '¿Qué le impide cumplir la profilaxis cada mes?',
        ] },
      ],
    },
  ],
  referencias: [F.dmPenicilinaBenzatinica, F.whoAware2023, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Penicilina benzatínica: para qué sirve', '/articulos/penicilina-benzatinica-para-que-sirve'],
    ['Penicilinas: tipos y usos', '/articulos/penicilinas-tipos-y-usos'],
    ['Betalactámicos: clasificación', '/articulos/betalactamicos-clasificacion'],
  ],
  seo: {
    titulo: 'Penicilina benzatínica: farmacología y atención farmacéutica',
    descripcion: 'Penicilina benzatínica: mecanismo, dosis en sífilis, profilaxis reumática, Jarisch-Herxheimer, anafilaxia y atención farmacéutica.',
  },
};
