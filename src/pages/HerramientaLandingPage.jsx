import { useParams } from 'react-router-dom';
import ToolLanding from '../components/edvanta/ToolLanding';
import NotFound from './NotFound';
import { getHerramienta } from '../data/edvanta/herramientas';

/**
 * Landing individual de herramienta: /herramientas/:slug
 * Si el slug no existe, muestra 404 (no rompe la navegación).
 */
export default function HerramientaLandingPage() {
  const { slug } = useParams();
  const tool = getHerramienta(slug);
  if (!tool) return <NotFound />;
  return <ToolLanding tool={tool} />;
}
