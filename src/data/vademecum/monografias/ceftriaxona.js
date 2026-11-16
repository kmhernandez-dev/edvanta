import { F } from '../fuentes.js';

/**
 * Monografía: ceftriaxona. Verificada el 13-nov-2026 en la ficha técnica
 * de CIMA, la clasificación AWaRe y el CUM del INVIMA.
 */
export default {
  tipo: 'medicamento',
  slug: 'ceftriaxona',
  nombre: 'Ceftriaxona',
  titulo: 'Ceftriaxona: farmacología y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Cefalosporina de tercera generación',
  atc: 'J01DD04',
  marcas: ['Rocephin', 'Ceftriaxona'],
  vias: ['Intravenosa', 'Intramuscular'],
  mecanismo: 'Inhibe la síntesis de la pared bacteriana tras unirse a las proteínas fijadoras de penicilina; es bactericida y de amplio espectro.',
  actualizado: '2026-11-13',
  resumenCorto: 'cefalosporina de tercera generación de una dosis diaria, con buena penetración en LCR y amplio uso hospitalario.',
  resumen: 'La ceftriaxona es una cefalosporina de tercera generación que se administra por vía intravenosa o intramuscular. Se usa en meningitis, neumonía, pielonefritis, infecciones intraabdominales, gonorrea y sífilis. Su vida media prolongada permite una dosis diaria en muchas indicaciones. Las precauciones principales son la alergia a betalactámicos, la precipitación con calcio en neonatos, la litiasis biliar y la anemia hemolítica. La atención farmacéutica incluye la reconstitución, la estabilidad, la compatibilidad y la vigilancia clínica.',
  datosClave: [
    ['Clase', 'Cefalosporina de tercera generación [1,2]'],
    ['Código ATC', 'J01DD04 [1]'],
    ['Dosis habitual', '1 a 2 g al día; 2 a 4 g al día en meningitis o infecciones graves [1]'],
    ['Metabolismo', 'No requiere metabolismo hepático relevante; eliminación renal y biliar [1]'],
    ['Semivida', 'Aproximadamente 6 a 9 horas [1]'],
    ['Colombia', 'Registros vigentes en el CUM; consultar presentación [3]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La ceftriaxona es una cefalosporina semisintética de tercera generación. Su fórmula es C18H18N8O7S3 y su peso molecular es 554,58; se usa como sal sódica [1,2].',
        'La cadena lateral aminotiazólica y el grupo metoxiimino le confieren estabilidad frente a muchas betalactamasas y buena actividad frente a gramnegativos [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Se une a las proteínas fijadoras de penicilina e inhibe la transpeptidación del peptidoglucano. La bacteria se lisa y muere; el efecto es bactericida y depende del tiempo por encima de la CMI (T > CMI) [1,2].',
        'Su espectro incluye *Streptococcus pneumoniae*, *Haemophilus influenzae*, *Neisseria*, enterobacterias y *Treponema pallidum*. No cubre *Pseudomonas*, enterococos, *Listeria* ni anaerobios de forma confiable [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'No oral; se administra por vía intravenosa o intramuscular [1]'],
            ['Concentración máxima', 'Al final de la perfusión o 1 a 2 horas tras la inyección IM [1]'],
            ['Unión a proteínas', 'Alta, principalmente albúmina [1]'],
            ['Metabolismo', 'No depende del CYP450; se elimina sin cambios y como metabolitos [1]'],
            ['Semivida', '6 a 9 horas [1]'],
            ['Eliminación', 'Renal y biliar; no requiere ajuste en insuficiencia renal leve o moderada [1]'],
            ['LCR', 'Penetra en líquido cefalorraquídeo, sobre todo con meninges inflamadas [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'La ceftriaxona está indicada en adultos y niños para [1]:',
        { lista: [
          'Meningitis bacteriana.',
          'Neumonía adquirida en la comunidad y neumonía hospitalaria.',
          'Otitis media aguda.',
          'Infecciones intraabdominales.',
          'Infecciones complicadas del tracto urinario, incluida la pielonefritis.',
          'Infecciones óseas y articulares.',
          'Infecciones complicadas de piel y tejidos blandos.',
          'Gonorrea y sífilis.',
          'Endocarditis bacteriana.',
          'Exacerbación de EPOC, enfermedad de Lyme diseminada, profilaxis quirúrgica y fiebre en neutropenia [1].',
        ] },
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Indicación', 'Dosis orientativa en adultos'],
          filas: [
            ['Neumonía, infecciones urinarias o intraabdominales', '1 a 2 g al día [1]'],
            ['Neumonía hospitalaria, piel, huesos o articulaciones', '2 g al día [1]'],
            ['Meningitis, endocarditis o neutropenia febril', '2 a 4 g al día, según gravedad [1]'],
            ['Gonorrea', '500 mg intramuscular en dosis única [1]'],
            ['Sífilis', '500 mg a 1 g al día; neurosífilis, 2 g al día durante 10 a 14 días [1]'],
          ],
        } },
        { lista: [
          'Perfusión intravenosa de al menos 30 minutos o inyección intramuscular profunda [1].',
          'No mezclar con soluciones que contengan calcio, especialmente en neonatos [1].',
          'En insuficiencia renal preterminal (CrCl <10 ml/min) no superar 2 g al día [1].',
          'No requiere dosis suplementaria después de diálisis [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones [1]:',
        { lista: [
          'Hipersensibilidad a ceftriaxona o a otras cefalosporinas.',
          'Antecedente de hipersensibilidad grave a cualquier betalactámico.',
          'Neonatos prematuros hasta las 41 semanas de edad posmenstrual.',
          'Neonatos con hiperbilirrubinemia, hipoalbuminemia o acidosis.',
          'Neonatos que reciben soluciones intravenosas con calcio.',
        ] },
        'Advertencias: reacciones anafilácticas, anemia hemolítica, encefalopatía, litiasis biliar y renal, pancreatitis, colitis por *C. difficile* y reacción de Jarisch-Herxheimer [1].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento o situación', 'Efecto', 'Qué hacer'],
          filas: [
            ['Soluciones con calcio', 'Precipitación de ceftriaxona cálcica', 'No mezclar; en neonatos evitar [1]'],
            ['Warfarina', 'Aumento del INR', 'Controlar el INR [1]'],
            ['Aminoglucósidos', 'Posible mayor toxicidad renal', 'Vigilar función renal [1]'],
            ['Cloranfenicol', 'Antagonismo in vitro', 'Evitar si es posible [1]'],
            ['Probenecid', 'No reduce la eliminación de ceftriaxona', 'Sin ajuste [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las más frecuentes son eosinofilia, leucopenia, trombocitopenia, diarrea, rash y elevación de enzimas hepáticas [1].',
        { lista: [
          'Frecuentes: diarrea, heces blandas, náuseas, vómito y reacciones en el sitio de inyección.',
          'Poco frecuentes: candidiasis genital, cefalea, mareo, prurito y aumento de creatinina.',
          'Raras: anafilaxia, anemia hemolítica, encefalopatía, pancreatitis, colelitiasis, precipitación renal y reacciones cutáneas graves.',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: atraviesa la placenta; los datos son limitados y se usa si el beneficio supera el riesgo [1].',
          'Lactancia: pasa a la leche en concentraciones bajas; se puede considerar, vigilando diarrea o candidiasis en el bebé [1].',
          'Fertilidad: los estudios en animales no muestran efectos adversos [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'La ceftriaxona es un pilar del tratamiento empírico de la meningitis bacteriana y de muchas infecciones graves por gramnegativos, con una cobertura predecible y una posología cómoda [1,2].',
        'En gonorrea, la dosis única intramuscular de 500 mg ha sido eficaz, aunque las guías actuales ajustan la dosis según el peso y la resistencia local [1].',
        'En sífilis, la ceftriaxona es una alternativa en pacientes alérgicos a penicilina, con esquemas prolongados para neurosífilis [1].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra ceftriaxona en polvo para solución inyectable, sola y con lidocaína [3].',
          'Unión Europea: la ceftriaxona está autorizada para las indicaciones descritas [1].',
          'Estados Unidos: la FDA mantiene etiquetas vigentes de ceftriaxona [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'La ceftriaxona es un medicamento hospitalario con riesgos específicos de preparación y compatibilidad; la revisión debe incluir la indicación, la dosis, la vía y la vigilancia [4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Meningitis, neumonía, pielonefritis, gonorrea o sífilis [1]'],
            ['Efectividad', 'Mejoría clínica, fiebre y cultivos [1]'],
            ['Seguridad', 'Alergia, función renal y hepática, calcio, hemograma y bilirrubina [1]'],
            ['Adherencia', 'Cumplimiento del esquema parenteral y duración [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Dosis demasiado alta', 'Ajuste inadecuado en insuficiencia renal grave', 'No superar 2 g al día [1]'],
            ['Reacción adversa', 'Diarrea, rash o anemia hemolítica', 'Evaluar y suspender si es grave [1]'],
            ['Interacción', 'Mezcla con calcio o warfarina', 'Separar y monitorizar [1]'],
            ['Incumplimiento', 'Suspensión precoz del esquema parenteral', 'Coordinar con el equipo tratante [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Verificar la compatibilidad y la reconstitución [1].',
          'Revisar función renal, hemograma y bilirrubina [1].',
          'Vigilar reacciones en el sitio de inyección y diarrea [1].',
          'Registrar el estado de cada problema según el modelo [4].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La ceftriaxona se vive como “una inyección diaria” y suele generar menos preguntas que un tratamiento oral, aunque el miedo a la aguja y la duración del ingreso son relevantes [4,5].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'Si entiende por qué necesita tratamiento parenteral [1].',
          'Si ha tenido reacciones alérgicas previas [1].',
          'Si presenta diarrea, dolor abdominal o ictericia [1].',
          'Cómo se organizará para completar el esquema [1].',
          'Si toma warfarina u otros medicamentos de riesgo [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Sabe cuántos días debe recibir la ceftriaxona?',
          '¿Ha notado salpullido, diarrea o color amarillo en los ojos?',
          '¿Toma anticoagulantes?',
          '¿Qué le preocupa del tratamiento intravenoso?',
        ] },
      ],
    },
  ],
  referencias: [F.ftCeftriaxona, F.whoAware2023, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Ceftriaxona: para qué sirve', '/articulos/ceftriaxona-para-que-sirve'],
    ['Cefalosporinas: generaciones', '/articulos/cefalosporinas-generaciones'],
    ['Betalactámicos: clasificación', '/articulos/betalactamicos-clasificacion'],
  ],
  seo: {
    titulo: 'Ceftriaxona: farmacología y atención farmacéutica',
    descripcion: 'Ceftriaxona: mecanismo, farmacocinética, dosis, meningitis, gonorrea, sífilis, calcio, litiasis biliar y atención farmacéutica.',
  },
};
