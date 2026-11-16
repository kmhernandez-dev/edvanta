import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Sertralina. Verificada el 16-nov-2026: ficha técnica de CIMA (Besitran 50 mg) y CUM del INVIMA (33 registros vigentes con ATC N06AB06). */
export default crearMonografia({
  slug: 'sertralina',
  nombre: 'Sertralina',
  grupo: 'salud-mental-y-sistema-nervioso',
  clase: 'Antidepresivo inhibidor selectivo de la recaptación de serotonina (ISRS)',
  atc: 'N06AB06',
  vias: ['Oral'],
  mecanismo: 'Inhibidor potente y selectivo de la recaptación neuronal de serotonina, con efecto muy leve sobre la noradrenalina y la dopamina.',
  resumenCorto: 'ISRS para depresión, angustia, TOC, ansiedad social y estrés postraumático: empieza en 25 a 50 mg, sube cada semana hasta 200 mg y se retira de forma gradual.',
  resumen: 'La sertralina es uno de los antidepresivos más usados. Es un inhibidor selectivo de la recaptación de serotonina indicado en episodios depresivos mayores y su prevención, trastorno de angustia, trastorno obsesivo-compulsivo (también de 6 a 17 años), ansiedad social y estrés postraumático. Se inicia con 50 mg al día en depresión y TOC, o con 25 mg en angustia, ansiedad social y estrés postraumático para reducir la ansiedad inicial, y se ajusta en pasos de 50 mg cada semana como mínimo, hasta 200 mg. Su semivida de 24 horas permite una toma diaria. El farmacéutico vigila tres riesgos: el síndrome serotoninérgico con otros serotoninérgicos, el sangrado con AINE o anticoagulantes, y los síntomas de retirada si se suspende de golpe.',
  datosClave: [
    ['Clase', 'ISRS [FT]'],
    ['Código ATC', 'N06AB06 [CUM]'],
    ['Dosis de inicio', '50 mg (depresión, TOC) o 25 mg (angustia, ansiedad social, TEPT) [FT]'],
    ['Dosis máxima', '200 mg al día [FT]'],
    ['Semivida', '24 horas [FT]'],
    ['Colombia', '33 registros vigentes con el código ATC N06AB06 [CUM]'],
  ],
  quimica: ['La presentación de referencia son comprimidos recubiertos de 50 mg y 100 mg, y un concentrado oral de 20 mg/ml [FT].', 'Se une en un 98 % a las proteínas plasmáticas [FT].'],
  dinamia: [
    'Inhibe de forma potente y selectiva la recaptación neuronal de serotonina; su efecto sobre la recaptación de noradrenalina y dopamina es muy leve [FT].',
    { mapa: {
      centro: 'Sertralina',
      ramas: [
        { titulo: 'Depresión', icono: 'Brain', nodos: ['Episodio mayor', 'Prevención de recaídas'] },
        { titulo: 'Ansiedad', icono: 'Waves', nodos: ['Angustia', 'Ansiedad social', 'TEPT'] },
        { titulo: 'TOC', icono: 'Repeat', nodos: ['Adultos', '6 a 17 años'] },
        { titulo: 'Riesgos', icono: 'AlertTriangle', nodos: ['Síndrome serotoninérgico', 'Sangrado', 'Hiponatremia'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Concentración máxima', '4,5 a 8,4 horas [FT]'],
    ['Alimentos', 'No modifican la biodisponibilidad [FT]'],
    ['Unión a proteínas', 'Cerca del 98 % [FT]'],
    ['Semivida', '24 horas: los cambios de dosis se hacen cada semana o más [FT]'],
  ])],
  indicaciones: [L(['Episodios depresivos mayores y prevención de su reaparición [FT].', 'Trastorno de angustia, con o sin agorafobia [FT].', 'Trastorno obsesivo-compulsivo en adultos y de 6 a 17 años [FT].', 'Trastorno de ansiedad social [FT].', 'Trastorno por estrés postraumático [FT].'])],
  posologia: [
    T(['Indicación', 'Inicio', 'Ajuste'], [
      ['Depresión y TOC', '50 mg al día [FT]', 'Pasos de 50 mg, cada semana como mínimo, hasta 200 mg [FT]'],
      ['Angustia, ansiedad social y TEPT', '25 mg al día; a la semana, 50 mg [FT]', 'Igual, hasta 200 mg [FT]'],
    ]),
    { barras: {
      titulo: 'De la dosis de inicio a la máxima (mg al día)',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Dosis máxima', valor: 200 },
        { etiqueta: 'Inicio en depresión y TOC', valor: 50 },
        { etiqueta: 'Inicio en angustia, ansiedad social y TEPT', valor: 25 },
      ],
      nota: 'Ficha técnica [FT]. El inicio con 25 mg reduce los efectos adversos iniciales en el trastorno de angustia.',
    } },
    { alerta: { tono: 'medio', titulo: 'Retirada gradual', texto: 'Se evita la interrupción brusca: la dosis se reduce durante al menos una a dos semanas. Los síntomas de retirada más frecuentes son mareo, alteraciones sensoriales y del sueño [FT].' } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad y con IMAO irreversibles: no iniciarla hasta 14 días después de suspender un IMAO irreversible, y suspenderla al menos 7 días antes de iniciar uno [FT].',
    { alerta: { tono: 'alto', titulo: 'Síndrome serotoninérgico', texto: 'El riesgo aumenta con otros antidepresivos serotoninérgicos, anfetaminas, triptanes, IMAO como el azul de metileno, antipsicóticos y opioides [FT].' } },
    { alerta: { tono: 'alto', titulo: 'Sangrado', texto: 'Los ISRS se asocian con hemorragias cutáneas, digestivas y ginecológicas, y con más riesgo de hemorragia posparto [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Personas mayores', texto: 'Mayor riesgo de hiponatremia [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['IMAO irreversibles (selegilina)', 'Síndrome serotoninérgico', 'Contraindicado [FT]'],
    ['Moclobemida y otros serotoninérgicos', 'Síndrome serotoninérgico', 'Evitar o vigilar de cerca [FT]'],
    ['Triptanes, opioides, anfetaminas', 'Más riesgo serotoninérgico', 'Vigilar signos [FT]'],
    ['AINE, anticoagulantes, antiagregantes', 'Más riesgo de sangrado', 'Vigilar [FT]'],
  ])],
  adversas: [
    'Las náuseas son la reacción adversa más frecuente. En la ansiedad social, la insuficiencia eyaculatoria apareció en el 14 % de los hombres con sertralina frente al 0 % con placebo. Muchas reacciones dependen de la dosis y son transitorias [FT].',
  ],
  embarazo: [L(['Embarazo: no hay estudios bien controlados; una cantidad importante de datos no mostró malformaciones atribuibles a la sertralina [FT].', 'Los ISRS pueden aumentar el riesgo de hemorragia posparto [FT].'])],
  evidencia: [
    'Su ficha técnica respalda un abanico amplio de trastornos depresivos y de ansiedad, con inicio a dosis bajas en los trastornos de ansiedad para mejorar la tolerancia [FT].',
    { triangulo: {
      titulo: 'Los tres momentos de riesgo con un ISRS',
      centro: 'Sertralina segura',
      vertices: [
        { titulo: 'Al iniciar', icono: 'Sprout', texto: 'Ansiedad y náuseas iniciales: empezar bajo [FT].' },
        { titulo: 'Al combinar', icono: 'Shuffle', texto: 'Serotoninérgicos, AINE y anticoagulantes [FT].' },
        { titulo: 'Al suspender', icono: 'Hourglass', texto: 'Bajar en una a dos semanas como mínimo [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 33 registros sanitarios vigentes con el código ATC N06AB06; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Besitran 50 mg y 100 mg comprimidos y 20 mg/ml concentrado oral [FT].'])],
  atencion: {
    intro: 'Las primeras semanas deciden la adherencia: los efectos adversos llegan antes que el beneficio. Explicarlo es la intervención farmacéutica más rentable con la sertralina [FT,MN].',
    necesidades: [
      ['Indicación', 'Depresión o trastorno de ansiedad diagnosticado [FT]'],
      ['Efectividad', 'Mejoría progresiva en semanas [FT]'],
      ['Seguridad', 'Serotoninérgicos, sangrado, sodio en mayores [FT]'],
      ['Adherencia', 'Toma diaria y retirada solo con el médico [FT]'],
    ],
    prf: [
      ['Interacción', 'Sertralina con tramadol o un triptán', 'Vigilar signos serotoninérgicos y avisar al médico [FT]'],
      ['Seguridad', 'Adulto mayor con confusión y sodio bajo', 'Remitir [FT]'],
      ['Adherencia', 'La suspendió de golpe por sentirse bien', 'Explicar la retirada gradual [FT]'],
    ],
    plan: ['Explicar qué esperar en las primeras semanas [FT].', 'Revisar AINE y anticoagulantes [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'El estigma de «tomar pastillas para los nervios» pesa. Una conversación sin juicios sobre lo que siente el paciente con el tratamiento sostiene la adherencia más que cualquier recordatorio [EX].',
    preguntas: ['¿Cómo se ha sentido desde que empezó?', '¿Toma algo para el dolor o la migraña?', '¿Ha pensado en dejarla? ¿Por qué?'],
    quiz: {
      pregunta: '¿Por qué la sertralina se inicia con 25 mg en el trastorno de angustia?',
      opciones: [
        { texto: 'Porque reduce los efectos adversos iniciales propios del trastorno', correcta: true, retro: 'La ficha técnica lo explica así [FT].' },
        { texto: 'Porque 25 mg es la dosis eficaz definitiva', correcta: false, retro: 'A la semana se sube a 50 mg [FT].' },
        { texto: 'Porque el hígado no tolera 50 mg', correcta: false, retro: 'No es la razón que da la ficha técnica [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.psico, GUIAS.entrevista],
  refs: { FT: F.ftSertralina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Sertralina: para qué sirve', '/articulos/sertralina-para-que-sirve'], ['Fluoxetina: farmacología', '/vademecum/fluoxetina'], ['Salud mental y sistema nervioso', '/vademecum/salud-mental-y-sistema-nervioso']],
  seo: {
    titulo: 'Sertralina: dosis, riesgos y atención farmacéutica',
    descripcion: 'Sertralina: mecanismo ISRS, indicaciones, dosis de inicio y máxima, síndrome serotoninérgico, sangrado, retirada gradual y atención farmacéutica.',
  },
});
