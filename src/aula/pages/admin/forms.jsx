import { useLayoutEffect, useRef, useState } from 'react';
import { fileUrl, get, patch, post } from '../../api';
import { useAsync } from '../../hooks';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Dialog';
import { FileUploader } from '../../ui/FileUploader';
import {
  checkForm, Checkbox, errorsFrom, isBadEmail, isBlank, Select, TextArea, TextInput, useFocusFirstError,
} from '../../ui/Form';
import { Alert } from '../../ui/States';
import { useToast } from '../../ui/Toast';

export function useCompanyOptions() {
  return useAsync(({ signal }) => get('/admin/options/companies', { signal }), []);
}

export function useGroupOptions(companyId) {
  return useAsync(
    ({ signal }) => get(`/admin/options/groups${companyId ? `?companyId=${companyId}` : ''}`, { signal }),
    [companyId],
  );
}

/** Formulario en modal con envío, errores por campo y aviso de éxito. */
function FormModal({ open, onClose, title, description, submitLabel, onSubmit, children, failure, general, busy }) {
  const formRef = useRef(null);
  useFocusFirstError(failure, formRef);
  return (
    <Modal
      open={open}
      onClose={busy ? undefined : onClose}
      dismissable={!busy}
      title={title}
      description={description}
      footer={(
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancelar</Button>
          <Button type="submit" form="aula-modal-form" loading={busy}>{submitLabel}</Button>
        </>
      )}
    >
      <form ref={formRef} id="aula-modal-form" onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        {general && <Alert tone="danger">{general}</Alert>}
        {children}
      </form>
    </Modal>
  );
}

function useSubmit(onDone) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const run = async (fn, successMessage, problems = null) => {
    if (problems) {
      setError(problems);
      return null;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await fn();
      toast.success(successMessage);
      onDone?.(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, setError, run };
}

// ── Empresa ────────────────────────────────────────────────

const emptyCompany = { name: '', contactName: '', contactEmail: '', contactPhone: '', status: 'activa', internalNotes: '', logo: null };

export function CompanyFormModal({ open, onClose, company, onSaved }) {
  const [form, setForm] = useState(emptyCompany);
  const { busy, error, setError, run } = useSubmit((saved) => { onSaved?.(saved); onClose(); });

  useLayoutEffect(() => {
    if (!open) return;
    setError(null);
    setForm(company ? {
      name: company.name || '',
      contactName: company.contactName || '',
      contactEmail: company.contactEmail || '',
      contactPhone: company.contactPhone || '',
      status: company.status || 'activa',
      internalNotes: company.internalNotes || '',
      logo: company.logoFileId ? { id: company.logoFileId, name: 'Logotipo actual' } : null,
    } : emptyCompany);
  }, [open, company, setError]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const body = {
      name: form.name, contactName: form.contactName, contactEmail: form.contactEmail,
      contactPhone: form.contactPhone, status: form.status, internalNotes: form.internalNotes,
      logoFileId: form.logo?.id ?? null,
    };
    run(
      () => (company ? patch(`/admin/companies/${company.id}`, body) : post('/admin/companies', body)),
      company ? 'Empresa actualizada.' : `Empresa «${form.name.trim()}» creada.`,
      checkForm([
        ['name', isBlank(form.name), 'El nombre de la empresa es obligatorio.'],
        ['contactEmail', isBadEmail(form.contactEmail), 'El correo de contacto no parece válido. Revisa que tenga el formato nombre@dominio.com.'],
      ]),
    );
  };

  const { fields, general } = errorsFrom(error, ['name', 'contactName', 'contactPhone', 'contactEmail', 'status', 'internalNotes']);
  return (
    <FormModal open={open} onClose={onClose} busy={busy} failure={error} general={general} onSubmit={submit}
      title={company ? 'Editar empresa' : 'Nueva empresa'}
      description="Las empresas son los clientes privados del aula. Sus datos no son visibles para otras empresas."
      submitLabel={company ? 'Guardar cambios' : 'Crear empresa'}>
      <TextInput label="Nombre" required value={form.name} error={fields.name} onChange={set('name')} data-autofocus />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Contacto" value={form.contactName} error={fields.contactName} onChange={set('contactName')} />
        <TextInput label="Teléfono" value={form.contactPhone} error={fields.contactPhone} onChange={set('contactPhone')} />
      </div>
      <TextInput label="Correo de contacto" type="email" value={form.contactEmail} error={fields.contactEmail} onChange={set('contactEmail')} />
      <Select label="Estado" value={form.status} onChange={set('status')} error={fields.status}
        hint="Una empresa inactiva conserva su historial pero no aparece en los selectores nuevos."
        options={[{ value: 'activa', label: 'Activa' }, { value: 'inactiva', label: 'Inactiva' }]} />
      <FileUploader
        label="Logotipo (opcional)"
        purpose="logo"
        value={form.logo}
        onChange={(logo) => setForm({ ...form, logo })}
        preview={(v) => <img src={fileUrl(v.id)} alt="" className="h-10 w-10 rounded object-contain" />}
      />
      <TextArea label="Observaciones internas" rows={3} value={form.internalNotes} error={fields.internalNotes}
        onChange={set('internalNotes')} hint="Solo las ven los administradores." />
    </FormModal>
  );
}

// ── Grupo ──────────────────────────────────────────────────

const toDateInput = (value) => (value ? String(value).slice(0, 10) : '');

export function GroupFormModal({ open, onClose, group, defaultCompanyId, onSaved }) {
  const companies = useCompanyOptions();
  const [form, setForm] = useState({});
  const { busy, error, setError, run } = useSubmit((saved) => { onSaved?.(saved); onClose(); });

  useLayoutEffect(() => {
    if (!open) return;
    setError(null);
    setForm({
      name: group?.name || '',
      companyId: String(group?.companyId ?? defaultCompanyId ?? ''),
      description: group?.description || '',
      status: group?.status || 'activo',
      startsOn: toDateInput(group?.startsOn),
      endsOn: toDateInput(group?.endsOn),
    });
  }, [open, group, defaultCompanyId, setError]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const body = {
      name: form.name,
      companyId: form.companyId ? Number(form.companyId) : null,
      description: form.description,
      status: form.status,
      startsOn: form.startsOn || null,
      endsOn: form.endsOn || null,
    };
    run(
      () => (group ? patch(`/admin/groups/${group.id}`, body) : post('/admin/groups', body)),
      group ? 'Grupo actualizado.' : `Grupo «${String(form.name).trim()}» creado.`,
      checkForm([
        ['name', isBlank(form.name), 'El nombre del grupo es obligatorio.'],
        // Fechas en formato AAAA-MM-DD: el orden de texto coincide con el cronológico.
        ['endsOn', form.startsOn && form.endsOn && form.endsOn < form.startsOn, 'La fecha de cierre no puede ser anterior a la de inicio.'],
      ]),
    );
  };

  const { fields, general } = errorsFrom(error, ['name', 'companyId', 'description', 'startsOn', 'endsOn']);
  const locked = Boolean(group && (group.members || group.courses));
  return (
    <FormModal open={open} onClose={onClose} busy={busy} failure={error} general={general} onSubmit={submit}
      title={group ? 'Editar grupo' : 'Nuevo grupo o cohorte'}
      description="Por ejemplo: «Fuerza comercial Pharmarket — octubre 2026». Los cursos asignados al grupo llegan a todos sus miembros, también a quienes entren después."
      submitLabel={group ? 'Guardar cambios' : 'Crear grupo'}>
      <TextInput label="Nombre" required value={form.name || ''} error={fields.name} onChange={set('name')} data-autofocus />
      <Select label="Empresa" value={form.companyId || ''} onChange={set('companyId')} error={fields.companyId}
        placeholder="Sin empresa (cursos propios de Edvanta)" disabled={locked}
        hint={locked ? 'No se puede cambiar: el grupo ya tiene miembros o cursos.' : undefined}
        options={(companies.data || []).map((c) => ({ value: String(c.value), label: c.status === 'inactiva' ? `${c.label} (inactiva)` : c.label }))} />
      <TextArea label="Descripción" rows={2} value={form.description || ''} error={fields.description} onChange={set('description')} />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextInput label="Inicio" type="date" value={form.startsOn || ''} error={fields.startsOn} onChange={set('startsOn')} />
        <TextInput label="Cierre" type="date" value={form.endsOn || ''} error={fields.endsOn} onChange={set('endsOn')} />
        <Select label="Estado" value={form.status || 'activo'} onChange={set('status')}
          options={[{ value: 'activo', label: 'Activo' }, { value: 'cerrado', label: 'Cerrado' }]} />
      </div>
    </FormModal>
  );
}

// ── Persona ────────────────────────────────────────────────

export function UserFormModal({ open, onClose, user, defaultCompanyId, defaultGroupId, onSaved }) {
  const companies = useCompanyOptions();
  const [form, setForm] = useState({});
  const groups = useGroupOptions(form.companyId || 'none');
  const { busy, error, setError, run } = useSubmit((saved) => { onSaved?.(saved); onClose(); });

  useLayoutEffect(() => {
    if (!open) return;
    setError(null);
    setForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      jobTitle: user?.jobTitle || '',
      role: user?.role || 'participant',
      companyId: String(user?.companyId ?? defaultCompanyId ?? ''),
      groupIds: defaultGroupId ? [Number(defaultGroupId)] : [],
      sendInvite: true,
    });
  }, [open, user, defaultCompanyId, defaultGroupId, setError]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const isAdmin = form.role === 'admin';
  const toggleGroup = (id) => setForm((f) => ({
    ...f, groupIds: f.groupIds.includes(id) ? f.groupIds.filter((g) => g !== id) : [...f.groupIds, id],
  }));

  const submit = (e) => {
    e.preventDefault();
    const body = {
      firstName: form.firstName, lastName: form.lastName, email: form.email, jobTitle: form.jobTitle,
      role: form.role, companyId: isAdmin || !form.companyId ? null : Number(form.companyId),
    };
    const problems = checkForm([
      ['firstName', isBlank(form.firstName), 'El nombre es obligatorio.'],
      ['email', isBlank(form.email), 'El correo es obligatorio.'],
      ['email', isBadEmail(form.email), 'El correo no parece válido. Revisa que tenga el formato nombre@dominio.com.'],
    ]);
    if (user) {
      run(() => patch(`/admin/users/${user.id}`, body), 'Datos actualizados.', problems);
    } else {
      run(async () => {
        const res = await post('/admin/users', { ...body, groupIds: isAdmin ? [] : form.groupIds, sendInvite: form.sendInvite });
        return res.user;
      }, form.sendInvite ? `Cuenta creada. Enviamos la invitación a ${String(form.email).trim()}.` : 'Cuenta creada sin enviar invitación.', problems);
    }
  };

  const { fields, general } = errorsFrom(error, ['firstName', 'lastName', 'email', 'role', 'jobTitle', 'companyId']);
  const groupList = (groups.data || []).filter((g) => (form.companyId ? String(g.company_id) === form.companyId : !g.company_id));
  return (
    <FormModal open={open} onClose={onClose} busy={busy} failure={error} general={general} onSubmit={submit}
      title={user ? 'Editar persona' : 'Nueva persona'}
      submitLabel={user ? 'Guardar cambios' : 'Crear cuenta'}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Nombre" required value={form.firstName || ''} error={fields.firstName} onChange={set('firstName')} data-autofocus />
        <TextInput label="Apellido" value={form.lastName || ''} error={fields.lastName} onChange={set('lastName')} />
      </div>
      <TextInput label="Correo" type="email" required value={form.email || ''} error={fields.email} onChange={set('email')}
        hint={user ? 'Si cambias el correo, la persona entrará con el nuevo.' : undefined} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Rol" value={form.role || 'participant'} onChange={set('role')} error={fields.role}
          options={[{ value: 'participant', label: 'Participante' }, { value: 'admin', label: 'Administrador de Edvanta' }]} />
        <TextInput label="Cargo" value={form.jobTitle || ''} error={fields.jobTitle} onChange={set('jobTitle')} />
      </div>
      {isAdmin ? (
        <Alert tone="warning">Un administrador controla todo el aula: cursos, personas, notas y reportes de todas las empresas.</Alert>
      ) : (
        <>
          <Select label="Empresa" value={form.companyId || ''} onChange={(e) => setForm({ ...form, companyId: e.target.value, groupIds: [] })}
            error={fields.companyId} placeholder="Sin empresa"
            hint={user?.companyId && String(user.companyId) !== form.companyId ? 'Al cambiar de empresa, la persona sale de los grupos de la anterior. Su historial se conserva.' : undefined}
            options={(companies.data || []).map((c) => ({ value: String(c.value), label: c.label }))} />
          {!user && (
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-semibold">Grupos</legend>
              {groupList.length === 0 && <p className="text-xs text-[var(--aula-muted)]">No hay grupos {form.companyId ? 'en esta empresa' : 'sin empresa'}.</p>}
              {groupList.map((g) => (
                <Checkbox key={g.value} label={g.label} checked={form.groupIds?.includes(g.value) || false} onChange={() => toggleGroup(g.value)} />
              ))}
            </fieldset>
          )}
        </>
      )}
      {!user && (
        <Checkbox
          label="Enviar invitación por correo ahora"
          description="La persona recibe un enlace para crear su contraseña. Vence en 7 días; puedes reenviarlo."
          checked={form.sendInvite ?? true}
          onChange={(e) => setForm({ ...form, sendInvite: e.target.checked })}
        />
      )}
    </FormModal>
  );
}
