/**
 * Encabezado de AtenFarmaClinic: el de Edvanta y, debajo, la barra del
 * programa con sus secciones y el acceso a las herramientas (ver
 * components/edvanta/programa.jsx).
 */
import { EncabezadoDePrograma } from '../edvanta/programa';
import { PROGRAMA_AFC } from '../../config/navProgramas';

export default function AfcHeader() {
  return <EncabezadoDePrograma programa={PROGRAMA_AFC} />;
}
