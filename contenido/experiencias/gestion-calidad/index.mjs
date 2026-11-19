/**
 * Curso de Gestión de Calidad Farmacéutica
 * Experiencias de clase escritas a mano (estándar de BPM y control de
 * calidad). Ver scripts/generar-migracion-experiencias.mjs.
 *
 * 19-nov-2026: pedido de Karla de completar en texto todas las clases de la
 * línea de calidad para promocionar los cursos en LinkedIn. Reemplaza al
 * texto corto de la siembra; los videos y enlaces se conservan.
 */
import u1 from './u1.mjs';
import u2 from './u2.mjs';
import u3 from './u3.mjs';
import u4 from './u4.mjs';
import u5 from './u5.mjs';

export const CURSO = 'Curso de Gestión de Calidad Farmacéutica';
// Reemplaza las experiencias generadas por plantilla (164_experiencias_calidad_1.sql).
export const MIGRACION = '181_experiencias_gestion_calidad.sql';
export const CLASES = [...u1, ...u2, ...u3, ...u4, ...u5];
