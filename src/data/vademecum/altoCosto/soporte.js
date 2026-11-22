/**
 * Registros profesionales: soporte en oncología (factores estimuladores de
 * colonias de granulocitos). Verificados el 22-nov-2026 en las fichas
 * técnicas de CIMA (Neupogen 64314, Neulasta 02227004).
 */
export const SOPORTE = [
  {
    slug: 'filgrastim',
    atc: 'L03AA02',
    clase: 'Factor estimulador de colonias de granulocitos (G-CSF) recombinante',
    marcas: ['Neupogen', 'Biosimilares de filgrastim'],
    quimica: 'El filgrastim es un factor estimulador de colonias de granulocitos humano (G-CSF) obtenido por tecnología de ADN recombinante [FT].',
    diana: 'Estimula la producción y liberación de neutrófilos desde la médula ósea',
    mec: [
      'El G-CSF humano es una glucoproteína que regula la producción y la liberación de neutrófilos funcionales desde la médula ósea. El filgrastim aumenta el recuento de neutrófilos en sangre periférica [FT].',
      'En la quimioterapia citotóxica reduce la duración de la neutropenia y la incidencia de neutropenia febril, salvo en la leucemia mieloide crónica y los síndromes mielodisplásicos [FT].',
    ],
    pk: [
      ['Semivida de eliminación sérica', 'Unas 3,5 horas [FT]'],
      ['Aclaramiento', 'Unos 0,6 ml/min/kg, de primer orden tras la vía subcutánea e intravenosa [FT]'],
    ],
    pos: [
      ['Quimioterapia citotóxica convencional', '0,5 MU (5 µg)/kg/día [FT]'],
      ['Inicio', 'Al menos 24 horas después de la quimioterapia citotóxica [FT]'],
      ['Tras trasplante de médula ósea', 'Dosis inicial de 1,0 MU (10 µg)/kg/día [FT]'],
    ],
    adm: [
      'Inyección subcutánea diaria hasta que los neutrófilos se recuperen según la ficha técnica [FT].',
      'Conservar entre 2 °C y 8 °C [FT].',
    ],
    adv: [
      'Esplenomegalia y ruptura esplénica: evaluar el dolor en la parte superior izquierda del abdomen o en el hombro [FT].',
      'Síndrome de fuga capilar, potencialmente mortal si se retrasa el tratamiento [FT].',
      'Dolor musculoesquelético, incluido el dolor óseo, entre las reacciones más frecuentes [FT].',
      'Glomerulonefritis: se recomienda el análisis de orina [FT].',
    ],
    int: [
      ['Quimioterapia citotóxica el mismo día', 'No se ha establecido su seguridad ni su eficacia', 'Respetar al menos 24 horas tras la quimioterapia [FT]'],
    ],
    evidencia: [
      'La ficha técnica respalda su uso para reducir la duración de la neutropenia y la incidencia de neutropenia febril en la quimioterapia citotóxica, además de la movilización de progenitores y la neutropenia crónica [FT].',
    ],
    vig: ['Hemograma', 'Dolor óseo', 'Dolor en el abdomen izquierdo o el hombro', 'Análisis de orina'],
    prf: [['Dosis inadecuada', 'Se aplica la primera dosis el mismo día de la quimioterapia', 'Corregir: al menos 24 horas después [FT]']],
    claves: [['Dosis', '5 µg/kg/día [FT]'], ['Semivida', 'Unas 3,5 horas [FT]']],
    rc: 'G-CSF subcutáneo diario para prevenir la neutropenia por quimioterapia; 5 µg/kg/día desde 24 horas después.',
    res: 'Se aplica a diario hasta la recuperación de los neutrófilos, empezando al menos 24 horas después de la quimioterapia. El dolor óseo es frecuente y el dolor en el abdomen izquierdo obliga a descartar una ruptura esplénica.',
    desc: 'Filgrastim (G-CSF): mecanismo de acción, 5 µg/kg/día, inicio 24 horas tras la quimioterapia, dolor óseo, ruptura esplénica, fuga capilar y seguimiento.',
  },
  {
    slug: 'pegfilgrastim',
    atc: 'L03AA13',
    clase: 'G-CSF pegilado de acción prolongada',
    marcas: ['Neulasta', 'Biosimilares de pegfilgrastim'],
    quimica: 'El pegfilgrastim es filgrastim conjugado con polietilenglicol (PEG). Su menor aclaramiento renal prolonga su permanencia en el organismo frente al filgrastim [FT].',
    diana: 'Estimula la producción de neutrófilos con una sola dosis por ciclo',
    mec: [
      'El pegfilgrastim estimula, como el G-CSF humano, la producción y liberación de neutrófilos funcionales. Su eliminación depende sobre todo de los propios neutrófilos: cuando se recuperan, se aclara más rápido [FT].',
      'Por eso basta una dosis por ciclo de quimioterapia [FT].',
    ],
    pk: [
      ['Eliminación', 'No lineal: el aclaramiento disminuye al aumentar la dosis [FT]'],
      ['Mecanismo de aclaramiento', 'Principalmente mediado por los neutrófilos, saturable a dosis altas [FT]'],
    ],
    pos: [
      ['Dosis', '6 mg (una jeringa precargada) por cada ciclo de quimioterapia [FT]'],
      ['Momento', 'A partir de las 24 horas después de la quimioterapia citotóxica [FT]'],
    ],
    adm: [
      'Inyección subcutánea única por ciclo [FT].',
      'No se ha evaluado su administración simultánea con la quimioterapia [FT].',
      'Registrar el nombre comercial y el lote para la trazabilidad [FT].',
      'Conservar en nevera (2 °C a 8 °C); puede dejarse a temperatura ambiente un tiempo limitado según la ficha técnica [FT].',
    ],
    adv: [
      'Esplenomegalia y ruptura esplénica, incluso mortal [FT].',
      'Síndrome de fuga capilar [FT].',
      'Dolor óseo muy frecuente y dolor musculoesquelético frecuente [FT].',
      'En la leucemia mieloide aguda, usar con precaución [FT].',
    ],
    int: [
      ['Quimioterapia citotóxica', 'Las células mieloides en división rápida son sensibles a la quimioterapia', 'Administrar a partir de 24 horas después; se administró de forma segura 14 días antes [FT]'],
    ],
    evidencia: [
      'La ficha técnica respalda una dosis única por ciclo para reducir la duración de la neutropenia y la incidencia de neutropenia febril en adultos con quimioterapia citotóxica [FT].',
    ],
    vig: ['Hemograma', 'Dolor óseo', 'Dolor en el abdomen izquierdo o el hombro', 'Edemas y disnea'],
    prf: [['Dosis inadecuada', 'Le aplican la jeringa el mismo día de la quimioterapia', 'Corregir: a partir de las 24 horas después [FT]']],
    claves: [['Dosis', '6 mg por ciclo [FT]'], ['Momento', 'Desde 24 horas tras la quimioterapia [FT]']],
    rc: 'G-CSF pegilado de una sola dosis por ciclo; 6 mg desde 24 horas después de la quimioterapia, con dolor óseo frecuente.',
    res: 'Una sola inyección por ciclo sustituye a las aplicaciones diarias de filgrastim. Se aplica al menos 24 horas después de la quimioterapia; el dolor óseo es muy frecuente y se educa sobre la ruptura esplénica.',
    desc: 'Pegfilgrastim: mecanismo de acción, 6 mg por ciclo, aplicación 24 horas tras la quimioterapia, dolor óseo, ruptura esplénica y atención farmacéutica.',
  },
];
