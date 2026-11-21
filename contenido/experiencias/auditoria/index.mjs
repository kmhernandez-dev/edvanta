/**
 * Curso de Auditoría de Calidad Farmacéutica
 * Experiencias de clase escritas a mano (estándar de BPM, control de calidad
 * y gestión de calidad). Ver scripts/generar-migracion-experiencias.mjs.
 *
 * 19-nov-2026: pedido de Karla de completar en texto todas las clases de la
 * línea de calidad para promocionar los cursos en LinkedIn. Reemplaza al
 * texto corto de la siembra; los videos y enlaces se conservan.
 *
 * El curso enseña ISO 19011:2026 (4.ª edición, mayo de 2026), que reemplazó
 * a la ISO 19011:2018 en la que se basó la siembra.
 */
import u1 from './u1.mjs';
import u2 from './u2.mjs';
import u3 from './u3.mjs';
import u4 from './u4.mjs';
import u5 from './u5.mjs';

export const CURSO = 'Curso de Auditoría de Calidad Farmacéutica';
export const MIGRACION = '185_experiencias_auditoria.sql';
export const CLASES = [...u1, ...u2, ...u3, ...u4, ...u5];
