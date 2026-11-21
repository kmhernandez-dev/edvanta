# Vademécum: quién construye cada grupo farmacológico

Este archivo evita que dos agentes (Claude Code y Open Code) escriban el mismo medicamento. Antes de crear una ficha `/articulos/[dci]-para-que-sirve`, revisa esta tabla y anota tu grupo.

## Regla de trabajo

1. Cada agente reclama **un grupo ATC completo** y lo anota aquí con fecha.
2. Si una ficha ya existe, no se crea otra: se enriquece la existente.
3. Toda ficha nueva entra con `noindex` hasta la revisión clínica de Karla (anotar en `src/data/revisionClinica.js`).
4. Formato de página: el mismo de las fichas actuales (`amlodipino-para-que-sirve.md`): qué es, para qué sirve, cómo se toma, efectos secundarios, quiénes no deben tomarlo, interacciones, embarazo y lactancia, preguntas frecuentes y fuentes de ficha técnica.
5. Cada ficha cierra con dos llamados a la acción: uno para pacientes y otro para profesionales (ver el plan del grupo).

## Asignaciones

| Grupo (ATC) | Agente | Desde | Plan de keywords | Estado |
|---|---|---|---|---|
| Antimicrobianos: antibacterianos sistémicos (J01) y nitroimidazoles (P01AB) | Claude Code | 13-nov-2026 | `seo/vademecum-antimicrobianos.md` y `seo/vademecum-antimicrobianos-2000-keywords.csv` | Lote 1 y lote 2 revisados por Karla y desplegados el 13-nov. Lote 2 ampliado con 8 monografías y 4 clases nuevas, más 3 artículos del lote 3, en noindex hasta la revisión de Karla. Sigue el lote 4 |
| Antihipertensivos (C02, C03, C07, C08, C09) | Claude Code | 12-nov-2026 | Grupo de presión alta en `seo/plan-1000-keywords.md` | 8 artículos aprobados por Karla (12-nov) e indexables |
| Dolor e inflamación: AINE y coxibs (M01A), dipirona y tramadol (N02), metocarbamol (M03B) | Claude Code | 16-nov-2026 | `seo/vademecum-dolor-inflamacion.md` y `seo/vademecum-dolor-inflamacion-1000-keywords.csv` | Lote 1: grupo, 7 monografías y 7 fichas para pacientes (meloxicam, etoricoxib, celecoxib, ketorolaco, dipirona, tramadol, metocarbamol), en noindex hasta la revisión de Karla. Lote 2 (16-nov): monografías de diclofenaco, ibuprofeno, naproxeno y acetaminofén, también en noindex |
| Digestivos (A02, A03, A04, A06, A07) | Claude Code | 16-nov-2026 | `seo/vademecum-50-monografias.md` | Grupo y 12 monografías en noindex hasta la revisión de Karla |
| Corticoides sistémicos (H02AB) | Claude Code | 16-nov-2026 | `seo/vademecum-50-monografias.md` | Grupo y 5 monografías en noindex |
| Antihistamínicos y respiratorios (R03, R05, R06, N05BB) | Claude Code | 16-nov-2026 | `seo/vademecum-50-monografias.md` | Grupo y 8 monografías en noindex |
| Salud mental y SNC (N03, N05, N06, N02BF) | Claude Code | 16-nov-2026 | `seo/vademecum-50-monografias.md` | Grupo y 8 monografías en noindex |
| Antimicóticos, antivirales y antiparasitarios (J02, D01, A07AA, J05, P02) | Claude Code | 16-nov-2026 | `seo/vademecum-50-monografias.md` | Grupo y 7 monografías en noindex |
| Tiroides (H03AA) | Claude Code | 16-nov-2026 | `seo/vademecum-50-monografias.md` | Grupo y monografía de levotiroxina en noindex |
| Antidiabéticos orales: dapagliflozina y gliclazida (A10BK01 y A10BB09) | Open Code | 17-nov-2026 | `seo/plan-10000-keywords.md` | 2 monografías nuevas en el grupo de diabetes tipo 2, con ficha CIMA, evidencia DECLARE, DAPA-HF, DELIVER, DAPA-CKD y ADVANCE. En noindex hasta la revisión de Karla. |
| Enfermedad renal crónica: finerenona (C03DA05) | Open Code | 17-nov-2026 | `seo/plan-10000-keywords.md` | Nuevo grupo y monografía de finerenona con CIMA, KDIGO 2024, FIDELIO-DKD, FIGARO-DKD y FINEARTS-HF. En noindex hasta la revisión de Karla. |

## Fichas que ya existen (no duplicar)

Antimicrobianos: amoxicilina, azitromicina, metronidazol, cefalexina, amoxicilina con ácido clavulánico, trimetoprim sulfametoxazol, nitrofurantoína, ciprofloxacino y clindamicina.
Dolor e inflamación (16-nov): meloxicam, etoricoxib, celecoxib, ketorolaco, dipirona, tramadol y metocarbamol.
Otros grupos: acetaminofén, ácido fólico, amlodipino, atorvastatina, Buscapina (butilescopolamina), diclofenaco, enalapril, furosemida, hidroclorotiazida, ibuprofeno, loratadina, losartán, metformina, naproxeno, omeprazol, sertralina.

## Grupos sugeridos para Open Code

Sin solaparse con antimicrobianos ni antihipertensivos, y con demanda alta en Colombia:

- **Digestivos**: tomado por Claude Code el 16-nov; queda libre el grupo de sales de rehidratación oral y la nota de seguridad de la ranitidina.
- **Antidiabéticos (A10)**: ya hay metformina; faltan insulinas, sitagliptina, empagliflozina, dapagliflozina, semaglutida y tirzepatida.
- **Respiratorios**: antihistamínicos, montelukast y salbutamol tomados por Claude Code el 16-nov; quedan libres los corticoides inhalados (beclometasona, budesonida, fluticasona).
