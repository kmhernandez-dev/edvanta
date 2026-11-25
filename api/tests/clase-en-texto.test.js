import { describe, expect, it } from 'vitest';
import { apoyoDeClase, htmlDeApoyo } from '../lib/clase-publica.js';

const bloques = [
  { type: 'video', data: { url: 'https://www.youtube.com/watch?v=x' } },
  { type: 'experiencia', data: { v: 1 } },
  { type: 'destacado', data: { title: 'En esta clase', html: '<p>Resume el alcance.</p>' } },
  { type: 'encabezado', data: { text: 'La clase en texto', level: 2 } },
  { type: 'texto', data: { html: '<p>La lectura.</p><script>alert(1)</script>' } },
  { type: 'destacado', data: { title: 'Puntos clave', html: '<ol><li>Uno</li></ol>' } },
  { type: 'destacado', data: { title: 'Actividad', html: '<p>Entrega en el aula.</p>' } },
  { type: 'encabezado', data: { text: 'Para profundizar', level: 2 } },
  { type: 'enlace', data: { url: 'https://example.org', title: 'Fuente' } },
  { type: 'encabezado', data: { text: 'Referencias', level: 3 } },
];

describe('la clase en texto de la página pública', () => {
  const apoyo = apoyoDeClase(bloques);

  it('trae el resumen, la lectura y los destacados, en orden', () => {
    expect(apoyo.map((p) => p.titulo || p.tipo)).toEqual(['En esta clase', 'La clase en texto', 'texto', 'Puntos clave']);
  });

  it('deja en el aula las actividades, los enlaces y los encabezados sin texto', () => {
    const html = htmlDeApoyo(apoyo);
    expect(html).not.toContain('Entrega en el aula');
    expect(html).not.toContain('Para profundizar');
    expect(html).not.toContain('Referencias');
  });

  it('sanea el HTML', () => {
    expect(htmlDeApoyo(apoyo)).not.toContain('<script');
    expect(htmlDeApoyo(apoyo)).toContain('<h2>La clase en texto</h2><p>La lectura.</p>');
  });

  it('sin bloques de texto no escribe nada', () => {
    expect(htmlDeApoyo(apoyoDeClase(bloques.slice(0, 2)))).toBe('');
  });
});
