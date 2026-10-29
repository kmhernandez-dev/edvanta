import { Navigate, useParams } from 'react-router-dom';
import ToolLanding from '../components/edvanta/ToolLanding';
import NotFound from './NotFound';
import { getHerramienta } from '../data/edvanta/herramientas';
import { direccionNueva } from '../data/edvanta/direcciones';

/**
 * Landing individual de herramienta: /herramientas/:slug
 * Si el slug no existe, muestra 404 (no rompe la navegación). Los slugs
 * viejos (cv-builder, perfil-empresas…) pasan al nuevo: nginx ya responde
 * 301; esto cubre un enlace viejo dentro del sitio.
 */
export default function HerramientaLandingPage() {
  const { slug } = useParams();
  const nueva = direccionNueva(`/herramientas/${slug}`);
  if (nueva) return <Navigate to={nueva} replace />;
  const tool = getHerramienta(slug);
  if (!tool) return <NotFound />;
  return <ToolLanding tool={tool} />;
}
