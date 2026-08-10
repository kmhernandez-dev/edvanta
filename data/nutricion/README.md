# Base de datos nutricional científica — Feliz Sin Tiroides

Base clínica, trazable y escalable para alimentar la IA de recomendación de recetas
por condición tiroidea. **La seguridad no vive en cada receta, sino en las reglas
clínicas** (`fst_clinical_rules.json`): las recetas solo las referencian por `rule_id`.

## Política de evidencia (modo elegido: "todo verificado en vivo")

- Cada regla clínica se apoya en **fuentes reales verificadas** (PMID/DOI comprobados
  en PubMed/NCBI durante la construcción). **No se inventan citas.**
- Jerarquía: revisión sistemática/meta-análisis > ECA > guía de práctica clínica >
  cohorte/prospectivo > observacional > mecanismo (solo como apoyo).
- Si la evidencia es insuficiente o inconsistente se escribe explícitamente y **no**
  se convierte en restricción obligatoria.
- Los valores nutricionales de las recetas (kcal, proteína, etc.) serán **estimaciones**
  (campo `..._estimada`). Para precisión clínica deben validarse contra tablas de
  composición (USDA / ICBF Colombia). No se presentan como exactos.
- Lenguaje al paciente: educativo, no alarmista, sin pseudociencia, **defiere al equipo
  tratante**. Nunca "cura/desinflama/reactiva la tiroides" ni "reemplaza la levotiroxina".

## Método por fases

| Fase | Entregable | Estado |
|------|-----------|--------|
| 1 | Revisión científica | 🟡 En curso (clusters levotiroxina + yodo hechos) |
| 2 | `fst_clinical_rules.json` | 🟡 En curso (11 reglas verificadas) |
| 3 | `fst_condition_matrix.json` (8 condiciones) | 🟡 Estructura + 8 perfiles + 1 receta indexada |
| 4 | `fst_ingredient_safety.json` (yodo/gluten/levotiroxina) | 🟡 Motores de yodo y gluten hechos; levotiroxina pendiente |
| 5 | Diseño de las 200 recetas | 🟡 1 receta MUESTRA (formato validado) |
| 6 | Recetas en 8 lotes × 25 | 🟡 1/200 (muestra) |
| 7 | Dedup | ⬜ Pendiente |
| 8–10 | Auditoría científica / farmacológica / yodo | ⬜ Pendiente |
| 11 | Export maestro (`fst_recetas_master.json`/`.csv`) | ⬜ Pendiente |

## Archivos

- `fst_evidence_library.json` — bibliografía verificada (PMID/DOI reales).
- `fst_clinical_rules.json` — reglas clínicas; cada una cita su(s) evidencia(s).
- `fst_condition_matrix.json` — 8 perfiles clínicos + valores de compatibilidad + índice de recetas.
- `fst_ingredient_safety.json` — motores de **yodo** y **gluten** hechos; levotiroxina pendiente.
- `fst_recetas_master.json` / `.csv` — las 200 recetas (por ahora **1 receta muestra**: FST-DES-001).
- `fst_qa_report.md` — (pendiente) auditoría.

## Condiciones clínicas (perfiles)

THY-01 Hipotiroidismo tratado · THY-02 Hashimoto sin celiaquía · THY-03 Hashimoto +
celiaquía · THY-04 Graves/hipertiroidismo · THY-05 Post-tiroidectomía estable ·
THY-06 Cáncer diferenciado estable · THY-07 Preparación radioyodo (bajo en yodo,
**temporal**) · THY-08 Post-tiroidectomía con hipoparatiroidismo (**alta precaución**).

## Bitácora

- **2026-08-10** — Creada la estructura. Verificado y cargado el cluster
  *administración e interacciones de levotiroxina* (6 reglas, 6 fuentes reales).
- **2026-08-10** — Verificado y cargado el cluster *yodo / radioyodo*: 2 reglas
  (IOD-RAI-01 dieta baja en yodo temporal para radioyodo; IOD-EXCESS-01 exceso de
  yodo / algas / suplementos) + 3 fuentes (lista ATA de dieta baja en yodo, revisión
  de exceso de yodo *Ann N Y Acad Sci* 2019, guía ATA cáncer 2015). Creado
  `fst_ingredient_safety.json` con el motor de yodo (clasificación de ingredientes).
- **2026-08-10** — Verificados y cargados los clusters *gluten/celiaquía* y *selenio*:
  3 reglas (GLU-01 Hashimoto sin celiaquía → gluten permitido; GLU-02 celiaquía →
  sin gluten estricto de por vida; SEL-01 selenio → no suplementar rutinariamente,
  alimento ≠ suplemento) + 4 fuentes (meta-análisis *Nutrients* 2025, *PLoS One*
  2016, Winther *Endocrine* 2017 y Cochrane van Zuuren 2014). Añadido `gluten_logic`
  al motor de ingredientes. **Total: 11 reglas, 13 fuentes.**
- **2026-08-10** — Creada `fst_condition_matrix.json` (8 perfiles clínicos + valores
  APTA/APTA_CON_MODIFICACION/… + índice) y `fst_recetas_master.json` con la **primera
  receta muestra** (FST-DES-001, Arepa de maíz con huevo y aguacate) que ejercita toda
  la maquinaria: matriz de 8 condiciones con justificación, etiquetas de yodo/gluten,
  reglas aplicadas, evidencia, precauciones y adaptaciones. Pendiente de validación de
  formato por el usuario antes de escalar. Próximo (tras validar): Graves e
  hipoparatiroidismo, luego generar recetas en lotes de 25.
