/** Mapa página → casos clínicos que la enlazan (lo usan el script generador y la prueba). */
export function calcularEnlacesInversos(casos) {
  const vademecum = {};
  const articulos = {};
  for (const c of casos) {
    const caso = { titulo: c.titulo, ruta: `/casos-clinicos/${c.slug}` };
    for (const [, ruta] of c.enlaces || []) {
      const m = /^\/(vademecum|articulos)\/([a-z0-9-]+)$/.exec(ruta);
      if (!m) continue;
      const destino = m[1] === 'vademecum' ? vademecum : articulos;
      (destino[m[2]] ||= []).push(caso);
    }
  }
  const ordenar = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
  return { vademecum: ordenar(vademecum), articulos: ordenar(articulos) };
}
