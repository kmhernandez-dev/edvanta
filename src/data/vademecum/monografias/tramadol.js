import { F } from '../fuentes.js';

/**
 * Monografía: tramadol. Verificada el 16-nov-2026 en la ficha técnica de
 * CIMA (Tramadol Normon 50 mg cápsulas) y el CUM del INVIMA (61 registros
 * vigentes que contienen tramadol).
 */
export default {
  tipo: 'medicamento',
  slug: 'tramadol',
  nombre: 'Tramadol',
  titulo: 'Tramadol: farmacología y atención farmacéutica',
  grupo: 'medicamentos-para-el-dolor-y-la-inflamacion',
  clase: 'Analgésico opioide de acción central',
  atc: 'N02AX02',
  marcas: ['Tramal', 'Tramadol'],
  vias: ['Oral', 'Inyectable'],
  mecanismo: 'Agonista opioide puro no selectivo sobre los receptores μ, δ y κ, con mayor afinidad por μ; su metabolito O-desmetiltramadol contribuye al efecto.',
  actualizado: '2026-11-16',
  resumenCorto: 'opioide para dolor moderado a intenso; máximo 400 mg al día, riesgo de dependencia, convulsiones, síndrome serotoninérgico y sedación con benzodiacepinas.',
  resumen: 'El tramadol es un analgésico opioide de acción central indicado en el dolor moderado a intenso en adultos y mayores de 12 años. Su efecto depende en parte del metabolito O-desmetiltramadol, formado por el CYP2D6, por lo que la respuesta y la toxicidad varían entre personas. Sus riesgos principales son la tolerancia y la dependencia, la depresión respiratoria con otros depresores, las convulsiones y el síndrome serotoninérgico. La atención farmacéutica se centra en la combinación con otros fármacos del sistema nervioso central, la duración y el plan de suspensión.',
  datosClave: [
    ['Clase', 'Analgésico opioide de acción central [1]'],
    ['Código ATC', 'N02AX02 [2]'],
    ['Dosis habitual', '50 a 100 mg cada 4 a 6 horas; máximo 400 mg al día [1]'],
    ['Metabolismo', 'Hepático por CYP3A4 y CYP2D6; metabolito activo O-desmetiltramadol [1]'],
    ['Semivida', 'Unas 6 horas [1]'],
    ['Colombia', '61 registros sanitarios vigentes que contienen tramadol en el CUM [2]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'Se usa como hidrocloruro de tramadol; cada cápsula de referencia contiene 50 mg [1].',
        'Su unión a proteínas plasmáticas es baja, de alrededor del 20 % [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Es un analgésico de acción central y un agonista opioide puro, no selectivo, sobre los receptores μ, δ y κ, con mayor afinidad por los μ [1].',
        'El metabolito O-desmetiltramadol, formado por el CYP2D6, participa en el efecto. En los metabolizadores ultrarrápidos del CYP2D6 hay riesgo de toxicidad opioide incluso a dosis habituales [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Biodisponibilidad oral', '70 % a 90 % con 50 a 100 mg; más del 90 % con dosis repetidas [1]'],
            ['Concentración máxima', 'Unas 2 horas tras 100 mg orales [1]'],
            ['Unión a proteínas', 'Alrededor del 20 % [1]'],
            ['Metabolismo', 'O-desmetilación (CYP3A4 y CYP2D6), N-desmetilación y glucuronidación [1]'],
            ['Semivida', 'Unas 6 horas [1]'],
            ['Eliminación', 'Casi completa por vía renal (90 %) [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Tratamiento del dolor moderado a intenso en adultos y adolescentes a partir de 12 años [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Situación', 'Dosis'],
          filas: [
            ['Adultos y mayores de 12 años', '50 a 100 mg al inicio, luego 50 o 100 mg cada 4 a 6 horas [1]'],
            ['Dosis máxima', '400 mg al día, salvo circunstancias clínicas especiales [1]'],
            ['Mayores de 75 años', 'Alargar los intervalos si es necesario: la eliminación se prolonga [1]'],
            ['Insuficiencia renal o hepática', 'Considerar intervalos más largos [1]'],
          ],
        } },
        { lista: [
          'No usar las cápsulas de referencia en menores de 12 años [1].',
          'En tratamientos prolongados, planear la suspensión gradual para evitar la abstinencia [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Está contraindicado en [1]:',
        { lista: [
          'Intoxicación aguda por alcohol, hipnóticos, analgésicos, opioides u otros psicótropos.',
          'Tratamiento con inhibidores de la MAO o en los 14 días siguientes.',
          'Epilepsia no controlada.',
          'Tratamiento del síndrome de abstinencia a opiáceos.',
        ] },
        'Advertencias: tolerancia, dependencia física y psicológica y trastorno por consumo de opioides; depresión respiratoria con dosis altas o con depresores centrales; convulsiones con dosis altas o fármacos que bajan el umbral convulsivo; síndrome serotoninérgico, incluso en monoterapia; toxicidad en metabolizadores ultrarrápidos del CYP2D6; y sedación, coma o muerte con benzodiacepinas [1].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Inhibidores de la MAO', 'Interacciones con riesgo vital', 'Contraindicado [1]'],
            ['Benzodiacepinas, gabapentina, pregabalina, alcohol', 'Sedación, depresión respiratoria, coma o muerte', 'Evitar; si es inevitable, dosis mínimas y vigilancia [1]'],
            ['ISRS, IRSN, tricíclicos, mirtazapina', 'Síndrome serotoninérgico y convulsiones', 'Vigilar agitación, temblor, fiebre [1]'],
            ['Antipsicóticos y fármacos que bajan el umbral convulsivo', 'Más convulsiones', 'Evitar en epilepsia [1]'],
            ['Warfarina', 'INR más alto con hemorragias', 'Controlar el INR [1]'],
            ['Carbamazepina', 'Menos efecto y duración', 'Considerar otra opción [1]'],
            ['Inhibidores del CYP2D6 y CYP3A4 (fluoxetina, paroxetina, ketoconazol)', 'Alteran el metabolismo del tramadol', 'Vigilar eficacia y toxicidad [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Frecuentes: náuseas, mareo, cefalea, somnolencia, estreñimiento, sequedad de boca, vómito, sudoración y fatiga [1].',
        { lista: [
          'Graves: depresión respiratoria, convulsiones, síndrome serotoninérgico, anafilaxia, colapso cardiovascular, alucinaciones, confusión y delirio [1].',
          'Con el uso prolongado: tolerancia, dependencia y abstinencia al suspender [1].',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: atraviesa la placenta; no hay datos suficientes y no debe usarse. El uso crónico puede causar abstinencia neonatal [1].',
          'Lactancia: pasa cerca del 0,1 % de la dosis materna; no usar o suspender la lactancia durante el tratamiento (no suele ser necesario tras una dosis única) [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El tramadol ocupa un lugar intermedio entre los analgésicos no opioides y los opioides potentes. Su eficacia depende en parte del CYP2D6, lo que explica por qué unos pacientes no responden y otros presentan toxicidad con la misma dosis [1].',
        'Las advertencias actuales de la ficha técnica sobre dependencia, uso con benzodiacepinas y gabapentinoides, y síndrome serotoninérgico obligan a revisar toda la medicación del sistema nervioso central antes de iniciarlo [1].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM del INVIMA registra 61 registros sanitarios vigentes que contienen tramadol, en solución oral, solución inyectable, cápsulas y tabletas, incluidas las de liberación prolongada. Consulta del 16-nov-2026 [2].',
          'Unión Europea: autorizado para el dolor moderado a intenso en adultos y mayores de 12 años [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'El tramadol se percibe como un «opioide suave». En la práctica, los problemas graves vienen de su combinación con antidepresivos, benzodiacepinas, pregabalina o alcohol [1,3].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Dolor moderado a intenso que no cede con analgésicos no opioides [1]'],
            ['Efectividad', 'Dolor y función; respuesta variable por el CYP2D6 [1]'],
            ['Seguridad', 'Epilepsia, antidepresivos, benzodiacepinas, gabapentinoides, alcohol, edad [1]'],
            ['Adherencia', 'Dosis máxima de 400 mg; plan de suspensión si se usa más de unos días [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría', 'Situación típica', 'Intervención'],
          filas: [
            ['Interacción', 'Tramadol con sertralina y aparición de temblor y agitación', 'Remitir de inmediato [1]'],
            ['Interacción', 'Tramadol con clonazepam o pregabalina en un adulto mayor', 'Comunicar al prescriptor [1]'],
            ['Reacción adversa', 'Náuseas y estreñimiento al inicio', 'Educar y prevenir [1]'],
            ['Seguridad', 'Uso de semanas con aumento de dosis por cuenta propia', 'Valorar tolerancia y dependencia [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Revisar toda la medicación del sistema nervioso central antes de dispensar [1].',
          'Advertir sobre el alcohol y la conducción [1].',
          'Registrar el estado de cada problema según el modelo [3].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'Algunos pacientes temen al tramadol por ser un opioide y lo toman menos de lo indicado; otros encuentran en él alivio y calma, y lo prolongan. Ambas experiencias cambian el plan de cuidado [4].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'Qué le preocupa de tomar un opioide [4].',
          'Si toma antidepresivos, pastillas para dormir o pregabalina [1].',
          'Si ha necesitado subir la dosis para obtener el mismo alivio [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Cuántas tomas hace al día y desde cuándo?',
          '¿Ha sentido mucho sueño, confusión o temblor?',
          '¿Toma alcohol mientras usa el tramadol?',
        ] },
      ],
    },
  ],
  referencias: [F.ftTramadol, F.invimaCum16, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Tramadol: para qué sirve', '/articulos/tramadol-para-que-sirve'],
    ['Sertralina: para qué sirve', '/articulos/sertralina-para-que-sirve'],
    ['Medicamentos para el dolor y la inflamación', '/vademecum/medicamentos-para-el-dolor-y-la-inflamacion'],
    ['Curso gratis: Farmacología del Sistema Nervioso Central', '/curso-de-farmacologia-del-sistema-nervioso-central'],
  ],
  seo: {
    titulo: 'Tramadol: farmacología y atención farmacéutica',
    descripcion: 'Tramadol: mecanismo opioide, CYP2D6, dosis máxima de 400 mg, dependencia, síndrome serotoninérgico, interacciones y atención farmacéutica.',
  },
};
