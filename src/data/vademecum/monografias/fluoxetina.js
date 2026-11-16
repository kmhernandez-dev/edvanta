import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Fluoxetina. Verificada el 16-nov-2026: ficha técnica de CIMA (Fluoxetina Cinfa 20 mg cápsulas) y CUM del INVIMA (16 registros vigentes con ATC N06AB03). */
export default crearMonografia({
  slug: 'fluoxetina',
  nombre: 'Fluoxetina',
  grupo: 'salud-mental-y-sistema-nervioso',
  clase: 'Antidepresivo inhibidor selectivo de la recaptación de serotonina (ISRS)',
  atc: 'N06AB03',
  vias: ['Oral'],
  mecanismo: 'Inhibidor selectivo de la recaptación de serotonina, prácticamente sin afinidad por receptores adrenérgicos, serotoninérgicos o dopaminérgicos.',
  resumenCorto: 'ISRS de semivida muy larga: 20 mg al día en depresión, hasta 60 mg; sigue en el cuerpo 5 a 6 semanas después de suspenderla, lo que importa al cambiar de antidepresivo.',
  resumen: 'La fluoxetina es el ISRS de semivida más larga: 4 a 6 días la fluoxetina y 4 a 16 días su metabolito activo, la norfluoxetina, de modo que permanece en el organismo 5 a 6 semanas después de suspenderla. Esto tiene ventajas (menos síntomas de retirada) y riesgos (interacciones que duran semanas al cambiar a otro antidepresivo). Su ficha técnica la indica en el episodio depresivo mayor, el trastorno obsesivo-compulsivo y la bulimia nerviosa en adultos, y en la depresión moderada a grave desde los 8 años cuando la psicoterapia sola no basta. Se contraindica con IMAO irreversibles y con metoprolol en la insuficiencia cardiaca.',
  datosClave: [
    ['Clase', 'ISRS [FT]'],
    ['Código ATC', 'N06AB03 [CUM]'],
    ['Dosis en depresión', '20 mg al día; máximo 60 mg [FT]'],
    ['Semivida', '4 a 6 días; norfluoxetina 4 a 16 días [FT]'],
    ['Permanencia', '5 a 6 semanas tras suspenderla [FT]'],
    ['Colombia', '16 registros vigentes con el código ATC N06AB03 [CUM]'],
  ],
  quimica: ['La presentación de referencia son cápsulas duras de 20 mg [FT].', 'Su metabolito activo, la norfluoxetina, prolonga su efecto [FT].'],
  dinamia: [
    'Inhibe de forma selectiva la recaptación de serotonina y prácticamente no tiene afinidad por receptores alfa y beta adrenérgicos, serotoninérgicos ni dopaminérgicos [FT].',
    { barras: {
      titulo: 'Semivida máxima de eliminación (días)',
      unidad: ['día', 'días'],
      datos: [
        { etiqueta: 'Norfluoxetina (metabolito activo)', valor: 16 },
        { etiqueta: 'Fluoxetina', valor: 6 },
      ],
      nota: 'Ficha técnica [FT]. Por eso el fármaco permanece 5 a 6 semanas tras suspenderlo.',
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción', 'Buena; los alimentos no la afectan [FT]'],
    ['Unión a proteínas', 'Cerca del 95 % [FT]'],
    ['Semivida', '4 a 6 días (fluoxetina) y 4 a 16 días (norfluoxetina) [FT]'],
    ['Eliminación', 'Cerca del 60 % renal [FT]'],
  ])],
  indicaciones: [L(['Adultos: episodio depresivo mayor, trastorno obsesivo-compulsivo y bulimia nerviosa como complemento de la psicoterapia [FT].', 'Desde 8 años: depresión moderada a grave sin respuesta a 4 a 6 sesiones de terapia psicológica, siempre junto con ella [FT].'])],
  posologia: [
    T(['Indicación', 'Dosis en adultos'], [
      ['Depresión', '20 mg al día; revisar a las 3 a 4 semanas; máximo 60 mg [FT]'],
      ['Trastorno obsesivo-compulsivo', '20 mg al día; si no responde en 2 semanas, subir hasta 60 mg [FT]'],
      ['Duración en depresión', 'Al menos 6 meses para asegurar la remisión [FT]'],
    ]),
    { ciclo: {
      titulo: 'Cambiar de fluoxetina a otro antidepresivo',
      centro: 'Semanas, no días',
      pasos: [
        { titulo: 'Suspender', icono: 'Ban', texto: 'La fluoxetina sigue actuando tras la última dosis [FT].' },
        { titulo: 'Esperar', icono: 'Hourglass', texto: 'Permanece 5 a 6 semanas en el organismo [FT].' },
        { titulo: 'Vigilar', icono: 'Eye', texto: 'Las interacciones persisten durante ese tiempo [FT].' },
        { titulo: 'Iniciar', icono: 'Sprout', texto: 'El nuevo fármaco, según el médico [FT].' },
      ],
    } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad, con IMAO irreversibles no selectivos (como la iproniazida) y con metoprolol cuando se usa en la insuficiencia cardiaca [FT].',
    { alerta: { tono: 'alto', titulo: 'Niños y adolescentes', texto: 'En los ensayos con antidepresivos se observaron más conductas suicidas y hostilidad que con placebo. De 8 a 18 años solo se usa en depresión moderada a grave y con supervisión estrecha [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['IMAO irreversibles no selectivos', 'Reacciones graves, a veces mortales', 'Contraindicado [FT]'],
    ['Metoprolol en insuficiencia cardiaca', 'Interacción contraindicada', 'No combinar [FT]'],
    ['Tamoxifeno', 'Interacción descrita en la ficha técnica', 'Consultar al oncólogo [FT]'],
    ['Cualquier fármaco al cambiar de antidepresivo', 'La interacción puede durar semanas', 'Considerar la semivida larga [FT]'],
  ])],
  adversas: ['Las más frecuentes son cefalea, náuseas, insomnio, fatiga y diarrea; suelen disminuir con el tratamiento continuado. Puede producir sedación o mareo [FT].'],
  embarazo: [L(['Embarazo: algunos estudios sugieren más riesgo de defectos cardiovasculares con la exposición en el primer trimestre [FT].'])],
  evidencia: [
    'Su larga semivida explica la ventaja clínica de menos síntomas de retirada y la desventaja de interacciones prolongadas [FT].',
    { triangulo: {
      titulo: 'La semivida larga, en tres consecuencias',
      centro: 'Fluoxetina',
      vertices: [
        { titulo: 'Retirada suave', icono: 'Leaf', texto: 'Persiste semanas tras la última dosis [FT].' },
        { titulo: 'Interacciones largas', icono: 'Shuffle', texto: 'Cuentan al cambiar de antidepresivo [FT].' },
        { titulo: 'Ajuste lento', icono: 'CalendarClock', texto: 'Revisar la dosis a las 3 a 4 semanas [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 16 registros sanitarios vigentes con el código ATC N06AB03; consulta del 16-nov-2026 [CUM].', 'España: autorizada, entre otras, como Fluoxetina Cinfa 20 mg cápsulas duras [FT].'])],
  atencion: {
    intro: 'Con la fluoxetina, el farmacéutico piensa en semanas: lo que se combine hoy puede interactuar con la fluoxetina que el paciente dejó hace un mes [FT,MN].',
    necesidades: [
      ['Indicación', 'Depresión, TOC o bulimia [FT]'],
      ['Efectividad', 'Revisión a las 3 a 4 semanas [FT]'],
      ['Seguridad', 'Ideación suicida en jóvenes, interacciones [FT]'],
      ['Adherencia', 'Al menos 6 meses en depresión [FT]'],
    ],
    prf: [
      ['Interacción', 'Inicia otro antidepresivo una semana después de dejar la fluoxetina', 'Avisar al médico por la semivida [FT]'],
      ['Interacción', 'Paciente con tamoxifeno', 'Consultar al oncólogo [FT]'],
      ['Seguridad', 'Adolescente con más irritabilidad o ideas de muerte', 'Remitir de inmediato [FT]'],
    ],
    plan: ['Registrar la fecha de la última dosis si se suspende [FT].', 'Acordar la revisión de la 3.ª a la 4.ª semana [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Algunas personas sienten que «no les hace nada» en las primeras semanas y la abandonan. Anticipar ese tiempo protege el tratamiento [EX].',
    preguntas: ['¿Cuánto tiempo lleva tomándola?', '¿Ha tomado otros antidepresivos antes?', '¿Cómo duerme?'],
    quiz: {
      pregunta: '¿Cuánto tiempo puede permanecer la fluoxetina en el organismo después de suspenderla?',
      opciones: [
        { texto: '5 a 6 semanas', correcta: true, retro: 'Por la semivida larga de la fluoxetina y la norfluoxetina [FT].' },
        { texto: '24 horas', correcta: false, retro: 'Esa es la semivida de la sertralina, no la permanencia de la fluoxetina [FT].' },
        { texto: '3 días', correcta: false, retro: 'Solo la fluoxetina ya tiene una semivida de 4 a 6 días [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.psico, GUIAS.farmacocinetica],
  refs: { FT: F.ftFluoxetina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Sertralina: farmacología', '/vademecum/sertralina'], ['Salud mental y sistema nervioso', '/vademecum/salud-mental-y-sistema-nervioso']],
  seo: {
    titulo: 'Fluoxetina: dosis, semivida y atención farmacéutica',
    descripcion: 'Fluoxetina: mecanismo ISRS, dosis en depresión, TOC y bulimia, semivida larga, cambio de antidepresivo, interacciones y atención farmacéutica.',
  },
});
