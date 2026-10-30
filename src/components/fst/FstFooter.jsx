/**
 * Pie de las páginas de Feliz Sin Tiroides: la franja del programa
 * (comunidad, WhatsApp, correo, secciones y aviso sanitario) y el pie de
 * Edvanta. Los clics se registran como antes.
 */
import { PieDePrograma } from '../edvanta/programa';
import { PROGRAMA_FST } from '../../config/navProgramas';
import { trackEvent } from '../../utils/analytics';
import { trackLeadEvent } from '../../lib/leadEvents';

const registrar = (canal) => {
  if (canal === 'comunidad') {
    trackEvent('whatsapp_click', { location: 'footer_comunidad' });
    trackLeadEvent('community_clicked', { source: 'footer' });
  }
  if (canal === 'whatsapp') trackEvent('whatsapp_click', { location: 'footer' });
};

export default function FstFooter() {
  return <PieDePrograma programa={PROGRAMA_FST} id="fst-contacto" alContactar={registrar} />;
}
