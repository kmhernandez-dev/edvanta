# Revisión clínica de los artículos de salud

## Estado al 9 de noviembre de 2026

- **184 artículos de salud revisados.** Karla Hernández, química farmacéutica con tarjeta profesional y autora de los artículos, confirmó por escrito que los revisó todos.
- **Cómo quedaron:**
  - Su nombre figura como autora y como revisora, con la fecha.
  - El nombre de revisora enlaza a su LinkedIn; el de autora, a `/autores/karla-hernandez`.
  - Los datos estructurados llevan `author`, `reviewedBy` y `lastReviewed`.
- **Ya son indexables:** entraron al sitemap de artículos, que pasó de 147 a 331 URL.
- **Dónde está el registro:** `src/data/revisionClinica.js`. Es el único lugar donde se anota una revisión; `src/data/articulos.js` lo aplica a cada artículo.

## Regla para todo artículo nuevo de salud

Un artículo de salud se publica en `noindex` hasta que tenga revisor y fecha (`src/lib/seo/indexabilidad.js`). Es de salud si:

- es de las marcas `fst`, `contigo` o `atenfarma`;
- o su público es «pacientes»;
- o su categoría es clínica.

Para que entre al índice, se agrega su línea al registro **después** de la revisión, nunca antes.

```js
// src/data/revisionClinica.js
'slug-del-articulo': { revisor: 'Nombre Apellido, Química Farmacéutica', revisorUrl: 'https://www.linkedin.com/in/…', reviewedAt: 'AAAA-MM-DD' },
```

La prueba `src/__tests__/revision-clinica.test.js` exige cuatro cosas:

1. que el artículo exista y sea de salud;
2. que el revisor tenga nombre;
3. que la fecha sea real y no futura;
4. que las revisiones de Karla enlacen a su perfil.

## Lista de verificación (unos 10 minutos por artículo)

1. **Dosis y cantidades.** Coinciden con la ficha técnica o la guía citada. No se dan dosis para automedicarse.
2. **Indicaciones.** Son las aprobadas. Si se menciona un uso fuera de indicación, se dice que lo es.
3. **Advertencias.** Embarazo, lactancia, niños, adultos mayores, riñón e hígado, donde aplique.
4. **Interacciones.** Las relevantes, con la conducta («sepáralo 4 horas», «consulta antes de…»).
5. **Señales de alarma.** Cuándo consultar de inmediato.
6. **Afirmaciones.** Nada de «cura», «elimina», «garantiza» ni «sin efectos secundarios» como afirmación.
7. **Fuentes.** Al menos una de referencia: autoridad sanitaria, ficha técnica, guía clínica o revisión sistemática. Fecha de consulta.
8. **Vigencia en Colombia.** Registro sanitario, condición de venta y normas citadas, vigentes.

## Informe de calidad para mejorar los artículos ya revisados

`node scripts/pre-revision-clinica.mjs --todos` genera dos archivos:

- `cola.csv`: una fila por artículo.
- `pre-revision.md`: el detalle de cada uno.

Qué señala el informe:

- prioridad: tiroides primero;
- frases con dosis;
- poblaciones especiales;
- afirmaciones absolutas no negadas;
- fuentes de referencia.

Hallazgos del 9 de noviembre:

- **53 artículos sin fuente de referencia.** Agregar la ficha técnica, la guía o la autoridad sanitaria es la mejora que más suma confianza (E-E-A-T).
- **43 artículos con frases para releer.** Contienen palabras como «cura», «elimina» o «garantiza» sin negación. Casi siempre son preguntas o advertencias, pero vale la pena una lectura.
- **Ningún par de artículos casi duplicado.**

Sin el argumento `--todos`, el script lista solo los artículos de salud que aún no están en el registro: es la cola para los artículos nuevos.
