import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  SECCIONES, articulosParaPacientes, cuerpoDelInicio, extraDeContigo,
} from '../../scripts/lib/enlaces-del-inicio.mjs';
import { COMUNIDADES } from '../data/comunidadesSalud.js';
import { articulos } from '../data/articulos.js';

const RAIZ = join(__dirname, '..', '..');
const enlaces = (html) => [...html.matchAll(/<a href="(\/[^"]*)"/g)].map((m) => m[1]);

describe('inicio con contenido y enlaces para los buscadores', () => {
  const cursos = [
    { title: 'Curso de Farmacoterapia de la Diabetes', to: '/curso-de-farmacoterapia-de-la-diabetes', area: 'Farmacología' },
    { title: 'Curso de Gestión de Calidad Farmacéutica', to: '/curso-de-gestion-de-calidad-farmaceutica', area: 'Calidad' },
  ];
  const pacientes = articulosParaPacientes(articulos, 30);

  it('el inicio enlaza las secciones, los cursos, los grupos de apoyo y los artículos para pacientes', () => {
    const html = cuerpoDelInicio({ cursos, comunidades: COMUNIDADES, articulosPacientes: pacientes });
    const hrefs = enlaces(html);
    expect(html).toMatch(/<h1>Estudia online y certifica tus conocimientos<\/h1>/);
    for (const [, href] of SECCIONES) expect(hrefs).toContain(href);
    for (const c of cursos) expect(hrefs).toContain(c.to);
    for (const c of COMUNIDADES) expect(hrefs).toContain(c.ruta);
    expect(pacientes.length).toBe(30);
    for (const a of pacientes) expect(hrefs).toContain(`/articulos/${a.slug}`);
    // Sin afirmaciones falsas: los cursos propios no son gratis completos.
    expect(html).toMatch(/la primera unidad es gratis/);
    expect(html).not.toMatch(/cursos gratis/i);
  });

  it('Contigo suma los grupos de apoyo y los artículos para pacientes', () => {
    const html = extraDeContigo({ comunidades: COMUNIDADES, articulosPacientes: pacientes });
    expect(enlaces(html).length).toBe(COMUNIDADES.length + pacientes.length);
  });

  it('nginx sirve inicio.html solo para «/» y lo redirige si se pide tal cual', () => {
    const conf = readFileSync(join(RAIZ, 'nginx.conf'), 'utf8');
    expect(conf).toMatch(/location = \/ \{\s*try_files \/inicio\.html \/index\.html;/);
    expect(conf).toMatch(/location = \/inicio\.html \{[\s\S]*?return 301 https:\/\/\$host\/;/);
    // Llaves balanceadas: un error aquí tumba todo el sitio.
    const sinComentarios = conf.split('\n').map((l) => l.replace(/#.*$/, '')).join('\n');
    expect((sinComentarios.match(/\{/g) || []).length).toBe((sinComentarios.match(/\}/g) || []).length);
  });
});
