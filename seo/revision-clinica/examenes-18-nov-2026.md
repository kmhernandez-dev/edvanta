# Revisión clínica · exámenes interactivos (18-nov-2026)

Los seis exámenes públicos tienen **60 preguntas** con respuesta correcta, explicación y fuente. La página del examen y el hub están creados; los exámenes están en **`noindex,follow`** hasta que Karla revise las preguntas y se anoten en `REVISION_EXAMENES` (`src/data/examenes/index.js`). El hub `/examenes` sí es indexable.

## Qué revisar

| Examen | Preguntas | Temas | Fuente principal |
|---|---|---|---|
| `examen-de-farmacologia-general` | 10 | Farmacocinética, farmacodinamia, interacciones, RAM, ajuste renal | Katzung 16.ª ed. 2024; FDA; EMA |
| `examen-de-hipertension-arterial` | 10 | Diagnóstico, metas, primera línea, crisis, embarazo, adherencia | ESC 2024; ACC/AHA 2025; KDIGO 2024 |
| `examen-de-diabetes-tipo-2` | 10 | Diagnóstico, metformina, iSGLT2, GLP-1, hipoglucemia, insulina | ADA 2025; KDIGO 2024; FDA |
| `examen-de-antibioticos` | 10 | Mecanismos, resistencia, alergias, duración, stewardship | OMS AWaRe 2023; OMS RAM; FDA |
| `examen-de-atencion-farmaceutica` | 10 | Minnesota, PRM/RNM, entrevista, conciliación, seguimiento | Cipolle 2012; PCNE 2020; FIP 2023 |
| `examen-de-farmacovigilancia` | 10 | RAM, reporte, causalidad, señales, plazos INVIMA | Resolución INVIMA 2024015321/2024; OMS |

## Puntos de mayor cuidado

- **Hipertensión:** umbral 140/90 en consultorio y 135/85 en casa según ESC 2024; la guía AHA/ACC 2025 usa 130/80. El examen lo aclara.
- **Diabetes:** HbA1c ≥6,5 %; metformina primera línea; iSGLT2 y GLP-1 según comorbilidad; hipoglucemia con 15 g de carbohidrato y control a los 15 minutos.
- **Antibióticos:** no tratar infecciones virales; cultivos sin retrasar; desescalada; fluoroquinolonas y tendinopatía; profilaxis quirúrgica en dosis única.
- **Atención farmacéutica:** PRM es causa en el proceso; RNM es resultado en salud; la entrevista usa preguntas abiertas; la remisión es parte de la seguridad.
- **Farmacovigilancia:** reportar sospechas; graves en 15 días calendario y no graves en 90 días según la Resolución 2024015321; no confundir RAM con error de medicación.
- **Farmacología general:** primer paso, estado estacionario, CYP3A4, orden cero, índice terapéutico estrecho, reacciones tipo A y ajuste renal.

## Cómo aprobar e indexar

Añadir en `src/data/examenes/index.js`:

```js
export const REVISION_EXAMENES = {
  'examen-de-farmacologia-general': {
    revisor: 'Karla Hernández, Química Farmacéutica',
    reviewedAt: '2026-11-XX',
  },
  // ... una entrada por examen revisado
};
```

Después:

1. `npm.cmd run build`.
2. Verificar que las páginas salgan `index,follow` y entren al sitemap.
3. Avisar a Bing con `node scripts/indexnow.mjs --desde=2026-11-18`.
4. Pedir en Search Console las seis URLs de examen.

Mientras no haya revisión, los exámenes se pueden usar y enlazar, pero no compiten en Google.
