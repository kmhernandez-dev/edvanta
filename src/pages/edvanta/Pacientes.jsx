/**
 * ============================================================
 *  Pacientes.jsx — /pacientes · Edvanta Contigo
 *
 *  La puerta para pacientes y cuidadores. Lenguaje cercano, sin
 *  jerga, y en turquesa para que no se confunda con la formación
 *  profesional.
 *
 *  Solo la ruta de tiroides tiene contenido. Las demás se muestran
 *  como rutas en desarrollo —sin página propia vacía— y permiten
 *  dejar el correo para el aviso. Es educación: no reemplaza la
 *  consulta, y la página lo dice antes de que haga falta preguntarlo.
 * ============================================================
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, HeartPulse, MessagesSquare, Stethoscope, Video } from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Card, LandingHero, Section, SectionHeading } from '../../components/edvanta/ui';
import { EstadoBadge } from '../../components/edvanta/oferta';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import { EDVANTA_CONTIGO, FORMATOS_CONTIGO, RUTAS_CONTIGO } from '../../data/edvanta/programas';
import { updatePageSeo } from '../../utils/seo';

const ICONO_FORMATO = { aulas: Video, guias: BookOpen, encuentros: MessagesSquare };

function RutaCard({ ruta, abierta, onAvisar }) {
  const lista = ruta.estado === 'disponible';
  return (
    <article className={`flex h-full flex-col rounded-2xl border p-6 ${lista ? 'border-edvanta-teal/40 bg-white shadow-[0_6px_20px_rgba(37,167,176,.12)]' : 'border-edvanta-border bg-white'}`}>
      <EstadoBadge estado={ruta.estado} className="self-start" />
      <h3 className="mt-3 font-display text-lg font-extrabold text-edvanta-deep">{ruta.nombre}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-6 text-edvanta-muted">{ruta.texto}</p>
      {lista ? (
        <Link to={ruta.to} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-edvanta-teal px-5 text-sm font-semibold text-white transition hover:bg-edvanta-tealdark">
          Entrar a la ruta
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => onAvisar(ruta.slug)}
          aria-expanded={abierta}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-edvanta-border px-5 text-sm font-semibold text-edvanta-tealdark transition hover:border-edvanta-teal"
        >
          {abierta ? 'Cerrar' : 'Avísame cuando abra'}
        </button>
      )}
    </article>
  );
}

export default function Pacientes() {
  const [ruta, setRuta] = useState(null);
  const aviso = useRef(null);

  // El formulario aparece debajo de todas las rutas: en el celular quedaría
  // fuera de la vista, así que se baja hasta él al abrirlo.
  useEffect(() => {
    if (ruta) aviso.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [ruta]);

  useEffect(() => updatePageSeo({
    title: 'Edvanta Contigo | Educación en salud para pacientes y cuidadores',
    description: 'Comprende tu salud y participa en tu cuidado: guías, talleres y rutas educativas en lenguaje claro, empezando por la salud tiroidea.',
    canonical: 'https://edvanta.co/pacientes',
  }), []);

  const elegida = RUTAS_CONTIGO.find((r) => r.slug === ruta);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <LandingHero
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Para pacientes' }]} className="mb-6" />}
          eyebrow={EDVANTA_CONTIGO.nombre}
          title={EDVANTA_CONTIGO.lema}
          lead={EDVANTA_CONTIGO.texto}
          actions={(
            <>
              <Btn to="/pacientes/tiroides" variant="teal" icon={HeartPulse}>Salud tiroidea</Btn>
              <Btn href="#rutas" variant="secondary">Ver las rutas</Btn>
            </>
          )}
        />

        <Section id="rutas">
          <SectionHeading
            eyebrow="Rutas por condición"
            title="Empieza por la condición que te importa"
            desc="Cada ruta reúne guías, talleres y respuestas para una condición de salud. Hoy está abierta la de salud tiroidea; las demás están en preparación."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RUTAS_CONTIGO.map((r) => (
              <RutaCard key={r.slug} ruta={r} abierta={ruta === r.slug} onAvisar={(s) => setRuta((v) => (v === s ? null : s))} />
            ))}
          </div>
          {elegida && (
            <div ref={aviso} className="mt-6 scroll-mt-28">
            <Card>
              <h3 className="text-lg font-bold text-edvanta-deep">Te avisamos cuando abra {elegida.nombre}</h3>
              <p className="mt-1 text-sm text-edvanta-muted">Solo usaremos tu correo para avisarte de esta ruta, salvo que marques que quieres recibir otras novedades.</p>
              <div className="mt-5">
                <FormularioSolicitud
                  key={elegida.slug}
                  tipo="interes"
                  referencia={elegida.slug}
                  roles={['paciente', 'cuidador', 'otro']}
                  pacientes
                  boton="Avisarme"
                  exito={`Te escribiremos cuando abra ${elegida.nombre}.`}
                  resumenWa={`Me interesa ${elegida.nombre} de Edvanta Contigo.`}
                />
              </div>
            </Card>
            </div>
          )}
        </Section>

        <Section tone="tint" bordered>
          <SectionHeading eyebrow="Formatos" title="Tres formas de aprender" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {FORMATOS_CONTIGO.map((f) => {
              const Icono = ICONO_FORMATO[f.id];
              return (
                <article key={f.id} className="flex h-full flex-col rounded-2xl border border-edvanta-border bg-white p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-edvanta-mint text-edvanta-tealdark">
                      <Icono className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <EstadoBadge estado={f.estado} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-extrabold text-edvanta-deep">{f.nombre}</h3>
                  <p className="text-sm font-semibold text-edvanta-tealdark">{f.tipo}</p>
                  <p className="mt-2 flex-1 text-sm leading-6 text-edvanta-muted">{f.texto}</p>
                  {f.nota && <p className="mt-3 text-sm font-medium text-edvanta-deep">{f.nota}</p>}
                  {f.id === 'guias' && (
                    <Link to="/guias#pacientes" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-tealdark hover:underline">
                      Ver las guías
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </Section>

        <Section>
          <div className="grid gap-8 rounded-3xl border border-edvanta-border bg-edvanta-bg p-6 sm:p-10 lg:grid-cols-[auto_minmax(0,1fr)]">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-edvanta-tealdark ring-1 ring-edvanta-border">
              <Stethoscope className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">Qué es y qué no es Edvanta Contigo</h2>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-7 text-edvanta-muted">
                <li><strong className="text-edvanta-deep">Es educación:</strong> te ayuda a entender tu condición, tus medicamentos y tus exámenes, y a preparar tus preguntas para la consulta.</li>
                <li><strong className="text-edvanta-deep">No es una consulta:</strong> no damos diagnósticos ni indicaciones sobre tu tratamiento. No cambies ni suspendas un medicamento sin hablar con tu médico.</li>
                <li><strong className="text-edvanta-deep">Ante una urgencia</strong> acude a un servicio de salud.</li>
              </ul>
              <Link to="/descargo-medico" className="mt-4 inline-flex text-sm font-semibold text-edvanta-blue hover:underline">Leer el descargo médico</Link>
            </div>
          </div>
        </Section>

        <Section tone="tint" bordered>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">¿Eres profesional de la salud?</h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-edvanta-muted">
                La formación para quienes atienden pacientes está en la Escuela de Salud y Farmacia Clínica.
                ¿Representas una institución? También podemos llevar estas rutas a tus pacientes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Btn to="/escuelas/salud" variant="secondary">Escuela de Salud</Btn>
              <Btn to="/instituciones#ruta-contigo" variant="secondary">Ruta Contigo para instituciones</Btn>
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
