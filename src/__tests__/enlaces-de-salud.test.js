/**
 * Enlaces de salud (api/lib/enlaces-de-salud.js): el vademécum y los
 * artículos enlazan a las clases abiertas que enseñan lo mismo, y las
 * clases enlazan de vuelta.
 *
 * Las clases viven en la base de datos, no en el repositorio: su lista
 * sale de producción en src/data/clases-abiertas.json (se regenera con
 * `node scripts/clases-abiertas.mjs`). Si una clase cambia de nombre o de
 * dirección, esta prueba falla hasta que se corrija la pareja.
 */
import { describe, expect, it } from 'vitest';
import CLASES_ABIERTAS from '../data/clases-abiertas.json';
import { PAGINAS_VADEMECUM, paginaDelVademecum } from '../data/vademecum';
import { articulos } from '../data/articulos';
import { htmlDePagina } from '../lib/vademecum/html.js';
import {
  ARTICULOS_A_CLASES, CURSOS_DE_SALUD, TITULOS_DE_CLASES, VADEMECUM_A_CLASES,
  clasesDelArticulo, clasesDelVademecum, cursoDeClase, htmlDeClasesDelArticulo, htmlDeLecturasDeClase, lecturasDeClase,
} from '../../api/lib/enlaces-de-salud.js';

const METFORMINA_DM = '/curso-de-farmacoterapia-de-la-diabetes/clase/metformina-mecanismo-indicaciones-dosificacion-y-ajuste';
const todasLasParejas = () => [
  ...Object.entries(VADEMECUM_A_CLASES).map(([slug, v]) => [`/vademecum/${slug}`, v.clases]),
  ...Object.entries(ARTICULOS_A_CLASES).map(([slug, a]) => [`/articulos/${slug}`, a.clases]),
];

describe('enlaces de salud', () => {
  it('la lista de clases abiertas de producción está completa', () => {
    const rutas = Object.keys(CLASES_ABIERTAS);
    expect(rutas.length).toBeGreaterThanOrEqual(367);
    for (const r of rutas) expect(r).toMatch(/^\/curso-de-[a-z0-9-]+\/clase\/[a-z0-9-]+$/);
  });

  it('cada clase enlazada existe en producción con el mismo título', () => {
    const malas = Object.entries(TITULOS_DE_CLASES).filter(([ruta, titulo]) => CLASES_ABIERTAS[ruta] !== titulo);
    expect(malas).toEqual([]);
  });

  it('cada pareja apunta a clases con título y curso conocidos, sin repetir', () => {
    for (const [pagina, clases] of todasLasParejas()) {
      expect(clases.length, pagina).toBeGreaterThan(0);
      expect(clases.length, pagina).toBeLessThanOrEqual(5);
      expect(new Set(clases).size, pagina).toBe(clases.length);
      for (const ruta of clases) {
        expect(TITULOS_DE_CLASES[ruta], `${pagina} → ${ruta}`).toBeTruthy();
        expect(cursoDeClase(ruta), `${pagina} → ${ruta}`).toBeTruthy();
      }
    }
    // Ningún título sobra: todos los usa alguna pareja.
    const usadas = new Set(todasLasParejas().flatMap(([, c]) => c));
    expect(Object.keys(TITULOS_DE_CLASES).filter((r) => !usadas.has(r))).toEqual([]);
  });

  it('cada página del vademécum existe, con el mismo nombre y el tipo correcto', () => {
    for (const [slug, v] of Object.entries(VADEMECUM_A_CLASES)) {
      const p = paginaDelVademecum(slug);
      expect(p, slug).toBeTruthy();
      expect(v.nombre, slug).toBe(p.nombre);
      expect(p.tipo, slug).toBe(v.grupo ? 'grupo' : 'medicamento');
      for (const k of v.cursos || []) expect(CURSOS_DE_SALUD[k], `${slug}: curso ${k}`).toBeTruthy();
    }
    expect(Object.keys(VADEMECUM_A_CLASES).length).toBeGreaterThanOrEqual(60);
    expect(PAGINAS_VADEMECUM.length).toBeGreaterThan(Object.keys(VADEMECUM_A_CLASES).length);
  });

  it('cada artículo existe, con el mismo título y el público correcto', () => {
    const porSlug = new Map(articulos.map((a) => [a.slug, a]));
    for (const [slug, a] of Object.entries(ARTICULOS_A_CLASES)) {
      const art = porSlug.get(slug);
      expect(art, slug).toBeTruthy();
      expect(a.titulo, slug).toBe(art.title);
      expect(a.paciente, slug).toBe(art.marca === 'contigo' || art.marca === 'fst');
    }
    expect(Object.keys(ARTICULOS_A_CLASES).length).toBeGreaterThanOrEqual(41);
  });

  it('la monografía de metformina escribe sus clases y cursos en el HTML', () => {
    const relacionadas = clasesDelVademecum('metformina');
    expect(relacionadas.clases[0]).toMatchObject({ ruta: METFORMINA_DM, curso: { nombre: 'Curso de Farmacoterapia de la Diabetes' } });
    expect(relacionadas.cursos.map((c) => c.ruta)).toEqual(['/curso-de-farmacoterapia-de-la-diabetes', '/curso-de-farmacologia-endocrina']);
    const html = htmlDePagina(paginaDelVademecum('metformina'), { clases: relacionadas });
    expect(html).toContain('<section id="clases">');
    expect(html).toContain(`<a href="${METFORMINA_DM}">Metformina: mecanismo, indicaciones, dosificación y ajuste por función renal</a>`);
    expect(html).toContain('<a href="/curso-de-farmacologia-endocrina">Curso de Farmacología Endocrina</a>');
  });

  it('un grupo lleva primero sus cursos, y una página sin clases no escribe la sección', () => {
    expect(clasesDelVademecum('medicamentos-para-la-diabetes-tipo-2').cursos[0].ruta).toBe('/curso-de-farmacoterapia-de-la-diabetes');
    const sinClases = clasesDelVademecum('trastuzumab');
    expect(sinClases).toEqual({ clases: [], cursos: [] });
    expect(htmlDePagina(paginaDelVademecum('trastuzumab'), { clases: sinClases })).not.toContain('id="clases"');
  });

  it('el artículo de metformina enlaza sus clases para profesionales', () => {
    expect(clasesDelArticulo('metformina-para-que-sirve').clases).toHaveLength(3);
    const html = htmlDeClasesDelArticulo('metformina-para-que-sirve');
    expect(html).toContain('id="clases-para-profesionales"');
    expect(html).toContain(`href="${METFORMINA_DM}"`);
    expect(html).toContain('Cursos completos, gratis: <a href="/curso-de-farmacoterapia-de-la-diabetes">');
    expect(htmlDeClasesDelArticulo('no-existe')).toBe('');
  });

  it('una clase sabe qué páginas la enlazan y las escribe de vuelta', () => {
    const lecturas = lecturasDeClase(METFORMINA_DM);
    expect(lecturas.vademecum[0]).toEqual({ nombre: 'Metformina', ruta: '/vademecum/metformina' });
    expect(lecturas.articulos).toContainEqual({ titulo: 'Metformina para qué sirve: usos, efectos y cuidados', ruta: '/articulos/metformina-para-que-sirve', paciente: true });
    // Cada página que enlaza a la clase aparece en sus lecturas.
    for (const [pagina, clases] of todasLasParejas()) {
      for (const ruta of clases) {
        const l = lecturasDeClase(ruta);
        expect([...l.vademecum, ...l.articulos].map((x) => x.ruta), `${ruta} ← ${pagina}`).toContain(pagina);
      }
    }
    const html = htmlDeLecturasDeClase(lecturas);
    expect(html).toContain('<h3>En el vademécum de Edvanta</h3>');
    expect(html).toContain('<h3>Para explicarle al paciente</h3>');
    expect(htmlDeLecturasDeClase({ vademecum: [], articulos: [] })).toBe('');
  });
});
