# Indexación del grupo de dolor e inflamación

Este archivo se usa después de la revisión clínica de Karla, una vez anotada en `src/data/revisionClinica.js` y en `REVISION_VADEMECUM`. Antes de eso, las páginas están en `noindex` y no deben enviarse a los buscadores.

## 1. Comprobar en producción

Para cada URL, verificar que responda 200, con `index,follow` y canónica propia (regla 6 del prompt maestro).

## 2. IndexNow (Bing), un solo envío

Se ejecuta desde un equipo que llegue a edvanta.co. El script lee el sitio, y el entorno de Claude Code en la nube no resuelve ese dominio.

```bash
node scripts/indexnow.mjs --rutas=/vademecum/medicamentos-para-el-dolor-y-la-inflamacion,/vademecum/meloxicam,/vademecum/etoricoxib,/vademecum/celecoxib,/vademecum/ketorolaco,/vademecum/dipirona,/vademecum/tramadol,/vademecum/metocarbamol,/vademecum/diclofenaco,/vademecum/ibuprofeno,/vademecum/naproxeno,/vademecum/acetaminofen,/articulos/meloxicam-para-que-sirve,/articulos/etoricoxib-para-que-sirve,/articulos/celecoxib-para-que-sirve,/articulos/ketorolaco-para-que-sirve,/articulos/dipirona-para-que-sirve,/articulos/tramadol-para-que-sirve,/articulos/metocarbamol-para-que-sirve
```

## 3. Search Console: solicitudes de indexación (unas 10 al día, con aprobación de Karla)

Las solicitudes van en orden de demanda, según Semrush Colombia del 16-nov:

| Día | URL | Por qué |
|---|---|---|
| 1 | `/articulos/meloxicam-para-que-sirve` | «meloxicam» 74.000 y «para qué sirve» 60.500 búsquedas al mes |
| 1 | `/articulos/etoricoxib-para-que-sirve` | «etoricoxib» 90.500 al mes |
| 1 | `/articulos/metocarbamol-para-que-sirve` | 49.500 al mes, más unas 14.000 de «con ibuprofeno» |
| 1 | `/articulos/dipirona-para-que-sirve` | 33.100 al mes |
| 1 | `/articulos/celecoxib-para-que-sirve` | 27.100 al mes |
| 1 | `/articulos/tramadol-para-que-sirve` | 22.200 al mes |
| 1 | `/articulos/ketorolaco-para-que-sirve` | 14.800 al mes |
| 1 | `/vademecum/medicamentos-para-el-dolor-y-la-inflamacion` | Página del grupo: enlaza las 11 monografías |
| 1 | `/vademecum/meloxicam` | Monografía con mayor demanda |
| 1 | `/vademecum/etoricoxib` | |
| 2 | Las otras 9 monografías del grupo | |

## 4. Medir

Cada lunes, en `seo/medicion.md`: consultas con impresiones del grupo (expresión regular en `seo/vademecum-dolor-inflamacion.md`) y keywords orgánicas en Semrush.
