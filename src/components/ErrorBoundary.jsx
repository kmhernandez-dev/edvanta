import { Component } from 'react';

/**
 * ErrorBoundary global: muestra el error en pantalla en lugar de
 * una pantalla en blanco. Facilita diagnosticar fallos en producción.
 */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary capturó un error:', error, info);
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
