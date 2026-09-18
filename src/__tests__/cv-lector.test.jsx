/**
 * Lectura y diagnóstico de hojas de vida (lector.js, diagnostico.js y el
 * orden de lectura de pdfText.js).
 */
import { describe, expect, it } from 'vitest';
import { aHojaDelCreador, detectarEncabezado, leerHojaDeVida, leerRango, mesesDeExperiencia } from '../lib/cv/lector';
import { diagnosticar, empiezaConVerbo, reescribir } from '../lib/cv/diagnostico';
import { ordenarPagina } from '../lib/cv/pdfText';

const HOY = new Date('2026-09-18T12:00:00Z');

const HV = `KARLA MARÍA HERNÁNDEZ
Química Farmacéutica
Barranquilla, Atlántico · +57 300 123 4567 · karla@correo.com · linkedin.com/in/karla-hernandez

PERFIL PROFESIONAL
Química farmacéutica con 6 años de experiencia en control de calidad y aseguramiento de calidad bajo BPM. Experiencia en validación de métodos, gestión de desviaciones y CAPA.

EXPERIENCIA LABORAL
Analista de Control de Calidad | Laboratorios Farmacéuticos ABC S.A.S.
Ene 2021 – Actual
• Reduje 25% el tiempo de liberación de lotes con un plan de muestreo por riesgo.
• Responsable de la revisión de certificados de análisis de materias primas.
• Lideré la validación de 4 métodos analíticos por HPLC sin desviaciones.

Auxiliar de Calidad
Droguería La Salud — Barranquilla
Mar 2018 - Dic 2020
- Apoyo en auditorías internas de BPM.
- Control de temperatura y cadena de frío.

FORMACIÓN ACADÉMICA
Química Farmacéutica — Universidad del Atlántico 2017
Especialización en Gerencia de la Calidad
Universidad del Norte, 2020

HABILIDADES
BPM, HPLC, Validación de métodos, CAPA, Excel avanzado, Power BI

IDIOMAS
Inglés B2 · Español nativo

REFERENCIAS
Disponibles a solicitud`;

describe('hoja de vida · lectura del texto', () => {
  const leida = leerHojaDeVida(HV, { hoy: HOY });

  it('reconoce nombre, título y contacto', () => {
    expect(leida.nombre).toBe('Karla María Hernández');
    expect(leida.titulo).toBe('Química Farmacéutica');
    expect(leida.contacto.email).toBe('karla@correo.com');
    expect(leida.contacto.telefono).toBe('+57 300 123 4567');
    expect(leida.contacto.linkedin).toBe('linkedin.com/in/karla-hernandez');
    expect(leida.contacto.ciudad).toBe('Barranquilla');
  });

  it('separa las secciones por sus encabezados', () => {
    expect(leida.seccionesDetectadas).toEqual(expect.arrayContaining(['perfil', 'experiencia', 'formacion', 'habilidades', 'idiomas', 'referencias']));
    expect(detectarEncabezado('EXPERIENCIA LABORAL:')).toBe('experiencia');
    expect(detectarEncabezado('Analista de calidad')).toBeNull();
  });

  it('arma cada cargo con empresa, fechas y logros', () => {
    expect(leida.experiencia).toHaveLength(2);
    const [primero, segundo] = leida.experiencia;
    expect(primero).toMatchObject({ cargo: 'Analista de Control de Calidad', empresa: 'Laboratorios Farmacéuticos ABC S.A.S.', inicio: 'Ene 2021', fin: 'Actual', actual: true });
    expect(primero.logros).toHaveLength(3);
    expect(segundo).toMatchObject({ cargo: 'Auxiliar de Calidad', inicio: 'Mar 2018', fin: 'Dic 2020' });
    expect(segundo.empresa).toContain('Droguería La Salud');
    expect(segundo.logros).toHaveLength(2);
  });

  it('suma la experiencia sin contar dos veces los periodos que se cruzan', () => {
    // Mar 2018 – Dic 2020 (34 meses) + Ene 2021 – Sep 2026 (69 meses)
    expect(leida.mesesExperiencia).toBe(103);
    const a = leerRango('2019 - 2021', HOY);
    const b = leerRango('Ene 2020 a Dic 2022', HOY);
    expect(mesesDeExperiencia([a, b])).toBe(48); // ene 2019 – dic 2022
  });

  it('lee estudios, habilidades e idiomas', () => {
    expect(leida.educacion[0]).toMatchObject({ titulo: 'Química Farmacéutica', institucion: 'Universidad del Atlántico', anio: '2017' });
    expect(leida.educacion[1]).toMatchObject({ titulo: 'Especialización en Gerencia de la Calidad', institucion: 'Universidad del Norte', anio: '2020' });
    expect(leida.habilidades).toEqual(['BPM', 'HPLC', 'Validación de métodos', 'CAPA', 'Excel avanzado', 'Power BI']);
    expect(leida.idiomas).toEqual([{ idioma: 'Inglés', nivel: 'B2' }, { idioma: 'Español', nivel: 'Nativo' }]);
  });

  it('pasa lo leído al formato del creador', () => {
    const cv = aHojaDelCreador(leida);
    expect(cv.nombre).toBe('Karla María Hernández');
    expect(cv.resumen).toContain('control de calidad');
    expect(cv.experiencia[0].logros.split('\n')).toHaveLength(3);
    expect(cv.experiencia[0].fin).toBe(''); // cargo actual: el creador lo muestra como «Actual»
    expect(cv.habilidades).toContain('HPLC');
  });
});

describe('hoja de vida · diagnóstico', () => {
  it('califica por categorías y detecta el cargo', () => {
    const d = diagnosticar(leerHojaDeVida(HV, { hoy: HOY }), { paginas: 1, columnas: 1, imagenes: 0, escaneado: false });
    expect(d.cargo.slug).toBe('analista-calidad');
    expect(d.cargo.detectado).toBe(true);
    expect(d.puntaje).toBeGreaterThanOrEqual(60);
    expect(d.categorias.map((c) => c.id)).toEqual(['estructura', 'contacto', 'logros', 'palabras', 'formato', 'redaccion']);
    expect(d.detectado.anosExperiencia).toBeCloseTo(8.6, 1);
    // Frases débiles con su reescritura sugerida
    expect(d.reescrituras.map((r) => r.original)).toEqual(expect.arrayContaining([
      'Responsable de la revisión de certificados de análisis de materias primas.',
    ]));
  });

  it('un PDF escaneado no pasa de 15 y lo dice primero', () => {
    const d = diagnosticar(leerHojaDeVida(HV, { hoy: HOY }), { paginas: 1, columnas: 1, imagenes: 1, escaneado: true });
    expect(d.puntaje).toBeLessThanOrEqual(15);
    expect(d.prioridades[0].titulo).toMatch(/imagen/i);
  });

  it('marca las dos columnas y los datos sensibles', () => {
    const conDatos = `${HV}\nCédula: 1.045.678.912\nEstado civil: soltera`;
    const d = diagnosticar(leerHojaDeVida(conDatos, { hoy: HOY }), { paginas: 1, columnas: 2, imagenes: 0, escaneado: false });
    const titulos = d.hallazgos.map((h) => h.titulo);
    expect(titulos).toContain('Diseño a dos columnas');
    expect(titulos.some((t) => t.startsWith('Datos personales que sobran'))).toBe(true);
  });

  it('una hoja de vida pobre queda por debajo de 60 con prioridades claras', () => {
    const pobre = 'Juan Pérez\nTrabajé en una farmacia atendiendo clientes.\nSoy responsable y puntual.';
    const d = diagnosticar(leerHojaDeVida(pobre, { hoy: HOY }), null, 'regente-farmacia');
    expect(d.puntaje).toBeLessThan(60);
    expect(d.nivel).toBe('bajo');
    expect(d.prioridades.length).toBeGreaterThan(2);
    expect(d.prioridades[0].como).toBeTruthy();
  });

  it('reconoce verbos de acción y reescribe frases débiles', () => {
    expect(empiezaConVerbo('Implementé un plan de muestreo')).toBe(true);
    expect(empiezaConVerbo('Reduje 20 % los reprocesos')).toBe(true);
    expect(empiezaConVerbo('Responsable del inventario')).toBe(false);
    expect(reescribir('Encargada de la dispensación de medicamentos'))
      .toBe('Gestioné la dispensación de medicamentos, logrando [resultado medible: %, tiempo o cantidad].');
  });
});

describe('hoja de vida · orden de lectura del PDF', () => {
  const it2 = (str, x, y, w = str.length * 5) => ({ str, x, y, w, h: 10 });

  it('lee una columna en orden de arriba abajo', () => {
    const items = [it2('Segunda línea', 50, 700), it2('Primera', 50, 720), it2('línea', 100, 720)];
    expect(ordenarPagina(items, 600)).toEqual({ texto: 'Primera línea\nSegunda línea', columnas: 1 });
  });

  it('en dos columnas lee el encabezado, luego la izquierda y luego la derecha', () => {
    const items = [
      it2('KARLA HERNÁNDEZ QUÍMICA FARMACÉUTICA', 40, 800, 420),
      // barra lateral
      it2('CONTACTO', 40, 740), it2('karla@correo.com', 40, 725), it2('HABILIDADES', 40, 700),
      it2('BPM', 40, 685), it2('HPLC', 40, 670), it2('Power BI', 40, 655),
      // columna principal (intercalada verticalmente con la lateral)
      it2('PERFIL PROFESIONAL', 260, 740), it2('Química farmacéutica con 6 años', 260, 725),
      it2('EXPERIENCIA LABORAL', 260, 700), it2('Analista de calidad', 260, 685),
      it2('Reduje 25% el tiempo de liberación', 260, 670), it2('Lideré 4 validaciones', 260, 655),
    ];
    const { texto, columnas } = ordenarPagina(items, 600);
    expect(columnas).toBe(2);
    const lineas = texto.split('\n').filter(Boolean);
    expect(lineas[0]).toBe('KARLA HERNÁNDEZ QUÍMICA FARMACÉUTICA');
    expect(lineas.indexOf('Power BI')).toBeLessThan(lineas.indexOf('PERFIL PROFESIONAL'));
    expect(lineas.indexOf('EXPERIENCIA LABORAL')).toBeLessThan(lineas.indexOf('Analista de calidad'));
  });

  it('normaliza viñetas y ligaduras', () => {
    const { texto } = ordenarPagina([it2('▪ Veriﬁqué 30 lotes', 50, 700)], 600);
    expect(texto).toBe('• Verifiqué 30 lotes');
  });
});

describe('hoja de vida · plantilla oficial Edvanta', () => {
  // Texto tal como lo extrae pdf.js del PDF que genera la plantilla oficial.
  const EXTRAIDO = `Karla María Hernández
Química Farmacéutica — Control de calidad
Barranquilla · +57 300 123 4567 · karla.hernandez@correo.com · linkedin.com/in/karla-hernandez

PERFIL PROFESIONAL
Química farmacéutica con 6 años de experiencia en control de calidad de materias primas y producto terminado bajo BPM.

EXPERIENCIA
Analista de Control de Calidad Ene 2021 – Actual
Laboratorios Farmacéuticos ABC S.A.S.
• Reduje 25% el tiempo de liberación de lotes con un plan de muestreo por riesgo.
• Lideré la validación de 4 métodos analíticos por HPLC sin desviaciones.
Auxiliar de Calidad Mar 2018 – Dic 2020
Droguería La Salud
• Apoyo en auditorías internas de BPM.

FORMACIÓN
Química Farmacéutica 2017
Universidad del Atlántico

HABILIDADES
BPM · HPLC · Validación de métodos · CAPA · Integridad de datos

CERTIFICACIONES Y CURSOS
• Buenas Prácticas de Manufactura · INVIMA · 2023

IDIOMAS
Inglés — B2 · Español — Nativo`;

  it('lo que produce la plantilla se lee completo', () => {
    const leida = leerHojaDeVida(EXTRAIDO, { hoy: HOY });
    expect(leida.seccionesDetectadas).toEqual(expect.arrayContaining(['perfil', 'experiencia', 'formacion', 'habilidades', 'certificaciones', 'idiomas']));
    expect(leida.experiencia.map((e) => [e.cargo, e.empresa, e.logros.length])).toEqual([
      ['Analista de Control de Calidad', 'Laboratorios Farmacéuticos ABC S.A.S.', 2],
      ['Auxiliar de Calidad', 'Droguería La Salud', 1],
    ]);
    expect(leida.habilidades).toEqual(['BPM', 'HPLC', 'Validación de métodos', 'CAPA', 'Integridad de datos']);
    expect(leida.certificaciones).toEqual(['Buenas Prácticas de Manufactura · INVIMA · 2023']);
  });

  it('reconoce títulos con letras espaciadas y logros sin viñeta', () => {
    expect(detectarEncabezado('E X P E R I E N C I A')).toBe('experiencia');
    expect(detectarEncabezado('P E R F I L  P R O F E S I O N A L')).toBe('perfil');
    const sinVinetas = leerHojaDeVida(`Ana Gil
EXPERIENCIA
Regente de Farmacia
Droguerías Unidas S.A.S.
Mar 2019 - Actual
Organicé la rotación de inventario en 2 sedes.
Atendí 150 fórmulas diarias.
Auxiliar de farmacia
Farmacia Central
2017 - 2019
Dispensación y control de vencimientos.`, { hoy: HOY });
    expect(sinVinetas.experiencia.map((e) => [e.cargo, e.empresa, e.logros.length])).toEqual([
      ['Regente de Farmacia', 'Droguerías Unidas S.A.S.', 2],
      ['Auxiliar de farmacia', 'Farmacia Central', 1],
    ]);
  });

  it('genera el PDF oficial con metadatos y nombre de archivo ordenado', async () => {
    const { generarCvPdf, nombreArchivo } = await import('../lib/cv/pdf');
    const cv = {
      nombre: 'Karla María Hernández', titulo: 'Química farmacéutica', email: 'k@correo.com', telefono: '+57 300 000 0000',
      ciudad: 'Barranquilla', linkedin: '', resumen: 'Perfil de prueba.',
      experiencia: [{ cargo: 'Analista', empresa: 'Laboratorio', inicio: 'Ene 2021', fin: '', logros: 'Logré 10 cosas.' }],
      educacion: [{ titulo: 'Química Farmacéutica', institucion: 'Universidad', anio: '2017' }],
      habilidades: ['BPM', 'HPLC'], certificaciones: [], idiomas: [{ idioma: 'Inglés', nivel: 'B2' }], referencias: [],
    };
    const doc = await generarCvPdf(cv, 'Analista de calidad', 'edvanta', { comprimir: false });
    expect(doc.getNumberOfPages()).toBe(1);
    const crudo = doc.output();
    expect(crudo).toContain('PERFIL PROFESIONAL');
    expect(crudo).toContain('EXPERIENCIA');
    expect(nombreArchivo(cv, 'Analista de calidad')).toBe('Karla-Hernandez-Analista-de-calidad.pdf');
    expect(nombreArchivo(cv, '', 'ats')).toBe('Karla-Hernandez-ATS.pdf');
    const ats = await generarCvPdf(cv, '', 'ats', { comprimir: false });
    expect(ats.output()).toContain('Karla Mar');
    expect(ats.output()).not.toContain('[object Object]');
  });
});
