/**
 * Editor de texto enriquecido (TipTap). Se carga bajo demanda: solo lo
 * usan las pantallas de edición. Produce HTML que el servidor vuelve a
 * limpiar antes de guardar.
 */
import { useEffect, useId, useState } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import {
  Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Minus, Quote, Redo2, Strikethrough,
  Underline as UnderlineIcon, Undo2, Unlink,
} from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Dialog';
import { TextInput } from './Form';

const LINK_RE = /^(https?:\/\/|mailto:|tel:)/i;

function ToolButton({ icon: Icon, label, active, disabled, onClick }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active === undefined ? undefined : active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-[6px] transition-colors disabled:opacity-35 ${
        active ? 'bg-[var(--aula-primary-soft)] text-[var(--aula-primary)]' : 'text-[var(--aula-muted)] hover:bg-[var(--aula-neutral-soft)] hover:text-[var(--aula-text)]'
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function LinkDialog({ open, initial, onClose, onSave }) {
  const [href, setHref] = useState('');
  const [error, setError] = useState(null);
  useEffect(() => { if (open) { setHref(initial || 'https://'); setError(null); } }, [open, initial]);
  const save = (e) => {
    e.preventDefault();
    const value = href.trim();
    if (!LINK_RE.test(value) || value === 'https://') {
      setError('Escribe una dirección completa (https://…, mailto: o tel:).');
      return;
    }
    onSave(value);
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Enlace"
      size="sm"
      footer={(
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="aula-link-form">Aplicar</Button>
        </>
      )}
    >
      <form id="aula-link-form" onSubmit={save} noValidate>
        <TextInput label="Dirección" value={href} error={error} onChange={(e) => setHref(e.target.value)} data-autofocus
          hint="Los enlaces a otras páginas se abren en una pestaña nueva." />
      </form>
    </Modal>
  );
}

export default function RichTextEditor({
  label, value, onChange, error, hint, placeholder = 'Escribe aquí…', required, minHeight = 160, headings = true,
}) {
  const id = useId();
  const [linkOpen, setLinkOpen] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: headings ? { levels: [2, 3] } : false,
        codeBlock: false,
        code: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
          protocols: ['http', 'https', 'mailto', 'tel'],
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        id,
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': typeof label === 'string' ? label : 'Texto',
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : '',
        class: 'aula-prose aula-editor px-4 py-3 focus:outline-none',
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? '' : e.getHTML()),
  });

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => (e ? {
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      link: e.isActive('link'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    } : {}),
  }) || {};

  // Si el valor cambia desde fuera (otro bloque, recarga), el editor lo refleja.
  useEffect(() => {
    if (!editor || editor.isFocused) return;
    const current = editor.isEmpty ? '' : editor.getHTML();
    if ((value || '') !== current) editor.commands.setContent(value || '', { emitUpdate: false });
  }, [value, editor]);

  useEffect(() => {
    editor?.setOptions({
      editorProps: {
        attributes: {
          ...editor.options.editorProps.attributes,
          'aria-invalid': error ? 'true' : 'false',
          'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : '',
        },
      },
    });
  }, [editor, error, hint, id]);

  const run = (fn) => () => fn(editor.chain().focus()).run();
  const saveLink = (href) => {
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    setLinkOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold" onClick={() => editor?.commands.focus()}>
          {label}
          {required && <span className="ml-0.5 text-[var(--aula-danger)]" aria-hidden="true">*</span>}
        </label>
      )}
      <div className={`overflow-hidden rounded-[var(--aula-radius)] border bg-white focus-within:ring-[3px] focus-within:ring-[var(--aula-primary-soft)] ${
        error ? 'border-[var(--aula-danger)]' : 'border-[var(--aula-border-strong)] focus-within:border-[var(--aula-primary)]'
      }`}>
        <div role="toolbar" aria-label="Formato del texto" aria-controls={id} className="flex flex-wrap items-center gap-0.5 border-b border-[var(--aula-border)] bg-[var(--aula-surface-muted)] px-1.5 py-1">
          <ToolButton icon={Bold} label="Negrita" active={state.bold} onClick={run((c) => c.toggleBold())} />
          <ToolButton icon={Italic} label="Cursiva" active={state.italic} onClick={run((c) => c.toggleItalic())} />
          <ToolButton icon={UnderlineIcon} label="Subrayado" active={state.underline} onClick={run((c) => c.toggleUnderline())} />
          <ToolButton icon={Strikethrough} label="Tachado" active={state.strike} onClick={run((c) => c.toggleStrike())} />
          <span className="mx-1 h-5 w-px bg-[var(--aula-border-strong)]" aria-hidden="true" />
          {headings && (
            <>
              <ToolButton icon={Heading2} label="Título" active={state.h2} onClick={run((c) => c.toggleHeading({ level: 2 }))} />
              <ToolButton icon={Heading3} label="Subtítulo" active={state.h3} onClick={run((c) => c.toggleHeading({ level: 3 }))} />
            </>
          )}
          <ToolButton icon={List} label="Lista con viñetas" active={state.bullet} onClick={run((c) => c.toggleBulletList())} />
          <ToolButton icon={ListOrdered} label="Lista numerada" active={state.ordered} onClick={run((c) => c.toggleOrderedList())} />
          <ToolButton icon={Quote} label="Cita" active={state.quote} onClick={run((c) => c.toggleBlockquote())} />
          <ToolButton icon={Minus} label="Línea divisoria" onClick={run((c) => c.setHorizontalRule())} />
          <span className="mx-1 h-5 w-px bg-[var(--aula-border-strong)]" aria-hidden="true" />
          <ToolButton icon={Link2} label="Agregar enlace" active={state.link} onClick={() => setLinkOpen(true)} />
          <ToolButton icon={Unlink} label="Quitar enlace" disabled={!state.link} onClick={run((c) => c.extendMarkRange('link').unsetLink())} />
          <span className="ml-auto" />
          <ToolButton icon={Undo2} label="Deshacer" disabled={!state.canUndo} onClick={run((c) => c.undo())} />
          <ToolButton icon={Redo2} label="Rehacer" disabled={!state.canRedo} onClick={run((c) => c.redo())} />
        </div>
        <EditorContent editor={editor} />
      </div>
      {hint && !error && <p id={`${id}-hint`} className="text-xs text-[var(--aula-muted)]">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="text-xs font-medium text-[var(--aula-danger)]">{error}</p>}
      <LinkDialog open={linkOpen} initial={editor?.getAttributes('link').href} onClose={() => setLinkOpen(false)} onSave={saveLink} />
    </div>
  );
}
