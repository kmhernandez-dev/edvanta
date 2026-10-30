/**
 * Contenido del curso: unidades y clases en acordeones.
 *
 * Cada unidad es un botón nativo (se abre con teclado sin trucos) con
 * `aria-expanded` y `aria-controls`. El panel se oculta con `hidden`, así
 * que los lectores de pantalla tampoco leen lo que está cerrado.
 */

import { useState } from 'react';
import { ChevronDown, Clock, PlayCircle } from 'lucide-react';

function duracion(minutos) {
  const m = Number(minutos) || 0;
  if (!m) return null;
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const resto = m % 60;
  return resto ? `${h} h ${resto} min` : `${h} h`;
}

export default function ContenidoCurso({ modulos }) {
  const [abiertas, setAbiertas] = useState(() => new Set([0]));

  if (!modulos?.length) return null;

  const alternar = (indice) => {
    setAbiertas((prev) => {
      const siguientes = new Set(prev);
      if (siguientes.has(indice)) siguientes.delete(indice);
      else siguientes.add(indice);
      return siguientes;
    });
  };

  return (
    <>
      <div className="curso-curriculum-tools">
        <button
          type="button"
          className="curso-toolbtn"
          onClick={() => setAbiertas(new Set(modulos.map((_, i) => i)))}
        >
          Expandir todo
        </button>
        <button
          type="button"
          className="curso-toolbtn"
          onClick={() => setAbiertas(new Set())}
        >
          Contraer todo
        </button>
      </div>

      <div className="curso-accordion">
        {modulos.map((modulo, indice) => {
          const abierta = abiertas.has(indice);
          const panelId = `unidad-${modulo.id}`;
          const botonId = `unidad-boton-${modulo.id}`;
          const clases = modulo.lessons.length;

          return (
            <section key={modulo.id} className="curso-accordion-item">
              <h3 className="m-0">
                <button
                  type="button"
                  id={botonId}
                  className="curso-accordion-btn"
                  aria-expanded={abierta}
                  aria-controls={panelId}
                  onClick={() => alternar(indice)}
                >
                  <span className="min-w-0">
                    <span className="curso-unit-label">Unidad {modulo.numero}</span>
                    <span className="curso-unit-title">{modulo.title}</span>
                  </span>
                  <span className="curso-unit-meta">
                    <span className="curso-unit-count">
                      {clases} {clases === 1 ? 'clase' : 'clases'}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 ${abierta ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                className="curso-accordion-panel"
                role="region"
                aria-labelledby={botonId}
                hidden={!abierta}
              >
                {modulo.lessons.map((clase, n) => (
                  <div key={clase.id} className="curso-lesson">
                    <span className="curso-lesson-number" aria-hidden="true">{n + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="curso-lesson-title">{clase.title}</span>
                      <span className="curso-lesson-meta">
                        {clase.hasVideo && (
                          <span>
                            <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
                            Video
                          </span>
                        )}
                        {duracion(clase.durationMinutes) && (
                          <span>
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {duracion(clase.durationMinutes)}
                          </span>
                        )}
                        {!clase.isRequired && <span>Opcional</span>}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
