import Icon from '../Icon';

function LearningDiagram({ diagram }) {
  if (!diagram?.steps?.length) return null;
  const isCycle = diagram.type === 'cycle';
  const isCompare = diagram.type === 'compare';

  return (
    <figure className="my-8 overflow-hidden rounded-lg border border-[#cfe3df] bg-[#f4faf9] p-5 sm:p-6">
      <figcaption className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#0f615b]">
        <Icon name={isCycle ? 'activity' : isCompare ? 'scale' : 'arrowRight'} className="h-5 w-5" />
        {diagram.title}
      </figcaption>
      <div className={`grid gap-3 ${isCompare ? 'sm:grid-cols-3' : 'sm:grid-cols-2 xl:grid-cols-4'}`}>
        {diagram.steps.map((step, index) => (
          <div key={`${step.label}-${index}`} className="relative min-h-28 rounded-md border border-white bg-white p-4 shadow-sm">
            <span className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#0f766e] text-xs font-bold text-white">
              {index + 1}
            </span>
            <p className="text-sm font-semibold text-[#132e55]">{step.label}</p>
            <p className="mt-1 text-xs leading-5 text-gray-600">{step.detail}</p>
            {!isCompare && index < diagram.steps.length - 1 && (
              <Icon name={isCycle && index === diagram.steps.length - 1 ? 'activity' : 'arrowRight'} className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-[#6d4c91] xl:block" />
            )}
          </div>
        ))}
      </div>
    </figure>
  );
}

export default function LessonTextContent({ content }) {
  if (!content || !Object.keys(content).length) return null;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 sm:p-7" aria-labelledby="written-lesson-title">
      <div className="border-b border-gray-100 pb-5">
        <p className="text-xs font-bold uppercase text-[#0f766e]">Clase escrita</p>
        <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <h2 id="written-lesson-title" className="text-2xl font-semibold text-[#132e55]">Profundiza lo aprendido</h2>
          {content.estimated_reading_min && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Icon name="clock" className="h-4 w-4" /> {content.estimated_reading_min} min de lectura
            </span>
          )}
        </div>
        {content.intro && <p className="mt-4 max-w-4xl text-base leading-7 text-gray-700">{content.intro}</p>}
      </div>

      {content.objectives?.length > 0 && (
        <div className="border-b border-gray-100 py-6">
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

      <div className="py-2">
        {content.sections?.map(section => (
          <article key={section.title} className="border-b border-gray-100 py-6 last:border-0">
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
        <div className="mt-6 rounded-lg border border-[#d8c9e5] bg-[#faf8fc] p-5">
          <p className="text-xs font-bold uppercase text-[#6d4c91]">Pausa y reflexiona</p>
          <p className="mt-2 text-sm font-medium leading-6 text-[#3f3152]">{content.reflection}</p>
        </div>
      )}

      {content.sources?.length > 0 && (
        <div className="mt-7">
          <h3 className="text-sm font-semibold text-[#132e55]">Lecturas confiables para continuar</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {content.sources.map(source => (
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
      )}
    </section>
  );
}
