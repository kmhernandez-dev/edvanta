/**
 * ============================================================
 *  /empresas/capacitacion — Formación para equipos
 *
 *  Landing del proceso «capacitar al equipo». Muestra el mismo
 *  catálogo de cursos que ve una persona en /cursos (misma API,
 *  mismas fichas y los mismos videos), más lo que solo existe
 *  para empresas: aula propia, capacitaciones privadas, grupos,
 *  evidencias y reportes.
 * ============================================================
 */

import { useEffect, useState } from 'react';
import {
  ArrowRight, BadgeCheck, BarChart3, FileStack, GraduationCap, Layers, MessageCircle,
  MonitorPlay, PlayCircle, Presentation, ShieldCheck, Upload, Users,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import ExternalCourseCard from '../../components/ExternalCourseCard';
import {
  ArrowLink, Breadcrumb, Btn, Card, CtaBanner, Faq, ImageSlot, LandingHero, Section, SectionHeading, Steps,
} from '../../components/edvanta/ui';
import { apiUrl } from '../../config/api';
import { EDVANTA_EMAIL, waLink } from '../../config/links';
import { updatePageSeo } from '../../utils/seo';

const WA = waLink('Hola, equipo Edvanta. Quiero una propuesta de capacitación para el equipo de mi empresa.');

/** Los 15 tipos de contenido que acepta una clase del aula. */
const CONTENIDOS = [
  { icon: PlayCircle, title: 'Videos', desc: 'Sube el archivo (hasta 8 GB) o incrusta YouTube y Vimeo. El avance se mide de verdad: si adelanta, no cuenta.' },
  { icon: Presentation, title: 'Diapositivas', desc: 'Carga el PDF de la presentación o incrusta Google Slides y Canva. Se ven dentro de la clase, sin salir del aula.' },
  { icon: FileStack, title: 'Documentos y formatos', desc: 'PDF, Word, Excel, imágenes y audio. Decides qué se puede descargar y qué solo se ve en pantalla.' },
  { icon: Layers, title: 'Lecturas y guías', desc: 'Texto con formato, listas, tablas y avisos. Puedes exigir un tiempo mínimo antes de darla por leída.' },
];

const PARA_EMPRESAS = [
  { icon: Upload, title: 'Tus propias capacitaciones', desc: 'Inducción, procedimientos, producto, normativa: lo que hoy das en sala queda grabado y asignado.' },
  { icon: Users, title: 'Grupos, sedes y cohortes', desc: 'Organiza al equipo como funciona en la realidad y asigna a un grupo completo en un clic.' },
  { icon: ShieldCheck, title: 'Contenido privado', desc: 'Las capacitaciones de tu empresa solo las ven las personas de tu empresa. Sin cruces con otras compañías.' },
  { icon: BarChart3, title: 'Evidencias y reportes', desc: 'Avance por persona y grupo, expediente individual y exportación a CSV y PDF para auditorías.' },
];

const PASOS = [
  { title: 'Definimos el plan', desc: 'Qué debe saber cada rol y en cuánto tiempo.' },
  { title: 'Cargamos el contenido', desc: 'Subimos tus videos y diapositivas, o armamos el curso contigo.' },
  { title: 'Asignamos al equipo', desc: 'Importamos la lista por CSV y cada persona recibe su acceso.' },
  { title: 'Medimos y ajustamos', desc: 'Reportes de avance y recordatorios de lo que está por vencer.' },
];

const FAQS = [
  { q: '¿Podemos usar los cursos del catálogo y además los nuestros?', a: 'Sí. En la misma aula conviven los cursos propios de Edvanta y las capacitaciones privadas de tu empresa. Cada persona ve solo lo que le asignaste.' },
  { q: '¿Qué tan pesados pueden ser los archivos?', a: 'Hasta 8 GB por archivo, que alcanza para grabaciones largas de jornadas completas. La carga se hace por partes, así que si se corta la conexión continúa donde iba.' },
  { q: '¿Se puede exigir una evaluación para dar el curso por completado?', a: 'Sí. Puedes definir el porcentaje de clases obligatorias, la nota mínima y los intentos permitidos.' },
  { q: '¿Qué pasa si actualizamos un procedimiento?', a: 'Publicas una versión nueva del curso. Si marcas la actualización como obligatoria, a quienes están en curso se les reasigna la versión nueva y queda registrado.' },
  { q: '¿Cuánto cuesta?', a: 'Depende del número de participantes y de si necesitas que produzcamos el contenido. Escríbenos y te enviamos la propuesta con el alcance y los tiempos.' },
];

export default function EmpresasCapacitacion() {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    updatePageSeo({
      title: 'Capacitación empresarial farmacéutica | Edvanta para empresas',
      description: 'Aula virtual para tu empresa: sube tus videos y diapositivas, asigna cursos por grupo y mide el avance con evidencias auditables. Incluye el catálogo Edvanta.',
      canonical: 'https://edvanta.co/empresas/capacitacion',
      jsonLdId: 'empresas-capacitacion',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Capacitación empresarial Edvanta',
        serviceType: 'Formación corporativa para el sector farmacéutico',
        provider: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
        url: 'https://edvanta.co/empresas/capacitacion',
      },
    });
  }, []);

  // Mismo catálogo que ve una persona en /cursos: misma API y las mismas fichas.
  useEffect(() => {
    const controller = new AbortController();
    fetch(apiUrl('/api/courses?limit=6&page=1'), { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => { if (d.ok && Array.isArray(d.data)) setCursos(d.data); })
      .catch(() => {})
      .finally(() => setCargando(false));
    return () => controller.abort();
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        <LandingHero
          breadcrumb={<Breadcrumb className="mb-6" items={[{ label: 'Empresas', to: '/empresas' }, { label: 'Capacitación' }]} />}
          eyebrow="Capacitación para equipos"
          title="Tu equipo formado, con evidencia de que lo formaste"
          lead="Sube tus videos y diapositivas, asigna cursos por grupo y mira el avance de cada persona. Y si necesitas contenido, usas el catálogo de Edvanta."
          bullets={[
            'Aula virtual propia de tu empresa',
            'Videos y presentaciones de hasta 8 GB',
            'Asignación por grupo, sede o cohorte',
            'Reportes en CSV y PDF para auditoría',
          ]}
          actions={(
            <>
              <Btn href={WA} external icon={MessageCircle}>Pedir una propuesta</Btn>
              <Btn to="/aula" variant="secondary" icon={MonitorPlay}>Entrar al aula</Btn>
            </>
          )}
          media={(
            <ImageSlot
              ratio="photo"
              priority
              label="Capacitación del equipo en curso"
              hint="Foto horizontal 4:3, mínimo 1200 × 900 px: personas del sector en formación o una clase del aula proyectada."
            />
          )}
        />

        {/* Qué se puede poner en una clase */}
        <Section>
          <SectionHeading
            eyebrow="Contenido de las clases"
            title="Todo lo que ya tienes, dentro del aula"
            desc="No hay que rehacer el material: lo que hoy está en una carpeta compartida entra tal cual y queda ordenado por módulos y clases."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {CONTENIDOS.map((c) => (
              <Card key={c.title} hover className="flex gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-edvanta-mint text-edvanta-tealdark">
                  <c.icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-base font-bold text-edvanta-deep">{c.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{c.desc}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-edvanta-border bg-white p-6">
            <p className="text-sm leading-7 text-edvanta-muted">
              <span className="font-bold text-edvanta-deep">Subida por partes:</span> los archivos grandes se cargan en bloques con
              barra de progreso. Si la conexión se corta, la carga continúa donde iba. Puedes reemplazar un archivo sin volver a
              armar la clase y el aula avisa a quién le cambió el contenido.
            </p>
          </div>
        </Section>

        {/* Lo que solo tienen las empresas */}
        <Section tone="surface" bordered>
          <SectionHeading eyebrow="Solo para empresas" title="Lo que no tiene una cuenta personal" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {PARA_EMPRESAS.map((p) => (
              <Card key={p.title} hover className="flex gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-edvanta-light text-edvanta-blue">
                  <p.icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-base font-bold text-edvanta-deep">{p.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{p.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* Catálogo: los mismos cursos de la parte personal */}
        <Section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Catálogo Edvanta"
              title="Los mismos cursos que ve una persona, ahora para tu equipo"
              desc="Es el catálogo completo de edvanta.co: el mismo contenido, las mismas fichas y los mismos videos, que puedes asignar a los grupos de tu empresa."
            />
            <ArrowLink to="/cursos">Ver el catálogo completo</ArrowLink>
          </div>

          {cargando ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-80 animate-pulse rounded-2xl border border-edvanta-border bg-white" />)}
            </div>
          ) : cursos.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cursos.map((c) => <ExternalCourseCard key={c.id || c.slug} course={c} />)}
            </div>
          ) : (
            <Card className="mt-8 text-center">
              <GraduationCap className="mx-auto h-8 w-8 text-edvanta-subtle" aria-hidden="true" />
              <p className="mt-3 text-base font-bold text-edvanta-deep">El catálogo se está actualizando</p>
              <p className="mt-1.5 text-sm text-edvanta-muted">Puedes verlo completo en la página de cursos.</p>
              <Btn to="/cursos" className="mt-5" iconRight={ArrowRight}>Ir al catálogo</Btn>
            </Card>
          )}

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              { t: 'Rutas por cargo', d: 'Cursos en orden para llegar a un rol concreto.', to: '/rutas' },
              { t: 'Competencias', d: 'Qué debe dominar cada área del sector.', to: '/competencias' },
              { t: 'Cursos gratis', d: 'Opciones sin costo para empezar hoy.', to: '/cursos-gratis' },
            ].map((x) => (
              <Card key={x.t} hover>
                <p className="text-base font-bold text-edvanta-deep">{x.t}</p>
                <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{x.d}</p>
                <ArrowLink to={x.to} className="mt-4">Ver</ArrowLink>
              </Card>
            ))}
          </div>
        </Section>

        {/* Proceso */}
        <Section tone="surface" bordered>
          <SectionHeading eyebrow="Implementación" title="Cuatro pasos para tener el aula funcionando" />
          <Steps className="mt-8" items={PASOS} />
          <div className="mt-8">
            <ImageSlot
              ratio="banner"
              label="Panel de avance del aula"
              hint="Captura ancha del tablero con el avance por grupo. 2100 × 900 px."
            />
          </div>
        </Section>

        {/* Garantías */}
        <Section>
          <div className="gap-10 lg:grid lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading eyebrow="Seguridad y trazabilidad" title="Cada acción queda registrada" />
              <ul className="mt-6 space-y-3">
                {[
                  'Cuentas con contraseña propia y sesión que se puede cerrar desde la administración.',
                  'Permisos verificados en el servidor: nadie ve un archivo al que no fue invitado.',
                  'Bitácora con quién creó, publicó, asignó y calificó, con fecha y hora.',
                  'Los resultados académicos no se pueden cambiar en silencio: todo cambio de nota queda anotado.',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[15px] leading-7 text-edvanta-deep">
                    <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-edvanta-teal" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 lg:mt-0">
              <Faq items={FAQS} />
            </div>
          </div>
        </Section>

        <CtaBanner
          eyebrow="Empecemos"
          title="Te armamos una propuesta con tu contenido y tu equipo"
          desc="Cuéntanos cuántas personas son y qué necesitan aprender. Te respondemos con el plan, el aula y los tiempos."
          actions={(
            <>
              <Btn href={WA} external variant="white" icon={MessageCircle}>Escribir por WhatsApp</Btn>
              <Btn href={`mailto:${EDVANTA_EMAIL}?subject=Propuesta%20de%20capacitaci%C3%B3n%20empresarial`} variant="outlineWhite">Enviar un correo</Btn>
              <Btn to="/empresas/talento" variant="outlineWhite" icon={Users}>También busco talento</Btn>
            </>
          )}
        />
      </main>
      <SiteFooter />
    </>
  );
}
