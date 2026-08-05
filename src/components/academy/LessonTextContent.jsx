import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import {
  getAcademyLessonGuide,
  getAcademyResources,
  skinCareRoutine,
  threeDayMealIdeas,
  usefulProducts,
  wellnessSources,
} from '../../data/academyLessonGuides';

function LearningDiagram({ diagram }) {
  if (!diagram?.steps?.length) return null;
  const isCompare = diagram.type === 'compare';

  return (
    <figure className="my-8 border-y border-[#cfe3df] bg-[#f4faf9] px-4 py-6 sm:px-6">
      <figcaption className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#0f615b]">
        <Icon name={diagram.type === 'cycle' ? 'activity' : isCompare ? 'scale' : 'arrowRight'} className="h-5 w-5" />
        {diagram.title}
      </figcaption>
      <div className={`grid gap-3 ${isCompare ? 'sm:grid-cols-3' : 'sm:grid-cols-2 xl:grid-cols-4'}`}>
        {diagram.steps.map((step, index) => (
          <div key={`${step.label}-${index}`} className="relative min-h-28 border-l-2 border-[#77b7ae] bg-white px-4 py-3">
            <span className="text-xs font-bold text-[#0f766e]">Paso {index + 1}</span>
            <p className="mt-2 text-sm font-semibold text-[#132e55]">{step.label}</p>
            <p className="mt-1 text-xs leading-5 text-gray-600">{step.detail}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

function SourceLinks({ sources }) {
  if (!sources?.length) return null;
  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <h3 className="text-sm font-semibold text-[#132e55]">Lecturas confiables para continuar</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {sources.map(source => (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#0f615b] hover:border-[#77b7ae]"
          >
            <Icon name="book" className="h-4 w-4" /> {source.label} <Icon name="external" className="h-3.5 w-3.5" />
          </a>
        ))}
      </div>
    </div>
  );
}

function ResourceGrid({ title, description, resources, imageResources = false }) {
  if (!resources?.length) return null;

  return (
    <section className="mt-10 border-t border-gray-100 pt-8" aria-label={title}>
      <div className="max-w-3xl">
        <h3 className="text-xl font-semibold text-[#132e55]">{title}</h3>
        {description && <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>}
      </div>
      <div className={`mt-5 grid gap-4 ${imageResources ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {resources.map(resource => {
          const body = (
            <>
              {resource.image && (
                <img src={resource.image} alt="" className="h-32 w-full border-b border-gray-100 object-cover object-top" loading="lazy" />
              )}
              <div className="p-4">
                <p className="text-sm font-semibold leading-5 text-[#132e55]">{resource.title}</p>
                <p className="mt-2 text-xs leading-5 text-gray-600">{resource.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#0f766e]">
                  Abrir recurso <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </span>
              </div>
            </>
          );

          const className = "group overflow-hidden rounded-md border border-gray-200 bg-white transition hover:border-[#77b7ae] hover:shadow-sm";
          return resource.href.startsWith('/') ? (
            <Link key={resource.href} to={resource.href} className={className}>{body}</Link>
          ) : (
            <a key={resource.href} href={resource.href} target="_blank" rel="noopener noreferrer" className={className}>{body}</a>
          );
        })}
      </div>
    </section>
  );
}

function OriginalLessonPage({ content }) {
  return (
    <div id="academy-page-understand" role="tabpanel" aria-labelledby="academy-tab-understand">
      {content.objectives?.length > 0 && (
        <div className="border-b border-gray-100 pb-7">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-[#132e55]">
            <Icon name="compass" className="h-5 w-5 text-[#6d4c91]" /> Al terminar podrás
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {content.objectives.map(objective => (
              <li key={objective} className="flex gap-3 text-sm leading-6 text-gray-700">
                <Icon name="checkCircle" className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        {content.sections?.map(section => (
          <article key={section.title} className="border-b border-gray-100 py-7 last:border-0">
            <h3 className="text-xl font-semibold text-[#132e55]">{section.title}</h3>
            {section.paragraphs?.map(paragraph => (
              <p key={paragraph} className="mt-3 text-[15px] leading-7 text-gray-700">{paragraph}</p>
            ))}
            {section.bullets?.length > 0 && (
              <ul className="mt-4 space-y-2.5">
                {section.bullets.map(bullet => (
                  <li key={bullet} className="flex gap-3 text-sm leading-6 text-gray-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0f766e]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.callout && (
              <p className="mt-5 border-l-4 border-[#6d4c91] bg-[#faf8fc] px-4 py-3 text-sm font-medium leading-6 text-[#483260]">
                {section.callout}
              </p>
            )}
          </article>
        ))}
      </div>

      <LearningDiagram diagram={content.diagram} />

      {content.key_takeaways?.length > 0 && (
        <div className="mt-8 border-y border-gray-100 py-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-[#132e55]">
            <Icon name="award" className="h-5 w-5 text-[#6d4c91]" /> Ideas que debes llevarte
          </h3>
          <ol className="mt-4 space-y-3">
            {content.key_takeaways.map((takeaway, index) => (
              <li key={takeaway} className="flex gap-3 text-sm leading-6 text-gray-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f4f2] text-xs font-bold text-[#0f766e]">{index + 1}</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {content.reflection && (
        <div className="mt-6 border-l-4 border-[#6d4c91] bg-[#faf8fc] p-5">
          <p className="text-xs font-bold uppercase text-[#6d4c91]">Pausa y reflexiona</p>
          <p className="mt-2 text-sm font-medium leading-6 text-[#3f3152]">{content.reflection}</p>
        </div>
      )}

      <SourceLinks sources={content.sources} />
    </div>
  );
}

function ApplicationPage({ guide }) {
  const ebooks = getAcademyResources(guide, 'ebooks');
  const articles = getAcademyResources(guide, 'articles');

  return (
    <div id="academy-page-apply" role="tabpanel" aria-labelledby="academy-tab-apply">
      <figure>
        <img src={guide.image} alt={guide.imageAlt} className="aspect-video w-full object-cover" loading="lazy" />
        <figcaption className="mt-2 text-xs leading-5 text-gray-500">Imagen educativa de apoyo. No representa una indicación clínica individual.</figcaption>
      </figure>

      <div className="mt-7">
        <p className="text-xs font-bold uppercase text-[#0f766e]">{guide.label}</p>
        <h3 className="mt-2 text-2xl font-semibold leading-tight text-[#132e55] sm:text-3xl">{guide.title}</h3>
        <p className="mt-4 text-[15px] leading-7 text-gray-700">{guide.intro}</p>
      </div>

      <div className="mt-4">
        {guide.sections.map(section => (
          <article key={section.title} className="border-b border-gray-100 py-7 last:border-0">
            <h4 className="text-xl font-semibold text-[#132e55]">{section.title}</h4>
            {section.paragraphs.map(paragraph => <p key={paragraph} className="mt-3 text-[15px] leading-7 text-gray-700">{paragraph}</p>)}
            {section.bullets?.length > 0 && (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {section.bullets.map(item => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-gray-700">
                    <Icon name="checkCircle" className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" /> {item}
                  </li>
                ))}
              </ul>
            )}
            {section.callout && <p className="mt-5 border-l-4 border-[#e59b62] bg-[#fff8f2] px-4 py-3 text-sm font-semibold leading-6 text-[#6b4226]">{section.callout}</p>}
          </article>
        ))}
      </div>

      <section className="mt-6 border-y border-[#cfe3df] bg-[#f4faf9] px-4 py-6 sm:px-6" aria-labelledby="application-checklist-title">
        <h4 id="application-checklist-title" className="flex items-center gap-2 text-lg font-semibold text-[#132e55]">
          <Icon name="list" className="h-5 w-5 text-[#0f766e]" /> Comprueba tu avance
        </h4>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {guide.checklist.map(item => (
            <label key={item} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-gray-700">
              <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-[#0f766e] focus:ring-[#77b7ae]" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </section>

      <ResourceGrid
        title="Ebooks para seguir practicando"
        description="Cada enlace abre el recurso relacionado dentro de Feliz Sin Tiroides para que puedas revisar su contenido y formato."
        resources={ebooks}
        imageResources
      />
      <ResourceGrid
        title="Artículos relacionados"
        description="Lecturas complementarias de Edvanta para profundizar sin salir de la ruta educativa."
        resources={articles}
      />
      <SourceLinks sources={guide.sources} />
    </div>
  );
}

function MealDay({ day }) {
  return (
    <article className="overflow-hidden rounded-md border border-gray-200 bg-white">
      <div className="border-b border-gray-100 bg-[#f4faf9] px-4 py-3">
        <p className="text-xs font-bold uppercase text-[#0f766e]">{day.day}</p>
        <h4 className="mt-1 text-lg font-semibold text-[#132e55]">{day.theme}</h4>
      </div>
      <div className="p-4">
        <dl className="space-y-3">
          {day.meals.map(([label, detail]) => (
            <div key={label}>
              <dt className="text-xs font-bold uppercase text-[#6d4c91]">{label}</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700">{detail}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 border-t border-gray-100 pt-4">
          <p className="text-sm font-semibold text-[#132e55]">Receta muestra: {day.recipe.title}</p>
          <p className="mt-3 text-xs font-bold uppercase text-gray-500">Ingredientes flexibles</p>
          <ul className="mt-2 space-y-1 text-xs leading-5 text-gray-600">
            {day.recipe.ingredients.map(item => <li key={item}>• {item}</li>)}
          </ul>
          <p className="mt-3 text-xs font-bold uppercase text-gray-500">Preparación</p>
          <ol className="mt-2 space-y-1 text-xs leading-5 text-gray-600">
            {day.recipe.steps.map((item, index) => <li key={item}>{index + 1}. {item}</li>)}
          </ol>
        </div>
      </div>
    </article>
  );
}

function WellnessPage({ guide }) {
  const ebooks = getAcademyResources(guide, 'ebooks');
  const foodResources = [ebooks.find(item => item.href.includes('comer-')), ebooks.find(item => item.href.includes('dieta-')), ebooks.find(item => item.href.includes('jugos-'))].filter(Boolean);

  return (
    <div id="academy-page-daily" role="tabpanel" aria-labelledby="academy-tab-daily">
      <div className="border-l-4 border-[#e59b62] bg-[#fff8f2] p-5 text-sm leading-6 text-[#5f4634]">
        <strong>Antes de empezar:</strong> estas son ideas generales para adultos, no una dieta tiroidea ni un tratamiento. Ajusta alergias, diabetes, embarazo, enfermedad renal, restricciones de líquidos y cualquier dieta especial con el profesional correspondiente. Si recibes yodo radiactivo, sigue únicamente la dieta baja en yodo y los tiempos indicados por tu equipo.
      </div>

      <section className="mt-8" aria-labelledby="three-days-title">
        <img src="/images/academia/ideas-alimentacion-tres-dias.webp" alt="Tres días de comidas variadas con frutas, vegetales, granos y proteínas" className="aspect-video w-full object-cover" loading="lazy" />
        <div className="mt-6 max-w-3xl">
          <p className="text-xs font-bold uppercase text-[#0f766e]">Recetario de muestra</p>
          <h3 id="three-days-title" className="mt-2 text-2xl font-semibold text-[#132e55]">Ideas para tres días reales y flexibles</h3>
          <p className="mt-3 text-[15px] leading-7 text-gray-700">
            No existe un menú único que “active” o “desinflame” la tiroides. Esta muestra usa variedad de vegetales, granos, proteínas y grasas para ayudarte a organizarte. Cambia ingredientes según tu cultura, presupuesto y tolerancia.
          </p>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {threeDayMealIdeas.map(day => <MealDay key={day.day} day={day} />)}
        </div>
        <p className="mt-4 text-xs leading-5 text-gray-500">
          Si tomas levotiroxina, conserva el intervalo indicado antes de desayunar y confirma con tu equipo cómo separar calcio, hierro, antiácidos o suplementos. No ajustes la dosis para acomodarla al menú.
        </p>
      </section>

      <section className="mt-12 border-t border-gray-100 pt-9" aria-labelledby="skin-care-title">
        <div className="grid items-center gap-7 lg:grid-cols-[1.05fr_0.95fr]">
          <img src={skinCareRoutine.image} alt={skinCareRoutine.imageAlt} className="aspect-video w-full object-cover" loading="lazy" />
          <div>
            <p className="text-xs font-bold uppercase text-[#6d4c91]">Cuidado de la piel</p>
            <h3 id="skin-care-title" className="mt-2 text-2xl font-semibold text-[#132e55]">Una rutina suave para piel seca</h3>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              La piel seca puede acompañar al hipotiroidismo, pero también tiene causas dermatológicas y ambientales. Esta rutina protege la barrera cutánea mientras buscas la causa cuando la sequedad es persistente.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-7 sm:grid-cols-2">
          <div className="border-t-2 border-[#77b7ae] pt-4">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-[#132e55]"><Icon name="sun" className="h-5 w-5 text-[#e59b62]" /> Mañana</h4>
            <ol className="mt-3 space-y-3">
              {skinCareRoutine.morning.map((item, index) => <li key={item} className="flex gap-3 text-sm leading-6 text-gray-700"><span className="font-bold text-[#0f766e]">{index + 1}</span>{item}</li>)}
            </ol>
          </div>
          <div className="border-t-2 border-[#8e72aa] pt-4">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-[#132e55]"><Icon name="droplet" className="h-5 w-5 text-[#6d4c91]" /> Noche</h4>
            <ol className="mt-3 space-y-3">
              {skinCareRoutine.evening.map((item, index) => <li key={item} className="flex gap-3 text-sm leading-6 text-gray-700"><span className="font-bold text-[#6d4c91]">{index + 1}</span>{item}</li>)}
            </ol>
          </div>
        </div>
        <p className="mt-5 border-l-4 border-[#e59b62] bg-[#fff8f2] px-4 py-3 text-sm leading-6 text-[#5f4634]">
          Consulta dermatología si hay grietas, sangrado, dolor, ardor persistente, erupción, signos de infección o si la sequedad no mejora. Suspende un producto nuevo si produce irritación importante.
        </p>
      </section>

      <section className="mt-12 border-t border-gray-100 pt-9" aria-labelledby="hydration-title">
        <div className="grid items-center gap-7 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase text-[#0f766e]">Hidratación cotidiana</p>
            <h3 id="hydration-title" className="mt-2 text-2xl font-semibold text-[#132e55]">Agua visible, metas flexibles</h3>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              Mantén agua disponible y distribuye la ingesta durante el día. Las necesidades cambian con clima, actividad, embarazo y salud. No necesitas perseguir una cifra universal; si tienes una restricción de líquidos por enfermedad renal, cardiaca u otra condición, sigue tu indicación clínica.
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-700">
              <li className="flex gap-2"><Icon name="checkCircle" className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" /> Lleva agua a las actividades largas.</li>
              <li className="flex gap-2"><Icon name="checkCircle" className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" /> Combina hidratación con pausas y movimiento tolerable.</li>
              <li className="flex gap-2"><Icon name="checkCircle" className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" /> No uses bebidas o jugos como sustitutos del tratamiento.</li>
            </ul>
          </div>
          <img src="/images/academia/hidratacion-autocuidado-diario.webp" alt="Persona organizando agua, movimiento y registro diario" className="aspect-video w-full object-cover" loading="lazy" />
        </div>
      </section>

      <ResourceGrid
        title="Productos útiles, no obligatorios"
        description="Son categorías de compra para facilitar hábitos. Los enlaces abren búsquedas externas y no constituyen una recomendación clínica ni una garantía de calidad."
        resources={usefulProducts.map(product => ({ ...product, description: product.detail }))}
      />
      <ResourceGrid
        title="Recetarios y guías relacionadas"
        description="Continúa con los ebooks disponibles dentro de Feliz Sin Tiroides. Revisa siempre el alcance y las precauciones de cada recurso."
        resources={foodResources.length ? foodResources : ebooks.slice(0, 3)}
        imageResources
      />
      <SourceLinks sources={wellnessSources} />
    </div>
  );
}

const pages = [
  { id: 'understand', label: '1. Comprender', icon: 'book' },
  { id: 'apply', label: '2. Aplicar', icon: 'checkCircle' },
  { id: 'daily', label: '3. Vida diaria', icon: 'heart' },
];

export default function LessonTextContent({ content, lesson }) {
  const [activePage, setActivePage] = useState(0);
  const sectionRef = useRef(null);
  const guide = getAcademyLessonGuide(lesson?.video_url);

  useEffect(() => setActivePage(0), [lesson?.video_url]);

  if (!content || !Object.keys(content).length) return null;

  const selectPage = index => {
    setActivePage(index);
    window.requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <section ref={sectionRef} className="scroll-mt-24 overflow-hidden border-y border-gray-200 bg-white" aria-labelledby="written-lesson-title">
      <div className="px-5 pt-6 sm:px-7 sm:pt-7">
        <div className="border-b border-gray-100 pb-5">
          <p className="text-xs font-bold uppercase text-[#0f766e]">Clase escrita ampliada</p>
          <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <h2 id="written-lesson-title" className="text-2xl font-semibold text-[#132e55]">Profundiza, practica y cuídate</h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Icon name="clock" className="h-4 w-4" /> 3 páginas · {Math.max(content.estimated_reading_min || 8, 8) + 16} min aprox.
            </span>
          </div>
          {content.intro && <p className="mt-4 max-w-4xl text-base leading-7 text-gray-700">{content.intro}</p>}
        </div>

        <div className="-mx-5 overflow-x-auto border-b border-gray-200 px-5 sm:-mx-7 sm:px-7">
          <div className="flex min-w-max" role="tablist" aria-label="Páginas de la clase escrita">
            {pages.map((page, index) => (
              <button
                key={page.id}
                id={`academy-tab-${page.id}`}
                type="button"
                role="tab"
                aria-selected={activePage === index}
                aria-controls={`academy-page-${page.id}`}
                onClick={() => selectPage(index)}
                className={`inline-flex min-h-14 items-center gap-2 border-b-2 px-4 text-sm font-semibold transition ${activePage === index ? 'border-[#0f766e] text-[#0f615b]' : 'border-transparent text-gray-500 hover:text-[#132e55]'}`}
              >
                <Icon name={page.icon} className="h-4 w-4" /> {page.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-7 sm:px-7 sm:py-9">
        {activePage === 0 && <OriginalLessonPage content={content} />}
        {activePage === 1 && <ApplicationPage guide={guide} />}
        {activePage === 2 && <WellnessPage guide={guide} />}

        <nav className="mt-10 flex items-center justify-between gap-3 border-t border-gray-100 pt-6" aria-label="Navegación de la clase escrita">
          {activePage > 0 ? (
            <button type="button" onClick={() => selectPage(activePage - 1)} className="inline-flex min-h-11 items-center justify-center rounded-md border border-gray-200 px-4 text-sm font-semibold text-gray-600 hover:border-[#77b7ae]">
              Página anterior
            </button>
          ) : <span />}
          {activePage < pages.length - 1 ? (
            <button type="button" onClick={() => selectPage(activePage + 1)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#0f766e] px-4 text-sm font-semibold text-white hover:bg-[#0b5f59]">
              Siguiente página <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={() => selectPage(0)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#563a78] px-4 text-sm font-semibold text-white hover:bg-[#452b65]">
              Volver al inicio
            </button>
          )}
        </nav>
      </div>
    </section>
  );
}
