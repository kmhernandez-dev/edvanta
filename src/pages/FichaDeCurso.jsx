/**
 * ============================================================
 *  FichaDeCurso.jsx — Una sola página para todos los cursos
 *
 *  Antes había tres plantillas (propios, cursos gratis y externos)
 *  que decían cosas distintas sobre lo mismo. Esta es una, y lo que
 *  cambia de un curso a otro no es la página: son las capacidades que
 *  el servidor declara y los datos que existan.
 *
 *  La composición sigue una ficha de curso editorial: fondo blanco,
 *  contenido a la izquierda y una tarjeta de acceso compacta a la
 *  derecha. En móvil la tarjeta sube para que la acción aparezca pronto.
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
  ArrowRight, Award, BadgeCheck, BookOpen, Check, Clock, ExternalLink, FileText,
  GraduationCap, Layers, MessageCircle, MonitorSmartphone, QrCode, Share2, UserRound,
} from 'lucide-react';

import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import Diploma from '../components/edvanta/Diploma';
import { Btn, Card, Faq } from '../components/edvanta/ui';
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
import FichaCursoHero from '../components/curso/FichaCursoHero';
import ContenidoCurso from '../components/curso/ContenidoCurso';
import {
  BeneficioCurso, CursoHeading, CursoSection, DatoCurso, ResultadosCurso,
} from '../components/curso/PiezasCurso';

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

/* ── Certificado ──────────────────────────────────────────── */

/**
 * El certificado va en TODAS las fichas: es la primera duda de
 * cualquiera que mira un curso. En los de Edvanta, con el diploma tal
 * como sale al aprobar; en los de otras plataformas, con lo que se sabe
 * del certificado del proveedor (el diploma de Edvanta no aplica ahí).
 */
function Certificado({ ficha, nombre, accion, boton }) {
  const c = ficha.certificado;

  if (c.estado === 'available') {
    return (
      <CursoSection id="certificado">
        <CursoHeading title="Certificado de aprobación" desc={c.nota} />
        <div className="curso-cert-grid">
          <div className="curso-cert-diploma">
            <Diploma muestra curso={nombre} horas={c.horas} />
          </div>
          <div>
            <ul className="curso-cert-list">
              {[
                { icon: BadgeCheck, t: `Lo expide ${EMISOR.nombre} · NIT ${EMISOR.nit}` },
                { icon: QrCode, t: 'Lleva un código único y un QR: cualquiera lo verifica en edvanta.co/certificados' },
                { icon: FileText, t: 'Lo descargas en PDF desde tu aula' },
                { icon: Share2, t: 'Lo agregas a tu perfil de LinkedIn con un clic' },
              ].map(({ icon: I, t }) => (
                <li key={t}>
                  <I className="h-5 w-5" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="curso-cert-title">
              <p className="curso-cert-label">Título a certificar</p>
              <p className="curso-cert-name">{nombre}</p>
              <p className="curso-cert-meta">
                {[textoDeHoras(c.horas) ? `${textoDeHoras(c.horas)} certificadas` : null, 'Modalidad virtual']
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              <p className="curso-cert-conditions">{c.condiciones}</p>
            </div>

            {boton && <div className="curso-cert-cta">{boton}</div>}
          </div>
        </div>
      </CursoSection>
    );
  }

  const titulo = {
    pending_confirmation: `Certificado de ${ficha.proveedor.nombre}`,
    not_offered: 'Este curso no incluye certificado',
  }[c.estado] || 'Certificado';

  return (
    <CursoSection id="certificado">
      <CursoHeading title={titulo} desc={c.nota} />
      <ul className="curso-cert-list curso-pending-list">
        <DatoCurso icon={Award}>{c.emisor ? `Lo emite ${c.emisor}, no Edvanta` : null}</DatoCurso>
        <DatoCurso icon={Check}>{c.condiciones}</DatoCurso>
      </ul>
      {c.estado === 'pending_confirmation' && ficha.proveedor?.enlace && (
        <Btn className="mt-6" variant="secondary" onClick={accion} iconRight={ExternalLink}>
          Ver condiciones en {ficha.proveedor.nombre}
        </Btn>
      )}
    </CursoSection>
  );
}

/* ── Valoraciones y preguntas ───────────────────────────────── */

function Participacion({ ficha, refCurso, datos }) {
  const puedo = datos?.puedo || { opinar: false, comentar: false, moderar: false };

  return (
    <>
      <CursoSection id="valoraciones">
        <CursoHeading title="Valoraciones de estudiantes" />
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
      </CursoSection>

      <CursoSection id="preguntas">
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
      </CursoSection>
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

  // En el teléfono, cuando la tarjeta de acceso sale de la pantalla,
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
      <div className="curso-ficha min-h-screen bg-white">
        <SiteHeader />
        <main className="curso-container py-20">
          <CursoHeading as="h1" title={fallo}
            desc="Puede que lo hayamos retirado o que el enlace esté mal copiado. Estos son los cursos abiertos." />
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn to="/cursos">Ver todos los cursos</Btn>
            <Btn to="/" variant="secondary">Volver al inicio</Btn>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!ficha) {
    return (
      <div className="curso-ficha min-h-screen bg-white">
        <SiteHeader />
        <div className="curso-container py-24 text-center text-sm font-semibold text-edvanta-muted">
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
  const notaCertificado = {
    available: 'Acceso gratis al contenido. El certificado se emite desde tu aula al completar el curso.',
    pending_confirmation: 'Acceso gratis al contenido. Las condiciones del certificado están por confirmar.',
    not_offered: 'Acceso gratis al contenido. Este curso no incluye certificado.',
  }[ficha.certificado.estado] || 'Acceso gratis al contenido.';
  const notaAcceso = propio
    ? (estado === 'dentro'
      ? 'Ya estás inscrito. Puedes retomar el curso donde lo dejaste.'
      : notaCertificado)
    : `Se estudia en ${ficha.proveedor.nombre}. Edvanta lo seleccionó; no lo imparte.`;
  const hayBoton = ficha.capacidades.irAlProveedor || propio;

  const boton = (extra = '', variante = 'primary') => (hayBoton ? (
    <Btn size="lg" variant={variante} className={extra} onClick={accion}
      loading={trabajando} loadingLabel="Un momento…" iconRight={propio ? ArrowRight : ExternalLink}>
      {trabajando ? 'Un momento…' : textoBoton}
    </Btn>
  ) : null);

  const incluye = [
    ficha.unidades && ficha.clases
      ? `${ficha.unidades} unidades · ${ficha.clases} clases`
      : ficha.clases ? `${ficha.clases} clases` : ficha.unidades ? `${ficha.unidades} unidades` : null,
    horas,
    ficha.nivel ? `Nivel ${ficha.nivel.toLowerCase()}` : null,
    ficha.idioma ? `Idioma: ${ficha.idioma}` : null,
    ficha.modalidad || null,
    propio ? 'Acceso desde el celular y el computador' : null,
    ficha.certificado.estado === 'available'
      ? 'Certificado de aprobación de Edvanta'
      : ficha.certificado.estado === 'pending_confirmation'
        ? `Certificado según ${ficha.proveedor.nombre}`
        : null,
  ].filter(Boolean);

  const tituloBeneficioCertificado = ficha.certificado.estado === 'available'
    ? 'Certificado de aprobación'
    : ficha.certificado.estado === 'not_offered'
      ? 'Este curso no incluye certificado'
      : `Certificado de ${ficha.proveedor.nombre}`;
  const textoBeneficioCertificado = ficha.certificado.estado === 'available'
    ? 'Al completar el curso, Edvanta te expide tu certificado con tu nombre, las horas del curso y un código para verificarlo.'
    : ficha.certificado.estado === 'not_offered'
      ? 'Al terminar el curso no se expide certificado.'
      : `Las condiciones las define ${ficha.proveedor.nombre}. Consúltalas en su sitio antes de inscribirte.`;

  const descripcionTemario = [
    ficha.unidades ? `${ficha.unidades} unidades` : null,
    ficha.clases ? `${ficha.clases} clases` : null,
  ].filter(Boolean).join(' · ');

  const tieneAside = Boolean(ficha.publico || ficha.requisitos);
  const esEquipoEdvanta = propio && (!ficha.autoria || /edvanta/i.test(ficha.autoria));

  return (
    <div className="curso-ficha min-h-screen bg-white pb-20 lg:pb-0">
      <SiteHeader />

      <FichaCursoHero
        ficha={ficha}
        nombre={nombre}
        propio={propio}
        horas={horas}
        resumenOpiniones={resumenOpiniones}
        textoBoton={textoBoton}
        notaAcceso={notaAcceso}
        hayBoton={hayBoton}
        onAccion={accion}
        trabajando={trabajando}
        error={error}
        tarjetaRef={tarjetaRef}
      />

      <main>
        {/* Cómo se estudia y qué certifica, de un vistazo. */}
        <CursoSection first>
          <div className="curso-benefits">
            <BeneficioCurso
              icon={MonitorSmartphone}
              titulo={propio ? 'Modalidad 100 % virtual' : `Se estudia en ${ficha.proveedor.nombre}`}
            >
              {propio
                ? 'El contenido está disponible las 24 horas para que estudies a tu ritmo, desde el celular o el computador. Tu avance queda guardado clase a clase.'
                : `La inscripción y las clases ocurren en ${ficha.proveedor.nombre}. Edvanta lo seleccionó para su catálogo y te lleva hasta allí.`}
            </BeneficioCurso>
            <BeneficioCurso icon={Award} titulo={tituloBeneficioCertificado}>
              {textoBeneficioCertificado}
            </BeneficioCurso>
          </div>

          {incluye.length > 0 && (
            <div className="curso-includes">
              <h3 className="curso-includes-title">Este curso incluye</h3>
              <ul className="curso-includes-list">
                {incluye.map((t) => (
                  <li key={t}>
                    <Check className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CursoSection>

        {ficha.queAprenderas.length > 0 && (
          <CursoSection id="aprenderas">
            <CursoHeading title="Qué aprenderás" />
            <ResultadosCurso
              items={ficha.queAprenderas}
              intro={propio
                ? 'Al terminar el curso vas a poder:'
                : `Según ${ficha.proveedor.nombre}, en este curso aprenderás a:`}
            />
          </CursoSection>
        )}

        {ficha.capacidades.verTemario && (
          <CursoSection id="contenido">
            <CursoHeading
              title="Contenido del curso"
              desc={descripcionTemario
                ? `${descripcionTemario}. Puedes revisar cada unidad antes de inscribirte.`
                : 'Puedes revisar cada unidad antes de inscribirte.'}
            />
            <ContenidoCurso modulos={ficha.temario} />
          </CursoSection>
        )}

        {(descripcion || ficha.resumen || ficha.publico || ficha.requisitos) && (
          <CursoSection id="acerca">
            <CursoHeading title="Acerca del curso" />
            <div className={`curso-about-grid ${tieneAside ? '' : 'curso-about-grid--wide'}`.trim()}>
              <div>
                {descripcion ? (
                  // eslint-disable-next-line react/no-danger
                  <div className="ed-prose curso-prose" dangerouslySetInnerHTML={{ __html: descripcion }} />
                ) : (
                  <p className="max-w-[70ch] text-base leading-7 text-edvanta-muted">{ficha.resumen}</p>
                )}
                {!propio && (
                  <p className="mt-4 max-w-[70ch] text-sm leading-7 text-edvanta-muted">
                    Este curso se estudia en {ficha.proveedor.nombre}. Edvanta lo seleccionó para su
                    catálogo; la inscripción y las clases ocurren en su plataforma.
                  </p>
                )}
              </div>

              {tieneAside && (
                <aside className="curso-about-aside">
                  {ficha.publico && (
                    <div className="curso-info-card">
                      <h3>¿A quién está dirigido?</h3>
                      <p>{ficha.publico}</p>
                    </div>
                  )}
                  {ficha.requisitos && (
                    <div className="curso-info-card">
                      <h3>Qué necesitas antes</h3>
                      <p>{ficha.requisitos}</p>
                    </div>
                  )}
                </aside>
              )}
            </div>
          </CursoSection>
        )}

        <CursoSection id="quien">
          <CursoHeading title={propio ? 'Quién lo prepara' : 'Quién lo imparte'} />
          <div className="curso-teacher">
            <span className="curso-teacher-icon">
              <UserRound className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div>
              <h3>
                {propio
                  ? (esEquipoEdvanta ? 'Equipo académico de Edvanta' : ficha.autoria)
                  : ficha.proveedor.imparte}
              </h3>
              <p>
                {propio
                  ? (esEquipoEdvanta
                    ? 'Edvanta organiza este curso como una ruta de aprendizaje con recursos seleccionados: videos, documentos oficiales de las entidades que los publican y textos de apoyo escritos para el curso. Cada recurso mantiene a su autor; Edvanta hace la selección y el orden.'
                    : 'Autoría de los contenidos de este curso para Edvanta.')
                  : `Este curso lo imparte ${ficha.proveedor.imparte}. Edvanta lo seleccionó para su catálogo: la selección es nuestra, el contenido y la enseñanza son del proveedor.`}
              </p>
            </div>
          </div>
        </CursoSection>

        <Certificado ficha={ficha} nombre={nombre} accion={accion} boton={propio ? boton() : null} />

        <CursoSection id="preguntas-frecuentes">
          <CursoHeading title="Preguntas frecuentes" />
          <div className="mt-6 max-w-4xl">
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
          <Card className="mt-8 max-w-4xl">
            <h3 className="font-display text-lg font-bold text-edvanta-deep">¿Tienes más preguntas?</h3>
            <p className="mt-1.5 text-sm leading-7 text-edvanta-muted">
              Escríbenos y te respondemos sobre este curso en concreto.
            </p>
            <Btn href={EDVANTA_WHATSAPP_URL} external variant="secondary" size="sm" className="mt-4" iconRight={MessageCircle}>
              Preguntar por WhatsApp
            </Btn>
          </Card>
        </CursoSection>

        <Participacion ficha={ficha} refCurso={refCurso} datos={opiniones} />

        {relacionados.length > 0 && (
          <CursoSection>
            <CursoHeading title="Cursos relacionados" />
            <div className="curso-related-grid">
              {relacionados.map((r) => (
                <a key={r.url} href={r.url} className="curso-related-card">
                  <div className="curso-related-media">
                    {r.portada ? (
                      <img
                        src={imagen(r.portada)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <GraduationCap className="h-8 w-8 text-edvanta-blue/30" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="curso-related-body">
                    <p className="curso-related-source">{r.procedencia}</p>
                    <p className="curso-related-title">{r.titulo}</p>
                  </div>
                </a>
              ))}
            </div>
          </CursoSection>
        )}
      </main>

      <SiteFooter />

      {/* En el teléfono: el botón siempre a mano cuando la tarjeta ya no se ve. */}
      {hayBoton && !tarjetaVisible && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-edvanta-border bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(8,46,134,.25)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <p className="hidden min-w-0 flex-1 truncate text-sm font-bold text-edvanta-deep min-[420px]:block">
              {nombre}
            </p>
            <Btn
              size="sm"
              variant="primary"
              className="w-full shrink-0 min-[420px]:w-auto"
              onClick={accion}
              loading={trabajando}
              loadingLabel="Un momento…"
              iconRight={propio ? ArrowRight : ExternalLink}
            >
              {trabajando ? 'Un momento…' : textoBoton}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
