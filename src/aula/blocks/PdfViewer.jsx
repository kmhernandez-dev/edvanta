/**
 * Visor de PDF y de presentaciones en PDF (pdf.js). El archivo se pide a
 * la API del aula, que verifica el permiso en cada lectura. Si el bloque
 * no permite descargar, el visor no ofrece descarga ni «abrir aparte».
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft, ChevronRight, Download, Maximize2, Minimize2, ZoomIn, ZoomOut,
} from 'lucide-react';
import { fileUrl } from '../api';
import { Button, IconButton } from '../ui/Button';
import { Spinner } from '../ui/States';
// Carga compartida: resuelve el worker aunque el servidor lo entregue mal.
import { cargarPdfJs as loadPdfJs } from '../../lib/pdfjs';

const ZOOMS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function PdfViewer({ fileId, title, canDownload = false, mode = 'documento' }) {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const renderRef = useRef(null);
  const [doc, setDoc] = useState(null);
  const [pdfjs, setPdfjs] = useState(null);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(0);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const slides = mode === 'presentacion';
  const unit = slides ? 'Diapositiva' : 'Página';

  // Carga del documento.
  useEffect(() => {
    let task = null;
    let alive = true;
    setStatus('loading');
    setError(null);
    loadPdfJs()
      .then((lib) => {
        if (!alive) return null;
        setPdfjs(lib);
        task = lib.getDocument({ url: fileUrl(fileId), withCredentials: true, isEvalSupported: false });
        return task.promise;
      })
      .then((loaded) => {
        if (!alive || !loaded) return;
        setDoc(loaded);
        setPage(1);
        setStatus('ready');
      })
      .catch((err) => {
        if (!alive) return;
        const denied = /403|404|Missing PDF|Unexpected server response/i.test(String(err?.message || ''));
        setError(denied
          ? 'No tienes acceso a este documento o ya no está disponible.'
          : 'No pudimos abrir el documento. Revisa tu conexión e intenta de nuevo.');
        setStatus('error');
      });
    return () => {
      alive = false;
      task?.destroy();
    };
  }, [fileId]);

  // Ancho disponible (para ajustar la página al contenedor).
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, [status]);

  // Dibuja la página actual.
  useEffect(() => {
    if (!doc || !pdfjs || !width) return undefined;
    let cancelled = false;
    (async () => {
      const pdfPage = await doc.getPage(page);
      if (cancelled) return;
      const base = pdfPage.getViewport({ scale: 1 });
      const fit = Math.min(width / base.width, slides && fullscreen ? (window.innerHeight - 120) / base.height : Infinity);
      const scale = Math.max(0.2, fit * zoom);
      const viewport = pdfPage.getViewport({ scale });
      const ratio = window.devicePixelRatio || 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      renderRef.current?.cancel();
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      const task = pdfPage.render({
        canvas,
        viewport,
        transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : undefined,
      });
      renderRef.current = task;
      try {
        await task.promise;
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException') throw err;
        return;
      }
      if (cancelled || !textRef.current) return;
      textRef.current.parentElement.style.setProperty('--scale-factor', String(scale));
      textRef.current.replaceChildren();
      const layer = new pdfjs.TextLayer({
        textContentSource: pdfPage.streamTextContent(),
        container: textRef.current,
        viewport,
      });
      await layer.render().catch(() => {});
    })().catch(() => {
      if (!cancelled) {
        setError('No pudimos mostrar esta página.');
        setStatus('error');
      }
    });
    return () => { cancelled = true; };
  }, [doc, pdfjs, page, width, zoom, slides, fullscreen]);

  useEffect(() => { setPageInput(String(page)); }, [page]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === wrapRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const total = doc?.numPages || 0;
  const go = useCallback((n) => setPage((p) => Math.max(1, Math.min(total || 1, typeof n === 'function' ? n(p) : n))), [total]);

  const onKeyDown = (e) => {
    if (['ArrowRight', 'PageDown'].includes(e.key)) { e.preventDefault(); go((p) => p + 1); }
    if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go((p) => p - 1); }
    if (e.key === 'Home') { e.preventDefault(); go(1); }
    if (e.key === 'End') { e.preventDefault(); go(total); }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else wrapRef.current?.requestFullscreen?.();
  };

  const zoomIndex = ZOOMS.indexOf(zoom);

  return (
    <figure
      ref={wrapRef}
      className={`flex flex-col overflow-hidden rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-[var(--aula-surface-muted)] ${fullscreen ? 'h-full justify-center bg-[#1b2438]' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--aula-border)] bg-white px-3 py-2">
        <figcaption className="min-w-0 flex-1 truncate text-sm font-semibold">{title || (slides ? 'Presentación' : 'Documento')}</figcaption>
        {status === 'ready' && (
          <>
            <IconButton icon={ZoomOut} size="sm" label="Alejar" disabled={zoomIndex <= 0} onClick={() => setZoom(ZOOMS[zoomIndex - 1])} />
            <button type="button" onClick={() => setZoom(1)} className="min-w-[3.5rem] text-xs font-semibold tabular-nums text-[var(--aula-muted)] hover:text-[var(--aula-text)]" title="Ajustar al ancho">
              {Math.round(zoom * 100)} %
            </button>
            <IconButton icon={ZoomIn} size="sm" label="Acercar" disabled={zoomIndex >= ZOOMS.length - 1} onClick={() => setZoom(ZOOMS[zoomIndex + 1])} />
            {document.fullscreenEnabled && (
              <IconButton icon={fullscreen ? Minimize2 : Maximize2} size="sm" label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'} onClick={toggleFullscreen} />
            )}
            {canDownload && (
              <Button size="sm" variant="secondary" icon={Download} href={fileUrl(fileId, { download: true })}>Descargar</Button>
            )}
          </>
        )}
      </div>

      <div
        ref={stageRef}
        tabIndex={status === 'ready' ? 0 : -1}
        onKeyDown={onKeyDown}
        aria-label={status === 'ready' ? `${title || 'Documento'}: ${unit.toLowerCase()} ${page} de ${total}. Usa las flechas para cambiar de ${unit.toLowerCase()}.` : undefined}
        className={`relative flex min-h-[240px] justify-center overflow-auto p-3 ${fullscreen ? 'flex-1 items-center' : 'max-h-[80vh]'}`}
        onContextMenu={canDownload ? undefined : (e) => e.preventDefault()}
      >
        {status === 'loading' && <div className="flex items-center"><Spinner label="Abriendo el documento…" /></div>}
        {status === 'error' && <p role="alert" className="self-center text-sm text-[var(--aula-danger)]">{error}</p>}
        <div className={`aula-pdf-page bg-white shadow-sm ${status === 'ready' ? '' : 'hidden'}`}>
          <canvas ref={canvasRef} aria-hidden="true" />
          <div ref={textRef} className="textLayer" />
        </div>
      </div>

      {status === 'ready' && total > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-[var(--aula-border)] bg-white px-3 py-2">
          <IconButton icon={ChevronLeft} label={`${unit} anterior`} disabled={page <= 1} onClick={() => go((p) => p - 1)} />
          <form
            className="flex items-center gap-1.5 text-sm text-[var(--aula-muted)]"
            onSubmit={(e) => { e.preventDefault(); const n = Number(pageInput); if (Number.isInteger(n)) go(n); else setPageInput(String(page)); }}
          >
            <label htmlFor={`pdf-page-${fileId}`} className="sr-only">{unit}</label>
            <input
              id={`pdf-page-${fileId}`}
              inputMode="numeric"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ''))}
              onBlur={() => { const n = Number(pageInput); if (Number.isInteger(n) && n >= 1) go(n); else setPageInput(String(page)); }}
              className="h-8 w-12 rounded-[6px] border border-[var(--aula-border-strong)] text-center text-sm tabular-nums text-[var(--aula-text)]"
            />
            <span>de {total}</span>
          </form>
          <IconButton icon={ChevronRight} label={`${unit} siguiente`} disabled={page >= total} onClick={() => go((p) => p + 1)} />
        </div>
      )}
      <p className="sr-only" aria-live="polite">{status === 'ready' ? `${unit} ${page} de ${total}` : ''}</p>
    </figure>
  );
}
