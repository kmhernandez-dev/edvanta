/**
 * ============================================================
 *  Pacientes.jsx — /pacientes · Edvanta Contigo
 *
 *  La puerta para pacientes y cuidadores (landing tipo B: humana,
 *  cercana y clara). Lenguaje sin jerga, acentos aqua y lavanda para
 *  que no se confunda con la formación profesional.
 *
 *  Solo la ruta de tiroides tiene contenido. Las demás se muestran
 *  como rutas en desarrollo —sin página propia vacía— y permiten
 *  dejar el correo para el aviso. Es educación: no reemplaza la
 *  consulta, y la página lo dice antes de que haga falta preguntarlo.
 * ============================================================
 */

import { useEffect, useRef, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, BookOpen, Check, Droplet, HeartPulse, MessagesSquare, Ribbon, Stethoscope,
  Video, Wind, X,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Card, Section, SectionHeading } from '../../components/edvanta/ui';
import { HeroPaciente } from '../../components/edvanta/heroes';
import { EstadoBadge } from '../../components/edvanta/oferta';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import { EDVANTA_CONTIGO, FORMATOS_CONTIGO, RUTAS_CONTIGO } from '../../data/edvanta/programas';
import { updatePageSeo } from '../../utils/seo';

const ICONO_FORMATO = { aulas: Video, guias: BookOpen, encuentros: MessagesSquare };
const ICONO_RUTA = {
  tiroides: HeartPulse,
  'ruta-diabetes': Droplet,
  'ruta-renal': Activity,
  'ruta-cardiovascular': HeartPulse,
  'ruta-respiratoria': Wind,
  'ruta-oncologica': Ribbon,
};
const CORTO = {
  tiroides: 'Salud tiroidea',
  'ruta-diabetes': 'Diabetes',
  'ruta-renal': 'Salud renal',
  'ruta-cardiovascular': 'Corazón y presión',
  'ruta-respiratoria': 'Asma y EPOC',
  'ruta-oncologica': 'Oncología',
};

/**
 * Tarjeta de ruta. La imagen ya trae el nombre de la ruta escrito, así
 * que el título va para lectores de pantalla y la imagen es decorativa.
 */
function RutaCard({ ruta, abierta, onAvisar }) {
  const lista = ruta.estado === 'disponible';
  return (
    <article id={ruta.slug} className={`ds-card ds-card--interactive flex h-full scroll-mt-28 flex-col overflow-hidden ${lista ? 'ring-2 ring-edvanta-teal/35' : ''}`}>
      <div className="relative aspect-[3/2] overflow-hidden bg-edvanta-soft">
        <img src={ruta.imagen} alt="" width="1200" height="800" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        <EstadoBadge estado={ruta.estado} className="absolute right-3 top-3 shadow-sm" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="sr-only">{ruta.nombre}</h3>
        <p className="flex-1 text-[15px] leading-7 text-edvanta-muted">{ruta.texto}</p>
        {lista ? (
          <Btn to={ruta.to} variant="teal" iconRight={ArrowRight} className="mt-5 self-start">Entrar a la ruta</Btn>
        ) : (
          <Btn variant="secondary" onClick={() => onAvisar(ruta.slug)} aria-expanded={abierta} className="mt-5 self-start">
            {abierta ? 'Cerrar' : 'Avísame cuando abra'}
          </Btn>
        )}
      </div>
    </article>
  );
}

const ES_NO_ES = [
  { icon: Check, tono: 'teal', titulo: 'Es educación', texto: 'Te ayuda a entender tu condición, tus medicamentos y tus exámenes, y a preparar tus preguntas para la consulta.' },
  { icon: X, tono: 'violet', titulo: 'No es una consulta', texto: 'No damos diagnósticos ni indicaciones sobre tu tratamiento. No cambies ni suspendas un medicamento sin hablar con tu médico.' },
  { icon: AlertTriangle, tono: 'blue', titulo: 'Ante una urgencia', texto: 'Acude a un servicio de salud o llama a la línea de emergencias de tu ciudad.' },
];

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
        <HeroPaciente
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Para pacientes' }]} className="mb-8" />}
          eyebrow={EDVANTA_CONTIGO.nombre}
          title={EDVANTA_CONTIGO.lema}
          highlight="Participa en tu cuidado."
          lead={EDVANTA_CONTIGO.texto}
          image="/img/fotos/pacientes-taller.webp"
          imageAlt="Química farmacéutica explicando una cartilla educativa a un grupo de pacientes y cuidadores"
          note={{ title: 'Pequeños aprendizajes, grandes cambios', text: 'En lenguaje claro y preparado por una química farmacéutica.' }}
          actions={(
            <>
              <Btn to="/pacientes/tiroides" variant="teal" icon={HeartPulse} size="lg">Salud tiroidea</Btn>
              <Btn href="#rutas" variant="secondary" size="lg">Ver las rutas</Btn>
            </>
          )}
          topics={RUTAS_CONTIGO.map((r) => ({
            icon: ICONO_RUTA[r.slug] || HeartPulse,
            label: CORTO[r.slug] || r.nombre,
            to: r.to || `/pacientes#${r.slug}`,
            tone: r.estado === 'disponible' ? 'teal' : 'violet',
          }))}
        />

        <Section id="rutas" tone="white">
          <SectionHeading
            eyebrow="Rutas por condición"
            tone="teal"
            title="Empieza por la condición que te importa"
            desc="Cada ruta reúne guías, talleres y respuestas para una condición de salud. Hoy está abierta la de salud tiroidea; las demás están en preparación."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {RUTAS_CONTIGO.map((r) => (
              <RutaCard key={r.slug} ruta={r} abierta={ruta === r.slug} onAvisar={(s) => setRuta((v) => (v === s ? null : s))} />
            ))}
          </div>
          {elegida && (
            <div ref={aviso} className="mt-8 scroll-mt-28">
              <Card className="ds-surface-aqua border-edvanta-teal/25 sm:p-8">
                <h3 className="font-display text-xl font-extrabold text-edvanta-deep">Te avisamos cuando abra {elegida.nombre}</h3>
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

        <Section tone="aqua">
          <SectionHeading
            eyebrow="Formatos"
            tone="teal"
            title="Tres formas de aprender"
            desc="Elige cómo te queda más fácil: en vivo, a tu ritmo con material para leer, o en un encuentro para resolver dudas."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {FORMATOS_CONTIGO.map((f) => {
              const Icono = ICONO_FORMATO[f.id];
              return (
                <article key={f.id} className="ds-card flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img src={f.imagen} alt="" width="1200" height="800" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    <EstadoBadge estado={f.estado} className="absolute right-3 top-3 shadow-sm" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="sr-only">{f.nombre}</h3>
                    <p className="flex items-center gap-2 text-sm font-bold text-edvanta-tealdark">
                      <Icono className="h-4 w-4" aria-hidden="true" />{f.tipo}
                    </p>
                    <p className="mt-2 flex-1 text-[15px] leading-7 text-edvanta-muted">{f.texto}</p>
                    {f.nota && <p className="mt-3 text-sm font-semibold text-edvanta-deep">{f.nota}</p>}
                    {f.id === 'guias' && (
                      <Btn to="/guias#pacientes" variant="link" iconRight={ArrowRight} className="mt-4 self-start">Ver las guías</Btn>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </Section>

        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            <div>
              <span className="ds-icon-tile ds-icon-tile--teal h-14 w-14"><Stethoscope className="h-7 w-7" aria-hidden="true" /></span>
              <h2 className="mt-5 font-display text-[1.75rem] font-extrabold leading-tight text-edvanta-deep sm:text-3xl">Qué es y qué no es Edvanta Contigo</h2>
              <p className="mt-3 text-base leading-7 text-edvanta-muted">Lo decimos claro desde el principio, para que sepas qué esperar.</p>
              <Btn to="/descargo-medico" variant="link" iconRight={ArrowRight} className="mt-5">Leer el descargo médico</Btn>
            </div>
            <ul className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
              {ES_NO_ES.map(({ icon: Icon, tono, titulo, texto }) => (
                <li key={titulo} className="flex gap-4 border-t border-edvanta-border pt-5 lg:border-l-0">
                  <span className={`ds-icon-tile h-11 w-11 shrink-0 ${tono === 'teal' ? 'ds-icon-tile--teal' : tono === 'violet' ? 'ds-icon-tile--violet' : ''}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-base font-bold text-edvanta-deep">{titulo}</span>
                    <span className="mt-1 block text-[15px] leading-7 text-edvanta-muted">{texto}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section tone="lavender" compact>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">¿Eres profesional de la salud o representas una institución?</h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-edvanta-muted">
                La formación para quienes atienden pacientes está en la Escuela de Salud y Farmacia Clínica.
                También podemos llevar estas rutas a los pacientes de tu institución.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Btn to="/escuelas/salud" variant="secondary">Escuela de Salud</Btn>
              <Btn to="/instituciones/paquetes/ruta-contigo" variant="primary" iconRight={ArrowRight}>Ruta Contigo para instituciones</Btn>
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
