/**
 * ============================================================
 *  Guias.jsx — /guias · Guías y recursos
 *
 *  Separa sin mezclar:
 *    · kits y guías de Edvanta para profesionales (de pago, con carrito)
 *    · guías para pacientes y cuidadores (gratis o en Hotmart)
 *    · lecturas gratuitas (artículos y biblioteca de referencias)
 *    · cursos de otras plataformas, señalados como tales
 *    · herramientas gratuitas para la carrera
 * ============================================================
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookHeart, Briefcase, Compass, FileSpreadsheet, FileText, Library, Newspaper, Sparkles,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import ProductModal from '../../components/ProductModal';
import { Breadcrumb, Btn, NavCard, Section, SectionHeading } from '../../components/edvanta/ui';
import { HeroPlataforma } from '../../components/edvanta/heroes';
import { ProductoCard } from '../../components/edvanta/oferta';
import { KITS_PROFESIONALES, PRODUCTOS } from '../../data/edvanta/productos';
import { updatePageSeo } from '../../utils/seo';

/** Vista de la biblioteca dentro del portátil del héroe: los kits reales. */
function VistaBiblioteca() {
  return (
    <div className="flex h-full flex-col bg-[#F8FAFD] p-3 text-left sm:p-4" aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="font-display text-[11px] font-extrabold text-edvanta-blue sm:text-sm">Guías y recursos</span>
        <span className="rounded-full bg-edvanta-mint px-2 py-0.5 text-[9px] font-bold text-edvanta-tealdark sm:text-[11px]">{KITS_PROFESIONALES.length} kits</span>
      </div>
      <div className="mt-2 grid flex-1 grid-cols-2 gap-2 sm:mt-3 sm:gap-2.5">
        {KITS_PROFESIONALES.slice(0, 4).map((k, i) => (
          <div key={k.slug} className="flex flex-col justify-between rounded-lg bg-white p-2 shadow-[var(--ds-sh-xs)] ring-1 ring-edvanta-border sm:p-2.5">
            <span className={`inline-flex h-5 w-5 items-center justify-center rounded-md sm:h-7 sm:w-7 ${i % 2 ? 'bg-edvanta-lilac text-[#5E51A8]' : 'bg-edvanta-light text-edvanta-blue'}`}>
              <FileSpreadsheet className="h-3 w-3 sm:h-4 sm:w-4" />
            </span>
            <span className="mt-1.5 line-clamp-2 text-[9px] font-bold leading-tight text-edvanta-deep sm:text-[11px]">{k.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Guias() {
  const [kit, setKit] = useState(null);
  const paraPacientes = PRODUCTOS.filter((p) => p.publico === 'pacientes' && p.tipo === 'guia');

  useEffect(() => updatePageSeo({
    title: 'Guías y recursos | Edvanta',
    description: 'Kits y guías de Edvanta para profesionales farmacéuticos, guías para pacientes, artículos y herramientas gratuitas para tu carrera.',
    canonical: 'https://edvanta.co/guias',
  }), []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <HeroPlataforma
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Guías y recursos' }]} className="mb-8" />}
          eyebrow="Guías y recursos"
          title="Material para aplicar lo que sabes"
          highlight="lo que sabes"
          lead="Kits editables para el trabajo diario, guías para pacientes y lecturas gratuitas. Cada recurso dice para quién es, cómo se usa y si es gratis o de pago."
          preview={<VistaBiblioteca />}
          features={[
            { icon: FileSpreadsheet, label: 'Kits editables' },
            { icon: BookHeart, label: 'Guías para pacientes' },
            { icon: Newspaper, label: 'Artículos gratis' },
          ]}
          actions={(
            <>
              <Btn href="#profesionales" size="lg">Para profesionales</Btn>
              <Btn href="#pacientes" variant="secondary" size="lg">Para pacientes</Btn>
            </>
          )}
        />

        <Section id="profesionales">
          <SectionHeading
            eyebrow="Para profesionales"
            title="Kits de plantillas de Edvanta"
            desc="Formatos editables en Word, Excel y PDF. Se pagan en línea con Mercado Pago y, después del pago, te enviamos el kit por WhatsApp."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {KITS_PROFESIONALES.map((k) => <ProductoCard key={k.slug} producto={k} onVerKit={setKit} />)}
          </div>
        </Section>

        <Section id="pacientes" tone="tint" bordered>
          <SectionHeading
            eyebrow="Guías Contigo · Para pacientes y cuidadores"
            title="Guías para leer en casa y llevar a la consulta"
            desc="Educación en lenguaje claro. No reemplaza la indicación de tu médico."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {paraPacientes.map((p) => <ProductoCard key={p.slug} producto={p} />)}
          </div>
        </Section>

        <Section>
          <SectionHeading eyebrow="Gratis" title="Para leer y consultar" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <NavCard to="/articulos" icon={Newspaper} title="Artículos" desc="Lecturas sobre calidad, regulatorio, estudio y carrera en el sector farmacéutico." cta="Leer artículos" />
            <NavCard to="/recursos" icon={Library} title="Biblioteca de referencias" desc="Normativa, lecturas y fuentes conectadas con cada área profesional." cta="Abrir la biblioteca" />
            <NavCard to="/atenfarmaclinic" icon={FileText} tone="teal" title="AtenFarmaClinic" desc="Artículos y herramientas para la práctica de la farmacia clínica." cta="Entrar" />
          </div>
        </Section>

        <Section tone="tint" bordered>
          <SectionHeading
            eyebrow="Para tu carrera"
            title="Herramientas gratuitas"
            desc="Complementos gratuitos para quien busca empleo o quiere mostrar su perfil profesional."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <NavCard to="/hoja-de-vida" icon={FileText} title="Hoja de vida ATS" desc="Créala por pasos, mide su puntaje y descárgala en PDF." cta="Crear mi hoja de vida" />
            <NavCard to="/empleo" icon={Briefcase} title="Centro de empleo" desc="Ofertas para químicos farmacéuticos y guía de postulación." cta="Ver el centro de empleo" />
            <NavCard to="/talento" icon={Sparkles} title="Vitrina de talento" desc="Publica tu perfil profesional para que las empresas te encuentren." cta="Ver la vitrina" />
            <NavCard to="/carreras" icon={Compass} title="Carreras farmacéuticas" desc="Áreas, cargos y la formación que pide cada una." cta="Explorar carreras" />
          </div>
          <p className="mt-6 text-sm leading-7 text-edvanta-muted">
            También:{' '}
            {[
              ['Rutas profesionales', '/rutas'],
              ['Competencias', '/competencias'],
              ['Oportunidades y becas', '/oportunidades'],
              ['Proyectos de práctica', '/proyectos'],
              ['Certificaciones', '/certificaciones'],
              ['Espacios de conexión', '/conecta'],
              ['Emprendimientos', '/emprendimientos'],
              ['Centro de herramientas', '/herramientas'],
            ].map(([t, to], i) => (
              <span key={to}>
                {i > 0 && ' · '}
                <Link to={to} className="font-semibold text-edvanta-blue hover:underline">{t}</Link>
              </span>
            ))}
          </p>
        </Section>

        <Section>
          <div className="rounded-3xl border border-edvanta-border bg-white p-6 sm:p-8">
            <h2 className="font-display text-xl font-extrabold text-edvanta-deep">Cursos de otras plataformas</h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-7 text-edvanta-muted">
              En el catálogo también recomendamos cursos de Coursera, Udemy y Edutin. No son de Edvanta: el acceso, el
              precio y el certificado dependen de cada plataforma, y algunos enlaces son de afiliado, por lo que Edvanta
              puede recibir una comisión sin costo adicional para ti.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Btn to="/cursos#otras-plataformas" variant="secondary">Ver cursos recomendados</Btn>
              <Btn to="/afiliados" variant="ghost">Aviso de afiliados</Btn>
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
      {kit && <ProductModal product={kit} onClose={() => setKit(null)} />}
    </div>
  );
}
