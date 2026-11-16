import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Valsartán. Verificado el 16-nov-2026: ficha técnica de CIMA (Diovan 160 mg) y CUM del INVIMA (19 registros vigentes con ATC C09CA03). */
export default crearMonografia({
  slug: 'valsartan',
  nombre: 'Valsartán',
  grupo: 'medicamentos-para-la-hipertension-arterial',
  clase: 'Antagonista del receptor de angiotensina II (ARA-II)',
  atc: 'C09CA03',
  vias: ['Oral'],
  mecanismo: 'Antagonista potente y específico del receptor AT1 de la angiotensina II, responsable de sus acciones conocidas.',
  resumenCorto: 'ARA-II para hipertensión, insuficiencia cardiaca e infarto reciente: 80 a 320 mg al día en hipertensión, con efecto pleno en 4 semanas; contraindicado en el 2.º y 3.er trimestre del embarazo.',
  resumen: 'El valsartán es un ARA-II: bloquea de forma selectiva el receptor AT1 de la angiotensina II. Su ficha técnica lo indica en la hipertensión arterial de adultos y de niños desde 6 años, en la insuficiencia cardiaca sintomática y después de un infarto de miocardio reciente en pacientes estables. En hipertensión se inicia con 80 mg una vez al día; el efecto está presente en 2 semanas y es máximo en 4, y puede subirse a 160 y 320 mg. En la insuficiencia cardiaca se titula desde 40 mg dos veces al día cada dos semanas. Sus vigilancias son las del grupo: potasio, función renal y presión, y nunca en el segundo y tercer trimestre del embarazo.',
  datosClave: [
    ['Clase', 'ARA-II [FT]'],
    ['Código ATC', 'C09CA03 [CUM]'],
    ['Hipertensión', '80 mg al día; hasta 320 mg [FT]'],
    ['Efecto máximo', 'A las 4 semanas [FT]'],
    ['Semivida', 'Unas 6 horas [FT]'],
    ['Colombia', '19 registros vigentes con el código ATC C09CA03 [CUM]'],
  ],
  quimica: ['La presentación de referencia son comprimidos recubiertos de 160 mg; existen también de 40, 80 y 320 mg y solución oral [FT].'],
  dinamia: [
    'Es un antagonista potente y específico, activo por vía oral, del receptor AT1, responsable de las acciones conocidas de la angiotensina II [FT].',
    { mapa: {
      centro: 'Valsartán',
      ramas: [
        { titulo: 'Presión', icono: 'Gauge', nodos: ['Hipertensión', 'Desde 6 años'] },
        { titulo: 'Corazón', icono: 'HeartPulse', nodos: ['Insuficiencia cardiaca', 'Postinfarto'] },
        { titulo: 'Vigilar', icono: 'Eye', nodos: ['Potasio', 'Creatinina'] },
        { titulo: 'Embarazo', icono: 'Ban', nodos: ['Contraindicado 2.º y 3.er trimestre'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Concentración máxima', '2 a 4 horas con comprimidos [FT]'],
    ['Biodisponibilidad', '23 % con comprimidos; 39 % con solución [FT]'],
    ['Semivida', 'Unas 6 horas [FT]'],
  ])],
  indicaciones: [L(['Hipertensión arterial esencial en adultos y en niños y adolescentes de 6 a menos de 18 años [FT].', 'Insuficiencia cardiaca sintomática [FT].', 'Infarto de miocardio reciente en pacientes clínicamente estables con insuficiencia cardiaca o disfunción sistólica del ventrículo izquierdo [FT].'])],
  posologia: [
    T(['Indicación', 'Inicio', 'Ajuste'], [
      ['Hipertensión', '80 mg una vez al día [FT]', '160 mg y hasta 320 mg si no se controla [FT]'],
      ['Insuficiencia cardiaca', '40 mg dos veces al día [FT]', '80 y 160 mg dos veces al día, cada 2 semanas como mínimo [FT]'],
      ['Postinfarto', '20 mg dos veces al día desde las 12 horas [FT]', '40, 80 y 160 mg dos veces al día [FT]'],
    ]),
    { barras: {
      titulo: 'Escalones de dosis en hipertensión (mg al día)',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Máximo', valor: 320 },
        { etiqueta: 'Segundo escalón', valor: 160 },
        { etiqueta: 'Inicio', valor: 80 },
      ],
      nota: 'Ficha técnica [FT]. El efecto aparece en 2 semanas y es máximo en 4.',
    } },
  ],
  contraindicaciones: [
    'Contraindicado en hipersensibilidad, insuficiencia hepática grave, cirrosis biliar y colestasis, segundo y tercer trimestre del embarazo, y con aliskireno en diabetes o filtración glomerular menor de 60 ml/min/1,73 m² [FT].',
    { alerta: { tono: 'alto', titulo: 'Potasio', texto: 'No se recomiendan suplementos de potasio, diuréticos ahorradores de potasio ni sustitutos de la sal con potasio; vigilar el potasio [FT].' } },
    { alerta: { tono: 'alto', titulo: 'Bloqueo doble', texto: 'Combinar IECA, ARA-II o aliskireno aumenta la hipotensión, la hiperpotasemia y el daño renal [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['IECA o aliskireno', 'Bloqueo doble del sistema renina-angiotensina', 'Evitar [FT]'],
    ['Suplementos de potasio, espironolactona, heparina', 'Hiperpotasemia', 'Vigilar potasio [FT]'],
    ['Diuréticos', 'Más descenso de presión', 'Puede reducirse el diurético en la insuficiencia cardiaca [FT]'],
  ])],
  adversas: ['En los ensayos en hipertensión, la incidencia total de reacciones adversas fue comparable a la del placebo y no se relacionó con la dosis ni la duración [FT].'],
  embarazo: [L(['Primer trimestre: no recomendado [FT].', 'Segundo y tercer trimestre: contraindicado [FT].'])],
  evidencia: [
    'Su ficha técnica respalda tres usos con esquemas distintos; en la hipertensión, la combinación con un diurético como la hidroclorotiazida baja aún más la presión [FT].',
    { triangulo: {
      titulo: 'Control en cada visita',
      centro: 'Valsartán seguro',
      vertices: [
        { titulo: 'Presión', icono: 'Gauge', texto: 'Efecto máximo a las 4 semanas [FT].' },
        { titulo: 'Potasio', icono: 'FlaskConical', texto: 'Cuidado con suplementos y ahorradores [FT].' },
        { titulo: 'Embarazo', icono: 'Baby', texto: 'Suspender si se confirma [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 19 registros sanitarios vigentes con el código ATC C09CA03; consulta del 16-nov-2026 [CUM].', 'España: autorizado como Diovan comprimidos y solución oral [FT].'])],
  atencion: {
    intro: 'El valsartán no se siente: el paciente no nota que funcione. El farmacéutico mide la presión, explica el tiempo de efecto y revisa el potasio y los otros medicamentos [FT,MN].',
    necesidades: [
      ['Indicación', 'Hipertensión, insuficiencia cardiaca o postinfarto [FT]'],
      ['Efectividad', 'Presión en meta tras 4 semanas [FT]'],
      ['Seguridad', 'Potasio, riñón, embarazo [FT]'],
      ['Adherencia', 'Toma diaria aunque no haya síntomas [FT]'],
    ],
    prf: [
      ['Interacción', 'Valsartán con enalapril', 'Avisar al médico: bloqueo doble [FT]'],
      ['Seguridad', 'Usa sal dietética con potasio', 'Advertir el riesgo [FT]'],
      ['Seguridad', 'Mujer que planea un embarazo', 'Consultar antes [FT]'],
    ],
    plan: ['Medir la presión a las 2 y 4 semanas [FT].', 'Revisar suplementos y sustitutos de sal [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: '«Me siento bien, ¿para qué lo tomo?» es la frase que precede al abandono. Conectar el medicamento con lo que el paciente valora sostiene la adherencia [EX].',
    preguntas: ['¿Cómo ha estado su presión?', '¿Toma algún suplemento o sal dietética?', '¿Le han medido el potasio?'],
    quiz: {
      pregunta: '¿Cuándo alcanza el valsartán su efecto antihipertensivo máximo según la ficha técnica?',
      opciones: [
        { texto: 'A las 4 semanas', correcta: true, retro: 'El efecto está presente en 2 semanas y es máximo en 4 [FT].' },
        { texto: 'Con la primera dosis', correcta: false, retro: 'Necesita semanas [FT].' },
        { texto: 'A los 6 meses', correcta: false, retro: 'La ficha técnica indica 4 semanas [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.hta, GUIAS.afHta],
  refs: { FT: F.ftValsartan, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Losartán: farmacología', '/vademecum/losartan'], ['Medicamentos para la presión alta', '/articulos/medicamentos-para-la-presion-alta'], ['Medicamentos para la hipertensión arterial', '/vademecum/medicamentos-para-la-hipertension-arterial']],
  seo: {
    titulo: 'Valsartán: dosis, potasio y atención farmacéutica',
    descripcion: 'Valsartán: ARA-II para hipertensión, insuficiencia cardiaca y postinfarto; dosis, efecto en 4 semanas, potasio, embarazo y atención farmacéutica.',
  },
});
