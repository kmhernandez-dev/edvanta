import { F } from '../fuentes.js';

/** Monografía: metronidazol. Verificada el 13-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'metronidazol',
  nombre: 'Metronidazol',
  titulo: 'Metronidazol: farmacología, farmacocinética y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Nitroimidazol (antibacteriano y antiprotozoario)',
  atc: 'P01AB01',
  marcas: ['Flagyl'],
  vias: ['Oral', 'Intravenosa', 'Vaginal'],
  mecanismo: 'Profármaco que, en condiciones anaerobias, se reduce a radicales nitrosos que forman aductos con el ADN y lo rompen.',
  actualizado: '2026-11-13',
  resumenCorto: 'nitroimidazol para anaerobios y protozoos; biodisponibilidad del 100 % y efecto disulfiram con alcohol.',
  resumen: 'El metronidazol es un nitroimidazol activo contra bacterias anaerobias y protozoos (tricomonas, amebas, giardias). Se absorbe por completo por vía oral, se distribuye ampliamente y su principal metabolito conserva parte de la actividad. Sus problemas de práctica más frecuentes son la interacción con el alcohol, la warfarina y el litio.',
  datosClave: [
    ['Clase', 'Derivado del nitroimidazol; ATC P01AB01 [1]'],
    ['Biodisponibilidad oral', '100 %, sin efecto relevante de la comida [1]'],
    ['Semivida', '8 a 10 horas [1]'],
    ['Duración máxima habitual', '10 días, salvo casos justificados [1]'],
    ['Colombia', '71 registros sanitarios vigentes [4]'],
  ],
  secciones: [
    { id: 'farmacoquimica', titulo: 'Farmacoquímica', bloques: [
      'El metronidazol es el 2-metil-5-nitro-1H-imidazol-1-etanol, un nitroimidazol sintético [2]. Su fórmula molecular es C6H9N3O3 y su peso molecular, 171,15 g/mol [3].',
      'El grupo nitro en la posición 5 es la parte activa: el fármaco es estable y penetra en el microorganismo, donde la reducción de ese grupo genera los radicales responsables de su efecto [1].',
    ] },
    { id: 'farmacodinamia', titulo: 'Farmacodinamia', bloques: [
      'El metronidazol no es activo en sí mismo. En condiciones anaerobias, la piruvato-ferredoxina oxidorreductasa lo reduce a radicales nitrosos que forman aductos con las bases del ADN, rompen la cadena y causan la muerte celular [1].',
      'Su acción depende de la concentración: la eficacia se relaciona sobre todo con el cociente entre la concentración máxima y la concentración mínima inhibitoria [1]. No tiene actividad bactericida directa contra bacterias aerobias ni anaerobias facultativas [1].',
    ] },
    { id: 'farmacocinetica', titulo: 'Farmacocinética', bloques: [
      { tabla: { columnas: ['Parámetro', 'Valor'], filas: [
        ['Absorción', 'Rápida, al menos el 80 % en menos de 1 hora; biodisponibilidad del 100 % [1]'],
        ['Concentración máxima', 'Unos 10 µg/ml una hora después de 500 mg [1]'],
        ['Unión a proteínas', 'Menos del 20 % [1]'],
        ['Volumen de distribución', 'Unos 40 l (0,65 l/kg); difunde a pulmón, riñón, hígado, piel, bilis, saliva, secreciones vaginales y líquido seminal [1]'],
        ['Metabolismo', 'Hepático; el metabolito «alcohol» conserva cerca del 30 % de la actividad y tiene una semivida de unas 11 horas [1]'],
        ['Semivida', '8 a 10 horas [1]'],
        ['Barreras', 'Atraviesa la placenta y pasa a la leche materna [1]'],
      ] } },
      'En la encefalopatía hepática puede acumularse; el fenobarbital acelera su metabolismo y acorta su semivida a unas 3 horas [1].',
    ] },
    { id: 'indicaciones', titulo: 'Indicaciones', bloques: [
      { lista: [
        'Infecciones por anaerobios sensibles: peritonitis, absceso cerebral, osteomielitis, fiebre puerperal, absceso pélvico e infecciones de heridas quirúrgicas [1].',
        'Prevención de infecciones anaerobias posoperatorias [1].',
        'Tricomoniasis urogenital, vaginosis bacteriana, amebiasis y giardiasis [1].',
        'Infecciones periodontales agudas, incluida la gingivitis ulcerosa aguda [1].',
        'Helicobacter pylori asociado a úlcera péptica, en combinación [1].',
      ] },
    ] },
    { id: 'posologia', titulo: 'Posología', bloques: [
      { tabla: { columnas: ['Indicación (adultos)', 'Pauta orientativa'], filas: [
        ['Infección por anaerobios', '250 a 500 mg tres veces al día, en general hasta 7 días [1]'],
        ['Tricomoniasis', '2 g dosis única, o 250 mg tres veces al día 7 días, o 500 mg dos veces al día 5 a 7 días; tratar a la pareja [1]'],
        ['Vaginosis bacteriana', '500 mg dos veces al día 7 días, o 2 g dosis única [1]'],
        ['Amebiasis', '750 mg tres veces al día 5 a 10 días [1]'],
        ['Giardiasis', '250 mg tres veces al día 5 a 7 días, o 2 g al día 3 días [1]'],
        ['Helicobacter pylori', '500 mg dos o tres veces al día 7 a 14 días, en combinación [1]'],
      ] } },
      'En niños la dosis se calcula por peso; en recién nacidos prematuros puede acumularse en la primera semana [1].',
    ] },
    { id: 'contraindicaciones-y-advertencias', titulo: 'Contraindicaciones y advertencias', bloques: [
      'Contraindicado con hipersensibilidad a nitroimidazoles y en el primer trimestre del embarazo [1].',
      { lista: [
        'Duración no mayor de 10 días, salvo casos justificados con seguimiento: no puede excluirse actividad mutagénica [1].',
        'Neurotoxicidad: neuropatía periférica, convulsiones, encefalopatía y síndrome cerebeloso [1].',
        'Reacciones cutáneas graves: Stevens-Johnson, necrólisis epidérmica tóxica y pustulosis exantemática generalizada aguda [1].',
        'Hepatotoxicidad grave, a veces mortal, en el síndrome de Cockayne [1].',
        'Hemograma en dosis altas, tratamientos prolongados o antecedentes de discrasias [1].',
        'Orina oscura por metabolitos [1].',
      ] },
    ] },
    { id: 'interacciones', titulo: 'Interacciones', bloques: [
      { tabla: { columnas: ['Fármaco', 'Efecto', 'Manejo'], filas: [
        ['Alcohol', 'Reacción tipo disulfiram', 'Evitar durante el tratamiento y 48 h después [1]'],
        ['Disulfiram', 'Confusión y reacciones psicóticas', 'No combinar [1]'],
        ['Warfarina y anticoagulantes orales', 'Potencia el efecto y el riesgo de hemorragia', 'Vigilar y ajustar [1]'],
        ['Litio', 'Sube su concentración', 'Reducir o suspender el litio antes; vigilar litio, creatinina y electrolitos [1]'],
        ['Amiodarona', 'QT prolongado y torsade de pointes', 'Considerar ECG [1]'],
        ['Busulfán', 'Toxicidad grave por niveles altos', 'Evitar [1]'],
        ['Carbamazepina', 'Sube su concentración', 'Vigilar [1]'],
      ] } },
    ] },
    { id: 'reacciones-adversas', titulo: 'Reacciones adversas', bloques: [
      { lista: [
        'Frecuentes: sobreinfección por cándida; ardor uretral, disuria [1].',
        'De frecuencia no conocida: disgeusia, glositis, estomatitis, náuseas, vómito, dolor abdominal y diarrea [1].',
        'Raras o muy raras: colitis seudomembranosa, anafilaxia, agranulocitosis, encefalopatía, hepatitis y pancreatitis [1].',
      ] },
    ] },
    { id: 'embarazo-y-lactancia', titulo: 'Embarazo y lactancia', bloques: [
      'Contraindicado en el primer trimestre; en el segundo y el tercero, solo si el beneficio supera el riesgo. Pasa a la leche en concentraciones similares a las plasmáticas: no se usa durante la lactancia o se interrumpe la lactancia [1].',
    ] },
    { id: 'evidencia', titulo: 'Evidencia: espectro y relación PK/PD', bloques: [
      'El efecto del metronidazol depende de la concentración (Cmáx/CMI) [1], y la ficha técnica incluye pautas de dosis única de 2 g en la tricomoniasis y la vaginosis bacteriana [1]. Su espectro se limita a anaerobios y protozoos; en una infección mixta debe combinarse con un antibiótico activo contra aerobios [1].',
      'La gonorrea puede persistir aunque se haya eliminado la tricomona, por lo que no sustituye el estudio de otras infecciones de transmisión sexual [1].',
    ] },
    { id: 'regulacion', titulo: 'Situación regulatoria', bloques: [
      'Colombia: 71 registros sanitarios vigentes en suspensión oral, óvulos, cápsulas, tabletas, crema vaginal y solución inyectable [4]. En Estados Unidos se comercializa como Flagyl [2].',
    ] },
    { id: 'atencion-farmaceutica', titulo: 'Atención farmacéutica (modelo de Minnesota)', destacado: true, bloques: [
      { tabla: { columnas: ['Necesidad', 'Qué revisar con el metronidazol'], filas: [
        ['Indicación', 'Que la infección sea por anaerobios o protozoos; en la tricomoniasis, que se trate también a la pareja [1]'],
        ['Efectividad', 'Pauta y duración correctas según la indicación; no repetir tratamientos sin control [1]'],
        ['Seguridad', 'Alcohol (también en jarabes y enjuagues), warfarina, litio, amiodarona; primer trimestre del embarazo; síntomas neurológicos [1]'],
        ['Adherencia', 'Completar la pauta; la alteración del sabor y las náuseas pueden llevar a abandonarla [1]'],
      ] } },
      'Problemas típicos: reacción por alcohol (seguridad), INR elevado en un paciente anticoagulado (seguridad) y abandono por la alteración del sabor (adherencia). El seguimiento registra el estado de cada problema según el modelo [5].',
    ] },
    { id: 'experiencia-farmacoterapeutica', titulo: 'Experiencia farmacoterapéutica', destacado: true, bloques: [
      'Conocer lo que el paciente cree y teme de su medicamento previene problemas [5,6]. Con el metronidazol conviene explorar:',
      { lista: [
        'Las expectativas sobre el alcohol en reuniones o fechas especiales durante el tratamiento y en las 48 horas siguientes.',
        'La vergüenza o el temor al hablar de una infección de transmisión sexual y de tratar a la pareja.',
        'El sabor desagradable y las náuseas, que pueden llevar a abandonar la pauta.',
        'La alarma por la orina oscura, que es esperable [1].',
      ] },
    ] },
  ],
  referencias: [F.ftMetronidazol, F.dmFlagyl, F.pubchemMetronidazol, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [['Metronidazol para qué sirve (para pacientes)', '/articulos/metronidazol-para-que-sirve']],
  seo: {
    titulo: 'Metronidazol: farmacología, interacciones y atención',
    descripcion: 'Metronidazol: farmacoquímica, mecanismo, farmacocinética, posología por indicación, interacciones (alcohol, warfarina, litio) y atención farmacéutica.',
  },
};
