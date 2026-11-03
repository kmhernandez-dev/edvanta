# Checkpoint pedagógico · Aula Edvanta

Fecha: **2026-11-03**
Fase: **A · infraestructura pedagógica compartida** cerrada y probada; **CRM y seguimiento** implementados; **B · contenido del resto del catálogo** pendiente.
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

## 5. Entornos

- **PGlite / pruebas:** 063, 064 y 065 aplicadas y probadas.
- **Aula local:** 063, 064 y 065 aplicadas; servidor iniciado.
- **Producción / Coolify:** no se accedió; 064 y 065 **no aplicadas**. 063 no se versiona en el repositorio público.
- El migrador real aplicará 064 y 065 en el siguiente arranque del servicio API. 063 debe aplicarse desde almacenamiento privado después de la revisión especializada; eso no se verificó en el entorno objetivo.

## 6. Qué queda pendiente

1. **Aplicar 064 y 065 en producción** y verificar el historial de migraciones y las tablas resultantes. 063 queda en almacenamiento privado hasta la revisión de BPM.
2. **Prueba E2E de navegador** (Playwright u equivalente) para las rutas y la interacción visual; no se ejecutó.
3. **Revisión especializada de BPM**: `REVISION-ESPECIALIZADA-BPM.md` está preparada, pero no firmada. No se atribuye a un experto inexistente.
4. **Publicación de BPM**: sigue en borrador; requiere la revisión anterior y la decisión académica.
5. **Fase B**: BPE y el resto del catálogo. Quedan **51 cursos, 249 unidades y 1.610 clases** sin la capa pedagógica completa.
6. **Visibilidad del repositorio**: el repositorio es público. `contenido/aula/bpm/`, la migración 063, `bpm-pedagogia.test.js` y `bpm-vista-previa.html` contienen claves o guías docentes y quedaron **ignorados por git** en esta sesión. Falta moverlos a almacenamiento privado y definir cómo se aplicará 063 sin publicarla.

## 7. Punto exacto de continuación

- Siguiente curso: **BPE y preparaciones magistrales**.
- Crear `contenido/aula/bpe/` con el mismo esquema de `contenido/aula/bpm/`.
- Revisar las 9 clases de la migración 034 y las fuentes de la 038; conservar enlaces válidos y documentar los no verificables.
- Repetir el ciclo: validar paquete → generar migración → probar API → comprobar UI → checkpoint.
- No se declara completo el catálogo.

