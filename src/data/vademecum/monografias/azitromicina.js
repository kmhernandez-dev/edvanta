import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { GUIAS } from '../lib/ofertas.js';

/** Azitromicina. Verificada el 16-nov-2026: ficha técnica de CIMA (Zitromax 500 mg) y CUM del INVIMA (63 registros vigentes con ATC J01FA10). */
export default crearMonografia({
  slug: 'azitromicina',
  nombre: 'Azitromicina',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Antibiótico macrólido',
  atc: 'J01FA10',
  vias: ['Oral'],
  mecanismo: 'Se une a la subunidad 50S del ribosoma e inhibe la translocación de péptidos y la síntesis de proteínas bacterianas.',
  resumenCorto: 'macrólido de semivida larga (unas 68 horas): 500 mg al día 3 días en infecciones respiratorias y 1 g único en clamidia; prolonga el QT y favorece resistencias.',
  resumen: 'La azitromicina es un macrólido que se une a la subunidad 50S del ribosoma bacteriano. Su semivida terminal es de unas 68 horas, lo que permite esquemas de 3 días y dosis únicas, pero también explica su advertencia de resistencias: deja concentraciones decrecientes en el organismo durante mucho tiempo. Su ficha técnica la indica en adultos y adolescentes de al menos 45 kg con faringoamigdalitis, sinusitis, otitis, neumonía, infecciones de piel, exacerbaciones de bronquitis crónica y uretritis o cervicitis por clamidia o gonococo. Pide reservarla para cuando las pautas preferidas no estén indicadas, vigilar el QT y considerar que aumenta la exposición a la digoxina y la colchicina.',
  datosClave: [
    ['Clase', 'Macrólido [FT]'],
    ['Código ATC', 'J01FA10 [CUM]'],
    ['Infecciones respiratorias y de piel', '500 mg al día durante 3 días [FT]'],
    ['Clamidia', '1.000 mg en dosis única [FT]'],
    ['Semivida', 'Unas 68 horas [FT]'],
    ['Colombia', '63 registros vigentes con el código ATC J01FA10 [CUM]'],
  ],
  quimica: ['Macrólido; la presentación de referencia son comprimidos recubiertos de 500 mg [FT].'],
  dinamia: [
    'Inhibe la síntesis de proteínas bacterianas uniéndose a la subunidad 50S del ribosoma y bloqueando la translocación de péptidos [FT].',
    { mapa: {
      centro: 'Azitromicina',
      ramas: [
        { titulo: 'Respiratorias', icono: 'Wind', nodos: ['Faringoamigdalitis', 'Sinusitis', 'Otitis', 'Neumonía'] },
        { titulo: 'Sexuales', icono: 'Shield', nodos: ['Clamidia', 'Gonococo, combinada'] },
        { titulo: 'Piel', icono: 'Layers', nodos: ['Infecciones agudas'] },
        { titulo: 'Riesgos', icono: 'HeartPulse', nodos: ['QT', 'Resistencias'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Concentración máxima', '2 a 3 horas [FT]'],
    ['Semivida terminal', 'Unas 68 horas [FT]'],
    ['Alimentos', 'Los comprimidos pueden tomarse con o sin comida [FT]'],
  ])],
  indicaciones: ['En adultos y adolescentes de al menos 45 kg: faringoamigdalitis estreptocócica, sinusitis, otitis media, neumonía adquirida en la comunidad, infecciones agudas de la piel, exacerbación de bronquitis crónica, y uretritis y cervicitis por Chlamydia trachomatis o, combinada con otro antibiótico, por Neisseria gonorrhoeae [FT].'],
  posologia: [
    T(['Indicación', 'Pauta en adultos de 45 kg o más'], [
      ['Respiratorias y de piel', '500 mg al día 3 días, o 500 mg el día 1 y 250 mg los días 2 a 5 [FT]'],
      ['Uretritis y cervicitis por clamidia', '1.000 mg en dosis única [FT]'],
      ['Uretritis y cervicitis por gonococo', '1.000 mg en dosis única junto con otro antibiótico, como la ceftriaxona [FT]'],
    ]),
    { barras: {
      titulo: 'Dosis total del tratamiento (mg)',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Esquema de 5 días', valor: 1500 },
        { etiqueta: 'Esquema de 3 días', valor: 1500 },
        { etiqueta: 'Dosis única en clamidia', valor: 1000 },
      ],
      nota: 'Calculado con las pautas de la ficha técnica [FT].',
    } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad a la azitromicina, la eritromicina u otros macrólidos o cetólidos [FT].',
    { alerta: { tono: 'alto', titulo: 'QT y arritmias', texto: 'Se ha observado prolongación del QT con riesgo de torsade de pointes; precaución con otros fármacos que alargan el QT [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Resistencias', texto: 'Por sus concentraciones prolongadas puede favorecer resistencias: iniciarla tras evaluar beneficio y riesgo y cuando las pautas preferidas no estén indicadas [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Digoxina, colchicina (sustratos de glicoproteína P)', 'Aumenta su exposición', 'Vigilar toxicidad [FT]'],
    ['Sustratos del CYP3A4 de margen estrecho', 'Posible inhibición débil', 'Precaución [FT]'],
    ['Fármacos que prolongan el QT', 'Más riesgo de arritmia', 'Precaución [FT]'],
  ])],
  adversas: ['Las más frecuentes son diarrea, cefalea, vómitos, dolor abdominal y náuseas. Entre las graves figuran anafilaxia, torsade de pointes, colitis pseudomembranosa e insuficiencia hepática [FT].'],
  embarazo: [L(['Embarazo: no hay estudios bien controlados, pero en estudios observacionales con más de 7.000 embarazos expuestos la mayoría no sugiere más malformaciones importantes [FT].'])],
  evidencia: [
    'Su ficha técnica es explícita en el uso racional: se reserva para cuando las pautas preferidas no estén indicadas, por su capacidad de favorecer resistencias [FT].',
    { triangulo: {
      titulo: 'Antes de dispensar azitromicina',
      centro: 'Macrólido seguro',
      vertices: [
        { titulo: 'Corazón', icono: 'HeartPulse', texto: 'QT y fármacos que lo alargan [FT].' },
        { titulo: 'Digoxina y colchicina', icono: 'Shuffle', texto: 'Más exposición a ambas [FT].' },
        { titulo: 'Resistencia', icono: 'Shield', texto: 'Solo si está indicada [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 63 registros sanitarios vigentes con el código ATC J01FA10; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Zitromax comprimidos, cápsulas y suspensión [FT].'])],
  atencion: {
    intro: 'Los esquemas cortos de azitromicina la hacen popular, y por eso se usa de más. El farmacéutico revisa el QT, la colchicina y la digoxina, y si de verdad está indicada [FT,MN].',
    necesidades: [
      ['Indicación', 'Infección con indicación clara [FT]'],
      ['Efectividad', 'Mejoría tras el esquema corto [FT]'],
      ['Seguridad', 'QT, hígado, colitis [FT]'],
      ['Interacciones', 'Digoxina, colchicina, otros que alargan el QT [FT]'],
    ],
    prf: [
      ['Interacción', 'Paciente con colchicina para la gota', 'Avisar al médico por toxicidad [FT]'],
      ['Interacción', 'Usa un antipsicótico que alarga el QT', 'Consultar al médico [FT]'],
      ['Farmacoterapia innecesaria', 'Pide azitromicina para un resfriado', 'Explicar que no actúa sobre virus'],
    ],
    plan: ['Revisar medicamentos cardiacos y de la gota [FT].', 'Explicar por qué son solo 3 días [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Que el tratamiento dure solo 3 días hace que algunas personas crean que «es más suave». Explicar que su efecto continúa varios días evita que repitan la caja [EX].',
    preguntas: ['¿Para qué se la recetaron?', '¿Toma digoxina o colchicina?', '¿Ha tomado antibióticos hace poco?'],
    quiz: {
      pregunta: '¿Por qué la ficha técnica advierte que la azitromicina puede favorecer resistencias?',
      opciones: [
        { texto: 'Por las concentraciones decrecientes que persisten mucho tiempo tras el tratamiento', correcta: true, retro: 'Su semivida terminal es de unas 68 horas [FT].' },
        { texto: 'Porque se toma solo un día', correcta: false, retro: 'El problema es la persistencia en el organismo [FT].' },
        { texto: 'Porque no se absorbe', correcta: false, retro: 'Sí se absorbe; alcanza su máximo en 2 a 3 horas [FT].' },
      ],
    },
  },
  ofertas: [GUIAS.proa, GUIAS.seguridad],
  refs: { FT: F.ftAzitromicina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Azitromicina: para qué sirve', '/articulos/azitromicina-para-que-sirve'], ['Claritromicina: farmacología', '/vademecum/claritromicina'], ['Antibióticos de uso ambulatorio', '/vademecum/antibioticos-de-uso-ambulatorio']],
  seo: {
    titulo: 'Azitromicina: dosis, QT y uso racional',
    descripcion: 'Azitromicina: macrólido de 3 días o dosis única, semivida de 68 horas, QT, interacción con digoxina y colchicina, resistencias y consejería.',
  },
});
