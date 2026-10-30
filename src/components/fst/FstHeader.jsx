/**
 * Encabezado de las páginas de Feliz Sin Tiroides: el de Edvanta y,
 * debajo, la barra del programa (ver components/edvanta/programa.jsx).
 * Va en el flujo de la página: lo que sigue no necesita margen arriba.
 */
import { EncabezadoDePrograma } from '../edvanta/programa';
import { PROGRAMA_FST } from '../../config/navProgramas';

export default function FstHeader() {
  return <EncabezadoDePrograma programa={PROGRAMA_FST} />;
}
