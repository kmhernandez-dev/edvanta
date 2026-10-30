/**
 * ============================================================
 *  FichaDeCurso.jsx — Una sola página para los 228 cursos
 *
 *  Antes había tres plantillas (propios, cursos gratis y externos)
 *  que decían cosas distintas sobre lo mismo. Esta es una, y lo que
 *  cambia de un curso a otro no es la página: son las capacidades que
 *  el servidor declara y los datos que existan.
 *
 *  El orden es el de una ficha de curso que se lee de corrido: qué es y
 *  cómo empezar (con la tarjeta de inscripción), cómo se estudia, qué
 *  aprenderás, el temario, quién lo prepara, el certificado (con el
 *  diploma) y lo que opinan quienes lo hicieron.
 *
 *  La regla que gobierna cada sección: si el dato no está, se dice, o
 *  no se pinta la sección. Nunca se rellena. Una ficha que promete un
 *  certificado que nadie confirmó o enseña un botón que no lleva a
 *  ninguna parte hace más daño que una ficha escueta.
 * ============================================================
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight, Award, BadgeCheck, BookOpen, Check, ChevronRight, Clock, ExternalLink, FileText, Heart,
  GraduationCap, Globe, Layers, MessageCircle, MonitorSmartphone, PlayCircle, QrCode, Share2, Star, UserRound,
} from 'lucide-react';

import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import Diploma from '../components/edvanta/Diploma';
import {
  Breadcrumb, Btn, Card, Eyebrow, Faq, Section, SectionHeading,
} from '../components/edvanta/ui';
import { cleanHtml } from '../aula/ui/RichText';
import { apiUrl } from '../config/api';
import { nombreDeCurso } from '../lib/slug';
import { miAula, inscribirme } from '../lib/misCursos';
import { EMISOR, textoDeHoras } from '../lib/certificado/formato';
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
  const s = [{ id: 'aprenderas', label: 'Qué aprenderás' }];
  s.push({ id: 'contenido', label: f.capacidades.verTemario ? 'Temario' : 'Dónde se estudia' });
  s.push({ id: 'quien', label: 'Quién lo prepara' });
  s.push({ id: 'certificado', label: 'Certificado' });
  s.push({ id: 'valoraciones', label: 'Valoraciones' });
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

/** Alto del encabezado fijo del sitio, para pegar debajo lo que también es fijo. */
function useAltoDelEncabezado() {
  const [alto, setAlto] = useState(64);
  useEffect(() => {
    const h = document.querySelector('header');
    if (!h) return undefined;
    const medir = () => setAlto(Math.round(h.getBoundingClientRect().height));
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(h);
    return () => obs.disconnect();
  }, []);
  return alto;
}

/** Navegación por secciones. Se desplaza en horizontal en móvil. */
function Anclas({ secciones, activa }) {
  const alto = useAltoDelEncabezado();
  return (
    <nav
      aria-label="Secciones de este curso"
      style={{ top: alto }}
      className="sticky z-20 border-y border-edvanta-border bg-white/95 backdrop-blur"
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

/** Una tarjeta de rasgo: cómo se estudia, qué certifica, qué trae. */
function Rasgo({ icon: Icono, titulo, children }) {
  return (
    <div className="flex gap-4 rounded-[var(--ds-r-lg)] bg-[#F4F8FE] p-5 ring-1 ring-edvanta-border/70 sm:p-6">
      <span className="ds-icon-tile h-12 w-12 shrink-0 rounded-[14px] bg-white shadow-[var(--ds-sh-xs)]">
        <Icono className="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <h3 className="font-display text-lg font-bold text-edvanta-deep">{titulo}</h3>
        <p className="mt-1.5 text-[15px] leading-7 text-edvanta-muted">{children}</p>
      </div>
    </div>
  );
}

/** Estrellas de una valoración real (de 0 a 5). */
function Estrellas({ valor }) {
  return (
    <span className="inline-flex" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-4 w-4 ${n <= Math.round(valor) ? 'fill-[#F5B301] text-[#F5B301]' : 'text-edvanta-border'}`} />
      ))}
    </span>
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
 * El certificado. Va en TODAS las fichas: es la primera duda de
 * cualquiera que mira un curso. En los de Edvanta, con el diploma tal
 * como sale al aprobar; en los de otras plataformas, con lo que se sabe
 * del certificado del proveedor (el diploma de Edvanta no aplica ahí).
 */
function Certificado({ ficha, accion, boton }) {
  const c = ficha.certificado;
  const nombre = nombreDeCurso(ficha.titulo);
  if (c.estado === 'available') {
    return (
      <Section id="certificado" tone="lavender">
        <div className="gap-12 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
          <div className="mb-10 lg:mb-0">
            <Diploma muestra curso={nombre} horas={c.horas} />
          </div>
          <div>
            <Eyebrow>Certificado de aprobación</Eyebrow>
            <h2 className="mt-2 font-display text-[1.75rem] font-extrabold leading-tight text-edvanta-deep sm:text-[2.1rem]">
              Obtén tu certificado de <span className="text-edvanta-teal">Edvanta</span>
            </h2>
            <p className="mt-3 text-base leading-7 text-edvanta-muted">{c.nota}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {[
                { icon: BadgeCheck, t: `Lo expide ${EMISOR.nombre} · NIT ${EMISOR.nit}` },
                { icon: QrCode, t: 'Lleva un código único y un QR: cualquiera lo verifica en edvanta.co/certificados' },
                { icon: FileText, t: 'Lo descargas en PDF desde tu aula' },
                { icon: Share2, t: 'Lo agregas a tu perfil de LinkedIn con un clic' },
              ].map(({ icon: I, t }) => (
                <li key={t} className="flex items-start gap-3 text-[15px] leading-6 text-edvanta-deep">
                  <I className="mt-0.5 h-5 w-5 shrink-0 text-edvanta-teal" aria-hidden="true" />{t}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-[var(--ds-r-lg)] border border-edvanta-border bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-muted">Título a certificar</p>
              <p className="mt-1.5 font-display text-lg font-bold leading-snug text-edvanta-deep">{nombre}</p>
              <p className="mt-1 text-sm text-edvanta-muted">
                {[textoDeHoras(c.horas) ? `${textoDeHoras(c.horas)} certificadas` : null, 'Modalidad virtual'].filter(Boolean).join(' · ')}
              </p>
              <p className="mt-3 text-sm leading-6 text-edvanta-muted">{c.condiciones}</p>
            </div>
            {boton && <div className="mt-6">{boton}</div>}
          </div>
        </div>
      </Section>
    );
  }

  const titulo = {
    pending_confirmation: `Certificado de ${ficha.proveedor.nombre}`,
    not_offered: 'Este curso no incluye certificado',
  }[c.estado] || 'Certificado';
  return (
    <Section id="certificado" tone="surface" bordered>
      <div className="lg:max-w-3xl">
        <Eyebrow>Certificado</Eyebrow>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">{titulo}</h2>
        <p className="mt-3 text-base leading-7 text-edvanta-muted">{c.nota}</p>
        <ul className="mt-5 flex flex-col gap-2.5">
          <Dato icon={Award}>{c.emisor ? `Lo emite ${c.emisor}, no Edvanta` : null}</Dato>
          <Dato icon={Check}>{c.condiciones}</Dato>
        </ul>
        {c.estado === 'pending_confirmation' && ficha.proveedor?.enlace && (
          <Btn className="mt-6" variant="secondary" onClick={accion} iconRight={ExternalLink}>
            Ver condiciones en {ficha.proveedor.nombre}
          </Btn>
        )}
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
function Participacion({ ficha, refCurso, datos }) {
  const puedo = datos?.puedo || { opinar: false, comentar: false, moderar: false };

  return (
    <>
      <Section id="valoraciones">
        <SectionHeading eyebrow="Opiniones" title="Valoraciones de estudiantes" />
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
  const [seccionActiva, setSeccionActiva] = useState('aprenderas');
  const [opiniones, setOpiniones] = useState(null);
  const [tarjetaVisible, setTarjetaVisible] = useState(true);
  const tarjetaRef = useRef(null);

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

  // Las opiniones: el resumen va en el encabezado y el detalle más abajo.
  const refCurso = ficha ? (ficha.dondeSeEstudia === 'edvanta' ? ficha.id : (ficha.referencia || ref)) : null;
  useEffect(() => {
    if (!refCurso) return undefined;
    let vivo = true;
    setOpiniones(null);
    opinionesDeCurso(refCurso).then((r) => { if (vivo && r.ok) setOpiniones(r.datos); });
    return () => { vivo = false; };
  }, [refCurso]);

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
      { rootMargin: '-210px 0px -60% 0px' },
    );
    for (const s of secciones) {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [secciones]);

  // En el teléfono, cuando la tarjeta de inscripción sale de la pantalla,
  // aparece una barra fija con el mismo botón.
  useEffect(() => {
    const el = tarjetaRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(([e]) => setTarjetaVisible(e.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ficha]);

  useEffect(() => {
    if (!ficha) return;
    // «Curso de Gestión de Calidad | Edvanta»: el mismo nombre que el
    // encabezado de la página y que su dirección.
    const nombre = nombreDeCurso(ficha.titulo);
    const url = `https://edvanta.co${ficha.url}`;
    const imagenSeo = ficha.portada ? (ficha.portada.startsWith('/') ? `https://edvanta.co${ficha.portada}` : ficha.portada) : undefined;
    updatePageSeo({
      title: `${nombre} | Edvanta`,
      description: ficha.resumen || `${nombre}: ${ficha.categoria || 'formación profesional'} en Edvanta.`,
      canonical: url,
      image: imagenSeo,
      type: 'website',
      jsonLdId: `ficha-${ficha.id}`,
      // Solo lo que se ve en la página: nada de puntuaciones de ejemplo.
      // Lo mismo que la API escribe en el HTML (api/routes/paginas-publicas.js),
      // que se retira al montar: el curso y sus migas.
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: nombre,
          description: ficha.resumen || '',
          url,
          inLanguage: ficha.idioma === 'Inglés' ? 'en' : 'es',
          ...(imagenSeo ? { image: imagenSeo } : {}),
          provider: { '@type': 'Organization', name: ficha.proveedor.nombre },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
            { '@type': 'ListItem', position: 2, name: 'Cursos', item: 'https://edvanta.co/cursos' },
            { '@type': 'ListItem', position: 3, name: nombre, item: url },
          ],
        },
      ],
    });
  }, [ficha]);

  const accion = useCallback(async () => {
    if (!ficha) return;
    setError('');
    if (!ficha.capacidades.inscribirse) {
      if (ficha.proveedor.enlace) window.open(ficha.proveedor.enlace, '_blank', 'noopener,noreferrer');
      return;
    }
    // En el aula, el curso vive en la misma dirección: /aula/curso-de-…
    const enAula = ficha.url?.startsWith('/curso-')
      ? `/aula${ficha.url}`
      : `/aula/curso/${String(ficha.id).replace('edvanta-', '')}`;
    if (estado === 'dentro') { navigate(enAula); return; }
    if (estado === 'visitante') {
      navigate(`/cuenta?modo=registro&next=${encodeURIComponent(ficha.url)}`);
      return;
    }
    setTrabajando(true);
    const res = await inscribirme(Number(String(ficha.id).replace('edvanta-', '')));
    setTrabajando(false);
    if (res.ok) { navigate(enAula); return; }
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
  const nombre = nombreDeCurso(ficha.titulo);
  const horas = textoDeHoras(ficha.certificado.horas) || duracion(ficha.duracionMinutos) || ficha.duracionTexto;
  const resumenOpiniones = opiniones?.resumen;
  const textoBoton = propio
    ? { visitante: 'Crear cuenta gratis', fuera: 'Inscribirme gratis', dentro: 'Continuar aprendiendo' }[estado]
    : ficha.proveedor.accion;
  const pieBoton = propio
    ? { visitante: 'Accede gratis a este curso con tu cuenta de Edvanta.',
      fuera: 'Gratis. Se abre en tu aula y puedes retomarlo cuando quieras.',
      dentro: 'Ya estás inscrito en este curso.' }[estado]
    : `El curso se estudia en ${ficha.proveedor.nombre}. Edvanta lo seleccionó, no lo imparte.`;
  const hayBoton = ficha.capacidades.irAlProveedor || propio;

  const boton = (extra = '', variante) => (hayBoton ? (
    <Btn size="lg" variant={variante || (propio ? 'gradient' : 'primary')} className={extra} onClick={accion}
      loading={trabajando} loadingLabel="Un momento…" iconRight={propio ? ArrowRight : ExternalLink}>
      {trabajando ? 'Un momento…' : textoBoton}
    </Btn>
  ) : null);

  const tarjeta = (
    <Card className="overflow-hidden p-0 shadow-[var(--ds-sh-lg)]">
      {ficha.portada ? (
        <img src={imagen(ficha.portada)} alt="" className="aspect-[16/9] w-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center" style={{ background: 'var(--ds-grad-hero)' }} aria-hidden="true">
          <GraduationCap className="h-12 w-12 text-edvanta-blue/40" />
        </div>
      )}
      <div className="p-6">
        {hayBoton ? boton('w-full') : (
          // Un externo sin enlace no tiene a dónde mandar a nadie. Antes
          // que un botón que no hace nada, se explica por qué no lo hay.
          <p className="rounded-xl bg-edvanta-bg px-4 py-3 text-center text-sm font-semibold text-edvanta-muted">
            Todavía no tenemos el enlace verificado de este curso.
          </p>
        )}
        <p className="mt-3 text-center text-xs leading-5 text-edvanta-muted">{pieBoton}</p>
        {error && (
          <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-center text-xs font-semibold text-red-700">
            {error}
          </p>
        )}
        <p className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-edvanta-muted">Este curso incluye</p>
        <ul className="mt-3 flex flex-col gap-2.5">
          <Dato icon={Layers}>{ficha.unidades ? `${ficha.unidades} unidades · ${ficha.clases} clases` : null}</Dato>
          <Dato icon={Clock}>{horas}</Dato>
          <Dato icon={BookOpen}>{ficha.nivel ? `Nivel ${ficha.nivel.toLowerCase()}` : null}</Dato>
          <Dato icon={Globe}>{ficha.idioma}</Dato>
          <Dato icon={MonitorSmartphone}>{propio ? 'Acceso desde el celular y el computador' : null}</Dato>
          <Dato icon={Award}>
            {ficha.certificado.estado === 'available' ? 'Certificado de aprobación de Edvanta'
              : ficha.certificado.estado === 'pending_confirmation' ? `Certificado según ${ficha.proveedor.nombre}` : null}
          </Dato>
        </ul>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-edvanta-bg pb-20 lg:pb-0">
      <SiteHeader />

      {/* Encabezado: qué es el curso a la izquierda y la tarjeta de
          inscripción, fija, a la derecha. */}
      <section className="ds-surface-diagonal relative overflow-hidden">
        <div className="ed-grid" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-edvanta-violet/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Breadcrumb className="mb-8" items={[
            { label: 'Inicio', to: '/' },
            { label: 'Cursos', to: '/cursos' },
            ...(ficha.categoria ? [{ label: ficha.categoria, to: `/cursos?category=${encodeURIComponent(ficha.categoria)}` }] : []),
            { label: nombre },
          ]} />
          <div className="gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
            <div className="ds-rise">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`ds-chip ${propio ? '' : 'ds-chip--violet'}`}>
                  {propio ? <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" /> : <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
                  {propio ? 'Curso de Edvanta' : `Lo imparte ${ficha.proveedor.imparte}`}
                </span>
                {ficha.categoria && <Eyebrow>{ficha.categoria}</Eyebrow>}
              </div>
              <h1 className="mt-5 font-display text-[2rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-edvanta-blue sm:text-[2.75rem] lg:text-[3.1rem]">
                {nombre}
              </h1>
              {ficha.resumen && (
                <p className="mt-5 max-w-2xl text-lg leading-8 text-edvanta-muted">{ficha.resumen}</p>
              )}
              {ficha.objetivo && (
                <p className="mt-4 max-w-2xl text-[17px] font-semibold leading-8 text-edvanta-deep">{ficha.objetivo}</p>
              )}
              <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px] font-semibold text-edvanta-deep">
                {resumenOpiniones?.total > 0 && (
                  <li className="flex items-center gap-2">
                    <Estrellas valor={resumenOpiniones.promedio} />
                    <span>{String(resumenOpiniones.promedio).replace('.', ',')}</span>
                    <a href="#valoraciones" className="font-semibold text-edvanta-blue underline-offset-2 hover:underline">
                      ({resumenOpiniones.total} {resumenOpiniones.total === 1 ? 'opinión' : 'opiniones'})
                    </a>
                  </li>
                )}
                {propio && (
                  <li className="flex items-center gap-2"><Heart className="h-4 w-4 fill-[#E25563] text-[#E25563]" aria-hidden="true" />Curso gratis</li>
                )}
                {horas && <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />{horas}</li>}
                {ficha.clases && <li className="flex items-center gap-2"><Layers className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />{ficha.clases} clases</li>}
                {ficha.nivel && <li className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />Nivel {ficha.nivel.toLowerCase()}</li>}
              </ul>
            </div>
            <div ref={tarjetaRef} className="ds-rise-2 mt-10 lg:sticky lg:top-28 lg:mt-0">{tarjeta}</div>
          </div>
        </div>
      </section>

      {/* Cómo se estudia y qué certifica, de un vistazo. */}
      <Section tone="white" compact>
        <div className="grid gap-4 md:grid-cols-3">
          <Rasgo icon={MonitorSmartphone} titulo={propio ? 'Modalidad 100 % virtual' : `Se estudia en ${ficha.proveedor.nombre}`}>
            {propio
              ? 'El contenido está disponible las 24 horas para que estudies a tu ritmo, desde el celular o el computador. Tu avance queda guardado clase a clase.'
              : `La inscripción y las clases ocurren en ${ficha.proveedor.nombre}. Edvanta lo seleccionó para su catálogo y te lleva hasta allí.`}
          </Rasgo>
          <Rasgo icon={Award} titulo={ficha.certificado.estado === 'available' ? 'Certificado de aprobación' : 'Certificado'}>
            {ficha.certificado.estado === 'available'
              ? 'Al completar el curso, Edvanta te expide tu certificado con tu nombre, las horas del curso y un código para verificarlo.'
              : ficha.certificado.nota}
          </Rasgo>
          <Rasgo icon={BookOpen} titulo={propio ? 'Contenido con sus fuentes' : 'Seleccionado por Edvanta'}>
            {propio
              ? 'Videos seleccionados, documentos oficiales de las entidades que los publican y textos de apoyo. Cada recurso dice de dónde viene.'
              : 'Lo elegimos por su pertinencia para el sector. La selección es nuestra; el contenido y la enseñanza son del proveedor.'}
          </Rasgo>
        </div>
      </Section>

      <Anclas secciones={secciones} activa={seccionActiva} />

      {/* Qué aprenderás, a quién va dirigido y qué necesitas */}
      <Section id="aprenderas">
        <div className="lg:max-w-3xl">
          <SectionHeading eyebrow="Sobre el curso" title="Qué aprenderás" />
          {descripcion && (
            // eslint-disable-next-line react/no-danger
            <div className="ed-prose mt-5" dangerouslySetInnerHTML={{ __html: descripcion }} />
          )}
          {ficha.queAprenderas.length > 0 ? (
            <>
              <p className="mt-5 text-[17px] leading-8 text-edvanta-muted">
                {propio ? 'Al terminar el curso vas a poder:' : `Según ${ficha.proveedor.nombre}, en este curso aprenderás a:`}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {ficha.queAprenderas.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-[16px] leading-7 text-edvanta-deep">
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-edvanta-mint">
                      <Check className="h-4 w-4 text-edvanta-tealdark" aria-hidden="true" />
                    </span>
                    {o}
                  </li>
                ))}
              </ul>
            </>
          ) : !descripcion && (
            <p className="mt-5 text-[17px] leading-8 text-edvanta-muted">
              {propio
                ? 'El detalle de cada clase está en el temario, más abajo.'
                : `El detalle del contenido está en la página del curso en ${ficha.proveedor.nombre}.`}
            </p>
          )}

          {(ficha.publico || ficha.requisitos) && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {ficha.publico && (
                <Card>
                  <h3 className="font-display text-lg font-bold text-edvanta-deep">¿A quién está dirigido?</h3>
                  <p className="mt-2 text-[15px] leading-7 text-edvanta-muted">{ficha.publico}</p>
                </Card>
              )}
              {ficha.requisitos && (
                <Card>
                  <h3 className="font-display text-lg font-bold text-edvanta-deep">Qué necesitas antes</h3>
                  <p className="mt-2 text-[15px] leading-7 text-edvanta-muted">{ficha.requisitos}</p>
                </Card>
              )}
            </div>
          )}

          {propio && (
            <div className="mt-10">
              <h3 className="font-display text-xl font-bold text-edvanta-deep">Cómo aprenderás</h3>
              <ol className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: UserRound, t: 'Crea tu cuenta', d: 'Es gratis y con ella entras a tu aula.' },
                  { icon: PlayCircle, t: 'Estudia a tu ritmo', d: 'Clases con video y texto de apoyo.' },
                  { icon: FileText, t: 'Profundiza', d: 'Documentos oficiales y lecturas para ampliar.' },
                  { icon: Award, t: 'Obtén tu certificado', d: 'Al completar el curso, lo emites desde tu aula.' },
                ].map(({ icon: I, t, d }, i) => (
                  <li key={t} className="flex gap-4 rounded-[var(--ds-r-lg)] border border-edvanta-border bg-white p-4">
                    <span className="ds-icon-tile ds-icon-tile--teal h-10 w-10 shrink-0 rounded-[12px]"><I className="h-5 w-5" aria-hidden="true" /></span>
                    <span>
                      <span className="block text-xs font-bold uppercase tracking-[.12em] text-edvanta-muted">Paso {i + 1}</span>
                      <span className="block font-display font-bold text-edvanta-deep">{t}</span>
                      <span className="mt-0.5 block text-sm leading-6 text-edvanta-muted">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </Section>

      {/* Temario (propios) o dónde se estudia (de otras plataformas) */}
      {ficha.capacidades.verTemario ? (
        <Section id="contenido" tone="surface" bordered>
          <div className="lg:max-w-4xl">
            <SectionHeading eyebrow="Contenido" title="Temario del curso"
              desc={`${ficha.unidades} unidades y ${ficha.clases} clases. Puedes ver de qué trata cada una antes de inscribirte.`} />
            <div className="mt-8"><Temario modulos={ficha.temario} /></div>
          </div>
        </Section>
      ) : (
        <Section id="contenido" tone="surface" bordered>
          <div className="lg:max-w-3xl">
            <SectionHeading eyebrow="Contenido" title="Dónde se estudia"
              desc={`El temario y las clases están en ${ficha.proveedor.nombre}. No lo reproducimos aquí para no enseñar una versión que podría estar desactualizada.`} />
            {ficha.proveedor.enlace && (
              <Btn className="mt-6" onClick={accion} iconRight={ExternalLink}>{ficha.proveedor.accion}</Btn>
            )}
          </div>
        </Section>
      )}

      {/* Quién lo prepara */}
      <Section id="quien">
        <div className="lg:max-w-3xl">
          <SectionHeading eyebrow="Quién lo prepara" title={propio ? 'Equipo académico de Edvanta' : ficha.proveedor.imparte} />
          <p className="mt-5 text-[17px] leading-8 text-edvanta-muted">
            {propio
              ? 'Edvanta organiza este curso como una ruta de aprendizaje con recursos seleccionados: videos, documentos oficiales de las entidades que los publican y textos de apoyo escritos para el curso. Cada recurso mantiene a su autor; Edvanta hace la selección y el orden.'
              : `Este curso lo imparte ${ficha.proveedor.imparte}. Edvanta lo seleccionó para su catálogo: la selección es nuestra, el contenido y la enseñanza son del proveedor.`}
          </p>
          {ficha.autoria && propio && (
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-edvanta-deep">
              <UserRound className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />Autoría: {ficha.autoria}
            </p>
          )}
        </div>
      </Section>

      {/* Llamado: el nombre del curso y su botón */}
      {hayBoton && (
        <section className="ds-surface-navy">
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <p className="font-display text-2xl font-extrabold leading-tight text-white sm:text-[1.75rem]">{nombre}</p>
              <p className="mt-1.5 text-sm text-white/80">{pieBoton}</p>
            </div>
            {boton('', 'white')}
          </div>
        </section>
      )}

      <Certificado ficha={ficha} accion={accion} boton={propio ? boton() : null} />

      <Participacion ficha={ficha} refCurso={refCurso} datos={opiniones} />

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
                available: `Sí. Al completar todas las clases obligatorias, emites desde tu aula el certificado de aprobación de ${EMISOR.nombre}: con tu nombre, el curso, sus horas y un código para verificarlo en edvanta.co/certificados.`,
                pending_confirmation: `No lo tenemos confirmado. Las condiciones las define ${ficha.proveedor.nombre}; consúltalas en su sitio antes de inscribirte.`,
                not_offered: 'Este curso no incluye certificado.',
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

      {/* En el teléfono: el botón siempre a mano cuando la tarjeta ya no se ve. */}
      {hayBoton && !tarjetaVisible && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-edvanta-border bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(8,46,134,.25)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <p className="min-w-0 flex-1 truncate text-sm font-bold text-edvanta-deep">{nombre}</p>
            {boton('shrink-0 !min-h-11 !px-4 text-sm')}
          </div>
        </div>
      )}
    </div>
  );
}
