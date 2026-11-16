import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Montelukast. Verificado el 16-nov-2026: ficha técnica de CIMA (Singulair 10 mg) y CUM del INVIMA (41 registros vigentes con ATC R03DC03). */
export default crearMonografia({
  slug: 'montelukast',
  nombre: 'Montelukast',
  grupo: 'alergia-y-vias-respiratorias',
  clase: 'Antagonista de los receptores de leucotrienos',
  atc: 'R03DC03',
  vias: ['Oral'],
  mecanismo: 'Se une con gran afinidad y selectividad al receptor de leucotrienos cisteinílicos tipo 1 (CysLT1) y bloquea su acción en la vía aérea.',
  resumenCorto: 'antileucotrieno oral de una toma nocturna: complemento en el asma persistente leve a moderada; no sirve para la crisis y exige vigilar cambios de ánimo y conducta.',
  resumen: 'El montelukast bloquea el receptor de leucotrienos cisteinílicos tipo 1, mediadores de la inflamación y la broncoconstricción en el asma. Su ficha técnica lo indica como tratamiento adicional en el asma persistente leve a moderada, en el alivio de la rinitis alérgica estacional y en la prevención de la broncoconstricción por ejercicio. Se toma una vez al día por la noche, con presentaciones por edad desde los 6 meses. Tiene dos mensajes clave para el paciente: no sirve para una crisis aguda, y no reemplaza de golpe al corticoide inhalado. Además, la ficha advierte de acontecimientos neuropsiquiátricos —cambios de conducta, depresión e ideación suicida— que obligan a suspenderlo si aparecen.',
  datosClave: [
    ['Clase', 'Antagonista del receptor CysLT1 [FT]'],
    ['Código ATC', 'R03DC03 [CUM]'],
    ['Dosis desde 15 años', '10 mg una vez al día, por la noche [FT]'],
    ['Biodisponibilidad oral', '64 % (10 mg) [FT]'],
    ['Advertencia clave', 'Acontecimientos neuropsiquiátricos [FT]'],
    ['Colombia', '41 registros vigentes con el código ATC R03DC03 [CUM]'],
  ],
  quimica: ['Se presenta en comprimidos recubiertos de 10 mg, masticables de 5 mg y 4 mg, y granulado de 4 mg [FT].'],
  dinamia: [
    'Se une con gran afinidad y selectividad al receptor CysLT1 y bloquea la acción de los leucotrienos cisteinílicos en la vía aérea [FT].',
    { mapa: {
      centro: 'Montelukast',
      ramas: [
        { titulo: 'Asma', icono: 'Wind', nodos: ['Complemento en persistente leve a moderada'] },
        { titulo: 'Ejercicio', icono: 'Activity', nodos: ['Prevención de la broncoconstricción'] },
        { titulo: 'Rinitis', icono: 'Sprout', nodos: ['Alérgica estacional'] },
        { titulo: 'Vigilar', icono: 'Brain', nodos: ['Conducta', 'Ánimo', 'Sueño'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Biodisponibilidad oral', '64 % con 10 mg; 73 % con 5 mg masticable [FT]'],
    ['Metabolismo', 'CYP2C8 principalmente; en menor medida CYP3A4 y CYP2C9 [FT]'],
    ['Aclaramiento plasmático', 'Unos 45 ml/min [FT]'],
  ])],
  indicaciones: [L(['Asma persistente leve a moderada como tratamiento adicional [FT].', 'Alivio de los síntomas de la rinitis alérgica estacional [FT].', 'Prevención de la broncoconstricción inducida por el ejercicio [FT].'])],
  posologia: [
    T(['Edad', 'Presentación y dosis'], [
      ['Desde 15 años', '10 mg en comprimido recubierto, una vez al día por la noche [FT]'],
      ['6 a 14 años', '5 mg en comprimido masticable [FT]'],
      ['2 a 5 años', '4 mg en comprimido masticable [FT]'],
      ['6 meses a 5 años', '4 mg en granulado [FT]'],
    ]),
    { barras: {
      titulo: 'Dosis diaria según la edad',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Desde 15 años', valor: 10 },
        { etiqueta: '6 a 14 años', valor: 5 },
        { etiqueta: '2 a 5 años', valor: 4 },
        { etiqueta: '6 meses a 5 años (granulado)', valor: 4 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  contraindicaciones: [
    'Contraindicado en hipersensibilidad al principio activo o a los excipientes [FT].',
    { alerta: { tono: 'alto', titulo: 'Cambios de conducta y ánimo', texto: 'Se han notificado acontecimientos neuropsiquiátricos: cambios de comportamiento, depresión y tendencias suicidas. Si aparecen, se suspende y se consulta [FT].' } },
    { alerta: { tono: 'medio', titulo: 'No es un rescate', texto: 'No sirve para tratar una crisis aguda de asma y no debe reemplazar de forma brusca al corticoide inhalado [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Fenobarbital', 'Reduce el área bajo la curva del montelukast en un 40 %', 'Vigilar la respuesta [FT]'],
    ['Gemfibrozilo (inhibe el CYP2C8)', 'Aumenta la exposición 4,4 veces', 'Vigilar [FT]'],
  ])],
  adversas: ['Frecuentes: cefalea, dolor abdominal, diarrea, náuseas, vómitos, aumento de transaminasas, erupción y fiebre. La infección respiratoria alta se notificó como muy frecuente, igual que con placebo [FT].'],
  embarazo: [L(['Embarazo y lactancia: solo si se considera claramente necesario [FT].'])],
  evidencia: [
    'Su lugar en el asma, según la ficha técnica, es el de un tratamiento adicional, no el de primera línea ni el de rescate [FT].',
    { triangulo: {
      titulo: 'Tres mensajes para el paciente con montelukast',
      centro: 'Asma bajo control',
      vertices: [
        { titulo: 'Cada noche', icono: 'Moon', texto: 'Una toma diaria por la noche [FT].' },
        { titulo: 'No es rescate', icono: 'Siren', texto: 'En la crisis se usa el broncodilatador indicado [FT].' },
        { titulo: 'Vigilar el ánimo', icono: 'Brain', texto: 'Consultar si hay cambios de conducta o sueño [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 41 registros sanitarios vigentes con el código ATC R03DC03; consulta del 16-nov-2026 [CUM].', 'España: autorizado como Singulair 10 mg comprimidos recubiertos con película [FT].'])],
  atencion: {
    intro: 'Con el montelukast, el farmacéutico explica para qué no sirve —la crisis— y pregunta en cada visita por cambios de ánimo, sueño o conducta, sobre todo en niños [FT,MN].',
    necesidades: [
      ['Indicación', 'Asma persistente leve a moderada, rinitis o asma por ejercicio [FT]'],
      ['Efectividad', 'Menos síntomas y menos uso del rescate [FT]'],
      ['Seguridad', 'Conducta, ánimo, sueño [FT]'],
      ['Adherencia', 'Toma nocturna diaria sin abandonar el corticoide inhalado [FT]'],
    ],
    prf: [
      ['Seguridad', 'Niño con pesadillas e irritabilidad desde que lo inició', 'Suspender y consultar [FT]'],
      ['Efectividad', 'Usa montelukast en la crisis', 'Explicar el rescate correcto [FT]'],
      ['Adherencia', 'Dejó el corticoide inhalado al empezar el montelukast', 'Remitir al médico [FT]'],
    ],
    plan: ['Revisar el plan de acción del asma con el paciente [FT].', 'Preguntar por conducta y sueño en cada dispensación [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Muchos padres prefieren una pastilla a un inhalador. Escuchar esa preferencia y explicar qué hace cada uno evita que el montelukast reemplace lo que no debe [EX].',
    preguntas: ['¿A qué hora lo toma?', '¿Ha notado cambios en el sueño o el ánimo?', '¿Sigue usando el inhalador que le indicaron?'],
    quiz: {
      pregunta: 'Paciente en crisis de asma que pregunta si puede tomar un montelukast extra. ¿Qué indica la ficha técnica?',
      opciones: [
        { texto: 'Que el montelukast no sirve para tratar la crisis aguda', correcta: true, retro: 'La crisis se trata con el broncodilatador de rescate [FT].' },
        { texto: 'Que puede duplicar la dosis', correcta: false, retro: 'La dosis es una al día [FT].' },
        { texto: 'Que debe dejar el inhalador', correcta: false, retro: 'No debe reemplazar de golpe al corticoide inhalado [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.asma, GUIAS.seguridad],
  refs: { FT: F.ftMontelukast, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Salbutamol: farmacología', '/vademecum/salbutamol'], ['Alergia y vías respiratorias', '/vademecum/alergia-y-vias-respiratorias']],
  seo: {
    titulo: 'Montelukast: dosis por edad, riesgos y consejería',
    descripcion: 'Montelukast: mecanismo antileucotrieno, dosis por edad, asma, rinitis y ejercicio, alertas neuropsiquiátricas, interacciones y atención farmacéutica.',
  },
});
