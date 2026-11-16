import { F } from '../fuentes.js';

/**
 * Monografía: dicloxacilina. Verificada el 13-nov-2026 en la etiqueta de
 * DailyMed, la clasificación AWaRe y el CUM del INVIMA.
 */
export default {
  tipo: 'medicamento',
  slug: 'dicloxacilina',
  nombre: 'Dicloxacilina',
  titulo: 'Dicloxacilina: farmacología y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Penicilina resistente a la penicilinasa',
  atc: 'J01CF01',
  marcas: ['Dicloxacil', 'Dicloxacilina Sódica'],
  vias: ['Oral'],
  mecanismo: 'Se une a las proteínas fijadoras de penicilina e inhibe la síntesis de la pared bacteriana; su cadena lateral la protege de la penicilinasa estafilocócica.',
  actualizado: '2026-11-13',
  resumenCorto: 'penicilina resistente a penicilinasa para infecciones de piel y tejidos blandos por estafilococos sensibles.',
  resumen: 'La dicloxacilina es una penicilina resistente a la penicilinasa que se usa en infecciones de piel, tejidos blandos y hueso causadas por *Staphylococcus aureus* sensible a meticilina. Se absorbe por vía oral y debe tomarse con el estómago vacío. Su espectro es estrecho y no cubre gramnegativos ni anaerobios. La atención farmacéutica se centra en la adherencia, la toma correcta, la alergia a betalactámicos y la vigilancia de reacciones cutáneas.',
  datosClave: [
    ['Clase', 'Penicilina resistente a la penicilinasa [1,2]'],
    ['Código ATC', 'J01CF01 [1]'],
    ['Dosis habitual', '250 a 500 mg cada 6 horas en adultos; en niños, por peso [1,2]'],
    ['Absorción', 'Oral; disminuye con los alimentos [1,2]'],
    ['Semivida', 'Aproximadamente 0,7 horas [1]'],
    ['Colombia', 'Registros vigentes en el CUM; consultar presentación [3]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La dicloxacilina es una penicilina semisintética con un grupo diclorofenilo en la cadena lateral. Su fórmula es C19H17Cl2N3O5S y su peso molecular es 470,3 [1,2].',
        'La cadena lateral voluminosa impide que la penicilinasa estafilocócica hidrolice el anillo betalactámico, lo que le confiere su principal ventaja clínica [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Como todas las penicilinas, se une a las proteínas fijadoras de penicilina (PBP) e inhibe la transpeptidación del peptidoglucano. La bacteria se lisa por activación de autolisinas [1,2].',
        'Es bactericida y su efecto depende del tiempo que la concentración libre se mantiene por encima de la CMI. Su espectro se limita sobre todo a estafilococos y estreptococos sensibles [1,2].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral; se reduce con alimentos [1,2]'],
            ['Concentración máxima', 'Aproximadamente 0,5 a 1 hora [1]'],
            ['Unión a proteínas', 'Alta, principalmente albúmina [1]'],
            ['Metabolismo', 'Hepático parcial [1]'],
            ['Semivida', 'Aproximadamente 0,7 horas [1]'],
            ['Eliminación', 'Renal, principalmente por secreción tubular [1,2]'],
            ['Insuficiencia renal', 'Puede requerir ajuste en falla grave [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'La dicloxacilina está indicada en infecciones por estafilococos productores de penicilinasa sensibles [1,2]:',
        { lista: [
          'Infecciones de piel y tejidos blandos: celulitis, abscesos, forúnculos, impétigo y heridas infectadas.',
          'Infecciones óseas y articulares por estafilococos sensibles.',
          'Neumonía estafilocócica, en esquemas hospitalarios.',
          'Otras infecciones por grampositivos sensibles cuando el antibiograma lo respalda.',
        ] },
        'No cubre *Pseudomonas*, anaerobios ni la mayoría de gramnegativos.',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Población', 'Dosis orientativa'],
          filas: [
            ['Adultos', '250 a 500 mg cada 6 horas [1,2]'],
            ['Niños', '12,5 a 25 mg/kg/día repartidos cada 6 horas, según gravedad [1,2]'],
            ['Infecciones graves', 'Dosis alta del intervalo, según criterio médico [1]'],
          ],
        } },
        { lista: [
          'Tomar con el estómago vacío, al menos 1 hora antes o 2 horas después de comer [1].',
          'No suspender antes de completar el esquema indicado.',
          'En insuficiencia renal grave, ajustar según la ficha técnica [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones [1,2]:',
        { lista: [
          'Hipersensibilidad a dicloxacilina, penicilinas u otros betalactámicos.',
          'Antecedente de anafilaxia con penicilinas.',
        ] },
        'Advertencias: mayor riesgo de erupción en mononucleosis infecciosa; vigilar colitis por *C. difficile*, nefritis intersticial y alteraciones hematológicas; la absorción incompleta con alimentos puede causar fallo terapéutico [1,2].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Warfarina', 'Puede aumentar el INR', 'Controlar el INR [1]'],
            ['Metotrexato', 'Aumenta su toxicidad', 'Vigilar y ajustar [1]'],
            ['Probenecid', 'Aumenta la concentración de dicloxacilina', 'Considerar la interacción [1]'],
            ['Tetraciclinas y cloranfenicol', 'Posible antagonismo', 'Evitar combinaciones innecesarias [2]'],
            ['Antiácidos y alimentos', 'Reducen la absorción', 'Separar la toma [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las más frecuentes son náuseas, vómito, diarrea, dolor abdominal, flatulencia y erupción cutánea [1,2].',
        { lista: [
          'Frecuentes: molestias digestivas, rash, urticaria y candidiasis.',
          'Poco frecuentes: elevación de transaminasas, eosinofilia y anemia.',
          'Raras: anafilaxia, síndrome de Stevens-Johnson, necrólisis epidérmica tóxica, nefritis intersticial y colitis pseudomembranosa.',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: se considera compatible cuando está indicada; consultar siempre [1,2].',
          'Lactancia: pasa a la leche en pequeñas cantidades; vigilar diarrea o candidiasis en el bebé [1].',
          'Fertilidad: no se han descrito efectos adversos [2].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'La dicloxacilina ha sido un pilar del tratamiento de infecciones estafilocócicas de piel y tejidos blandos desde antes de la era de la resistencia a meticilina [1,2].',
        'Su eficacia depende de la sensibilidad del *S. aureus*: en cepas resistentes a meticilina (MRSA) no es activa y se requieren alternativas como clindamicina, trimetoprim-sulfametoxazol o vancomicina según la gravedad [1,2].',
        'La toma con el estómago vacío es determinante: los alimentos reducen la absorción y pueden explicar fallos terapéuticos en infecciones cutáneas [1].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra dicloxacilina en cápsulas y suspensiones; verificar registro y concentración [3].',
          'Estados Unidos: la FDA mantiene etiquetas vigentes de dicloxacilina sódica [1].',
          'Es un medicamento de prescripción médica.',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'La dicloxacilina exige revisar la indicación, la sensibilidad del estafilococo, la toma con el estómago vacío y la alergia a betalactámicos [4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Infección de piel, tejidos blandos u osteoarticular por estafilococo sensible [1,2]'],
            ['Efectividad', 'Mejoría de la lesión, fiebre y adherencia [1]'],
            ['Seguridad', 'Alergia, función renal, reacciones cutáneas y diarrea [1,2]'],
            ['Adherencia', 'Toma cada 6 horas con estómago vacío [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Dosis demasiado baja', 'Toma con alimentos o dosis insuficiente', 'Corregir la administración y revisar la dosis [1]'],
            ['Reacción adversa', 'Rash, diarrea o candidiasis', 'Evaluar y remitir si es grave [1,2]'],
            ['Interacción', 'Uso concomitante de antiácidos o warfarina', 'Separar tomas y controlar INR [1]'],
            ['Incumplimiento', 'Abandono al mejorar la lesión', 'Explicar la duración y el riesgo de recaída [4]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Confirmar sensibilidad y ausencia de MRSA [1,2].',
          'Educar sobre la toma con estómago vacío y cada 6 horas [1].',
          'Revisar alergias y función renal [1].',
          'Registrar el estado de cada problema según el modelo [4].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La dicloxacilina se asocia a un régimen incómodo de cuatro tomas diarias y a la creencia de que “con comida no pasa nada”. Esa combinación explica muchos fracasos y recaídas [4,5].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'Cómo organiza las cuatro tomas del día [1].',
          'Si la toma con alimentos o leche [1].',
          'Si ha tenido erupción, diarrea o candidiasis [1,2].',
          'Si es alérgico a la penicilina y qué tipo de reacción tuvo [1].',
          'Si suspendió el tratamiento al ver mejoría [4].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿A qué horas toma cada dosis y con qué la acompaña?',
          '¿Ha notado salpullido, diarrea o molestias digestivas?',
          '¿Qué sabe de su alergia a la penicilina?',
          '¿Completó el tratamiento anterior?',
        ] },
      ],
    },
  ],
  referencias: [F.dmDicloxacilina, F.whoAware2023, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Dicloxacilina: para qué sirve', '/articulos/dicloxacilina-para-que-sirve'],
    ['Penicilinas: tipos y usos', '/articulos/penicilinas-tipos-y-usos'],
    ['Betalactámicos: clasificación', '/articulos/betalactamicos-clasificacion'],
  ],
  seo: {
    titulo: 'Dicloxacilina: farmacología y atención farmacéutica',
    descripcion: 'Dicloxacilina: mecanismo, farmacocinética, dosis, absorción con alimentos, alergia a penicilina y atención farmacéutica en infecciones de piel.',
  },
};
