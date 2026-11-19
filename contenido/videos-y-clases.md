# Videos y clases en texto de los cursos propios

Pedido de Karla (19-nov-2026):

- Curar los cursos que no tienen videos: buscarlos en YouTube y ponerlos en cada clase.
- Escribir las clases en texto siguiendo el curso de Farmacoterapia de la Diabetes.
- Usar primero los videos de Edutin Academy (https://www.youtube.com/@edutinacademy).

## El modelo: Farmacoterapia de la Diabetes

Cada clase (menos las de caso) trae, en este orden:

1. **Video** de YouTube, con el crédito del canal y la licencia estándar de YouTube.
2. **En esta clase:** qué se verá y el objetivo.
3. **La clase en texto:** 400 a 500 palabras con el desarrollo del tema.
4. **Ejemplo aplicado:** una situación real en Colombia.
5. **Puntos clave:** tres a cinco.
6. **Nota de actualización,** cuando la hay, con su fecha.
7. **Para profundizar:** documentos oficiales y artículos con DOI. Cada enlace se abre antes de publicarlo.

Las clases de caso no llevan video.

## Estado al 19-nov-2026

| | Clases |
|---|---:|
| Clases sin video, sin contar las de caso | **661** en 41 cursos, después de este lote |
| Clases con texto de resumen (unas 20 palabras), no la clase completa | **1.382** en 44 cursos |
| Videos ya publicados que YouTube reporta rotos (retirados o sin permiso de inserción) | 7 |

Los cursos de Farmacología, Regulatorios y Calidad se diseñaron con el video como formato principal: su «clase en texto» es una frase. Por eso el video es lo primero; el texto completo es el segundo paso.

### Hecho en este lote

| Curso | Videos | Migración | Fuentes |
|---|---:|---|---|
| Manipulación de Alimentos | 15 de 15 | `166_videos_manipulacion_de_alimentos.sql` | Edutin Academy en la 1.1 (su único video del tema: el curso completo). El resto: Secretaría de Salud de Zipaquirá (serie *Claves de la Inocuidad*), Municipalidad de Salta, Universidad Nacional del Litoral, FEHGRA y asociaciones del sector |
| Psicofarmacología | 28 de 28 (las 5 de caso no llevan) | `167_videos_psicofarmacologia.sql` | 9 de Edutin Academy (*Curso de farmacología clínica*). El resto: OMS/OPS, Universidad de Valladolid, Universidad Miguel Hernández, Hospital Sant Joan de Déu, Salud Navarra, MIR Asturias y docentes de medicina |

## Cómo se hace (para cada curso)

1. **Buscar primero en Edutin Academy:** `site:youtube.com "Edutin Academy" <tema>`. Edutin nombra sus clases «<tema> - Curso de <x>».
2. **Si Edutin no tiene el tema,** buscar en este orden:
   - autoridades: INVIMA, MinSalud, OMS/OPS, secretarías de salud;
   - universidades y hospitales;
   - docentes con nombre y profesión visibles.

   Solo videos en español. Nunca un canal que venda el producto del que habla.
3. **Verificar cada video** con el oEmbed oficial de YouTube: debe responder 200 (disponible e insertable). Se anotan el canal y el título.
4. **Escribir** `scripts/datos/videos-clases/<curso>.json` con el título exacto de cada clase.
5. **Generar la migración:** `node scripts/generar-videos-clases.mjs scripts/datos/videos-clases/<curso>.json`.
6. **Actualizar el crédito de los canales:** `node scripts/videos-youtube.mjs`.
7. **Probar:** `npm test` incluye `api/tests/videos-clases.test.js` y la migración completa sobre una base vacía.

Los videos se eligen por título, descripción y canal, y la verificación confirma que existen y se pueden insertar. **Nadie los vio completos.** Antes de anunciar un curso conviene que el equipo docente revise que cada video corresponda a su clase. Si uno no sirve, se cambia en el JSON y se genera una migración nueva.

## Decisión comercial que hay que vigilar

Los videos de Edutin Academy invitan a sacar el certificado en Edutin (sus títulos dicen «[Gratis y certificado]»). Dentro de un curso donde Edvanta vende su propio certificado, pueden desviar la compra. Edutin es aliado de afiliados de Edvanta, así que esa venta no se pierde del todo, pero vale menos.

**Qué medir:** la conversión de inscripción a certificado pagado de Psicofarmacología y Manipulación de Alimentos frente al resto, en el tablero del agente (`/api/admin/agente/tablero`). Si cae, se reemplazan los videos de Edutin por los institucionales que ya están identificados.

## Cola de videos pendientes (sin contar las clases de caso)

| # | Curso | Clases | Sin video (sin contar casos) | Palabras por clase (mediana) |
|---:|---|---:|---:|---:|
| 1 | Curso de Regulación de Medicamentos Homeopáticos | 35 | 29 | 22 |
| 2 | Curso de Regulación Sanitaria de Gases Medicinales | 33 | 28 | 20 |
| 3 | Curso de Importación de Medicamentos Vitales No Disponibles | 33 | 28 | 22 |
| 4 | Curso de Asuntos Regulatorios Farmacéuticos en Colombia | 33 | 27 | 23 |
| 5 | Curso de Bioequivalencia y Requisitos Regulatorios en Colombia | 34 | 27 | 22 |
| 6 | Curso de Registro Sanitario de Productos Fitoterapéuticos | 31 | 26 | 25 |
| 7 | Curso de Registro Sanitario de Medicamentos Biológicos | 34 | 24 | 21 |
| 8 | Curso de Respuesta a Requerimientos del INVIMA | 33 | 23 | 22 |
| 9 | Curso de Registro Sanitario de Medicamentos ante el INVIMA | 35 | 22 | 23 |
| 10 | Curso de Renovación de Registros Sanitarios de Medicamentos | 32 | 21 | 28 |
| 11 | Curso de Etiquetado e Insertos de Medicamentos | 33 | 21 | 24 |
| 12 | Curso de Registro Sanitario de Suplementos Dietarios | 32 | 21 | 16 |
| 13 | Curso de Modificaciones al Registro Sanitario de Medicamentos | 35 | 20 | 21 |
| 14 | Curso de Gestión Documental de Trámites ante el INVIMA | 34 | 20 | 23 |
| 15 | Curso de Registro Sanitario de Vacunas | 35 | 20 | 25 |
| 16 | Curso de Regulación Sanitaria del Cannabis Medicinal en Colombia | 35 | 19 | 23 |
| 17 | Curso de Asuntos Regulatorios de Radiofármacos | 34 | 18 | 19 |
| 18 | Curso de Regulación de Medicamentos Biosimilares | 34 | 17 | 24 |
| 19 | Curso de Farmacología del Sistema Nervioso Central | 34 | 17 | 24 |
| 20 | Curso de Farmacología Gastrointestinal | 40 | 17 | 27 |
| 21 | Curso de Buenas Prácticas de Manufactura — BPM | 35 | 16 | 21 |
| 22 | Curso de Elaboración de Dossiers Farmacéuticos | 31 | 16 | 22 |
| 23 | Curso de Estudios de Estabilidad para el Registro de Medicamentos | 33 | 14 | 26 |
| 24 | Curso de Inmunoterapia Oncológica | 33 | 13 | 22 |
| 25 | Curso de Farmacología Endocrina | 35 | 12 | 21 |
| 26 | Curso de Farmacología Renal | 35 | 11 | 24 |
| 27 | Curso de Farmacología Cardiovascular | 33 | 9 | 25 |
| 28 | Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad | 9 | 8 | 91 |
| 29 | Asuntos Regulatorios Sanitarios ante INVIMA | 9 | 8 | 84 |
| 30 | Curso de Buenas Prácticas de Laboratorio — BPL | 35 | 8 | 20 |
| 31 | Curso de Farmacología Oncológica | 31 | 8 | 22 |
| 32 | Curso de Farmacología Respiratoria | 32 | 8 | 24 |
| 33 | Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica | 9 | 7 | 1651 |
| 34 | Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales | 9 | 7 | 1715 |
| 35 | Curso de Terapias Dirigidas en Oncología | 34 | 7 | 22 |
| 36 | Validaciones y Calificaciones en la Industria Farmacéutica | 9 | 6 | 95 |
| 37 | Curso de Gestión de Riesgos en la Calidad Farmacéutica | 33 | 6 | 494 |
| 38 | Curso de Quimioterapia Antineoplásica | 32 | 6 | 24 |
| 39 | Curso de Farmacología de Anticoagulantes y Antiagregantes | 33 | 6 | 18 |
| 40 | Curso de Farmacoterapia de la Diabetes | 40 | 5 | 430 |
| 41 | Curso de Farmacoterapia de la Insuficiencia Cardíaca | 39 | 5 | 498 |
| 42 | Curso de Farmacoterapia del Asma y la EPOC | 38 | 5 | 451 |
| 43 | Curso de Control de Calidad de Medicamentos | 35 | 4 | 19 |
| 44 | Curso de Auditoría de Calidad Farmacéutica | 32 | 4 | 433 |
| 45 | Curso de Gestión de Desviaciones y Acciones Correctivas y Preventivas — CAPA | 35 | 4 | 22 |
| 46 | Curso de Farmacoterapia de la Hipertensión Arterial | 37 | 4 | 446 |
| 47 | Curso de Gestión de Calidad Farmacéutica | 35 | 3 | 21 |
| 48 | Curso de Aseguramiento de la Calidad Farmacéutica | 35 | 3 | 19 |
| 49 | Curso de Buenas Prácticas de Documentación Farmacéutica | 30 | 2 | 20 |
| 50 | Curso de Validación de Métodos Analíticos | 33 | 1 | 20 |

### Orden recomendado

1. **Asuntos Regulatorios Farmacéuticos en Colombia** y los de registro sanitario ante el INVIMA. Son la búsqueda pilar de la escuela de Asuntos Regulatorios. El canal oficial del INVIMA tiene webinars de trámites.
2. **Bioequivalencia** y **Vitales No Disponibles:** tienen cero videos y son temas de nicho que Google puede posicionar rápido.
3. **Farmacología por sistemas** (SNC, gastrointestinal, endocrina, renal, oncológica): aquí Edutin Academy tiene su *Curso de farmacología clínica*.
4. Productos especiales (homeopáticos, gases medicinales, fitoterapéuticos, cannabis): sobre todo fuentes institucionales.
5. Calidad (BPM, BPL, validaciones): pocos pendientes por curso.

## Videos publicados que hay que reemplazar

YouTube los reporta rotos. La página pública ya los oculta (`videoDisponible`), pero la clase queda sin video.

| Video | Estado | Migración |
|---|---|---|
| GMuRFKpWDXE | no disponible | 042, 043 |
| jsJtInFEU1M | no disponible | 043 |
| sPEFrjmK38I | no disponible | 045 |
| HGMfxeCBFfg | sin permiso de inserción | 055 |
| NnuGo4UrFfY | sin permiso de inserción | 042 |
| TV2ORZn7Yhw | sin permiso de inserción | 043 |
| U-jYWSoEp6o | sin permiso de inserción | 055 |

## Las clases en texto (siguiente paso)

Llevar 1.382 clases de unas 20 palabras a 400–500 son unas 600.000 palabras de contenido técnico. Se hace por curso, en el mismo orden de la cola:

1. Claude redacta la clase completa con el modelo de diabetes y abre cada fuente.
2. La dirección académica la revisa antes de publicarla. Son contenidos clínicos y regulatorios (`docs/CLINICAL_SAFETY.md`).
3. Se genera la migración del curso con republicación aprobada.
