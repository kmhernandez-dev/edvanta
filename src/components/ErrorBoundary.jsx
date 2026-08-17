import { Component } from 'react';

/**
 * ErrorBoundary global: muestra el error en pantalla en lugar de
 * una pantalla en blanco. Facilita diagnosticar fallos en producción.
 *
 * Si el error es un chunk desactualizado ("Failed to fetch dynamically
 * imported module"), recarga la página automáticamente una sola vez:
 * tras un deploy, el navegador puede tener un index.html viejo que
 * apunta a assets que ya no existen.
 */
export default class ErrorBoundary extends Component {
  state = { error: null, reloaded: false };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary capturó un error:', error, info);
    const message = String(error?.message || error);
    if (/dynamically imported module|import\(\)|chunk/i.test(message) && !this.state.reloaded) {
      this.setState({ reloaded: true });
      window.setTimeout(() => window.location.reload(), 400);
    }
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
              onClick={() => window.location.reload()}
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
