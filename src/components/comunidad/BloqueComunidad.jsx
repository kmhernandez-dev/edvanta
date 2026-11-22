/**
 * ============================================================
 *  BloqueComunidad.jsx — Ficha interactiva del grupo de apoyo, dentro del artículo
 *
 *  Aparece al terminar de leer. Pregunta «¿para quién buscas
 *  información?» y responde con el paso que le sirve a cada persona:
 *   · para mí o para un familiar → inscribirse al grupo de apoyo (con el
 *     rol ya marcado en la encuesta) o escribir por WhatsApp, y la guía
 *     para pacientes si el grupo tiene una;
 *   · profesional de la salud → el curso con certificado, la guía
 *     profesional y compartir el grupo con sus pacientes.
 *  Sin elegir, ya muestra qué hay en el grupo y cómo entrar.
 *
 *  Cada elección y cada clic se miden (`community_card_choice`,
 *  `community_join_clicked`, `course_clicked`, `guide_clicked`).
 * ============================================================
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Check, Copy, HeartHandshake, MessageCircle, ShieldCheck, Stethoscope, User, Users,
} from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { cortoDeComunidad, paraDeComunidad } from '../../lib/comunidades/seo';

const OPCIONES = [
  ['paciente', 'Para mí', User],
  ['cuidador', 'Para un familiar', HeartHandshake],
  ['profesional', 'Soy profesional de la salud', Stethoscope],
];

export default function BloqueComunidad({ comunidad, articuloSlug = '', origen = 'articulo' }) {
  const [quien, setQuien] = useState(null);
  const [copiado, setCopiado] = useState(false);
  if (!comunidad) return null;

  const corto = cortoDeComunidad(comunidad);
  const medir = (evento, extra = {}) => trackEvent(evento, { enfermedad: comunidad.slug, articulo: articuloSlug, origen, ...extra });
  const elegir = (id) => { setQuien(id); medir('community_card_choice', { quien: id }); };
  const inscripcion = `${comunidad.ruta}${quien && quien !== 'profesional' ? `?rol=${quien}` : ''}#inscripcion`;
  const guiaPaciente = comunidad.guia?.publico === 'pacientes' ? comunidad.guia : null;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(`https://edvanta.co${comunidad.ruta}`);
      setCopiado(true);
      medir('community_shared', { destino: 'copiar' });
    } catch { /* sin portapapeles: el enlace sigue visible */ }
  };

  return (
    <section className="mt-10 overflow-hidden rounded-[20px] border border-edvanta-teal/25 bg-white shadow-[0_24px_60px_-40px_rgba(3,29,92,.55)]">
      <div className="bg-gradient-to-br from-edvanta-mint/70 via-edvanta-mint/25 to-white p-6 sm:p-7">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-edvanta-tealdark">
          <Users className="h-4 w-4" aria-hidden="true" />
          Grupo de apoyo gratis
        </p>
        <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight text-edvanta-deep">
          Grupo de apoyo de {corto}
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-edvanta-ink/80">
          No tienes que resolverlo a solas. Un espacio por WhatsApp para {paraDeComunidad(comunidad)} y sus
          cuidadores: experiencias, preguntas y educación clara. No reemplaza a tu equipo de salud y no se
          comparten dosis ni datos clínicos.
        </p>

        <p className="mt-5 text-sm font-bold text-edvanta-deep">¿Para quién buscas información?</p>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="¿Para quién buscas información?">
          {OPCIONES.map(([id, texto, Icono]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={quien === id}
              onClick={() => elegir(id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
                quien === id
                  ? 'border-edvanta-blue bg-edvanta-blue text-white shadow-[0_10px_22px_-14px_rgba(8,46,134,.9)]'
                  : 'border-edvanta-teal/30 bg-white text-edvanta-deep hover:border-edvanta-teal hover:bg-edvanta-mint/50'
              }`}
            >
              {quien === id ? <Check className="h-4 w-4" aria-hidden="true" /> : <Icono className="h-4 w-4 text-edvanta-tealdark" aria-hidden="true" />}
              {texto}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-7" aria-live="polite">
        {quien === 'profesional' ? (
          <>
            <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-muted">Para tu práctica</p>
            {comunidad.curso && (
              <Link
                to={comunidad.curso.ruta}
                onClick={() => medir('course_clicked', { curso: comunidad.curso.ruta })}
                className="group mt-2 flex items-center justify-between gap-4 rounded-2xl border border-edvanta-blue/15 bg-edvanta-light/60 p-4 transition hover:border-edvanta-blue/40"
              >
                <span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.12em] text-edvanta-blue">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    Curso con certificado
                  </span>
                  <span className="mt-1 block font-display text-lg font-bold text-edvanta-deep group-hover:text-edvanta-blue">{comunidad.curso.nombre}</span>
                  <span className="mt-0.5 block text-sm text-edvanta-muted">Empieza por la primera unidad gratis; el curso completo incluye certificado verificable.</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-edvanta-blue" aria-hidden="true" />
              </Link>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {comunidad.curso && (
                <Link to={comunidad.curso.ruta} onClick={() => medir('course_clicked', { curso: comunidad.curso.ruta })} className="ed-btn ed-btn--primary">
                  Ver el curso
                  <ArrowRight aria-hidden="true" />
                </Link>
              )}
              {comunidad.guiaPro && (
                <Link to={comunidad.guiaPro.ruta} onClick={() => medir('guide_clicked', { tipo: 'profesional', guia: comunidad.guiaPro.ruta })} className="ed-btn ed-btn--outline">
                  Guía: {comunidad.guiaPro.nombre}
                </Link>
              )}
            </div>
            <p className="mt-5 text-sm leading-6 text-edvanta-ink/80">
              ¿Atiendes personas con {corto}? Compárteles el grupo de apoyo: es gratis y sin ventas dentro del grupo.{' '}
              <button type="button" onClick={copiar} className="inline-flex items-center gap-1 font-semibold text-edvanta-blue underline underline-offset-2">
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                {copiado ? 'Enlace copiado' : 'Copiar el enlace'}
              </button>
            </p>
          </>
        ) : (
          <>
            <ul className="grid gap-2 text-sm leading-6 text-edvanta-ink/80 sm:grid-cols-3">
              {comunidad.queEncuentras.map((t) => (
                <li key={t} className="flex gap-2 rounded-xl border border-edvanta-teal/15 bg-edvanta-mint/25 p-3">
                  <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-edvanta-tealdark" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to={inscripcion}
                onClick={() => medir('community_signup_started', { quien: quien || 'sin-elegir' })}
                className="ed-btn ed-btn--primary"
              >
                {quien ? 'Inscribirme en 1 minuto' : 'Inscribirme gratis'}
                <ArrowRight aria-hidden="true" />
              </Link>
              <a
                href={comunidad.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => medir('community_join_clicked', { destino: 'whatsapp', quien: quien || 'sin-elegir' })}
                className="ed-btn ed-btn--whatsapp"
              >
                <MessageCircle aria-hidden="true" />
                Entrar por WhatsApp
              </a>
              <Link to={comunidad.ruta} className="text-sm font-semibold text-edvanta-blue underline-offset-4 hover:underline">
                Ver el grupo de apoyo
              </Link>
              {comunidad.grupo && (
                <a
                  href={comunidad.grupo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => medir('community_join_clicked', { destino: 'grupo_fst' })}
                  className="text-sm font-semibold text-edvanta-tealdark underline decoration-edvanta-teal/40 underline-offset-4 hover:text-edvanta-blue"
                >
                  Grupo de Feliz Sin Tiroides
                </a>
              )}
            </div>
            {quien && guiaPaciente && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-edvanta-border bg-white p-4">
                <span>
                  <span className="block text-sm font-bold text-edvanta-deep">Guía para pacientes: {guiaPaciente.nombre}</span>
                  <span className="mt-0.5 block text-sm text-edvanta-muted">Material educativo para organizar el día a día. Se compra en Hotmart y no reemplaza la consulta.</span>
                </span>
                <Link to={guiaPaciente.ruta} onClick={() => medir('guide_clicked', { tipo: 'paciente', guia: guiaPaciente.ruta })} className="ed-btn ed-btn--outline ed-btn--sm">
                  Ver la guía
                </Link>
              </div>
            )}
          </>
        )}

        <p className="mt-5 flex gap-2 text-xs leading-5 text-edvanta-muted">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-teal" aria-hidden="true" />
          Contenido educativo. No diagnostica ni prescribe. Si tienes una urgencia, acude a tu servicio de salud.
        </p>
      </div>
    </section>
  );
}
