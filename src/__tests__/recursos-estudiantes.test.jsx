/**
 * /recursos-para-estudiantes-de-quimica-farmaceutica: la página que se
 * propone enlazar a facultades y gremios. Solo enlaza cursos que imparte
 * Edvanta, sin repetir, y su bloque para enlazar apunta a ella misma.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  CURSOS_POR_AREA, HERRAMIENTAS_CARRERA, HTML_PARA_ENLAZAR, PREGUNTAS_RECURSOS, RECURSOS_ESTUDIANTES,
  RUTA_RECURSOS_ESTUDIANTES, TOTAL_CURSOS_GRATIS, URL_RECURSOS_ESTUDIANTES,
} from '../data/edvanta/recursosEstudiantes';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const app = readFileSync(path.join(raiz, 'src', 'App.jsx'), 'utf8');

describe('Recursos para estudiantes de Química Farmacéutica', () => {
  it('enlaza cursos con dirección pública, sin repetir', () => {
    const rutas = CURSOS_POR_AREA.flatMap((a) => a.cursos.map(([to]) => to));
    expect(rutas.length).toBe(TOTAL_CURSOS_GRATIS);
    expect(new Set(rutas).size).toBe(rutas.length);
    for (const r of rutas) expect(r, r).toMatch(/^\/curso-(de|para)-[a-z0-9-]+$/);
  });

  it('el número de cursos de la descripción es el real', () => {
    expect(RECURSOS_ESTUDIANTES.seoDescription).toContain(`${TOTAL_CURSOS_GRATIS} cursos`);
    expect(RECURSOS_ESTUDIANTES.seoTitle.length).toBeLessThanOrEqual(60);
    expect(RECURSOS_ESTUDIANTES.seoDescription.length).toBeLessThanOrEqual(155);
  });

  it('la página y las herramientas existen en la aplicación', () => {
    expect(app).toContain(`path="${RUTA_RECURSOS_ESTUDIANTES}"`);
    for (const h of HERRAMIENTAS_CARRERA) expect(app.includes(`path="${h.to}"`), h.to).toBe(true);
  });

  it('el bloque para enlazar apunta a la página, sin parámetros', () => {
    expect(HTML_PARA_ENLAZAR).toContain(`href="${URL_RECURSOS_ESTUDIANTES}"`);
    expect(URL_RECURSOS_ESTUDIANTES).not.toMatch(/[?#]/);
    expect(PREGUNTAS_RECURSOS.length).toBeGreaterThanOrEqual(4);
  });
});
