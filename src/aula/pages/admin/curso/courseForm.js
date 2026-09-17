import { useEffect, useRef, useState } from 'react';
import { patch } from '../../../api';
import { useFocusFirstError } from '../../../ui/Form';
import { useToast } from '../../../ui/Toast';

/**
 * Estado de un formulario sobre los datos del curso: detecta cambios,
 * valida en el navegador, guarda solo lo modificado y avisa al salir con
 * cambios pendientes.
 */
export function useCourseForm(course, setCourse, pick, { validate, successMessage = 'Cambios guardados.' } = {}) {
  const toast = useToast();
  const [form, setForm] = useState(() => pick(course));
  const [saved, setSaved] = useState(() => pick(course));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const ref = useRef(null);
  useFocusFirstError(error, ref);

  useEffect(() => {
    const next = pick(course);
    setSaved(next);
    setForm(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id, course.updatedAt]);

  const changed = Object.keys(form).filter((k) => JSON.stringify(form[k]) !== JSON.stringify(saved[k]));
  const dirty = changed.length > 0;

  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const set = (key) => (eventOrValue) => {
    const v = eventOrValue && eventOrValue.target
      ? (eventOrValue.target.type === 'checkbox' ? eventOrValue.target.checked : eventOrValue.target.value)
      : eventOrValue;
    setForm((f) => ({ ...f, [key]: v }));
  };

  const submit = async (e, toBody) => {
    e?.preventDefault();
    const problems = validate?.(form);
    if (problems) { setError(problems); return; }
    setBusy(true);
    setError(null);
    try {
      const body = toBody(form, changed);
      const updated = await patch(`/admin/courses/${course.id}`, body);
      setCourse(updated);
      toast.success(successMessage);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => { setForm(saved); setError(null); };
  return { form, setForm, set, submit, reset, busy, error, dirty, changed, ref };
}
