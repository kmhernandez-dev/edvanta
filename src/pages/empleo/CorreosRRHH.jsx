/**
 * ============================================================
 *  /empleo/correos — Plantillas de correo para recursos humanos
 *
 *  Herramienta: la persona llena sus datos una vez y las cinco
 *  plantillas quedan listas para copiar o abrir en su correo.
 * ============================================================
 */

import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Mail, Send } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import {
  ArrowLink, Breadcrumb, Btn, Card, CtaBanner, ImageSlot, LandingHero, Section, SectionHeading,
} from '../../components/edvanta/ui';
import { CAMPOS_CORREO, PLANTILLAS_CORREO } from '../../data/empleo/correos';
import { updatePageSeo } from '../../utils/seo';

const GUARDADO = 'edvanta_datos_correo';

/** Reemplaza {CAMPO} por lo escrito; si está vacío deja la marca visible. */
const aplicar = (texto, datos) =>
  texto.replace(/\{([A-Z_]+)\}/g, (marca, clave) => (datos[clave]?.trim() ? datos[clave].trim() : marca));

function Plantilla({ plantilla, datos }) {
  const [copiado, setCopiado] = useState(false);
  const asunto = useMemo(() => aplicar(plantilla.asunto, datos), [plantilla, datos]);
  const cuerpo = useMemo(() => aplicar(plantilla.cuerpo, datos), [plantilla, datos]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(`Asunto: ${asunto}\n\n${cuerpo}`);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch { /* portapapeles no disponible */ }
  };

  const mailto = `mailto:?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-edvanta-deep">{plantilla.titulo}</h3>
          <p className="mt-1 text-sm text-edvanta-muted">{plantilla.cuando}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copiar}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-edvanta-border bg-white px-4 text-xs font-bold text-edvanta-deep transition hover:border-edvanta-blue/40 hover:text-edvanta-blue"
          >
            {copiado
              ? <><Check className="h-3.5 w-3.5 text-edvanta-teal" aria-hidden="true" />Copiado</>
              : <><Copy className="h-3.5 w-3.5" aria-hidden="true" />Copiar</>}
          </button>
          <a
            href={mailto}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-edvanta-blue px-4 text-xs font-bold text-white transition hover:bg-edvanta-bluedark"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            Abrir en mi correo
          </a>
        </div>
      </div>

      <p className="mt-5 text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-muted">Asunto</p>
      <p className="mt-1 rounded-xl border border-edvanta-border bg-edvanta-bg px-4 py-2.5 text-sm font-semibold text-edvanta-deep">{asunto}</p>

      <p className="mt-4 text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-muted">Mensaje</p>
      <pre className="mt-1 whitespace-pre-wrap rounded-xl border border-edvanta-border bg-edvanta-bg p-4 font-sans text-sm leading-6 text-edvanta-deep">{cuerpo}</pre>
    </Card>
  );
}

export default function CorreosRRHH() {
  const [datos, setDatos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(GUARDADO) || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    updatePageSeo({
      title: 'Plantillas de correo para recursos humanos | Edvanta',
      description: 'Cinco correos listos para postular, insistir con elegancia, agradecer una entrevista y pedir un referido en el sector farmacéutico.',
      canonical: 'https://edvanta.co/empleo/correos',
      jsonLdId: 'empleo-correos',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Plantillas de correo para recursos humanos',
        url: 'https://edvanta.co/empleo/correos',
      },
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(GUARDADO, JSON.stringify(datos));
    } catch { /* almacenamiento no disponible */ }
  }, [datos]);

  const set = (k) => (e) => setDatos((prev) => ({ ...prev, [k]: e.target.value }));
  const completos = CAMPOS_CORREO.filter((c) => datos[c.key]?.trim()).length;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        <LandingHero
          breadcrumb={<Breadcrumb className="mb-6" items={[{ label: 'Empleo', to: '/empleo' }, { label: 'Correos a RR. HH.' }]} />}
          eyebrow="Plantillas de correo"
          title="El correo que acompaña tu hoja de vida"
          lead="Llena tus datos una vez y las cinco plantillas quedan listas: postulación, postulación espontánea, seguimiento, agradecimiento y referido."
          actions={(
            <>
              <Btn href="#datos" icon={Mail}>Completar mis datos</Btn>
              <Btn to="/hoja-de-vida" variant="secondary">Crear mi hoja de vida</Btn>
            </>
          )}
          media={(
            <ImageSlot
              ratio="photo"
              priority
              src="/img/empleo/escribiendo-correo-postulacion.webp"
              alt="Química farmacéutica escribiendo en su computador el correo de postulación, con la hoja de vida en PDF ya adjunta"
            />
          )}
        />

        {/* Datos */}
        <Section id="datos" tone="surface" bordered>
          <SectionHeading
            eyebrow="Tus datos"
            title="Escríbelos una vez"
            desc="Se guardan solo en este navegador y se aplican a todas las plantillas de abajo."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAMPOS_CORREO.map((c) => (
              <label key={c.key} className="block">
                <span className="mb-1 block text-sm font-bold text-edvanta-deep">{c.label}</span>
                <input
                  value={datos[c.key] || ''}
                  onChange={set(c.key)}
                  placeholder={c.placeholder}
                  className="min-h-11 w-full rounded-xl border border-edvanta-border px-3.5 text-sm outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15"
                />
              </label>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <p className="text-sm text-edvanta-muted" role="status">
              {completos} de {CAMPOS_CORREO.length} campos completos
            </p>
            {completos > 0 && (
              <button
                type="button"
                onClick={() => setDatos({})}
                className="text-sm font-bold text-edvanta-blue hover:underline"
              >
                Borrar mis datos
              </button>
            )}
          </div>
        </Section>

        {/* Plantillas */}
        <Section>
          <SectionHeading
            eyebrow="Plantillas"
            title="Cinco correos para todo el proceso"
            desc="Revisa el texto antes de enviar: el correo tiene que sonar a ti, no a plantilla."
          />
          <div className="mt-8 grid gap-6">
            {PLANTILLAS_CORREO.map((p) => <Plantilla key={p.id} plantilla={p} datos={datos} />)}
          </div>
        </Section>

        {/* Consejos */}
        <Section tone="surface" bordered>
          <div className="gap-10 lg:grid lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading eyebrow="Antes de enviar" title="Cuatro reglas que sí importan" />
              <ul className="mt-6 space-y-3 text-[15px] leading-7 text-edvanta-deep">
                <li>· Escribe el nombre del cargo exactamente como está en la publicación.</li>
                <li>· Adjunta la hoja de vida en PDF, nombrada <span className="font-semibold">Nombre-Apellido-Cargo.pdf</span>.</li>
                <li>· Envía en horario laboral, de martes a jueves si puedes elegir.</li>
                <li>· Un solo seguimiento por vacante: más que eso resta.</li>
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Btn to="/empleo/ofertas-qf" variant="secondary">Ver vacantes abiertas</Btn>
                <ArrowLink to="/linkedin">Mejorar mi LinkedIn</ArrowLink>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <ImageSlot
                ratio="wide"
                src="/img/empleo/ejemplo-correo-postulacion.webp"
                alt="Correo de postulación en pantalla: asunto con el cargo y el nombre, mensaje breve de tres párrafos y la hoja de vida adjunta en PDF"
              />
            </div>
          </div>
        </Section>

        <CtaBanner
          eyebrow="Siguiente paso"
          title="Ya tienes el correo. ¿Y la hoja de vida?"
          desc="Ármala con formato ATS, mira tu puntaje y descárgala en PDF legible por los filtros automáticos."
          actions={(
            <>
              <Btn to="/hoja-de-vida" variant="white">Crear mi hoja de vida</Btn>
              <Btn to="/empleo" variant="outlineWhite">Volver al centro de empleo</Btn>
            </>
          )}
        />
      </main>
      <SiteFooter />
    </>
  );
}
