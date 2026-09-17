/**
 * Formularios de edición de cada tipo de bloque.
 *
 * `value` es el `data` del bloque; `onChange` recibe el nuevo `data`.
 * `files` guarda nombre y tamaño de los archivos (para mostrarlos);
 * `onFile` agrega los datos de un archivo recién subido.
 * `errors` trae errores por campo (del navegador o del servidor).
 */
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { fileUrl } from '../api';
import { IconButton } from '../ui/Button';
import { FileUploader } from '../ui/FileUploader';
import { Checkbox, Select, TextArea, TextInput, Toggle, isBlank } from '../ui/Form';
import { RichTextField } from '../ui/RichTextField';
import { Segmented } from '../ui/Tabs';
import { moveBy } from '../ui/Sortable';
import { BLOCK_ACCEPT, CALLOUT_TONES } from './meta';

const DOWNLOADABLE = {
  imagen: () => true,
  galeria: () => true,
  video: (d) => d.source === 'archivo',
  audio: () => true,
  pdf: () => true,
  presentacion: (d) => d.source === 'archivo',
  infografia: () => true,
};

export const canToggleDownload = (type, data) => Boolean(DOWNLOADABLE[type]?.(data || {}));

const fileValue = (files, id) => (id ? { id, name: files?.[id]?.name || 'Archivo cargado', size: files?.[id]?.size } : null);

function Thumb({ fileId }) {
  return <img src={fileUrl(fileId)} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />;
}

function useSetter(value, onChange) {
  return (key) => (eventOrValue) => {
    const v = eventOrValue && eventOrValue.target ? (eventOrValue.target.type === 'checkbox' ? eventOrValue.target.checked : eventOrValue.target.value) : eventOrValue;
    onChange({ ...value, [key]: v });
  };
}

function SingleFile({ type, label, value, onChange, files, onFile, error, hint, preview }) {
  return (
    <div className="flex flex-col gap-1">
      <FileUploader
        label={label}
        purpose="contenido"
        context={{ accept: BLOCK_ACCEPT[type] }}
        value={fileValue(files, value)}
        preview={preview ? (v) => <Thumb fileId={v.id} /> : undefined}
        hint={hint}
        onChange={(f) => {
          if (f) onFile(f);
          onChange(f ? f.id : null);
        }}
      />
      {error && <p role="alert" className="text-xs font-medium text-[var(--aula-danger)]">{error}</p>}
    </div>
  );
}

// ── Validación en el navegador (el servidor valida de nuevo) ─

const URL_RE = /^https?:\/\/\S+\.\S+/i;

export function validateBlock(type, d) {
  const e = {};
  switch (type) {
    case 'encabezado':
      if (isBlank(d.text)) e.text = 'Escribe el encabezado.';
      break;
    case 'texto':
      if (isBlank(d.html)) e.html = 'Escribe el texto del bloque.';
      break;
    case 'imagen':
      if (!d.fileId) e.fileId = 'Sube la imagen.';
      if (!d.decorative && isBlank(d.alt)) e.alt = 'Describe la imagen o márcala como decorativa.';
      break;
    case 'galeria':
      if ((d.items || []).length < 2) e.items = 'Una galería necesita al menos 2 imágenes.';
      (d.items || []).forEach((item, i) => {
        if (!item.decorative && isBlank(item.alt)) e[`items.${i}.alt`] = 'Describe esta imagen o márcala como decorativa.';
      });
      break;
    case 'video':
      if (d.source === 'archivo' && !d.fileId) e.fileId = 'Sube el video.';
      if (d.source === 'enlace' && !URL_RE.test(d.url || '')) e.url = 'Pega el enlace de YouTube o Vimeo.';
      break;
    case 'audio':
    case 'pdf':
      if (!d.fileId) e.fileId = type === 'audio' ? 'Sube el audio.' : 'Sube el PDF.';
      break;
    case 'presentacion':
      if (d.source === 'archivo' && !d.fileId) e.fileId = 'Sube la presentación en PDF.';
      if (d.source === 'enlace' && !URL_RE.test(d.url || '')) e.url = 'Pega el enlace de Google Slides o Canva.';
      break;
    case 'archivos':
      if (!(d.items || []).length) e.items = 'Agrega al menos un archivo.';
      break;
    case 'infografia':
      if (!d.fileId) e.fileId = 'Sube la infografía.';
      if (isBlank(d.alt)) e.alt = 'Resume en una frase qué muestra la infografía.';
      break;
    case 'enlace':
      if (!URL_RE.test(d.url || '')) e.url = 'Escribe una dirección completa (https://…).';
      if (isBlank(d.title)) e.title = 'Escribe el título del enlace.';
      break;
    case 'destacado':
      if (isBlank(d.html)) e.html = 'Escribe el contenido del recuadro.';
      break;
    default:
  }
  return e;
}

// ── Formularios ─────────────────────────────────────────────

function HeadingForm({ value, onChange, errors }) {
  const set = useSetter(value, onChange);
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
      <TextInput label="Encabezado" required value={value.text || ''} onChange={set('text')} error={errors.text} maxLength={200} data-autofocus />
      <Select label="Nivel" value={String(value.level || 2)} onChange={(e) => onChange({ ...value, level: Number(e.target.value) })}
        options={[{ value: '2', label: 'Título de sección' }, { value: '3', label: 'Subtítulo' }]} />
    </div>
  );
}

function TextForm({ value, onChange, errors }) {
  return <RichTextField label="Texto" required value={value.html || ''} onChange={(html) => onChange({ ...value, html })} error={errors.html} minHeight={180} />;
}

function ImageForm({ value, onChange, errors, files, onFile }) {
  const set = useSetter(value, onChange);
  return (
    <div className="flex flex-col gap-4">
      <SingleFile type="imagen" label="Imagen" value={value.fileId} onChange={set('fileId')} files={files} onFile={onFile} error={errors.fileId} preview />
      <Checkbox label="Es decorativa" description="No aporta información: los lectores de pantalla la omiten." checked={Boolean(value.decorative)} onChange={set('decorative')} />
      {!value.decorative && (
        <TextInput label="Texto alternativo" required value={value.alt || ''} onChange={set('alt')} error={errors.alt} maxLength={300}
          hint="Describe lo que muestra la imagen para quien no puede verla." />
      )}
      <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
        <TextInput label="Leyenda (opcional)" value={value.caption || ''} onChange={set('caption')} maxLength={300} error={errors.caption} />
        <Select label="Tamaño" value={value.size || 'normal'} onChange={set('size')}
          options={[{ value: 'normal', label: 'Normal' }, { value: 'ancho', label: 'Ancho completo' }]} />
      </div>
    </div>
  );
}

function GalleryForm({ value, onChange, errors, files, onFile }) {
  const items = value.items || [];
  const setItems = (next) => onChange({ ...value, items: next });
  const update = (i, patch) => setItems(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const keyed = items.map((it, i) => ({ ...it, id: `${it.fileId}-${i}` }));
  return (
    <div className="flex flex-col gap-4">
      <Select label="Presentación" value={value.layout || 'cuadricula'} onChange={(e) => onChange({ ...value, layout: e.target.value })}
        options={[{ value: 'cuadricula', label: 'Cuadrícula (se amplía al tocar)' }, { value: 'carrusel', label: 'Carrusel (una a la vez)' }]} />
      {errors.items && <p role="alert" className="text-xs font-medium text-[var(--aula-danger)]">{errors.items}</p>}
      <ol className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={keyed[i].id} className="flex gap-3 rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-3">
            <Thumb fileId={item.fileId} />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Checkbox label="Decorativa" checked={Boolean(item.decorative)} onChange={(e) => update(i, { decorative: e.target.checked })} />
              {!item.decorative && (
                <TextInput label={`Texto alternativo de la imagen ${i + 1}`} value={item.alt || ''} maxLength={300}
                  error={errors[`items.${i}.alt`]} onChange={(e) => update(i, { alt: e.target.value })} />
              )}
              <TextInput label="Leyenda (opcional)" value={item.caption || ''} maxLength={300} onChange={(e) => update(i, { caption: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <IconButton icon={ArrowUp} size="sm" label={`Subir imagen ${i + 1}`} disabled={i === 0}
                onClick={() => setItems(moveBy(keyed, keyed[i].id, -1).map(({ id, ...rest }) => rest))} />
              <IconButton icon={ArrowDown} size="sm" label={`Bajar imagen ${i + 1}`} disabled={i === items.length - 1}
                onClick={() => setItems(moveBy(keyed, keyed[i].id, 1).map(({ id, ...rest }) => rest))} />
              <IconButton icon={Trash2} size="sm" label={`Quitar imagen ${i + 1}`} onClick={() => setItems(items.filter((_, j) => j !== i))} />
            </div>
          </li>
        ))}
      </ol>
      {items.length < 30 && (
        <FileUploader
          label={items.length ? 'Agregar otra imagen' : 'Agregar imágenes'}
          purpose="contenido"
          context={{ accept: BLOCK_ACCEPT.galeria }}
          value={null}
          onChange={(f) => {
            if (!f) return;
            onFile(f);
            setItems([...items, { fileId: f.id, alt: '', decorative: false, caption: '' }]);
          }}
          hint="Sube las imágenes una por una. Máximo 30."
        />
      )}
    </div>
  );
}

function VideoForm({ value, onChange, errors, files, onFile }) {
  const set = useSetter(value, onChange);
  return (
    <div className="flex flex-col gap-4">
      <Segmented label="Origen del video" value={value.source || 'archivo'} onChange={set('source')}
        options={[{ value: 'archivo', label: 'Subir archivo' }, { value: 'enlace', label: 'YouTube o Vimeo' }]} />
      {value.source === 'enlace' ? (
        <TextInput label="Enlace del video" required value={value.url || ''} onChange={set('url')} error={errors.url} inputMode="url"
          placeholder="https://www.youtube.com/watch?v=…" hint="Si el video de YouTube es privado, márcalo como «no listado» para que se pueda ver en el aula." />
      ) : (
        <SingleFile type="video" label="Archivo de video" value={value.fileId} onChange={set('fileId')} files={files} onFile={onFile} error={errors.fileId}
          hint="MP4 recomendado. La subida continúa por partes aunque el archivo sea grande." />
      )}
      <TextInput label="Título (opcional)" value={value.title || ''} onChange={set('title')} maxLength={200} error={errors.title} />
      <RichTextField label="Transcripción (recomendada)" value={value.transcriptHtml || ''} onChange={set('transcriptHtml')} headings={false} minHeight={100}
        hint="Ayuda a quien no puede escuchar el video y a quien prefiere leer." />
    </div>
  );
}

function AudioForm({ value, onChange, errors, files, onFile }) {
  const set = useSetter(value, onChange);
  return (
    <div className="flex flex-col gap-4">
      <SingleFile type="audio" label="Archivo de audio" value={value.fileId} onChange={set('fileId')} files={files} onFile={onFile} error={errors.fileId} />
      <TextInput label="Título (opcional)" value={value.title || ''} onChange={set('title')} maxLength={200} />
      <RichTextField label="Transcripción (recomendada)" value={value.transcriptHtml || ''} onChange={set('transcriptHtml')} headings={false} minHeight={100} />
    </div>
  );
}

function PdfForm({ value, onChange, errors, files, onFile }) {
  const set = useSetter(value, onChange);
  return (
    <div className="flex flex-col gap-4">
      <SingleFile type="pdf" label="Documento PDF" value={value.fileId} onChange={set('fileId')} files={files} onFile={onFile} error={errors.fileId} />
      <TextInput label="Título (opcional)" value={value.title || ''} onChange={set('title')} maxLength={200} />
      <TextArea label="Descripción (opcional)" rows={2} value={value.description || ''} onChange={set('description')} maxLength={500} />
    </div>
  );
}

function SlidesForm({ value, onChange, errors, files, onFile }) {
  const set = useSetter(value, onChange);
  return (
    <div className="flex flex-col gap-4">
      <Segmented label="Origen de la presentación" value={value.source || 'archivo'} onChange={set('source')}
        options={[{ value: 'archivo', label: 'PDF' }, { value: 'enlace', label: 'Google Slides o Canva' }]} />
      {value.source === 'enlace' ? (
        <TextInput label="Enlace de la presentación" required value={value.url || ''} onChange={set('url')} error={errors.url} inputMode="url"
          hint="Usa el enlace para compartir (con acceso para cualquiera que tenga el enlace) o el de «Publicar en la Web»." />
      ) : (
        <SingleFile type="presentacion" label="Presentación en PDF" value={value.fileId} onChange={set('fileId')} files={files} onFile={onFile} error={errors.fileId}
          hint="Desde PowerPoint o Keynote: Archivo → Exportar → PDF. Se verá una diapositiva a la vez." />
      )}
      <TextInput label="Título (opcional)" value={value.title || ''} onChange={set('title')} maxLength={200} />
    </div>
  );
}

function FilesForm({ value, onChange, errors, files, onFile }) {
  const items = value.items || [];
  const setItems = (next) => onChange({ ...value, items: next });
  const update = (i, patch) => setItems(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const keyed = items.map((it, i) => ({ ...it, id: `${it.fileId}-${i}` }));
  return (
    <div className="flex flex-col gap-4">
      <TextInput label="Título del bloque (opcional)" value={value.title || ''} placeholder="Material para descargar" maxLength={200}
        onChange={(e) => onChange({ ...value, title: e.target.value })} />
      {errors.items && <p role="alert" className="text-xs font-medium text-[var(--aula-danger)]">{errors.items}</p>}
      <ol className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={keyed[i].id} className="flex gap-3 rounded-[var(--aula-radius)] border border-[var(--aula-border)] p-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="truncate text-xs text-[var(--aula-muted)]">{files?.[item.fileId]?.name || 'Archivo'}</p>
              <TextInput label="Nombre visible" value={item.label || ''} maxLength={200} onChange={(e) => update(i, { label: e.target.value })} />
              <TextInput label="Descripción (opcional)" value={item.description || ''} maxLength={300} onChange={(e) => update(i, { description: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <IconButton icon={ArrowUp} size="sm" label={`Subir archivo ${i + 1}`} disabled={i === 0}
                onClick={() => setItems(moveBy(keyed, keyed[i].id, -1).map(({ id, ...rest }) => rest))} />
              <IconButton icon={ArrowDown} size="sm" label={`Bajar archivo ${i + 1}`} disabled={i === items.length - 1}
                onClick={() => setItems(moveBy(keyed, keyed[i].id, 1).map(({ id, ...rest }) => rest))} />
              <IconButton icon={Trash2} size="sm" label={`Quitar archivo ${i + 1}`} onClick={() => setItems(items.filter((_, j) => j !== i))} />
            </div>
          </li>
        ))}
      </ol>
      {items.length < 30 && (
        <FileUploader
          label={items.length ? 'Agregar otro archivo' : 'Agregar archivos'}
          purpose="contenido"
          value={null}
          onChange={(f) => {
            if (!f) return;
            onFile(f);
            setItems([...items, { fileId: f.id, label: f.name.replace(/\.[^.]+$/, ''), description: '' }]);
          }}
          hint="Estos archivos siempre se pueden descargar."
        />
      )}
    </div>
  );
}

function InfographicForm({ value, onChange, errors, files, onFile }) {
  const set = useSetter(value, onChange);
  return (
    <div className="flex flex-col gap-4">
      <SingleFile type="infografia" label="Infografía (imagen)" value={value.fileId} onChange={set('fileId')} files={files} onFile={onFile} error={errors.fileId} preview />
      <TextInput label="Texto alternativo" required value={value.alt || ''} onChange={set('alt')} error={errors.alt} maxLength={300}
        hint="Una frase que resuma qué muestra." />
      <TextInput label="Leyenda (opcional)" value={value.caption || ''} onChange={set('caption')} maxLength={300} />
      <RichTextField label="Descripción completa (recomendada)" value={value.longDescriptionHtml || ''} onChange={set('longDescriptionHtml')} minHeight={120}
        hint="Todo el contenido de la infografía en texto, para quien no puede verla." />
    </div>
  );
}

function LinkForm({ value, onChange, errors }) {
  const set = useSetter(value, onChange);
  return (
    <div className="flex flex-col gap-4">
      <TextInput label="Dirección" required value={value.url || ''} onChange={set('url')} error={errors.url} inputMode="url" placeholder="https://" data-autofocus />
      <TextInput label="Título" required value={value.title || ''} onChange={set('title')} error={errors.title} maxLength={200} />
      <TextArea label="Descripción (opcional)" rows={2} value={value.description || ''} onChange={set('description')} maxLength={500} />
    </div>
  );
}

function CalloutForm({ value, onChange, errors }) {
  const set = useSetter(value, onChange);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
        <Select label="Tipo" value={value.tone || 'info'} onChange={set('tone')} options={CALLOUT_TONES} />
        <TextInput label="Título (opcional)" value={value.title || ''} onChange={set('title')} maxLength={200} />
      </div>
      <RichTextField label="Contenido" required value={value.html || ''} onChange={set('html')} error={errors.html} headings={false} minHeight={100} />
    </div>
  );
}

const FORMS = {
  encabezado: HeadingForm,
  texto: TextForm,
  imagen: ImageForm,
  galeria: GalleryForm,
  video: VideoForm,
  audio: AudioForm,
  pdf: PdfForm,
  presentacion: SlidesForm,
  archivos: FilesForm,
  infografia: InfographicForm,
  enlace: LinkForm,
  destacado: CalloutForm,
};

export function BlockForm({ type, value, onChange, errors = {}, files, onFile, allowDownload, onAllowDownload }) {
  const Form = FORMS[type];
  if (!Form) return <p className="text-sm text-[var(--aula-muted)]">Este tipo de bloque no se puede editar todavía.</p>;
  return (
    <div className="flex flex-col gap-5">
      <Form value={value} onChange={onChange} errors={errors} files={files} onFile={onFile} />
      {canToggleDownload(type, value) && (
        <Toggle
          label="Permitir descarga"
          description="Si está apagado, el participante lo ve en el aula pero no tiene botón de descarga."
          checked={Boolean(allowDownload)}
          onChange={onAllowDownload}
        />
      )}
    </div>
  );
}
