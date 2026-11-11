/**
 * Control del código del sistema de gestión de diseño (auditoría 11-nov-2026).
 * Cada prueba corresponde a un hallazgo de docs/auditoria-diseno/REGISTRO.md y
 * evita que la acción correctiva se deshaga sin que nadie lo note.
 *
 * Alcance: lo que se pinta dentro de .edvanta-theme. Las aplicaciones con
 * interfaz propia y los paneles internos quedan fuera.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { COLORES_DEL_SISTEMA, IMAGENES_RETIRADAS } from '../data/auditoriaDiseno';

const RAIZ = join(__dirname, '..', '..');
const FUERA = [
  /components[\\/]fstApp[\\/]/, /components[\\/]vida360[\\/]/, /components[\\/]atenfarma[\\/]/,
  /pages[\\/]AtenFarmaWorkspace\.jsx$/, /pages[\\/]Vida360ProWorkspace\.jsx$/, /pages[\\/]Vida360Portal\.jsx$/,
  /pages[\\/]Admin[^\\/]*\.jsx$/, /aula[\\/]pages[\\/]admin[\\/]/, /components[\\/]admin[\\/]/, /__tests__/,
];

function archivosPublicos() {
  const salida = [];
  const recorrer = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) recorrer(p);
      else if (/\.(jsx?|css)$/.test(n)) salida.push(p);
    }
  };
  recorrer(join(RAIZ, 'src'));
  return salida.filter((p) => !FUERA.some((r) => r.test(relative(RAIZ, p))));
}

const ARCHIVOS = archivosPublicos().filter((p) => !/auditoriaDiseno.js$/.test(p)).map((p) => ({ ruta: relative(RAIZ, p), texto: readFileSync(p, 'utf8') }));
const hallar = (regex) => ARCHIVOS.flatMap(({ ruta, texto }) => (texto.match(regex) || []).map((m) => `${ruta}: ${m}`));

describe('Sistema de diseño: acciones correctivas que no deben deshacerse', () => {
  it('H3 · no hay tamaños de letra por debajo de 12 px', () => {
    expect(hallar(/text-\[(?:[0-9]|10|11)(?:\.\d+)?px\]|text-\[0\.[0-6]\d*rem\]/g)).toEqual([]);
  });

  it('H8 · no hay texto con degradado (bg-clip-text)', () => {
    expect(hallar(/\bbg-clip-text\b/g)).toEqual([]);
  });

  it('H6 · no hay radios fuera de la escala (8, 10, 14, 20, 28, completo)', () => {
    expect(hallar(/rounded-\[(?:[1-7]|9|1[1-35-9]|2[1-79]|3\d)px\]/g)).toEqual([]);
  });

  it('H7 · los colores de marca de Tailwind son los del sistema', () => {
    const tw = readFileSync(join(RAIZ, 'tailwind.config.js'), 'utf8');
    const bloque = tw.slice(tw.indexOf('edvanta: {'), tw.indexOf('}', tw.indexOf('edvanta: {')));
    const usados = bloque.match(/#[0-9A-Fa-f]{6}/g) || [];
    const fuera = usados.filter((h) => !COLORES_DEL_SISTEMA.includes(h.toUpperCase()));
    expect(fuera).toEqual([]);
  });

  it('H10 · solo se cargan las fuentes del sistema (sin Patrick Hand ni Fraunces global)', () => {
    const html = readFileSync(join(RAIZ, 'index.html'), 'utf8');
    expect(html).not.toMatch(/Patrick\+Hand|Fraunces/);
  });

  it('H9 · ninguna página usa imágenes retiradas', () => {
    const usos = IMAGENES_RETIRADAS.flatMap((img) => hallar(new RegExp(img.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')));
    expect(usos).toEqual([]);
  });
});

describe('Decisiones de la dueña (11-nov-2026)', () => {
  it('H13 · sin íconos en ficha en el catálogo y el héroe del inicio', () => {
    const piezas = ['src/components/edvanta/catalogo.jsx', 'src/components/Hero.jsx'].map((r) => readFileSync(join(RAIZ, r), 'utf8'));
    piezas.forEach((t) => expect(t).not.toMatch(/ds-icon-tile/));
  });

  it('H14 · sin insignias (Nuevo, Edvanta, Edutin, En vivo) sobre las portadas', () => {
    expect(hallar(/ds-insignia|<Insignia\b/g).filter((x) => !x.includes('.css'))).toEqual([]);
  });

  it('H15 · cada tarjeta de curso invita a «Estudiar gratis»', () => {
    const t = readFileSync(join(RAIZ, 'src/components/edvanta/catalogo.jsx'), 'utf8');
    expect(t).toMatch(/Estudiar gratis/);
  });
});
