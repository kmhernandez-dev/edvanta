/**
 * Cómo ve el participante cada bloque de una clase. Lo usan la vista
 * previa del administrador y el reproductor del curso.
 *
 * `files` trae nombre, tamaño y formato de los archivos del bloque.
 * `onMedia` (opcional) recibe el avance de videos y audios:
 *   onMedia(block, { event: 'progress' | 'ended', current, duration })
 */
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle, ChevronLeft, ChevronRight, Download, ExternalLink, FileText, Info, Lightbulb, Megaphone, X, ZoomIn,
} from 'lucide-react';
import { fileUrl } from '../api';
import { fmtBytes } from '../labels';
import { Button, IconButton } from '../ui/Button';
import { Modal } from '../ui/Dialog';
import { RichText } from '../ui/RichText';
import { Spinner } from '../ui/States';

const PdfViewer = lazy(() => import('./PdfViewer'));

const fileOf = (files, id) => (id ? files?.[id] || files?.[String(id)] || null : null);

function Transcript({ html, label = 'Transcripción' }) {
  if (!html) return null;
  return (
    <details className="group mt-2 rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white">
      <summary className="cursor-pointer select-none px-4 py-2.5 text-sm font-semibold text-[var(--aula-primary)]">{label}</summary>
      <div className="border-t border-[var(--aula-border)] px-4 py-2"><RichText html={html} /></div>
    </details>
  );
}

function DownloadButton({ fileId, file, label = 'Descargar' }) {
  return (
    <Button size="sm" variant="secondary" icon={Download} href={fileUrl(fileId, { download: true })}>
      {label}{file?.size ? <span className="font-normal text-[var(--aula-muted)]"> · {fmtBytes(file.size)}</span> : null}
    </Button>
  );
}

// ── Medios ──────────────────────────────────────────────────

function MediaFile({ kind, block, fileId, file, onMedia }) {
  const ref = useRef(null);
  const last = useRef(0);
  const Tag = kind === 'video' ? 'video' : 'audio';
  const report = (event) => {
    const el = ref.current;
    if (!el || !onMedia) return;
    onMedia(block, { event, current: el.currentTime, duration: el.duration || 0 });
  };
  return (
    <Tag
      ref={ref}
      src={fileUrl(fileId)}
      controls
      preload="metadata"
      playsInline
      controlsList={block.allowDownload ? undefined : 'nodownload'}
      onContextMenu={block.allowDownload ? undefined : (e) => e.preventDefault()}
      onTimeUpdate={() => {
        const now = ref.current?.currentTime || 0;
        if (Math.abs(now - last.current) >= 5) { last.current = now; report('progress'); }
      }}
      onPause={() => report('progress')}
      onEnded={() => report('ended')}
      className={kind === 'video' ? 'aspect-video w-full rounded-[var(--aula-radius)] bg-black' : 'w-full'}
      aria-label={block.data.title || file?.name || (kind === 'video' ? 'Video' : 'Audio')}
    >
      Tu navegador no puede reproducir este {kind === 'video' ? 'video' : 'audio'}.
    </Tag>
  );
}

function EmbeddedVideo({ data }) {
  const src = data.provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${data.videoId}?rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
    : `https://player.vimeo.com/video/${data.videoId}?dnt=1${data.hash ? `&h=${data.hash}` : ''}`;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-[var(--aula-radius)] bg-black">
      <iframe
        src={src}
        title={data.title || (data.provider === 'youtube' ? 'Video de YouTube' : 'Video de Vimeo')}
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        data-provider={data.provider}
      />
    </div>
  );
}

function VideoBlock({ block, files, onMedia }) {
  const { data } = block;
  const file = fileOf(files, data.fileId);
  return (
    <figure className="flex flex-col gap-2">
      {data.source === 'archivo'
        ? <MediaFile kind="video" block={block} fileId={data.fileId} file={file} onMedia={onMedia} />
        : <EmbeddedVideo data={data} />}
      {(data.title || (block.allowDownload && data.source === 'archivo')) && (
        <figcaption className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold">{data.title}</span>
          {block.allowDownload && data.source === 'archivo' && <DownloadButton fileId={data.fileId} file={file} />}
        </figcaption>
      )}
      <Transcript html={data.transcriptHtml} />
    </figure>
  );
}

function AudioBlock({ block, files, onMedia }) {
  const { data } = block;
  const file = fileOf(files, data.fileId);
  return (
    <figure className="flex flex-col gap-2 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-4">
      <figcaption className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold">{data.title || 'Audio'}</span>
        {block.allowDownload && <DownloadButton fileId={data.fileId} file={file} />}
      </figcaption>
      <MediaFile kind="audio" block={block} fileId={data.fileId} file={file} onMedia={onMedia} />
      <Transcript html={data.transcriptHtml} />
    </figure>
  );
}

// ── Imágenes ────────────────────────────────────────────────

function ImageBlock({ block, files }) {
  const { data } = block;
  return (
    <figure className={`flex flex-col gap-2 ${data.size === 'ancho' ? '' : 'mx-auto max-w-3xl'}`}>
      <img
        src={fileUrl(data.fileId)}
        alt={data.decorative ? '' : data.alt}
        loading="lazy"
        decoding="async"
        className="w-full rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white object-contain"
      />
      {(data.caption || block.allowDownload) && (
        <figcaption className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--aula-muted)]">
          <span>{data.caption}</span>
          {block.allowDownload && <DownloadButton fileId={data.fileId} file={fileOf(files, data.fileId)} />}
        </figcaption>
      )}
    </figure>
  );
}

function Lightbox({ items, index, onClose, onIndex, allowDownload, files }) {
  const item = items[index];
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, items.length, onIndex]);
  if (!item) return null;
  return (
    <Modal open onClose={onClose} title={`Imagen ${index + 1} de ${items.length}`} size="xl"
      footer={(
        <>
          {allowDownload && <DownloadButton fileId={item.fileId} file={fileOf(files, item.fileId)} />}
          <span className="flex-1" />
          <Button variant="secondary" icon={ChevronLeft} onClick={() => onIndex((index - 1 + items.length) % items.length)}>Anterior</Button>
          <Button variant="secondary" iconRight={ChevronRight} onClick={() => onIndex((index + 1) % items.length)}>Siguiente</Button>
        </>
      )}>
      <figure className="flex flex-col items-center gap-2">
        <img src={fileUrl(item.fileId)} alt={item.decorative ? '' : item.alt} className="max-h-[65vh] w-auto rounded-[var(--aula-radius-sm)] object-contain" />
        {item.caption && <figcaption className="text-sm text-[var(--aula-muted)]">{item.caption}</figcaption>}
      </figure>
    </Modal>
  );
}

function GalleryBlock({ block, files }) {
  const { data } = block;
  const items = data.items || [];
  const [open, setOpen] = useState(null);
  const [current, setCurrent] = useState(0);
  if (!items.length) return null;

  if (data.layout === 'carrusel') {
    const item = items[current];
    return (
      <section aria-roledescription="carrusel" aria-label="Galería de imágenes" className="flex flex-col gap-2">
        <div className="relative overflow-hidden rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
          <figure aria-roledescription="diapositiva" aria-label={`${current + 1} de ${items.length}`} className="flex flex-col items-center">
            <img src={fileUrl(item.fileId)} alt={item.decorative ? '' : item.alt} className="max-h-[480px] w-full object-contain" />
            {item.caption && <figcaption className="w-full px-4 py-2 text-sm text-[var(--aula-muted)]">{item.caption}</figcaption>}
          </figure>
          <IconButton icon={ChevronLeft} label="Imagen anterior" variant="secondary" onClick={() => setCurrent((current - 1 + items.length) % items.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90" />
          <IconButton icon={ChevronRight} label="Imagen siguiente" variant="secondary" onClick={() => setCurrent((current + 1) % items.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90" />
        </div>
        <div className="flex items-center justify-center gap-1.5">
          {items.map((it, i) => (
            <button key={`${it.fileId}-${i}`} type="button" onClick={() => setCurrent(i)} aria-label={`Ver imagen ${i + 1}`} aria-current={i === current || undefined}
              className={`h-2.5 rounded-full transition-all ${i === current ? 'w-6 bg-[var(--aula-primary)]' : 'w-2.5 bg-[var(--aula-border-strong)]'}`} />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">Imagen {current + 1} de {items.length}</p>
      </section>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Galería de imágenes">
        {items.map((item, i) => (
          <li key={`${item.fileId}-${i}`}>
            <figure className="flex flex-col gap-1">
              <button type="button" onClick={() => setOpen(i)} className="group relative block overflow-hidden rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white"
                aria-label={`Ampliar imagen ${i + 1}${item.alt ? `: ${item.alt}` : ''}`}>
                <img src={fileUrl(item.fileId)} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.03]" />
                <span className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-[var(--aula-primary)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <ZoomIn className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
              {item.caption && <figcaption className="text-xs text-[var(--aula-muted)]">{item.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
      {open !== null && (
        <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} allowDownload={block.allowDownload} files={files} />
      )}
    </>
  );
}

function InfographicBlock({ block, files }) {
  const { data } = block;
  const [zoomed, setZoomed] = useState(false);
  return (
    <figure className="flex flex-col gap-2">
      <button type="button" onClick={() => setZoomed(true)} className="group relative block overflow-hidden rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white"
        aria-label={`Ampliar infografía: ${data.alt}`}>
        <img src={fileUrl(data.fileId)} alt={data.alt} loading="lazy" className="max-h-[640px] w-full object-contain" />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[var(--aula-primary)] shadow">
          <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" /> Ampliar
        </span>
      </button>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--aula-muted)]">
        <span>{data.caption}</span>
        {block.allowDownload && <DownloadButton fileId={data.fileId} file={fileOf(files, data.fileId)} />}
      </figcaption>
      <Transcript html={data.longDescriptionHtml} label="Descripción completa de la infografía" />
      {zoomed && (
        <Modal open onClose={() => setZoomed(false)} title={data.caption || 'Infografía'} size="xl">
          <div className="max-h-[75vh] overflow-auto">
            <img src={fileUrl(data.fileId)} alt={data.alt} className="h-auto min-w-full max-w-none" style={{ width: '160%' }} />
          </div>
        </Modal>
      )}
    </figure>
  );
}

// ── Documentos y enlaces ───────────────────────────────────

function PdfBlock({ block, mode }) {
  const { data } = block;
  return (
    <div className="flex flex-col gap-2">
      <Suspense fallback={<div className="flex h-60 items-center justify-center rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)]"><Spinner label="Preparando el visor…" /></div>}>
        <PdfViewer fileId={data.fileId} title={data.title} canDownload={block.allowDownload} mode={mode} />
      </Suspense>
      {data.description && <p className="text-sm text-[var(--aula-muted)]">{data.description}</p>}
    </div>
  );
}

function SlidesBlock({ block }) {
  const { data } = block;
  if (data.source === 'archivo') return <PdfBlock block={block} mode="presentacion" />;
  return (
    <figure className="flex flex-col gap-2">
      <div className="aspect-video w-full overflow-hidden rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
        <iframe src={data.embedUrl} title={data.title || 'Presentación'} className="h-full w-full" loading="lazy" allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin" />
      </div>
      {data.title && <figcaption className="text-sm font-semibold">{data.title}</figcaption>}
    </figure>
  );
}

function FilesBlock({ block, files }) {
  const { data } = block;
  return (
    <section className="rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white">
      <h3 className="border-b border-[var(--aula-border)] px-4 py-3 text-base font-bold">{data.title || 'Material para descargar'}</h3>
      <ul className="divide-y divide-[var(--aula-border)]">
        {(data.items || []).map((item, i) => {
          const file = fileOf(files, item.fileId);
          return (
            <li key={`${item.fileId}-${i}`} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--aula-radius-sm)] bg-[var(--aula-primary-soft)] text-[10px] font-bold uppercase text-[var(--aula-primary)]">
                {file?.extension || <FileText className="h-5 w-5" aria-hidden="true" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.label || file?.name || 'Archivo'}</p>
                {item.description && <p className="text-xs text-[var(--aula-muted)]">{item.description}</p>}
              </div>
              <Button size="sm" variant="secondary" icon={Download} href={fileUrl(item.fileId, { download: true })}
                aria-label={`Descargar ${item.label || file?.name || 'archivo'}${file?.size ? ` (${fmtBytes(file.size)})` : ''}`}>
                {file?.size ? fmtBytes(file.size) : 'Descargar'}
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function LinkBlock({ block }) {
  const { data } = block;
  let host = '';
  try { host = new URL(data.url).hostname.replace(/^www\./, ''); } catch { /* enlace inválido: no se muestra el dominio */ }
  return (
    <a href={data.url} target="_blank" rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white p-4 transition-colors hover:border-[var(--aula-primary)]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--aula-radius-sm)] bg-[var(--aula-secondary-soft)] text-[var(--aula-secondary)]">
        <ExternalLink className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-[var(--aula-primary)] group-hover:underline">{data.title}</span>
        {data.description && <span className="mt-0.5 block text-sm text-[var(--aula-muted)]">{data.description}</span>}
        {host && <span className="mt-1 block text-xs text-[var(--aula-subtle)]">{host} · se abre en otra pestaña</span>}
      </span>
    </a>
  );
}

const CALLOUT = {
  info: { icon: Info, box: 'border-[#C9D6F2] bg-[var(--aula-info-soft)]', text: 'text-[var(--aula-info)]', label: 'Información' },
  importante: { icon: Megaphone, box: 'border-[#D9D2F5] bg-[var(--aula-accent-soft)]', text: 'text-[#5E51A8]', label: 'Importante' },
  advertencia: { icon: AlertTriangle, box: 'border-[#F5DDAD] bg-[var(--aula-warning-soft)]', text: 'text-[var(--aula-warning)]', label: 'Advertencia' },
  consejo: { icon: Lightbulb, box: 'border-[#BEE6E3] bg-[var(--aula-secondary-soft)]', text: 'text-[var(--aula-success)]', label: 'Consejo' },
};

function CalloutBlock({ block }) {
  const { data } = block;
  const tone = CALLOUT[data.tone] || CALLOUT.info;
  const Icon = tone.icon;
  return (
    <aside aria-label={data.title || tone.label} className={`flex gap-3 rounded-[var(--aula-radius-lg)] border px-4 py-3 ${tone.box}`}>
      <Icon className={`mt-1 h-5 w-5 shrink-0 ${tone.text}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-bold ${tone.text}`}>{data.title || tone.label}</p>
        <RichText html={data.html} className="text-[0.95rem] [&>*:first-child]:mt-1" />
      </div>
    </aside>
  );
}

export function BlockView({ block, files, onMedia }) {
  const { data } = block;
  switch (block.type) {
    case 'encabezado':
      return data.level === 3
        ? <h3 className="text-xl font-bold text-[var(--aula-text)]">{data.text}</h3>
        : <h2 className="text-2xl font-extrabold text-[var(--aula-primary)]">{data.text}</h2>;
    case 'texto': return <RichText html={data.html} />;
    case 'imagen': return <ImageBlock block={block} files={files} />;
    case 'galeria': return <GalleryBlock block={block} files={files} />;
    case 'video': return <VideoBlock block={block} files={files} onMedia={onMedia} />;
    case 'audio': return <AudioBlock block={block} files={files} onMedia={onMedia} />;
    case 'pdf': return <PdfBlock block={block} mode="documento" />;
    case 'presentacion': return <SlidesBlock block={block} />;
    case 'archivos': return <FilesBlock block={block} files={files} />;
    case 'infografia': return <InfographicBlock block={block} files={files} />;
    case 'enlace': return <LinkBlock block={block} />;
    case 'destacado': return <CalloutBlock block={block} />;
    default:
      return (
        <p className="flex items-center gap-2 rounded-[var(--aula-radius)] border border-dashed border-[var(--aula-border-strong)] px-4 py-3 text-sm text-[var(--aula-muted)]">
          <X className="h-4 w-4" aria-hidden="true" /> Este contenido todavía no se puede mostrar.
        </p>
      );
  }
}

/** Todos los bloques de una clase, con el espaciado de lectura. */
export function BlockList({ blocks, files, onMedia }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((b) => (
        <div key={b.id} id={`bloque-${b.id}`}>
          <BlockView block={b} files={files} onMedia={onMedia} />
        </div>
      ))}
    </div>
  );
}
