import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Amitriptilina. Verificada el 16-nov-2026: ficha técnica de CIMA (Tryptizol 25 mg) y CUM del INVIMA (7 registros vigentes con ATC N06AA09). */
export default crearMonografia({
  slug: 'amitriptilina',
  nombre: 'Amitriptilina',
  grupo: 'salud-mental-y-sistema-nervioso',
  clase: 'Antidepresivo tricíclico',
  atc: 'N06AA09',
  vias: ['Oral'],
  mecanismo: 'Antidepresivo tricíclico y analgésico: impide la recaptación de noradrenalina y serotonina, con marcadas propiedades anticolinérgicas y sedantes.',
  resumenCorto: 'tricíclico para depresión, dolor neuropático y prevención de migraña y cefalea tensional; a dosis bajas por la noche, con riesgo cardiaco y anticolinérgico.',
  resumen: 'La amitriptilina es un antidepresivo tricíclico que hoy se usa sobre todo a dosis bajas como analgésico: su ficha técnica la indica en el trastorno depresivo mayor, el dolor neuropático, la prevención de la cefalea tensional crónica y de la migraña en adultos, y la enuresis nocturna en niños desde 6 años cuando otras medidas fallaron. En el dolor se empieza con 10 a 25 mg por la noche y el efecto analgésico aparece en 2 a 4 semanas. Su perfil exige respeto: es sedante y anticolinérgica, prolonga el QT, está contraindicada tras un infarto reciente o con trastornos del ritmo, y en sobredosis causa arritmias graves.',
  datosClave: [
    ['Clase', 'Antidepresivo tricíclico [FT]'],
    ['Código ATC', 'N06AA09 [CUM]'],
    ['Dolor neuropático y migraña', '10 a 25 mg por la noche al inicio; habitual 25 a 75 mg [FT]'],
    ['Efecto analgésico', 'En 2 a 4 semanas [FT]'],
    ['Semivida', 'Unas 25 horas [FT]'],
    ['Colombia', '7 registros vigentes con el código ATC N06AA09 [CUM]'],
  ],
  quimica: ['Antidepresivo tricíclico; la presentación de referencia son comprimidos recubiertos de 10, 25, 50 y 75 mg [FT].'],
  dinamia: [
    'Evita la recaptación, y por tanto la inactivación, de la noradrenalina y la serotonina. Tiene marcadas propiedades anticolinérgicas y sedantes [FT].',
    { mapa: {
      centro: 'Amitriptilina',
      ramas: [
        { titulo: 'Ánimo', icono: 'Brain', nodos: ['Depresión mayor'] },
        { titulo: 'Dolor', icono: 'Zap', nodos: ['Neuropático', 'Migraña', 'Cefalea tensional'] },
        { titulo: 'Niños', icono: 'Moon', nodos: ['Enuresis nocturna'] },
        { titulo: 'Riesgos', icono: 'HeartPulse', nodos: ['QT', 'Arritmias', 'Anticolinérgico'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Concentración máxima', 'Unas 4 horas [FT]'],
    ['Biodisponibilidad oral', 'Cerca del 53 % [FT]'],
    ['Semivida', 'Unas 25 horas (16 a 40) [FT]'],
    ['Personas mayores', 'Semividas más largas por metabolismo más lento [FT]'],
  ])],
  indicaciones: [L(['Trastorno depresivo mayor en adultos [FT].', 'Dolor neuropático en adultos [FT].', 'Prevención de la cefalea tensional crónica y de la migraña en adultos [FT].', 'Enuresis nocturna en niños desde 6 años, descartada la causa orgánica y sin respuesta a otros tratamientos [FT].'])],
  posologia: [
    T(['Indicación', 'Inicio', 'Habitual y máximo'], [
      ['Depresión, adultos', '25 mg dos veces al día [FT]', 'Subir 25 mg en días alternos hasta 150 mg al día [FT]'],
      ['Depresión, mayores de 65 o con cardiopatía', '10 a 25 mg al día [FT]', 'Hasta 100 a 150 mg según respuesta [FT]'],
      ['Dolor neuropático, migraña, cefalea tensional', '10 a 25 mg por la noche [FT]', '25 a 75 mg; más de 100 mg con precaución [FT]'],
    ]),
    { barras: {
      titulo: 'Dosis diaria habitual según el uso (valor máximo)',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Depresión', valor: 150 },
        { etiqueta: 'Dolor neuropático y profilaxis de cefaleas', valor: 75 },
        { etiqueta: 'Inicio en dolor (por la noche)', valor: 25 },
      ],
      nota: 'Ficha técnica [FT]. No se recomienda una dosis única de más de 75 mg en el dolor.',
    } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad, infarto de miocardio reciente, cualquier bloqueo cardiaco o trastorno del ritmo, insuficiencia coronaria y uso de IMAO [FT].',
    { alerta: { tono: 'alto', titulo: 'Corazón', texto: 'Prolonga el QT; con dosis altas puede causar arritmias e hipotensión grave. En la enuresis se hace un ECG antes de iniciar [FT].' } },
    { alerta: { tono: 'alto', titulo: 'Sobredosis', texto: 'Causa taquiarritmias ventriculares, torsade de pointes y ensanchamiento del QRS: es una intoxicación grave [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['IMAO (selegilina, moclobemida)', 'Síndrome serotoninérgico', 'Contraindicado [FT]'],
    ['Adrenalina, efedrina, fenilefrina (descongestionantes, anestésicos)', 'Más efecto cardiovascular', 'No recomendado [FT]'],
    ['Fármacos que prolongan el QT', 'Arritmias', 'Precaución [FT]'],
    ['Buprenorfina y otros serotoninérgicos', 'Síndrome serotoninérgico', 'Vigilar [FT]'],
  ])],
  adversas: ['Es sedante. Algunos efectos como cefalea, temblor, alteraciones de la atención, estreñimiento y disminución de la libido pueden ser también síntomas de la depresión y suelen ceder al mejorar [FT].'],
  embarazo: [L(['Embarazo: no se recomienda salvo que sea claramente necesario [FT].'])],
  evidencia: [
    'Su ficha técnica respalda el uso analgésico a dosis más bajas que las antidepresivas, con el principio de la dosis eficaz más baja por el menor tiempo [FT].',
    { triangulo: {
      titulo: 'Amitriptilina para el dolor, sin sustos',
      centro: 'Dosis baja nocturna',
      vertices: [
        { titulo: 'Empezar bajo', icono: 'Sprout', texto: '10 a 25 mg por la noche [FT].' },
        { titulo: 'Esperar', icono: 'Hourglass', texto: 'El efecto llega en 2 a 4 semanas [FT].' },
        { titulo: 'Proteger el corazón', icono: 'HeartPulse', texto: 'Sin arritmias ni infarto reciente [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 7 registros sanitarios vigentes con el código ATC N06AA09; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Tryptizol comprimidos recubiertos [FT].'])],
  atencion: {
    intro: 'La mayoría de pacientes con amitriptilina no tienen depresión sino dolor. Explicar por qué toman «un antidepresivo» evita abandonos por desconfianza [FT,MN].',
    necesidades: [
      ['Indicación', 'Dolor neuropático, cefalea o depresión [FT]'],
      ['Efectividad', 'Menos dolor en 2 a 4 semanas [FT]'],
      ['Seguridad', 'Corazón, caídas, anticolinérgicos [FT]'],
      ['Adherencia', 'Toma nocturna constante [FT]'],
    ],
    prf: [
      ['Seguridad', 'Adulto mayor con mareo al levantarse', 'Revisar la dosis con el médico [FT]'],
      ['Interacción', 'Usa descongestionantes con fenilefrina', 'Evitar la combinación [FT]'],
      ['Adherencia', 'La dejó a los 5 días por «no servir»', 'Explicar el tiempo de efecto [FT]'],
    ],
    plan: ['Explicar el uso analgésico [FT].', 'Advertir sobre la sedación y la conducción [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Que le receten un antidepresivo para el dolor puede sentirse como «me dicen que el dolor está en mi cabeza». Validar el dolor es parte de la consejería [EX].',
    preguntas: ['¿Le explicaron para qué es?', '¿Cómo se siente por la mañana?', '¿Usa gotas o pastillas para la congestión?'],
    quiz: {
      pregunta: '¿Cuánto tarda en aparecer el efecto analgésico de la amitriptilina según su ficha técnica?',
      opciones: [
        { texto: '2 a 4 semanas', correcta: true, retro: 'Por eso no se abandona en los primeros días [FT].' },
        { texto: '30 minutos', correcta: false, retro: 'No es un analgésico de acción inmediata [FT].' },
        { texto: '6 meses', correcta: false, retro: 'La ficha técnica indica 2 a 4 semanas [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.snc, GUIAS.seguridad],
  refs: { FT: F.ftAmitriptilina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Pregabalina: farmacología', '/vademecum/pregabalina'], ['Gabapentina: farmacología', '/vademecum/gabapentina'], ['Salud mental y sistema nervioso', '/vademecum/salud-mental-y-sistema-nervioso']],
  seo: {
    titulo: 'Amitriptilina: dosis para dolor, migraña y depresión',
    descripcion: 'Amitriptilina: tricíclico para depresión, dolor neuropático, migraña y cefalea tensional; dosis nocturna, riesgo cardiaco y atención farmacéutica.',
  },
});
