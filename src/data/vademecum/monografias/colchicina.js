import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Colchicina. Verificada el 16-nov-2026: ficha técnica de CIMA (Colchicina Seid 1 mg) y CUM del INVIMA (6 registros vigentes con ATC M04AC01). */
export default crearMonografia({
  slug: 'colchicina',
  nombre: 'Colchicina',
  grupo: 'medicamentos-para-el-dolor-y-la-inflamacion',
  clase: 'Antigotoso sin efecto sobre el ácido úrico',
  atc: 'M04AC01',
  vias: ['Oral'],
  mecanismo: 'Su mecanismo no se conoce por completo: reduce la reacción inflamatoria que producen los cristales de urato en la articulación.',
  resumenCorto: 'antigotoso de margen estrecho: 1 mg al primer signo de ataque, sin pasar de 2 mg en 24 horas ni de 6 mg en 4 días; tóxica con claritromicina y otros inhibidores del CYP3A4.',
  resumen: 'La colchicina trata y previene los ataques de gota sin modificar el ácido úrico: reduce la reacción inflamatoria que generan los cristales de urato. También está indicada en la fiebre mediterránea familiar. Su ficha técnica la define con una advertencia rotunda: tiene un margen terapéutico estrecho y la sobredosis es extremadamente tóxica y puede ser mortal. En el ataque agudo se toma 1 mg al primer signo y, si no hay alivio, 0,5 a 1 mg una o dos horas después, sin superar 2 mg en 24 horas ni 6 mg en 4 días. Se contraindica en el embarazo, la insuficiencia renal o hepática grave y durante 14 días tras inhibidores del CYP3A4 o de la glicoproteína P.',
  datosClave: [
    ['Clase', 'Antigotoso [FT]'],
    ['Código ATC', 'M04AC01 [CUM]'],
    ['Ataque agudo', '1 mg al inicio; máximo 2 mg en 24 horas [FT]'],
    ['Máximo por ciclo', '6 mg en 4 días; luego 3 días de descanso [FT]'],
    ['Biodisponibilidad', 'Cerca del 45 % [FT]'],
    ['Colombia', '6 registros vigentes con el código ATC M04AC01 [CUM]'],
  ],
  quimica: ['La presentación de referencia son comprimidos de 1 mg (también de 0,5 mg) [FT].'],
  dinamia: [
    'Produce una respuesta inmediata en los ataques de gota, probablemente porque reduce la reacción inflamatoria que producen los cristales de urato; su mecanismo no se conoce por completo [FT].',
    { mapa: {
      centro: 'Colchicina',
      ramas: [
        { titulo: 'Ataque agudo', icono: 'Flame', nodos: ['1 mg al primer signo'] },
        { titulo: 'Prevención', icono: 'Shield', nodos: ['Al iniciar alopurinol'] },
        { titulo: 'Fiebre mediterránea', icono: 'Thermometer', nodos: ['Adultos y niños'] },
        { titulo: 'Toxicidad', icono: 'Skull', nodos: ['Margen estrecho', 'CYP3A4', 'Glicoproteína P'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Biodisponibilidad oral', 'Cerca del 45 % [FT]'],
    ['Unión a albúmina', 'Cerca del 39 % [FT]'],
    ['Distribución', 'Mucosa intestinal, hígado, riñones y bazo; atraviesa la placenta [FT]'],
  ])],
  indicaciones: [L(['Ataques agudos de gota y gota crónica [FT].', 'Prevención de ataques al iniciar alopurinol o uricosúricos [FT].', 'Fiebre mediterránea familiar, también en niños para prevenir ataques y amiloidosis [FT].'])],
  posologia: [
    T(['Situación', 'Dosis en adultos'], [
      ['Ataque agudo', '1 mg al primer signo; si no alivia, 0,5 a 1 mg una o dos horas después [FT]'],
      ['Límite diario', 'No más de 2 mg en 24 horas [FT]'],
      ['Límite por ciclo', 'Hasta 4 días seguidos, máximo 6 mg; repetir solo tras 3 días sin tratamiento [FT]'],
      ['Prevención al iniciar alopurinol', '0,5 a 1 mg cada 24 horas [FT]'],
    ]),
    { barras: {
      titulo: 'Topes de seguridad de la colchicina',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Máximo acumulado en 4 días', valor: 6 },
        { etiqueta: 'Máximo en 24 horas', valor: 2 },
        { etiqueta: 'Dosis inicial del ataque', valor: 1 },
      ],
      nota: 'Ficha técnica [FT]. Dosis mayores no son más eficaces y aumentan los efectos adversos.',
    } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad, embarazo, insuficiencia renal grave o hemodiálisis, insuficiencia hepática grave, trastornos gastrointestinales graves, úlcera de estómago, trastornos cardiacos, discrasias sanguíneas y durante los 14 días siguientes al uso de inhibidores del CYP3A4 o de la glicoproteína P [FT].',
    { alerta: { tono: 'alto', titulo: 'Margen estrecho', texto: 'La sobredosis es extremadamente tóxica y puede ser mortal: nunca superar la dosis indicada. Si aparece diarrea, suspender o bajar la dosis [FT].' } },
    { alerta: { tono: 'alto', titulo: 'Sangre', texto: 'Se han asociado leucopenia, trombocitopenia, anemia aplásica y mielosupresión a dosis terapéuticas: controles periódicos [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Claritromicina, eritromicina, telitromicina', 'Mayor toxicidad de la colchicina', 'Contraindicado durante y 14 días después [FT]'],
    ['Itraconazol, ketoconazol y otros inhibidores del CYP3A4', 'Mayor toxicidad', 'Evitar [FT]'],
    ['Inhibidores de la glicoproteína P', 'Mayor exposición', 'Evitar [FT]'],
  ])],
  adversas: ['Frecuentes: náuseas, vómitos y dolor abdominal. Las dosis elevadas pueden causar diarrea profusa y hemorragia digestiva [FT].'],
  embarazo: [L(['Embarazo: contraindicada; atraviesa la placenta [FT].'])],
  evidencia: [
    'Su ficha técnica establece que dosis superiores a 2 mg al día no han demostrado más eficacia, pero sí más efectos adversos [FT].',
    { triangulo: {
      titulo: 'Colchicina sin intoxicación',
      centro: 'Dosis exacta',
      vertices: [
        { titulo: 'Topes', icono: 'Gauge', texto: '2 mg al día y 6 mg en 4 días [FT].' },
        { titulo: 'Interacciones', icono: 'Shuffle', texto: 'Macrólidos y azoles: no [FT].' },
        { titulo: 'Diarrea', icono: 'Siren', texto: 'Señal para suspender o bajar [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 6 registros sanitarios vigentes con el código ATC M04AC01; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Colchicina Seid 0,5 mg y 1 mg comprimidos [FT].'])],
  atencion: {
    intro: 'La colchicina es de las pocas tabletas comunes que pueden matar por sobredosis. El farmacéutico escribe los topes en la caja y revisa cada antibiótico o antifúngico nuevo [FT,MN].',
    necesidades: [
      ['Indicación', 'Ataque de gota, prevención o fiebre mediterránea [FT]'],
      ['Efectividad', 'Alivio del ataque [FT]'],
      ['Seguridad', 'Topes, riñón, hígado, sangre, embarazo [FT]'],
      ['Interacciones', 'Macrólidos, azoles, glicoproteína P [FT]'],
    ],
    prf: [
      ['Dosis demasiado alta', 'Toma 1 mg cada hora hasta que pase el dolor', 'Suspender: tope de 2 mg al día [FT]'],
      ['Interacción', 'Le recetan claritromicina', 'Avisar al médico: contraindicado [FT]'],
      ['Reacción adversa', 'Diarrea intensa', 'Suspender y consultar [FT]'],
    ],
    plan: ['Escribir los topes de dosis en el empaque [FT].', 'Revisar antibióticos y antifúngicos [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'En pleno ataque, el dolor empuja a tomar «una más». Acordar el plan antes del siguiente ataque es la mejor protección [EX].',
    preguntas: ['¿Cuántas tomó en el último ataque?', '¿Le han recetado antibióticos hace poco?', '¿Ha tenido diarrea?'],
    quiz: {
      pregunta: '¿Cuál es la dosis máxima de colchicina en 24 horas durante un ataque agudo según su ficha técnica?',
      opciones: [
        { texto: '2 mg', correcta: true, retro: 'Dosis mayores no son más eficaces y sí más tóxicas [FT].' },
        { texto: '6 mg', correcta: false, retro: 'Ese es el máximo acumulado en 4 días [FT].' },
        { texto: 'No hay máximo', correcta: false, retro: 'Tiene un margen terapéutico estrecho [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.renal, GUIAS.seguridad],
  refs: { FT: F.ftColchicina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Alopurinol: farmacología', '/vademecum/alopurinol'], ['Azitromicina: farmacología', '/vademecum/azitromicina'], ['Medicamentos para el dolor y la inflamación', '/vademecum/medicamentos-para-el-dolor-y-la-inflamacion']],
  seo: {
    titulo: 'Colchicina: dosis máxima, gota y toxicidad',
    descripcion: 'Colchicina: ataque de gota y prevención, dosis máxima de 2 mg al día y 6 mg en 4 días, interacciones con macrólidos y azoles, y consejería.',
  },
});
