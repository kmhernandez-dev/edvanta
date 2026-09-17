import { useMemo, useState } from 'react';
import Papa from 'papaparse';
import { CheckCircle2, Download, FileSpreadsheet, RefreshCw, Upload } from 'lucide-react';
import { downloadFrom, post } from '../../api';
import { plural } from '../../labels';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Checkbox, Select } from '../../ui/Form';
import { Card, PageHeader } from '../../ui/Page';
import { Alert } from '../../ui/States';
import { DataTable } from '../../ui/Table';
import { useToast } from '../../ui/Toast';

const FIELDS = [
  { key: 'firstName', label: 'Nombre', required: true, aliases: ['nombre', 'nombres', 'first name', 'firstname', 'name', 'primer nombre'] },
  { key: 'lastName', label: 'Apellido', aliases: ['apellido', 'apellidos', 'last name', 'lastname', 'surname'] },
  { key: 'email', label: 'Correo', required: true, aliases: ['correo', 'correo electronico', 'email', 'e-mail', 'mail', 'correo corporativo'] },
  { key: 'company', label: 'Empresa', aliases: ['empresa', 'compania', 'company', 'organizacion'] },
  { key: 'group', label: 'Grupo', aliases: ['grupo', 'cohorte', 'group', 'equipo'] },
  { key: 'jobTitle', label: 'Cargo', aliases: ['cargo', 'puesto', 'job title', 'title', 'posicion'] },
];

const normalize = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
const MAX_ROWS = 2000;

/** Excel en Windows suele guardar CSV en windows-1252; si UTF-8 falla, se usa esa. */
async function readText(file) {
  const buffer = await file.arrayBuffer();
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer).replace(/^\uFEFF/, '');
  } catch {
    return new TextDecoder('windows-1252').decode(buffer);
  }
}

function guessMapping(headers) {
  const mapping = {};
  for (const field of FIELDS) {
    const hit = headers.find((h) => field.aliases.includes(normalize(h)));
    mapping[field.key] = hit || '';
  }
  return mapping;
}

const STATUS = {
  nuevo: { tone: 'success', label: 'Nueva cuenta' },
  existente: { tone: 'info', label: 'Ya existe' },
  omitida: { tone: 'danger', label: 'Se omitirá' },
};

export default function Importar() {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [mapping, setMapping] = useState({});
  const [options, setOptions] = useState({ createCompanies: false, createGroups: false, sendInvites: true });
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [onlyProblems, setOnlyProblems] = useState(false);
  const [dragging, setDragging] = useState(false);

  const reset = () => {
    setFile(null); setParsed(null); setMapping({}); setPreview(null); setResult(null); setError(null);
  };

  const load = async (f) => {
    reset();
    if (!f) return;
    if (!/\.(csv|txt)$/i.test(f.name)) {
      setError({ message: 'Elige un archivo .csv. En Excel: Archivo → Guardar como → CSV UTF-8.' });
      return;
    }
    try {
      const text = await readText(f);
      const out = Papa.parse(text, { header: true, skipEmptyLines: 'greedy', transformHeader: (h) => h.trim() });
      const headers = out.meta.fields || [];
      if (!headers.length || !out.data.length) {
        setError({ message: 'El archivo está vacío o no tiene encabezados en la primera fila.' });
        return;
      }
      if (out.data.length > MAX_ROWS) {
        setError({ message: `El archivo tiene ${out.data.length} filas; el máximo por importación es ${MAX_ROWS}. Divídelo en partes.` });
        return;
      }
      setFile(f);
      setParsed({ headers, rows: out.data, delimiter: out.meta.delimiter });
      setMapping(guessMapping(headers));
    } catch (err) {
      setError({ message: `No pudimos leer el archivo: ${err.message}` });
    }
  };

  const rows = useMemo(() => (parsed ? parsed.rows.map((r) => Object.fromEntries(
    FIELDS.map((f) => [f.key, mapping[f.key] ? r[mapping[f.key]] ?? '' : '']),
  )) : []), [parsed, mapping]);

  const missing = FIELDS.filter((f) => f.required && !mapping[f.key]);

  const send = async (dryRun) => {
    setBusy(dryRun ? 'validar' : 'importar');
    setError(null);
    try {
      const res = await post('/admin/users/import', { rows, ...options, dryRun });
      if (dryRun) {
        setPreview(res);
      } else {
        setResult(res);
        toast.success(`Importación completa: ${plural(res.summary.created, 'cuenta nueva', 'cuentas nuevas')}.`);
      }
    } catch (err) {
      setError(err);
    } finally {
      setBusy(null);
    }
  };

  const shown = preview ? preview.rows.filter((r) => !onlyProblems || r.status === 'omitida' || r.warnings.length) : [];
  const importable = preview ? preview.summary.nuevos + preview.summary.existentes : 0;

  const columns = [
    { key: 'line', header: 'Fila', render: (r) => <span className="tabular-nums text-[var(--aula-muted)]">{r.line}</span> },
    { key: 'person', header: 'Persona', render: (r) => (
      <div className="min-w-0">
        <p className="font-medium">{r.name || '—'}</p>
        <p className="truncate text-xs text-[var(--aula-muted)]">{r.email || 'sin correo'}</p>
      </div>
    ) },
    { key: 'where', header: 'Empresa / grupo', render: (r) => [r.company, r.group].filter(Boolean).join(' · ') || '—' },
    { key: 'status', header: 'Resultado', render: (r) => <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge> },
    { key: 'detail', header: 'Detalle', render: (r) => (
      <ul className="flex flex-col gap-0.5 text-xs">
        {r.errors.map((e) => <li key={e} className="text-[var(--aula-danger)]">{e}</li>)}
        {r.warnings.map((w) => <li key={w} className="text-[var(--aula-warning)]">{w}</li>)}
        {!r.errors.length && r.actions.map((a) => <li key={a} className="text-[var(--aula-muted)]">{a}</li>)}
      </ul>
    ) },
  ];

  return (
    <div>
      <PageHeader
        back={{ to: '/aula/admin/participantes', label: 'Participantes' }}
        title="Importar participantes"
        description="Carga un CSV con nombre, apellido, correo, empresa, grupo y cargo. Primero verás qué pasará con cada fila; nada se guarda hasta que confirmes."
        actions={<Button variant="secondary" icon={Download} onClick={() => downloadFrom('/admin/users/import/template', 'plantilla-participantes-aula.csv').catch((e) => toast.error(e.message))}>Descargar plantilla</Button>}
      />

      {result ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-[var(--aula-success)]" aria-hidden="true" />
            <h2 className="text-xl font-bold">Importación completa</h2>
            <ul className="text-sm leading-relaxed text-[var(--aula-text)]">
              <li>{plural(result.summary.created, 'cuenta nueva', 'cuentas nuevas')}</li>
              <li>{plural(result.summary.addedToGroups, 'ingreso a grupos', 'ingresos a grupos')}</li>
              {result.summary.enrolled > 0 && <li>{plural(result.summary.enrolled, 'inscripción automática', 'inscripciones automáticas')} por cursos de sus grupos o empresas</li>}
              {options.sendInvites && <li>{plural(result.summary.invitacionesEnviadas, 'invitación enviada', 'invitaciones enviadas')}</li>}
              <li>{plural(result.summary.omitidas, 'fila omitida', 'filas omitidas')}</li>
            </ul>
            {options.sendInvites && result.summary.invitacionesEnviadas < result.summary.created && (
              <Alert tone="warning">Algunas invitaciones no se pudieron enviar. Reenvíalas desde la ficha de cada persona.</Alert>
            )}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <Button to="/aula/admin/participantes">Ver participantes</Button>
              <Button variant="secondary" icon={RefreshCw} onClick={reset}>Importar otro archivo</Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {error && <Alert tone="danger">{error.message}</Alert>}

          <Card title="1. Archivo">
            {!parsed ? (
              <label
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); load(e.dataTransfer.files?.[0]); }}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-[var(--aula-radius)] border-2 border-dashed px-4 py-10 text-center focus-within:ring-[3px] focus-within:ring-[var(--aula-primary-soft)] ${
                  dragging ? 'border-[var(--aula-primary)] bg-[var(--aula-primary-soft)]' : 'border-[var(--aula-border-strong)] hover:border-[var(--aula-primary)]'
                }`}
              >
                <FileSpreadsheet className="h-8 w-8 text-[var(--aula-primary)]" aria-hidden="true" />
                <span className="font-semibold text-[var(--aula-primary)]">Elige el CSV o arrástralo aquí</span>
                <span className="text-xs text-[var(--aula-muted)]">Hasta {MAX_ROWS} filas. Acepta separador coma o punto y coma.</span>
                <input type="file" accept=".csv,.txt,text/csv" className="sr-only" onChange={(e) => { load(e.target.files?.[0]); e.target.value = ''; }} />
              </label>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-6 w-6 text-[var(--aula-primary)]" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-xs text-[var(--aula-muted)]">{plural(parsed.rows.length, 'fila')} · separador «{parsed.delimiter}»</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={reset}>Cambiar archivo</Button>
              </div>
            )}
          </Card>

          {parsed && (
            <Card title="2. Columnas y opciones" description="Revisa que cada dato apunte a la columna correcta del archivo.">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {FIELDS.map((f) => (
                  <Select key={f.key} label={f.label} required={f.required}
                    value={mapping[f.key] || ''}
                    onChange={(e) => { setMapping({ ...mapping, [f.key]: e.target.value }); setPreview(null); }}
                    placeholder={f.required ? 'Elige una columna' : 'No importar'}
                    error={f.required && !mapping[f.key] ? 'Obligatorio' : undefined}
                    options={parsed.headers.map((h) => ({ value: h, label: h }))} />
                ))}
              </div>
              <div className="mt-5 grid gap-3 border-t border-[var(--aula-border)] pt-5 sm:grid-cols-3">
                <Checkbox label="Crear empresas que no existan" description="Si no, esas filas se omiten."
                  checked={options.createCompanies} onChange={(e) => { setOptions({ ...options, createCompanies: e.target.checked }); setPreview(null); }} />
                <Checkbox label="Crear grupos que no existan" description="Dentro de la empresa de la fila."
                  checked={options.createGroups} onChange={(e) => { setOptions({ ...options, createGroups: e.target.checked }); setPreview(null); }} />
                <Checkbox label="Enviar invitación a las cuentas nuevas" description="Cada persona recibe su enlace por correo."
                  checked={options.sendInvites} onChange={(e) => { setOptions({ ...options, sendInvites: e.target.checked }); setPreview(null); }} />
              </div>
              <div className="mt-5">
                <Button icon={RefreshCw} onClick={() => send(true)} loading={busy === 'validar'} loadingLabel="Validando…" disabled={missing.length > 0}>
                  {preview ? 'Validar de nuevo' : 'Validar archivo'}
                </Button>
              </div>
            </Card>
          )}

          {preview && (
            <Card
              title="3. Revisión"
              description="Así quedaría la importación. Las filas con errores se omiten; las demás se importan."
              actions={<Checkbox label="Ver solo filas con avisos o errores" checked={onlyProblems} onChange={(e) => setOnlyProblems(e.target.checked)} />}
            >
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge tone="success">{plural(preview.summary.nuevos, 'nueva')}</Badge>
                <Badge tone="info">{plural(preview.summary.existentes, 'ya existe', 'ya existen')}</Badge>
                <Badge tone={preview.summary.omitidas ? 'danger' : 'neutral'}>{preview.summary.omitidas} con errores</Badge>
                {preview.summary.empresasNuevas > 0 && <Badge tone="accent">{plural(preview.summary.empresasNuevas, 'empresa nueva', 'empresas nuevas')}</Badge>}
                {preview.summary.gruposNuevos > 0 && <Badge tone="accent">{plural(preview.summary.gruposNuevos, 'grupo nuevo', 'grupos nuevos')}</Badge>}
              </div>
              <DataTable caption="Revisión de la importación" columns={columns} rows={shown} rowKey="line"
                empty={<p className="py-6 text-center text-sm text-[var(--aula-muted)]">Ninguna fila tiene avisos ni errores.</p>} />
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button icon={Upload} onClick={() => send(false)} loading={busy === 'importar'} loadingLabel="Importando…" disabled={!importable}>
                  Importar {plural(importable, 'fila')}
                </Button>
                {!importable && <span className="text-sm text-[var(--aula-muted)]">Corrige el archivo: ninguna fila se puede importar.</span>}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
