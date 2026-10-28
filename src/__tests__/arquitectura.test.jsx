/**
 * La arquitectura de escuelas.
 *
 * Lo que se cuida aquí: que ningún enlace del menú o del pie lleve a una
 * página que no existe, que la oferta no invente fechas ni precios, que
 * pacientes y profesionales no se mezclen, y que el formulario solo diga
 * «recibido» cuando el servidor de verdad guardó la solicitud.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ESCUELAS_GROUPS, FOOTER_COLUMNS, MAIN_LINKS, NAV_INSTITUCIONES, NAV_PACIENTES, PUBLICOS_NAV, RECURSOS_GROUPS, TOP_LINKS, contextoDe,
} from '../config/navEdvanta';
import { ESCUELAS, cursoEnEscuela } from '../data/edvanta/escuelas';
import { ESTADOS } from '../data/edvanta/estados';
import {
  KITS_PROFESIONALES, PRODUCTOS, PRODUCTO_DESTACADO, formatoPrecio, productoPorSlug,
} from '../data/edvanta/productos';
import { RUTAS_CONTIGO } from '../data/edvanta/programas';
import { PAQUETES } from '../data/edvanta/servicios';
import { AREAS_CAPACITACION, areaPorSlug } from '../data/edvanta/capacitacion';
import FormularioSolicitud from '../components/formularios/FormularioSolicitud';

/** Las rutas declaradas en App.jsx, como expresiones regulares. */
function rutasDeLaApp() {
  const app = readFileSync(path.resolve(__dirname, '../App.jsx'), 'utf8');
  return [...app.matchAll(/<Route path="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((r) => r !== '*')
    .map((r) => new RegExp(`^${r.replace(/\/\*$/, '(/.*)?').replace(/:[a-zA-Z]+/g, '[^/]+')}/?$`));
}

describe('navegación', () => {
  const rutas = rutasDeLaApp();
  const existe = (to) => rutas.some((r) => r.test(to.split(/[?#]/)[0]));

  it('cada enlace del encabezado y del pie lleva a una ruta que existe', () => {
    const enlaces = [
      ...ESCUELAS_GROUPS.flatMap((g) => g.items.map((i) => i.to)),
      ...RECURSOS_GROUPS.flatMap((g) => g.items.map((i) => i.to)),
      ...MAIN_LINKS.map((l) => l.to),
      ...TOP_LINKS.map((l) => l.to),
      ...PUBLICOS_NAV.map((l) => l.to),
      ...NAV_PACIENTES.map((l) => l.to),
      ...NAV_INSTITUCIONES.map((l) => l.to),
      ...FOOTER_COLUMNS.flatMap((c) => c.links.map((l) => l.to)),
    ];
    const rotos = enlaces.filter((to) => !existe(to));
    expect(rotos).toEqual([]);
  });

  it('la franja de públicos elige el menú según la página', () => {
    expect(contextoDe('/pacientes/tiroides')).toBe('pacientes');
    expect(contextoDe('/instituciones')).toBe('instituciones');
    expect(contextoDe('/empresas/talento')).toBe('instituciones');
    expect(contextoDe('/cursos')).toBe('profesionales');
    expect(contextoDe('/pacientesx')).toBe('profesionales');
  });

  it('las páginas de cada escuela y producto también existen', () => {
    for (const e of ESCUELAS) expect(existe(`/escuelas/${e.slug}`)).toBe(true);
    for (const p of PRODUCTOS) if (p.to) expect(existe(p.to)).toBe(true);
    for (const r of RUTAS_CONTIGO) if (r.to) expect(existe(r.to)).toBe(true);
  });

  it('cada área de capacitación y cada paquete institucional tiene su ruta', () => {
    for (const a of AREAS_CAPACITACION) {
      expect(existe(`/empresas/${a.slug}`), a.slug).toBe(true);
      for (const r of a.relacionados) expect(areaPorSlug(r), `${a.slug} -> ${r}`).toBeTruthy();
    }
    for (const p of PAQUETES) {
      expect(existe(`/instituciones/paquetes/${p.slug}`), p.slug).toBe(true);
      for (const r of p.areasRelacionadas || []) expect(areaPorSlug(r), `${p.slug} -> ${r}`).toBeTruthy();
    }
  });
});

describe('oferta honesta', () => {
  it('el primer curso en vivo no tiene fecha, cupos ni precio inventados', () => {
    const p = productoPorSlug(PRODUCTO_DESTACADO);
    expect(p.tipo).toBe('curso_en_vivo');
    expect(p.estado).toBe('proxima_apertura');
    expect(p.fechaInicio).toBeNull();
    expect(p.cupos).toBeNull();
    expect(p.precio).toBeNull();
    expect(formatoPrecio(p.precio)).toBe('Valor por confirmar');
    expect(p.aclaraciones.join(' ')).toMatch(/no otorga el título/i);
  });

  it('todos los estados existen en el vocabulario común', () => {
    const estados = [
      ...ESCUELAS.flatMap((e) => e.recorridos.flatMap((r) => r.areas.map((a) => a.estado))),
      ...PRODUCTOS.map((p) => p.estado),
      ...RUTAS_CONTIGO.map((r) => r.estado),
      ...PAQUETES.map((p) => p.estado),
    ];
    for (const s of estados) expect(ESTADOS[s], s).toBeTruthy();
  });

  it('solo la ruta de tiroides está abierta; las demás no tienen página', () => {
    const abiertas = RUTAS_CONTIGO.filter((r) => r.estado === 'disponible');
    expect(abiertas.map((r) => r.slug)).toEqual(['tiroides']);
    for (const r of RUTAS_CONTIGO.filter((x) => x.estado !== 'disponible')) expect(r.to).toBeUndefined();
  });

  it('cada paquete institucional dice necesidad, público, entregables, modalidad y alcance', () => {
    for (const p of PAQUETES) {
      for (const k of ['necesidad', 'publico', 'modalidad', 'alcance']) expect(p[k], `${p.slug}.${k}`).toBeTruthy();
      expect(p.entregables.length).toBeGreaterThan(0);
    }
  });

  it('los kits no muestran precio tachado ni «Más vendido»', () => {
    for (const k of KITS_PROFESIONALES) {
      expect(k.kit.comparePrice).toBeNull();
      expect(k.kit.badge).toBeNull();
    }
  });
});

describe('profesionales y pacientes no se mezclan', () => {
  it('ningún producto para pacientes aparece como profesional y viceversa', () => {
    for (const p of PRODUCTOS) expect(['profesionales', 'pacientes']).toContain(p.publico);
    expect(PRODUCTOS.filter((p) => p.publico === 'pacientes').every((p) => p.programa === 'feliz-sin-tiroides')).toBe(true);
  });

  it('un curso sin área (el de pacientes) no cae en ninguna escuela', () => {
    const curso = { area: null, category: 'Tiroides y autocuidado' };
    for (const e of ESCUELAS) expect(cursoEnEscuela(curso, e)).toBe(false);
  });

  it('un curso de servicio farmacéutico aparece en Salud sin dejar Calidad', () => {
    const curso = { area: 'Calidad', category: 'Servicio farmacéutico' };
    const en = ESCUELAS.filter((e) => cursoEnEscuela(curso, e)).map((e) => e.slug);
    expect(en).toEqual(['salud', 'calidad']);
  });
});

describe('formulario de solicitud', () => {
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

  const llenar = () => {
    fireEvent.change(screen.getByLabelText(/tu nombre/i), { target: { value: 'Ana Gómez' } });
    fireEvent.change(screen.getByLabelText(/^correo/i), { target: { value: 'ana@prueba.co' } });
    fireEvent.click(screen.getByLabelText(/autorizo a edvanta/i));
  };

  const montar = () => render(
    <MemoryRouter>
      <FormularioSolicitud tipo="interes" referencia="operacion-segura-servicio-farmaceutico" roles={['auxiliar', 'regente']} boton="Registrar mi interés" />
    </MemoryRouter>,
  );

  it('dice «recibimos» solo cuando el servidor responde 201', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ status: 201, json: async () => ({ ok: true, id: 1 }) });
    vi.stubGlobal('fetch', fetchMock);
    montar();
    llenar();
    fireEvent.click(screen.getByRole('button', { name: /registrar mi interés/i }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toMatch(/recibimos tu solicitud/i));

    const cuerpo = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(cuerpo).toMatchObject({ tipo: 'interes', referencia: 'operacion-segura-servicio-farmaceutico', aceptaTratamiento: true, aceptaNovedades: false });
    expect(fetchMock.mock.calls[0][1].headers['X-Aula-Request']).toBe('1');
  });

  it('si el servidor falla, lo dice y ofrece WhatsApp: no finge el envío', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 500, json: async () => ({ error: { message: 'Algo falló' } }) }));
    montar();
    llenar();
    fireEvent.click(screen.getByRole('button', { name: /registrar mi interés/i }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/algo falló/i));
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('link', { name: /whatsapp/i }).getAttribute('href')).toContain('wa.me');
  });
});
