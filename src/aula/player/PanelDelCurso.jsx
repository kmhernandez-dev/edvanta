/**
 * ============================================================
 *  PanelDelCurso.jsx — La columna derecha de la clase
 *
 *  Dos pestañas: el contenido del curso y los apuntes de quien
 *  estudia. No hay una tercera de actividades porque todavía no
 *  existen: una pestaña que se abre y no tiene nada dentro gasta
 *  un clic y enseña a desconfiar del resto.
 *
 *  Los apuntes se guardan solos, pero no en cada tecla: eso serían
 *  decenas de peticiones por párrafo. Se espera a que la persona
 *  deje de escribir.
 * ============================================================
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { NotebookPen, ListTree, Check, Loader2 } from 'lucide-react';
import { get, put } from '../api';
import { ProgressBar } from '../ui/Page';

const PAUSA_ANTES_DE_GUARDAR = 1200;

function Pestana({ activa, onClick, icono: Icono, children, id, panelId }) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={activa}
      aria-controls={panelId}
      onClick={onClick}
      className={`inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-[var(--aula-radius)] px-3 text-sm font-bold transition ${
        activa
          ? 'bg-[var(--aula-primary)] text-white'
          : 'text-[var(--aula-muted)] hover:bg-[var(--aula-neutral-soft)]'
      }`}
    >
      <Icono className="h-4 w-4" aria-hidden="true" />
      {children}
    </button>
  );
}

function Apuntes({ courseId, lessonId }) {
  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState('cargando');
  const temporizador = useRef(null);
  const ultimoGuardado = useRef('');
  // Lo que hay escrito ahora mismo, para poder guardarlo al desmontar
  // sin que el efecto dependa del estado.
  const pendiente = useRef('');
  const guardarRef = useRef(null);

  useEffect(() => {
    let vivo = true;
    setEstado('cargando');
    get(`/me/courses/${courseId}/lessons/${lessonId}/note`)
      .then((n) => {
        if (!vivo) return;
        setTexto(n.body || '');
        ultimoGuardado.current = n.body || '';
        pendiente.current = n.body || '';
        setEstado('listo');
      })
      .catch(() => { if (vivo) setEstado('error'); });
    return () => {
      vivo = false;
      window.clearTimeout(temporizador.current);
    };
  }, [courseId, lessonId]);

  const guardar = useCallback(async (valor) => {
    if (valor === ultimoGuardado.current) return;
    setEstado('guardando');
    try {
      await put(`/me/courses/${courseId}/lessons/${lessonId}/note`, { body: valor });
      ultimoGuardado.current = valor;
      setEstado('guardado');
    } catch {
      setEstado('error');
    }
  }, [courseId, lessonId]);

  guardarRef.current = guardar;

  const alEscribir = (valor) => {
    setTexto(valor);
    pendiente.current = valor;
    setEstado('escribiendo');
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => guardar(valor), PAUSA_ANTES_DE_GUARDAR);
  };

  // Si cierra la pestaña a media escritura, se guarda antes de salir.
  //
  // El efecto NO lleva dependencias a propósito. Con [texto] dentro, su
  // limpieza se ejecutaba en cada tecla: cancelaba el temporizador que
  // acababa de ponerse y guardaba el texto anterior, así que lo último
  // escrito no llegaba nunca. Por eso lo pendiente viaja en una
  // referencia, que siempre tiene el valor de ahora.
  useEffect(() => () => {
    window.clearTimeout(temporizador.current);
    if (pendiente.current !== ultimoGuardado.current) guardarRef.current(pendiente.current);
  }, []);

  const aviso = {
    cargando: 'Abriendo tus apuntes…',
    escribiendo: 'Se guarda solo…',
    guardando: 'Guardando…',
    guardado: 'Guardado',
    error: 'No se pudo guardar. Revisa tu conexión.',
    listo: '',
  }[estado];

  return (
    <div className="flex h-full flex-col gap-2">
      <label htmlFor="apunte" className="text-sm font-bold text-[var(--aula-text)]">
        Tus apuntes de esta clase
      </label>
      <p className="text-xs leading-5 text-[var(--aula-muted)]">
        Solo los ves tú. Se guardan solos y siguen aquí cuando vuelvas.
      </p>
      <textarea
        id="apunte"
        value={texto}
        onChange={(e) => alEscribir(e.target.value)}
        disabled={estado === 'cargando'}
        placeholder="Lo que no quieres olvidar de esta clase…"
        className="min-h-[14rem] flex-1 resize-none rounded-[var(--aula-radius)] border border-[var(--aula-border)] bg-white p-3 text-sm leading-6 outline-none transition focus:border-[var(--aula-secondary)] focus:ring-2 focus:ring-[var(--aula-secondary-soft)] disabled:opacity-60"
      />
      <p
        role="status"
        className={`flex min-h-5 items-center gap-1.5 text-xs font-semibold ${
          estado === 'error' ? 'text-[var(--aula-danger)]' : 'text-[var(--aula-muted)]'
        }`}
      >
        {estado === 'guardando' && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
        {estado === 'guardado' && <Check className="h-3.5 w-3.5 text-[var(--aula-secondary)]" aria-hidden="true" />}
        {aviso}
      </p>
    </div>
  );
}

export default function PanelDelCurso({ snapshot, lesson, lessonHref, lessonState, progress, Outline, courseId }) {
  const [pestana, setPestana] = useState('contenido');

  return (
    <div className="flex h-full flex-col gap-4">
      {progress && (
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--aula-muted)]">
            <span>Tu avance</span>
            <span className="tabular-nums text-[var(--aula-text)]">{Math.round(progress.pct)} %</span>
          </div>
          <div className="mt-1.5">
            <ProgressBar value={progress.pct} label="Avance del curso" size="sm" />
          </div>
        </div>
      )}

      <div role="tablist" aria-label="Panel del curso" className="flex gap-1 rounded-[var(--aula-radius)] bg-[var(--aula-neutral-soft)] p-1">
        <Pestana
          id="pestana-contenido" panelId="panel-contenido"
          activa={pestana === 'contenido'} onClick={() => setPestana('contenido')} icono={ListTree}
        >
          Contenido
        </Pestana>
        <Pestana
          id="pestana-apuntes" panelId="panel-apuntes"
          activa={pestana === 'apuntes'} onClick={() => setPestana('apuntes')} icono={NotebookPen}
        >
          Apuntes
        </Pestana>
      </div>

      <div className="min-h-0 flex-1">
        <div id="panel-contenido" role="tabpanel" aria-labelledby="pestana-contenido" hidden={pestana !== 'contenido'}>
          <Outline snapshot={snapshot} currentId={lesson.id} lessonHref={lessonHref} lessonState={lessonState} />
        </div>
        <div
          id="panel-apuntes"
          role="tabpanel"
          aria-labelledby="pestana-apuntes"
          hidden={pestana !== 'apuntes'}
          className="h-full"
        >
          {/* Se monta solo al abrir la pestaña: así no se piden los apuntes
              de cada clase que alguien simplemente hojea. */}
          {pestana === 'apuntes' && courseId && <Apuntes courseId={courseId} lessonId={lesson.id} />}
          {pestana === 'apuntes' && !courseId && (
            <p className="text-sm text-[var(--aula-muted)]">
              Los apuntes están disponibles cuando cursas, no en la vista previa.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
