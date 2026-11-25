# 3.000 keywords para vender las guías a pacientes y llenar las tres comunidades

**Fecha:** 25-nov-2026. **Detalle:** `seo/keywords-3000-guias-pacientes.csv`. **Se regenera con:** `node scripts/plan-keywords-guias-3000.mjs`.

## Las tres comunidades con grupo de WhatsApp

| Comunidad | Página | Keywords |
|---|---|---|
| Feliz Sin Tiroides | `/feliz-sin-tiroides#comunidad` | 900 |
| Grupo de apoyo de tiroides | `/comunidades/tiroides` | 1.200 |
| Grupo de apoyo de diabetes tipo 2 | `/comunidades/diabetes-tipo-2` | 900 |

Cada fila del CSV trae el enlace del grupo, la página que debe responder la búsqueda y la guía de Hotmart que se recomienda en ella.

## Cómo se armaron

- **Tema × forma de buscar.** Las formas son las que mostró Google Trends en Colombia (`seo/trends/guias-2026-11-25.md`) y el autocompletado guardado en `seo/keywords-comunidades.csv`: «… pdf», «qué comer con…», «se puede comer…», «… cuidados», «cómo bajar de peso con…», «puedo tomar… con levotiroxina».
- **Nuevas:** ninguna está en los otros CSV de `seo/` (42.000 keywords ya planeadas).
- **Sin volumen medido.** No son búsquedas confirmadas una por una: el autocompletado de Google no estaba disponible en esta sesión y Semrush no tenía unidades. Son hipótesis que se confirman en Search Console.
- **Muchas keywords, pocas páginas.** Las 3.000 se responden con 144 páginas (5 ya publicadas). Los alimentos van por grupo: una página «frutas e hipotiroidismo» responde 56 búsquedas, no 56 páginas.

## Qué guía vende cada bloque

| Guía | Keywords | Temas que la alimentan |
|---|---|---|
| Aprende a comer con hipotiroidismo | 392 | Menús y listas en PDF; alimento por alimento |
| Colección Bienestar Tiroideo | 224 | Cirugía de tiroides, vivir sin tiroides, cáncer y nódulos |
| Aprende a comer con un enfoque antiinflamatorio | 223 | «Dieta antiinflamatoria … pdf»; alimentos y tiroides |
| Sana tu metabolismo | 194 | Bajar de peso con hipotiroidismo o Hashimoto; hábitos con diabetes |
| Levotiroxina sin sorpresas | 180 | Con qué se puede tomar; rutina y dudas |
| Guía definitiva del hipotiroidismo | 133 | Suplementos, etapas de la vida, día a día |
| Nutrir tu tiroides: Hashimoto | 125 | Menús y alimentos con Hashimoto |
| Guía de yodoterapia I-131 | 120 | Preparación, dieta baja en yodo, aislamiento y cuidados |
| Desinflama tu estómago en 21 días | 116 | «Cómo desinflamar el estómago…»; síntomas digestivos |
| Maneja los síntomas de la tiroides | 116 | Síntoma por síntoma |
| Jugos digestivos para tu tiroides | 91 | Recetas de jugos y bebidas |
| Probióticos | 78 | Para qué sirven, cómo elegir y cómo tomarlos |
| Guía completa de ayunos | 60 | Ayuno con hipotiroidismo y levotiroxina |
| Otras seis guías | 175 | Hipertiroidismo, emociones, autocuidado, cabello e insomnio |
| **Sin guía propia** | **813** | **Diabetes: alimentos, exámenes, medicamentos y síntomas** |

## El hueco: diabetes no tiene guía

De las 900 keywords de diabetes, 813 no tienen una guía que vender. Las guías actuales son para pacientes tiroideos; solo «Sana tu metabolismo» encaja en hábitos y peso. Esas páginas llenan el grupo de WhatsApp, pero no venden.

La búsqueda que más se repite es de alimentación («menú semanal para diabetes pdf», «lista de alimentos», «los diabéticos pueden comer…»). Una guía «Aprende a comer con diabetes tipo 2», con el mismo formato de las de tiroides, convertiría ese bloque en ventas. Es decisión de Karla.

También hay dos productos de Feliz Sin Tiroides sin enlace de Hotmart ni página de venta: «Vivir sin tiroides» y la guía de postoperatorio. Las 149 keywords de cirugía y de vida sin tiroides hoy llevan a la Colección.

## Orden de trabajo

1. **P1 (1.210 keywords).** Las de compra («… pdf», menús, listas, recetarios), levotiroxina, peso, yodoterapia, estómago, probióticos y ayuno.
2. **P2 (1.642).** Alimento por alimento, suplementos, síntomas, exámenes y medicamentos.
3. **P3 (148).** Etapas de la vida y alimentos con «tiroides» en general.

Cada página nueva:

- responde su grupo de búsquedas con un H2 por búsqueda y una respuesta directa en la primera frase;
- lleva la tarjeta de la guía (sale sola si el título encaja en `src/data/guiaParaArticulo.js`) y el bloque del grupo de apoyo (agregar el slug a `articulos` o `cluster` de la comunidad en `src/data/comunidadesSalud.js`);
- se publica en `noindex` hasta que Karla confirme la revisión clínica.

Lo que no se escribe: dosis, «cuánto puede comer» como cifra personal, ni promesas de bajar de peso o de curar. Las búsquedas de medicamentos se responden con qué preguntar y dónde confirmar la indicación.
