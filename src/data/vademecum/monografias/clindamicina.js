import { F } from '../fuentes.js';

/** Monografía: clindamicina. Verificada el 13-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'clindamicina',
  nombre: 'Clindamicina',
  titulo: 'Clindamicina: farmacología, farmacocinética y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Lincosamida',
  atc: 'J01FF01',
  marcas: ['Dalacin', 'Cleocin'],
  vias: ['Oral', 'Intravenosa', 'Intramuscular', 'Vaginal', 'Tópica'],
  mecanismo: 'Se une a la subunidad 50S del ribosoma bacteriano e inhibe las primeras etapas de la síntesis de proteínas.',
  actualizado: '2026-11-13',
  resumenCorto: 'lincosamida con buena penetración en hueso; riesgo destacado de colitis por Clostridioides difficile y de esofagitis.',
  resumen: 'La clindamicina es una lincosamida semisintética derivada de la lincomicina. Penetra bien en hueso y tejidos, y se usa en infecciones de piel, dentales, faríngeas por estreptococo, pulmonares, óseas y ginecológicas. Sus puntos críticos son la diarrea por Clostridioides difficile, la esofagitis por la cápsula y las reacciones cutáneas graves.',
  datosClave: [
    ['Clase', 'Lincosamida, derivada de la lincomicina [2]'],
    ['Dosis oral en adultos', '600 a 1.800 mg al día en 2 a 4 tomas [1]'],
    ['Semivida', '1,5 a 3,5 horas [1]'],
    ['Comida', 'Sin efecto cuantificable en la absorción [1]'],
    ['Colombia', '61 registros sanitarios vigentes que la contienen, sola o combinada [4]'],
  ],
  secciones: [
    { id: 'farmacoquimica', titulo: 'Farmacoquímica', bloques: [
      'La clindamicina es un antibiótico semisintético que se obtiene al sustituir con cloro, con configuración 7(S), el hidroxilo 7(R) de la lincomicina [2]. Su fórmula es C18H33ClN2O5S y su peso molecular, 425,0 g/mol [3].',
      'En las presentaciones inyectables se usa como fosfato de clindamicina, un éster hidrosoluble [2].',
    ] },
    { id: 'farmacodinamia', titulo: 'Farmacodinamia', bloques: [
      'Se une a la subunidad 50S del ribosoma bacteriano e inhibe las primeras etapas de la síntesis proteica, bloqueando la unión del ribosoma y la traducción [1].',
      'También tiene propiedades bloqueantes neuromusculares, que pueden potenciar otros bloqueantes [1].',
    ] },
    { id: 'farmacocinetica', titulo: 'Farmacocinética', bloques: [
      { lista: [
        'Absorción oral no influida de forma cuantificable por los alimentos, aunque la comida la retrasa algo [1].',
        'Semivida de 1,5 a 3,5 horas, que puede prolongarse en la insuficiencia renal o hepática grave [1].',
        'Concentraciones respecto al suero: cerca del 40 % en hueso, 50 % en líquido sinovial, 50 a 90 % en líquido pleural y 50 a 100 % en leche materna [1].',
      ] },
    ] },
    { id: 'indicaciones', titulo: 'Indicaciones', bloques: [
      { lista: [
        'Neumonía adquirida en la comunidad por Staphylococcus aureus, neumonía por aspiración, empiema y absceso pulmonar [1].',
        'Faringoamigdalitis aguda por estreptococo del grupo A [1].',
        'Infecciones odontógenas y de piel y tejidos blandos [1].',
        'Osteomielitis [1].',
        'Vaginosis bacteriana y enfermedad inflamatoria pélvica [1].',
        'Neumonía por Pneumocystis jirovecii y encefalitis toxoplásmica en personas con VIH, en combinación [1].',
      ] },
    ] },
    { id: 'posologia', titulo: 'Posología', bloques: [
      { lista: [
        'Adultos: 600 a 1.800 mg al día en 2, 3 o 4 dosis, según la gravedad, el sitio y la sensibilidad; duración en general de 7 a 14 días [1].',
        'Faringoamigdalitis por estreptococo betahemolítico: 300 mg dos veces al día durante 10 días [1].',
        'Tragar la cápsula entera con un vaso lleno de agua y no acostarse en los 30 minutos siguientes [1].',
      ] },
    ] },
    { id: 'contraindicaciones-y-advertencias', titulo: 'Contraindicaciones y advertencias', bloques: [
      'Contraindicada con hipersensibilidad a clindamicina o lincomicina y con antecedente de colitis asociada a antibióticos [1].',
      { lista: [
        'Diarrea asociada a Clostridioides difficile, desde leve hasta colitis mortal; suspender ante la sospecha [1].',
        'Esofagitis y úlcera esofágica si no se sigue la forma de administración [1].',
        'Reacciones cutáneas graves: Stevens-Johnson, necrólisis epidérmica tóxica, DRESS y pustulosis exantemática aguda generalizada [1].',
        'Precaución en enfermedad inflamatoria intestinal [1].',
      ] },
    ] },
    { id: 'interacciones', titulo: 'Interacciones', bloques: [
      { tabla: { columnas: ['Fármaco', 'Efecto', 'Manejo'], filas: [
        ['Bloqueantes neuromusculares', 'Potenciación del bloqueo', 'Precaución en anestesia [1]'],
        ['Inductores potentes de la CYP3A4 (rifampicina)', 'Posible pérdida de eficacia', 'Vigilar la respuesta [1]'],
      ] } },
    ] },
    { id: 'reacciones-adversas', titulo: 'Reacciones adversas', bloques: [
      'Las más comunes son diarrea, dolor abdominal, colitis seudomembranosa y erupción maculopapular; también náuseas, vómito y urticaria. Son graves y menos frecuentes las reacciones cutáneas severas, la esofagitis y las alteraciones hematológicas [1].',
    ] },
    { id: 'embarazo-y-lactancia', titulo: 'Embarazo y lactancia', bloques: [
      'Atraviesa la placenta. En el segundo y el tercer trimestre no se ha asociado con más anomalías congénitas, pero faltan estudios en el primero: solo se usa si es estrictamente necesaria. Pasa a la leche y puede afectar la flora del lactante; no obliga a suspender la lactancia, pero es preferible otra opción [1].',
    ] },
    { id: 'evidencia', titulo: 'Evidencia: espectro y resistencia', bloques: [
      'El principal mecanismo de resistencia es la mutación o la metilación del ARN 23S de la subunidad 50S, el sitio de unión del antibiótico; con menos frecuencia, la modificación del fármaco y las bombas de expulsión [1]. Alcanza en hueso cerca del 40 % de la concentración sérica, y la ficha técnica la indica en osteomielitis e infecciones odontógenas [1].',
    ] },
    { id: 'regulacion', titulo: 'Situación regulatoria', bloques: [
      'Colombia: 61 registros sanitarios vigentes que contienen clindamicina, sola o combinada (por ejemplo, con clotrimazol), en crema vaginal, óvulos, cápsulas, solución inyectable y gel tópico [4]. En Estados Unidos se comercializa como Cleocin [2].',
    ] },
    { id: 'atencion-farmaceutica', titulo: 'Atención farmacéutica (modelo de Minnesota)', destacado: true, bloques: [
      { tabla: { columnas: ['Necesidad', 'Qué revisar'], filas: [
        ['Indicación', 'Infección grave por germen sensible; antecedente de colitis por antibióticos [1]'],
        ['Efectividad', 'Dosis y duración según la infección; rifampicina concomitante [1]'],
        ['Seguridad', 'Diarrea, esofagitis, piel; enfermedad inflamatoria intestinal; cirugía con relajantes musculares [1]'],
        ['Adherencia', 'Técnica de toma con agua y sin acostarse; dosis repartidas en el día [1]'],
      ] } },
      'Problemas típicos: esofagitis por tomar la cápsula antes de dormir (seguridad), diarrea que se trata con antidiarreicos sin consultar (seguridad) e indicación en un paciente con antecedente de colitis (indicación). Cada problema se registra según el modelo [5].',
    ] },
    { id: 'experiencia-farmacoterapeutica', titulo: 'Experiencia farmacoterapéutica', destacado: true, bloques: [
      'Lo que el paciente hace en casa con su medicamento define buena parte de los riesgos [5,6]. Conviene explorar:',
      { lista: [
        'A qué hora toma las cápsulas y si lo hace justo antes de acostarse.',
        'Qué haría si le da diarrea, y si pensaría en un antidiarreico de venta libre.',
        'Experiencias previas con antibióticos y diarrea, que generan miedo y abandono.',
      ] },
    ] },
  ],
  referencias: [F.ftDalacin, F.dmCleocin, F.pubchemClindamicina, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [['Clindamicina para qué sirve (para pacientes)', '/articulos/clindamicina-para-que-sirve']],
  seo: {
    titulo: 'Clindamicina: farmacología, farmacocinética y atención',
    descripcion: 'Clindamicina: farmacoquímica de las lincosamidas, mecanismo ribosomal, penetración tisular, diarrea por C. difficile, esofagitis y atención farmacéutica.',
  },
};
