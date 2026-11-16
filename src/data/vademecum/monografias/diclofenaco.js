import { F } from '../fuentes.js';

/**
 * Monografía: diclofenaco. Verificada el 16-nov-2026 en la ficha técnica de
 * CIMA (Diclofenaco Normon 50 mg gastrorresistente), el CUM del INVIMA
 * (82 registros vigentes que contienen diclofenaco), el metaanálisis CNT
 * 2013 y el programa MEDAL.
 */
export default {
  tipo: 'medicamento',
  slug: 'diclofenaco',
  nombre: 'Diclofenaco',
  titulo: 'Diclofenaco: farmacología y atención farmacéutica',
  grupo: 'medicamentos-para-el-dolor-y-la-inflamacion',
  clase: 'AINE',
  atc: 'M01AB05',
  marcas: ['Voltaren', 'Diclofenaco'],
  vias: ['Oral', 'Inyectable', 'Tópica'],
  mecanismo: 'Inhibe la biosíntesis de prostaglandinas; tiene marcadas propiedades antiinflamatorias, analgésicas y antipiréticas.',
  actualizado: '2026-11-16',
  resumenCorto: 'AINE muy usado en dolor e inflamación; por vía oral comparte el riesgo cardiovascular de los coxibs, sobre todo con 150 mg al día y uso prolongado.',
  resumen: 'El diclofenaco es un AINE con efecto antiinflamatorio, analgésico y antipirético, indicado en enfermedades reumáticas, gota aguda, dismenorrea e inflamación postraumática. En Colombia existe en tabletas, cápsulas de liberación prolongada, solución inyectable y gel. Por vía oral, el metaanálisis CNT lo sitúa con los coxibs en riesgo de eventos vasculares mayores, y la ficha técnica lo contraindica en cardiopatía isquémica, insuficiencia cardiaca y enfermedad arterial periférica o cerebrovascular. La atención farmacéutica se centra en el riesgo cardiovascular, digestivo y renal, en el uso innecesario de inyecciones y en la duplicidad con otros AINE.',
  datosClave: [
    ['Clase', 'AINE [1]'],
    ['Código ATC', 'M01AB05 [2]'],
    ['Dosis habitual', '75 a 150 mg al día en 2 o 3 tomas; máximo recomendado 150 mg al día [1]'],
    ['Metabolismo', 'Hepático, con primer paso de cerca de la mitad de la dosis; interviene el CYP2C9 [1]'],
    ['Semivida', '1 a 2 horas [1]'],
    ['Colombia', '82 registros sanitarios vigentes que contienen diclofenaco en el CUM [2]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'Se usa como diclofenaco sódico; la presentación oral de referencia son comprimidos gastrorresistentes de 50 mg [1].',
        'Se une en un 99,7 % a las proteínas plasmáticas, sobre todo a la albúmina [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Es un compuesto no esteroideo con marcadas propiedades antiinflamatorias, analgésicas y antipiréticas. La inhibición de la biosíntesis de prostaglandinas se considera clave en su mecanismo [1].',
        'También inhibe de forma temporal la agregación plaquetaria [1]. En el metaanálisis CNT, el diclofenaco aumentó los eventos coronarios mayores en un grado similar al de los coxibs [3].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Completa; cerca de la mitad sufre efecto de primer paso hepático [1]'],
            ['Concentración máxima', 'A las 2 horas de un comprimido de 50 mg [1]'],
            ['Unión a proteínas', '99,7 % [1]'],
            ['Metabolismo', 'Glucuronidación e hidroxilación; interviene el CYP2C9 [1]'],
            ['Semivida', '1 a 2 horas; metabolitos de 1 a 3 horas [1]'],
            ['Eliminación', 'Cerca del 60 % en orina como conjugados y metabolitos; el resto por bilis [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica de referencia está indicado en [1]:',
        { lista: [
          'Enfermedades reumáticas crónicas inflamatorias: artritis reumatoide, espondilitis anquilosante y artrosis.',
          'Reumatismo extraarticular.',
          'Ataque agudo de gota.',
          'Dismenorrea primaria.',
          'Inflamación y tumefacción postraumáticas.',
        ] },
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Situación', 'Dosis en adultos'],
          filas: [
            ['Casos leves o tratamientos prolongados', '75 a 100 mg al día [1]'],
            ['Dosis máxima recomendada', '100 a 150 mg al día en 2 o 3 tomas [1]'],
            ['Dismenorrea primaria', '50 a 200 mg al día, con dosis inicial de 50 a 100 mg [1]'],
            ['Personas mayores', 'Sin ajuste, pero con la dosis eficaz más baja [1]'],
          ],
        } },
        { lista: [
          'Usar la dosis eficaz más baja durante el menor tiempo posible [1].',
          'El riesgo cardiovascular aumenta con 150 mg al día y con tratamientos prolongados [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Está contraindicado en [1]:',
        { lista: [
          'Asma, urticaria o rinitis aguda desencadenadas por ácido acetilsalicílico u otros AINE.',
          'Enfermedad de Crohn o colitis ulcerosa activas; úlcera, hemorragia o perforación digestiva activa o previa por AINE.',
          'Insuficiencia hepática o renal grave y trastornos de la coagulación.',
          'Insuficiencia cardiaca NYHA II-IV, cardiopatía isquémica, enfermedad arterial periférica o cerebrovascular.',
          'Tercer trimestre del embarazo.',
        ] },
        'Advertencias: hemorragia, úlcera o perforación digestiva en cualquier momento; aumento del riesgo trombótico arterial; retención de líquidos y edema; elevación de enzimas hepáticas; reacciones cutáneas graves muy raras; y exacerbación del asma [1].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Anticoagulantes, antiagregantes, ISRS', 'Más riesgo de hemorragia', 'Evitar o vigilar estrechamente [1]'],
            ['Otros AINE, corticoides', 'Más efectos digestivos', 'No combinar AINE [1]'],
            ['Diuréticos, betabloqueadores, IECA', 'Menos efecto antihipertensivo y más nefrotoxicidad', 'Controlar presión y función renal [1]'],
            ['Litio, digoxina, metotrexato, fenitoína', 'Aumentan sus concentraciones o su toxicidad', 'Vigilar niveles [1]'],
            ['Ahorradores de potasio, ciclosporina, tacrolimus, trimetoprim', 'Hiperpotasemia', 'Controlar el potasio [1]'],
            ['Voriconazol (inhibidor del CYP2C9)', 'Aumenta mucho el diclofenaco', 'Reducir la dosis [1]'],
            ['Quinolonas', 'Casos aislados de convulsiones', 'Precaución [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Frecuentes: cefalea, mareo, vértigo, náuseas, vómito, diarrea, dispepsia, dolor abdominal, flatulencia, menos apetito, aumento de transaminasas y erupción [1].',
        { lista: [
          'Graves: infarto de miocardio, insuficiencia cardiaca, accidente cerebrovascular, hemorragia y perforación digestiva, hepatitis fulminante, agranulocitosis, anafilaxia, síndrome de Stevens-Johnson y fallo renal agudo [1].',
          'En el metaanálisis CNT, las complicaciones digestivas altas aumentaron con el diclofenaco (razón de tasas 1,89) [3].',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Primer y segundo trimestre: solo si es estrictamente necesario, con la menor dosis y duración; desde la semana 20 puede causar oligohidramnios [1].',
          'Tercer trimestre: contraindicado [1].',
          'Lactancia: no se recomienda; pasa a la leche en pequeñas cantidades [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'En el metaanálisis CNT, el diclofenaco aumentó los eventos vasculares mayores (razón de tasas 1,41) y los coronarios mayores (1,70), en un grado similar al de los coxibs [3].',
        'En el programa MEDAL, con 34.701 pacientes, diclofenaco 150 mg y etoricoxib tuvieron tasas similares de eventos trombóticos; el diclofenaco produjo más eventos digestivos altos [4].',
        'La conclusión práctica: el diclofenaco oral no es una opción «suave» para el corazón. En Colombia también está registrado en gel tópico, una alternativa a valorar en el dolor localizado [2].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM del INVIMA registra 82 registros sanitarios vigentes que contienen diclofenaco (código ATC M01AB05). Con ese código predominan las soluciones inyectables, seguidas de gel tópico, tabletas y cápsulas de liberación prolongada. Consulta del 16-nov-2026 [2].',
          'España: autorizado en comprimidos gastrorresistentes de 50 mg para las indicaciones descritas [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'El diclofenaco se pide en la droguería en tableta, en gel y en inyección. Los problemas más frecuentes son la inyección sin indicación, la suma con otros AINE y el uso continuo en personas con riesgo cardiovascular [1,5].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Dolor e inflamación musculoesquelética, reumática, gota o dismenorrea [1]'],
            ['Efectividad', 'Alivio en pocos días; en dolor localizado, valorar la presentación tópica [1,2]'],
            ['Seguridad', 'Cardiopatía, úlcera, función renal, asma, embarazo [1]'],
            ['Adherencia', 'No más de 150 mg al día ni combinación con otros AINE [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría', 'Situación típica', 'Intervención'],
          filas: [
            ['Seguridad', 'Diclofenaco oral en paciente con angina o infarto previo', 'Contraindicado; remitir [1]'],
            ['Farmacoterapia innecesaria', 'Inyección pedida para un dolor leve', 'Ofrecer vía oral o tópica según el caso [1]'],
            ['Dosis demasiado alta', 'Diclofenaco con ibuprofeno o naproxeno', 'Suspender la duplicidad [1]'],
            ['Interacción', 'Diclofenaco con losartán y diurético', 'Controlar presión y creatinina [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Preguntar por enfermedad cardiovascular antes de dispensar la vía oral [1].',
          'En el dolor localizado, comentar con el prescriptor la presentación tópica registrada [2].',
          'Registrar el estado de cada problema según el modelo [5].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'Para muchas personas, «la inyección de diclofenaco» es lo que más rápido quita el dolor. Esa creencia explica pedidos repetidos sin fórmula y la falta de información sobre el riesgo cardiovascular [6].',
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Para qué dolor lo usa y en qué presentación?',
          '¿Tiene presión alta, angina o le han hecho un cateterismo?',
          '¿Toma otro analgésico o un antiinflamatorio al mismo tiempo?',
        ] },
      ],
    },
  ],
  referencias: [F.ftDiclofenaco, F.invimaCum16, F.cnt2013, F.medal, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Diclofenaco: para qué sirve', '/articulos/diclofenaco-para-que-sirve'],
    ['Etoricoxib: farmacología', '/vademecum/etoricoxib'],
    ['Medicamentos para el dolor y la inflamación', '/vademecum/medicamentos-para-el-dolor-y-la-inflamacion'],
    ['Curso gratis: Farmacología del Sistema Nervioso Central', '/curso-de-farmacologia-del-sistema-nervioso-central'],
  ],
  seo: {
    titulo: 'Diclofenaco: farmacología y atención farmacéutica',
    descripcion: 'Diclofenaco: mecanismo, dosis máxima de 150 mg, riesgo cardiovascular (CNT y MEDAL), digestivo y renal, interacciones y atención farmacéutica.',
  },
};
