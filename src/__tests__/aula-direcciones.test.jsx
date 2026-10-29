/**
 * Direcciones del aula con nombre.
 *
 * - /aula/curso-de-…/clase/<clase> abre el curso y la clase por su nombre.
 * - Las viejas por id (/aula/curso/53/clase/812), que siguen en avisos y
 *   correos ya enviados, llevan a la vigente con la misma clase.
 * - Las páginas del curso reciben el id para hablar con la API.
 */
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../aula/api', () => ({ get: vi.fn(), post: vi.fn(), put: vi.fn(), del: vi.fn(), fileUrl: vi.fn() }));

/* eslint-disable import/first */
import { get } from '../aula/api';
import CursoParticipante, { useCourseData } from '../aula/pages/curso/CursoParticipante';
import { buscarClase, direccionVigente, rutaEnAula, rutasDelCurso } from '../aula/rutas';
/* eslint-enable import/first */

const CURSO = {
  courseId: 53,
  courseSlug: 'curso-de-farmacoterapia-de-la-diabetes',
  snapshot: {
    course: { id: 53, title: 'Farmacoterapia de la diabetes' },
    modules: [{
      id: 1,
      title: 'Antidiabéticos',
      lessons: [
        { id: 812, slug: 'metformina', title: 'Metformina' },
        { id: 813, slug: null, title: 'Clase sin nombre todavía' },
      ],
    }],
  },
  enrollment: {},
  lessonStates: {},
  videoProgress: {},
};

function Sonda() {
  const { courseId, rutas } = useCourseData();
  const { pathname, search } = useLocation();
  return <p data-testid="sonda">{`${pathname}${search}|${courseId}|${rutas.clase(812)}`}</p>;
}

const paginas = (
  <>
    <Route index element={<Sonda />} />
    <Route path="clase/:clase" element={<Sonda />} />
    <Route path="recursos" element={<Sonda />} />
  </>
);

const abrir = (inicio) => render(
  <MemoryRouter initialEntries={[inicio]}>
    <Routes>
      <Route path="/aula/:cursoRef" element={<CursoParticipante />}>{paginas}</Route>
      <Route path="/aula/curso/:courseId" element={<CursoParticipante />}>{paginas}</Route>
    </Routes>
  </MemoryRouter>,
);

const BASE = '/aula/curso-de-farmacoterapia-de-la-diabetes';

describe('aula · direcciones con nombre', () => {
  beforeEach(() => {
    get.mockReset();
    get.mockResolvedValue(CURSO);
  });
  afterEach(cleanup);

  it('arma la portada, cada clase y los recursos por su nombre', () => {
    const rutas = rutasDelCurso(CURSO);
    expect(rutas.base).toBe(BASE);
    expect(rutas.clase(812)).toBe(`${BASE}/clase/metformina`);
    // Sin nombre todavía, por id: el aula la abre igual.
    expect(rutas.clase(813)).toBe(`${BASE}/clase/813`);
    expect(rutas.recursos).toBe(`${BASE}/recursos`);
    expect(rutaEnAula({ courseId: 7 })).toBe('/aula/curso/7');
    expect(rutaEnAula({ courseId: 7, slug: 'curso-de-bpm' })).toBe('/aula/curso-de-bpm');
  });

  it('encuentra la clase por su nombre o, en una dirección vieja, por su id', () => {
    const clases = CURSO.snapshot.modules[0].lessons;
    expect(buscarClase(clases, 'metformina').id).toBe(812);
    expect(buscarClase(clases, '812').id).toBe(812);
    expect(buscarClase(clases, '813').id).toBe(813);
    expect(buscarClase(clases, 'no-existe')).toBeNull();
  });

  it('normaliza mayúsculas, barra final y nombres anteriores', () => {
    const rutas = rutasDelCurso(CURSO);
    expect(direccionVigente(`${BASE}/clase/metformina`, BASE, CURSO, rutas)).toBeNull();
    expect(direccionVigente(`${BASE}/`, BASE, CURSO, rutas)).toBe(BASE);
    expect(direccionVigente('/aula/Curso-De-Farmacoterapia-De-La-Diabetes', '/aula/Curso-De-Farmacoterapia-De-La-Diabetes', CURSO, rutas)).toBe(BASE);
    expect(direccionVigente('/aula/curso-viejo/recursos', '/aula/curso-viejo', CURSO, rutas)).toBe(`${BASE}/recursos`);
  });

  it('la dirección vieja por id lleva a la nueva con la misma clase y su consulta', async () => {
    abrir('/aula/curso/53/clase/812?desde=correo');
    await waitFor(() => expect(screen.getByTestId('sonda').textContent)
      .toBe(`${BASE}/clase/metformina?desde=correo|53|${BASE}/clase/metformina`));
    expect(get).toHaveBeenCalledWith('/me/courses/53', expect.anything());
  });

  it('por su nombre abre directo, y las páginas reciben el id para la API', async () => {
    abrir(`${BASE}/clase/metformina`);
    await waitFor(() => expect(screen.getByTestId('sonda').textContent).toBe(`${BASE}/clase/metformina|53|${BASE}/clase/metformina`));
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('/me/courses/curso-de-farmacoterapia-de-la-diabetes', expect.anything());
  });

  it('un nombre anterior del curso lleva al vigente', async () => {
    abrir('/aula/curso-de-diabetes/recursos');
    await waitFor(() => expect(screen.getByTestId('sonda').textContent).toBe(`${BASE}/recursos|53|${BASE}/clase/metformina`));
  });
});
