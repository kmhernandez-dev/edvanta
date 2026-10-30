/**
 * Piezas compartidas de la ficha de curso.
 *
 * La ficha de Edvanta es una sola para todos los cursos: estos
 * componentes fijan el contenedor, el ritmo de las secciones y los
 * elementos que se repiten (datos, beneficios, resultados). El contenido
 * siempre viene de la ficha que entrega la API.
 */

import { Check, Star } from 'lucide-react';

export function CursoContainer({ className = '', children }) {
  return <div className={`curso-container ${className}`.trim()}>{children}</div>;
}

export function CursoSection({ id, first = false, className = '', children, ...rest }) {
  return (
    <section
      id={id}
      className={`curso-section ${first ? 'curso-section--first' : ''} ${className}`.trim()}
      {...rest}
    >
      <CursoContainer>{children}</CursoContainer>
    </section>
  );
}

export function CursoHeading({ as: Tag = 'h2', title, desc, className = '' }) {
  return (
    <div className={className}>
      <Tag className="curso-heading">{title}</Tag>
      {desc && <p className="curso-heading-desc">{desc}</p>}
    </div>
  );
}

export function DatoCurso({ icon: Icono, children }) {
  if (!children) return null;
  return (
    <li className="curso-fact">
      <Icono className="h-4 w-4" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

export function Estrellas({ valor, tamano = 'sm' }) {
  const px = tamano === 'md' ? 'h-[18px] w-[18px]' : 'h-4 w-4';
  return (
    <span className="curso-stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${px} ${n <= Math.round(valor) ? 'fill-[#F5B301] text-[#F5B301]' : 'text-[#D0D5DD]'}`}
        />
      ))}
    </span>
  );
}

export function BeneficioCurso({ icon: Icono, titulo, children }) {
  return (
    <div className="curso-benefit">
      <span className="curso-benefit-icon">
        <Icono className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div>
        <h3>{titulo}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

export function ResultadosCurso({ items, intro }) {
  if (!items?.length) return null;
  return (
    <>
      {intro && <p className="curso-outcomes-intro">{intro}</p>}
      <ul className="curso-outcomes">
        {items.map((resultado) => (
          <li key={resultado} className="curso-outcome">
            <span className="curso-outcome-icon">
              <Check className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span>{resultado}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
