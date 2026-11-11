/**
 * ============================================================
 *  EncuestaArea.jsx — /encuesta/:area (dirección vieja)
 *
 *  Las encuestas por área se unieron en una sola página por público
 *  (/unete/…), que recibe el área en el enlace. Esta dirección vivió
 *  un día; se conserva y redirige para no romper enlaces ya compartidos.
 * ============================================================
 */

import { Navigate, useParams } from 'react-router-dom';

const DESTINO = {
  calidad: '/unete/cursos?area=calidad',
  'farmacia-clinica': '/unete/cursos?area=farmacia-clinica',
  farmacologia: '/unete/cursos?area=farmacologia',
  'asuntos-regulatorios': '/unete/cursos?area=asuntos-regulatorios',
  webinars: '/unete/profesionales?area=webinars',
};

export default function EncuestaArea() {
  const { area } = useParams();
  return <Navigate to={DESTINO[area] || '/unete/profesionales'} replace />;
}
