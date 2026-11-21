import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { GUIAS } from '../lib/ofertas.js';

/** Fluconazol. Verificado el 16-nov-2026: ficha técnica de CIMA (Diflucan 150 mg) y CUM del INVIMA (39 registros vigentes con ATC J02AC01). */
export default crearMonografia({
  slug: 'fluconazol',
  nombre: 'Fluconazol',
  grupo: 'antimicoticos-antivirales-y-antiparasitarios',
  clase: 'Antifúngico triazólico sistémico',
  atc: 'J02AC01',
  vias: ['Oral'],
  mecanismo: 'Inhibe la desmetilación del 14-alfa-lanosterol mediada por el citocromo P450 del hongo, paso clave en la síntesis del ergosterol de su membrana.',
  resumenCorto: 'antifúngico oral: 150 mg en dosis única para la candidiasis vaginal aguda; semivida de 30 horas, ajuste renal en dosis múltiples y muchas interacciones por CYP.',
  resumen: 'El fluconazol es un antifúngico triazólico que bloquea la síntesis del ergosterol del hongo. Por vía oral se absorbe más del 90 % y tiene una semivida de unas 30 horas, lo que permite tratar la candidiasis vaginal aguda con una sola cápsula de 150 mg. Su ficha técnica abarca desde infecciones graves, como la meningitis criptocócica y la candidiasis invasiva, hasta candidiasis de mucosas, balanitis, candidiasis vaginal recurrente y dermatomicosis. Se elimina por el riñón (80 % sin cambios), por lo que en dosis múltiples se ajusta según el aclaramiento de creatinina. Sus interacciones son el punto crítico: está contraindicado con fármacos que prolongan el QT metabolizados por el CYP3A4 y potencia anticoagulantes.',
  datosClave: [
    ['Clase', 'Antifúngico triazólico [FT]'],
    ['Código ATC', 'J02AC01 [CUM]'],
    ['Candidiasis vaginal aguda', '150 mg en dosis única [FT]'],
    ['Biodisponibilidad oral', 'Más del 90 % [FT]'],
    ['Semivida', 'Unas 30 horas [FT]'],
    ['Colombia', '39 registros vigentes con el código ATC J02AC01 [CUM]'],
  ],
  quimica: ['Antifúngico triazólico; la presentación de referencia son cápsulas duras de 150 mg [FT].'],
  dinamia: [
    'Inhibe la desmetilación del 14-alfa-lanosterol mediada por el citocromo P450 del hongo, etapa fundamental de la síntesis del ergosterol [FT].',
    { mapa: {
      centro: 'Fluconazol',
      ramas: [
        { titulo: 'Mucosas', icono: 'Droplets', nodos: ['Vaginal', 'Orofaríngea', 'Esofágica'] },
        { titulo: 'Graves', icono: 'Siren', nodos: ['Meningitis criptocócica', 'Candidiasis invasiva'] },
        { titulo: 'Piel', icono: 'Layers', nodos: ['Tinea pedis', 'Tinea corporis'] },
        { titulo: 'Interacciones', icono: 'Shuffle', nodos: ['CYP3A4', 'Anticoagulantes', 'QT'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Biodisponibilidad oral', 'Más del 90 %; los alimentos no la afectan [FT]'],
    ['Concentración máxima', '0,5 a 1,5 horas en ayunas [FT]'],
    ['Semivida', 'Unas 30 horas [FT]'],
    ['Eliminación', 'Renal: 80 % sin modificar [FT]'],
  ])],
  indicaciones: [L(['Meningitis criptocócica, coccidioidomicosis y candidiasis invasiva en adultos [FT].', 'Candidiasis de mucosas: orofaríngea, esofágica, candiduria y mucocutánea crónica [FT].', 'Candidiasis vaginal aguda o recurrente cuando la terapia local no es apropiada, y balanitis por Candida [FT].', 'Dermatomicosis, como tinea pedis y tinea corporis [FT].'])],
  posologia: [
    T(['Indicación', 'Dosis en adultos'], [
      ['Candidiasis vaginal aguda o balanitis', '150 mg en dosis única [FT]'],
      ['Candidiasis vaginal recurrente (4 o más al año)', '150 mg los días 1, 4 y 7; luego 150 mg semanales por 6 meses [FT]'],
      ['Meningitis criptocócica', '400 mg el primer día; luego 200 a 400 mg al día, 6 a 8 semanas [FT]'],
    ]),
    T(['Aclaramiento de creatinina', 'Dosis en tratamientos de dosis múltiples'], [
      ['Más de 50 ml/min', '100 % [FT]'],
      ['50 ml/min o menos, sin hemodiálisis', '50 % [FT]'],
      ['Hemodiálisis', '100 % después de cada sesión [FT]'],
    ]),
    'En dosis única no se ajusta por función renal [FT].',
  ],
  contraindicaciones: [
    'Contraindicado en hipersensibilidad a fluconazol u otros azoles; con terfenadina si se usan dosis múltiples de 400 mg o más; y con fármacos que prolongan el QT metabolizados por el CYP3A4, como cisaprida, astemizol, pimozida, quinidina y eritromicina [FT].',
    { alerta: { tono: 'alto', titulo: 'Anticoagulantes', texto: 'Con antifúngicos azólicos se han notificado hemorragias por aumento del tiempo de protrombina en pacientes con warfarina: vigilar el INR [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Tinea capitis', texto: 'No debe usarse en la tiña de la cabeza en niños: su tasa de éxito fue inferior al 20 % [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Cisaprida, pimozida, quinidina, eritromicina', 'Prolongación del QT y arritmias', 'Contraindicado [FT]'],
    ['Warfarina y otros anticoagulantes', 'Más tiempo de protrombina y sangrado', 'Vigilar el INR [FT]'],
    ['Rifampicina', 'Reduce el área bajo la curva un 25 %', 'Considerar más dosis de fluconazol [FT]'],
  ])],
  adversas: [
    'Frecuentes: cefalea, dolor abdominal, diarrea, náuseas, vómitos, elevación de transaminasas y fosfatasa alcalina y erupción. Se ha notificado DRESS [FT].',
  ],
  embarazo: [L(['Informar a la mujer en edad fértil del posible riesgo para el feto. Tras una dosis única se recomienda esperar una semana (5 a 6 semividas) antes de buscar un embarazo [FT].'])],
  evidencia: [
    { barras: {
      titulo: 'Esquema de la candidiasis vaginal recurrente',
      unidad: ['dosis', 'dosis'],
      datos: [
        { etiqueta: 'Dosis semanales de mantenimiento (6 meses)', valor: 26 },
        { etiqueta: 'Dosis de inducción (días 1, 4 y 7)', valor: 3 },
        { etiqueta: 'Candidiasis aguda', valor: 1 },
      ],
      nota: 'Ficha técnica [FT]. Las 26 dosis corresponden a una cápsula semanal durante unos 6 meses.',
    } },
    { triangulo: {
      titulo: 'Antes de dispensar fluconazol',
      centro: 'Revisión rápida',
      vertices: [
        { titulo: 'Medicamentos', icono: 'Shuffle', texto: 'QT, anticoagulantes, rifampicina [FT].' },
        { titulo: 'Riñón', icono: 'Droplets', texto: 'Ajustar en dosis múltiples [FT].' },
        { titulo: 'Embarazo', icono: 'Baby', texto: 'Informar el riesgo fetal [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 39 registros sanitarios vigentes con el código ATC J02AC01; consulta del 16-nov-2026 [CUM].', 'España: autorizado como Diflucan cápsulas y otras presentaciones [FT].'])],
  atencion: {
    intro: 'El fluconazol de dosis única es uno de los tratamientos más pedidos en la farmacia. Una pregunta por los otros medicamentos del paciente evita las interacciones más peligrosas [FT,MN].',
    necesidades: [
      ['Indicación', 'Candidiasis confirmada o muy probable [FT]'],
      ['Efectividad', 'Alivio en días; si recurre, evaluar [FT]'],
      ['Seguridad', 'Embarazo, QT, anticoagulantes [FT]'],
      ['Adherencia', 'Esquemas largos en la forma recurrente [FT]'],
    ],
    prf: [
      ['Interacción', 'Mujer con warfarina que pide fluconazol', 'Avisar al médico y vigilar el INR [FT]'],
      ['Indicación', 'Cuatro o más episodios al año tratados por su cuenta', 'Remitir para estudiar la recurrencia [FT]'],
      ['Seguridad', 'Embarazo posible', 'Remitir al médico [FT]'],
    ],
    plan: ['Preguntar por anticoagulantes y fármacos cardiacos [FT].', 'Explicar cuándo consultar si no mejora [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'La candidiasis vaginal recurrente afecta la vida íntima y la autoestima. Un trato discreto y sin prisa hace que la paciente cuente lo que realmente pasa [EX].',
    preguntas: ['¿Es la primera vez o le pasa seguido?', '¿Toma algún anticoagulante o medicamento para el corazón?', '¿Puede estar embarazada?'],
    quiz: {
      pregunta: '¿Cuál es la pauta de fluconazol para la candidiasis vaginal aguda según su ficha técnica?',
      opciones: [
        { texto: '150 mg en dosis única', correcta: true, retro: 'Gracias a su semivida de unas 30 horas [FT].' },
        { texto: '150 mg al día por 14 días', correcta: false, retro: 'Ese no es el esquema de la forma aguda [FT].' },
        { texto: '400 mg cada 8 horas', correcta: false, retro: 'Es una dosis que no aparece para esta indicación [FT].' },
      ],
    },
  },
  ofertas: [GUIAS.proa, GUIAS.problemas],
  refs: { FT: F.ftFluconazol, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Fluconazol: para qué sirve y efectos', '/articulos/fluconazol-para-que-sirve'], ['Clotrimazol: farmacología', '/vademecum/clotrimazol'], ['Warfarina: farmacología', '/vademecum/warfarina'], ['Antimicóticos, antivirales y antiparasitarios', '/vademecum/antimicoticos-antivirales-y-antiparasitarios']],
  seo: {
    titulo: 'Fluconazol: dosis, interacciones y consejería',
    descripcion: 'Fluconazol: mecanismo, dosis única de 150 mg, candidiasis recurrente, ajuste renal, interacciones con anticoagulantes y QT, y atención farmacéutica.',
  },
});
