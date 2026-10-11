/**
 * ============================================================
 *  Diagnostico.jsx — Qué ve la plataforma de ti, en castellano
 *
 *  Cuando alguien dice «no me deja entrar», desde fuera no hay
 *  manera de saber en qué punto se rompe: hace falta mirar desde
 *  dentro de su sesión. Esta página hace esas comprobaciones y las
 *  escribe en claro, para poder enseñarlas con una captura en vez
 *  de abrir la consola del navegador.
 *
 *  No enseña contraseñas ni tokens. Enseña si hay sesión, de qué
 *  correo, y qué contesta cada tabla — incluido el código de error
 *  de PostgreSQL, que es lo que dice de verdad qué pasa:
 *
 *      42P17 → recursión en las políticas (RLS)
 *      42501 → faltan permisos sobre la tabla
 *      PGRST → la tabla no existe o no está publicada
 *
 *  Es pública a propósito: si hiciera falta sesión para abrirla,
 *  no serviría justo cuando se necesita.
 * ============================================================
 */

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { apiUrl } from '../config/api';

const TABLAS_DE_LA_CUENTA = ['profiles'];
const TABLAS_DEL_ESPACIO = [
  'professional_profiles',
  'saved_courses',
  'saved_resources',
  'user_learning_paths',
];

/** Un fallo de Supabase, resumido sin perder el código. */
function resumirError(error) {
  if (!error) return null;
  const codigo = error.code || error.status || '';
  const pistas = {
    '42P17': 'Recursión en las políticas de la tabla (RLS).',
    42501: 'La tabla existe pero el rol no tiene permiso sobre ella.',
    PGRST116: 'No hay ninguna fila tuya todavía (eso puede ser normal).',
    PGRST205: 'La tabla no existe o no está publicada en la API.',
  };
  return {
    codigo: String(codigo) || '—',
    mensaje: error.message || 'Sin mensaje',
    pista: pistas[String(codigo)] || null,
  };
}

function Fila({ titulo, estado, detalle, error }) {
  const Icono = estado === 'bien' ? CheckCircle2 : estado === 'aviso' ? AlertCircle : XCircle;
  const color = estado === 'bien' ? 'text-emerald-600' : estado === 'aviso' ? 'text-amber-600' : 'text-red-600';
  return (
    <li className="flex items-start gap-3 border-b border-edvanta-border px-4 py-3 last:border-0">
      <Icono className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-edvanta-deep">{titulo}</p>
        {detalle && <p className="mt-0.5 break-words text-sm text-edvanta-muted">{detalle}</p>}
        {error && (
          <p className="mt-1 break-words rounded-lg bg-red-50 px-3 py-2 font-mono text-xs text-red-800">
            {error.codigo} · {error.mensaje}
            {error.pista && <span className="mt-1 block font-sans font-semibold">{error.pista}</span>}
          </p>
        )}
      </div>
    </li>
  );
}

export default function Diagnostico() {
  const [revisando, setRevisando] = useState(true);
  const [r, setR] = useState(null);

  const revisar = useCallback(async () => {
    setRevisando(true);
    const salida = {
      configurado: supabaseConfigured,
      direccion: `${window.location.pathname}${window.location.search}`,
      traeToken: Boolean(window.location.hash && window.location.hash.includes('access_token')),
      sesion: null,
      errorSesion: null,
      tablas: [],
      puente: null,
    };

    if (!supabaseConfigured || !supabase) {
      setR(salida);
      setRevisando(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      salida.errorSesion = resumirError(error);
      if (data?.session?.user) {
        const u = data.session.user;
        salida.sesion = {
          correo: u.email || '(sin correo)',
          entroCon: u.app_metadata?.provider || 'desconocido',
          creada: u.created_at ? new Date(u.created_at).toLocaleDateString('es-CO') : '—',
        };
      }
    } catch (e) {
      salida.errorSesion = resumirError(e);
    }

    // Cada tabla por separado: si se piden juntas, un solo fallo las tapa
    // todas y no se sabe cuál es la que estorba.
    for (const tabla of [...TABLAS_DE_LA_CUENTA, ...TABLAS_DEL_ESPACIO]) {
      try {
        const { error } = await supabase.from(tabla).select('*').limit(1);
        salida.tablas.push({ tabla, error: resumirError(error) });
      } catch (e) {
        salida.tablas.push({ tabla, error: resumirError(e) });
      }
    }

    // El aula tiene su propia sesión; que falle explica «entro pero el
    // aula me vuelve a pedir contraseña».
    try {
      const res = await fetch(apiUrl('/api/aula/me/courses'), {
        credentials: 'include',
        headers: { 'X-Aula-Request': '1' },
      });
      salida.puente = { estado: res.status };
    } catch {
      salida.puente = { estado: 0 };
    }

    setR(salida);
    setRevisando(false);
  }, []);

  useEffect(() => { revisar(); }, [revisar]);

  return (
    <div className="min-h-screen bg-edvanta-bg">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-blue">Revisión técnica</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-edvanta-deep">
          Qué ve la plataforma de tu cuenta
        </h1>
        <p className="mt-3 text-base leading-7 text-edvanta-muted">
          Si algo falla al entrar, esta página dice en qué punto. Hazle una captura entera
          y mándala: con eso se sabe exactamente qué arreglar. No se muestra ninguna contraseña.
        </p>

        <button
          type="button"
          onClick={revisar}
          disabled={revisando}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-edvanta-blue px-5 text-sm font-bold text-white disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${revisando ? 'animate-spin' : ''}`} aria-hidden="true" />
          {revisando ? 'Revisando…' : 'Volver a revisar'}
        </button>

        {r && (
          <ul className="mt-8 overflow-hidden rounded-2xl border border-edvanta-border bg-white">
            <Fila
              titulo="Conexión con el sistema de cuentas"
              estado={r.configurado ? 'bien' : 'mal'}
              detalle={r.configurado ? 'Configurada.' : 'NO configurada: faltan las claves en el servidor. Nadie puede entrar.'}
            />
            <Fila
              titulo="¿Has entrado?"
              estado={r.sesion ? 'bien' : 'mal'}
              detalle={r.sesion
                ? `Sí: ${r.sesion.correo} · entraste con ${r.sesion.entroCon} · cuenta creada el ${r.sesion.creada}`
                : 'No hay sesión en este navegador. Si acabas de entrar con Google, es aquí donde se pierde.'}
              error={r.errorSesion}
            />
            {r.traeToken && (
              <Fila
                titulo="La dirección traía un token de Google"
                estado={r.sesion ? 'bien' : 'mal'}
                detalle={r.sesion
                  ? 'Y se usó correctamente.'
                  : 'Llegó el token pero no se convirtió en sesión. El fallo está justo aquí.'}
              />
            )}
            {r.tablas.map(({ tabla, error }) => {
              // Sin sesión, las tablas del espacio profesional TIENEN que
              // negarse: a los visitantes se les quitó el permiso a
              // propósito. Pintarlo de rojo mandaría a perseguir un fallo
              // que no existe, así que solo cuenta cuando hay sesión.
              const delEspacio = TABLAS_DEL_ESPACIO.includes(tabla);
              const esperado = delEspacio && !r.sesion && error?.codigo === '42501';
              return (
                <Fila
                  key={tabla}
                  titulo={tabla === 'profiles' ? 'Tu perfil de cuenta' : `Espacio profesional · ${tabla}`}
                  estado={!error ? 'bien' : (esperado || error.codigo === 'PGRST116') ? 'aviso' : 'mal'}
                  detalle={!error
                    ? 'Se lee correctamente.'
                    : esperado
                      ? 'Sin sesión no se puede leer, y así debe ser. Entra y vuelve a revisar.'
                      : 'No se pudo leer.'}
                  error={esperado ? null : error}
                />
              );
            })}
            <Fila
              titulo="Aula virtual"
              estado={r.puente?.estado === 200 ? 'bien' : r.sesion ? 'mal' : 'aviso'}
              detalle={r.puente?.estado === 200
                ? 'El aula te reconoce.'
                : r.puente?.estado === 0
                  ? 'No se pudo contactar con el servidor del aula.'
                  : `El aula respondió ${r.puente?.estado}. Sin sesión esto es normal; con sesión, es el fallo.`}
            />
          </ul>
        )}

        <p className="mt-8 text-sm text-edvanta-muted">
          <Link to="/cuenta" className="font-bold text-edvanta-blue underline underline-offset-2">
            Volver a intentar entrar
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
