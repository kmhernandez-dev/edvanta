import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Quetiapina. Verificada el 16-nov-2026: ficha técnica de CIMA (Quetiapina Cinfa 25 mg, liberación inmediata) y CUM del INVIMA (28 registros vigentes con ATC N05AH04). */
export default crearMonografia({
  slug: 'quetiapina',
  nombre: 'Quetiapina',
  grupo: 'salud-mental-y-sistema-nervioso',
  clase: 'Antipsicótico atípico',
  atc: 'N05AH04',
  vias: ['Oral'],
  mecanismo: 'Antipsicótico atípico; junto con su metabolito activo, la norquetiapina, actúa sobre un amplio rango de receptores de neurotransmisión.',
  resumenCorto: 'antipsicótico atípico para esquizofrenia y trastorno bipolar, con titulación por días; exige vigilar peso, glucosa y lípidos, y no está aprobado en la psicosis por demencia.',
  resumen: 'La quetiapina es un antipsicótico atípico que, junto con su metabolito activo, la norquetiapina, actúa sobre un amplio rango de receptores. Su ficha técnica la indica en la esquizofrenia y en el trastorno bipolar: episodios maníacos moderados a graves, episodios depresivos mayores y prevención de recurrencias. Cada indicación tiene su propia titulación: en la esquizofrenia se sube de 50 a 300 mg en cuatro días; en la depresión bipolar se toma una vez al día al acostarse y la dosis recomendada es de 300 mg. Su perfil metabólico obliga a medir peso, glucosa y lípidos, y su ficha advierte que no está aprobada en la psicosis asociada a la demencia. Está contraindicada con inhibidores potentes del CYP3A4.',
  datosClave: [
    ['Clase', 'Antipsicótico atípico [FT]'],
    ['Código ATC', 'N05AH04 [CUM]'],
    ['Esquizofrenia', '300 a 450 mg al día habitual; rango 150 a 750 mg [FT]'],
    ['Depresión bipolar', '300 mg una vez al día al acostarse [FT]'],
    ['Semivida', 'Unas 7 horas [FT]'],
    ['Colombia', '28 registros vigentes con el código ATC N05AH04 [CUM]'],
  ],
  quimica: ['Pertenece a las diazepinas, oxazepinas y tiazepinas. La ficha de referencia es de comprimidos de liberación inmediata de 25 mg; existen también presentaciones de liberación prolongada con otra pauta [FT].'],
  dinamia: [
    'La quetiapina y su metabolito activo, la norquetiapina, interactúan con un amplio rango de receptores cerebrales de neurotransmisión [FT].',
    { mapa: {
      centro: 'Quetiapina',
      ramas: [
        { titulo: 'Esquizofrenia', icono: 'Brain', nodos: ['Tratamiento'] },
        { titulo: 'Bipolar', icono: 'Activity', nodos: ['Manía', 'Depresión', 'Prevención'] },
        { titulo: 'Metabolismo', icono: 'LineChart', nodos: ['Peso', 'Glucosa', 'Lípidos'] },
        { titulo: 'Sangre y corazón', icono: 'HeartPulse', nodos: ['Neutropenia', 'QT'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción', 'Adecuada; los alimentos no la afectan de forma significativa [FT]'],
    ['Metabolito activo', 'Norquetiapina, al 35 % de las concentraciones de quetiapina [FT]'],
    ['Semivida', 'Unas 7 horas [FT]'],
  ])],
  indicaciones: [L(['Esquizofrenia [FT].', 'Trastorno bipolar: episodios maníacos moderados a graves, episodios depresivos mayores y prevención de recurrencias en quienes respondieron [FT].'])],
  posologia: [
    T(['Indicación', 'Titulación', 'Dosis habitual'], [
      ['Esquizofrenia', 'Día 1: 50 mg; día 2: 100; día 3: 200; día 4: 300 mg, en 2 tomas [FT]', '300 a 450 mg al día; rango 150 a 750 [FT]'],
      ['Manía bipolar', 'Día 1: 100 mg; día 2: 200; día 3: 300; día 4: 400 mg, en 2 tomas [FT]', '400 a 800 mg al día [FT]'],
      ['Depresión bipolar', 'Día 1: 50 mg; día 2: 100; día 3: 200; día 4: 300 mg, al acostarse [FT]', '300 mg al día [FT]'],
    ]),
    { barras: {
      titulo: 'Dosis del cuarto día según la indicación',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Manía bipolar', valor: 400 },
        { etiqueta: 'Esquizofrenia', valor: 300 },
        { etiqueta: 'Depresión bipolar', valor: 300 },
      ],
      nota: 'Ficha técnica [FT]. Cada indicación tiene su propio esquema: el paciente debe recibir instrucciones claras.',
    } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad y con inhibidores del CYP3A4 como los inhibidores de la proteasa del VIH, los antifúngicos azólicos, la eritromicina, la claritromicina y la nefazodona [FT].',
    { alerta: { tono: 'alto', titulo: 'Demencia', texto: 'No está aprobada para la psicosis relacionada con la demencia: con algunos antipsicóticos atípicos se observó un riesgo unas 3 veces mayor de eventos cerebrovasculares en estos pacientes [FT].' } },
    { alerta: { tono: 'alto', titulo: 'Metabolismo y sangre', texto: 'Evaluar peso, glucosa y lípidos al inicio y durante el tratamiento. La neutropenia grave aparece sobre todo en los dos primeros meses [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Jóvenes y menores', texto: 'No se recomienda en menores de 18 años. En la depresión bipolar hubo más eventos relacionados con el suicidio en menores de 25 años que con placebo (3,0 % frente a 0 %) [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Inhibidores potentes del CYP3A4 (azoles, claritromicina, eritromicina)', 'Aumentan mucho su concentración', 'Contraindicado [FT]'],
    ['Alcohol y fármacos de acción central', 'Más sedación', 'Precaución [FT]'],
    ['ISRS, IRSN, tricíclicos, IMAO', 'Síndrome serotoninérgico', 'Precaución [FT]'],
  ])],
  adversas: [
    'Muy frecuentes (10 % o más) [FT]:',
    { claves: [
      { icono: 'Moon', titulo: 'Sistema nervioso', texto: 'Somnolencia, mareo, cefalea y síntomas extrapiramidales [FT].' },
      { icono: 'LineChart', titulo: 'Metabolismo', texto: 'Aumento de peso, triglicéridos y colesterol LDL; baja el HDL [FT].' },
      { icono: 'Droplet', titulo: 'Otros', texto: 'Boca seca, baja de hemoglobina y síntomas de retirada [FT].' },
    ] },
  ],
  embarazo: [L(['Embarazo: los datos del primer trimestre no sugieren más malformaciones, pero no permiten una conclusión definitiva [FT].'])],
  evidencia: [
    'Su ficha técnica distingue esquemas por indicación; en la depresión bipolar no se observó más beneficio con 600 mg que con 300 mg [FT].',
    { triangulo: {
      titulo: 'Seguimiento de la quetiapina',
      centro: 'Vigilar en cada control',
      vertices: [
        { titulo: 'Peso', icono: 'Scale', texto: 'Cambios de peso desde el inicio [FT].' },
        { titulo: 'Glucosa y lípidos', icono: 'LineChart', texto: 'Al inicio y periódicamente [FT].' },
        { titulo: 'Neutrófilos', icono: 'Droplet', texto: 'Sobre todo los dos primeros meses [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 28 registros sanitarios vigentes con el código ATC N05AH04; consulta del 16-nov-2026 [CUM].', 'España: autorizada, entre otras, como Quetiapina Cinfa comprimidos recubiertos [FT].'])],
  atencion: {
    intro: 'Con la quetiapina, el farmacéutico acompaña un tratamiento largo: adherencia, efectos metabólicos e interacciones con antibióticos y antifúngicos de uso frecuente [FT,MN].',
    necesidades: [
      ['Indicación', 'Esquizofrenia o trastorno bipolar [FT]'],
      ['Efectividad', 'Control de síntomas y recaídas [FT]'],
      ['Seguridad', 'Peso, glucosa, lípidos, neutrófilos [FT]'],
      ['Interacciones', 'Inhibidores del CYP3A4 [FT]'],
    ],
    prf: [
      ['Interacción', 'Le formulan claritromicina', 'Contraindicado: avisar al médico [FT]'],
      ['Seguridad', 'Adulto mayor con demencia y quetiapina para la agitación', 'Consultar: no aprobada para ese uso [FT]'],
      ['Reacción adversa', 'Aumento de peso marcado', 'Coordinar el control metabólico [FT]'],
    ],
    plan: ['Escribir el esquema de titulación del inicio [FT].', 'Revisar cada antibiótico o antifúngico nuevo [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'El aumento de peso y la somnolencia son causas frecuentes de abandono. Hablar de ellos sin minimizarlos protege la estabilidad del paciente [EX].',
    preguntas: ['¿Cómo se siente con el medicamento?', '¿Ha cambiado su peso o su apetito?', '¿Le han recetado antibióticos o antimicóticos hace poco?'],
    quiz: {
      pregunta: '¿Con cuál de estos medicamentos está contraindicada la quetiapina?',
      opciones: [
        { texto: 'Claritromicina', correcta: true, retro: 'Es un inhibidor del CYP3A4 que la ficha técnica contraindica [FT].' },
        { texto: 'Acetaminofén', correcta: false, retro: 'No figura entre las contraindicaciones [FT].' },
        { texto: 'Omeprazol', correcta: false, retro: 'No figura entre las contraindicaciones [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.psico, GUIAS.seguridad],
  refs: { FT: F.ftQuetiapina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Claritromicina: farmacología', '/vademecum/claritromicina'], ['Trazodona: farmacología', '/vademecum/trazodona'], ['Salud mental y sistema nervioso', '/vademecum/salud-mental-y-sistema-nervioso']],
  seo: {
    titulo: 'Quetiapina: dosis, riesgos y atención farmacéutica',
    descripcion: 'Quetiapina: antipsicótico atípico para esquizofrenia y trastorno bipolar, titulación por indicación, control metabólico, CYP3A4 y atención farmacéutica.',
  },
});
