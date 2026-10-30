/**
 * Tarjeta de acceso de la ficha de curso.
 *
 * Reproduce la composición de referencia: imagen arriba a todo el ancho,
 * una sola acción principal, una aclaración breve y hasta tres datos
 * esenciales. La lista extensa de características vive más abajo, en la
 * página, para que esta tarjeta no crezca.
 */

import { forwardRef, useEffect, useState } from 'react';
import { ArrowRight, ExternalLink, GraduationCap } from 'lucide-react';
import { Btn } from '../edvanta/ui';
import { apiUrl } from '../../config/api';
import { DatoCurso } from './PiezasCurso';

const imagen = (url) => (url && url.startsWith('/api') ? apiUrl(url) : url);

const AccesoCurso = forwardRef(function AccesoCurso({
  portada, titulo, propio, hayBoton, textoBoton, nota, hechos = [],
  onAccion, trabajando = false, error = '',
}, ref) {
  const [errorImagen, setErrorImagen] = useState(false);
  const src = imagen(portada);

  useEffect(() => { setErrorImagen(false); }, [portada]);

  return (
    <aside ref={ref} className="curso-hero-aside" aria-label="Acceso al curso">
      <div className="curso-card">
        <div className="curso-card-media">
          {src && !errorImagen ? (
            <img
              src={src}
              alt={`Portada de ${titulo}`}
              width="800"
              height="500"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              onError={() => setErrorImagen(true)}
            />
          ) : (
            <div className="curso-card-placeholder">
              <GraduationCap className="h-10 w-10" strokeWidth={1.6} aria-hidden="true" />
              <span>Portada del curso</span>
            </div>
          )}
        </div>

        <div className="curso-card-body">
          {hayBoton ? (
            <Btn
              variant="primary"
              size="lg"
              className="curso-cta"
              onClick={onAccion}
              loading={trabajando}
              loadingLabel="Un momento…"
              iconRight={propio ? ArrowRight : ExternalLink}
            >
              {trabajando ? 'Un momento…' : textoBoton}
            </Btn>
          ) : (
            <p className="curso-card-unavailable">
              Todavía no tenemos el enlace verificado de este curso.
            </p>
          )}

          {nota && <p className="curso-card-note">{nota}</p>}

          {error && (
            <p role="alert" className="curso-card-error">
              {error}
            </p>
          )}

          {hechos.length > 0 && (
            <ul className="curso-facts">
              {hechos.slice(0, 3).map(({ icon, texto }) => (
                <DatoCurso key={texto} icon={icon}>{texto}</DatoCurso>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
});

export default AccesoCurso;
