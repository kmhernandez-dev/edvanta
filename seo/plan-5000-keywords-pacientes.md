# Plan de 5.000 keywords: Edvanta Pacientes y vademécum profesional

21-nov-2026. Sigue `seo/PROMPT-MAESTRO-INDEXACION.md`.

- **Archivo:** `seo/keywords-5000-edvanta-pacientes.csv`
- **Generador reproducible:** `scripts/plan-keywords-pacientes-5000.mjs`

```bash
git fetch origin main && node scripts/plan-keywords-pacientes-5000.mjs
```

## Qué es y qué no es

- **Son 5.000 búsquedas objetivo, no 5.000 posiciones.**
  - Cada fila dice a qué página va la búsqueda, si esa página existe y qué oferta cierra la visita.
  - También trae la prioridad y lo que falta verificar.
- **El volumen está sin medir.**
  - Semrush no tenía unidades de API el 21-nov-2026 y no se inventaron cifras.
  - Cuando vuelvan las unidades, el siguiente paso es medir las P1 en base Colombia.
  - Esas cifras pueden cambiar las prioridades.
- **Mismas columnas que `seo/vademecum-antimicrobianos-2000-keywords.csv`**, para trabajar los planes juntos.

## Carril propio: lo que no se tocó

La otra sesión trabaja en `seo/plan-10000-keywords.md`. Este plan no usa nada suyo:

| Excluido | Cómo se aplicó |
|---|---|
| Sus 23 comunidades (`/comunidades/*`), incluida la enfermedad renal crónica | El generador lee `src/data/comunidadesSalud.js` en `main` y se detiene si una condición coincide |
| Sus clústeres 24 a 36: alergia, pediatría, embarazo, dolor neuropático, antibióticos, tiroides avanzada, salud metabólica, adultos mayores, medicina de familia, salud sexual y apnea | Filtro de términos reservados. Por eso no hay «[medicamento] en el embarazo» ni prevención del VIH (PrEP, PEP, pruebas): son de su clúster de salud sexual |
| Sus 100 fichas de `/medicamentos` y los 44 medicamentos de su biblioteca `/salud` | Ningún medicamento de esas listas entra en búsquedas de pacientes. Ninguno de los 76 de alto costo coincidió |
| Sus patrones de vademécum: «[medicamento] dosis», «efectos secundarios», «interacciones», «cuidados», «ficha de» | El vademécum usa solo modificadores profesionales. «Ficha técnica» se omite en los medicamentos que ella tiene |
| Keywords ya planeadas en cualquier CSV de `seo/`, en esta rama o en `main` | Se descartaron 162 repetidas |

## Los siete grupos

| Grupo | Keywords | P1 | Páginas | Destino | Oferta principal |
|---|---:|---:|---:|---|---|
| 1. Vademécum profesional | 1.673 | 51 | 98 | `/vademecum/{medicamento}` (las 98 monografías) | Curso del grupo; secundaria, guía o capacitación para empresas |
| 2. Condiciones de alto costo | 1.498 | 232 | 175 | Hub `/contigo/{condición}` y 4 satélites por condición en `/articulos/` | Programa Contigo Alto Costo; en cáncer, también la lista de interés de Tu Ruta Oncológica |
| 3. Medicamentos de alto costo para pacientes | 1.059 | 159 | 76 | `/articulos/{medicamento}-para-que-sirve` | Programa Contigo Alto Costo y el hub de la condición |
| 3b. Medicamentos de alto costo para profesionales | 414 | 0 | 73 | `/vademecum/{medicamento}` (monografías nuevas) | Curso de oncología, terapias dirigidas, inmunoterapia, quimioterapia o farmacología clínica |
| 4. Acceso y derechos en Colombia | 122 | 32 | 15 | Pilares en `/articulos/` (MIPRES, tutela, EPS, PBS, alto costo, biosimilares, huérfanas) | Programa Contigo Alto Costo |
| 5. Cuidadores | 49 | 11 | 5 | Pilares en `/articulos/` | Programa Contigo Alto Costo |
| 6. Profesional en alto costo | 185 | 22 | 17 | Farmacia oncológica, biológicos, PSP, terapia de reemplazo enzimático, antirretrovirales | Cursos de oncología y biológicos; guías TRE y fibrosis quística; capacitación en `/empresas/{área}` |
| **Total** | **5.000** | **507** | **459** | | |

**Prioridades:** 507 P1, 2.033 P2 y 2.460 P3. Para llegar a 5.000 exactas se recortaron 665 P3, empezando por los modificadores más débiles del vademécum.

**Monografías del vademécum en `noindex`:** sus keywords bajan un nivel de prioridad hasta que se revisan.

## Estado de las 459 páginas

| Estado | Páginas | Keywords |
|---|---:|---:|
| Publicada e indexable: enriquecer | 30 | 552 |
| Publicada en `noindex`: falta la revisión de Karla | 69 | 1.187 |
| Guía de venta existente | 2 | 8 |
| Por crear: hub de condición en Contigo | 35 | 546 |
| Por crear: artículo satélite | 140 | 952 |
| Por crear: ficha «para qué sirve» | 76 | 1.059 |
| Por crear: monografía del vademécum | 73 | 414 |
| Por crear: artículo pilar | 29 | 245 |
| Por crear: grupo del vademécum | 5 | 37 |

## Prioridad recomendada

### 1. Revisión de las 69 monografías en `noindex` (responsable: Karla)

- Libera **1.187 keywords** sin escribir una página nueva.
- Las monografías ya están publicadas y enlazan a los cursos.
- Es la acción con mejor relación entre esfuerzo y resultado de todo el plan.
- **Siguiente paso:** las reviso por grupos y le envío a Karla la lista de URLs por grupo, con las fuentes.

### 2. Ola 1 de pacientes (responsable: Claude; revisión: Karla)

Cinco condiciones:

| Condición | Keywords |
|---|---:|
| Cáncer de mama | 42 |
| Cáncer colorrectal (con colon) | 72 |
| Cáncer de pulmón | 42 |
| Cáncer de próstata | 42 |
| Artritis reumatoide | 38 |

Cada condición lleva:

- su hub;
- sus satélites;
- las fichas «para qué sirve» de sus medicamentos de alto costo: trastuzumab, pertuzumab, palbociclib, tamoxifeno, letrozol, bevacizumab, capecitabina, pembrolizumab, osimertinib, enzalutamida, abiraterona, adalimumab, etanercept, tofacitinib y los demás de su condición en el CSV.

Por qué primero:

- Edvanta ya posiciona con el patrón «para qué sirve» (Semrush, 16-nov-2026: 347 keywords, casi todas de ese tipo).
- El vademécum ya tiene el grupo de oncología de alto costo indexable.

### 3. Pilares de acceso y derechos

Son tres pilares: MIPRES, tutela para medicamentos y «la EPS no entrega medicamentos».

- Ningún competidor extranjero puede responderlos, porque son del sistema colombiano.
- Cada hub de condición enlaza a ellos.

### 4. Después, según la medición

Vienen las olas 2 (VIH y hepatitis C) y 3 (hemofilia y huérfanas), y las 73 monografías profesionales nuevas.

En las condiciones de la ola 3, los satélites se fusionan en el hub hasta medir el volumen. Así se evitan páginas delgadas y plantillas repetidas (regla 7 del prompt maestro).

## Qué justifica invertir más

Se mide a los 30, 60 y 90 días en Search Console por URL. Los eventos de clic a curso, guía y programa ya existen.

| Señal | Umbral para seguir invirtiendo |
|---|---|
| Monografías revisadas | Cada una aparece en 10 o más consultas con impresiones a los 60 días |
| Hubs de la ola 1 | 20 o más consultas con impresiones por hub a los 60 días |
| Clic de pacientes al programa | 2 % o más de las visitas a hubs y fichas llegan a `/contigo/alto-costo` |
| Clic de profesionales a cursos | 2 % o más de las visitas a monografías hacen clic en el curso o la guía |
| Programa abierto | Registros con autorización activa por semana: la métrica norte de `docs/pacientes/README.md` |

Si la ola 1 no llega a esos umbrales a los 90 días, no se abren las olas 2 y 3. En su lugar se revisan los títulos, el enlazado interno y la intención de búsqueda de las páginas que no rinden.

## Requisitos antes de escribir

1. **Ruta nueva.** Los hubs `/contigo/{condición}` necesitan la ruta `/contigo/:condicion` (hoy solo existe `/contigo/tiroides`) y entrar al prerender.
2. **Programa sin desplegar.** El programa Contigo Alto Costo está construido en esta rama, sin desplegar y con el registro cerrado. Mientras no se abra:
   - en cáncer, el CTA principal debe ser la lista de interés de Tu Ruta Oncológica, que ya existe;
   - en las demás condiciones, debe ser `/contigo`.
3. **Contenido de salud nuevo en `noindex`** hasta la revisión de Karla, con fuentes:
   - ficha técnica (CIMA), CUM del INVIMA, guías oficiales;
   - Cuenta de Alto Costo para cifras.
4. **Medicamentos con fórmula:** denominación común, sin marcas ni promoción (Decreto 677 de 1995, art. 79).
5. **Normas:** las 7 keywords que citan una ley o decreto llevan la nota de verificarlas en el normograma antes de escribir.
6. **Cursos:** desde el 20-nov se venden con certificado y la primera unidad es gratis.
   - Las ofertas del CSV ya lo dicen así.
   - 10 cursos de oncología, biológicos, diabetes, anticoagulación y farmacología clínica llevan la nota de confirmar que su ficha está publicada antes de enlazarla.
