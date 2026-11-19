# Despliegue del catálogo completo — 19 de noviembre de 2026

## 1. Qué se despliega

| Dato | Valor |
|---|---|
| Aplicación | `edvanta-stack` (web + api) |
| UUID | `kcwkog40gooc48csc80ck808` |
| Repositorio | `kmhernandez-dev/edvanta` |
| Rama | `main` |
| Build pack | Docker Compose (`docker-compose.yaml`) |
| Dominio público | `https://edvanta.co` |
| Servidor | Coolify localhost (`oo8gcwo4scck04ogwkc4kkok`) |
| Estado previo | `running:healthy` |

El despliegue publica el contenido y las migraciones del catálogo. Las migraciones corren automáticamente al arrancar la API (`api/lib/migrate.js`).

## 2. Cambios incluidos

### Contenido de clases

- `164_experiencias_calidad_1.sql` a `173_experiencias_alimentos.sql`: **1.184 experiencias de clase** en 38 cursos, construidas con el resumen de la clase, el quiz, la actividad, el foro y los enlaces verificados.
- `177_experiencias_alimentos_quiz.sql`: las 15 clases de Manipulación de Alimentos se regeneran con su quiz, actividad y foro reales.
- `179_ajustes_experiencias.sql`: corrección de «de el» → «del» y opciones de caso propias de farmacología, central de mezclas y alimentos.

### Videos

- `174_videos_catalogo.sql`: **32 videos por clase** verificados con oEmbed.
- `178_videos_cursos_sin_video.sql`: **video de unidad** para los 8 cursos que no tenían ningún video (Asuntos Regulatorios Farmacéuticos, Bioequivalencia, Fitoterapéuticos, Homeopáticos, Gases Medicinales, Vitales No Disponibles, Psicofarmacología y Manipulación de Alimentos).
- `api/lib/videos-youtube.json`: canal, URL y fecha de consulta de los videos nuevos.

### SEO y títulos

- `176_renombrar_clases_homonimas.sql`: títulos únicos para las clases que se repetían (`Introducción a la unidad`, `Introducción al curso`, `Tiazidas y similares…`). Sin títulos repetidos, la página pública puede distinguir cada clase.

### Auditoría

- `scripts/auditar-catalogo-aula.mjs`: auditoría reproducible con texto, experiencias, videos y evaluaciones. Ahora también cuenta videos únicos por curso.
- `docs/auditoria-aula/inventario-cursos.md`, `inventario-clases.csv` e `inventario.json`: inventario completo.
- `docs/auditoria-aula/auditoria-pedagogica-2026.md`: informe pedagógico y plan de lanzamiento.
- `docs/auditoria-aula/plan-experiencias.json` y `videos-propuestos.json`: cobertura y candidatos de video.

### Herramientas

- `scripts/generar-experiencias-catalogo.mjs`
- `scripts/lib/experiencias-automaticas.mjs`
- `scripts/curar-videos-aula.mjs`
- `scripts/videos-cursos-sin-video.mjs`

## 3. Verificación previa

| Verificación | Resultado |
|---|---|
| Migraciones aplicadas en PostgreSQL en memoria | 177 |
| Cursos | 63 |
| Unidades | 297 |
| Clases | 1.714 |
| Clases con texto completo | 1.714 (100 %) |
| Experiencias interactivas | 1.551 |
| Texto largo propio | 163 |
| Palabras de contenido | 2.692.847 |
| Clases con video | 1.113 |
| Clases sin video | 601 |
| Videos únicos en el catálogo | 866 previos + nuevos |
| Evaluaciones / preguntas | 293 / 1.172 |
| Actividades / foros | 301 / 344 |
| Pruebas API | 507/507 |
| Build frontend | Correcto |
| Prerender | 719 páginas fijas, 517 artículos, 13 retos |
| Sitemap | 1.229 URLs únicas |

## 4. Secuencia de despliegue

1. Commit y push a `main`.
2. Coolify recibe el push (auto-deploy activo) y reconstruye `web` y `api`.
3. Al arrancar `api`, `runMigrations()` aplica las migraciones nuevas en orden.
4. `startAula()` publica las versiones aprobadas de los cursos que ya estaban publicados y deja los demás en borrador.
5. `web` sirve el nuevo build; `/api/*` pasa por nginx al contenedor `api`.
6. Verificación: `/health`, `/api/health`, `/api/health/db` y una página pública de clase.

## 5. Riesgos y límites

- **Revisión académica pendiente.** Las 1.184 experiencias generadas son un borrador editorial completo, no contenido validado por la dirección académica. Deben revisarse antes de una campaña de venta.
- **Publicación.** Los cursos que ya estaban publicados pueden recibir una versión nueva con las experiencias; los que están en borrador siguen en borrador. Este despliegue no cambia precios ni estados.
- **Video.** 601 clases siguen sin video. Los 8 cursos que no tenían ninguno usan un video de unidad; conviene reemplazarlo por videos específicos en los cursos prioritarios.
- **Rollback.** Volver a un commit anterior revierte el código, pero las migraciones 164–179 ya aplicadas no se deshacen solas: son aditivas y dejan datos. Cualquier reversión de contenido debe hacerse con una migración nueva.
- **Tamaño.** Las migraciones nuevas suman cerca de 18 MB; el primer arranque de la API después del despliegue puede tardar más de lo habitual.

## 6. Resultado

Se registra al finalizar la verificación posterior al despliegue: ID de despliegue, estado, salud de la API y primera clase pública comprobada.
