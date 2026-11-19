/**
 * La microcaché de nginx (escala de 100.000 visitas al día).
 *
 * No hay nginx en las pruebas, así que se revisa el archivo: que la caché
 * esté declarada donde nginx la acepta, que SOLO la usen páginas y
 * catálogos públicos (nunca el aula, pagos, admin ni nada con sesión) y
 * que esos bloques no tengan add_header (si lo tuvieran, perderían las
 * cabeceras de seguridad del servidor: nginx no las hereda).
 * El build de la imagen además corre `nginx -t`.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const nginx = readFileSync(path.join(process.cwd(), 'nginx.conf'), 'utf8');
const sinComentarios = nginx.split('\n').map((l) => l.replace(/#.*$/, '')).join('\n');

/** Los bloques location con su cabecera y su cuerpo. */
function bloques(texto) {
  const out = [];
  const re = /location\s+([^{]+)\{/g;
  let m;
  while ((m = re.exec(texto))) {
    let nivel = 1;
    let i = re.lastIndex;
    while (nivel > 0 && i < texto.length) {
      if (texto[i] === '{') nivel += 1;
      if (texto[i] === '}') nivel -= 1;
      i += 1;
    }
    out.push({ cabecera: m[1].trim(), cuerpo: texto.slice(re.lastIndex, i - 1) });
  }
  return out;
}

describe('microcaché de nginx', () => {
  it('las llaves están balanceadas', () => {
    const abre = (sinComentarios.match(/\{/g) || []).length;
    const cierra = (sinComentarios.match(/\}/g) || []).length;
    expect(abre).toBe(cierra);
  });

  it('proxy_cache_path está fuera del bloque server (contexto http)', () => {
    const iCache = sinComentarios.indexOf('proxy_cache_path');
    const iServer = sinComentarios.indexOf('server {');
    expect(iCache).toBeGreaterThan(-1);
    expect(iCache).toBeLessThan(iServer);
    expect(sinComentarios).toMatch(/keys_zone=edvanta_publico:\d+m/);
  });

  const conCache = bloques(sinComentarios).filter((b) => /proxy_cache\s+edvanta_publico\s*;/.test(b.cuerpo));

  it('la usan las fichas, el catálogo, el grafo profesional y la API pública', () => {
    const cabeceras = conCache.map((b) => b.cabecera).join('\n');
    expect(cabeceras).toMatch(/@curso_publico/);
    expect(cabeceras).toMatch(/= \/cursos/);
    expect(cabeceras).toMatch(/carreras\|rutas\|competencias/);
    expect(cabeceras).toMatch(/\/api\/\(courses\|/);
  });

  it('nunca se guarda en caché nada del aula, pagos, admin, sesión o escritura', () => {
    for (const b of conCache) {
      expect(b.cabecera).not.toMatch(/aula|admin|mp-webhook|create-preference|lead|cv|community|certificados|fst|vida360|academia/);
    }
    // La lista de la API pública es cerrada y solo de lectura.
    const api = conCache.find((b) => b.cabecera.includes('/api/'));
    const permitidas = api.cabecera.match(/\(([^)]+)\)/)[1].split('|');
    expect(permitidas.sort()).toEqual([
      'careers', 'certifications', 'clase-publica', 'companies', 'courses', 'cursos-edvanta', 'ficha',
      'groups', 'learning-paths', 'opportunities', 'projects', 'resources', 'search', 'skills',
    ]);
  });

  it('los bloques en caché no pierden las cabeceras de seguridad (sin add_header propio)', () => {
    for (const b of conCache) {
      expect(b.cuerpo, b.cabecera).not.toMatch(/add_header/);
      expect(b.cuerpo, b.cabecera).toMatch(/proxy_ignore_headers\s+Cache-Control\s+Expires\s*;/);
      expect(b.cuerpo, b.cabecera).not.toMatch(/proxy_ignore_headers[^;]*Set-Cookie/);
    }
  });

  it('si la API falla, se sirve la última copia buena', () => {
    expect(sinComentarios).toMatch(/proxy_cache_use_stale\s+error\s+timeout\s+updating[^;]*http_502[^;]*;/);
    expect(sinComentarios).toMatch(/proxy_cache_lock\s+on;/);
  });
});
