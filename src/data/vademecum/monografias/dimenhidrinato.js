import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Dimenhidrinato. Verificado el 16-nov-2026: ficha técnica de CIMA (Biodramina 50 mg), índice ATC de la OMS (R06AA11) y CUM del INVIMA. */
export default crearMonografia({
  slug: 'dimenhidrinato',
  nombre: 'Dimenhidrinato',
  grupo: 'medicamentos-para-el-aparato-digestivo',
  clase: 'Antihistamínico H1 antiemético',
  atc: 'R06AA11',
  vias: ['Oral'],
  mecanismo: 'Antagonista histaminérgico H1 y antimuscarínico central que deprime la función laberíntica y reduce la estimulación vestibular.',
  resumenCorto: 'antihistamínico para el mareo del viaje: 50 a 100 mg cada 4 a 6 horas, máximo 400 mg al día; produce sueño y efectos anticolinérgicos.',
  resumen: 'El dimenhidrinato es un antihistamínico H1 con efecto antimuscarínico central que previene y trata el mareo por viajes en barco, carro o avión, con sus náuseas, vómitos y vértigo. Se toma al menos media hora antes de viajar. Produce somnolencia y efectos anticolinérgicos, por lo que se usa con precaución en glaucoma, hiperplasia prostática, asma y personas mayores. La atención farmacéutica se centra en la sedación, la conducción y las interacciones con otros depresores.',
  datosClave: [
    ['Clase', 'Antihistamínico H1 con acción antimuscarínica [FT]'],
    ['Código ATC', 'R06AA11 (OMS) [ATC]; en el CUM figura como N07CA91 y R06AA99 [CUM]'],
    ['Dosis habitual', '50 a 100 mg cada 4 a 6 horas; máximo 400 mg al día [FT]'],
    ['Inicio', 'Efecto a los 15 a 30 minutos; máximo a 1 a 2 horas [FT]'],
    ['Semivida', '1 a 4 horas [FT]'],
    ['Colombia', '4 registros con el código N07CA91 y 5 con R06AA99 [CUM]'],
  ],
  quimica: ['La ficha técnica de referencia corresponde a comprimidos de 50 mg [FT].', 'Está contraindicado en la hipersensibilidad a la difenhidramina, con la que está relacionado [FT].'],
  dinamia: [
    'Es un antagonista H1 y antimuscarínico central que deprime la función laberíntica y disminuye la estimulación vestibular [FT].',
    { mapa: {
      centro: 'Dimenhidrinato',
      ramas: [
        { titulo: 'H1 central', icono: 'Brain', nodos: ['Antiemético', 'Sueño'] },
        { titulo: 'Antimuscarínico', icono: 'Droplet', nodos: ['Boca seca', 'Retención urinaria', 'Visión borrosa'] },
        { titulo: 'Laberinto', icono: 'Waves', nodos: ['Menos vértigo', 'Menos mareo'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción', 'Buena por vía oral; respuesta a los 15 a 30 minutos [FT]'],
    ['Efecto máximo', '1 a 2 horas; dura 3 a 6 horas [FT]'],
    ['Unión a proteínas', '98 % a 99 % [FT]'],
    ['Metabolismo', 'Hepático extenso, con importante primer paso [FT]'],
    ['Semivida', '1 a 4 horas [FT]'],
    ['Eliminación', 'Renal, como metabolitos [FT]'],
  ])],
  indicaciones: ['Prevención y tratamiento de los síntomas del mareo por viajes en barco, por tierra o en avión, como náuseas, vómitos o vértigo, en adultos y niños desde 7 años [FT].'],
  posologia: [
    T(['Situación', 'Dosis'], [
      ['Adultos y mayores de 12 años', '50 a 100 mg; repetir cada 4 a 6 horas si es necesario [FT]'],
      ['Máximo diario', '400 mg [FT]'],
      ['Momento de la toma', 'Al menos 30 minutos antes de viajar, mejor 1 a 2 horas antes, con comida, agua o leche [FT]'],
    ]),
    { ciclo: {
      titulo: 'El viaje sin mareo, paso a paso',
      centro: 'Antes, durante y después',
      pasos: [
        { titulo: 'Planear', icono: 'CalendarClock', texto: 'Tomarlo 1 a 2 horas antes de salir, mínimo 30 minutos [FT].' },
        { titulo: 'Tomar', icono: 'Pill', texto: '50 a 100 mg con comida, agua o leche [FT].' },
        { titulo: 'Repetir', icono: 'Repeat', texto: 'Cada 4 a 6 horas si el viaje sigue; sin pasar de 400 mg al día [FT].' },
        { titulo: 'Cuidar', icono: 'Ban', texto: 'No conducir y evitar el alcohol: produce sueño [FT].' },
      ],
    } },
  ],
  contraindicaciones: [
    'Contraindicado en hipersensibilidad al dimenhidrinato o a la difenhidramina, porfiria y crisis asmáticas [FT].',
    { alerta: { tono: 'medio', titulo: 'Precaución con el perfil anticolinérgico', texto: 'Usar con cuidado en asma, EPOC, hiperplasia prostática, glaucoma, epilepsia e insuficiencia hepática o renal. Las personas mayores son más sensibles. Puede enmascarar una apendicitis o la ototoxicidad de otros fármacos; evitar alcohol, sol y temperaturas extremas [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Aminoglucósidos y otros ototóxicos', 'Enmascara los primeros síntomas de ototoxicidad', 'Vigilar la audición [FT]'],
    ['Tricíclicos, IMAO, neurolépticos, antiparkinsonianos', 'Suma efectos anticolinérgicos e íleo paralítico', 'Evitar o vigilar [FT]'],
    ['Alcohol, benzodiacepinas, opioides, barbitúricos', 'Más sedación', 'Evitar [FT]'],
    ['Fotosensibilizantes', 'Más fotosensibilidad', 'Protección solar [FT]'],
  ])],
  adversas: [
    'Lo más característico es la somnolencia y la sedación, con cefalea, mareo y, a veces, excitación paradójica [FT].',
    L(['Anticolinérgicos: boca seca, visión borrosa, retención urinaria y estreñimiento [FT].', 'Cardiovasculares: taquicardia, palpitaciones y arritmias [FT].', 'Raros: alteraciones hematológicas (agranulocitosis, trombopenia) y anafilaxia [FT].']),
  ],
  embarazo: [L([
    'Embarazo: solo si el beneficio supera los riesgos [FT].',
    'Lactancia: no se recomienda; pasa en pequeñas cantidades y puede causar irritabilidad en el lactante e inhibir la lactancia [FT].',
  ])],
  evidencia: ['La ficha técnica sustenta su uso preventivo en el mareo por movimiento, con una ventana de toma antes del viaje y un techo de 400 mg al día [FT].'],
  regulacion: [L(['Colombia: el CUM lo registra con códigos locales N07CA91 (4 registros) y R06AA99 (5 registros); el código de la OMS es R06AA11. Consulta del 16-nov-2026 [CUM,ATC].', 'España: autorizado como Biodramina 50 mg comprimidos [FT].'])],
  atencion: {
    intro: 'El dimenhidrinato se compra para el viaje. La consejería clave es el momento de la toma y la advertencia de no conducir [FT,MN].',
    necesidades: [
      ['Indicación', 'Mareo por viaje [FT]'],
      ['Efectividad', 'Tomarlo antes de que empiecen los síntomas [FT]'],
      ['Seguridad', 'Conducción, glaucoma, próstata, edad avanzada [FT]'],
      ['Interacciones', 'Alcohol, benzodiacepinas, anticolinérgicos [FT]'],
    ],
    prf: [
      ['Seguridad', 'Conductor que lo toma para un viaje largo', 'Advertir que produce sueño [FT]'],
      ['Reacción adversa', 'Adulto mayor con retención urinaria', 'Valorar alternativa [FT]'],
      ['Interacción', 'Uso con alcohol en el viaje', 'Evitar la combinación [FT]'],
    ],
    plan: ['Indicar la hora de toma según el viaje [FT].', 'Revisar otros depresores del sistema nervioso [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Muchos viajeros lo toman cuando ya están mareados y concluyen que «no funciona». Explicar que actúa mejor si se toma antes cambia el resultado [FT,EX].',
    preguntas: ['¿Va a manejar durante el viaje?', '¿Tiene glaucoma o problemas para orinar?', '¿Cuándo pensaba tomarlo?'],
    quiz: {
      pregunta: '¿Cuándo conviene tomar el dimenhidrinato para un viaje?',
      opciones: [
        { texto: 'Al menos 30 minutos antes, mejor 1 a 2 horas antes', correcta: true, retro: 'Así está indicado en la ficha técnica [FT].' },
        { texto: 'Solo cuando aparece el vómito', correcta: false, retro: 'Funciona mejor de forma preventiva [FT].' },
        { texto: 'La noche anterior y no más', correcta: false, retro: 'Se puede repetir cada 4 a 6 horas durante el viaje [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.gastro, GUIAS.problemas],
  refs: { FT: F.ftDimenhidrinato, CUM: F.invimaCum16, ATC: F.whoccAtc, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Ondansetrón: farmacología', '/vademecum/ondansetron'], ['Metoclopramida: farmacología', '/vademecum/metoclopramida'], ['Medicamentos para el aparato digestivo', '/vademecum/medicamentos-para-el-aparato-digestivo']],
  seo: {
    titulo: 'Dimenhidrinato: farmacología y atención farmacéutica',
    descripcion: 'Dimenhidrinato: mecanismo, dosis para el mareo del viaje, máximo 400 mg al día, sueño, efectos anticolinérgicos, interacciones y consejería.',
  },
});
