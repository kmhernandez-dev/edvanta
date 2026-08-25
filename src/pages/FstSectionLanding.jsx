import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import FstHeader from '../components/fst/FstHeader';
import FstSectionNav from '../components/fst/FstSectionNav';
import FstFooter from '../components/fst/FstFooter';
import Icon from '../components/Icon';
import { ebooks } from '../data/fst';
import { FST_COMMUNITY_URL, waLink } from '../config/links';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';

const bookGroups = [
  { id: 'todos', label: 'Todos' },
  { id: 'diagnostico', label: 'Diagnóstico y tratamiento' },
  { id: 'alimentacion', label: 'Alimentación y digestión' },
  { id: 'bienestar', label: 'Síntomas y bienestar' },
  { id: 'vida-sin-tiroides', label: 'Vida sin tiroides' },
];

function bookGroup(book) {
  const value = `${book.name} ${book.category}`.toLowerCase();
  if (/alimenta|digest|probió|ayuno|metabol|hashimoto/.test(value)) return 'alimentacion';
  if (/insomnio|cabello|emocion|síntoma/.test(value)) return 'bienestar';
  if (/yodoterapia|sin tiroides|post.?operator|tiroidect/.test(value)) return 'vida-sin-tiroides';
  return 'diagnostico';
}

function Seo({ section, title, description, image = '/img/feliz-sin-tiroides-hero-v2.webp' }) {
  useEffect(() => updatePageSeo({
    title: `${title} | Feliz Sin Tiroides`,
    description,
    canonical: `https://edvanta.co/feliz-sin-tiroides/${section}`,
    image: `https://edvanta.co${image}`,
    jsonLdId: `fst-${section}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      isPartOf: { '@type': 'WebSite', name: 'Feliz Sin Tiroides', url: 'https://edvanta.co/feliz-sin-tiroides' },
    },
  }), [description, image, section, title]);
  return null;
}

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-white text-[#132e55]">
      <FstHeader />
      <main className="pt-[68px]">{children}</main>
      <FstFooter />
    </div>
  );
}

function PageHero({ eyebrow, title, description, image, imageAlt, actions }) {
  return (
    <>
      <section className="overflow-hidden bg-[#f8f5fb]">
        <div className="mx-auto grid min-h-[520px] max-w-7xl lg:grid-cols-[1.02fr_.98fr]">
          <div className="flex items-center px-5 py-16 sm:px-8 lg:px-12">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b8176]">{eyebrow}</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#102c52] sm:text-5xl">{title}</h1>
              <p className="mt-5 text-lg leading-8 text-[#526279]">{description}</p>
              {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
            </div>
          </div>
          <div className="relative min-h-80 bg-[#dfeeea]">
            <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </section>
      <FstSectionNav />
    </>
  );
}

function GuideTile({ book }) {
  const url = book.checkoutUrl || book.hotmartUrl;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#dfe5e8] bg-white">
      <img src={book.cover.image} alt={`Portada de ${book.name}`} loading="lazy" className="aspect-[3/4] w-full bg-[#f4f7f7] object-cover" />
      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-base font-bold leading-snug text-[#102c52]">{book.name}</h2>
        <p className="mt-3 text-sm font-semibold text-[#0b8176]">{book.price ? `$ ${book.price.toLocaleString('es-CO')} COP` : 'Consulta el precio en Hotmart'}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('hotmart_click', { product_id: book.id, location: 'guias_landing' })} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#563a78] px-4 text-sm font-bold text-white hover:bg-[#452b65]">
          Ver ebook <Icon name="external" className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

function GuidesPage() {
  const [group, setGroup] = useState('todos');
  const available = useMemo(() => ebooks.filter(book => book.checkoutUrl || book.hotmartUrl), []);
  const visible = group === 'todos' ? available : available.filter(book => bookGroup(book) === group);
  return (
    <PageShell>
      <Seo section="guias" title="Ebooks y guías para cuidar tu tiroides" description="Guías educativas sobre hipotiroidismo, hipertiroidismo, levotiroxina, alimentación, síntomas, yodoterapia y vida sin tiroides." />
      <PageHero eyebrow="Biblioteca Feliz Sin Tiroides" title="Accede a más de 1.200 ebooks para cuidar tu tiroides" description="Encuentra contenidos sobre hipotiroidismo, Hashimoto, Graves, cáncer de tiroides, yodoterapia, alimentación, medicamentos, síntomas y vida sin tiroides. La biblioteca crece continuamente." image="/img/COLECCION DE LA TIROIDES (10).png" imageAlt="Colección de guías educativas de Feliz Sin Tiroides" actions={<a href="#catalogo-guias" className="inline-flex min-h-12 items-center rounded-md bg-[#0b8176] px-5 text-sm font-bold text-white">Explorar la biblioteca</a>} />
      <section id="catalogo-guias" className="scroll-mt-8 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#76539a]">Elige según tu momento</p>
          <h2 className="mt-2 text-3xl font-semibold">Ebooks disponibles</h2>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Filtrar guías">
            {bookGroups.map(item => <button key={item.id} type="button" onClick={() => setGroup(item.id)} className={`min-h-10 shrink-0 rounded-md border px-4 text-sm font-semibold ${group === item.id ? 'border-[#563a78] bg-[#563a78] text-white' : 'border-[#d7dfe3] bg-white text-[#405268] hover:border-[#0b8176]'}`}>{item.label}</button>)}
          </div>
          <p className="mt-3 text-sm text-[#66758a]">{visible.length} recursos con enlace de compra disponible.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{visible.map(book => <GuideTile key={book.id} book={book} />)}</div>
        </div>
      </section>
      <section className="bg-[#edf8f6] py-14">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
          <div><h2 className="text-2xl font-semibold">Aprender también es sentirse acompañada</h2><p className="mt-2 max-w-2xl leading-7 text-[#526279]">Únete a la comunidad para conversar sobre hábitos y aprendizajes sin compartir datos clínicos sensibles.</p></div>
          <a href={FST_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 shrink-0 items-center rounded-md bg-[#0b8176] px-5 font-bold text-white">Unirme a la comunidad</a>
        </div>
      </section>
    </PageShell>
  );
}

const careSteps = [
  ['Revisión completa de tu farmacoterapia', 'Organizamos medicamentos, suplementos, horarios y formas de administración para detectar dudas o posibles problemas que deban consultarse con tu equipo tratante.'],
  ['Horario personalizado', 'Recibes un documento claro con dosis indicada, horario, forma de toma, separaciones necesarias y recordatorios importantes.'],
  ['Revisión de interacciones', 'Revisamos medicamentos entre sí y su relación con suplementos, alimentos y bebidas, sin modificar la prescripción médica.'],
  ['Plan para mejorar la adherencia', 'Adaptamos la organización del tratamiento a tu rutina para reducir olvidos, errores de horario y dificultades de cumplimiento.'],
  ['Síntomas y controles organizados', 'Te entregamos recursos para registrar síntomas, resultados y preguntas para tus próximas consultas.'],
  ['Plan de acción farmacéutico', 'Sabrás qué estás haciendo bien, qué conviene corregir u organizar, qué debes vigilar y qué consultar con tu médico.'],
  ['Seguimiento farmacéutico', 'Revisamos cómo estás aplicando el plan y qué dificultades requieren una nueva conversación o derivación profesional.'],
];

function PharmaceuticalPage() {
  const contact = waLink('Hola, quiero agendar una atención farmacéutica personalizada de Feliz Sin Tiroides.');
  const CTA = ({ children = 'Agendar atención farmacéutica' }) => <a href={contact} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { location: 'atencion_farmaceutica_landing' })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#563a78] px-5 font-bold text-white hover:bg-[#452b65]"><Icon name="whatsapp" className="h-5 w-5" />{children}</a>;
  return (
    <PageShell>
      <Seo section="atencion-farmaceutica" title="Atención farmacéutica personalizada para pacientes tiroideos" description="Organiza medicamentos, suplementos, horarios, interacciones, síntomas y controles con acompañamiento farmacéutico educativo." image="/img/herramienta-farmaceutica.jpg" />
      <PageHero eyebrow="Acompañamiento profesional 100 % virtual" title="Recibe atención farmacéutica personalizada" description="Una conversación individual para organizar medicamentos, suplementos, alimentación, controles y dudas de tu tratamiento con mayor claridad." image="/img/herramienta-farmaceutica.jpg" imageAlt="Química farmacéutica orientando a una paciente" actions={<CTA />} />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b8176]">Lo que trabajaremos</p><h2 className="mt-2 text-3xl font-semibold">De la información dispersa a un plan claro</h2><p className="mt-4 text-lg leading-8 text-[#526279]">La sesión se enfoca en comprender cómo usas tu tratamiento y ayudarte a preparar decisiones y preguntas más seguras junto a tu médico.</p></div>
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {careSteps.map(([title, text], index) => <article key={title} className="flex gap-4 border-t border-[#dfe6e5] pt-5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#dff3ee] text-sm font-bold text-[#087168]">{index + 1}</span><div><h3 className="text-lg font-bold">{title}</h3><p className="mt-2 leading-7 text-[#5d6b7d]">{text}</p></div></article>)}
          </div>
        </div>
      </section>
      <section className="bg-[#f7f2fa] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#76539a]">Especial atención a tu levotiroxina</p><h2 className="mt-2 text-3xl font-semibold">No tienes que seguir preguntándote si la estás tomando bien</h2><p className="mt-4 leading-7 text-[#5d6b7d]">Revisamos la rutina indicada por tu prescriptor y organizamos los factores que pueden afectar su administración.</p></div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {['Hora de la toma', 'Tiempo antes de comer', 'Otros medicamentos', 'Suplementos utilizados', 'Alimentos o bebidas cercanos', 'Dificultades para cumplir el horario'].map(item => <li key={item} className="flex items-start gap-3 rounded-md border border-[#dfd3e9] bg-white p-4 font-semibold"><Icon name="checkCircle" className="mt-0.5 h-5 w-5 shrink-0 text-[#0b8176]" />{item}</li>)}
          </ul>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold">¿Para quién es?</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{['Hipotiroidismo', 'Tiroiditis de Hashimoto', 'Enfermedad de Graves', 'Cáncer de tiroides', 'Personas sin tiroides', 'Después de tiroidectomía', 'Yodoterapia', 'Tratamiento con levotiroxina'].map(item => <div key={item} className="rounded-md border border-[#dfe6e5] p-4 font-semibold text-[#405268]">{item}</div>)}</div>
          <div className="mt-10 flex flex-col items-start gap-4 border-l-4 border-[#ef8f71] bg-[#fff5f1] p-6"><p className="max-w-4xl leading-7 text-[#5d5360]">Este servicio educa y organiza. No diagnostica, no prescribe, no cambia dosis y no sustituye una consulta médica ni la atención de urgencias.</p><CTA children="Agendar mi atención" /></div>
        </div>
      </section>
    </PageShell>
  );
}

const sectionContent = {
  herramientas: {
    title: 'Herramientas para organizar tu bienestar tiroideo', eyebrow: 'Recursos prácticos', description: 'Registra hábitos, explora recetas y prepara mejor tus preguntas. Cada herramienta convierte información en una acción sencilla.', image: '/img/feliz-sin-tiroides-hero-v2.webp',
    items: [
      ['Mi espacio', 'Organiza tus registros personales y guarda tus avances.', '/fst-app?modo=registro', 'Crear mi cuenta'],
      ['Vida 360', 'Lleva una visión más completa de hábitos, bienestar y seguimiento.', '/vida-360', 'Abrir Vida 360'],
      ['NutriFST', 'Consulta información educativa sobre alimentos y combinaciones.', '/nutrifst', 'Probar NutriFST'],
      ['Buscador de recetas', 'Encuentra ideas de preparación según tus preferencias.', '/recetas', 'Buscar recetas'],
    ],
  },
  academy: {
    title: 'Aprende a cuidarte, clase a clase', eyebrow: 'Feliz Sin Tiroides Academy', description: 'Videos, lecturas, actividades y seguimiento de progreso dentro de un espacio educativo pensado para avanzar a tu ritmo.', image: '/img/nutricion.jpg',
    items: [
      ['Curso de autocuidado de la tiroides', 'Ocho clases con video, lectura y actividades prácticas.', '/academia', 'Entrar a Academy'],
      ['Mis cursos', 'Continúa donde quedaste y revisa tus clases completadas.', '/academia/mis-cursos', 'Ver mis cursos'],
      ['Retos de bienestar', 'Pequeñas acciones guiadas para convertir aprendizaje en hábito.', '/academia/retos', 'Explorar retos'],
    ],
  },
  'sobre-mi': {
    title: 'Educación farmacéutica con claridad y empatía', eyebrow: 'Sobre Feliz Sin Tiroides', description: 'Este proyecto acerca información comprensible para que cada persona pueda conversar mejor con sus profesionales y participar activamente en su cuidado.', image: '/img/karla-real.jpg',
    items: [
      ['Información responsable', 'Contenido educativo que diferencia orientación, evidencia y opinión.'],
      ['Lenguaje humano', 'Explicaciones comprensibles sin minimizar la complejidad de cada proceso.'],
      ['Decisiones acompañadas', 'Herramientas para preparar consultas, no para reemplazar al equipo tratante.'],
    ],
  },
  comunidad: {
    title: 'Un espacio para aprender sin sentirte sola', eyebrow: 'Comunidad Feliz Sin Tiroides', description: 'Comparte aprendizajes, descubre recursos y acompaña a otras personas desde el respeto. La comunidad no reemplaza la consulta profesional.', image: '/img/feliz-sin-tiroides-hero-v2.webp',
    items: [
      ['Conversaciones respetuosas', 'Preguntas y experiencias sin juicios ni promesas de curación.'],
      ['Nuevos recursos', 'Acceso a guías, clases y actividades educativas.'],
      ['Privacidad primero', 'No publiques diagnósticos identificables, resultados ni datos clínicos sensibles.'],
    ],
  },
};

function StandardPage({ section, data }) {
  const community = section === 'comunidad';
  return (
    <PageShell>
      <Seo section={section} title={data.title} description={data.description} image={data.image} />
      <PageHero eyebrow={data.eyebrow} title={data.title} description={data.description} image={data.image} imageAlt={data.title} actions={community ? <a href={FST_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-md bg-[#563a78] px-5 font-bold text-white">Unirme a la comunidad</a> : null} />
      <section className="py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-5 md:grid-cols-3">{data.items.map(([title, text, href, cta]) => <article key={title} className="rounded-lg border border-[#dfe6e5] bg-white p-6"><h2 className="text-xl font-bold">{title}</h2><p className="mt-3 leading-7 text-[#5d6b7d]">{text}</p>{href && <Link to={href} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#0b8176] px-4 text-sm font-bold text-white">{cta}<Icon name="arrowRight" className="h-4 w-4" /></Link>}</article>)}</div></div></section>
      <section className="bg-[#fff5f1] py-12"><div className="mx-auto max-w-4xl px-4 text-center sm:px-6"><h2 className="text-2xl font-semibold">Información para acompañar, no para reemplazar tu atención</h2><p className="mt-3 leading-7 text-[#665c65]">Consulta decisiones sobre diagnóstico, dosis, tratamiento o síntomas de alarma con profesionales de salud habilitados.</p></div></section>
    </PageShell>
  );
}

export default function FstSectionLanding() {
  const { section } = useParams();
  useEffect(() => { window.scrollTo(0, 0); }, [section]);
  if (section === 'guias') return <GuidesPage />;
  if (section === 'atencion-farmaceutica') return <PharmaceuticalPage />;
  const data = sectionContent[section];
  return data ? <StandardPage section={section} data={data} /> : <Navigate to="/feliz-sin-tiroides" replace />;
}
