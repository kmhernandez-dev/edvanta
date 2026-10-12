# Catálogo de cursos — qué hay y qué falta

Medido contra producción el 12 de octubre de 2026, antes de rehacer las fichas.
Sirve para saber qué puede enseñar una ficha sin inventarse nada.

## Cuántos cursos hay

**224 en total**, no los ~300 del encargo:

| Origen | Cursos |
|---|---:|
| Propios de Edvanta (`aula_courses`) | 48 |
| Edutin | 101 |
| Coursera | 42 |
| Udemy | 33 |
| **Total** | **224** |

**Coursera es un cuarto proveedor** que el encargo no menciona (habla de propios, Edutin
y Udemy). Son 42 cursos y necesitan el mismo trato que los otros externos.

## Qué datos tiene cada origen

### Propios (48) — los únicos con contenido de verdad

Tienen unidades, clases, videos, documentos oficiales y clases en texto. Les falta:

- **Portadas**: 19 de 48 tienen. Faltan 29 (los 10 de Calidad, 10 de Regulatorios y
  los 3 de biológicos, más los 6 anteriores salvo alguno).
- **`learning_outcomes`** (el «qué aprenderás»): vacío en los 42 cursos sembrados. El
  archivo de curaduría no lo traía como lista; traía un objetivo general por curso.
- **Duración por clase**: no viene en los archivos. Solo hay duración del curso (20 h).

### Edutin (101) — metadatos básicos, sin temario

| Campo | Con dato |
|---|---:|
| Descripción corta | 101 / 101 |
| Enlace al curso | 101 / 101 |
| ID del proveedor | 101 / 101 |
| Institución | 101 / 101 |
| **Portada** | **8 / 101** |
| **Duración** | **8 / 101** |
| **Competencias** | **8 / 101** |
| **Docente** | **0 / 101** |
| Temario | no existe |

### Coursera (42) y Udemy (33) — prácticamente solo el título

| Campo | Coursera | Udemy |
|---|---:|---:|
| Descripción corta | 0 / 42 | 0 / 33 |
| Enlace canónico | 0 / 42 | 0 / 33 |
| ID del proveedor | 0 / 42 | 0 / 33 |
| Institución | 10 / 42 | 0 / 33 |
| Portada, duración, competencias, docente | 0 | 0 |

Lo único que tienen es un **enlace de afiliado opaco** (`imp.i384100.net/zzqmQr`,
`trk.udemy.com/enBPG6`), que no identifica el curso y puede cambiar. El propio encargo
dice que no se identifique un curso por un enlace de afiliado.

**Consecuencia:** para estos 75 cursos una ficha «completa» solo se puede llenar
inventando. No se hace. La ficha los muestra con lo que hay y dice claramente que el
detalle está en el proveedor.

## Dos datos que parecen información y no lo son

- **`certificate_included` es `true` en los 176 externos.** No es un dato verificado: es
  el valor por defecto de la columna. No hay fecha de verificación ni fuente. Por eso la
  ficha trata la certificación de los externos como **«por confirmar»** y no anuncia ni
  gratuidad ni cobro.
- **`rating` y `review_count` están vacíos en los 176.** No hay valoraciones de
  proveedor que mostrar, ni siquiera con atribución.

## Qué hace falta para completar las fichas

Por orden de cuánto cambian lo que ve una persona:

1. **Portadas**: 29 propios y 168 externos sin imagen.
2. **Enlace canónico e ID** de los 75 de Coursera y Udemy.
3. **Descripción** de esos mismos 75.
4. **`learning_outcomes`** de los 42 cursos propios sembrados.
5. **Duración por clase** en los cursos propios.
6. **Condiciones reales de certificación** por proveedor, con fecha y fuente.
