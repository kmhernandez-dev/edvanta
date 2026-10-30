/**
 * ============================================================
 *  VerificarCertificado.jsx — /certificados y /certificados/:codigo
 *
 *  Lo que abre el QR de cada certificado. Cualquiera (una empresa, una
 *  universidad) puede comprobar que un certificado es auténtico y sigue
 *  vigente. Muestra lo que prueba la autenticidad y nada más: del
 *  documento de identidad, solo los últimos cuatro caracteres.
 *
 *  Lleva el nombre de una persona: la página de cada código no se indexa.
 * ============================================================
 */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BadgeCheck, CircleAlert, Search, ShieldCheck, ShieldX } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import Diploma from '../components/edvanta/Diploma';
import { Breadcrumb, Btn, Card, Eyebrow, Section, SectionHeading } from '../components/edvanta/ui';
import { apiUrl } from '../config/api';
import { EMISOR, fechaLarga, textoDeHoras } from '../lib/certificado/formato';
import { updatePageSeo } from '../utils/seo';

const FORMATO = /^EDV-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{4}$/;

/** Acepta el código con o sin guiones, en minúsculas o con espacios. */
function normalizar(texto) {
  const t = String(texto || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
  const cuerpo = t.startsWith('EDV') ? t.slice(3) : t;
  return cuerpo.length === 8 ? `EDV-${cuerpo.slice(0, 4)}-${cuerpo.slice(4)}` : String(texto || '').trim().toUpperCase();
}

function Buscador({ inicial = '' }) {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState(inicial);
  const [error, setError] = useState('');
  const enviar = (e) => {
    e.preventDefault();
    const c = normalizar(codigo);
    if (!FORMATO.test(c)) { setError('El código tiene la forma EDV-XXXX-XXXX. Está abajo a la izquierda del certificado.'); return; }
    setError('');
    navigate(`/certificados/${c}`);
  };
  return (
    <form onSubmit={enviar} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row" noValidate>
      <label className="sr-only" htmlFor="codigo-certificado">Código del certificado</label>
      <input
        id="codigo-certificado"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder="EDV-XXXX-XXXX"
        autoComplete="off"
        spellCheck={false}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'codigo-error' : undefined}
        className="min-h-12 flex-1 rounded-[var(--ds-r-md)] border border-edvanta-border bg-white px-4 font-display text-base font-semibold uppercase tracking-[0.08em] text-edvanta-deep outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-edvanta-muted/70 focus:border-edvanta-teal focus:ring-2 focus:ring-edvanta-teal/25"
      />
      <Btn type="submit" icon={Search}>Verificar</Btn>
      {error && <p id="codigo-error" role="alert" className="text-sm font-semibold text-red-700 sm:basis-full">{error}</p>}
    </form>
  );
}

function Dato({ etiqueta, children }) {
  if (!children) return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-edvanta-border/80 py-3 last:border-0 sm:flex-row sm:gap-6">
      <dt className="w-44 shrink-0 text-sm font-semibold text-edvanta-muted">{etiqueta}</dt>
      <dd className="text-sm font-semibold text-edvanta-deep">{children}</dd>
    </div>
  );
}

export default function VerificarCertificado() {
  const { codigo: pedido } = useParams();
  const codigo = pedido ? normalizar(pedido) : null;
  const [estado, setEstado] = useState(codigo ? 'cargando' : 'inicio');
  const [c, setC] = useState(null);

  useEffect(() => {
    updatePageSeo({
      title: codigo ? `Certificado ${codigo} | Edvanta` : 'Verifica un certificado de Edvanta | Edvanta',
      description: 'Comprueba que un certificado de aprobación de Edvanta es auténtico y está vigente con su código.',
      canonical: codigo ? `https://edvanta.co/certificados/${codigo}` : 'https://edvanta.co/certificados',
      // La página de cada certificado lleva el nombre de una persona.
      robots: codigo ? 'noindex,nofollow' : 'index,follow',
    });
  }, [codigo]);

  useEffect(() => {
    if (!codigo) { setEstado('inicio'); return undefined; }
    let vivo = true;
    setEstado('cargando');
    fetch(apiUrl(`/api/certificados/${encodeURIComponent(codigo)}`))
      .then(async (r) => {
        const j = await r.json().catch(() => null);
        if (!vivo) return;
        if (r.ok && j?.ok) { setC(j.data); setEstado(j.data.estado === 'revocado' ? 'revocado' : 'vigente'); } else setEstado(r.status === 404 ? 'no-existe' : 'error');
      })
      .catch(() => { if (vivo) setEstado('error'); });
    return () => { vivo = false; };
  }, [codigo]);

  return (
    <div className="min-h-screen bg-edvanta-bg">
      <SiteHeader />
      <Section tone="diagonal">
        <Breadcrumb className="mb-8" items={[{ label: 'Inicio', to: '/' }, { label: 'Certificados', to: '/certificados' }, ...(codigo ? [{ label: codigo }] : [])]} />
        <div className="gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center">
          <div>
            <Eyebrow>Verificación de certificados</Eyebrow>
            <h1 className="mt-3 font-display text-[2rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-edvanta-blue sm:text-[2.6rem]">
              {estado === 'vigente' && 'Este certificado es auténtico'}
              {estado === 'revocado' && 'Este certificado fue revocado'}
              {estado === 'no-existe' && 'No encontramos ese certificado'}
              {(estado === 'inicio' || estado === 'cargando' || estado === 'error') && 'Verifica un certificado de Edvanta'}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-edvanta-muted">
              {estado === 'vigente' && `Lo expidió ${EMISOR.nombre} y sigue vigente. Estos son los datos que guardamos al emitirlo.`}
              {estado === 'revocado' && `${EMISOR.nombre} lo revocó${c?.revocadoEl ? ` el ${fechaLarga(c.revocadoEl)}` : ''}: ya no acredita la aprobación del curso.`}
              {estado === 'no-existe' && `Revisa que el código ${codigo} esté bien escrito. Está abajo a la izquierda del certificado, y el QR lleva directo aquí.`}
              {estado === 'error' && 'No pudimos consultar el certificado en este momento. Intenta de nuevo en unos minutos.'}
              {(estado === 'inicio' || estado === 'cargando') && 'Cada certificado de aprobación lleva un código único y un QR. Escríbelo para comprobar que es auténtico y que sigue vigente.'}
            </p>
            <div className="mt-7"><Buscador inicial={codigo || ''} /></div>
          </div>
          <div className="mt-10 lg:mt-0">
            {c && (estado === 'vigente' || estado === 'revocado') ? (
              <div className="relative">
                <Diploma titular={c.titular} documento={c.documento} curso={c.curso} horas={c.horas} modalidad={c.modalidad} fecha={c.emitidoEl} codigo={c.codigo} />
                {estado === 'revocado' && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-[var(--ds-r-lg)] bg-white/70">
                    <span className="-rotate-12 rounded-xl border-4 border-red-700 px-6 py-2 font-display text-3xl font-extrabold uppercase tracking-[0.2em] text-red-700">Revocado</span>
                  </span>
                )}
              </div>
            ) : (
              <Diploma muestra curso="Curso de Farmacoterapia de la Diabetes" horas={20} />
            )}
          </div>
        </div>
      </Section>

      {c && (estado === 'vigente' || estado === 'revocado') && (
        <Section tone="white" compact>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <Card className="p-6 sm:p-8">
              <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${estado === 'vigente' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                {estado === 'vigente' ? <ShieldCheck className="h-4 w-4" aria-hidden="true" /> : <ShieldX className="h-4 w-4" aria-hidden="true" />}
                {estado === 'vigente' ? 'Vigente' : 'Revocado'}
              </p>
              <dl className="mt-5">
                <Dato etiqueta="Titular">{c.titular}</Dato>
                <Dato etiqueta="Documento">{c.documento}</Dato>
                <Dato etiqueta="Curso aprobado">{c.curso}</Dato>
                <Dato etiqueta="Intensidad">{[textoDeHoras(c.horas), c.modalidad ? `modalidad ${c.modalidad.toLowerCase()}` : null].filter(Boolean).join(' · ')}</Dato>
                <Dato etiqueta="Expedido">{`${c.ciudad}, ${fechaLarga(c.emitidoEl)}`}</Dato>
                <Dato etiqueta="Código">{c.codigo}</Dato>
                <Dato etiqueta="Lo expide">{`${c.emisor.nombre} · NIT ${c.emisor.nit}`}</Dato>
              </dl>
            </Card>
            <div>
              <SectionHeading eyebrow="Cómo se verifica" title="Lo que prueba esta página" />
              <ul className="mt-5 flex flex-col gap-3 text-sm leading-7 text-edvanta-muted">
                <li className="flex gap-3"><BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-edvanta-teal" aria-hidden="true" />El código existe y lo emitió Edvanta al completarse el curso.</li>
                <li className="flex gap-3"><BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-edvanta-teal" aria-hidden="true" />Los datos son los que se guardaron ese día: no cambian aunque después cambie el nombre del curso.</li>
                <li className="flex gap-3"><CircleAlert className="mt-1 h-5 w-5 shrink-0 text-edvanta-teal" aria-hidden="true" />Para proteger a su titular, del documento de identidad solo se muestran los últimos cuatro caracteres.</li>
              </ul>
              <Btn className="mt-6" to="/cursos" variant="secondary">Ver los cursos de Edvanta</Btn>
            </div>
          </div>
        </Section>
      )}
      <SiteFooter />
    </div>
  );
}
