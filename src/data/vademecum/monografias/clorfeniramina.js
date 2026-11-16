import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/**
 * Clorfeniramina (clorfenamina) y su isómero activo, la dexclorfeniramina.
 * Verificada el 16-nov-2026: ficha técnica de CIMA (Polaramine 2 mg,
 * dexclorfeniramina) y CUM del INVIMA (10 registros vigentes con ATC
 * R06AB04 y 1 con R06AB02). En CIMA no hay clorfenamina sola: las dosis
 * citadas son las de la dexclorfeniramina.
 */
export default crearMonografia({
  slug: 'clorfeniramina',
  nombre: 'Clorfeniramina (dexclorfeniramina)',
  titulo: 'Clorfeniramina y dexclorfeniramina: farmacología y atención farmacéutica',
  grupo: 'alergia-y-vias-respiratorias',
  clase: 'Antihistamínico H1 de primera generación',
  atc: 'R06AB04',
  marcas: ['Clorfeniramina', 'Polaramine'],
  vias: ['Oral'],
  mecanismo: 'Antagonista de los receptores H1 de la histamina, con efecto sedante y anticolinérgico; su actividad reside en el isómero dextro, la dexclorfeniramina.',
  resumenCorto: 'antihistamínico clásico de primera generación: alivia la alergia pero da sueño y efectos anticolinérgicos; no se usa en menores de 2 años.',
  resumen: 'La clorfeniramina, o clorfenamina, es un antihistamínico de primera generación; en Colombia aparece sola y en al menos 18 registros combinada con paracetamol. Su actividad predomina en el isómero dextro, la dexclorfeniramina, que es la forma con ficha técnica en CIMA. Es útil en rinitis, conjuntivitis, urticaria, picaduras y reacciones alérgicas, pero a diferencia de los antihistamínicos modernos produce somnolencia y efectos anticolinérgicos: está contraindicada en glaucoma de ángulo estrecho, hipertrofia prostática y en menores de 2 años, y las personas mayores de 60 años son más sensibles. El farmacéutico la encuentra con frecuencia dentro de combinaciones para el resfriado.',
  datosClave: [
    ['Clase', 'Antihistamínico H1 de primera generación [FT]'],
    ['Código ATC', 'R06AB04 clorfenamina; R06AB02 dexclorfeniramina [CUM]'],
    ['Dosis de dexclorfeniramina', '2 mg, 3 o 4 veces al día; máximo 12 mg [FT]'],
    ['Semivida', '20 a 24 horas (maleato de clorfeniramina) [FT]'],
    ['Advertencia clave', 'Somnolencia; no conducir si la produce [FT]'],
    ['Colombia', '10 registros con R06AB04 y 1 con R06AB02 [CUM]'],
  ],
  quimica: ['La actividad predominante de la clorfeniramina está en su dextro-isómero, la dexclorfeniramina. La presentación de referencia son comprimidos de 2 mg de dexclorfeniramina [FT].'],
  dinamia: [
    'Antagonista de los receptores H1 de la histamina. Su ficha técnica describe somnolencia y contraindicaciones de tipo anticolinérgico, como el glaucoma de ángulo estrecho y la obstrucción urinaria [FT].',
    { mapa: {
      centro: 'Clorfeniramina',
      ramas: [
        { titulo: 'Alergia', icono: 'Wind', nodos: ['Rinitis', 'Conjuntivitis', 'Urticaria'] },
        { titulo: 'Piel', icono: 'Layers', nodos: ['Picaduras', 'Dermatitis', 'Eczema'] },
        { titulo: 'Sueño', icono: 'Moon', nodos: ['Somnolencia', 'Excitación en niños'] },
        { titulo: 'Anticolinérgico', icono: 'Eye', nodos: ['Glaucoma', 'Próstata'] },
      ],
    } },
  ],
  cinetica: ['La semivida del maleato de clorfeniramina está entre 20 y 24 horas [FT].'],
  indicaciones: ['Rinitis alérgica estacional y perenne, rinitis vasomotora, conjuntivitis alérgica, urticaria y angioedema leves, reacciones a sangre o plasma, coadyuvante en reacciones anafilácticas junto a la adrenalina, eczema, dermatitis atópica y de contacto, picaduras de insectos, dermografismo y reacciones a medicamentos [FT].'],
  posologia: [
    T(['Edad', 'Dosis de dexclorfeniramina'], [
      ['Adultos y desde 12 años', '2 mg, 3 o 4 veces al día; máximo 12 mg al día [FT]'],
      ['Niños de 6 a 12 años', 'Máximo 6 mg al día en 3 tomas [FT]'],
      ['Menores de 6 años', 'Seguridad y eficacia no establecidas con comprimidos [FT]'],
    ]),
    { alerta: { tono: 'medio', titulo: 'Clorfeniramina en combinaciones', texto: 'La dosis de la ficha técnica corresponde a la dexclorfeniramina. En los productos con clorfenamina, la dosis se lee en la etiqueta de cada registro sanitario [CUM].' } },
  ],
  contraindicaciones: [
    'Contraindicada en [FT]:',
    L(['Menores de 2 años, recién nacidos y prematuros.', 'Uso de IMAO o en las 2 semanas siguientes a suspenderlos.', 'Glaucoma de ángulo estrecho o presión intraocular elevada.', 'Hipertrofia prostática u obstrucción del cuello de la vejiga.']),
    { alerta: { tono: 'alto', titulo: 'Mayores de 60 años', texto: 'Son más sensibles a los efectos sobre el sistema nervioso: mareo, sedación e hipotensión [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['IMAO', 'Contraindicado', 'No combinar [FT]'],
    ['Alcohol, tricíclicos, barbitúricos, otros depresores', 'Suma de sedación', 'Evitar [FT]'],
    ['Anticoagulantes orales', 'Interacción descrita', 'Vigilar [FT]'],
    ['Pruebas cutáneas de alergia', 'Falsos negativos', 'Suspender 48 horas antes [FT]'],
  ])],
  adversas: ['La más frecuente es la somnolencia ligera o moderada. En niños puede producir excitación paradójica [FT].'],
  embarazo: [L(['Embarazo: no usar en el tercer trimestre; en los dos primeros, solo si el beneficio supera el riesgo [FT].', 'Lactancia: no recomendada [FT].'])],
  evidencia: [
    'Su eficacia antialérgica es clásica, pero su ficha técnica la acompaña de advertencias de sedación y anticolinérgicas que los antihistamínicos de segunda generación no tienen en el mismo grado [FT].',
    { triangulo: {
      titulo: 'Las tres preguntas antes de un antigripal con clorfeniramina',
      centro: 'Primera generación',
      vertices: [
        { titulo: '¿Edad?', icono: 'Baby', texto: 'No en menores de 2 años; cuidado en mayores de 60 [FT].' },
        { titulo: '¿Maneja?', icono: 'Truck', texto: 'No conducir si produce sueño [FT].' },
        { titulo: '¿Ojos o próstata?', icono: 'Eye', texto: 'Contraindicada en glaucoma y obstrucción urinaria [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 10 registros sanitarios vigentes con el código ATC R06AB04 (clorfenamina) y 1 con R06AB02 (dexclorfeniramina). Además, la clorfeniramina figura como principio activo en 18 registros de combinaciones con paracetamol (ATC N02BE51) y en otros de combinaciones para el resfriado; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Polaramine 2 mg comprimidos (dexclorfeniramina) [FT].'])],
  atencion: {
    intro: 'La clorfeniramina llega escondida en antigripales. El aporte del farmacéutico es detectarla, sumar la sedación con otros medicamentos y proteger a niños pequeños y adultos mayores [FT,MN].',
    necesidades: [
      ['Indicación', 'Síntomas alérgicos que justifican un antihistamínico [FT]'],
      ['Efectividad', 'Alivio del picor y la rinorrea [FT]'],
      ['Seguridad', 'Edad, glaucoma, próstata, conducción [FT]'],
      ['Interacciones', 'Alcohol y otros sedantes [FT]'],
    ],
    prf: [
      ['Seguridad', 'Niño de 18 meses con antigripal que contiene clorfeniramina', 'No dispensar y remitir [FT]'],
      ['Reacción adversa', 'Adulto mayor con mareo y somnolencia', 'Proponer un antihistamínico de segunda generación al médico [FT]'],
      ['Interacción', 'Combinación con alcohol o benzodiacepinas', 'Advertir la suma de sedación [FT]'],
    ],
    plan: ['Leer la composición completa de los antigripales [CUM].', 'Advertir sobre la conducción [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Algunas personas buscan el antigripal «que da sueño» para descansar. Entender ese uso evita riesgos al día siguiente, al manejar o trabajar [EX].',
    preguntas: ['¿Qué antigripal usa y cuántas veces al día?', '¿Le da sueño? ¿Maneja después?', '¿Tiene glaucoma o dificultad para orinar?'],
    quiz: {
      pregunta: '¿En cuál de estos pacientes está contraindicada la dexclorfeniramina?',
      opciones: [
        { texto: 'Hombre de 70 años con hipertrofia prostática', correcta: true, retro: 'La hipertrofia prostática es una contraindicación de la ficha técnica [FT].' },
        { texto: 'Mujer de 30 años con urticaria leve', correcta: false, retro: 'La urticaria leve está entre sus indicaciones [FT].' },
        { texto: 'Adolescente de 14 años con rinitis', correcta: false, retro: 'Desde los 12 años usa la dosis de adultos [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.respiratoria, GUIAS.seguridad],
  refs: { FT: F.ftDexclorfeniramina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Loratadina: farmacología', '/vademecum/loratadina'], ['Hidroxizina: farmacología', '/vademecum/hidroxizina'], ['Alergia y vías respiratorias', '/vademecum/alergia-y-vias-respiratorias']],
  seo: {
    titulo: 'Clorfeniramina y dexclorfeniramina: farmacología',
    descripcion: 'Clorfeniramina y dexclorfeniramina: mecanismo, dosis, sedación, contraindicaciones en niños, glaucoma y próstata, antigripales y consejería.',
  },
});
