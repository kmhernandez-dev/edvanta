import { F } from '../fuentes.js';

/** Monografía: amoxicilina con ácido clavulánico. Verificada el 13-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'amoxicilina-acido-clavulanico',
  nombre: 'Amoxicilina con ácido clavulánico',
  titulo: 'Amoxicilina con ácido clavulánico: farmacología y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Penicilina con inhibidor de betalactamasas',
  atc: 'J01CR02',
  marcas: ['Augmentin', 'Clavulin'],
  vias: ['Oral', 'Intravenosa'],
  mecanismo: 'La amoxicilina inhibe las proteínas de unión a la penicilina que sintetizan el peptidoglicano; el ácido clavulánico inactiva betalactamasas que destruirían la amoxicilina.',
  actualizado: '2026-11-13',
  resumenCorto: 'penicilina protegida por un inhibidor de betalactamasas; se toma al comienzo de las comidas.',
  resumen: 'La combinación de amoxicilina con ácido clavulánico amplía el espectro de la amoxicilina a bacterias productoras de betalactamasas sensibles al clavulánico. Se usa en infecciones respiratorias altas y bajas, urinarias, de piel, dentales y óseas. Sus puntos críticos son la alergia a betalactámicos, la hepatotoxicidad y la elección de la presentación para no dar dosis innecesarias de clavulánico.',
  datosClave: [
    ['Clase', 'Combinación de penicilina con inhibidor de betalactamasas; ATC J01CR02 [1]'],
    ['Biodisponibilidad', 'Cerca del 70 % para ambos componentes [1]'],
    ['Semivida de la amoxicilina', 'Cerca de 1,2 horas [1]'],
    ['Administración', 'Al comienzo de las comidas [1]'],
    ['Colombia', '30 registros sanitarios vigentes con ácido clavulánico [5]'],
  ],
  secciones: [
    { id: 'farmacoquimica', titulo: 'Farmacoquímica', bloques: [
      'La amoxicilina es un análogo de la ampicilina derivado del núcleo de la penicilina, el ácido 6-aminopenicilánico; como trihidrato tiene fórmula C16H19N3O5S·3H2O y peso molecular de 419,46 [2]. La molécula anhidra pesa 365,4 g/mol [3].',
      'El ácido clavulánico se obtiene por fermentación de Streptomyces clavuligerus. Es un betalactámico emparentado con las penicilinas que inactiva algunas betalactamasas bloqueando su sitio activo [2]. Su fórmula es C8H9NO5 (199,16 g/mol) [4]. Se usa como sal potásica [2].',
    ] },
    { id: 'farmacodinamia', titulo: 'Farmacodinamia', bloques: [
      'La amoxicilina inhibe una o más proteínas de unión a la penicilina de la vía de síntesis del peptidoglicano, componente estructural de la pared bacteriana [1].',
      'El ácido clavulánico protege a la amoxicilina de las betalactamasas que puede inhibir. No sirve cuando la resistencia se debe a otros mecanismos distintos de esas betalactamasas [1].',
    ] },
    { id: 'farmacocinetica', titulo: 'Farmacocinética', bloques: [
      { tabla: { columnas: ['Parámetro', 'Amoxicilina', 'Ácido clavulánico'], filas: [
        ['Biodisponibilidad oral', 'Cerca del 70 % [1]', 'Cerca del 70 % [1]'],
        ['Tmáx', 'Unas 1,5 horas [1]', 'Unas 1,5 horas [1]'],
        ['Cmáx (500/125 mg)', '7,19 µg/ml [1]', '2,40 µg/ml [1]'],
        ['Semivida', '1,15 a 1,19 horas [1]', '—'],
      ] } },
      'La absorción es óptima cuando se toma al principio de las comidas [1].',
    ] },
    { id: 'indicaciones', titulo: 'Indicaciones', bloques: [
      { lista: [
        'Sinusitis bacteriana aguda y otitis media aguda [1].',
        'Exacerbación aguda de bronquitis crónica y neumonía adquirida en la comunidad [1].',
        'Cistitis y pielonefritis [1].',
        'Infecciones de piel y tejidos blandos: celulitis, mordeduras de animales y abscesos dentales graves con celulitis [1].',
        'Infecciones de huesos y articulaciones, en particular osteomielitis [1].',
      ] },
    ] },
    { id: 'posologia', titulo: 'Posología', bloques: [
      { lista: [
        'Adultos y niños de 40 kg o más con 500/125 mg: un comprimido tres veces al día [1].',
        'Con 875/125 mg: dos veces al día como dosis estándar; tres veces al día en otitis, sinusitis, vías respiratorias bajas e infecciones urinarias [1].',
        'Niños de menos de 40 kg: según peso; los menores de 25 kg no deben tratarse con comprimidos, que no se pueden partir [1].',
        'No pasar de 14 días sin revisión [1].',
      ] },
      'Elegir la presentación evita dosis innecesariamente altas de ácido clavulánico cuando se requiere más amoxicilina [1].',
    ] },
    { id: 'contraindicaciones-y-advertencias', titulo: 'Contraindicaciones y advertencias', bloques: [
      { lista: [
        'Contraindicada con hipersensibilidad a penicilinas, reacción inmediata grave a otro betalactámico, o ictericia o daño hepático previos por esta combinación [1].',
        'Hepatotoxicidad: precaución en insuficiencia hepática y control de la función hepática; casi siempre en pacientes con enfermedades graves o fármacos hepatotóxicos [1].',
        'Colitis asociada a antibióticos: suspender si aparece [1].',
        'Cristaluria con dosis altas: mantener hidratación y diuresis [1].',
      ] },
    ] },
    { id: 'interacciones', titulo: 'Interacciones', bloques: [
      { tabla: { columnas: ['Fármaco', 'Efecto', 'Manejo'], filas: [
        ['Anticoagulantes orales', 'Puede alterar el INR', 'Ajustar la dosis si hace falta [1]'],
        ['Alopurinol', 'Más reacciones alérgicas cutáneas', 'Vigilar [1]'],
        ['Metotrexato', 'Menor excreción y más toxicidad', 'Vigilar [1]'],
        ['Micofenolato de mofetilo', 'Ácido micofenólico −50 % aproximadamente', 'Vigilar la respuesta [1]'],
      ] } },
    ] },
    { id: 'reacciones-adversas', titulo: 'Reacciones adversas', bloques: [
      'Las más notificadas son diarrea, náuseas y vómito; también es frecuente la candidiasis mucocutánea. Son posibles las reacciones alérgicas, la hepatitis colestásica y la colitis asociada a antibióticos [1].',
    ] },
    { id: 'embarazo-y-lactancia', titulo: 'Embarazo y lactancia', bloques: [
      'Debe evitarse en el embarazo salvo que el médico lo considere esencial, por un estudio que asoció su uso en rotura prematura de membranas con más enterocolitis necrosante neonatal. Ambos componentes pasan a la leche y pueden causar diarrea o candidiasis en el lactante [1].',
    ] },
    { id: 'evidencia', titulo: 'Evidencia: espectro y resistencia', bloques: [
      'El valor del clavulánico es inhibir betalactamasas: frente a bacterias cuya resistencia se debe a otros mecanismos, la combinación no aporta [1]. Por eso la ficha técnica pide tener en cuenta las recomendaciones oficiales de uso de antibacterianos y la sensibilidad esperada [1].',
    ] },
    { id: 'regulacion', titulo: 'Situación regulatoria', bloques: [
      'Colombia: 30 registros sanitarios vigentes con ácido clavulánico, en tabletas recubiertas y polvo para suspensión, con varias proporciones de amoxicilina y clavulánico [5]. En Estados Unidos se comercializa como Augmentin [2].',
    ] },
    { id: 'atencion-farmaceutica', titulo: 'Atención farmacéutica (modelo de Minnesota)', destacado: true, bloques: [
      { tabla: { columnas: ['Necesidad', 'Qué revisar'], filas: [
        ['Indicación', 'Infección bacteriana en las indicaciones aprobadas; si basta amoxicilina sola, el clavulánico es innecesario [1]'],
        ['Efectividad', 'Presentación y frecuencia adecuadas; toma al comienzo de las comidas [1]'],
        ['Seguridad', 'Alergia a betalactámicos, antecedente hepático, anticoagulantes, metotrexato, micofenolato [1]'],
        ['Adherencia', 'Completar el tratamiento; las molestias digestivas son los efectos más notificados [1]'],
      ] } },
      'Problemas típicos: confundir presentaciones con distinta proporción de clavulánico (seguridad), diarrea que lleva a suspender (adherencia) e INR inestable (seguridad). Cada problema se sigue según el modelo [6].',
    ] },
    { id: 'experiencia-farmacoterapeutica', titulo: 'Experiencia farmacoterapéutica', destacado: true, bloques: [
      'Conocer cómo vive el paciente su tratamiento ayuda a prevenir problemas [6,7]. Conviene explorar:',
      { lista: [
        'Si cree que «un antibiótico más fuerte» cura más rápido una gripa.',
        'Experiencias previas de diarrea con antibióticos y el temor a repetirlas.',
        'En padres y cuidadores, cómo miden la suspensión y si guardan sobrantes.',
      ] },
    ] },
  ],
  referencias: [F.ftAmoxiClav, F.dmAugmentin, F.pubchemAmoxicilina, F.pubchemClavulanico, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Amoxicilina con ácido clavulánico para qué sirve (para pacientes)', '/articulos/amoxicilina-con-acido-clavulanico-para-que-sirve'],
    ['Amoxicilina para qué sirve', '/articulos/amoxicilina-para-que-sirve'],
  ],
  seo: {
    titulo: 'Amoxicilina con ácido clavulánico: farmacología',
    descripcion: 'Amoxicilina con ácido clavulánico: farmacoquímica, mecanismo, farmacocinética, posología por presentación, hepatotoxicidad, interacciones y atención.',
  },
};
