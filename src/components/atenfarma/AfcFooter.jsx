/**
 * Pie de AtenFarmaClinic: la franja del programa (contacto, secciones y
 * aviso de uso profesional) y el pie de Edvanta.
 */
import { PieDePrograma } from '../edvanta/programa';
import { PROGRAMA_AFC } from '../../config/navProgramas';
import { professionalDisclaimer } from '../../data/atenfarma-clinic';

export default function AfcFooter() {
  return <PieDePrograma programa={PROGRAMA_AFC} id="afc-contacto" aviso={professionalDisclaimer} />;
}
