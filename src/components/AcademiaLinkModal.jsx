import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Cuando una persona ya tiene cuenta en Academia con un correo y entra a
 * Edvanta con Google usando ese mismo correo, no se unen las cuentas por
 * coincidencia. Se pide la contraseña de la cuenta de Academia: así se
 * demuestra que ambas identidades son de la misma persona.
 */
export default function AcademiaLinkModal() {
  const navigate = useNavigate();
  const {
    academiaLinkRequired,
    academiaLinkSupabase,
    academiaLoading,
    clearAcademiaLinkRequired,
  } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (academiaLinkRequired) {
      setPassword('');
      setError('');
    }
  }, [academiaLinkRequired]);

  if (!academiaLinkRequired) return null;

  const submit = async event => {
    event.preventDefault();
    setError('');
    if (!password) {
      setError('Escribe la contraseña de tu cuenta de Academia.');
      return;
    }
    try {
      await academiaLinkSupabase(password);
      // La pantalla que abrió el aviso ya había fallado al pedir datos.
      // Recargar hace que vuelva a cargarlos con la cuenta vinculada.
      window.location.reload();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const useEmailInstead = () => {
    clearAcademiaLinkRequired();
    navigate('/academia?login=1');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-navy-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="academia-link-title">
        <div className="bg-gradient-to-r from-teal-600 to-blush-500 px-6 py-5 text-white">
          <p id="academia-link-title" className="font-serif text-lg font-semibold">Vincula tus cuentas</p>
          <p className="mt-0.5 text-xs text-white/80">Academia Feliz Sin Tiroides</p>
        </div>

        <form onSubmit={submit} className="space-y-4 p-6">
          <p className="text-sm leading-6 text-gray-600">
            Ya existe una cuenta de Academia con <strong className="text-deepblue-900">{academiaLinkRequired.email || 'este correo'}</strong>.
            Para conservar tus cursos, retos y progreso, confirma la contraseña de esa cuenta.
          </p>
          <p className="rounded-md border border-teal-100 bg-teal-50 px-3 py-2 text-xs leading-5 text-teal-800">
            No crearemos una cuenta duplicada ni uniremos las cuentas solo porque el correo coincida.
          </p>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700" role="alert">
              {error}
            </div>
          )}

          <label className="block text-xs font-semibold text-deepblue-800">
            Contraseña de tu cuenta de Academia
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              autoComplete="current-password"
              autoFocus
              className="mt-1.5 min-h-11 w-full rounded-xl border border-sand-200 px-4 text-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="Tu contraseña actual"
            />
          </label>

          <button
            type="submit"
            disabled={academiaLoading}
            className="min-h-11 w-full rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
          >
            {academiaLoading ? 'Vinculando...' : 'Vincular y continuar'}
          </button>

          <div className="flex flex-col gap-2 text-center text-xs text-gray-500">
            <button type="button" onClick={useEmailInstead} className="font-semibold text-teal-700 hover:underline">
              Entrar con mi correo y contraseña
            </button>
            <button type="button" onClick={clearAcademiaLinkRequired} className="hover:underline">
              Ahora no
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
