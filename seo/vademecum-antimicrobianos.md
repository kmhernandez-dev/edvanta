# Vademécum Edvanta: antimicrobianos (2.000 keywords)

**Grupo farmacológico:** antibacterianos sistémicos (ATC J01) y nitroimidazoles (P01AB): 47 principios activos.
**Asignado a:** Claude Code (13-nov-2026). Open Code trabaja otro grupo; ver `seo/vademecum-asignaciones.md`.
**Datos:** `seo/vademecum-antimicrobianos-2000-keywords.csv` (2.000 filas). Para regenerar el archivo: `node scripts/generar-keywords-antimicrobianos.mjs`.
**Estado 13-nov-2026:** lote 1 revisado por Karla y desplegado (7 fichas y 8 páginas del vademécum, indexables). Lote 2 escrito (8 fichas y 7 clases de antibióticos), en `noindex` hasta la revisión clínica.

## Por qué este grupo

1. **Ya tenemos qué vender.** Es el único grupo del vademécum con productos propios que encajan directamente:
   - curso *Stewardship Farmacéutico: PROA* (afc-09);
   - ebook *Farmacocinética clínica aplicada* (afc-12), que cubre vancomicina, aminoglucósidos y ajuste renal;
   - ebook *Problemas farmacoterapéuticos IESA* (afc-11);
   - curso *Seguridad del medicamento* (afc-08);
   - *Guía de probióticos* (Feliz Sin Tiroides), para la diarrea por antibióticos.
2. **Las fichas de medicamentos ya posicionan.** Levotiroxina está en posición 3 y las noticias de medicamentos nuevos en posiciones 2 a 9 (Search Console, 28 días al 10-nov).
3. **No se cruza con otro trabajo.** De este grupo solo existen amoxicilina y azitromicina. Los antihipertensivos ya están en curso.
4. **Sirve a los cuatro públicos.** El paciente que busca «cefalexina para qué sirve», el estudiante que estudia las cefalosporinas, el químico farmacéutico que calcula la vancomicina y la institución que necesita un PROA.

**Límite de los datos:** Semrush no tenía unidades de API disponibles, así que **las keywords no tienen volumen**. La prioridad (P1 a P3) se asignó por la demanda esperada de cada fármaco (uso ambulatorio frente a hospitalario) y por el tipo de búsqueda. Después de indexar el lote 1, se valida con Search Console.

## Qué hay en las 2.000 keywords

| Bloque | Keywords | Página tipo |
|---|---|---|
| Fichas por fármaco: para qué sirve, dosis, efectos, embarazo, alcohol, suspensión, comparativas, más las búsquedas profesionales (mecanismo, ajuste renal, dilución, monitoreo) | 1.214 | `/articulos/[dci]-para-que-sirve` |
| Antibióticos por infección: garganta, muela, urinaria, vaginosis, piel, otitis… | 214 | `/articulos/antibiotico-para-[infeccion]` |
| Clases de antibióticos, para estudiantes | 188 | `/articulos/[clase]-antibioticos` |
| Práctica profesional: PROA, PK/PD, resistencia, dilución, dispensación | 171 | Guías profesionales |
| Uso seguro para pacientes: alcohol, alergia, niños, embarazo, probióticos, compra sin fórmula | 131 | Guías transversales |
| Formación y capacitación: búsquedas de compra y recursos para estudiantes | 82 | Páginas de curso, de comparación, B2B y de recursos |

En total son **93 páginas destino**: 11 ya existen y se enriquecen, y 82 son nuevas. Los fármacos de baja demanda (eritromicina, minociclina, tigeciclina, linezolid, colistina…) no tienen página propia: sus keywords van al hub de su clase, para no crear páginas delgadas.

**Por prioridad:** 819 en P1, 927 en P2 y 254 en P3. **Por etapa:** 1.300 TOFU, 545 MOFU y 155 BOFU. Las BOFU nunca se recortaron.

## Cómo conecta cada keyword con una venta

Cada fila trae una oferta principal y una secundaria, con su URL completa y su CTA.

| Público | Problema que busca resolver | Oferta | Acción | Keywords |
|---|---|---|---|---|
| Paciente o cuidador | «Me formularon un antibiótico y no sé cómo tomarlo, si puedo beber o si es seguro en el embarazo» | Guía gratuita *Antibióticos sin errores* (**lanzamiento en preparación**) y, en efectos secundarios, la *Guía de probióticos* | Dejar el correo; comprar la guía de probióticos | 1.100 |
| Estudiante de Química Farmacéutica | «Tengo que aprenderme la clasificación y los mecanismos para el parcial» | Recursos para estudiantes (captación) y el ebook de farmacocinética | Descargar; comprar el ebook | ~200 |
| QF o regente | «Tengo que intervenir en una prescripción, calcular la vancomicina o ajustar la dosis por la función renal» | Curso PROA, ebook de farmacocinética, ebook IESA y curso de seguridad del medicamento | Comprar en Hotmart | ~620 |
| Hospital, IPS o droguería | «Necesitamos un PROA que funcione y un personal de droguería que dispense bien» | Capacitación B2B en las áreas existentes (`/empresas/farmacia-hospitalaria`, `/empresas/regentes-de-farmacia`); la **línea de antimicrobianos está en preparación** | Solicitar una propuesta | 23, más la oferta secundaria de las ~620 profesionales |

Las keywords de cursos de otras plataformas (19) van al artículo de afiliados `cursos-de-antibioticos-y-resistencia-antimicrobiana`. Ahí se distingue con claridad entre **curso propio** y **recomendación de afiliado**.

### Bloques de CTA listos para revisión

Van al final de cada ficha, antes de las fuentes.

**Para pacientes** (no publicar hasta que la guía exista):
> **¿Te formularon un antibiótico?** Descarga gratis *Antibióticos sin errores*: horarios, comidas, alcohol y las señales para volver al médico, en una página revisada por una química farmacéutica.
> → `https://edvanta.co/recurso/antibioticos-sin-errores` (por crear, con el mismo patrón de `/recurso/levotiroxina`)

**Para profesionales** (en todas las fichas):
> **¿Eres químico farmacéutico o regente?** En el curso *Stewardship Farmacéutico: PROA* aprendes a intervenir en la prescripción de antibióticos sin generar fricción y a medir su uso con indicadores.
> → https://edvanta.co/guia/stewardship-farmaceutico-proa

**Farmacocinética** (en vancomicina, aminoglucósidos, carbapenémicos y en las keywords de ajuste renal):
> **Del parámetro al paciente:** calcula el aclaramiento, ajusta la dosis según la función renal y entiende el monitoreo terapéutico, con casos. Ebook *Farmacocinética clínica aplicada*.
> → https://edvanta.co/guia/farmacocinetica-clinica-aplicada

**Diarrea por antibióticos** (en efectos secundarios y en las fichas de clindamicina, amoxicilina con ácido clavulánico y otras):
> **Antes de comprar un probiótico, entiende qué estás comprando.** *Guía de probióticos*.
> → https://edvanta.co/guia/guia-de-probioticos

**Instituciones** (en PROA, dispensación y resistencia):
> **¿Lidera una farmacia hospitalaria o una cadena de droguerías?** Formamos a su equipo con casos y ejercicios ajustados a su nivel de complejidad.
> → https://edvanta.co/empresas/farmacia-hospitalaria · https://edvanta.co/empresas/regentes-de-farmacia

**Antes de publicar cualquier CTA:** verificar los precios vigentes en Hotmart, la disponibilidad del curso y las condiciones de la capacitación. Este plan no publica precios.

## Producción por lotes

Cada lote entra en `noindex` hasta la revisión clínica de Karla. Las fuentes son la ficha técnica (CIMA, INVIMA, FDA y EMA) y guías como IDSA, OMS AWaRe y las guías de práctica clínica de MinSalud. Los registros vienen del CUM/INVIMA con fecha de corte y sin precios.

| Lote | Páginas | Por qué primero | Responsable |
|---|---|---|---|
| **1. Fichas de alta demanda** | Metronidazol, cefalexina, amoxicilina con ácido clavulánico, trimetoprim sulfametoxazol, nitrofurantoína, ciprofloxacino y clindamicina, más los CTA de amoxicilina y azitromicina | Concentran el mayor número de keywords P1 por página | Redacción: Claude Code. Revisión: Karla |
| **2. Fichas, segunda ola** | Secnidazol, dicloxacilina, claritromicina, ceftriaxona, penicilina benzatínica, levofloxacino, doxiciclina y fosfomicina | P1 de uso ambulatorio | Claude Code / Karla |
| **3. Venta profesional (BOFU)** | `farmacocinetica-pkpd-antibioticos` (nueva), enriquecer el curso PROA, stewardship y afiliados; `dispensacion-de-antibioticos-en-drogueria`; casos de antibióticos | Son las 155 keywords con intención de compra | Claude Code; Karla valida la oferta |
| **4. Pacientes transversales** | Pilar `antibioticos-para-que-sirven-tipos`, cómo tomarlos, efectos secundarios y probióticos, alergia a la penicilina, garganta, muela, piel, otitis y vaginosis | Enlazan todas las fichas; aquí vive el lead magnet | Claude Code / Karla |
| **5. Clases para estudiantes** | Cefalosporinas por generaciones, penicilinas, betalactámicos, macrólidos, quinolonas, aminoglucósidos y otras | Captan estudiantes y los llevan al ebook de farmacocinética | Claude Code |
| **6. Hospitalarios** | Vancomicina, meropenem, piperacilina con tazobactam, cefepime, cefazolina, amikacina, gentamicina y el hub de reserva | Público profesional: el ebook de farmacocinética y el curso PROA | Claude Code / Karla |
| **7. Resto** | Infecciones y fármacos P2 y P3 que faltan | Completar la cobertura | Claude Code |

**Desarrollo (en paralelo al lote 1):**

1. Crear `/recurso/antibioticos-sin-errores` con el patrón de `/recurso/levotiroxina`.
2. Añadir a `src/data/edvanta/capacitacion.js` el área B2B «Uso racional de antimicrobianos y PROA».

Ambos necesitan la aprobación de Karla sobre el contenido y el alcance.

**Enlazado interno de cada ficha:** el hub de la clase, dos fármacos de la misma clase o de comparación, una página de infección, la guía de uso seguro, la ficha de acetaminofén cuando aplique y el CTA profesional. Son al menos 5 enlaces, como pide `seo/plantilla-ficha-medicamento.md`.

## Cómo se mide

- **Atribución de ventas.** Los enlaces a Hotmart llevan `sck=vademecum-antimicrobianos`. Las solicitudes B2B se identifican por la página de origen.
- **Search Console, cada lunes.** Filtrar páginas con la expresión regular `para-que-sirve|antibiot|proa|farmacocinetica|cefalosporinas|penicilinas|macrolidos|quinolonas`. Anotar consultas con impresiones, clics y posición en `seo/medicion.md`.
- **Indicador principal:** consultas con impresiones del grupo. **De apoyo:** páginas indexadas, clics en los CTA, correos captados, ventas con `sck` y solicitudes B2B.

### Qué justificaría invertir más

A los 45 días de indexar los lotes 1 y 2 (16 fichas):

- **Acelerar** (lotes 6 y 7, línea B2B, webinar PROA) si se cumple una de estas condiciones:
  - 150 o más consultas con impresiones en el grupo;
  - 3 o más ventas atribuidas;
  - 2 o más solicitudes B2B.
- **Pausar y revisar** si hay menos de 50 consultas con impresiones. Antes de escribir más, revisar la indexación: el cuello de botella hoy es que Google indexe, no escribir.

## Siguiente paso

1. **Karla:** revisar el lote 2 (8 fichas y 7 clases) y anotarlo en `src/data/revisionClinica.js`.
2. **Claude Code:** pasar al lote 3 (venta profesional y BOFU): `farmacocinetica-pkpd-antibioticos`, curso PROA, stewardship, dispensación en droguería y casos.
3. **Open Code:** anotar su grupo en `seo/vademecum-asignaciones.md` antes de crear fichas.
