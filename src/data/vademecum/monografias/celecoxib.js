import { F } from '../fuentes.js';

/**
 * Monografía: celecoxib. Verificada el 16-nov-2026 en la ficha técnica de
 * CIMA (Celecoxib Cinfa 200 mg), el CUM del INVIMA (13 registros vigentes),
 * el ensayo PRECISION (N Engl J Med 2016) y el metaanálisis CNT 2013.
 */
export default {
  tipo: 'medicamento',
  slug: 'celecoxib',
  nombre: 'Celecoxib',
  titulo: 'Celecoxib: farmacología y atención farmacéutica',
  grupo: 'medicamentos-para-el-dolor-y-la-inflamacion',
  clase: 'Inhibidor selectivo de la COX-2 (coxib)',
  atc: 'M01AH01',
  marcas: ['Celebrex', 'Celecoxib'],
  vias: ['Oral'],
  mecanismo: 'Inhibe de forma selectiva la ciclooxigenasa 2 (COX-2) a las dosis clínicas (200 a 400 mg al día), sin inhibición significativa de la COX-1.',
  actualizado: '2026-11-16',
  resumenCorto: 'coxib para artrosis, artritis reumatoide y espondilitis; máximo 400 mg al día, contraindicado en alergia a sulfamidas y metabolizado por CYP2C9.',
  resumen: 'El celecoxib es un inhibidor selectivo de la COX-2 indicado en adultos para el alivio sintomático de la artrosis, la artritis reumatoide y la espondilitis anquilosante. En el ensayo PRECISION, a dosis moderadas, no fue inferior al ibuprofeno ni al naproxeno en seguridad cardiovascular y produjo menos eventos digestivos. Está contraindicado en la alergia a sulfamidas, la cardiopatía isquémica y la insuficiencia cardiaca, y tiene interacciones por CYP2C9 y CYP2D6. La atención farmacéutica se centra en la selección del paciente, la dosis más baja y la revisión de interacciones.',
  datosClave: [
    ['Clase', 'Inhibidor selectivo de la COX-2 [1]'],
    ['Código ATC', 'M01AH01 [2]'],
    ['Dosis habitual', '200 mg al día en una o dos tomas; máximo 400 mg al día [1]'],
    ['Metabolismo', 'Hepático, principalmente por CYP2C9; inhibe el CYP2D6 [1]'],
    ['Semivida', '8 a 12 horas [1]'],
    ['Colombia', '13 registros sanitarios vigentes en el CUM [2]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El celecoxib es un coxib de administración oral. La ficha técnica lo contraindica en personas con hipersensibilidad conocida a sulfamidas [1].',
        'Se une en un 97 % a las proteínas plasmáticas y su absorción aumenta cerca de un 20 % con comidas ricas en grasas [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Inhibe de forma selectiva la COX-2 en el intervalo de 200 a 400 mg al día; en voluntarios sanos no se observó inhibición significativa de la COX-1 a esas dosis [1].',
        'La selectividad reduce las complicaciones digestivas frente a los AINE clásicos, pero la ficha técnica advierte un aumento de eventos cardiovasculares graves, sobre todo infarto, por lo que se usa la dosis eficaz más baja durante el menor tiempo [1,4].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Aumenta cerca de un 20 % con comidas ricas en grasas [1]'],
            ['Concentración máxima', '2 a 3 horas; unas 4 horas con alimentos [1]'],
            ['Unión a proteínas', '97 % [1]'],
            ['Metabolismo', 'Principalmente por CYP2C9 [1]'],
            ['Semivida', '8 a 12 horas [1]'],
            ['Eliminación', 'Por metabolismo; menos del 1 % inalterado en orina [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Está indicado en adultos para el alivio sintomático de [1]:',
        { lista: [
          'Artrosis.',
          'Artritis reumatoide.',
          'Espondilitis anquilosante.',
        ] },
        'La decisión de usar un inhibidor selectivo de la COX-2 debe basarse en la valoración individual de los riesgos de cada paciente [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Indicación', 'Dosis en adultos'],
          filas: [
            ['Artrosis', '200 mg al día en una o dos tomas; hasta 200 mg dos veces al día [1]'],
            ['Artritis reumatoide', '200 mg al día en dos tomas; hasta 200 mg dos veces al día [1]'],
            ['Espondilitis anquilosante', '200 mg al día; en pocos pacientes, hasta 400 mg al día [1]'],
            ['Personas mayores', 'Iniciar con 200 mg al día; precaución si pesan menos de 50 kg [1]'],
            ['Insuficiencia hepática moderada', 'Iniciar con la mitad de la dosis [1]'],
          ],
        } },
        { lista: [
          'Dosis máxima: 400 mg al día en todas las indicaciones [1].',
          'Si a las 2 semanas no hay más beneficio, considerar otras alternativas [1].',
          'Metabolizadores lentos del CYP2C9: tratar con precaución [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Está contraindicado en [1]:',
        { lista: [
          'Hipersensibilidad conocida a sulfamidas.',
          'Úlcera péptica activa o hemorragia digestiva; enfermedad inflamatoria intestinal.',
          'Asma, rinitis, pólipos nasales, angioedema o urticaria tras ácido acetilsalicílico u otros AINE.',
          'Embarazo y mujeres que puedan quedar embarazadas sin anticoncepción eficaz; lactancia.',
          'Insuficiencia hepática grave y aclaramiento de creatinina <30 ml/min.',
          'Insuficiencia cardiaca NYHA II-IV, cardiopatía isquémica, enfermedad arterial periférica o cerebrovascular establecidas.',
        ] },
        'Advertencias: complicaciones digestivas altas y bajas; eventos cardiovasculares graves; retención de líquidos, edema e hipertensión; toxicidad renal y reacciones hepáticas graves; reacciones cutáneas graves muy raras, incluido DRESS; puede enmascarar la fiebre; y hemorragias graves con warfarina [1].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Warfarina', 'INR más alto y hemorragias graves', 'Controlar el INR [1]'],
            ['Fluconazol (inhibidor del CYP2C9)', 'Celecoxib: Cmáx +60 % y AUC +130 %', 'Iniciar con la dosis más baja [1]'],
            ['Rifampicina, carbamazepina, barbitúricos', 'Bajan el celecoxib', 'Vigilar eficacia [1]'],
            ['Sustratos del CYP2D6 (metoprolol, dextrometorfano, antidepresivos)', 'Suben sus concentraciones', 'Puede requerir reducir su dosis [1]'],
            ['IECA, ARA-II, diuréticos, betabloqueadores', 'Menos efecto antihipertensivo y riesgo renal', 'Vigilar presión y función renal [1]'],
            ['Litio', 'Litio: Cmáx +16 % y AUC +18 %', 'Vigilar litemia [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Frecuentes: infecciones respiratorias altas, sinusitis, faringitis, infección urinaria, insomnio, mareo, cefalea, hipertensión, dispepsia, dolor abdominal, diarrea, náuseas, erupción, edema periférico y retención de líquidos [1].',
        { lista: [
          'La ficha técnica incluye el infarto de miocardio entre las reacciones frecuentes de los ensayos [1].',
          'Graves: hemorragia y perforación digestiva, hepatitis e insuficiencia hepática, insuficiencia renal aguda, insuficiencia cardiaca, anafilaxia, síndrome de Stevens-Johnson, necrólisis epidérmica tóxica y DRESS [1].',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: contraindicado, también en mujeres que puedan quedar embarazadas sin anticoncepción eficaz; en el segundo y tercer trimestre puede producir cierre prematuro del ductus arterioso y disfunción renal fetal [1].',
          'Lactancia: pasa en muy baja proporción, pero quienes lo toman no deben amamantar [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'PRECISION aleatorizó a 24.081 pacientes con artrosis o artritis reumatoide y riesgo cardiovascular aumentado a celecoxib (dosis media 209 mg al día), naproxeno (852 mg) o ibuprofeno (2.045 mg), con un seguimiento medio de 34 meses [3].',
        'El desenlace cardiovascular primario ocurrió en 2,3 % con celecoxib, 2,5 % con naproxeno y 2,7 % con ibuprofeno; el celecoxib fue no inferior a ambos. Los eventos digestivos fueron menos con celecoxib que con naproxeno o ibuprofeno, y los renales, menos que con ibuprofeno [3].',
        'El metaanálisis CNT mostró que los coxibs aumentan los eventos vasculares mayores frente a placebo [4]. La lectura conjunta: a dosis moderadas, el celecoxib no es más riesgoso para el corazón que el ibuprofeno o el naproxeno a dosis plenas, pero ninguno es inocuo.',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM del INVIMA registra 13 registros sanitarios vigentes con celecoxib (código ATC M01AH01), consulta del 16-nov-2026 [2].',
          'Unión Europea: autorizado en adultos para artrosis, artritis reumatoide y espondilitis anquilosante [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'El celecoxib suele elegirse para «proteger el estómago». Esa elección es correcta en el paciente sin enfermedad cardiovascular establecida; en el paciente con cardiopatía isquémica está contraindicado [1,5].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Artrosis, artritis reumatoide o espondilitis [1]'],
            ['Efectividad', 'Beneficio a las 2 semanas; si no hay, no aumentar sin revisar [1]'],
            ['Seguridad', 'Alergia a sulfamidas, cardiopatía, función renal, embarazo [1]'],
            ['Adherencia', 'Dosis y número de tomas; no sumar otros AINE [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría', 'Situación típica', 'Intervención'],
          filas: [
            ['Seguridad', 'Alergia a las «sulfas» no preguntada', 'Confirmar antes de dispensar [1]'],
            ['Interacción', 'Celecoxib con fluconazol', 'Iniciar con la dosis más baja [1]'],
            ['Interacción', 'Celecoxib con metoprolol o antidepresivos', 'Vigilar efecto del sustrato del CYP2D6 [1]'],
            ['Reacción adversa', 'Edema y aumento de la presión', 'Medir y comunicar [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Preguntar siempre por alergia a sulfamidas y por enfermedad cardiovascular [1].',
          'Revisar interacciones por CYP2C9 y CYP2D6 [1].',
          'Registrar el estado de cada problema según el modelo [5].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'Quien ha tenido gastritis con otros antiinflamatorios suele vivir el celecoxib como un alivio. Esa experiencia positiva puede ocultar el riesgo cardiovascular si nadie lo revisa [6].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'Si alguna vez reaccionó a un antibiótico con «sulfa» [1].',
          'Si tiene angina, infarto previo o insuficiencia cardiaca [1].',
          'Qué otros medicamentos toma para el dolor o el ánimo [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Le han dicho que es alérgico a alguna sulfa?',
          '¿Ha notado los pies hinchados o falta de aire?',
          '¿Cuánto tiempo le indicaron tomarlo?',
        ] },
      ],
    },
  ],
  referencias: [F.ftCelecoxib, F.invimaCum16, F.precision, F.cnt2013, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Celecoxib: para qué sirve', '/articulos/celecoxib-para-que-sirve'],
    ['Ibuprofeno: para qué sirve', '/articulos/ibuprofeno-para-que-sirve'],
    ['Naproxeno: para qué sirve', '/articulos/naproxeno-para-que-sirve'],
    ['Medicamentos para el dolor y la inflamación', '/vademecum/medicamentos-para-el-dolor-y-la-inflamacion'],
    ['Curso gratis: Farmacología del Sistema Nervioso Central', '/curso-de-farmacologia-del-sistema-nervioso-central'],
  ],
  seo: {
    titulo: 'Celecoxib: farmacología y atención farmacéutica',
    descripcion: 'Celecoxib: mecanismo COX-2, dosis máxima de 400 mg, ensayo PRECISION, alergia a sulfamidas, interacciones por CYP2C9 y atención farmacéutica.',
  },
};
