import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Butilescopolamina (hioscina). Verificada el 16-nov-2026: ficha técnica de CIMA (Buscapina 10 mg) y CUM del INVIMA (20 registros con ATC A03BB01). */
export default crearMonografia({
  slug: 'butilescopolamina',
  nombre: 'Butilescopolamina (hioscina)',
  titulo: 'Butilescopolamina (hioscina): farmacología y atención farmacéutica',
  grupo: 'medicamentos-para-el-aparato-digestivo',
  clase: 'Antiespasmódico antimuscarínico',
  atc: 'A03BB01',
  marcas: ['Buscapina', 'Butilescopolamina'],
  vias: ['Oral'],
  mecanismo: 'Acción espasmolítica sobre el músculo liso digestivo, biliar y genitourinario por bloqueo ganglionar visceral y actividad antimuscarínica.',
  resumenCorto: 'antiespasmódico para cólicos digestivos, biliares y genitourinarios; casi no se absorbe por vía oral y está contraindicado en glaucoma de ángulo estrecho y retención urinaria.',
  resumen: 'La butilescopolamina, también llamada butilbromuro de hioscina, es un antiespasmódico que relaja el músculo liso del tubo digestivo, las vías biliares y las vías genitourinarias. Por vía oral se absorbe muy poco, lo que limita sus efectos sistémicos, pero conserva el perfil anticolinérgico: está contraindicada en glaucoma de ángulo estrecho no tratado, hiperplasia prostática con retención urinaria, taquicardia y obstrucción intestinal. En Colombia también se combina con dipirona. La atención farmacéutica se centra en distinguir un cólico simple de un abdomen agudo.',
  datosClave: [
    ['Clase', 'Antiespasmódico antimuscarínico [FT]'],
    ['Código ATC', 'A03BB01 [CUM]'],
    ['Dosis habitual', '10 a 20 mg, 3 a 5 veces al día; máximo 100 mg al día [FT]'],
    ['Absorción oral', 'Muy baja: biodisponibilidad absoluta menor del 1 % [FT]'],
    ['Semivida', '6,2 a 10,6 horas [FT]'],
    ['Colombia', '20 registros vigentes con el código ATC A03BB01 [CUM]'],
  ],
  quimica: ['Se usa como bromuro de butilescopolamina; la presentación de referencia son comprimidos recubiertos de 10 mg [FT].', 'Su alta polaridad explica la absorción oral muy baja: cerca del 8 % se absorbe y la biodisponibilidad absoluta es menor del 1 % [FT].'],
  dinamia: [
    'Ejerce una acción espasmolítica sobre el músculo liso gastrointestinal, biliar y genitourinario mediante bloqueo ganglionar visceral y actividad antimuscarínica [FT].',
    { mapa: {
      centro: 'Butilescopolamina',
      ramas: [
        { titulo: 'Digestivo', icono: 'Activity', nodos: ['Espasmos', 'Cólico'] },
        { titulo: 'Vías biliares', icono: 'Droplet', nodos: ['Espasmo', 'Disquinesia'] },
        { titulo: 'Genitourinario', icono: 'Droplets', nodos: ['Espasmo'] },
        { titulo: 'Anticolinérgico', icono: 'AlertTriangle', nodos: ['Boca seca', 'Taquicardia', 'Retención urinaria'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción oral', 'Cerca del 8 %; biodisponibilidad absoluta menor del 1 % [FT]'],
    ['Semivida terminal', '6,2 a 10,6 horas [FT]'],
    ['Eliminación', 'Cerca del 90 % en heces; 2 % a 5 % por orina tras la vía oral [FT]'],
  ])],
  indicaciones: ['Espasmos del tracto gastrointestinal, espasmos y disquinesias de las vías biliares y espasmos del tracto genitourinario, en adultos y niños mayores de 6 años [FT].'],
  posologia: [T(['Situación', 'Dosis'], [
    ['Adultos y mayores de 6 años', '1 a 2 comprimidos de 10 mg, 3 a 5 veces al día [FT]'],
    ['Máximo diario', '100 mg [FT]'],
  ])],
  contraindicaciones: [
    'Contraindicada en [FT]:',
    L(['Glaucoma de ángulo estrecho no tratado.', 'Hiperplasia prostática o retención urinaria por enfermedad uretroprostática.', 'Estenosis mecánica digestiva, estenosis de píloro, íleo paralítico u obstructivo y megacolon.', 'Taquicardia y miastenia grave.']),
    { alerta: { tono: 'alto', titulo: 'No ocultar un abdomen agudo', texto: 'Si el dolor abdominal es grave, de origen desconocido o se acompaña de fiebre, vómito, cambios en las deposiciones, dolor a la palpación, hipotensión, desmayo o sangre en las heces, hay que consultar de inmediato [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Tricíclicos, antihistamínicos, antipsicóticos, quinidina, amantadina, disopiramida', 'Suma efecto anticolinérgico', 'Vigilar [FT]'],
    ['Metoclopramida', 'Se reduce el efecto de ambos sobre el tubo digestivo', 'Evitar la combinación [FT]'],
    ['Betaadrenérgicos', 'Más taquicardia', 'Vigilar [FT]'],
  ])],
  adversas: [
    'Poco frecuentes: reacciones cutáneas, urticaria, prurito, taquicardia, boca seca y sudoración anormal [FT].',
    L(['Raras: retención urinaria [FT].', 'Frecuencia no conocida: shock anafiláctico, disnea e hipersensibilidad [FT].']),
  ],
  embarazo: [L(['Embarazo y lactancia: evitar como precaución por datos limitados [FT].'])],
  evidencia: [
    'La ficha técnica sustenta su uso en el dolor espasmódico; su baja absorción oral explica el perfil de efectos sistémicos limitado, pero no elimina las contraindicaciones anticolinérgicas [FT].',
    { triangulo: {
      titulo: 'Antes de dispensar un antiespasmódico',
      centro: 'Cólico simple',
      vertices: [
        { titulo: 'Ojos', icono: 'Eye', texto: 'Sin glaucoma de ángulo estrecho no tratado [FT].' },
        { titulo: 'Próstata', icono: 'Droplets', texto: 'Sin retención urinaria [FT].' },
        { titulo: 'Abdomen', icono: 'ShieldAlert', texto: 'Sin signos de alarma de abdomen agudo [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 20 registros sanitarios vigentes con el código ATC A03BB01; hay además productos que la combinan con dipirona. Consulta del 16-nov-2026 [CUM].', 'España: autorizada como Buscapina 10 mg comprimidos recubiertos [FT].'])],
  atencion: {
    intro: 'La butilescopolamina se pide por su nombre comercial para cualquier dolor de barriga. La intervención clave es separar el cólico simple del dolor que necesita consulta [FT,MN].',
    necesidades: [
      ['Indicación', 'Dolor espasmódico digestivo, biliar o genitourinario [FT]'],
      ['Efectividad', 'Alivio del cólico [FT]'],
      ['Seguridad', 'Glaucoma, próstata, taquicardia, signos de alarma [FT]'],
      ['Interacciones', 'Otros anticolinérgicos, metoclopramida [FT]'],
    ],
    prf: [
      ['Seguridad', 'Dolor abdominal intenso con fiebre', 'Remitir sin dispensar [FT]'],
      ['Reacción adversa', 'Hombre mayor que no puede orinar', 'Suspender y remitir [FT]'],
      ['Interacción', 'Uso junto con metoclopramida', 'Explicar que se anulan [FT]'],
    ],
    plan: ['Preguntar por signos de alarma en cada dispensación [FT].', 'Revisar si la combinación con dipirona está indicada [CUM].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'La «Buscapina» es parte del botiquín familiar. Esa familiaridad hace que se tome para dolores que no son cólicos y retrase consultas necesarias [EX].',
    preguntas: ['¿Cómo es el dolor y desde cuándo lo tiene?', '¿Tiene fiebre o vómito?', '¿Toma la Buscapina sola o la Compositum con dipirona?'],
    quiz: {
      pregunta: '¿En cuál de estas personas está contraindicada la butilescopolamina?',
      opciones: [
        { texto: 'Hombre con hiperplasia prostática y retención urinaria', correcta: true, retro: 'Es una contraindicación de la ficha técnica [FT].' },
        { texto: 'Mujer con cólico menstrual sin otros antecedentes', correcta: false, retro: 'El espasmo genitourinario está dentro de sus indicaciones [FT].' },
        { texto: 'Adulto con colitis por estrés sin signos de alarma', correcta: false, retro: 'El espasmo digestivo es su indicación [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.gastro, GUIAS.problemas],
  refs: { FT: F.ftButilescopolamina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Buscapina: para qué sirve', '/articulos/buscapina-para-que-sirve'], ['Dipirona (metamizol): farmacología', '/vademecum/dipirona'], ['Medicamentos para el aparato digestivo', '/vademecum/medicamentos-para-el-aparato-digestivo']],
  seo: {
    titulo: 'Butilescopolamina (hioscina): farmacología',
    descripcion: 'Butilescopolamina o hioscina (Buscapina): mecanismo, dosis, contraindicaciones anticolinérgicas, signos de alarma, combinación con dipirona y consejería.',
  },
});
