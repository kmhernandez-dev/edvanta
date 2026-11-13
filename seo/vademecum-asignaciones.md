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
| Antimicrobianos: antibacterianos sistémicos (J01) y nitroimidazoles (P01AB) | Claude Code | 13-nov-2026 | `seo/vademecum-antimicrobianos.md` y `seo/vademecum-antimicrobianos-2000-keywords.csv` | Lote 1 revisado por Karla y desplegado el 13-nov: 7 fichas `/articulos/[dci]-para-que-sirve` y el grupo del vademécum `antibioticos-de-uso-ambulatorio` con 7 monografías, indexables. Sigue el lote 2 |
| Antihipertensivos (C02, C03, C07, C08, C09) | Claude Code | 12-nov-2026 | Grupo de presión alta en `seo/plan-1000-keywords.md` | 8 artículos aprobados por Karla (12-nov) e indexables |
| _Libre para Open Code_ | Open Code | — | — | Anotar aquí el grupo elegido |

## Fichas que ya existen (no duplicar)

Antimicrobianos: amoxicilina, azitromicina, metronidazol, cefalexina, amoxicilina con ácido clavulánico, trimetoprim sulfametoxazol, nitrofurantoína, ciprofloxacino y clindamicina.
Otros grupos: acetaminofén, ácido fólico, amlodipino, atorvastatina, Buscapina (butilescopolamina), diclofenaco, enalapril, furosemida, hidroclorotiazida, ibuprofeno, loratadina, losartán, metformina, naproxeno, omeprazol, sertralina.

## Grupos sugeridos para Open Code

Sin solaparse con antimicrobianos ni antihipertensivos, y con demanda alta en Colombia:

- **Analgésicos y antiinflamatorios (M01, N02)**: ya hay cinco fichas; faltan, por ejemplo, tramadol, ketorolaco, meloxicam, celecoxib y dipirona.
- **Digestivos (A02, A03, A07)**: esomeprazol, ranitidina (retirada; nota de seguridad), loperamida, sales de rehidratación oral, simeticona.
- **Antidiabéticos (A10)**: ya hay metformina; faltan insulinas, sitagliptina, empagliflozina, dapagliflozina, semaglutida y tirzepatida.
- **Antihistamínicos y respiratorios (R03, R05, R06)**: cetirizina, desloratadina, salbutamol, beclometasona, montelukast.
