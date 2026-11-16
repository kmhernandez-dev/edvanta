import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Alopurinol. Verificado el 16-nov-2026: ficha técnica de CIMA (Zyloric 100 mg) y CUM del INVIMA (9 registros vigentes con ATC M04AA01). */
export default crearMonografia({
  slug: 'alopurinol',
  nombre: 'Alopurinol',
  grupo: 'medicamentos-para-el-dolor-y-la-inflamacion',
  clase: 'Inhibidor de la xantina oxidasa (antigotoso)',
  atc: 'M04AA01',
  vias: ['Oral'],
  mecanismo: 'Alopurinol y su metabolito oxipurinol inhiben la xantina oxidasa y reducen la formación de ácido úrico.',
  resumenCorto: 'hipouricemiante para la gota crónica y la litiasis úrica: se inicia con 100 mg al día, no durante un ataque agudo, y se suspende de inmediato ante cualquier erupción.',
  resumen: 'El alopurinol reduce la producción de ácido úrico: él y su metabolito principal, el oxipurinol, inhiben la xantina oxidasa. Su ficha técnica lo indica cuando la dieta y el control de la causa no bastan, en la gota, la litiasis y la nefropatía por ácido úrico, entre otras. Se inicia a dosis bajas, por ejemplo 100 mg al día, y se ajusta según el urato: 100 a 200 mg en alteraciones leves, 300 a 600 en moderadas y 700 a 900 en graves. Tres reglas lo definen: no se empieza hasta que el ataque agudo haya pasado; se suspende de inmediato ante cualquier erupción en la piel; y nunca se combina sin ajuste con azatioprina o mercaptopurina, por casos mortales.',
  datosClave: [
    ['Clase', 'Inhibidor de la xantina oxidasa [FT]'],
    ['Código ATC', 'M04AA01 [CUM]'],
    ['Inicio', '100 mg al día [FT]'],
    ['Rango', '100 a 900 mg al día según la gravedad [FT]'],
    ['Semivida del oxipurinol', '13 a 30 horas [FT]'],
    ['Colombia', '9 registros vigentes con el código ATC M04AA01 [CUM]'],
  ],
  quimica: ['La presentación de referencia son comprimidos de 100 mg (también de 300 mg). Su metabolito principal es el oxipurinol [FT].'],
  dinamia: [
    'Inhibe la xantina oxidasa, enzima que oxida la hipoxantina a xantina y la xantina a ácido úrico; así baja el ácido úrico en plasma y orina [FT].',
    { mapa: {
      centro: 'Alopurinol',
      ramas: [
        { titulo: 'Xantina oxidasa', icono: 'Atom', nodos: ['Inhibida'] },
        { titulo: 'Ácido úrico', icono: 'LineChart', nodos: ['Baja en sangre', 'Baja en orina'] },
        { titulo: 'Usos', icono: 'Bone', nodos: ['Gota', 'Litiasis úrica', 'Nefropatía úrica'] },
        { titulo: 'Alarma', icono: 'ShieldAlert', nodos: ['Erupción', 'HLA-B*5801'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Biodisponibilidad', '67 % a 90 % [FT]'],
    ['Concentración máxima', 'Cerca de 1,5 horas [FT]'],
    ['Semivida del alopurinol', '0,5 a 1,5 horas [FT]'],
    ['Semivida del oxipurinol', '13 a 30 horas; se acumula en insuficiencia renal [FT]'],
  ])],
  indicaciones: ['Reducción del urato cuando la dieta, los líquidos o el control de la causa no bastan, y tratamiento de las complicaciones de la hiperuricemia: gota, litiasis por ácido úrico y nefropatía aguda por ácido úrico, entre otras [FT].'],
  posologia: [
    T(['Gravedad', 'Dosis diaria en adultos'], [
      ['Inicio', '100 mg al día, subir solo si el urato no responde [FT]'],
      ['Alteraciones leves', '100 a 200 mg [FT]'],
      ['Alteraciones moderadas', '300 a 600 mg [FT]'],
      ['Alteraciones graves', '700 a 900 mg [FT]'],
      ['Niños menores de 15 años', '10 a 20 mg/kg/día o 100 a 400 mg en 3 tomas [FT]'],
    ]),
    { barras: {
      titulo: 'Dosis máxima diaria según la gravedad',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Graves', valor: 900 },
        { etiqueta: 'Moderadas', valor: 600 },
        { etiqueta: 'Leves', valor: 200 },
        { etiqueta: 'Inicio', valor: 100 },
      ],
      nota: 'Ficha técnica [FT]. En la insuficiencia renal grave pueden bastar menos de 100 mg al día.',
    } },
  ],
  contraindicaciones: [
    'Contraindicado en hipersensibilidad al alopurinol [FT].',
    { alerta: { tono: 'alto', titulo: 'Erupción en la piel', texto: 'Suspender de inmediato ante cualquier erupción o signo de hipersensibilidad. El alelo HLA-B*5801 se asocia con hipersensibilidad grave y Stevens-Johnson [FT].' } },
    { alerta: { tono: 'alto', titulo: 'Azatioprina y mercaptopurina', texto: 'El alopurinol prolonga su actividad: se han notificado pancitopenia y mielosupresión mortales [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Ataque agudo', texto: 'No iniciarlo hasta que el ataque haya pasado; al comenzar puede precipitar nuevos ataques [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Azatioprina, 6-mercaptopurina', 'Niveles tóxicos y mielosupresión', 'Ajuste obligatorio o evitar [FT]'],
    ['Amoxicilina, ampicilina', 'Más erupciones cutáneas', 'Vigilar [FT]'],
  ])],
  adversas: ['La ficha técnica no dispone de documentación clínica moderna para estimar frecuencias; la reacción que obliga a actuar es la erupción cutánea, que puede anunciar hipersensibilidad grave [FT].'],
  embarazo: [L(['Embarazo: solo si no hay alternativa más segura y la enfermedad es un riesgo mayor [FT].'])],
  evidencia: [
    'Su ficha técnica respalda el inicio con dosis bajas y el ajuste guiado por el urato para reducir las reacciones adversas [FT].',
    { triangulo: {
      titulo: 'Alopurinol sin sustos',
      centro: 'Gota bajo control',
      vertices: [
        { titulo: 'Empezar bajo', icono: 'Sprout', texto: '100 mg al día [FT].' },
        { titulo: 'Fuera del ataque', icono: 'Hourglass', texto: 'Iniciar cuando el ataque pasó [FT].' },
        { titulo: 'Piel', icono: 'ShieldAlert', texto: 'Erupción: suspender ya [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 9 registros sanitarios vigentes con el código ATC M04AA01; consulta del 16-nov-2026 [CUM].', 'España: autorizado como Zyloric 100 mg y 300 mg comprimidos [FT].'])],
  atencion: {
    intro: 'El alopurinol es un tratamiento de años. El farmacéutico enseña a reconocer la erupción, sostiene la adherencia entre ataques y revisa las interacciones con inmunosupresores [FT,MN].',
    necesidades: [
      ['Indicación', 'Gota crónica o hiperuricemia con complicaciones [FT]'],
      ['Efectividad', 'Urato en meta y menos ataques [FT]'],
      ['Seguridad', 'Piel, riñón, azatioprina [FT]'],
      ['Adherencia', 'Diario, aun sin dolor [FT]'],
    ],
    prf: [
      ['Seguridad', 'Erupción a las 3 semanas de iniciar', 'Suspender y remitir de inmediato [FT]'],
      ['Interacción', 'Paciente trasplantado con azatioprina', 'Consultar al médico antes de dispensar [FT]'],
      ['Adherencia', 'Lo deja cuando no hay dolor', 'Explicar que previene, no alivia [FT]'],
    ],
    plan: ['Enseñar los signos de alarma en la piel [FT].', 'Coordinar la profilaxis con colchicina al inicio, si el médico la indica [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Quien ha tenido un ataque de gota lo recuerda como uno de los peores dolores. Ese recuerdo puede usarse para sostener un tratamiento que no se siente día a día [EX].',
    preguntas: ['¿Cuándo fue su último ataque?', '¿Ha notado manchas o ronchas en la piel?', '¿Toma algún medicamento para el sistema inmune?'],
    quiz: {
      pregunta: '¿Cuándo debe iniciarse el alopurinol según su ficha técnica?',
      opciones: [
        { texto: 'Cuando el ataque agudo de gota haya pasado completamente', correcta: true, retro: 'Iniciarlo durante el ataque puede producir ataques adicionales [FT].' },
        { texto: 'En el primer minuto del ataque', correcta: false, retro: 'No es un tratamiento del ataque agudo [FT].' },
        { texto: 'Solo cuando haya cálculos renales', correcta: false, retro: 'Tiene varias indicaciones [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.renal, GUIAS.seguridad],
  refs: { FT: F.ftAlopurinol, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Colchicina: farmacología', '/vademecum/colchicina'], ['Dieta para el ácido úrico', '/articulos/dieta-para-el-acido-urico'], ['Medicamentos para el dolor y la inflamación', '/vademecum/medicamentos-para-el-dolor-y-la-inflamacion']],
  seo: {
    titulo: 'Alopurinol: dosis, gota y alertas de seguridad',
    descripcion: 'Alopurinol: inhibidor de la xantina oxidasa para la gota, dosis de inicio y máxima, erupción cutánea, HLA-B*5801, azatioprina y consejería.',
  },
});
