# Checkpoint pedagógico · Aula Edvanta

Fecha: **2026-11-03**
Fase: **A · infraestructura pedagógica compartida** cerrada y probada; **CRM y seguimiento** implementados; **B · contenido del catálogo** en curso: lote 1 (BPM) publicado, **lote 2 (BPE) preparado en borrador y sin aplicar en producción**.
Informe funcional: `INFORME-CORRECCION-FUNCIONAL.md`.

## 1. Inventario del catálogo

Generado con:

```bash
node scripts/auditar-catalogo-aula.mjs
```

| Indicador | Total |
|---|---:|
| Cursos | 52 |
| Unidades | 252 |
| Clases | 1.619 |
| Clases con video | 752 |
| Clases sin video | 867 |
| Evaluaciones antes del lote | 0 |
| Actividades antes del lote | 0 |
| Foros antes del lote | 0 |

Detalle: `inventario-cursos.md`, `inventario-clases.csv`, `inventario.json`.

Lectura del inventario:

- Solo Farmacoterapia tenía texto relativamente desarrollado; ninguna clase llegaba a 700 palabras.
- 1.116 clases tenían menos de 60 palabras de texto.
- Los 5 cursos base (BPM, BPE, Central de mezclas, INVIMA y Validaciones) tenían 9 clases cada uno.
- Los 42 cursos de 042–045 y 055 tenían estructura, videos y enlaces, pero no instrumentos de evaluación.
- Autocuidado de la tiroides es el único curso para pacientes: 8 clases con video y sin texto de apoyo.

## 2. Fase A · funciones compartidas implementadas

| Función | Estado | Evidencia |
|---|---|---|
| Rol `docente` y asignación por curso | Implementado | Migración 064, `aula_course_teachers`, pruebas de administración |
| Pesos por quiz, actividad y foro | Implementado | Columnas `weight`, política 60/30/10 en BPM |
| Quizzes del estudiante | Implementado | Inicio, guardado, recarga, envío, calificación y segundo intento |
| Claves privadas | Implementado | `served` del intento; sin `correctOptionId`/`isCorrect` antes del envío |
| Doble envío y concurrencia | Implementado | Transacción, `FOR UPDATE`, índice de intento abierto; repetir devuelve el resultado guardado |
| Actividades y entregas | Implementado | Borrador, versión, revisión, devolución, consulta y adjuntos privados |
| Foros | Implementado | Publicación raíz, respuestas, autoría, persistencia y ocultamiento docente |
| Vista docente | Implementado | Cursos asignados, estudiantes, entregas, intentos, foros y nota |
| Progreso separado de nota | Implementado | `progress.js` + `pedagogia-core.js`; contadores por tipo |
| Nota y aprobación | Implementado | Fórmula ponderada, pendientes sin renormalizar, umbral 70 |
| Cursos sin evaluación | Compatibles | Conservan el cálculo anterior por clases; `final_score` nulo |
| Configuración parcial | Detectada | `configOk` falso y advertencia; no se aprueba |
| Identidad CRM estable | Implementado | `crm_code` `EDV-U-000123` generado por trigger; migración 065 |
| Clasificación y seguimiento | Implementado | Segmento, etiquetas, origen y notas; `/aula/admin/seguimiento` |
| Exportación CSV | Implementado | `/api/aula/admin/crm/export`; sin contraseñas ni tokens |

Rutas principales:

- Estudiante: `/aula/:curso/evaluacion`, `/evaluacion/quiz/:id`, `/evaluacion/actividad/:id`, `/evaluacion/foro/:id`.
- Docente: `/aula/docente`, `/aula/docente/curso/:id`, `/aula/docente/entrega/:id`, `/aula/docente/foro/:id`.
- Administración: `/aula/admin/cursos/:id/docentes`, `/aula/admin/participantes`, `/aula/admin/seguimiento`.

## 3. Lote 1 · BPM

Curso: **Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica**.

| Elemento | Estado |
|---|---|
| Unidades | 3 |
| Clases | 9 |
| Texto por clase | 1.504–1.721 palabras renderizadas |
| Clases con video complementario | 2 (videos largos, no obligatorios) |
| Clases sin video con texto ampliado | 7 |
| Quizzes | 3 (4 preguntas cada uno; 12 en total) |
| Opciones | 48 (4 por pregunta; una sola clave) |
| Actividades | 3 (informe, procedimiento y plan CAPA) |
| Foros | 3 |
| Rúbricas | 5–6 criterios por actividad; pesos internos 100 % |
| Pesos del curso | Actividades 60 % · Quizzes 30 % · Foros 10 % |
| Aprobación | 70/100 |
| Intentos | 2; se conserva la mejor nota |
| Estado | **Borrador**. No publicado. |

Contenido fuente:

- `contenido/aula/bpm/index.mjs`, `unidad1.mjs`, `unidad2.mjs`, `unidad3.mjs`, `render.mjs`.
- `api/migrations/063_pedagogia_bpm.sql`: contenido, quizzes, actividades y foros. **No se versiona** en el repositorio público porque contiene claves; permanece en almacenamiento privado.
- `api/migrations/064_pedagogia_funcional.sql`: rol docente, pesos, política de nota, borradores, revisión y notas de foro.
- `api/tests/bpm-pedagogia.test.js`: estructura, 4 preguntas/4 opciones, claves, rúbricas, política 60/30/10 y doble aplicación de 063/064. Se ejecuta en local con el paquete privado; no se versiona.

Fuentes verificadas con HTTP 200 el 2026-11-03: Resolución 1160 de 2016, OMS TRS 986 Anexo 2, Decreto 677 de 1995, ICH Q9(R1), ICH Q10 y FDA Data Integrity. USP devolvió 403 y se excluyó como enlace.

Videos: los dos existentes (53 y 61 minutos) son complementarios; las 9 clases quedaron con `completion_rule = 'manual'`. No se afirma haberlos reproducido.

## 3b. Lote 2 · BPE y preparaciones magistrales

Curso: **Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales** (en producción sigue en borrador).

| Elemento | Estado |
|---|---|
| Unidades | 3, con descripción nueva |
| Clases | 9, todas **sin video principal**: 1.511–1.946 palabras renderizadas; cada una con caso, 2 ejemplos resueltos, figura, mapa, errores, práctica y práctica adicional con solución, síntesis y 4–5 fuentes |
| Tipos | 1 conceptual · 3 procedimentales · 3 analíticas · 2 mixtas |
| Videos complementarios | 2: EFEsalud `QCGnnSDFgk0` (clase 1, tramo 3:10–5:40, contexto español) y Hospital Departamental de Villavicencio `9dEGNB5MlsA` (clase 9, tramo 2:13–4:39, con advertencia sobre su confusión entre «serio» e «inesperado»). Se revisó su transcripción automática en el navegador; no se afirma haberlos reproducido completos |
| Quizzes | 3 × 4 preguntas × 4 opciones (12 y 48); 11 de 12 en nivel Aplicar o Analizar; retroalimentación por opción; la clave ya no es siempre la opción más larga |
| Actividades | 3 (dictamen de admisión; guía, registro y etiqueta; plan de calidad y respuesta a una queja), rúbricas de 5 criterios con niveles 4–0, guía docente en `teacher_guide_html` |
| Foros | 3, con propósito, pregunta central, 3 preguntas de profundización, alternativa sin participantes y rúbrica de 3 criterios |
| Pesos | Actividades 20/20/20 · quizzes 10/10/10 · foros 3,34/3,33/3,33 = 60/30/10; aprobación 70; 2 intentos |
| Estado | Quizzes, actividades y foros en **borrador**; curso sin publicar |

Correcciones frente a 034 y 038:

- Se retiró «no se copia un medicamento con registro sanitario disponible», atribuida a la Resolución 1403: la norma no lo dice así. El Manual (numeral 2.1) orienta la figura a la necesidad individual del paciente; el proyecto de circular del Invima de junio de 2026 se presenta como **proyecto no expedido**.
- «Oficinal» se explica como figura de otras legislaciones (Real Decreto Legislativo 1/2015 de España); no está en las normas colombianas del servicio farmacéutico.
- El enlace rotulado «OMS · Informe 32, Anexo 2» apuntaba a TRS 986; el agua se apoya ahora en TRS 1033, anexo 3.
- La Resolución 444 remite al Decreto 549 de 2001, derogado por el Decreto 335 de 2022: se enseña como ejemplo de cita corregida.
- Los destacados y enlaces de 038 se sustituyen por la clase completa y por enlaces verificados.

Fuentes verificadas el 2026-11-03 (200 o lectura en navegador): Decreto 2200 de 2005, Decreto 2330 de 2006, Resolución 1403 de 2007, Resolución 444 de 2008, Decreto 335 de 2022 (normograma del Invima); proyecto de circular del Invima (descarga 145079); alerta del Invima del 14 de mayo de 2026 sobre magistrales falsificados; página del capítulo 795 de la USP (403 a descargas automáticas, verificada en navegador), sus preguntas frecuentes oficiales y las diapositivas USP del seminario NABP de 2023 (Tabla 4); OMS TRS 1033, anexo 3; ICH E2A; página de farmacovigilancia y lineamientos de VigiFlow del Invima; BOE (RDL 1/2015).

Videos descartados: SENA `RaOT4ySpwjs` (1:58; su transcripción habla de «preparación anticipada» y de que el farmacéutico «se limita a seguir las fórmulas»), `iZ1Q7vFeE98`, `toAlivttS7k`, `759Lhv8JhDA`, `4ZZhudFiyHU`, `itf2TBE7XrQ`, `tZz_MvhXOps` y `6uukdnkDuOM` (afirmaciones sin sustento, contenido no verificable, autoría personal o contexto promocional).

Archivos:

- **Privados** (ignorados por git): `contenido/aula/bpe/`, `api/migrations/067_pedagogia_bpe.sql`, `api/tests/bpe-pedagogia.test.js`, `docs/auditoria-aula/bpe-vista-previa.html`.
- **Públicos**: `contenido/aula/comun/render.mjs` (plantillas del esquema 2), `scripts/paquete-aula.mjs` (validar, migración y vista previa), `docs/auditoria-aula/validacion-bpe.md` y el filtro de `api/scripts/aula-dev.js`, que aplica 067 en local si existe.

Protecciones de 067: crea los recursos en borrador; si ya existen, no cambia su estado; no toca preguntas de un quiz con intentos, ni rúbricas o pesos de actividades con entregas o foros con notas; no cambia nota mínima, intentos ni política de un curso con matrículas. La prueba privada lo comprueba.

Limitaciones: `aula_forums` no tiene una columna privada para la guía de moderación; queda en el paquete y en la vista previa docente. La revisión especializada de BPE no está hecha.

## 4. Validaciones ejecutadas

| Comprobación | Resultado |
|---|---|
| `npm.cmd run test:api` | **215/215** pruebas en 20 archivos |
| `npx.cmd vitest run --config vitest.config.js` | **139/139** pruebas de frontend |
| `npm.cmd run build` | Compilación correcta; 1.577 módulos; postbuild correcto |
| `node --check` backend | Sintaxis correcta |
| `vite preview` rutas directas | 200 en `/aula`, `/aula/docente` y las cuatro rutas de evaluación |
| `api/scripts/aula-dev.js --reset` | Migraciones hasta 065 aplicadas; servidor local iniciado |
| Caso de nota | Actividades 80/90/70 + quizzes 100/75/50 + foros 80 = **78,5/100** |
| Adjuntos | PDF autorizado; descarga propia y docente; descarga ajena rechazada; `.html` rechazado |
| Doble aplicación 063/064/065 | Sin duplicar evaluaciones, preguntas, opciones, actividades, foros ni códigos CRM |
| CRM | `crm_code`, segmento, etiquetas, filtros y export CSV cubiertos por prueba de API |
| `node scripts/paquete-aula.mjs bpe validar` (lote 2) | 0 errores, 0 avisos |
| `api/tests/bpe-pedagogia.test.js` (lote 2) | **8/8**: estructura, videos, 4 × 4 con una clave, rúbricas, campos privados, idempotencia y protecciones |
| `npm.cmd test` (lote 2) | **139/139** de frontend y **239/239** de API en 22 archivos |
| `npm.cmd run build` (lote 2) | Correcto; postbuild correcto |
| Aula local (lote 2) | 067 aplicada; vista previa del borrador con tablas, figuras, desplegables y video; sin desborde a 375 px; 9 recursos en borrador en el panel de autoría |

## 5. Entornos

- **PGlite / pruebas:** 063, 064 y 065 aplicadas y probadas.
- **Aula local:** 063, 064 y 065 aplicadas; servidor iniciado.
- **Producción / Coolify:** 064 y 065 aplicadas por el migrador; 063 aplicada manualmente desde un artefacto temporal privado. Curso BPM publicado.
- El repositorio público sigue sin 063. Para reconstruir la base desde cero hay que aplicar 063 desde almacenamiento privado antes de publicar BPM.
- **BPE (067):** aplicada en PGlite y en el aula local. **No aplicada en producción**: falta decidir con el propietario por qué canal privado se aplica (no se reutilizó el gist sin autorización).

## 6. Qué queda pendiente

1. **Conservar 063 en almacenamiento privado** para reconstrucciones futuras; ya se aplicó en producción y el curso BPM quedó publicado.
2. **Prueba E2E de navegador** (Playwright u equivalente) para las rutas y la interacción visual; no se ejecutó.
3. **Revisión especializada de BPM**: `REVISION-ESPECIALIZADA-BPM.md` está preparada, pero no firmada. No se atribuye a un experto inexistente.
4. **BPM**: publicado el 2026-11-03 a solicitud del propietario. La revisión especializada sigue pendiente y debe completarse antes de promoverlo comercialmente.
5. **Fase B**: con BPE preparado, quedan **50 cursos, 246 unidades y 1.601 clases** sin la capa pedagógica completa.
6. **Visibilidad del repositorio**: el repositorio es público. `contenido/aula/bpm/`, la migración 063, `bpm-pedagogia.test.js` y `bpm-vista-previa.html` contienen claves o guías docentes y quedaron **ignorados por git**. 063 se aplicó en producción desde un artefacto temporal privado y se eliminó; el paquete debe conservarse en almacenamiento privado para futuras reconstrucciones.
7. **BPE**: aplicar 067 en producción por un canal privado autorizado; publicar los 9 recursos y luego el curso desde el panel de autoría; revisión especializada antes de promoverlo.

## 7. Punto exacto de continuación

- Siguiente curso: **Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad** (9 clases en 034; fuentes en 038).
- Crear `contenido/aula/central-mezclas/` con el esquema 2 de `contenido/aula/bpe/` (`index.mjs` con `PAQUETE`, `fuentes.mjs`, `unidad1-3.mjs`), añadirlo a `.gitignore` junto con su migración (068), su prueba y su vista previa.
- Ciclo: `node scripts/paquete-aula.mjs central-mezclas todo` → prueba privada en PGlite → `npm.cmd test` y build → aula local → checkpoint.
- Lo estéril que BPE remite a Central de Mezclas (clase 3) debe quedar cubierto allí: áreas limpias, grados A–D, flujo laminar, USP 797.
- No se declara completo el catálogo.

## 8. Despliegue del 2026-11-03

- Commit `aaa6b32` desplegado en Coolify; deployment `bg3nkuksngc3aailfpxubtv2` finalizado a las 17:46 UTC.
- `https://edvanta.co/`, `/api/health` y `/api/health/db` responden 200.
- Las rutas nuevas de CRM responden 401 sin sesión y los chunks `Seguimiento`, `QuizCurso` y `DocenteCurso` responden 200.
- 064 y 065 se ejecutan en el arranque del servicio API. No se consultó `_migrations` directamente en producción.
- 063 se aplicó manualmente a las 18:39 UTC desde un artefacto temporal privado (gist no listado, eliminado después). El curso BPM quedó **publicado** (versión 2), con 3 quizzes, 3 actividades y 3 foros.
- La ficha pública `https://edvanta.co/curso-de-bpm-en-la-industria-farmaceutica` responde 200 y muestra 3 unidades y 9 clases.
- Los almacenamientos temporales de Coolify y el gist se eliminaron; 063 no está en el repositorio. La revisión especializada de BPM sigue pendiente.

