/**
 * Orden en que quien estudia ve los bloques de una clase.
 *
 * Decisión de la dirección (13-nov-2026): si la clase tiene videos, van
 * siempre arriba y la lectura sigue debajo. Los videos conservan su orden
 * entre sí y el resto de los bloques también; el editor no cambia.
 */
export function videosPrimero(blocks = []) {
  const videos = blocks.filter((b) => b.type === 'video');
  if (!videos.length) return blocks;
  return [...videos, ...blocks.filter((b) => b.type !== 'video')];
}
