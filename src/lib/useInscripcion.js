/**
 * Inscripción a un curso propio por sus dos caminos, para cualquier
 * página que la ofrezca (la landing /curso-de-…/inscripcion).
 *
 *  · estado: visitante | fuera | dentro (y `listo` cuando ya se sabe).
 *  · conCertificado(): crea la cuenta si hace falta (vuelve con
 *    ?camino=certificado), inscribe y abre Mercado Pago; al pagar vuelve
 *    a «Tu certificado» en el aula.
 *  · gratis(): crea la cuenta si hace falta, inscribe y entra al aula.
 */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inscribirme, miAula, pagarCertificado } from './misCursos';

export function useInscripcion(ficha, { volverTras = '' } = {}) {
  const navigate = useNavigate();
  const [estado, setEstado] = useState('visitante');
  const [listo, setListo] = useState(false);
  const [trabajando, setTrabajando] = useState(null); // certificado | gratis
  const [error, setError] = useState('');

  const id = ficha ? Number(String(ficha.id).replace('edvanta-', '')) : null;
  const enAula = ficha ? (ficha.url?.startsWith('/curso-') ? `/aula${ficha.url}` : `/aula/curso/${id}`) : '/aula';

  useEffect(() => {
    if (!id) return undefined;
    let vivo = true;
    miAula().then(({ sesion, cursos }) => {
      if (!vivo) return;
      setListo(true);
      if (!sesion) { setEstado('visitante'); return; }
      setEstado(cursos.some((c) => Number(c.courseId) === id) ? 'dentro' : 'fuera');
    });
    return () => { vivo = false; };
  }, [id]);

  const registro = useCallback((camino) => {
    const vuelta = `${volverTras || ficha?.url || '/'}?camino=${camino}`;
    navigate(`/cuenta?modo=registro&next=${encodeURIComponent(vuelta)}`);
  }, [navigate, ficha, volverTras]);

  const asegurarInscripcion = useCallback(async (camino) => {
    if (estado === 'dentro') return true;
    const r = await inscribirme(id);
    if (r.ok) { setEstado('dentro'); return true; }
    if (r.motivo === 'sin_sesion') registro(camino);
    else setError(r.mensaje || 'No pudimos inscribirte. Intenta de nuevo en un momento.');
    return false;
  }, [estado, id, registro]);

  const conCertificado = useCallback(async () => {
    if (!id) return;
    setError('');
    if (estado === 'visitante') { registro('certificado'); return; }
    setTrabajando('certificado');
    if (!(await asegurarInscripcion('certificado'))) { setTrabajando(null); return; }
    const p = await pagarCertificado(id, `${enAula}/certificado`);
    if (p.ok) { window.location.href = p.initPoint; return; }
    setTrabajando(null);
    if (p.motivo === 'sin_sesion') registro('certificado');
    else if (p.motivo === 'certificado_pagado' || p.motivo === 'certificado_emitido') navigate(`${enAula}/certificado`);
    else setError(p.mensaje);
  }, [id, estado, registro, asegurarInscripcion, enAula, navigate]);

  const gratis = useCallback(async () => {
    if (!id) return;
    setError('');
    if (estado === 'visitante') { registro('gratis'); return; }
    setTrabajando('gratis');
    const ok = await asegurarInscripcion('gratis');
    setTrabajando(null);
    if (ok) navigate(enAula);
  }, [id, estado, registro, asegurarInscripcion, navigate, enAula]);

  return { estado, listo, trabajando, error, conCertificado, gratis, enAula };
}
