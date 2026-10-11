/**
 * ============================================================
 *  CursoEdvanta.jsx — La ficha pública de un curso propio
 *
 *  Una sola dirección para cada curso: /curso/:id. Antes, quien veía
 *  un curso en el inicio aterrizaba directo en el aula y, si no había
 *  entrado, rebotaba al inicio de sesión sin haber visto siquiera de
 *  qué iba. Ahora primero se ve el curso y después se decide.
 *
 *  El botón dice una cosa distinta según quién mire, pero siempre es
 *  el mismo botón en el mismo sitio:
 *    · sin cuenta  → Crear cuenta gratis (y al volver, aquí mismo)
 *    · con cuenta  → Inscribirme gratis
 *    · inscrito    → Continuar aprendiendo
 * ============================================================
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BookOpen, Check, ChevronRight, Clock, GraduationCap, Layers,
  PlayCircle, UserRound,
} from 'lucide-react';

import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import {
  Breadcrumb, Btn, Card, Eyebrow, LandingHero, Section, SectionHeading,
} from '../components/edvanta/ui';
import { cleanHtml } from '../aula/ui/RichText';
import { apiUrl } from '../config/api';
import { miAula, inscribirme } from '../lib/misCursos';
import { updatePageSeo } from '../utils/seo';

const NIVEL = { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' };

function duracion(minutos) {
  const m = Number(minutos) || 0;
  if (!m) return null;
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const resto = m % 60;
  return resto ? `${h} h ${resto} min` : `${h} h`;
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

/** El temario abierto de par en par: títulos y duraciones, sin el contenido. */
function Temario({ modulos }) {
  return (
    <div className="divide-y divide-edvanta-border overflow-hidden rounded-2xl border border-edvanta-border bg-white">
      {modulos.map((m, i) => (
        <details key={m.id} className="group" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden hover:bg-edvanta-bg">
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">
                Módulo {m.numero}
              </span>
              <span className="mt-0.5 block text-[15px] font-bold text-edvanta-deep">{m.title}</span>
            </span>
            <span className="flex shrink-0 items-center gap-3">
              <span className="text-xs font-semibold text-edvanta-muted">
                {m.lessons.length} {m.lessons.length === 1 ? 'clase' : 'clases'}
              </span>
              <ChevronRight className="h-5 w-5 text-edvanta-blue transition-transform group-open:rotate-90" aria-hidden="true" />
            </span>
          </summary>
          <ol className="border-t border-edvanta-border bg-edvanta-bg/40 px-5 py-3">
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
        </details>
      ))}
    </div>
  );
}

/**
 * La tarjeta de la decisión: portada, qué incluye y el botón.
 * Se queda fija mientras se lee el temario, que es cuando la gente
 * decide, no al principio.
 */
function TarjetaDeAcceso({ curso, estado, trabajando, error, onAccion }) {
  const texto = {
    visitante: 'Crear cuenta gratis',
    fuera: 'Inscribirme gratis',
    dentro: 'Continuar aprendiendo',
  }[estado];
  const pie = {
    visitante: 'Gratis. Con tu cuenta vuelves aquí y entras al curso.',
    fuera: 'Gratis. Se abre en tu aula y puedes retomarlo cuando quieras.',
    dentro: 'Ya estás inscrito en este curso.',
  }[estado];

  return (
    <Card className="p-0">
      {curso.coverUrl ? (
        <img
          src={curso.coverUrl.startsWith('/api') ? apiUrl(curso.coverUrl) : curso.coverUrl}
          alt=""
          className="aspect-[16/10] w-full rounded-t-2xl object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      ) : (
        <div className="flex aspect-[16/10] w-full items-center justify-center rounded-t-2xl bg-edvanta-light" aria-hidden="true">
          <GraduationCap className="h-12 w-12 text-edvanta-blue/40" />
        </div>
      )}
      <div className="p-6">
        <ul className="flex flex-col gap-2.5">
          <Dato icon={Layers}>
            {curso.modules} {curso.modules === 1 ? 'módulo' : 'módulos'} · {curso.lessons} {curso.lessons === 1 ? 'clase' : 'clases'}
          </Dato>
          <Dato icon={Clock}>{duracion(curso.durationMinutes)}</Dato>
          <Dato icon={BookOpen}>{NIVEL[curso.level] || null}</Dato>
          <Dato icon={UserRound}>{curso.authorName}</Dato>
        </ul>

        <Btn
          size="lg"
          className="mt-6 w-full"
          onClick={onAccion}
          disabled={trabajando}
        >
          {trabajando ? 'Un momento…' : texto}
        </Btn>
        <p className="mt-3 text-center text-xs leading-5 text-edvanta-muted">{pie}</p>
        {error && (
          <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-center text-xs font-semibold text-red-700">
            {error}
          </p>
        )}
      </div>
    </Card>
  );
}

/* ── Página ───────────────────────────────────────────────── */

export default function CursoEdvanta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [fallo, setFallo] = useState(null);
  // visitante | fuera | dentro. Mientras no se sabe, se asume visitante:
  // es lo que ve la mayoría y evita que el botón cambie de texto a mitad
  // de lectura más de una vez.
  const [estado, setEstado] = useState('visitante');
  const [trabajando, setTrabajando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  useEffect(() => {
    let vivo = true;
    setCurso(null);
    setFallo(null);
    fetch(apiUrl(`/api/cursos-edvanta/${id}`))
      .then(async (r) => {
        const datos = await r.json().catch(() => null);
        if (!vivo) return;
        if (!r.ok || !datos?.ok) {
          setFallo(datos?.error || 'No encontramos este curso.');
          return;
        }
        setCurso(datos.data);
      })
      .catch(() => { if (vivo) setFallo('No pudimos cargar el curso. Revisa tu conexión.'); });
    return () => { vivo = false; };
  }, [id]);

  // Quién mira. Se pregunta aparte del curso para que la ficha se pinte
  // sin esperar a la sesión.
  useEffect(() => {
    let vivo = true;
    miAula().then(({ sesion, cursos }) => {
      if (!vivo) return;
      if (!sesion) { setEstado('visitante'); return; }
      setEstado(cursos.some((c) => String(c.courseId) === String(id)) ? 'dentro' : 'fuera');
    });
    return () => { vivo = false; };
  }, [id]);

  useEffect(() => {
    if (!curso) return;
    updatePageSeo({
      title: `${curso.title} | Curso de Edvanta`,
      description: curso.shortDescription || `Curso de ${curso.title} en Edvanta: ${curso.lessons} clases en ${curso.modules} módulos.`,
      canonical: `https://edvanta.co/curso/${curso.id}`,
      type: 'website',
      jsonLdId: `curso-edvanta-${curso.id}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: curso.title,
        description: curso.shortDescription || '',
        url: `https://edvanta.co/curso/${curso.id}`,
        courseMode: 'online',
        inLanguage: 'es',
        provider: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
      },
    });
  }, [curso]);

  const accion = useCallback(async () => {
    if (!curso) return;
    setError('');
    if (estado === 'dentro') { navigate(curso.aulaTo); return; }
    if (estado === 'visitante') {
      navigate(`/cuenta?modo=registro&next=${encodeURIComponent(`/curso/${curso.id}`)}`);
      return;
    }
    setTrabajando(true);
    const res = await inscribirme(curso.id);
    setTrabajando(false);
    if (res.ok) { navigate(curso.aulaTo); return; }
    if (res.motivo === 'sin_sesion') {
      navigate(`/cuenta?modo=registro&next=${encodeURIComponent(`/curso/${curso.id}`)}`);
      return;
    }
    setError(res.mensaje || 'No pudimos inscribirte. Intenta de nuevo en un momento.');
  }, [curso, estado, navigate]);

  const descripcion = useMemo(() => cleanHtml(curso?.descriptionHtml), [curso?.descriptionHtml]);

  if (fallo) {
    return (
      <div className="min-h-screen bg-edvanta-bg">
        <SiteHeader />
        <Section>
          <SectionHeading
            as="h1"
            eyebrow="Curso"
            title="Este curso no está disponible"
            desc={fallo}
          />
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn to="/">Volver al inicio</Btn>
            <Btn to="/cursos" variant="secondary">Ver todos los cursos</Btn>
          </div>
        </Section>
        <SiteFooter />
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="min-h-screen bg-edvanta-bg">
        <SiteHeader />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center text-sm font-semibold text-edvanta-muted">
          Cargando el curso…
        </div>
      </div>
    );
  }

  const tarjeta = (
    <TarjetaDeAcceso
      curso={curso}
      estado={estado}
      trabajando={trabajando}
      error={error}
      onAccion={accion}
    />
  );

  return (
    <div className="min-h-screen bg-edvanta-bg">
      <SiteHeader />

      <LandingHero
        breadcrumb={(
          <Breadcrumb
            className="mb-6"
            items={[{ label: 'Inicio', to: '/' }, { label: 'Cursos', to: '/cursos' }, { label: curso.title }]}
          />
        )}
        eyebrow={curso.category || 'Curso de Edvanta'}
        title={curso.title}
        lead={curso.shortDescription}
        bullets={[
          `${curso.lessons} ${curso.lessons === 1 ? 'clase' : 'clases'} en ${curso.modules} ${curso.modules === 1 ? 'módulo' : 'módulos'}`,
          duracion(curso.durationMinutes) ? `${duracion(curso.durationMinutes)} de contenido` : null,
          NIVEL[curso.level] ? `Nivel ${NIVEL[curso.level].toLowerCase()}` : null,
          'A tu ritmo, sin fecha límite',
        ].filter(Boolean)}
        media={<div className="lg:sticky lg:top-24">{tarjeta}</div>}
      />

      {curso.learningOutcomes.length > 0 && (
        <Section tone="surface" bordered>
          <SectionHeading eyebrow="Al terminar" title="Lo que vas a poder hacer" />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {curso.learningOutcomes.map((o) => (
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

      <Section>
        <div className="gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
          <div className="min-w-0">
            <SectionHeading eyebrow="Contenido" title="Temario completo" desc="Puedes ver de qué trata cada clase antes de inscribirte." />
            <div className="mt-8"><Temario modulos={curso.temario} /></div>

            {(curso.objective || descripcion) && (
              <div className="mt-12">
                <SectionHeading eyebrow="Sobre el curso" title="De qué trata" />
                {curso.objective && (
                  <p className="mt-4 text-base leading-7 text-edvanta-muted">{curso.objective}</p>
                )}
                {descripcion && (
                  // eslint-disable-next-line react/no-danger
                  <div className="ed-prose mt-4" dangerouslySetInnerHTML={{ __html: descripcion }} />
                )}
              </div>
            )}

            {(curso.audience || curso.prerequisites) && (
              <div className="mt-12 grid gap-5 sm:grid-cols-2">
                {curso.audience && (
                  <Card>
                    <Eyebrow tone="teal">Para quién es</Eyebrow>
                    <p className="mt-2 text-sm leading-7 text-edvanta-muted">{curso.audience}</p>
                  </Card>
                )}
                {curso.prerequisites && (
                  <Card>
                    <Eyebrow tone="violet">Qué necesitas antes</Eyebrow>
                    <p className="mt-2 text-sm leading-7 text-edvanta-muted">{curso.prerequisites}</p>
                  </Card>
                )}
              </div>
            )}

            {curso.authorName && (
              <Card className="mt-12 flex items-start gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-edvanta-light">
                  <UserRound className="h-6 w-6 text-edvanta-blue" aria-hidden="true" />
                </span>
                <span>
                  <Eyebrow>Quién lo dicta</Eyebrow>
                  <p className="mt-1 text-base font-bold text-edvanta-deep">{curso.authorName}</p>
                </span>
              </Card>
            )}
          </div>

          {/* En pantalla ancha la tarjeta ya está arriba; aquí vuelve a
              aparecer en móvil, al final del temario, que es donde se
              termina de decidir. */}
          <div className="mt-10 lg:hidden">{tarjeta}</div>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
