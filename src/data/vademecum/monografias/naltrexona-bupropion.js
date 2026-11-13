import { F } from '../fuentes.js';

/** Monografía: naltrexona/bupropión de liberación prolongada. Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'naltrexona-bupropion',
  nombre: 'Naltrexona/bupropión',
  titulo: 'Naltrexona/bupropión: farmacología, interacciones y atención farmacéutica en obesidad',
  grupo: 'medicamentos-para-la-obesidad',
  clase: 'Antagonista opioide μ e inhibidor de la recaptación de dopamina y noradrenalina',
  atc: 'A08AA62',
  marcas: ['Mysimba', 'Contrave'],
  vias: ['Oral, dos veces al día'],
  mecanismo: 'El bupropión estimula las neuronas POMC del hipotálamo y la naltrexona bloquea el freno opioide sobre esas neuronas; juntos actúan además sobre el sistema dopaminérgico de recompensa.',
  actualizado: '2026-11-12',
  resumenCorto: 'combinación oral de acción central; −6,1 % de peso en COR-I; sin registro en Colombia.',
  resumen: 'La combinación de naltrexona y bupropión en comprimidos de liberación prolongada actúa sobre el control hipotalámico del apetito y el sistema de recompensa. Su perfil exige una valoración cuidadosa: está contraindicada con convulsiones, hipertensión no controlada, trastorno bipolar, trastornos de la conducta alimentaria y uso crónico de opioides, y el bupropión inhibe la CYP2D6. No tiene registro sanitario en Colombia.',
  datosClave: [
    ['Clase', 'Antagonista de receptores opioides μ (naltrexona) e inhibidor débil de la recaptación de dopamina y noradrenalina (bupropión) [1]'],
    ['Código ATC', 'A08AA62 [1]'],
    ['Dosis de mantenimiento', 'Dos comprimidos de 8 mg/90 mg dos veces al día: 32 mg de naltrexona y 360 mg de bupropión al día [1]'],
    ['Semivida', 'Unas 5 horas la naltrexona y 21 horas el bupropión [1]'],
    ['Regla de continuación', 'Suspender si a las 16 semanas no se ha perdido al menos el 5 % del peso [1]'],
    ['Colombia', 'Sin registro sanitario de la combinación en el CUM consultado [4]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        { subtitulo: 'Naltrexona' },
        'Es un congénere sintético de la oximorfona sin actividad agonista opioide: el grupo metilo del nitrógeno se reemplaza por un ciclopropilmetilo. Se relaciona con la naloxona. Nombre químico: clorhidrato de (5α)-17-(ciclopropilmetil)-4,5-epoxi-3,14-dihidroximorfinan-6-ona; fórmula C20H23NO4·HCl y peso molecular 377,86 [2].',
        { subtitulo: 'Bupropión' },
        'Es un antidepresivo de la clase de las aminocetonas, de estructura parecida a la dietilpropiona y relacionado con las feniletilaminas. Nombre químico: clorhidrato de (±)-1-(3-clorofenil)-2-[(1,1-dimetiletil)amino]-1-propanona; fórmula C13H18ClNO·HCl y peso molecular 276,2 [2].',
        { subtitulo: 'La forma farmacéutica' },
        'Los comprimidos son de liberación prolongada, con un núcleo de tres capas: dos capas con los fármacos separadas por una capa intermedia [2]. Por eso no deben dividirse, masticarse ni triturarse [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Sus efectos neuroquímicos exactos sobre el apetito no se conocen por completo. Actúa en dos regiones del cerebro: el núcleo arcuato del hipotálamo y el sistema dopaminérgico mesolímbico de recompensa [1].',
        { pasos: [
          'El bupropión estimula las neuronas productoras de proopiomelanocortina (POMC), que liberan α-MSH; esta activa los receptores de melanocortina 4 (MC4R), que reducen la ingesta [1].',
          'Al mismo tiempo, esas neuronas liberan β-endorfina, que actúa sobre receptores opioides μ de la propia neurona y frena la liberación de α-MSH [1].',
          'La naltrexona bloquea ese freno opioide, de modo que la activación de las neuronas POMC por el bupropión es más intensa y duradera [1].',
        ] },
        'En las mediciones por absorciometría (DEXA), el tratamiento redujo más que el placebo la grasa corporal total y el tejido adiposo visceral [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Naltrexona', 'Bupropión'],
          filas: [
            ['Tiempo hasta la concentración máxima', 'Unas 2 horas [1]', 'Unas 3 horas [1]'],
            ['Absorción oral', 'Más del 90 %, pero solo el 5 a 6 % llega intacto a la circulación por el primer paso hepático [1]', 'Más del 90 % [1]'],
            ['Efecto de una comida rica en grasa (dosis única)', 'AUC 2,1 veces y Cmáx 3,7 veces mayores [1]', 'AUC 1,4 veces y Cmáx 1,8 veces mayores [1]'],
            ['Metabolismo', 'Metabolito 6-β-naltrexol, en equilibrio en unos 3 días [1]', 'Por la CYP2B6 a hidroxibupropión; bupropión e hidroxibupropión inhiben la CYP2D6 [1]'],
            ['Semivida de eliminación', 'Unas 5 horas [1]', 'Unas 21 horas; sus metabolitos tienen semividas más largas y se acumulan más [1]'],
          ],
        } },
        'La combinación es bioequivalente a cada componente por separado. Con 360 mg diarios de bupropión en la combinación, la Cmáx del bupropión es comparable a la de 300 mg al día de bupropión de liberación prolongada [1].',
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, está indicada como coadyuvante de una dieta baja en calorías y más actividad física para el control del peso en adultos de 18 años o más con IMC inicial de 30 kg/m² o más, o de 27 a menos de 30 kg/m² con una o más comorbilidades relacionadas con el peso (diabetes tipo 2, dislipidemia o hipertensión controlada). Se suspende si a las 16 semanas no se ha perdido al menos el 5 % del peso inicial [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Semana', 'Mañana', 'Noche'],
          filas: [['1', '1 comprimido', '—'], ['2', '1 comprimido', '1 comprimido'], ['3', '2 comprimidos', '1 comprimido'], ['4 en adelante', '2 comprimidos', '2 comprimidos']],
        } },
        { lista: [
          'Dosis máxima: 32 mg de naltrexona y 360 mg de bupropión al día. La necesidad de continuar se evalúa a las 16 semanas y luego una vez al año [1].',
          'Se traga entero con un poco de agua, preferiblemente con las comidas; no se divide, mastica ni tritura [1].',
          'Dosis olvidada: no se toma una dosis adicional; se sigue con la siguiente a la hora habitual [1].',
          'Personas mayores: precaución después de los 65 años y no recomendada después de los 75 [1].',
          'Insuficiencia renal: contraindicada en la terminal; en la moderada o grave, máximo un comprimido por la mañana y uno por la noche. Se calcula la TFGe antes de iniciar en personas con riesgo, como las que tienen diabetes o edad avanzada [1].',
          'Insuficiencia hepática: contraindicada en la grave y no recomendada en la leve o moderada [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones según la ficha técnica [1]:',
        { lista: [
          'Hipersensibilidad a los principios activos o a los excipientes.',
          'Hipertensión no controlada.',
          'Trastornos convulsivos actuales o antecedentes de convulsiones; neoplasia conocida del sistema nervioso central.',
          'Síndrome de abstinencia de alcohol o de benzodiacepinas.',
          'Antecedentes de trastorno bipolar; diagnóstico actual o previo de bulimia o anorexia nerviosa.',
          'Dependencia a opioides de uso prolongado, tratamiento con agonistas opioides (por ejemplo, metadona) o síndrome agudo de abstinencia a opioides.',
          'Otro tratamiento con bupropión o naltrexona; inhibidores de la monoaminooxidasa (IMAO), con al menos 14 días entre suspender el IMAO e iniciar.',
          'Insuficiencia hepática grave o insuficiencia renal terminal.',
        ] },
        'Advertencias principales [1]:',
        { lista: [
          'Ideación y comportamiento suicidas: se han notificado después de la comercialización; vigilancia estrecha al inicio y tras cambios de dosis, y aviso a pacientes y cuidadores.',
          'Convulsiones: el bupropión tiene un riesgo dependiente de la dosis (alrededor del 0,1 % con 300 mg de liberación prolongada).',
          'Presión arterial y frecuencia cardiaca: con otros productos con bupropión se han descrito casos de hipertensión, algunos graves; se suspende si la presión aumenta.',
          'Aumentos reversibles de las enzimas hepáticas con dosis terapéuticas y superiores.',
          'La seguridad y la tolerabilidad deben evaluarse de forma periódica.',
        ] },
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['IMAO', 'Potencian las vías catecolaminérgicas', 'Contraindicado; esperar al menos 14 días [1]'],
            ['Analgésicos, antitusivos y antidiarreicos opioides', 'La naltrexona bloquea su efecto', 'Suspender temporalmente la combinación si se necesita un opioide; precaución tras 7 a 10 días sin opioides crónicos [1]'],
            ['Sustratos de la CYP2D6: ISRS, tricíclicos, haloperidol, risperidona, metoprolol, propafenona, flecainida', 'Mayor exposición: el metoprolol aumentó 4 veces su AUC y 2 veces su Cmáx', 'Iniciar el medicamento concomitante en la dosis más baja de su intervalo [1]'],
            ['Inductores o inhibidores de la CYP2B6', 'Cambian la conversión del bupropión en hidroxibupropión', 'Vigilar la respuesta y los efectos adversos [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'En los ensayos clínicos, el 23,8 % de los pacientes suspendió por una reacción adversa, frente al 11,9 % con placebo [1].',
        { lista: [
          'Muy frecuentes: náuseas, estreñimiento, vómitos y cefalea [1].',
          'Frecuentes: mareo y boca seca [1].',
          'Poco frecuentes: hipersensibilidad y urticaria; raras: angioedema [1].',
          'Las que más llevaron a suspender fueron náuseas, cefalea, mareo y vómitos [1].',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no debe usarse, ni en mujeres que intentan quedar en embarazo; los datos son limitados y los estudios en animales mostraron toxicidad para la reproducción [1].',
          'Lactancia: la naltrexona, el bupropión y sus metabolitos pasan a la leche materna [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El ensayo COR-I asignó a 1.742 adultos con sobrepeso u obesidad a naltrexona 32 mg más bupropión, naltrexona 16 mg más bupropión o placebo durante 56 semanas. Solo el 50 % completó el tratamiento [3].',
        { tabla: {
          columnas: ['Resultado a las 56 semanas', 'Naltrexona 32 mg + bupropión', 'Placebo'],
          filas: [
            ['Cambio de peso', '−6,1 %', '−1,3 % [3]'],
            ['Pérdida de al menos el 5 %', '48 %', '16 % [3]'],
            ['Náuseas', '29,8 %', '5,3 % [3]'],
          ],
        } },
        'La presión arterial subió alrededor de 1,5 mmHg de forma transitoria y luego quedó cerca de 1 mmHg por debajo del valor inicial. No hubo más depresión ni eventos de suicidio que con placebo [3].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM no registra la combinación. La naltrexona solo aparece como solución oral (Nalden) y el bupropión, en productos para otras indicaciones [4].',
          'Unión Europea: Mysimba tiene ficha técnica vigente [1].',
          'Estados Unidos: se comercializa como Contrave [2].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con esta combinación, la valoración de la indicación pesa más que en otros medicamentos del grupo: sus contraindicaciones psiquiátricas, neurológicas y por opioides, y la inhibición de la CYP2D6, obligan a revisar toda la farmacoterapia antes de empezar [1,5].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con naltrexona/bupropión'],
          filas: [
            ['Indicación', 'IMC y comorbilidades; antecedentes de convulsiones, trastorno bipolar, bulimia o anorexia; consumo de alcohol, benzodiacepinas u opioides; otros productos con bupropión (por ejemplo, para dejar de fumar) [1]'],
            ['Efectividad', 'Pérdida de al menos el 5 % a las 16 semanas [1]'],
            ['Seguridad', 'Presión arterial y frecuencia cardiaca; estado de ánimo e ideas suicidas; función renal y hepática; sustratos de la CYP2D6 [1]'],
            ['Adherencia', 'Dos tomas diarias con comida, comprimidos enteros, escalado de 4 semanas [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Farmacoterapia innecesaria', 'Duplicación con un antidepresivo o un producto para dejar de fumar que contiene bupropión', 'Contraindicado: informar al prescriptor [1]'],
            ['Reacción adversa', 'Aumento de la presión arterial', 'Medir en cada control; suspender si aumenta, según la ficha [1]'],
            ['Reacción adversa', 'Exposición aumentada a metoprolol o a un antidepresivo metabolizado por la CYP2D6', 'Proponer la dosis más baja del medicamento concomitante y vigilar [1]'],
            ['Medicamento inefectivo', 'Menos del 5 % a las 16 semanas', 'Informar al médico para suspender [1]'],
            ['Medicamento inefectivo', 'Analgesia insuficiente con un opioide durante una cirugía o un dolor agudo', 'Planear la suspensión temporal con el equipo médico [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y 4. Seguimiento' },
        { lista: [
          'Metas: al menos el 5 % del peso a las 16 semanas; como referencia, el 48 % lo logró en COR-I a las 56 semanas [1,3].',
          'Educación: escalado, toma con comida, no partir los comprimidos, señales de alarma (cambios del ánimo, ideas suicidas, convulsiones) e informar el tratamiento antes de recibir opioides [1].',
          'Seguimiento al inicio y tras cada cambio de dosis, con presión arterial y estado de ánimo; registro del estado de cada PRF según el modelo [1,5].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La experiencia del paciente con sus medicamentos ayuda a prevenir y resolver problemas que la fórmula no muestra [5,6].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'Significado de los componentes: la naltrexona es un antagonista opioide y el bupropión, un antidepresivo [2]; algunas personas pueden sentir estigma o rechazo al saberlo.',
          'Historia de salud mental y de la conducta alimentaria, que la persona puede no mencionar si no se le pregunta con respeto [1].',
          'Consumo de alcohol, de benzodiacepinas o de opioides, incluidos los antitusivos [1].',
          'Tolerancia a las náuseas al inicio, la causa más frecuente de abandono [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Ha tenido alguna vez convulsiones, desmayos o un trastorno del ánimo?',
          '¿Toma algún medicamento para el dolor, la tos, el ánimo o para dejar de fumar?',
          '¿Cómo se siente al saber que uno de los componentes también se usa como antidepresivo?',
          '¿A qué horas come habitualmente, para organizar las dos tomas con comida?',
        ] },
      ],
    },
  ],
  referencias: [F.ftMysimba, F.dmContrave, F.corI, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Pastillas para adelgazar: riesgos', '/articulos/pastillas-para-adelgazar-riesgos'],
    ['Modelo de Minnesota: atención farmacéutica centrada en el paciente', '/articulos/atencion-farmaceutica-modelo-minnesota'],
  ],
  seo: {
    titulo: 'Naltrexona/bupropión: farmacología y atención farmacéutica',
    descripcion: 'Naltrexona/bupropión (Mysimba, Contrave): farmacoquímica, mecanismo POMC, farmacocinética, CYP2D6, contraindicaciones, COR-I y atención farmacéutica.',
  },
};
