import { describe, expect, it } from 'vitest';
import { COMUNIDADES } from '../data/comunidadesSalud.js';
import {
  DIFICULTADES, FORMATOS, INTERESES_COMUNIDAD, MAX_DIFICULTADES, ROLES_COMUNIDAD, TIEMPOS,
} from '../data/encuestaComunidades.js';
import * as api from '../../api/lib/aula/comunidades.js';

const ids = (lista) => lista.map(([id]) => id);

describe('encuesta de los grupos de apoyo', () => {
  it('el servidor conoce los mismos grupos y con la misma forma corta', () => {
    expect(Object.keys(api.GRUPOS).sort()).toEqual(COMUNIDADES.map((c) => c.slug).sort());
    for (const c of COMUNIDADES) expect(api.GRUPOS[c.slug], c.slug).toBe(c.apoyo.corto);
  });

  it('el servidor conoce los mismos enlaces de grupo de WhatsApp', () => {
    const enlaces = Object.fromEntries(COMUNIDADES.filter((c) => c.grupoWhatsapp).map((c) => [c.slug, c.grupoWhatsapp]));
    expect(api.GRUPOS_WHATSAPP).toEqual(enlaces);
    for (const url of Object.values(enlaces)) expect(url).toMatch(/^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+$/);
  });

  it('el servidor valida las mismas opciones que muestra el formulario', () => {
    expect(api.ROLES).toEqual(ids(ROLES_COMUNIDAD));
    expect(api.TIEMPOS).toEqual(ids(TIEMPOS));
    expect(api.INTERESES).toEqual(ids(INTERESES_COMUNIDAD));
    expect(api.FORMATOS).toEqual(ids(FORMATOS));
    expect(api.MAX_DIFICULTADES).toBe(MAX_DIFICULTADES);
  });

  it.each(COMUNIDADES.map((c) => [c.slug]))('%s tiene sus dificultades propias', (slug) => {
    const lista = DIFICULTADES[slug];
    expect(lista?.length).toBeGreaterThanOrEqual(4);
    expect(new Set(ids(lista)).size).toBe(lista.length);
    for (const [id, texto] of lista) {
      expect(id).toMatch(/^[a-z0-9-]{1,40}$/);
      expect(texto.length).toBeGreaterThan(3);
      expect(texto).not.toMatch(/\.$/);
    }
  });
});
