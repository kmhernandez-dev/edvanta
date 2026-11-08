# Hoja de ruta SEO de 90 días — edvanta.co

**Fecha de inicio:** 9 de noviembre de 2026 (semana 1)  
**Horizonte:** 90 días (12 semanas) + ventana de medición de 4–6 semanas para el piloto.  
**Meta direccional:** pasar de 30 keywords a 500.000 en 24–36 meses, sin violar las políticas de spam de Google.  
**Regla de oro:** primero se corrige, se revisa y se mide; después se escala. Ninguna página nueva se indexa sin quality gate.

**Estado 7-nov-2026:** primer lote P0 ejecutado: 184 artículos de salud/medicamentos con `noindex`, sitemap index/segmentado, 404 real, redirects HTTP/www y prerender de rutas fijas. Pendiente: revisión clínica, poda de noticias, E-E-A-T y Astro/PostgreSQL.

---

## 1. Punto de partida

| Métrica | Valor |
|---|---:|
| Keywords orgánicas (Semrush) | 30 |
| Tráfico orgánico | 0 |
| Authority Score | 2 |
| Dominios de referencia | 170 |
| Backlinks | 243 |
| Artículos publicados | 354 |
| Artículos con revisor | 0 |
| URLs en sitemap | 490 |
| URLs SPA sin HTML propio en sitemap | 86 |
| Páginas con `reviewedBy` | 0 |
| Páginas con `Drug` schema | 0 |
| Páginas con `DefinedTerm` | 0 |
| Performance móvil (Lighthouse, 2 corridas) | 45–67 / 100 |
| LCP móvil (laboratorio, 2 corridas) | 2,1–6,0 s |

**Diagnóstico:** el problema no es volumen de contenido. Es confianza, indexabilidad, revisión clínica, arquitectura y autoridad. La hoja de ruta prioriza esos cuatro frentes.

---

## 2. Objetivos por horizonte

| Horizonte | Objetivo | Métrica de éxito |
|---|---|---|
| 30 días | Detener el riesgo y arreglar los cimientos | 0 páginas de salud indexables sin revisor; 0 soft 404; sitemap index válido; autoría publicada |
| 60 días | Motor de contenido y piloto listo | 50–100 páginas CUM en staging, con quality gate y revisión clínica |
| 90 días | Piloto publicado y medición iniciada | 50–100 páginas indexables, 70%+ indexadas, primeras impresiones en GSC |
| 6 meses | Escalar si el piloto funciona | 10.000 keywords; 1.000–2.000 páginas aprobadas; AS 5–10 |
| 12 meses | Consolidar clústeres | 50.000 keywords; 4.000–6.000 páginas; AS 15–20 |
| 24–36 meses | Meta direccional | 500.000 keywords; 8.000–25.000 páginas; AS 30+ y autoridad sostenida |

**Nota:** la meta de 500.000 keywords depende de la autoridad. Con AS 2 y 170 dominios de referencia, no es alcanzable solo con páginas. El plan de autoridad corre en paralelo desde la semana 1.

---

## 3. Workstreams

| Workstream | Dueño | Entregable principal |
|---|---|---|
| T1. Riesgo y cumplimiento | SEO + dirección | Noindex de salud sin revisión; congelar noticias duplicadas; política de IA |
| T2. Cimientos técnicos | Desarrollo + SEO | Canonical, 404, redirects, sitemap index, schema, CWV |
| T3. E-E-A-T | Editor + Karla | Autoría, política editorial, revisión clínica, fuentes |
| T4. Motor de contenido | Desarrollo + SEO | Ingesta CUM, modelo de datos, plantillas, quality gate, SSG |
| T5. Piloto | Editor + Karla + desarrollo | 50–100 páginas aprobadas y publicadas |
| T6. Autoridad | Dirección + SEO/PR | Backlinks, datos propios, alianzas, prensa |
| T7. Medición | SEO | GSC, Semrush, dashboards, gates de escala |

---

## 4. Fase 0 — Días 0–10: contener y decidir

| Día | Acción | Entregable | Responsable |
|---|---|---|---|
| 1 | Auditoría técnica y de contenido | `seo/auditoria.md` | SEO |
| 2 | Solicitar inputs: CSV Semrush, GSC, backlinks, muestra CUM, credenciales de Karla | Lista de pendientes | SEO/dirección |
| 3 | Baseline de URLs, indexación, keywords y backlinks | Dashboard inicial | SEO |
| 4 | Mapa keyword → URL y canibalización | Matriz de 30 keywords | SEO |
| 5 | Reunión de decisiones: stack, noindex, noticias, IA | Acta de decisiones | Dirección |
| 6–7 | Especificación de Fase 1: sitemap, canonical, 404, schema, autoría | Documento técnico | SEO/desarrollo |
| 8–9 | Especificación del pipeline CUM y plantilla de medicamento | Documento de datos + plantilla | SEO/desarrollo/QF |
| 10 | Aprobación del plan y arranque de Fase 1 | Go/no-go | Dirección |

**Decisiones que deben cerrarse en esta fase:**

1. ¿Astro, Next.js o prerender extendido?
2. ¿Se noindexan de inmediato las 184 páginas de salud/medicamentos sin revisor?
3. ¿Se congelan y podan las 100 noticias casi duplicadas?
4. ¿Qué rastreadores de IA se permiten?
5. ¿Quién firma la revisión clínica y con qué SLA?
6. ¿Se contrata o se asigna un editor técnico?

---

## 5. Fase 1 — Semanas 2–4: cimientos técnicos y E-E-A-T

### Semana 2: riesgo y canonical

| Acción | Detalle | Entregable |
|---|---|---|
| Noindex de salud sin revisión | Añadir `reviewed_by` y `reviewed_at`; el generador emite `noindex` si faltan | 184 páginas con noindex real |
| Congelar noticias | Detener el generador; noindex o retirar duplicados | 100 URLs fuera del índice |
| Canonical en HTML inicial | Prerender/SSR de las 86 URLs SPA o retirarlas del sitemap | 0 URLs del sitemap con canonical a la home |
| 404 real | nginx/edge devuelve 404 con `noindex` | 0 soft 404 |
| Redirects | HTTP→HTTPS; www→apex; barra final | 301 únicos, sin cadenas |

### Semana 3: sitemap, schema y autoría

| Acción | Detalle | Entregable |
|---|---|---|
| Sitemap index | `/sitemap-index.xml` + segmentos por tipo | Índice válido en producción |
| QA de sitemap | Solo 200/indexable/autorreferente; máximo 10k | 0 URLs SPA o noindex |
| Schema base | `Person`, `Organization` con `sameAs`, `ProfilePage`, `reviewedBy`, `lastReviewed`, `citation` | JSON-LD validado |
| Autoría | `/autores/karla-hernandez` real, con credenciales y publicaciones | Página indexable y enlazada |
| Páginas de confianza | Política editorial, revisión clínica, equipo, fuentes, metodología | 5 páginas publicadas |

### Semana 4: rendimiento y medición

| Acción | Detalle | Entregable |
|---|---|---|
| CWV | PSI/CrUX; baseline móvil | Informe LCP/CLS/INP |
| Presupuesto | JS, CSS, fuentes, imágenes | Presupuesto aprobado |
| Fonts | Subset y `preload`; revisar 4 familias | Mejora medible |
| Supabase | Cargar solo en rutas que lo usan | Menos JS inicial |
| GSC | Verificar propiedad; enviar sitemap index | Datos de indexación |
| Dashboard | GSC + Semrush + calidad | Dashboard semanal |

**Baseline de laboratorio (Lighthouse móvil, 2 corridas, 7-nov-2026):** Performance 45 y 67; LCP 6,0 s y 2,1 s; TBT 1.250 ms y 1.972 ms; CLS ~0; SEO, accesibilidad y buenas prácticas 100; 2.388 KiB; 90 requests. El LCP oscila entre el H1 del hero y el aviso de cookies. Prioridad de la semana: renderizar el aviso sin bloquear el LCP, `hydrateRoot` en páginas prerenderizadas, cargar Supabase/pdf.js solo donde se usan, subset de fuentes y `srcset`/AVIF en imágenes de home. Repetir 3–5 corridas y confirmar con CrUX antes de cerrar el baseline.

**Salida de Fase 1:** 0 páginas de salud sin noindex, 0 soft 404, sitemap index válido, autoría publicada, schema base, CWV medido.

---

## 6. Fase 2 — Semanas 5–6: motor de contenido y datos

### Semana 5: ingesta CUM

| Acción | Detalle | Entregable |
|---|---|---|
| Descargar datasets | CUM vigentes, en trámite, vencidos y otros estados | Snapshot con fecha y hash |
| Normalizar | DCI, marca, titular, forma, concentración, presentación, estado, resolución | Tablas normalizadas |
| Deduplicar | Por CUM y por presentación; no por marca genérica | Reporte de duplicados |
| Mapear ATC | DCI → ATC; validar con WHO ATC | Cobertura ATC |
| Detectar campos faltantes | Lista de campos vacíos por registro | Reporte de calidad |

### Semana 6: plantillas y quality gate

| Acción | Detalle | Entregable |
|---|---|---|
| Plantilla DCI | Ver `seo/plantilla-ficha-medicamento.md` | Plantilla aprobada |
| Plantilla marca | Ficha de producto con CUM y registro | Plantilla aprobada |
| Plantilla ATC | Hub de clase | Plantilla aprobada |
| Quality gate | Campos, fuentes, similitud, enlaces, schema | Script de validación |
| Cola de revisión | Ordenada por volumen potencial | Vista/CSV para Karla |
| SSG | Build por lote con `--cluster` y `--limit` | Staging con 10 páginas |

**Salida de Fase 2:** pipeline reproducible, 10 páginas de prueba en staging, quality gate funcionando.

---

## 7. Fase 3 — Semanas 7–8: piloto de 50–100 páginas

### Composición del piloto

| Tipo | Páginas | Criterio |
|---|---:|---|
| Hubs DCI | 20 | Mayor potencial de búsqueda y datos completos |
| Fichas de marca | 40 | Al menos 3 presentaciones y registro vigente |
| Hubs ATC | 15 | Clases con ≥3 productos |
| Laboratorios | 10 | Titulares con cartera real |
| Formas farmacéuticas | 5 | Formas con volumen |
| Herramientas | 5 | Calculadoras con fórmula publicada |
| Glosario | 5 | Términos con definición y contexto |
| **Total** | **100** | 50 mínimo si el QA es exigente |

### Flujo de revisión

```text
Borrador generado
  → QA automático (campos, fuentes, similitud, enlaces, schema)
  → Revisión clínica de Karla (reviewed_by, reviewed_at)
  → Correcciones
  → Aprobación
  → Build estático
  → Sitemap segmentado
  → Publicación
  → Inspección de URL en GSC
```

### Reglas del piloto

- 0 páginas publicadas sin revisión.
- 0 páginas con datos inventados.
- 0 páginas con similitud ≥30% con hermanas.
- Mínimo 5 enlaces internos contextuales.
- Respuesta directa de 40–60 palabras.
- Tabla de registros CUM con fuente y fecha.
- Bloque de revisión visible.
- `Drug` + `MedicalWebPage` + `FAQPage` + `BreadcrumbList` válidos.
- Noindex si falta un campo crítico.

**Salida de Fase 3:** 50–100 páginas en producción, indexables, revisadas y medidas.

---

## 8. Fase 4 — Semanas 9–12: medir y decidir

### Ventana de medición

| Semana | Acción | KPI |
|---|---|---|
| 9 | Inspección de URLs; solicitar indexación | % indexadas |
| 10 | Primer corte GSC | Impresiones, clics, CTR, consultas |
| 11 | Análisis de páginas sin impresiones | % páginas muertas |
| 12 | Corte de 4 semanas | Indexación, impresiones, primeras keywords |
| 13–14 | Corte de 6 semanas | Gate final de escala |

### Regla de escalado

| Condición | Decisión |
|---|---|
| ≥70% indexadas y ganan impresiones | Escalar x5 (500 páginas) |
| 50–70% indexadas o impresiones débiles | Corregir y repetir piloto |
| <50% indexadas o 0 impresiones | Podar, fusionar o noindexar; no escalar |
| Canibalización o duplicados | Fusionar antes de seguir |
| Queja de calidad o revisión | Detener y auditar |

**No se escala por calendario. Se escala por evidencia.**

---

## 9. Plan de lotes

| Lote | Páginas | Cuándo | Gate |
|---|---:|---|---|
| Piloto | 50–100 | Semana 7–8 | Revisión + QA |
| Lote 1 | 250–500 | Mes 4 | 70% indexación + impresiones |
| Lote 2 | 500–1.000 | Mes 5–6 | 70% indexación + keywords |
| Lote 3 | 1.000–2.000 | Mes 7–9 | 70% indexación + autoridad |
| Lote 4 | 2.000–4.000 | Mes 10–15 | 70% indexación + AS |
| Lote 5 | 4.000–8.000 | Mes 16–24 | 70% indexación + AS 20+ |

**Matemática:** 8.000–25.000 páginas × 20–60 keywords por página = 160.000–1.500.000 keywords potenciales. La meta de 500.000 exige, en la práctica, 10.000–15.000 páginas que rankeen y una autoridad muy superior a la actual.

---

## 10. KPIs semanales

| KPI | Fuente | Meta 90 días |
|---|---|---:|
| Páginas enviadas / indexadas | GSC | ≥70% del piloto |
| Keywords top 100 | Semrush | 30 → 100 |
| Keywords top 10 | Semrush | 0 → 10 |
| Clics orgánicos | GSC | >0 y crecientes |
| CTR | GSC | >2% en páginas con impresiones |
| Páginas sin impresiones a 90 días | GSC | <30% del piloto |
| Páginas de salud con revisor | Datos internos | 100% de las indexadas |
| Páginas con fuentes primarias | Datos internos | 100% de salud/medicamentos |
| Similitud máxima entre hermanas | QA | <30% |
| Enlaces internos por página | QA | ≥5 |
| CWV móvil | CrUX/PSI | LCP <2,5 s; CLS <0,1; INP <200 ms |
| Authority Score | Semrush | 2 → 5 |
| Dominios de referencia | Semrush | 170 → 200 |

---

## 11. Autoridad: plan paralelo de 90 días

| Semana | Acción | Entregable |
|---|---|---|
| 1–2 | Export y auditoría de 243 backlinks | CSV clasificado |
| 3–4 | Recuperar menciones sin enlace | Lista de oportunidades |
| 5–6 | Diseñar el primer dato propio: “Registros sanitarios en Colombia 2026” | Brief + metodología |
| 7–8 | Producir el informe con CSV descargable | Activo enlazable |
| 9–10 | Difundir a facultades, gremios y medios | 20–30 contactos |
| 11–12 | Publicar y medir enlaces | Primeros 10–20 enlaces |

**Canales priorizados:**

1. Facultades de farmacia (Universidad del Atlántico y otras).
2. Gremios y asociaciones de químicos farmacéuticos.
3. Medios de salud y sector farmacéutico en Colombia.
4. Directorios profesionales y perfiles de la revisora.
5. LinkedIn y comunidad QF de Edvanta.
6. Guest posts en medios de salud con criterio editorial.

**No hacer:** comprar enlaces, PBN, intercambios masivos, anchors exactos, directorios spam.

---

## 12. Visibilidad en IA: plan de 90 días

| Acción | Semana | Entregable |
|---|---|---|
| Auditar `robots.txt` de producción | 1 | Informe de rastreadores permitidos/bloqueados |
| Decidir política de IA | 2 | Acta de decisión |
| Respuesta directa de 40–60 palabras | 3–4 | Plantilla aplicada a páginas nuevas |
| Bloque de datos clave con fuente y fecha | 3–4 | Componente reutilizable |
| FAQ con schema | 4 | Plantilla validada |
| `llms.txt` actualizado | 5 | Hubs y páginas clave |
| Medición de referidos de IA | 6–12 | Dashboard de referrals |
| Pruebas en ChatGPT/Perplexity/Gemini | 9–12 | Informe de citas y menciones |

**Decisión pendiente:** producción bloquea `GPTBot`, `Google-Extended`, `ClaudeBot` y `CCBot` vía Cloudflare. Si el negocio quiere visibilidad en Gemini y ChatGPT Search, hay que revisar esa política con cuidado y por escrito.

---

## 13. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Publicar salud sin revisión | Alta | Muy alto | Noindex obligatorio + quality gate |
| Escalar noticias duplicadas | Alta | Muy alto | Congelar y podar |
| Sitemap con URLs SPA | Alta | Alto | Prerender/SSR + QA |
| Canibalización | Media | Alto | Mapa keyword→URL + canonical |
| Datos CUM incompletos | Alta | Alto | Noindex si faltan campos críticos |
| Falta de autoridad | Alta | Muy alto | Plan de datos propios y alianzas |
| Revisión clínica sin capacidad | Media | Alto | Priorizar por volumen; SLA; cola |
| Migración de stack | Media | Alto | Astro como capa separada; no reescribir la app |
| Cambios de Google | Media | Medio | Diversificar tráfico y medir intención |

---

## 14. Criterios de salida a 90 días

Se considera exitoso el trimestre si se cumple **todo**:

- [ ] 0 páginas de salud indexables sin `reviewed_by` + `reviewed_at`.
- [ ] 0 noticias near-duplicadas indexadas.
- [ ] 0 soft 404 y 0 URLs del sitemap con canonical a la home.
- [ ] `sitemap-index.xml` válido y segmentado.
- [ ] `/autores/karla-hernandez` publicado y enlazado.
- [ ] Política editorial y de revisión clínica publicadas.
- [ ] 50–100 páginas del piloto publicadas y revisadas.
- [ ] ≥70% del piloto indexado.
- [ ] Primeras impresiones y keywords en GSC.
- [ ] Baseline de CWV y plan de mejora.
- [ ] Auditoría de backlinks completada.
- [ ] Decisión de stack cerrada y documentada.

Si no se cumplen, **no se escala**. Se corrige y se repite el piloto.

---

## 15. Próximos 10 días hábiles

1. Entregar el CSV de Semrush y el acceso a Search Console.
2. Aprobar el noindex de las 184 páginas de salud/medicamentos sin revisión.
3. Congelar el generador de noticias y podar las 100 piezas casi duplicadas.
4. Decidir el stack (Astro recomendado).
5. Aprobar la política de rastreadores de IA.
6. Nombrar al responsable de la cola de revisión clínica.
7. Aprobar el piloto de 50–100 páginas.
8. Autorizar la auditoría de los 243 backlinks.

**Sin estas ocho decisiones, la Fase 1 no arranca.**
