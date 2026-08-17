import { Component } from 'react';

const RELOAD_KEY = 'fst-chunk-reload-attempted';

/**
 * ErrorBoundary global: muestra el error en pantalla en lugar de
 * una pantalla en blanco. Facilita diagnosticar fallos en producción.
 *
 * Si el error es un chunk desactualizado ("Failed to fetch dynamically
 * imported module"), recarga la página UNA sola vez por sesión con
 * cache-busting (?v=timestamp): el navegador puede tener un index.html
 * viejo en caché que apunta a assets que ya no existen tras un deploy.
 * La URL con query string distinta fuerza a pedir el HTML fresco.
 */
export default class ErrorBoundary extends Component {
  state = { error: null, reloading: false };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary capturó un error:', error, info);
    const message = String(error?.message || error);
    const isChunkError = /dynamically imported module|import\(\)|chunk/i.test(message);
    if (!isChunkError) return;
    if (this.state.reloading) return;
    try {
      if (sessionStorage.getItem(RELOAD_KEY)) return;
      sessionStorage.setItem(RELOAD_KEY, '1');
    } catch {
      /* sessionStorage no disponible */
    }
    this.setState({ reloading: true });
    window.setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set('v', String(Date.now()));
      window.location.replace(url.toString());
    }, 300);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="fst-app flex min-h-screen items-center justify-center bg-[#FFF9F4] p-6">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-600">Ocurrió un error</p>
            <h1 className="mt-2 text-lg font-semibold text-[#0A2540]">No se pudo cargar la aplicación</h1>
            <p className="mt-2 break-words rounded-xl bg-rose-50 p-3 text-xs leading-5 text-rose-700">
              {String(this.state.error?.message || this.state.error)}
            </p>
            <button
              type="button"
              onClick={() => {
                try { sessionStorage.removeItem(RELOAD_KEY); } catch { /* noop */ }
                const url = new URL(window.location.href);
                url.searchParams.set('v', String(Date.now()));
                window.location.replace(url.toString());
              }}
              className="mt-4 min-h-11 rounded-xl bg-[#0A2540] px-4 text-sm font-bold text-white hover:bg-[#123b5f]"
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
