/**
 * ============================================================
 *  PaginaPublica — Direcciones de primer nivel: /curso-de-…
 *
 *  Los cursos viven en la raíz del sitio (edvanta.co/curso-de-…), así
 *  que aquí llega cualquier dirección de un solo tramo que no sea otra
 *  página. Lo que no es un curso es «página no encontrada».
 *
 *  · Curso en vivo (data/edvanta/productos.js, campo `to`) → su página.
 *  · /curso-… de un curso curado → su ficha; la API resuelve el slug.
 *  · /curso-… de un curso propio → se abre en el aula (redirección).
 * ============================================================
 */

import { lazy } from 'react';
import { useParams } from 'react-router-dom';
import { PRODUCTOS } from '../data/edvanta/productos';

const FichaDeCurso = lazy(() => import('./FichaDeCurso'));
const CursoEnVivo = lazy(() => import('./edvanta/CursoEnVivo'));
const NotFound = lazy(() => import('./NotFound'));

export default function PaginaPublica() {
  const { slugPublico = '' } = useParams();
  const producto = PRODUCTOS.find((p) => p.to === `/${slugPublico}`);
  if (producto) return <CursoEnVivo slug={producto.slug} />;
  if (/^curso-[a-z0-9-]+$/i.test(slugPublico)) return <FichaDeCurso key={slugPublico} modo="publico" slugPublico={slugPublico} />;
  return <NotFound />;
}
