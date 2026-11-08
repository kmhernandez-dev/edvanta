# Plantilla de ficha de medicamento — propuesta (NO PUBLICAR)

**Estado:** borrador de arquitectura y contenido. No se publica, no se indexa y no se usa en producción hasta aprobación de dirección, desarrollo y revisión clínica.  
**Cluster:** A. Base de medicamentos de Colombia.  
**Patrón:** `/medicamentos/[dci]` (hub) y `/medicamentos/[dci]/[marca]` (producto).  
**Fuente principal:** datasets del Código Único de Medicamentos (CUM) del INVIMA en datos.gov.co + ficha técnica + fuentes primarias.

---

## 1. Objetivo de la página

Responder en menos de 60 palabras:

1. Qué es el principio activo.
2. Para qué sirve.
3. Qué presentaciones y registros sanitarios existen hoy en Colombia.
4. Quién lo comercializa.
5. Qué advertencias, embarazo, lactancia e interacciones son relevantes.
6. De dónde sale cada dato y quién lo revisó.

**Diferencial frente a las 10 primeras de Google:** tabla de registros CUM actualizada desde datos oficiales, con estado del registro, titular, forma, concentración, presentación, resolución y fecha de verificación, más revisión de una química farmacéutica clínica.

---

## 2. URL, canonical y reglas de indexación

| Elemento | Regla |
|---|---|
| URL hub | `/medicamentos/[dci]` |
| URL producto | `/medicamentos/[dci]/[marca]` |
| Canonical | Autorreferente, sin parámetros, sin barra final |
| `robots` | `index, follow` solo si cumple el gate de la sección 4 |
| `noindex` | Si falta `reviewed_by`, `reviewed_at`, fuente primaria o un campo crítico |
| Sitemap | Solo páginas aprobadas, 200 y autorreferentes |
| hreflang | No por defecto; solo si existe una versión país con contenido realmente distinto |
| Redirecciones | 301 desde URLs antiguas; nunca cadenas |

---

## 3. Wireframe de la página

```text
[Header y breadcrumb]
Inicio > Medicamentos > [DCI]

H1: [DCI]: qué es, para qué sirve y registros vigentes en Colombia

[Respuesta directa: 40–60 palabras]
[Línea de autoría y revisión: autor, revisora, fecha, fuentes]
[Tabla “Datos clave”]

H2: Para qué sirve
H2: Cómo actúa
H2: Presentaciones y registros sanitarios vigentes en Colombia
  H3: Tabla de registros CUM
  H3: Titulares y laboratorios
H2: Dosis y administración (solo ficha técnica)
H2: Advertencias y precauciones
H2: Embarazo y lactancia
H2: Interacciones relevantes
H2: Preguntas frecuentes
H2: Fuentes
H2: Revisión clínica y conflicto de interés
H2: Contenido relacionado
[Footer]
```

### 3.1 Bloque de respuesta directa

- 40–60 palabras.
- Debe responder “qué es”, “para qué sirve” y “qué registro tiene en Colombia”.
- No usar lenguaje promocional.
- No prometer curas.
- No dar dosis personalizadas.
- Ejemplo de estructura, sin datos inventados:

> `[DCI]` es un medicamento `[grupo farmacológico]` que se usa en Colombia para `[indicación aprobada]`. Actúa mediante `[mecanismo resumido]`. Esta ficha reúne los registros sanitarios vigentes, presentaciones y titulares disponibles en el CUM del INVIMA, con fecha de verificación `[AAAA-MM-DD]` y revisión clínica.

### 3.2 Tabla “Datos clave”

| Campo | Contenido | Fuente obligatoria |
|---|---|---|
| Principio activo (DCI) | `[DCI]` | CUM/INVIMA |
| Código ATC | `[ATC]` | WHO ATC |
| Grupo farmacológico | `[Clase]` | Ficha técnica/guía |
| Estado legal | `[Prescripción/venta libre]` | Ficha técnica/INVIMA |
| Formas | `[Formas]` | CUM |
| Registros vigentes | `[N]` | CUM |
| Última verificación | `[AAAA-MM-DD]` | Datos propios |
| Revisión clínica | `[Nombre]`, `[AAAA-MM-DD]` | Revisión |

---

## 4. Gate de indexación

La página **no se indexa** hasta cumplir todo:

- [ ] `reviewed_by` con nombre y credenciales.
- [ ] `reviewed_at` con fecha ISO.
- [ ] `last_verified_at` con fecha de la última verificación de datos.
- [ ] Al menos 2 fuentes primarias para salud/medicamentos.
- [ ] Tabla CUM con al menos un registro y fuente oficial enlazada.
- [ ] Indicación, mecanismo, advertencias, embarazo, lactancia e interacciones.
- [ ] Respuesta directa de 40–60 palabras.
- [ ] 5 enlaces internos contextuales como mínimo.
- [ ] Similitud <30% con páginas hermanas.
- [ ] JSON-LD válido.
- [ ] Sin datos inventados; los faltantes marcados `TODO`.
- [ ] Canonical autorreferente en el HTML inicial.
- [ ] Página 200 y en sitemap solo después de aprobar.

Si falta un campo crítico (indicación, registro, titular, revisión), la página va con `noindex, follow` y no entra al sitemap.

---

## 5. Campos de datos y fuentes

| Campo | Tipo | Obligatorio | Fuente | Si falta |
|---|---|---|---|---|
| `dci` | texto | Sí | CUM/INVIMA | No se crea la página |
| `slug` | texto | Sí | Generado y validado | No se crea |
| `atc_code` | texto | Sí | WHO ATC | `noindex` |
| `drug_class` | texto | Sí | Ficha técnica/guía | `TODO` + `noindex` |
| `indications` | lista | Sí | Ficha técnica INVIMA/EMA/FDA | `noindex` |
| `mechanism` | texto | Sí | Ficha técnica/guía | `noindex` |
| `dosage` | texto | Opcional | Ficha técnica | No inventar |
| `warnings` | lista | Sí | Ficha técnica | `noindex` |
| `contraindications` | lista | Sí | Ficha técnica | `noindex` |
| `pregnancy` | texto | Sí | Ficha técnica/guía | `TODO` + `noindex` |
| `lactation` | texto | Sí | Ficha técnica/guía | `TODO` + `noindex` |
| `renal_adjustment` | texto | Opcional | Ficha técnica/guía | `TODO` |
| `hepatic_adjustment` | texto | Opcional | Ficha técnica/guía | `TODO` |
| `interactions` | lista | Sí | Ficha técnica/guía/PubMed | `TODO` + `noindex` |
| `presentations` | lista | Sí | CUM | `noindex` |
| `holders` | lista | Sí | CUM | `noindex` |
| `registry_status` | texto | Sí | CUM | `noindex` |
| `resolution` | texto | Opcional | INVIMA | `TODO` |
| `expediente` | texto | Opcional | INVIMA | `TODO` |
| `source_urls` | lista | Sí | INVIMA/EMA/FDA/PubMed | `noindex` |
| `reviewed_by` | texto | Sí | Revisión humana | `noindex` |
| `reviewed_at` | fecha | Sí | Revisión humana | `noindex` |
| `last_verified_at` | fecha | Sí | Datos | `noindex` |
| `status` | enum | Sí | Flujo editorial | `draft` |
| `indexable` | booleano | Sí | Gate | `false` |

---

## 6. Reglas de contenido por sección

### 6.1 Para qué sirve

- Usar solo indicaciones aprobadas en la ficha técnica.
- Distinguir indicación aprobada de uso off-label.
- Si se menciona off-label, decirlo y citar la guía o el artículo.
- No ampliar indicaciones por analogía.
- No usar “cura”, “milagro”, “natural sin riesgos”.

### 6.2 Cómo actúa

- Mecanismo resumido, comprensible para un QF y para un paciente.
- No inventar cascadas moleculares.
- Si el mecanismo no está completamente dilucidado, decirlo.
- Enlazar a la clase ATC y a términos del glosario.

### 6.3 Presentaciones y registros sanitarios

- Fuente: CUM/INVIMA.
- Columnas mínimas: marca, CUM, titular, forma, concentración, presentación, estado, resolución/expediente, fuente.
- Ordenar por estado (vigente primero) y luego por marca.
- Mostrar fecha de corte.
- No mezclar registros vencidos con vigentes sin etiquetarlos.
- No inferir que un registro vencido sigue comercializándose.

### 6.4 Dosis y administración

- Solo si la ficha técnica lo permite.
- Citar la dosis aprobada, no una dosis “recomendada” genérica.
- Aclarar que la dosis individual la define el profesional.
- No calcular dosis por peso, función renal o edad en la ficha; para eso, usar una calculadora con validación y advertencia.
- En Pediatría, no dar dosis sin fuente oficial y sin advertencia.

### 6.5 Advertencias, embarazo y lactancia

- Usar la ficha técnica como fuente principal.
- No usar categorías FDA antiguas como si fueran equivalentes a la regulación colombiana.
- Si la evidencia es limitada, decirlo.
- Incluir señales de alarma y “cuándo consultar”.
- No minimizar riesgos.

### 6.6 Interacciones

- Tabla: interactúa con, mecanismo, gravedad, conducta, fuente.
- Priorizar interacciones clínicamente relevantes, no listas exhaustivas.
- No inventar gravedad.
- Enlazar a las fichas de los medicamentos implicados.
- Distinguir interacción farmacocinética de farmacodinámica.

### 6.7 Preguntas frecuentes

- 4–8 preguntas reales.
- Respuestas de 40–80 palabras.
- No repetir el cuerpo.
- No usar FAQ para introducir datos sin fuente.
- `FAQPage` solo si las respuestas son visibles.

### 6.8 Fuentes

- Formato: autor/organización, título, URL, fecha de publicación, fecha de consulta.
- Fuentes primarias: ficha técnica INVIMA, EMA, FDA, guía clínica, PubMed.
- No usar blogs, Wikipedia, medios generales o contenido de IA como fuente primaria.
- Verificar que la URL exista y que el dato esté en la fuente.
- Si no hay fuente, no se publica el dato.

### 6.9 Revisión clínica

- Nombre completo, credenciales, institución, fecha.
- Conflicto de interés.
- Historial de cambios.
- Enlace a la página de autora.
- No atribuir revisión si no ocurrió.

---

## 7. JSON-LD propuesto

> Los valores entre corchetes son marcadores. No publicar con marcadores. Validar en Rich Results Test y Schema Markup Validator.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Drug",
      "@id": "https://edvanta.co/medicamentos/[dci]#drug",
      "name": "[DCI]",
      "nonProprietaryName": "[DCI]",
      "activeIngredient": "[DCI]",
      "drugClass": "[Clase farmacológica]",
      "code": {
        "@type": "MedicalCode",
        "code": "[ATC]",
        "codingSystem": "ATC"
      },
      "dosageForm": "[Forma farmacéutica]",
      "legalStatus": "[Prescripción/venta libre]",
      "prescriptionStatus": "[Prescripción/venta libre]",
      "mechanismOfAction": "[Mecanismo resumido]",
      "indication": "[Indicación aprobada]",
      "contraindication": "[Contraindicación]",
      "warning": "[Advertencia]",
      "pregnancyWarning": "[Embarazo]",
      "breastfeedingWarning": "[Lactancia]",
      "drugInteraction": "[Interacción relevante]",
      "manufacturer": {
        "@type": "Organization",
        "name": "[Titular]"
      },
      "url": "https://edvanta.co/medicamentos/[dci]"
    },
    {
      "@type": "MedicalWebPage",
      "@id": "https://edvanta.co/medicamentos/[dci]#page",
      "url": "https://edvanta.co/medicamentos/[dci]",
      "name": "[DCI]: qué es, para qué sirve y registros vigentes en Colombia",
      "description": "[Descripción de 150–160 caracteres]",
      "inLanguage": "es-CO",
      "datePublished": "[AAAA-MM-DD]",
      "dateModified": "[AAAA-MM-DD]",
      "lastReviewed": "[AAAA-MM-DD]",
      "reviewedBy": {
        "@type": "Person",
        "name": "Karla Melissa Hernández Salcedo",
        "jobTitle": "Química Farmacéutica Clínica",
        "url": "https://edvanta.co/autores/karla-hernandez",
        "sameAs": "https://www.linkedin.com/in/karla-hernandez-720ab11a9",
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": "Universidad del Atlántico"
        }
      },
      "author": {
        "@type": "Person",
        "name": "[Autor]",
        "url": "https://edvanta.co/autores/[slug]"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Edvanta",
        "url": "https://edvanta.co/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://edvanta.co/img/logo-edvanta.png"
        }
      },
      "about": { "@id": "https://edvanta.co/medicamentos/[dci]#drug" },
      "mainEntity": { "@id": "https://edvanta.co/medicamentos/[dci]#drug" },
      "citation": [
        {
          "@type": "CreativeWork",
          "name": "[Ficha técnica INVIMA]",
          "url": "[URL]",
          "datePublished": "[AAAA-MM-DD]",
          "publisher": { "@type": "Organization", "name": "INVIMA" }
        },
        {
          "@type": "MedicalScholarlyArticle",
          "name": "[Artículo PubMed]",
          "url": "[URL]",
          "datePublished": "[AAAA-MM-DD]"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://edvanta.co/medicamentos/[dci]#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "[Pregunta]",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "[Respuesta con fuente]"
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Inicio",
          "item": "https://edvanta.co/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Medicamentos",
          "item": "https://edvanta.co/medicamentos"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "[DCI]",
          "item": "https://edvanta.co/medicamentos/[dci]"
        }
      ]
    }
  ]
}
```

**Reglas del schema:**

- Confirmar con Karla que el nombre, la universidad y el LinkedIn sean públicamente verificables y que autoriza su publicación. No añadir tarjeta profesional, ORCID ni otros identificadores hasta tenerlos verificados.
- No emitir `reviewedBy` si no hay revisión real.
- No emitir `Drug` con datos incompletos.
- No duplicar `FAQPage` con el mismo contenido en otras páginas.
- No usar `aggregateRating` inventado.
- No usar `offers` si no hay venta.
- Validar que `@id` y `url` coincidan.
- `citation` debe contener URLs reales y fechadas.

---

## 8. Enlazado interno

Cada ficha debe enlazar, como mínimo, a:

1. Hub ATC de la clase.
2. Hub de la forma farmacéutica.
3. Titular/laboratorio.
4. Dos medicamentos relacionados (misma clase o comparación clínica).
5. Glosario de un término clave.
6. Página de revisión clínica.
7. Fuentes.
8. Contenido relacionado del blog.

**Mínimo:** 5 enlaces contextuales. **Recomendado:** 8–12.

---

## 9. Bloque de revisión visible

```text
Revisado por: Karla Melissa Hernández Salcedo
Química Farmacéutica Clínica, Universidad del Atlántico
Fecha de revisión: [AAAA-MM-DD]
Última verificación de datos: [AAAA-MM-DD]
Fuentes: [enlace al bloque de fuentes]
Conflicto de interés: [declaración]
Historial de cambios: [enlace]
```

---

## 10. QA checklist antes de publicar

- [ ] El H1 responde a la intención principal.
- [ ] La respuesta directa tiene 40–60 palabras.
- [ ] La tabla CUM tiene fuente y fecha.
- [ ] Los registros vencidos están etiquetados.
- [ ] No hay dosis inventadas.
- [ ] No hay indicaciones no aprobadas sin advertencia.
- [ ] Embarazo y lactancia están cubiertos.
- [ ] Interacciones relevantes están cubiertas.
- [ ] Las fuentes son primarias y verificables.
- [ ] La revisora firmó y fechó.
- [ ] El JSON-LD valida.
- [ ] Hay 5+ enlaces internos.
- [ ] La similitud con hermanas es <30%.
- [ ] El canonical es autorreferente.
- [ ] La página responde 200.
- [ ] Está fuera del sitemap si es `noindex`.
- [ ] No hay `TODO` visibles en producción.
- [ ] No hay datos de pacientes.
- [ ] No hay promesas de cura ni lenguaje alarmista.

---

## 11. Esqueleto de ejemplo (sin datos reales)

```markdown
# [DCI]: qué es, para qué sirve y registros vigentes en Colombia

[Respuesta directa de 40–60 palabras, con indicación aprobada y mecanismo resumido.]

**Revisado por:** Karla Melissa Hernández Salcedo, Química Farmacéutica Clínica.
**Fecha de revisión:** [AAAA-MM-DD]. **Última verificación de datos:** [AAAA-MM-DD].

## Datos clave

| Campo | Dato |
|---|---|
| Principio activo | [DCI] |
| Código ATC | [ATC] |
| Clase | [Clase] |
| Estado legal | [Prescripción/venta libre] |
| Formas | [Formas] |
| Registros vigentes | [N] |

## Para qué sirve

[Indicaciones aprobadas, con fuente.]

## Cómo actúa

[Mecanismo resumido, con fuente.]

## Presentaciones y registros sanitarios vigentes en Colombia

| Marca | CUM | Titular | Forma | Concentración | Presentación | Estado | Fuente |
|---|---|---|---|---|---|---|---|
| [Marca] | [CUM] | [Titular] | [Forma] | [Concentración] | [Presentación] | [Estado] | [URL] |

## Dosis y administración (solo ficha técnica)

[Dosis aprobada, con fuente. Aclarar que la dosis individual la define el profesional.]

## Advertencias y precauciones

[Advertencias, contraindicaciones y señales de alarma.]

## Embarazo y lactancia

[Información de ficha técnica, con límites de evidencia.]

## Interacciones relevantes

| Interactúa con | Mecanismo | Gravedad | Conducta | Fuente |
|---|---|---|---|---|
| [Medicamento] | [Mecanismo] | [Gravedad] | [Conducta] | [URL] |

## Preguntas frecuentes

### [Pregunta]

[Respuesta con fuente.]

## Fuentes

- [Fuente 1 con URL y fecha]
- [Fuente 2 con URL y fecha]

## Revisión clínica

[Bloque de revisión y conflicto de interés.]

## Contenido relacionado

- [ATC]
- [Forma farmacéutica]
- [Titular]
- [Medicamento relacionado]
```

---

## 12. Qué no hacer

- No publicar con `TODO` en campos críticos.
- No inventar CUM, resoluciones, titulares, dosis, interacciones ni fechas.
- No copiar la ficha técnica completa; resumir con criterio y citar.
- No usar la ficha para diagnosticar ni para cambiar tratamientos.
- No crear una página por cada presentación si no aporta datos distintos.
- No crear variantes por ciudad o país sin regulación, precio o disponibilidad diferentes.
- No indexar sin revisión clínica.
- No usar IA para rellenar campos vacíos.
- No prometer cura, pérdida de peso, “detox” ni resultados.
- No mezclar opinión con evidencia.

---

**Fin de la propuesta. No publicar hasta aprobación.**
