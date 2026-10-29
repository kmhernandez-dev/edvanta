/**
 * ============================================================
 *  FichaDeCurso.jsx — Una sola página para los 224 cursos
 *
 *  Antes había tres plantillas (propios, cursos gratis y externos)
 *  que decían cosas distintas sobre lo mismo. Esta es una, y lo que
 *  cambia de un curso a otro no es la página: son las capacidades que
 *  el servidor declara y los datos que existan.
 *
 *  La regla que gobierna cada sección: si el dato no está, se dice, o
 *  no se pinta la sección. Nunca se rellena. Una ficha que promete un
 *  certificado que nadie confirmó o enseña un botón que no lleva a
 *  ninguna parte hace más daño que una ficha escueta.
 * ============================================================
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight, Award, BookOpen, Check, ChevronRight, Clock, ExternalLink, MessageCircle,
  GraduationCap, Globe, Layers, PlayCircle, UserRound,
} from 'lucide-react';

import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import {
  Breadcrumb, Btn, Card, Eyebrow, Faq, Section, SectionHeading, Steps,
} from '../components/edvanta/ui';
import { cleanHtml } from '../aula/ui/RichText';
import { apiUrl } from '../config/api';
import { nombreDeCurso } from '../lib/slug';
import { miAula, inscribirme } from '../lib/misCursos';
import {
  borrarComentario, comentarEnCurso, comentariosDeCurso, editarComentario,
  opinionesDeCurso, reportar,
} from '../lib/opiniones';
import ValoracionesDeCurso from '../components/opiniones/ValoracionesDeCurso';
import Comentarios from '../components/opiniones/Comentarios';
import { updatePageSeo } from '../utils/seo';
import { EDVANTA_WHATSAPP_URL } from '../config/links';

/* ── Utilidades ───────────────────────────────────────────── */

function duracion(minutos) {
  const m = Number(minutos) || 0;
  if (!m) return null;
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const resto = m % 60;
  return resto ? `${h} h ${resto} min` : `${h} h`;
}

const imagen = (url) => (url && url.startsWith('/api') ? apiUrl(url) : url);

/** Las secciones que esta ficha puede enseñar, según lo que tenga. */
function seccionesDe(f) {
  const s = [{ id: 'descripcion', label: 'Descripción' }];
  if (f.queAprenderas.length) s.push({ id: 'aprenderas', label: 'Qué aprenderás' });
  if (f.capacidades.verTemario) s.push({ id: 'contenido', label: 'Contenido' });
  s.push({ id: 'certificado', label: 'Certificado' });
  s.push({ id: 'valoraciones', label: 'Valoraciones' });
  s.push({ id: 'preguntas-curso', label: 'Preguntas' });
  s.push({ id: 'preguntas', label: 'Preguntas frecuentes' });
  return s;
}

/* ── Piezas ───────────────────────────────────────────────── */

function Dato({ icon: Icono, children }) {
  if (!children) return null;
  return (
    <li className="flex items-center gap-2.5 text-sm text-edvanta-deep">
      <Icono className="h-4 w-4 shrink-0 text-edvanta-teal" aria-hidden="true" />
      {children}
    </li>
  );
}

/** Navegación por secciones. Se desplaza en horizontal en móvil. */
function Anclas({ secciones, activa }) {
  return (
    <nav
      aria-label="Secciones de este curso"
      className="sticky top-16 z-20 border-y border-edvanta-border bg-white/95 backdrop-blur"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="edvanta-scrollbar-thin flex gap-1 overflow-x-auto">
          {secciones.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={activa === s.id ? 'true' : undefined}
                className={`inline-flex min-h-12 items-center whitespace-nowrap border-b-2 px-4 text-sm font-semibold transition ${
                  activa === s.id
                    ? 'border-edvanta-blue text-edvanta-blue'
                    : 'border-transparent text-edvanta-muted hover:text-edvanta-deep'
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/** El temario, abierto de par en par. Solo existe en los cursos propios. */
function Temario({ modulos }) {
  const [abiertas, setAbiertas] = useState(() => new Set([0]));
  const alternar = (i) => setAbiertas((prev) => {
    const s = new Set(prev);
    if (s.has(i)) s.delete(i); else s.add(i);
    return s;
  });

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <Btn size="sm" variant="secondary" onClick={() => setAbiertas(new Set(modulos.map((_, i) => i)))}>
          Expandir todo
        </Btn>
        <Btn size="sm" variant="ghost" onClick={() => setAbiertas(new Set())}>
          Contraer todo
        </Btn>
      </div>
      <div className="ds-card divide-y divide-edvanta-border overflow-hidden">
        {modulos.map((m, i) => {
          const abierta = abiertas.has(i);
          return (
            <section key={m.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => alternar(i)}
                  aria-expanded={abierta}
                  aria-controls={`unidad-${m.id}`}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left hover:bg-edvanta-bg"
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">
                      Unidad {m.numero}
                    </span>
                    <span className="mt-0.5 block text-[15px] font-bold text-edvanta-deep">{m.title}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="text-xs font-semibold text-edvanta-muted">
                      {m.lessons.length} {m.lessons.length === 1 ? 'clase' : 'clases'}
                    </span>
                    <ChevronRight
                      className={`h-5 w-5 text-edvanta-blue transition-transform ${abierta ? 'rotate-90' : ''}`}
                      aria-hidden="true"
                    />
                  </span>
                </button>
              </h3>
              <ol id={`unidad-${m.id}`} hidden={!abierta} className="border-t border-edvanta-border bg-edvanta-bg/40 px-5 py-3">
                {m.lessons.map((l, j) => (
                  <li key={l.id} className="flex items-start gap-3 py-2">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-[11px] font-bold text-edvanta-blue ring-1 ring-edvanta-border">
                      {j + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-6 text-edvanta-deep">{l.title}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-edvanta-muted">
                        {l.hasVideo && (
                          <span className="inline-flex items-center gap-1">
                            <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />Video
                          </span>
                        )}
                        {duracion(l.durationMinutes) && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />{duracion(l.durationMinutes)}
                          </span>
                        )}
                        {!l.isRequired && <span>Opcional</span>}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </>
  );
}

/**
 * El bloque de certificado. Va en TODAS las fichas, también cuando no
 * hay certificado: callarlo deja a la gente preguntándoselo, y es la
 * primera duda de cualquiera que mira un curso.
 */
function Certificado({ certificado: c, proveedor }) {
  const titulo = {
    available: 'Certificado al terminar',
    pending_confirmation: 'Información de certificación por confirmar',
    not_offered: 'Este curso no incluye certificado',
  }[c.estado];

  return (
    <Section id="certificado" tone="surface" bordered>
      <div className="gap-10 lg:grid lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)] lg:items-center">
        <div className="mb-8 lg:mb-0">
          {/* Proporción de documento horizontal. Sin imagen válida no se
              dibuja una credencial de mentira: se dice que no la hay. */}
          <div className="ds-surface-lavender relative flex aspect-[1.414/1] items-center justify-center overflow-hidden rounded-[var(--ds-r-xl)] px-6 text-center">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-edvanta-violet/20 blur-2xl" aria-hidden="true" />
            <div className="relative">
              <span className="ds-icon-tile ds-icon-tile--violet mx-auto h-16 w-16 rounded-2xl"><Award className="h-8 w-8" aria-hidden="true" /></span>
              <p className="mt-3 text-sm font-bold text-edvanta-deep">
                {c.estado === 'not_offered' ? 'Sin certificado' : 'Vista previa no disponible'}
              </p>
            </div>
          </div>
        </div>
        <div>
          <Eyebrow>Certificado</Eyebrow>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">{titulo}</h2>
          <p className="mt-3 text-base leading-7 text-edvanta-muted">{c.nota}</p>
          <ul className="mt-5 flex flex-col gap-2.5">
            <Dato icon={Award}>{c.emisor ? `Lo emite ${c.emisor}` : null}</Dato>
            <Dato icon={Check}>{c.condiciones}</Dato>
            <Dato icon={Clock}>{c.horas ? `${c.horas} horas certificadas` : null}</Dato>
          </ul>
          {c.estado === 'pending_confirmation' && proveedor?.enlace && (
            <Btn
              className="mt-6"
              variant="secondary"
              href={proveedor.enlace}
              external
              iconRight={ExternalLink}
            >
              Ver condiciones en {proveedor.nombre}
            </Btn>
          )}
        </div>
      </div>
    </Section>
  );
}

/**
 * Valoraciones y preguntas. Son dos hilos distintos a propósito: una
 * cosa es calificar el curso y otra preguntar si hace falta saber
 * estadística. Mezclarlos obliga a quien pregunta a poner estrellas a
 * algo que todavía no ha hecho.
 */
function Participacion({ ficha, refCurso }) {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    let vivo = true;
    opinionesDeCurso(refCurso).then((r) => {
      if (vivo && r.ok) setDatos(r.datos);
    });
    return () => { vivo = false; };
  }, [refCurso]);

  const puedo = datos?.puedo || { opinar: false, comentar: false, moderar: false };

  return (
    <>
      <Section id="valoraciones">
        <SectionHeading eyebrow="Opiniones" title="Valoraciones" />
        <div className="mt-8 lg:max-w-4xl">
          {datos ? (
            <ValoracionesDeCurso
              refCurso={refCurso}
              urlVolver={ficha.url}
              inicial={datos}
              exigeMatricula={datos.exigeMatricula}
              puedo={puedo}
            />
          ) : (
            <p className="text-sm text-edvanta-muted">Cargando valoraciones…</p>
          )}
          {/* Si algún día se muestran las del proveedor, irán aparte y
              con su fecha. Nunca sumadas a las de Edvanta. */}
          {ficha.valoracionesDelProveedor && (
            <p className="mt-6 text-sm text-edvanta-muted">
              Las valoraciones que {ficha.proveedor.nombre} publica en su sitio son suyas y
              no se mezclan con las de Edvanta.
            </p>
          )}
        </div>
      </Section>

      <Section id="preguntas-curso" tone="surface" bordered>
        <div className="lg:max-w-4xl">
          <Comentarios
            donde="curso"
            sitio={`curso-${refCurso}`}
            titulo="Preguntas y comentarios sobre este curso"
            descripcion="No hace falta haber hecho el curso para preguntar. Esto se lee en público, así que no pongas aquí datos personales."
            puedo={puedo}
            invitacion="Entra con tu cuenta para preguntar. Cualquiera puede leer las respuestas."
            cargar={(p) => comentariosDeCurso(refCurso, { pagina: p })}
            publicar={(cuerpo, padreId) => comentarEnCurso(refCurso, { cuerpo, padreId })}
            editar={(id, cuerpo) => editarComentario('curso', id, cuerpo)}
            borrar={(id) => borrarComentario('curso', id)}
            reportar={(id) => reportar('comentario_curso', id)}
          />
        </div>
      </Section>
    </>
  );
}

/* ── Página ───────────────────────────────────────────────── */

/**
 * La última ficha cargada por dirección: cuando una dirección vieja
 * (/curso/53, /cursos/<slug>) se cambia por la nueva, la página no vuelve
 * a pedir el curso que acaba de traer.
 */
const fichasRecientes = new Map();

/**
 * modo:
 *   publico → /curso-de-…        (la dirección de siempre)
 *   propio  → /curso/:id         (vieja: se cambia sola a la nueva)
 *   curado  → /cursos/:slug      (vieja: se cambia sola a la nueva)
 */
export default function FichaDeCurso({ modo = 'propio', slugPublico = '' }) {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const ref = modo === 'publico' ? String(slugPublico || params.slugPublico || '').toLowerCase()
    : modo === 'propio' ? `edvanta-${params.id}` : params.slug;

  const [ficha, setFicha] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [fallo, setFallo] = useState(null);
  const [estado, setEstado] = useState('visitante'); // visitante | fuera | dentro
  const [trabajando, setTrabajando] = useState(false);
  const [error, setError] = useState('');
  const [seccionActiva, setSeccionActiva] = useState('descripcion');

  useEffect(() => { window.scrollTo(0, 0); }, [ref]);

  useEffect(() => {
    let vivo = true;
    setFallo(null);
    const reciente = fichasRecientes.get(ref);
    if (reciente) {
      setFicha(reciente.data);
      setRelacionados(reciente.relacionados || []);
      return () => { vivo = false; };
    }
    setFicha(null);
    fetch(apiUrl(`/api/ficha/${encodeURIComponent(ref)}`))
      .then(async (r) => {
        const j = await r.json().catch(() => null);
        if (!vivo) return;
        if (!r.ok || !j?.ok) { setFallo(j?.error || 'No encontramos este curso.'); return; }
        if (fichasRecientes.size > 20) fichasRecientes.clear();
        if (j.data?.url?.startsWith('/curso-')) fichasRecientes.set(j.data.url.slice(1), j);
        setFicha(j.data);
        setRelacionados(j.relacionados || []);
      })
      .catch(() => { if (vivo) setFallo('No pudimos cargar el curso. Revisa tu conexión.'); });
    return () => { vivo = false; };
  }, [ref]);

  // Una dirección vieja (o un slug del historial) pasa a la vigente sin
  // dejar la vieja en el historial del navegador.
  useEffect(() => {
    if (ficha?.url && ficha.url.startsWith('/curso-') && ficha.url !== location.pathname) {
      navigate(`${ficha.url}${location.search}${location.hash}`, { replace: true });
    }
  }, [ficha, location.pathname, location.search, location.hash, navigate]);

  // Quién mira. Solo importa en los cursos propios, que son los que se cursan aquí.
  useEffect(() => {
    if (!ficha?.capacidades.inscribirse) return undefined;
    let vivo = true;
    miAula().then(({ sesion, cursos }) => {
      if (!vivo) return;
      if (!sesion) { setEstado('visitante'); return; }
      const id = Number(String(ficha.id).replace('edvanta-', ''));
      setEstado(cursos.some((c) => Number(c.courseId) === id) ? 'dentro' : 'fuera');
    });
    return () => { vivo = false; };
  }, [ficha]);

  const secciones = useMemo(() => (ficha ? seccionesDe(ficha) : []), [ficha]);

  // Qué sección se está leyendo, para marcarla en la navegación.
  useEffect(() => {
    if (!secciones.length) return undefined;
    const obs = new IntersectionObserver(
      (entradas) => {
        const visible = entradas.filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setSeccionActiva(visible.target.id);
      },
      { rootMargin: '-120px 0px -70% 0px' },
    );
    for (const s of secciones) {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [secciones]);

  useEffect(() => {
    if (!ficha) return;
    // «Curso de Gestión de Calidad | Edvanta»: el mismo nombre que el
    // encabezado de la página y que su dirección.
    const nombre = nombreDeCurso(ficha.titulo);
    updatePageSeo({
      title: `${nombre} | Edvanta`,
      description: ficha.resumen || `${nombre}: ${ficha.categoria || 'formación profesional'} en Edvanta.`,
      canonical: `https://edvanta.co${ficha.url}`,
      type: 'website',
      jsonLdId: `ficha-${ficha.id}`,
      // Solo lo que se ve en la página: nada de puntuaciones de ejemplo.
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: nombre,
        description: ficha.resumen || '',
        url: `https://edvanta.co${ficha.url}`,
        inLanguage: 'es',
        provider: { '@type': 'Organization', name: ficha.proveedor.nombre },
      },
    });
  }, [ficha]);

  const accion = useCallback(async () => {
    if (!ficha) return;
    setError('');
    if (!ficha.capacidades.inscribirse) {
      if (ficha.proveedor.enlace) window.open(ficha.proveedor.enlace, '_blank', 'noopener,noreferrer');
      return;
    }
    if (estado === 'dentro') { navigate(`/aula/curso/${String(ficha.id).replace('edvanta-', '')}`); return; }
    if (estado === 'visitante') {
      navigate(`/cuenta?modo=registro&next=${encodeURIComponent(ficha.url)}`);
      return;
    }
    setTrabajando(true);
    const res = await inscribirme(Number(String(ficha.id).replace('edvanta-', '')));
    setTrabajando(false);
    if (res.ok) { navigate(`/aula/curso/${String(ficha.id).replace('edvanta-', '')}`); return; }
    if (res.motivo === 'sin_sesion') {
      navigate(`/cuenta?modo=registro&next=${encodeURIComponent(ficha.url)}`);
      return;
    }
    setError(res.mensaje || 'No pudimos inscribirte. Intenta de nuevo en un momento.');
  }, [ficha, estado, navigate]);

  const descripcion = useMemo(() => cleanHtml(ficha?.descripcionHtml), [ficha?.descripcionHtml]);

  if (fallo) {
    return (
      <div className="min-h-screen bg-edvanta-bg">
        <SiteHeader />
        <Section>
          <SectionHeading as="h1" eyebrow="Curso" title={fallo}
            desc="Puede que lo hayamos retirado o que el enlace esté mal copiado. Estos son los cursos abiertos." />
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn to="/cursos">Ver todos los cursos</Btn>
            <Btn to="/" variant="secondary">Volver al inicio</Btn>
          </div>
        </Section>
        <SiteFooter />
      </div>
    );
  }

  if (!ficha) {
    return (
      <div className="min-h-screen bg-edvanta-bg">
        <SiteHeader />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center text-sm font-semibold text-edvanta-muted">
          Cargando el curso…
        </div>
      </div>
    );
  }

  const propio = ficha.capacidades.inscribirse;
  const textoBoton = propio
    ? { visitante: 'Crear cuenta gratis', fuera: 'Inscribirme gratis', dentro: 'Continuar aprendiendo' }[estado]
    : ficha.proveedor.accion;
  const pieBoton = propio
    ? { visitante: 'Gratis. Con tu cuenta vuelves aquí y entras al curso.',
      fuera: 'Gratis. Se abre en tu aula y puedes retomarlo cuando quieras.',
      dentro: 'Ya estás inscrito en este curso.' }[estado]
    : `El curso se estudia en ${ficha.proveedor.nombre}. Edvanta lo seleccionó, no lo imparte.`;

  const tarjeta = (
    <Card className="overflow-hidden p-0 shadow-[var(--ds-sh-lg)]">
      {ficha.portada ? (
        <img src={imagen(ficha.portada)} alt="" className="aspect-[16/9] w-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center" style={{ background: "var(--ds-grad-hero)" }} aria-hidden="true">
          <GraduationCap className="h-12 w-12 text-edvanta-blue/40" />
        </div>
      )}
      <div className="p-6">
        <ul className="flex flex-col gap-2.5">
          <Dato icon={Layers}>
            {ficha.unidades ? `${ficha.unidades} unidades · ${ficha.clases} clases` : null}
          </Dato>
          <Dato icon={Clock}>{duracion(ficha.duracionMinutos) || ficha.duracionTexto}</Dato>
          <Dato icon={BookOpen}>{ficha.nivel}</Dato>
          <Dato icon={Globe}>{ficha.idioma}</Dato>
          <Dato icon={UserRound}>{ficha.autoria}</Dato>
          <Dato icon={Award}>
            {ficha.certificado.estado === 'pending_confirmation' ? 'Certificado por confirmar' : null}
          </Dato>
        </ul>

        {ficha.capacidades.irAlProveedor || propio ? (
          <Btn size="lg" block variant={propio ? "gradient" : "primary"} className="mt-6" onClick={accion} loading={trabajando} loadingLabel="Un momento…"
            iconRight={propio ? ArrowRight : ExternalLink}>
            {trabajando ? 'Un momento…' : textoBoton}
          </Btn>
        ) : (
          // Un externo sin enlace no tiene a dónde mandar a nadie. Antes
          // que un botón que no hace nada, se explica por qué no lo hay.
          <p className="mt-6 rounded-xl bg-edvanta-bg px-4 py-3 text-center text-sm font-semibold text-edvanta-muted">
            Todavía no tenemos el enlace verificado de este curso.
          </p>
        )}
        <p className="mt-3 text-center text-xs leading-5 text-edvanta-muted">{pieBoton}</p>
        {error && (
          <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-center text-xs font-semibold text-red-700">
            {error}
          </p>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-edvanta-bg">
      <SiteHeader />

      {/* Héroe H (experiencia de curso): datos del curso a la izquierda y la
          tarjeta de inscripción, fija, a la derecha. */}
      <section className="ds-surface-diagonal relative overflow-hidden">
        <div className="ed-grid" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-edvanta-violet/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Breadcrumb className="mb-8" items={[
            { label: 'Inicio', to: '/' },
            { label: 'Cursos', to: '/cursos' },
            ...(ficha.categoria ? [{ label: ficha.categoria, to: `/cursos?category=${encodeURIComponent(ficha.categoria)}` }] : []),
            { label: nombreDeCurso(ficha.titulo) },
          ]} />
          <div className="gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:items-start">
            <div className="ds-rise">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`ds-chip ${propio ? '' : 'ds-chip--violet'}`}>
                  {propio ? <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" /> : <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
                  {propio ? 'Curso de Edvanta' : `Lo imparte ${ficha.proveedor.imparte}`}
                </span>
                {ficha.categoria && <Eyebrow>{ficha.categoria}</Eyebrow>}
              </div>
              <h1 className="mt-5 font-display text-[2rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-edvanta-blue sm:text-[2.75rem] lg:text-[3rem]">
                {nombreDeCurso(ficha.titulo)}
              </h1>
              {ficha.resumen && (
                <p className="mt-5 max-w-2xl text-lg leading-8 text-edvanta-muted">{ficha.resumen}</p>
              )}
              <ul className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-2">
                {[
                  ficha.clases ? { icon: Layers, t: `${ficha.clases} clases en ${ficha.unidades} unidades` } : null,
                  (duracion(ficha.duracionMinutos) || ficha.duracionTexto) ? { icon: Clock, t: duracion(ficha.duracionMinutos) || ficha.duracionTexto } : null,
                  ficha.nivel ? { icon: BookOpen, t: ficha.nivel } : null,
                  ficha.modalidad ? { icon: PlayCircle, t: ficha.modalidad } : null,
                ].filter(Boolean).map(({ icon: I, t }) => (
                  <li key={t} className="flex items-center gap-3 text-sm font-semibold text-edvanta-deep">
                    <span className="ds-icon-tile ds-icon-tile--teal h-9 w-9 shrink-0 rounded-[10px]"><I className="h-4 w-4" aria-hidden="true" /></span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="ds-rise-2 mt-10 lg:sticky lg:top-28 lg:mt-0">{tarjeta}</div>
          </div>
        </div>
      </section>

      {propio && (
        <Section tone="white" compact>
          <SectionHeading eyebrow="Cómo funciona" title="Estudias a tu ritmo, en el aula de Edvanta" />
          <Steps
            className="mt-10"
            items={[
              { icon: UserRound, title: 'Crea tu cuenta', desc: 'Es gratis y con ella entras al aula.' },
              { icon: PlayCircle, title: 'Estudia a tu ritmo', desc: 'Clases con video y texto de apoyo.' },
              { icon: BookOpen, title: 'Profundiza', desc: 'Documentos oficiales y lecturas para ampliar.' },
              { icon: Check, title: 'Retoma cuando quieras', desc: 'Tu avance queda guardado clase a clase.' },
            ]}
          />
        </Section>
      )}

      <Anclas secciones={secciones} activa={seccionActiva} />

      <Section id="descripcion">
        <SectionHeading eyebrow="Sobre el curso" title="De qué trata" />
        {propio ? (
          <p className="mt-4 max-w-3xl text-base leading-7 text-edvanta-muted">
            Edvanta organiza este curso como una ruta de aprendizaje con recursos
            seleccionados: videos, documentos oficiales y textos de apoyo. Cada recurso
            mantiene a su autor; Edvanta hace la selección y el orden.
          </p>
        ) : (
          <p className="mt-4 max-w-3xl text-base leading-7 text-edvanta-muted">
            Este curso lo imparte {ficha.proveedor.imparte}. Edvanta lo seleccionó para su
            catálogo: la selección es nuestra, el contenido y la enseñanza son del proveedor.
          </p>
        )}
        {ficha.objetivo && <p className="mt-4 max-w-3xl text-base leading-7 text-edvanta-muted">{ficha.objetivo}</p>}
        {descripcion && (
          // eslint-disable-next-line react/no-danger
          <div className="ed-prose mt-4 max-w-3xl" dangerouslySetInnerHTML={{ __html: descripcion }} />
        )}
        {(ficha.publico || ficha.requisitos) && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:max-w-3xl">
            {ficha.publico && (
              <Card><Eyebrow tone="teal">Para quién es</Eyebrow>
                <p className="mt-2 text-sm leading-7 text-edvanta-muted">{ficha.publico}</p></Card>
            )}
            {ficha.requisitos && (
              <Card><Eyebrow tone="violet">Qué necesitas antes</Eyebrow>
                <p className="mt-2 text-sm leading-7 text-edvanta-muted">{ficha.requisitos}</p></Card>
            )}
          </div>
        )}
      </Section>

      {ficha.queAprenderas.length > 0 && (
        <Section id="aprenderas" tone="surface" bordered>
          <SectionHeading eyebrow="Al terminar" title="Qué vas a poder hacer" />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:max-w-4xl">
            {ficha.queAprenderas.map((o) => (
              <li key={o} className="flex items-start gap-3 rounded-2xl border border-edvanta-border bg-white p-4">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-edvanta-mint">
                  <Check className="h-4 w-4 text-edvanta-tealdark" aria-hidden="true" />
                </span>
                <span className="text-sm leading-6 text-edvanta-deep">{o}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {ficha.capacidades.verTemario && (
        <Section id="contenido">
          <SectionHeading eyebrow="Contenido" title="Temario completo"
            desc="Puedes ver de qué trata cada clase antes de inscribirte." />
          <div className="mt-8 lg:max-w-4xl"><Temario modulos={ficha.temario} /></div>
        </Section>
      )}

      {!propio && (
        <Section id="contenido" tone="surface" bordered>
          <SectionHeading eyebrow="Contenido" title="Dónde se estudia"
            desc={`El temario y las clases están en ${ficha.proveedor.nombre}. No lo reproducimos aquí para no enseñar una versión que podría estar desactualizada.`} />
          {ficha.proveedor.enlace && (
            <Btn className="mt-6" href={ficha.proveedor.enlace} external iconRight={ExternalLink}>
              {ficha.proveedor.accion}
            </Btn>
          )}
        </Section>
      )}

      <Certificado certificado={ficha.certificado} proveedor={ficha.proveedor} />

      <Participacion ficha={ficha} refCurso={ficha.dondeSeEstudia === 'edvanta' ? ficha.id : (ficha.referencia || ref)} />

      {relacionados.length > 0 && (
        <Section tone="surface" bordered>
          <SectionHeading eyebrow="También te puede servir" title="Cursos relacionados" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relacionados.map((r) => (
              <a key={r.url} href={r.url}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-edvanta-border bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="aspect-[16/9] bg-edvanta-light">
                  {r.portada && (
                    <img src={imagen(r.portada)} alt="" loading="lazy" className="h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-edvanta-tealdark">{r.procedencia}</p>
                  <p className="mt-1 line-clamp-3 text-sm font-bold leading-snug text-edvanta-deep">{r.titulo}</p>
                </div>
              </a>
            ))}
          </div>
        </Section>
      )}

      <Section id="preguntas">
        <SectionHeading eyebrow="Dudas" title="Preguntas frecuentes" />
        <div className="mt-8 lg:max-w-3xl">
          <Faq items={[
            {
              q: '¿Dónde se estudia este curso?',
              a: propio
                ? 'Dentro de Edvanta, en tu aula virtual. Te inscribes con tu cuenta y avanzas a tu ritmo.'
                : `En ${ficha.proveedor.nombre}. Edvanta lo seleccionó para su catálogo y te lleva hasta allí; la inscripción y las clases ocurren en su plataforma.`,
            },
            {
              q: '¿Da certificado?',
              a: {
                available: 'Sí. Las condiciones están en el bloque de certificado de esta página.',
                pending_confirmation: `No lo tenemos confirmado. Las condiciones las define ${ficha.proveedor.nombre}; consúltalas en su sitio antes de inscribirte.`,
                not_offered: 'Este curso todavía no incluye certificado de Edvanta.',
              }[ficha.certificado.estado],
            },
            {
              q: '¿Qué necesito para empezar?',
              a: ficha.requisitos || 'No hay requisitos declarados para este curso.',
            },
            ...(propio ? [{
              q: '¿Qué recursos incluye?',
              a: 'Videos seleccionados, documentos oficiales de las entidades que los publican y textos de apoyo escritos para el curso. Cada recurso indica su fuente.',
            }] : []),
          ]} />
        </div>
        {/* El canal que ya usa el resto del sitio. No se inventa otro. */}
        <Card className="mt-8 flex flex-col items-start gap-3 lg:max-w-3xl">
          <Eyebrow>¿Tienes más preguntas?</Eyebrow>
          <p className="text-sm leading-7 text-edvanta-muted">
            Escríbenos y te respondemos sobre este curso en concreto.
          </p>
          <Btn href={EDVANTA_WHATSAPP_URL} external variant="secondary" size="sm" iconRight={MessageCircle}>
            Preguntar por WhatsApp
          </Btn>
        </Card>
      </Section>

      <SiteFooter />
    </div>
  );
}
