/**
 * ============================================================
 *  VolviendoDeAcceso.jsx — La vuelta de Google
 *
 *  Google no devuelve a la persona con una cookie: devuelve el
 *  token pegado en la dirección, detrás de una almohadilla:
 *
 *      https://edvanta.co/app#access_token=…&refresh_token=…
 *
 *  Supabase lo lee de ahí al arrancar, pero tarda un instante.
 *  Antes aquí había una redirección en seco a /aula, que reescribe
 *  la dirección —y con ella se iba el token— antes de que nadie lo
 *  leyera. El resultado era que se entraba con Google, se volvía, y
 *  la plataforma te mandaba otra vez a iniciar sesión, como si no
 *  hubieras hecho nada.
 *
 *  Así que esta pantalla no hace más que esperar. `loading` del
 *  contexto de sesión no se apaga hasta que Supabase terminó de
 *  mirar la dirección, y solo entonces se decide a dónde ir.
 * ============================================================
 */

import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { safeNextPath } from '../lib/authRedirect';

export default function VolviendoDeAcceso() {
  const { user, loading, supabaseConfigured } = useAuth();
  const [params] = useSearchParams();
  // Solo rutas de esta plataforma: el destino viaja en la dirección. Las
  // pantallas de acceso se descartan para no volver a empezar el bucle.
  const destino = safeNextPath(params.get('next'), '/aula');

  if (loading && supabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-edvanta-bg px-4">
        <p className="text-sm font-semibold text-edvanta-muted">Entrando…</p>
      </div>
    );
  }

  // Con sesión, a donde quería ir. Sin ella, al acceso, pero sin perder
  // el destino: al entrar se vuelve solo.
  return (
    <Navigate
      to={user ? destino : `/cuenta?next=${encodeURIComponent(destino)}`}
      replace
    />
  );
}
