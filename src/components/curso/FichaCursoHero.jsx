/**
 * Encabezado editorial de la ficha de curso.
 *
 * En escritorio son dos columnas: el contenido a la izquierda y la
 * tarjeta de acceso a la derecha. En móvil el orden del DOM ya deja el
 * botón temprano: migas, título, descripción breve, acceso, objetivo y
 * metadatos. El fondo es blanco, sin adornos.
 */

import { BookOpen, CheckCircle2, Clock, Globe, Layers } from 'lucide-react';
import { Breadcrumb } from '../edvanta/ui';
import AccesoCurso from './AccesoCurso';
import { Estrellas } from './PiezasCurso';

function resumenDePortada(resumen) {
  const texto = String(resumen || '').trim();
  if (texto.length <= 320) return texto;
  const corte = texto.slice(0, 320);
  const ultimo = Math.max(corte.lastIndexOf('. '), corte.lastIndexOf('; '), corte.lastIndexOf(', '));
  const base = ultimo > 160 ? corte.slice(0, ultimo) : corte;
  return `${base.replace(/[\s,;.]+$/, '')}…`;
}

export default function FichaCursoHero({
  ficha, nombre, propio, horas, resumenOpiniones, textoBoton, notaAcceso,
  hayBoton, onAccion, trabajando, error, tarjetaRef,
}) {
  const resumen = resumenDePortada(ficha.resumen);
  const totalClases = ficha.clases;
  const unidades = ficha.unidades;
  const mostrarCalificacion = resumenOpiniones?.total > 0;

  const hechos = [];
  if (unidades && totalClases) hechos.push({ icon: Layers, texto: `${unidades} unidades · ${totalClases} clases` });
  else if (totalClases) hechos.push({ icon: Layers, texto: `${totalClases} clases` });
  else if (unidades) hechos.push({ icon: Layers, texto: `${unidades} unidades` });
  if (horas) hechos.push({ icon: Clock, texto: horas });
  if (ficha.nivel) hechos.push({ icon: BookOpen, texto: `Nivel ${ficha.nivel.toLowerCase()}` });
  else if (ficha.idioma) hechos.push({ icon: Globe, texto: ficha.idioma });

  return (
    <header className="curso-hero">
      <div className="curso-container">
        <div className="curso-hero-grid">
          <div className="curso-hero-main">
            <div className="curso-hero-breadcrumb">
              <Breadcrumb
                items={[
                  { label: 'Inicio', to: '/' },
                  { label: 'Cursos', to: '/cursos' },
                  ...(ficha.categoria
                    ? [{ label: ficha.categoria, to: `/cursos?category=${encodeURIComponent(ficha.categoria)}` }]
                    : []),
                  { label: nombre },
                ]}
              />
            </div>

            <div className="curso-hero-intro">
              <h1 id="titulo-curso" className="curso-hero-title">{nombre}</h1>
              {resumen && <p className="curso-lead">{resumen}</p>}
            </div>

            <div className="curso-hero-details">
              {ficha.objetivo && (
                <div className="curso-objetivo">
                  <p className="curso-objetivo-label">Objetivo del curso</p>
                  <p>{ficha.objetivo}</p>
                </div>
              )}

              <ul className="curso-meta" aria-label="Datos del curso">
                {mostrarCalificacion && (
                  <li>
                    <Estrellas valor={resumenOpiniones.promedio} />
                    <span>{String(resumenOpiniones.promedio).replace('.', ',')}</span>
                    <a href="#valoraciones">
                      {resumenOpiniones.total} {resumenOpiniones.total === 1 ? 'opinión' : 'opiniones'}
                    </a>
                  </li>
                )}
                {propio && (
                  <li>
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Acceso gratis al contenido
                  </li>
                )}
                {horas && (
                  <li>
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {horas}
                  </li>
                )}
                {totalClases && (
                  <li>
                    <Layers className="h-4 w-4" aria-hidden="true" />
                    {totalClases} clases
                  </li>
                )}
                {ficha.nivel && (
                  <li>
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    Nivel {ficha.nivel.toLowerCase()}
                  </li>
                )}
              </ul>
            </div>
          </div>

          <AccesoCurso
            ref={tarjetaRef}
            portada={ficha.portada}
            titulo={nombre}
            propio={propio}
            hayBoton={hayBoton}
            textoBoton={textoBoton}
            nota={notaAcceso}
            hechos={hechos}
            onAccion={onAccion}
            trabajando={trabajando}
            error={error}
          />
        </div>
      </div>
    </header>
  );
}
