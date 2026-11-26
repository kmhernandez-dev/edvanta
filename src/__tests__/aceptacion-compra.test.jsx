import { describe, expect, it } from 'vitest';
import { act } from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TEXTO_ACEPTACION as TEXTO_SITIO, pedirAceptacion } from '../lib/aceptacionCompra.jsx';
import { TEXTO_ACEPTACION as TEXTO_SERVIDOR } from '../../api/lib/aula/checkout.js';

const RAIZ = join(__dirname, '..', '..');

describe('aceptación expresa antes de pagar un curso (Ley 1480, art. 47)', () => {
  it('el sitio muestra el mismo texto que guarda el servidor', () => {
    expect(TEXTO_SITIO).toBe(TEXTO_SERVIDOR);
  });

  it('«Ir al pago» sin la casilla no sigue: la señala; cancelar responde que no', async () => {
    let respuesta;
    await act(async () => { respuesta = pedirAceptacion(); });
    const dialogo = document.querySelector('[role="dialog"]');
    expect(dialogo).not.toBeNull();
    expect(dialogo.textContent).toContain('no aplica el derecho de retracto');
    const ir = [...dialogo.querySelectorAll('button')].find((b) => b.textContent === 'Ir al pago');
    expect(ir.getAttribute('aria-disabled')).toBe('true');
    await act(async () => { ir.click(); });
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    expect(dialogo.textContent).toContain('Marca la casilla para continuar');
    const cancelar = [...dialogo.querySelectorAll('button')].find((b) => b.textContent === 'Cancelar');
    await act(async () => { cancelar.click(); });
    await expect(respuesta).resolves.toBe(false);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('al aceptar responde que sí', async () => {
    let respuesta;
    await act(async () => { respuesta = pedirAceptacion(); });
    const dialogo = document.querySelector('[role="dialog"]');
    await act(async () => { dialogo.querySelector('input[type="checkbox"]').click(); });
    const ir = [...dialogo.querySelectorAll('button')].find((b) => b.textContent === 'Ir al pago');
    expect(ir.getAttribute('aria-disabled')).toBe('false');
    await act(async () => { ir.click(); });
    await expect(respuesta).resolves.toBe(true);
  });

  it('todos los caminos que compran un curso envían la aceptación', () => {
    const archivos = [
      'src/lib/misCursos.js',
      'src/aula/certificadoEstado.js',
      'src/aula/pages/curso/CertificadoCurso.jsx',
      'src/components/CartDrawer.jsx',
    ];
    for (const f of archivos) {
      const s = readFileSync(join(RAIZ, f), 'utf8');
      expect(s, f).toContain('pedirAceptacion()');
      expect(s, f).toContain('aceptaTerminos: true');
    }
  });
});
