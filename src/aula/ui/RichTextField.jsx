import { lazy, Suspense } from 'react';

const Editor = lazy(() => import('./RichTextEditor'));

/** Editor de texto enriquecido cargado solo cuando se necesita. */
export function RichTextField(props) {
  return (
    <Suspense
      fallback={(
        <div className="flex flex-col gap-1.5">
          {props.label && <span className="text-sm font-semibold">{props.label}</span>}
          <div role="status" className="h-40 animate-pulse rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-[var(--aula-surface-muted)]">
            <span className="sr-only">Cargando el editor</span>
          </div>
        </div>
      )}
    >
      <Editor {...props} />
    </Suspense>
  );
}
