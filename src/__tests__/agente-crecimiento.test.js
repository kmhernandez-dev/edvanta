/**
 * Agente de Crecimiento (scripts/agente): lo que no puede fallar.
 *  - lee del HTML del servidor lo mismo que Google: título, canónica,
 *    robots, JSON-LD con precio, enlaces y palabras;
 *  - una regla repetida en muchas fichas es UNA acción de plantilla;
 *  - un precio anunciado distinto al que se cobra es prioridad alta;
 *  - el embudo calcula hacia atrás desde la venta y usa datos reales
 *    solo cuando los hay;
 *  - el reporte nunca inventa ventas cuando no hay tablero.
 */
import { describe, expect, it } from 'vitest';
import { senalesDePagina, tipoDePagina, enlacesInternos, jsonLd } from '../../scripts/agente/lib/extraer.mjs';
import { acciones, auditar, normalizar, rotacionDelDia } from '../../scripts/agente/lib/auditar.mjs';
import { calcularEmbudo, precioPromedioGuias, SUPUESTOS, tasasEfectivas } from '../../scripts/agente/lib/embudo.mjs';
import { tasasReales } from '../../scripts/agente/lib/metricas.mjs';
import { reporteMarkdown } from '../../scripts/agente/lib/reporte.mjs';

const ficha = ({ titulo = 'Curso de oratoria online gratis | Edvanta', precio = 60000, canonica = 'https://edvanta.co/curso-de-oratoria', robots = 'index, follow', enlaces = '', texto = 'palabra '.repeat(500) } = {}) => `<!doctype html><html><head>
<title>${titulo}</title>
<meta name="description" content="Curso de oratoria online y gratis para aprender a hablar en público con claridad. Certificado opcional." />
<link rel="canonical" href="${canonica}" />
<meta name="robots" content="${robots}" />
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Course","name":"Oratoria","provider":{"@type":"Organization","name":"Edvanta"},"offers":{"@type":"Offer","price":${precio},"priceCurrency":"COP"}}</script>
</head><body><h1>Curso de Oratoria</h1><p>Certificado de aprobación de Edvanta. ${texto}</p>${enlaces}
<script>var no = "cuenta";</script></body></html>`;

const PROPIOS = new Set(['/curso-de-oratoria']);

describe('extraer', () => {
  it('lee título, canónica, robots, precio y proveedor del HTML del servidor', () => {
    const s = senalesDePagina(ficha(), { url: 'https://edvanta.co/curso-de-oratoria', propios: PROPIOS });
    expect(s.tipo).toBe('curso-propio');
    expect(s.titulo).toBe('Curso de oratoria online gratis | Edvanta');
    expect(s.canonicaPropia).toBe(true);
    expect(s.indexable).toBe(true);
    expect(s.precio).toBe(60000);
    expect(s.moneda).toBe('COP');
    expect(s.proveedor).toBe('Edvanta');
    expect(s.mencionaCertificado).toBe(true);
    expect(s.palabras).toBeGreaterThan(500);
    expect(s.cantidadH1).toBe(1);
  });

  it('noindex por meta o por cabecera deja la página no indexable', () => {
    expect(senalesDePagina(ficha({ robots: 'noindex, follow' }), { url: 'https://edvanta.co/curso-de-oratoria' }).indexable).toBe(false);
    expect(senalesDePagina(ficha(), { url: 'https://edvanta.co/curso-de-oratoria', xRobots: 'noindex' }).indexable).toBe(false);
  });

  it('JSON-LD en @graph y con @type en lista; los bloques rotos se cuentan', () => {
    const html = '<script type="application/ld+json">{"@graph":[{"@type":["Book","Product"],"offers":{"@type":"Offer","price":"34900"}}]}</script><script type="application/ld+json">{roto</script>';
    const { objetos, invalidos } = jsonLd(html);
    expect(invalidos).toBe(1);
    const s = senalesDePagina(html, { url: 'https://edvanta.co/guia/x' });
    expect(s.tiposJsonLd).toEqual(expect.arrayContaining(['Book', 'Product']));
    expect(s.precio).toBe(34900);
    expect(objetos.length).toBeGreaterThan(1);
  });

  it('enlaces internos: sin estáticos, anclas ni repetidos; absolutos del sitio cuentan', () => {
    const html = '<a href="/curso-de-liderazgo">a</a><a href="https://edvanta.co/curso-de-liderazgo/">b</a><a href="/assets/x.js">c</a><a href="https://otro.com/x">d</a><a href="/guia/y#compra">e</a>';
    expect(enlacesInternos(html).sort()).toEqual(['/curso-de-liderazgo', '/guia/y']);
  });

  it('tipos de página', () => {
    expect(tipoDePagina('/cursos')).toBe('catalogo');
    expect(tipoDePagina('/guia/x')).toBe('guia');
    expect(tipoDePagina('/curso-de-x/clase/y')).toBe('clase');
    expect(tipoDePagina('/curso-de-x', new Set(['/curso-de-x']))).toBe('curso-propio');
    expect(tipoDePagina('/curso-de-x-en-edutin')).toBe('curso-curado');
  });
});

describe('auditar', () => {
  const propia = (opciones, ruta = '/curso-de-oratoria') => senalesDePagina(ficha(opciones), { url: `https://edvanta.co${ruta}`, propios: new Set([ruta]) });

  it('una ficha sana con enlaces a cursos, clases y guías no deja hallazgos', () => {
    const enlaces = '<a href="/curso-de-a">a</a><a href="/curso-de-b">b</a><a href="/curso-de-c">c</a><a href="/curso-de-oratoria/clase/x">x</a><a href="/guia/z">z</a>';
    const h = auditar([propia({ enlaces })], {
      palabrasClave: { '/curso-de-oratoria': 'Curso de oratoria' },
      precioCertificado: 60000,
      clasesPorCurso: new Map([['/curso-de-oratoria', 1]]),
      enlazadosDesdeCatalogo: new Set(['/curso-de-oratoria']),
      rutasSitemap: new Set(['/curso-de-oratoria']),
    });
    expect(h).toEqual([]);
  });

  it('precio anunciado distinto al que se cobra: alta (Ley 1480)', () => {
    const h = auditar([propia({ precio: 50000 })], { precioCertificado: 60000 });
    expect(h.find((x) => x.regla === 'precio-distinto')).toMatchObject({ severidad: 'alta' });
  });

  it('precio 0 no es engaño: es una decisión comercial para Karla', () => {
    const h = auditar([propia({ precio: 0 })], { precioCertificado: 60000 });
    expect(h.some((x) => x.regla === 'precio-distinto')).toBe(false);
    expect(h.find((x) => x.regla === 'certificado-sin-precio')).toMatchObject({ responsable: 'Karla' });
  });

  it('palabra clave sin tildes ni mayúsculas, canónica ajena, fuera del catálogo y del sitemap', () => {
    const h = auditar([propia({ titulo: 'Oratoria | Edvanta', canonica: 'https://edvanta.co/otra' })], {
      palabrasClave: { '/curso-de-oratoria': 'Curso de oratoria', '/curso-de-borrador': 'Curso de borrador' },
      enlazadosDesdeCatalogo: new Set(),
      rutasSitemap: new Set(['/curso-de-oratoria']),
    });
    const reglas = h.map((x) => x.regla);
    expect(reglas).toEqual(expect.arrayContaining(['palabra-clave-titulo', 'canonica', 'fuera-del-catalogo', 'fuera-del-sitemap']));
    expect(normalizar('Curso de Farmacología')).toBe('curso de farmacologia');
  });

  it('guía con precio distinto al de Hotmart y precio sin verificar hace más de 30 días', () => {
    const html = '<title>Guía</title><script type="application/ld+json">{"@type":["Book","Product"],"offers":{"@type":"Offer","price":27900}}</script>';
    const g = senalesDePagina(html, { url: 'https://edvanta.co/guia/x' });
    const h = auditar([g], { preciosGuias: { x: { valor: 34900, verificadoEl: '2026-09-01' } }, hoy: new Date('2026-11-19T12:00:00Z') });
    expect(h.map((x) => x.regla)).toEqual(expect.arrayContaining(['precio-distinto', 'precio-viejo']));
  });

  it('agrupa: el mismo problema en muchas fichas es una sola acción, primero lo que vende', () => {
    const fichas = ['/curso-de-a', '/curso-de-b', '/curso-de-c'].map((r) => propia({ canonica: `https://edvanta.co${r}` }, r));
    const curada = senalesDePagina(ficha({ canonica: 'https://edvanta.co/curso-de-z-en-edutin' }), { url: 'https://edvanta.co/curso-de-z-en-edutin' });
    const lista = acciones(auditar([...fichas, curada], {}));
    const cruzada = lista.filter((a) => a.regla === 'sin-venta-cruzada');
    expect(cruzada).toHaveLength(1);
    expect(cruzada[0].cantidad).toBe(3);
    expect(lista[0].tipo).toBe('curso-propio');
  });

  it('la rotación de Search Console da 10 distintas y cambia de un día a otro', () => {
    const urls = Array.from({ length: 30 }, (_, i) => `https://edvanta.co/curso-${String(i).padStart(2, '0')}`);
    const hoy = rotacionDelDia(urls, 10, new Date('2026-11-19T12:00:00Z'));
    const manana = rotacionDelDia(urls, 10, new Date('2026-11-20T12:00:00Z'));
    expect(new Set(hoy).size).toBe(10);
    expect(hoy).not.toEqual(manana);
  });
});

describe('embudo', () => {
  const precios = { certificado: 60000, guia: 30000 };

  it('calcula hacia atrás desde 100 ventas al día', () => {
    const e = calcularEmbudo({ precios, tasas: { visitaAInscripcion: 0.1, inscripcionAPago: 0.1, visitaAClicCompra: 0.1, clicACompra: 0.1 } });
    expect(e.certificados.inscripcionesDia).toBe(1000);
    expect(e.certificados.visitasDia).toBe(10000);
    expect(e.certificados.visitasMes).toBe(300000);
    expect(e.certificados.ingresoMesCop).toBe(180000000);
    expect(e.guias.clicsCompraDia).toBe(1000);
    expect(e.guias.visitasDia).toBe(10000);
    // Tope por clic = neto × parte para publicidad × venta por visita.
    expect(e.certificados.cpcMaximoCop).toBe(Math.round(60000 * (1 - SUPUESTOS.comisionMercadoPago) * SUPUESTOS.partePublicidad * 0.01));
  });

  it('brecha y multiplicador solo con datos reales', () => {
    expect(calcularEmbudo({ precios }).certificados.faltanDia).toBeNull();
    const e = calcularEmbudo({ precios, actual: { certificadosDia: 4, guiasDia: 0 } });
    expect(e.certificados.faltanDia).toBe(96);
    expect(e.certificados.multiplicador).toBe(25);
    expect(e.guias.multiplicador).toBeNull();
  });

  it('las tasas reales pisan los supuestos solo si son válidas y con volumen', () => {
    const { tasas, fuentes } = tasasEfectivas({ inscripcionAPago: 0.08, clicACompra: 7 });
    expect(tasas.inscripcionAPago).toBe(0.08);
    expect(fuentes.inscripcionAPago).toBe('real');
    expect(fuentes.clicACompra).toBe('supuesto');
    expect(tasasReales({ certificados: { totales: { inscripcionesPropias: 10 }, conversion: { inscripcionAPago: 20 } } })).toEqual({});
    expect(tasasReales({ certificados: { totales: { inscripcionesPropias: 300 }, conversion: { inscripcionAPago: 4.5 } } })).toEqual({ inscripcionAPago: 0.045 });
  });

  it('precio promedio de guías ignora las que no tienen precio', () => {
    expect(precioPromedioGuias({ a: { valor: 30000 }, b: { valor: 20000 }, c: { valor: null } })).toBe(25000);
  });
});

describe('reporte', () => {
  const base = {
    fecha: '2026-11-19',
    embudo: calcularEmbudo({ precios: { certificado: 60000, guia: 30000 } }),
    ...tasasEfectivas({}),
    resumen: { 'curso-propio': { paginas: 63, indexables: 63, sinProblemasGraves: 60, palabrasPromedio: 950 } },
    acciones: [],
    totalHallazgos: 0,
    indexarHoy: ['https://edvanta.co/curso-de-oratoria'],
    indexNow: 1,
    alertas: [],
    rastreo: { paginas: 63, errores: 0, segundos: 20 },
  };

  it('sin tablero no inventa ventas: lo dice y explica cómo conectarlo', () => {
    const md = reporteMarkdown({ ...base, tablero: { ok: false, motivo: 'Falta EDVANTA_ADMIN_TOKEN.' } });
    expect(md).toContain('Sin datos de ventas');
    expect(md).toContain('Falta EDVANTA_ADMIN_TOKEN.');
    expect(md).not.toMatch(/\| Certificados pagados \|/);
    expect(md).toContain('supuesto (cambia con datos reales)');
  });

  it('con tablero muestra hoy, promedio, meta y avisa si Hotmart no reporta', () => {
    const tablero = {
      ok: true,
      datos: {
        dias: 7, meta: { certificados: 100, guias: 100 },
        hoy: { certificados: 3, guias: 1, inscripciones: 40, clicsHotmart: 12 },
        promedio7: { certificados: 2.4, guias: 0.7, inscripciones: 35, clicsHotmart: 10 },
        certificados: { totales: { pagosAprobados: 17, ingresosCop: 1020000, inscripcionesPropias: 245, pagosIniciados: 30 } },
        guias: { hotmartConVentas: false },
      },
    };
    const md = reporteMarkdown({ ...base, tablero });
    expect(md).toContain('| Certificados pagados | 3 | 2 | 100 |');
    expect(md).toContain('Las ventas de Hotmart todavía no llegan al tablero');
  });
});
