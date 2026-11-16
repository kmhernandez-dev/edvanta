import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Nistatina oral. Verificada el 16-nov-2026: ficha técnica de CIMA (Mycostatin 100.000 UI/ml) y CUM del INVIMA (8 registros con ATC A07AA02, 5 con D01AA01 y 1 con G01AA01). */
export default crearMonografia({
  slug: 'nistatina',
  nombre: 'Nistatina',
  grupo: 'antimicoticos-antivirales-y-antiparasitarios',
  clase: 'Antifúngico poliénico de acción local',
  atc: 'A07AA02',
  vias: ['Oral'],
  mecanismo: 'Antifúngico obtenido de Streptomyces noursei que se une a los esteroles de la membrana del hongo; casi no se absorbe y actúa localmente en el tubo digestivo.',
  resumenCorto: 'antifúngico local para la candidiasis oral e intestinal: suspensión cada 6 a 12 horas, hasta 48 horas después de que desaparezcan los síntomas.',
  resumen: 'La nistatina es un antifúngico poliénico obtenido de Streptomyces noursei que se une a los esteroles de la membrana del hongo. Su absorción digestiva es mínima: actúa de forma local y se elimina casi toda inalterada por las heces. Su ficha técnica la indica en la candidiasis oral e intestinal, con dosis para recién nacidos, lactantes, niños y adultos. El tratamiento se mantiene al menos 48 horas después de que desaparezcan los síntomas y se reevalúa si no mejora en 14 días. La suspensión contiene 500 mg de sacarosa por mililitro y algo de alcohol, datos que importan en diabéticos, niños y personas con intolerancia a la fructosa. No sirve para infecciones fúngicas sistémicas.',
  datosClave: [
    ['Clase', 'Antifúngico poliénico [FT]'],
    ['Código ATC', 'A07AA02 [CUM]'],
    ['Candidiasis oral en adultos', '250.000 a 500.000 UI cada 6 a 12 horas [FT]'],
    ['Duración', 'Hasta 48 horas después de que cedan los síntomas [FT]'],
    ['Absorción', 'Mínima: acción local [FT]'],
    ['Colombia', '8 registros con A07AA02, 5 con D01AA01 y 1 con G01AA01 [CUM]'],
  ],
  quimica: ['Antifúngico poliénico obtenido de Streptomyces noursei; la presentación de referencia es una suspensión oral de 100.000 UI/ml que contiene 500 mg de sacarosa por ml y etanol [FT].'],
  dinamia: [
    'Tiene propiedades fungistáticas y fungicidas frente a levaduras y hongos relacionados; actúa uniéndose a los esteroles de la membrana celular del hongo [FT].',
    { claves: [
      { icono: 'Droplets', titulo: 'Acción local', texto: 'Casi no se absorbe en el intestino [FT].' },
      { icono: 'Target', titulo: 'Candida', texto: 'Candidiasis oral e intestinal [FT].' },
      { icono: 'Ban', titulo: 'No sistémica', texto: 'No sirve para infecciones fúngicas sistémicas [FT].' },
    ] },
  ],
  cinetica: ['La absorción gastrointestinal es mínima; la mayor parte de la dosis oral se elimina inalterada por las heces [FT].'],
  indicaciones: [L(['Candidiasis oral [FT].', 'Candidiasis intestinal [FT].'])],
  posologia: [
    T(['Paciente', 'Candidiasis oral', 'Candidiasis intestinal'], [
      ['Adultos', '250.000 a 500.000 UI (2,5 a 5 ml) cada 6 a 12 horas [FT]', '500.000 a 1.000.000 UI (5 a 10 ml) cada 6 horas [FT]'],
      ['Mayores de un año y adolescentes', '250.000 a 500.000 UI cada 6 a 12 horas [FT]', '250.000 a 750.000 UI cada 6 horas [FT]'],
      ['Lactantes de hasta un año', '250.000 UI (2,5 ml) cada 6 horas [FT]', '100.000 a 300.000 UI cada 6 horas [FT]'],
      ['Recién nacidos y bajo peso', '100.000 UI (1 ml) cada 6 horas [FT]', '—'],
    ]),
    { alerta: { tono: 'medio', titulo: 'Hasta cuándo', texto: 'Continuar al menos 48 horas después de que desaparezcan los síntomas para evitar recaídas; si empeora o persiste a los 14 días, reevaluar [FT].' } },
  ],
  contraindicaciones: [
    'Contraindicada solo en hipersensibilidad [FT].',
    { alerta: { tono: 'medio', titulo: 'Excipientes', texto: 'Contiene 500 mg de sacarosa por ml (atención en diabetes) y no debe usarse en intolerancia hereditaria a la fructosa, malabsorción de glucosa o galactosa o déficit de sacarasa-isomaltasa. También contiene etanol [FT].' } },
  ],
  interacciones: ['No se deben usar después modificadores del tránsito intestinal ni medicamentos que aíslen la mucosa, porque reducen su contacto y su efecto [FT].'],
  adversas: ['En general leves y transitorias. Poco frecuentes: náuseas, vómitos, malestar gastrointestinal y diarrea, sobre todo con dosis altas [FT].'],
  embarazo: [L(['Embarazo: datos limitados; como precaución es preferible evitarla [FT].', 'Lactancia: no se desaconseja por su mínima absorción, pero no se excluye riesgo en el recién nacido; decidir con el médico [FT].'])],
  evidencia: [
    'Su acción local la hace segura para la candidiasis oral de lactantes y adultos, siempre que el diagnóstico sea correcto; la ficha técnica recomienda confirmar con frotis o cultivo [FT].',
    { triangulo: {
      titulo: 'Nistatina que funciona',
      centro: 'Contacto con la mucosa',
      vertices: [
        { titulo: 'Frecuencia', icono: 'Clock', texto: 'Cada 6 a 12 horas según el caso [FT].' },
        { titulo: 'Duración', icono: 'CalendarClock', texto: '48 horas más tras la mejoría [FT].' },
        { titulo: 'Sin interferencias', icono: 'Ban', texto: 'Nada que aísle la mucosa después [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 8 registros sanitarios vigentes con el código ATC A07AA02 (oral), 5 con D01AA01 (cutáneo) y 1 con G01AA01 (ginecológico); consulta del 16-nov-2026 [CUM].', 'España: autorizada como Mycostatin 100.000 UI/ml suspensión oral [FT].'])],
  atencion: {
    intro: 'Con la nistatina para el «algodoncillo» del bebé, el éxito depende de la técnica: dosis exacta, frecuencia y no suspender apenas mejora [FT,MN].',
    necesidades: [
      ['Indicación', 'Candidiasis oral o intestinal [FT]'],
      ['Efectividad', 'Desaparición de las placas [FT]'],
      ['Seguridad', 'Sacarosa en diabéticos, intolerancias [FT]'],
      ['Adherencia', 'Dosis cada 6 horas en lactantes [FT]'],
    ],
    prf: [
      ['Adherencia', 'La suspendió cuando desaparecieron las placas', 'Continuar 48 horas más [FT]'],
      ['Seguridad', 'Adulto diabético con uso prolongado', 'Considerar la sacarosa [FT]'],
      ['Efectividad', 'Sin mejoría a los 14 días', 'Remitir [FT]'],
    ],
    plan: ['Enseñar a medir la dosis en mililitros [FT].', 'Explicar la duración [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Las placas blancas en la boca del bebé asustan a las familias. Una explicación clara de qué son y cómo se tratan calma y mejora la adherencia [EX].',
    preguntas: ['¿Cuántos meses tiene el bebé?', '¿Cada cuánto le está dando la nistatina?', '¿La mamá tiene molestias al amamantar?'],
    quiz: {
      pregunta: '¿Hasta cuándo se continúa la nistatina en la candidiasis oral según su ficha técnica?',
      opciones: [
        { texto: 'Al menos 48 horas después de que desaparezcan los síntomas', correcta: true, retro: 'Así se evita la recidiva [FT].' },
        { texto: 'Solo mientras haya placas visibles', correcta: false, retro: 'Suspender al mejorar favorece la recaída [FT].' },
        { texto: 'Una dosis única', correcta: false, retro: 'Se usa en dosis repetidas [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.gastro, GUIAS.problemas],
  refs: { FT: F.ftNistatina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Fluconazol: farmacología', '/vademecum/fluconazol'], ['Antimicóticos, antivirales y antiparasitarios', '/vademecum/antimicoticos-antivirales-y-antiparasitarios']],
  seo: {
    titulo: 'Nistatina oral: dosis en bebés y adultos',
    descripcion: 'Nistatina: antifúngico local para candidiasis oral e intestinal, dosis por edad, duración, sacarosa en la suspensión y atención farmacéutica.',
  },
});
