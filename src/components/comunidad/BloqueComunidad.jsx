/**
 * ============================================================
 *  BloqueComunidad.jsx — La comunidad de la enfermedad, dentro del artículo
 *
 *  Aparece al terminar de leer. Primero la comunidad del paciente
 *  (WhatsApp de Karla, número +57 300 633 2244), después la ruta del
 *  profesional (curso gratis y guía). No vende dentro del artículo:
 *  ofrece el siguiente paso y deja claro qué es y qué no es.
 *
 *  Cada clic se mide con `community_join_clicked`, con la enfermedad,
 *  el artículo de origen y el destino.
 * ============================================================
 */

import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, MessageCircle, ShieldCheck, Users } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

export default function BloqueComunidad({ comunidad, articuloSlug = '', origen = 'articulo' }) {
  if (!comunidad) return null;

  const entrar = () => {
    trackEvent('community_join_clicked', {
      enfermedad: comunidad.slug,
      articulo: articuloSlug,
      origen,
      destino: 'whatsapp',
    });
  };

  const abrirGuia = (tipo) => {
    trackEvent('guide_clicked', {
      enfermedad: comunidad.slug,
      articulo: articuloSlug,
      origen,
      tipo,
      guia: tipo === 'paciente' ? comunidad.guia?.ruta : comunidad.guiaPro?.ruta,
    });
  };

  const abrirCurso = () => {
    trackEvent('course_clicked', {
      enfermedad: comunidad.slug,
      articulo: articuloSlug,
      origen,
      curso: comunidad.curso?.ruta,
    });
  };

  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-edvanta-teal/25 bg-edvanta-mint/35">
      <div className="p-6 sm:p-7">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-edvanta-tealdark">
          <Users className="h-4 w-4" aria-hidden="true" />
          Comunidad de {comunidad.nombre}
        </p>
        <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight text-edvanta-deep">
          No tienes que resolverlo a solas
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-edvanta-ink/80">
          Un espacio para pacientes y cuidadores de {comunidad.nombre.toLowerCase()}: experiencias, preguntas y
          educación clara. No reemplaza a tu equipo de salud y no se comparten dosis ni datos clínicos.
        </p>

        <ul className="mt-4 grid gap-2 text-sm leading-6 text-edvanta-ink/80 sm:grid-cols-3">
          {comunidad.queEncuentras.map((t) => (
            <li key={t} className="rounded-xl border border-edvanta-teal/15 bg-white/70 p-3">{t}</li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={comunidad.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={entrar}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1fb959]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Entrar por WhatsApp
          </a>
          <Link
            to={comunidad.ruta}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-blue transition hover:bg-edvanta-light"
          >
            Conocer la comunidad
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {comunidad.grupo && (
            <a
              href={comunidad.grupo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('community_join_clicked', { enfermedad: comunidad.slug, articulo: articuloSlug, origen, destino: 'grupo_fst' })}
              className="text-sm font-semibold text-edvanta-tealdark underline decoration-edvanta-teal/40 underline-offset-4 hover:text-edvanta-blue"
            >
              Grupo de Feliz Sin Tiroides
            </a>
          )}
        </div>

        {(comunidad.curso || comunidad.guiaPro || comunidad.guia) && (
          <div className="mt-6 border-t border-edvanta-teal/20 pt-5">
            <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-muted">Si eres profesional de la salud</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              {comunidad.curso && (
                <Link to={comunidad.curso.ruta} onClick={abrirCurso} className="inline-flex items-center gap-1.5 font-semibold text-edvanta-blue hover:underline">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Curso gratis: {comunidad.curso.nombre}
                </Link>
              )}
              {comunidad.guiaPro && (
                <Link to={comunidad.guiaPro.ruta} onClick={() => abrirGuia('profesional')} className="inline-flex items-center gap-1.5 font-semibold text-edvanta-blue hover:underline">
                  Guía: {comunidad.guiaPro.nombre}
                </Link>
              )}
            </div>
          </div>
        )}

        {comunidad.guia?.publico === 'pacientes' && (
          <div className="mt-4 rounded-xl border border-edvanta-border bg-white p-4">
            <p className="text-sm font-bold text-edvanta-deep">Guía para pacientes: {comunidad.guia.nombre}</p>
            <p className="mt-1 text-sm leading-6 text-edvanta-muted">
              Material educativo para organizar el día a día. Se compra en Hotmart y no reemplaza la consulta.
            </p>
            <Link
              to={comunidad.guia.ruta}
              onClick={() => abrirGuia('paciente')}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline"
            >
              Ver la guía
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}

        <p className="mt-5 flex gap-2 text-xs leading-5 text-edvanta-muted">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-teal" aria-hidden="true" />
          Contenido educativo. No diagnostica ni prescribe. Si tienes una urgencia, acude a tu servicio de salud.
        </p>
      </div>
    </section>
  );
}
