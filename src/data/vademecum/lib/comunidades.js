/**
 * Comunidad de pacientes que el químico farmacéutico puede recomendar desde
 * cada monografía del vademécum (21-nov-2026).
 *
 * Solo se enlaza cuando la comunidad corresponde a un uso principal del
 * medicamento. Las comunidades las mantiene src/data/comunidadesSalud.js;
 * aquí solo se elige cuál y se agrega una tarjeta al final de la sección
 * de atención farmacéutica.
 */
import { comunidadDeSlug } from '../../comunidadesSalud.js';

const POR_COMUNIDAD = {
  obesidad: ['semaglutida', 'tirzepatida', 'liraglutida', 'orlistat', 'naltrexona-bupropion', 'setmelanotida'],
  'hipertension-arterial': ['losartan', 'enalapril', 'amlodipino', 'hidroclorotiazida', 'valsartan', 'metoprolol'],
  'insuficiencia-cardiaca': ['carvedilol', 'espironolactona', 'furosemida'],
  'diabetes-tipo-2': ['metformina', 'empagliflozina', 'sitagliptina'],
  'colesterol-alto': ['atorvastatina', 'rosuvastatina', 'ezetimiba'],
  'fibrilacion-auricular': ['warfarina', 'apixaban', 'rivaroxaban'],
  'infeccion-urinaria': ['nitrofurantoina', 'fosfomicina', 'trimetoprim-sulfametoxazol'],
  'artrosis-y-dolor-cronico': ['meloxicam', 'etoricoxib', 'celecoxib', 'diclofenaco', 'ibuprofeno', 'naproxeno', 'acetaminofen', 'tramadol', 'metocarbamol', 'pregabalina', 'gabapentina'],
  'gota-y-acido-urico': ['alopurinol', 'colchicina'],
  'gastritis-y-reflujo': ['omeprazol', 'esomeprazol', 'lansoprazol', 'domperidona', 'metoclopramida'],
  'colon-irritable': ['butilescopolamina', 'simeticona', 'loperamida'],
  estrenimiento: ['bisacodilo', 'lactulosa'],
  asma: ['montelukast', 'salbutamol'],
  epoc: ['acetilcisteina'],
  'salud-mental': ['sertralina', 'fluoxetina', 'amitriptilina', 'quetiapina'],
  'ansiedad-e-insomnio': ['trazodona', 'clonazepam'],
  'piel-y-dermatologia': ['clotrimazol', 'ketoconazol', 'aciclovir'],
  tiroides: ['levotiroxina'],
};

export const COMUNIDAD_DE_MONOGRAFIA = Object.fromEntries(
  Object.entries(POR_COMUNIDAD).flatMap(([comunidad, slugs]) => slugs.map((s) => [s, comunidad])),
);

/** Agrega la tarjeta de la comunidad al final de la atención farmacéutica. */
export function conComunidad(monografia) {
  const comunidad = comunidadDeSlug(COMUNIDAD_DE_MONOGRAFIA[monografia.slug]);
  if (!comunidad) return monografia;
  const tarjeta = {
    cta: {
      etiqueta: 'Comunidad para tus pacientes',
      titulo: `Comunidad de ${/^[A-ZÁÉÍÓÚÑ]{2}/.test(comunidad.nombre) ? comunidad.nombre : comunidad.nombre.toLowerCase()}`,
      texto: 'Grupo de apoyo de Edvanta Contigo con artículos claros, herramientas y acompañamiento por WhatsApp, con reglas y moderación. Recomiéndalo a quien empieza este tratamiento: le ayuda a entenderlo y a no abandonarlo. No reemplaza la consulta.',
      url: comunidad.ruta,
      boton: 'Conocer la comunidad',
      icono: 'Users',
    },
  };
  return {
    ...monografia,
    secciones: monografia.secciones.map((s) => (s.id === 'atencion-farmaceutica' ? { ...s, bloques: [...s.bloques, tarjeta] } : s)),
  };
}
