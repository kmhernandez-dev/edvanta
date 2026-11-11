/**
 * ============================================================
 *  AdminAuditoriaDiseno.jsx — /admin/auditoria-diseno
 *
 *  Auditoría de diseño sobre datos: abre cada página auditada en un
 *  marco invisible, a 390 y a 1366 px, la mide (pesos y tamaños de
 *  letra, radios, colores fuera del sistema, texto con degradado,
 *  imágenes retiradas, desborde, alto) y la compara con los criterios
 *  de src/data/auditoriaDiseno.js.
 *
 *  El resultado se descarga en JSON para guardarlo en
 *  docs/auditoria-diseno/ y registrar acciones en REGISTRO.md.
 * ============================================================
 */
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Download, Play, XCircle } from 'lucide-react';
import { ANCHOS_AUDITADOS, CRITERIOS, PAGINAS_AUDITADAS } from '../data/auditoriaDiseno';
import { evaluar, medirDocumento } from '../lib/auditoriaDiseno';

const esperar = (ms) => new Promise((r) => { setTimeout(r, ms); });

function cargarEnMarco(marco, ruta, ancho) {
  return new Promise((resolve) => {
    marco.style.width = `${ancho}px`;
    const listo = () => { marco.removeEventListener('load', listo); resolve(); };
    marco.addEventListener('load', listo);
    marco.src = ruta;
  });
}

export default function AdminAuditoriaDiseno() {
  const marco = useRef(null);
  const [estado, setEstado] = useState('listo');
  const [actual, setActual] = useState('');
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    document.title = 'Auditoría de diseño | Edvanta';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const auditar = async () => {
    setEstado('midiendo');
    const salida = [];
    for (const pagina of PAGINAS_AUDITADAS) {
      for (const ancho of ANCHOS_AUDITADOS) {
        setActual(`${pagina.nombre} · ${ancho} px`);
        const m = marco.current;
        await cargarEnMarco(m, pagina.ruta, ancho);
        await esperar(3500);
        const win = m.contentWindow;
        const doc = m.contentDocument;
        // Baja hasta el final para que carguen las filas y vuelve arriba.
        win.scrollTo(0, doc.documentElement.scrollHeight);
        await esperar(1500);
        win.scrollTo(0, 0);
        await esperar(400);
        const medicion = medirDocumento(doc, win);
        salida.push({ ...pagina, ancho, medicion, criterios: evaluar(medicion, { ruta: pagina.ruta, ancho }) });
        setResultados([...salida]);
        window.__auditoriaDiseno = salida; // para exportarla desde la consola o un script
      }
    }
    setActual('');
    setEstado('terminado');
  };

  const descargar = () => {
    const fecha = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify({ fecha, sitio: window.location.origin, resultados }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `auditoria-diseno-${fecha}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const evaluados = resultados.flatMap((r) => r.criterios);
  const cumplidos = evaluados.filter((c) => c.cumple).length;
  const bloqueos = evaluados.filter((c) => !c.cumple && c.escala === 'bloquea').length;
  const indice = evaluados.length ? Math.round((cumplidos / evaluados.length) * 100) : null;

  return (
    <main className="min-h-screen bg-edvanta-bg px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[.12em] text-edvanta-tealdark">Sistema de gestión de diseño</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-edvanta-deep">Auditoría de diseño</h1>
        <p className="mt-2 max-w-3xl text-[15px] text-edvanta-muted">
          Mide {PAGINAS_AUDITADAS.length} páginas en {ANCHOS_AUDITADOS.join(' y ')} px contra {CRITERIOS.length} criterios.
          Cada criterio trae su razón y su línea base. Descarga el resultado y regístralo en
          <code className="mx-1">docs/auditoria-diseno/</code>.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" onClick={auditar} disabled={estado === 'midiendo'} className="ed-btn ed-btn--primary" aria-busy={estado === 'midiendo'}>
            <Play aria-hidden="true" /> {estado === 'midiendo' ? 'Midiendo…' : 'Correr la auditoría'}
          </button>
          {resultados.length > 0 && (
            <button type="button" onClick={descargar} className="ed-btn ed-btn--secondary"><Download aria-hidden="true" /> Descargar JSON</button>
          )}
          {actual && <span className="text-sm text-edvanta-muted">{actual}</span>}
        </div>

        {indice !== null && (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="ds-card p-5"><p className="text-sm text-edvanta-muted">Índice de cumplimiento</p><p className="font-display text-4xl font-bold text-edvanta-blue">{indice}%</p></div>
            <div className="ds-card p-5"><p className="text-sm text-edvanta-muted">Criterios cumplidos</p><p className="font-display text-4xl font-bold text-edvanta-deep">{cumplidos}/{evaluados.length}</p></div>
            <div className="ds-card p-5"><p className="text-sm text-edvanta-muted">Bloqueos abiertos</p><p className={`font-display text-4xl font-bold ${bloqueos ? 'text-[#B42318]' : 'text-[#067647]'}`}>{bloqueos}</p></div>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {resultados.map((r) => (
            <section key={`${r.ruta}-${r.ancho}`} className="ds-card overflow-hidden">
              <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-edvanta-border px-5 py-3">
                <h2 className="font-display text-lg font-bold text-edvanta-deep">{r.nombre} <span className="text-sm font-medium text-edvanta-muted">· {r.ruta} · {r.ancho} px</span></h2>
                <span className="text-sm text-edvanta-muted">{r.medicion.textos} textos · {r.medicion.altoInicio} px de alto</span>
              </header>
              <table className="w-full text-left text-sm">
                <tbody>
                  {r.criterios.map((c) => (
                    <tr key={c.id} className="border-b border-edvanta-border last:border-0">
                      <td className="w-8 px-5 py-2">{c.cumple ? <CheckCircle2 className="h-5 w-5 text-[#067647]" aria-label="Cumple" /> : <XCircle className={`h-5 w-5 ${c.escala === 'bloquea' ? 'text-[#B42318]' : 'text-[#B54708]'}`} aria-label="No cumple" />}</td>
                      <td className="py-2 pr-3 text-edvanta-deep">{c.id} · {c.nombre}</td>
                      <td className="py-2 pr-3 font-semibold tabular-nums text-edvanta-deep">{c.valor}{c.unidad}</td>
                      <td className="py-2 pr-5 text-edvanta-muted">{c.max !== undefined ? `máx. ${c.max}${c.unidad}` : `mín. ${c.min}${c.unidad}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(r.medicion.ejemplos.menores12.length > 0 || r.medicion.coloresFuera > 0) && (
                <details className="border-t border-edvanta-border px-5 py-3 text-sm text-edvanta-muted">
                  <summary className="cursor-pointer font-medium text-edvanta-deep">Evidencia</summary>
                  <p className="mt-2">Tamaños: {r.medicion.tamanos.join(', ')}</p>
                  <p>Radios: {r.medicion.radios.join(', ')}</p>
                  <p>Colores fuera: {Object.entries(r.medicion.colores).map(([k, v]) => `${k} (${v})`).join(', ') || 'ninguno'}</p>
                  {r.medicion.ejemplos.menores12.length > 0 && <p>Menores de 12 px: {r.medicion.ejemplos.menores12.join(' · ')}</p>}
                </details>
              )}
            </section>
          ))}
        </div>
      </div>

      {/* El marco donde se carga cada página; no se mide a sí mismo. */}
      <iframe ref={marco} title="Página auditada" data-auditoria-ignorar="" className="pointer-events-none fixed -left-[2000px] top-0 h-[900px] border-0 opacity-0" aria-hidden="true" tabIndex={-1} />
    </main>
  );
}
