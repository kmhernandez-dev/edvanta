/**
 * Registros profesionales: inmunoterapia oncológica (inhibidores de puntos de
 * control). Verificados el 22-nov-2026 en las fichas técnicas de CIMA
 * (Opdivo 1151014001, Tecentriq 1171220001, Imfinzi 1181322001,
 * Yervoy 11698001). Los arma src/data/vademecum/lib/altoCosto.js.
 */
const ANTICUERPO = ['Interacciones farmacocinéticas', 'No se esperan: es un anticuerpo monoclonal y no se metaboliza por el citocromo P450', 'Sin ajuste por esta vía [FT]'];
const VIG_INMUNO = ['Función tiroidea', 'Función hepática', 'Función renal', 'Síntomas respiratorios y digestivos'];
const PRF_CORTICOIDE = ['Interacción', 'Inició prednisona u otro inmunosupresor por otra causa antes de la primera dosis', 'Comunicar a oncología: la ficha técnica pide evitarlos antes de iniciar [FT]'];

export const INMUNOTERAPIA = [
  {
    slug: 'nivolumab',
    atc: 'L01FF01',
    clase: 'Anticuerpo monoclonal IgG4 anti-PD-1',
    marcas: ['Opdivo'],
    quimica: 'El nivolumab es un anticuerpo monoclonal humano de tipo inmunoglobulina G4 (IgG4) dirigido contra el receptor de muerte programada 1 (PD-1). Se presenta como concentrado de 10 mg/ml para perfusión intravenosa [FT].',
    diana: 'Bloquea el receptor PD-1 y su unión a PD-L1 y PD-L2',
    mec: [
      'El nivolumab se une al receptor PD-1 de los linfocitos T y bloquea su interacción con los ligandos PD-L1 y PD-L2. El PD-1 es un regulador negativo de la actividad de los linfocitos T; al bloquearlo, el nivolumab potencia sus respuestas, incluidas las antitumorales [FT].',
      'La misma activación inmunitaria explica sus reacciones adversas inmunorrelacionadas, que pueden afectar casi cualquier órgano y aparecer durante el tratamiento o después de terminarlo [FT].',
    ],
    pk: [
      ['Semivida terminal', 'Unos 25 días [FT]'],
      ['Aclaramiento', '7,9 ml/h con 3 mg/kg cada 2 semanas [FT]'],
      ['Metabolismo', 'No se metaboliza por el citocromo P450 [FT]'],
    ],
    pos: [
      ['Monoterapia en adultos', '240 mg cada 2 semanas o 480 mg cada 4 semanas, según la indicación [FT]'],
      ['Adolescentes desde 12 años con menos de 50 kg', '3 mg/kg cada 2 semanas o 6 mg/kg cada 4 semanas [FT]'],
      ['Melanoma, con ipilimumab', '1 mg/kg de nivolumab con 3 mg/kg de ipilimumab cada 3 semanas durante las 4 primeras dosis; después, nivolumab en monoterapia [FT]'],
    ],
    adm: [
      'Lo inicia y supervisa un médico con experiencia en el tratamiento del cáncer [FT].',
      'Infusión intravenosa de 30 o 60 minutos, según la dosis y la indicación [FT].',
      'No se recomienda escalar ni reducir la dosis: según la tolerancia, se retrasa o se suspende [FT].',
      'Cuando la indicación lo exige, la expresión de PD-L1 se evalúa con una prueba validada [FT].',
    ],
    adv: [
      'Reacciones adversas inmunorrelacionadas (neumonitis, colitis, hepatitis, nefritis, endocrinopatías y reacciones cutáneas): se evalúan para confirmar la causa y se manejan según el grado [FT].',
      'Vigilancia continuada al menos hasta 5 meses después de la última dosis [FT].',
      'Reacciones adversas cardíacas y pulmonares, sobre todo en combinación con ipilimumab [FT].',
      'Reacciones a la perfusión, incluidas reacciones graves [FT].',
      'Trazabilidad: registrar el nombre y el número de lote del medicamento biológico [FT].',
    ],
    int: [
      ANTICUERPO,
      ['Corticoides sistémicos e inmunosupresores', 'Pueden interferir con su actividad farmacodinámica si se usan antes de iniciar', 'Evitarlos antes de comenzar; después sí se usan para tratar las reacciones inmunorrelacionadas [FT]'],
    ],
    est: [
      ['CA209066 (CheckMate 066)', 'Melanoma avanzado sin tratamiento previo, BRAF no mutado', 'Fase 3, doble ciego, frente a dacarbacina; supervivencia global con hazard ratio de 0,42 [FT]'],
      ['CA209067 (CheckMate 067)', 'Melanoma avanzado', 'Fase 3, doble ciego: nivolumab con ipilimumab o nivolumab solo, frente a ipilimumab [FT]'],
      ['CA209238 (CheckMate 238)', 'Melanoma completamente resecado', 'Fase 3, doble ciego, adyuvante, frente a ipilimumab 10 mg/kg [FT]'],
    ],
    vig: VIG_INMUNO,
    prf: [PRF_CORTICOIDE],
    claves: [['Monoterapia', '240 mg cada 2 semanas o 480 mg cada 4 semanas [FT]'], ['Semivida', 'Unos 25 días [FT]']],
    rc: 'anti-PD-1 intravenoso para melanoma, pulmón, riñón, linfoma de Hodgkin y otros tumores; sus reacciones inmunorrelacionadas pueden aparecer meses después.',
    res: 'Se administra cada 2 o 4 semanas, solo, con ipilimumab o con quimioterapia. Su seguridad depende de reconocer a tiempo las reacciones inmunorrelacionadas, que pueden aparecer durante el tratamiento o meses después de terminarlo.',
    desc: 'Nivolumab (anti-PD-1): mecanismo de acción, dosis, farmacocinética, reacciones inmunorrelacionadas y atención farmacéutica, con la ficha técnica.',
  },
  {
    slug: 'atezolizumab',
    atc: 'L01FF05',
    clase: 'Anticuerpo monoclonal IgG1 anti-PD-L1',
    marcas: ['Tecentriq'],
    quimica: 'El atezolizumab es un anticuerpo monoclonal humanizado de tipo IgG1, con la fracción Fc modificada por ingeniería genética, dirigido contra el ligando PD-L1. Se produce en células de ovario de hámster chino [FT].',
    diana: 'Bloquea el ligando PD-L1 y su unión a PD-1 y B7.1',
    mec: [
      'El PD-L1 se expresa en células tumorales y en células inmunitarias que infiltran el tumor; al unirse a PD-1 y a B7.1 suprime la actividad de los linfocitos T. El atezolizumab se une al PD-L1, bloquea esas interacciones y libera la respuesta inmune antitumoral [FT].',
      'A diferencia del nivolumab y el pembrolizumab, que bloquean el receptor PD-1, el atezolizumab actúa sobre el ligando. Sus reacciones adversas inmunomediadas tienen el mismo origen: la activación del sistema inmune [FT].',
    ],
    pk: [
      ['Semivida de eliminación terminal', 'Unos 27 días [FT]'],
      ['Aclaramiento', '0,200 l/día [FT]'],
      ['Metabolismo', 'Se elimina por catabolismo; no se esperan interacciones metabólicas [FT]'],
      ['Insuficiencia renal leve o moderada', 'Sin diferencias clínicamente importantes en el aclaramiento [FT]'],
    ],
    pos: [
      ['Pauta habitual', '840 mg cada 2 semanas, 1.200 mg cada 3 semanas o 1.680 mg cada 4 semanas, según la indicación [FT]'],
      ['Duración', 'Hasta progresión o toxicidad inmanejable; en el tratamiento adyuvante, un tiempo definido por la indicación [FT]'],
    ],
    adm: [
      'Lo inicia y supervisa un médico con experiencia en el tratamiento del cáncer [FT].',
      'Infusión intravenosa; en algunas indicaciones la selección exige confirmar la expresión de PD-L1 con una prueba validada [FT].',
      'Se combina con quimioterapia u otros medicamentos según el tumor [FT].',
    ],
    adv: [
      'Reacciones adversas inmunomediadas: se evalúan para confirmar la causa; según la gravedad, se interrumpe el tratamiento y se administran corticoides [FT].',
      'Tras mejorar a grado 1 o menos, los corticoides se reducen de forma gradual durante al menos 1 mes [FT].',
      'Reacciones relacionadas con la perfusión [FT].',
      'Trazabilidad: registrar el nombre y el número de lote del medicamento biológico [FT].',
    ],
    int: [
      ['Interacciones farmacocinéticas', 'No se esperan: se elimina por catabolismo', 'Sin ajuste por esta vía [FT]'],
      ['Corticoides sistémicos e inmunosupresores', 'Pueden interferir con su actividad si se usan antes de iniciar', 'Evitarlos antes de comenzar; después sí se usan para tratar las reacciones inmunomediadas [FT]'],
    ],
    est: [
      ['IMvigor211', 'Carcinoma urotelial localmente avanzado o metastásico tratado antes con quimioterapia', 'Fase III, abierto, frente a quimioterapia (vinflunina, docetaxel o paclitaxel) [FT]'],
      ['IMvigor130', 'Carcinoma urotelial localmente avanzado o metastásico sin tratamiento previo', 'Fase III: atezolizumab en monoterapia y con quimioterapia basada en platino [FT]'],
      ['IMpower010', 'Cáncer de pulmón no microcítico resecado tras quimioterapia con cisplatino', 'Fase III aleatorizado, adyuvante [FT]'],
    ],
    vig: VIG_INMUNO,
    prf: [PRF_CORTICOIDE],
    claves: [['Dosis', '840 mg cada 2 semanas, 1.200 mg cada 3 o 1.680 mg cada 4 [FT]'], ['Semivida', 'Unos 27 días [FT]']],
    rc: 'anti-PD-L1 intravenoso para pulmón, vejiga, mama triple negativo e hígado; tres pautas equivalentes cada 2, 3 o 4 semanas.',
    res: 'Bloquea el ligando PD-L1 en lugar del receptor PD-1. Tiene tres pautas intercambiables según la indicación y, como los demás inhibidores de puntos de control, exige vigilar las reacciones inmunomediadas durante y después del tratamiento.',
    desc: 'Atezolizumab (anti-PD-L1): mecanismo de acción, pautas de 840, 1.200 y 1.680 mg, farmacocinética, reacciones inmunomediadas y atención farmacéutica.',
  },
  {
    slug: 'durvalumab',
    atc: 'L01FF03',
    clase: 'Anticuerpo monoclonal IgG1κ anti-PD-L1',
    marcas: ['Imfinzi'],
    quimica: 'El durvalumab es un anticuerpo monoclonal completamente humano de tipo inmunoglobulina G1 kappa (IgG1κ) dirigido contra el ligando PD-L1. Se administra por perfusión intravenosa [FT].',
    diana: 'Bloquea la interacción de PD-L1 con PD-1 y con CD80',
    mec: [
      'El PD-L1 es una respuesta inmunitaria adaptativa que ayuda a los tumores a evadir su detección; puede inducirse por señales inflamatorias como el interferón gamma. El durvalumab bloquea de forma selectiva la interacción de PD-L1 con PD-1 y con CD80 (B7.1), lo que libera la activación de los linfocitos T [FT].',
      'Se usa en monoterapia o combinado con quimioterapia basada en platino o con tremelimumab, según la indicación [FT].',
    ],
    pk: [
      ['Semivida terminal', 'Unos 18 días, calculada con el aclaramiento inicial [FT]'],
      ['Aclaramiento', 'Disminuye con el tiempo; 8,16 ml/h en estado estacionario al día 365 [FT]'],
      ['Insuficiencia renal leve o moderada', 'Sin efecto clínicamente significativo [FT]'],
    ],
    pos: [
      ['CPNM localmente avanzado tras quimiorradioterapia', '10 mg/kg cada 2 semanas o 1.500 mg cada 4 semanas, hasta un máximo de 12 meses [FT]'],
      ['Cáncer de pulmón microcítico en estadio limitado', '1.500 mg cada 4 semanas, hasta un máximo de 24 meses [FT]'],
      ['Carcinoma hepatocelular, monoterapia', '1.500 mg cada 4 semanas [FT]'],
      ['CPNM resecable, perioperatorio', '1.500 mg con quimioterapia basada en platino cada 3 semanas, 4 ciclos antes de la cirugía; después 1.500 mg cada 4 semanas, hasta 12 ciclos [FT]'],
    ],
    adm: [
      'Lo inicia y supervisa un médico con experiencia en el tratamiento del cáncer [FT].',
      'En el CPNM localmente avanzado, la selección tiene en cuenta la expresión tumoral de PD-L1 [FT].',
      'Infusión intravenosa; según la gravedad de la reacción adversa se suspende o se interrumpe de forma permanente [FT].',
    ],
    adv: [
      'Reacciones adversas inmunomediadas: evaluar para confirmar la causa; según la gravedad, suspender e iniciar corticoides o terapia endocrina [FT].',
      'Tras mejorar a grado 1 o menos, reducir los corticoides de forma progresiva [FT].',
      'Reacciones relacionadas con la perfusión [FT].',
      'Trazabilidad: registrar la marca y el número de lote del producto administrado [FT].',
    ],
    int: [
      ANTICUERPO,
      ['Corticoides sistémicos e inmunosupresores', 'Posible interferencia con su actividad si se usan antes de iniciar', 'No se recomiendan antes de comenzar, salvo dosis fisiológicas (hasta 10 mg/día de prednisona o equivalente) [FT]'],
    ],
    est: [
      ['PACIFIC', '713 pacientes con CPNM localmente avanzado no resecable tras quimiorradioterapia con platino', 'Aleatorizado, doble ciego, controlado con placebo [FT]'],
      ['AEGEAN', 'CPNM resecable', 'Fase III, doble ciego, controlado con placebo: durvalumab con quimioterapia con platino antes y después de la cirugía [FT]'],
      ['NIAGARA', 'Cáncer de vejiga músculo invasivo', 'Fase III, abierto: con gemcitabina y cisplatino en neoadyuvancia [FT]'],
      ['DUO-E', 'Cáncer de endometrio', 'Fase III, doble ciego, controlado con placebo, con quimioterapia con platino en primera línea [FT]'],
    ],
    vig: VIG_INMUNO,
    prf: [['Interacción', 'Recibe prednisona por encima de 10 mg/día antes de la primera dosis', 'Comunicar a oncología: la ficha técnica no la recomienda antes de iniciar [FT]']],
    claves: [['CPNM tras quimiorradioterapia', '10 mg/kg cada 2 semanas o 1.500 mg cada 4, hasta 12 meses [FT]'], ['Semivida', 'Unos 18 días [FT]']],
    rc: 'anti-PD-L1 intravenoso para pulmón, vías biliares, hígado, endometrio y vejiga; en el CPNM tras quimiorradioterapia se da hasta 12 meses.',
    res: 'Su uso más conocido es la consolidación del cáncer de pulmón no microcítico estadio III tras quimiorradioterapia, con un máximo de 12 meses. Antes de iniciarlo se revisan los corticoides que recibe el paciente.',
    desc: 'Durvalumab (anti-PD-L1): mecanismo de acción, dosis por indicación, farmacocinética, reacciones inmunomediadas, interacciones y atención farmacéutica.',
  },
  {
    slug: 'ipilimumab',
    atc: 'L01FX04',
    clase: 'Anticuerpo monoclonal IgG1κ anti-CTLA-4',
    marcas: ['Yervoy'],
    quimica: 'El ipilimumab es un anticuerpo monoclonal completamente humano de tipo IgG1κ dirigido contra el CTLA-4, producido en células de ovario de hámster chino mediante tecnología de ADN recombinante [FT].',
    diana: 'Bloquea el CTLA-4 y aumenta los linfocitos T efectores',
    mec: [
      'El antígeno 4 asociado al linfocito T citotóxico (CTLA-4) es un regulador clave de la actividad de los linfocitos T. El ipilimumab bloquea las señales inhibitorias que llegan por esa vía y aumenta el número de linfocitos T efectores que se movilizan contra el tumor [FT].',
      'Actúa en una fase más temprana de la respuesta inmune que los anti-PD-1; por eso se combina con nivolumab en varias indicaciones. Esa activación amplia explica sus reacciones inmunorrelacionadas, en especial las gastrointestinales [FT].',
    ],
    pk: [
      ['Semivida terminal', '15,4 días [FT]'],
      ['Aclaramiento sistémico', '16,8 ml/h [FT]'],
      ['Metabolismo', 'No se metaboliza por el citocromo P450 [FT]'],
    ],
    pos: [
      ['Melanoma, monoterapia', '3 mg/kg en 30 minutos cada 3 semanas, hasta un total de 4 dosis [FT]'],
      ['Melanoma, con nivolumab (desde 50 kg)', '3 mg/kg de ipilimumab con 1 mg/kg de nivolumab cada 3 semanas durante las 4 primeras dosis; después, nivolumab en monoterapia [FT]'],
    ],
    adm: [
      'Lo inicia y supervisa un especialista con experiencia en el tratamiento del cáncer [FT].',
      'El paciente debe recibir el régimen de inducción completo (4 dosis) según la tolerancia [FT].',
      'Infusión intravenosa; las pautas de combinación con nivolumab varían según el tumor [FT].',
    ],
    adv: [
      'Reacciones adversas inmunorrelacionadas gastrointestinales, hepáticas, cutáneas, endocrinas y neurológicas: sin otra causa identificada, la diarrea, las heces con sangre o la elevación de pruebas hepáticas se consideran inmunorrelacionadas [FT].',
      'Vigilancia continuada al menos hasta 5 meses después de la última dosis [FT].',
      'Con nivolumab: vigilar reacciones cardíacas y pulmonares, e interrumpir si son graves o recurrentes [FT].',
      'Trazabilidad: registrar el nombre y el número de lote del medicamento biológico [FT].',
    ],
    int: [
      ANTICUERPO,
      ['Corticoides sistémicos', 'Pueden interferir con su actividad si se usan en el nivel basal', 'Evitarlos antes de comenzar; se usan para tratar las reacciones inmunorrelacionadas [FT]'],
      ['Anticoagulantes', 'Aumentan el riesgo de hemorragia gastrointestinal, que es una reacción adversa del ipilimumab', 'Monitorizar con cuidado [FT]'],
    ],
    est: [
      ['MDX010-20', 'Melanoma avanzado tratado antes (IL-2, dacarbacina, temozolomida, fotemustina o carboplatino)', 'Fase 3, doble ciego: ipilimumab 3 mg/kg con o sin vacuna gp100, frente a gp100 sola [FT]'],
      ['CA184-169', 'Melanoma en estadio III o IV irresecable', 'Fase 3, doble ciego [FT]'],
      ['CA209067 (CheckMate 067)', 'Melanoma avanzado', 'Fase 3: nivolumab con ipilimumab o nivolumab solo, frente a ipilimumab [FT]'],
    ],
    vig: ['Ritmo intestinal y sangre en heces', 'Función hepática', 'Función tiroidea y otras hormonas', 'Piel'],
    prf: [['Interacción', 'Recibe warfarina o un anticoagulante oral', 'Monitorizar con cuidado: suma riesgo de hemorragia gastrointestinal [FT]']],
    claves: [['Melanoma, monoterapia', '3 mg/kg cada 3 semanas, 4 dosis [FT]'], ['Semivida', '15,4 días [FT]']],
    rc: 'anti-CTLA-4 intravenoso para melanoma y, con nivolumab, otros tumores; la colitis inmunorrelacionada es su toxicidad más vigilada.',
    res: 'Se usa en monoterapia en el melanoma (4 dosis) y combinado con nivolumab en varios tumores. La diarrea, las heces con sangre y la elevación de transaminasas se consideran inmunorrelacionadas mientras no se demuestre otra causa.',
    desc: 'Ipilimumab (anti-CTLA-4): mecanismo de acción, dosis con y sin nivolumab, farmacocinética, toxicidad inmunorrelacionada y atención farmacéutica.',
  },
];
