# 5.000 keywords para ampliar las clases del aula

**Fecha:** 25-nov-2026. **Detalle:** `seo/keywords-5000-clases.csv`. **Se regenera con:** `node scripts/plan-keywords-clases-5000.mjs` (después de `node scripts/auditar-formato-clases.mjs`).

## De dónde salen

De `seo/keywords-cursos.csv`: el autocompletado de Google (es-CO) recogido en noviembre para cada curso propio. Son búsquedas reales, sin volumen medido.

| Situación de la búsqueda | Keywords |
|---|---|
| Nadie la respondía (estaba como «hueco») | 4.616 |
| Hoy solo la responde la ficha del curso | 384 |
| **Total** | **5.000** |

Se revisaron 15.524 búsquedas. Se descartaron 630 por ruido (otro idioma, universidades, marcas, empleo, imágenes). De las demás, 5.811 encajan con una clase y se tomaron las 5.000 de mejor encaje.

## Cómo se asignó cada búsqueda a una clase

Por coincidencia de palabras, sin contar las del nombre del curso:

- **«La clase ya trata esto» (3.556):** sus palabras propias están en el título, los conceptos o la lectura de la clase. Falta responderla de forma directa.
- **«La clase trata el tema, pero no este punto» (1.444):** el tema está en el título de la clase y el punto concreto no aparece. Es contenido por agregar.

La asignación es automática: antes de escribir, quien redacta confirma que la búsqueda corresponde a la clase. El autocompletado trae ruido que el filtro no alcanza a quitar del todo.

## Qué clases cubre

- 684 de las 1.714 clases, en 62 de los 63 cursos. Las otras 1.030 clases no tienen búsquedas reales recogidas que encajen.
- La mitad de las clases recibe una o dos búsquedas; 29 clases concentran más de 30 cada una (insulinas, ISO 9001, diuréticos, levotiroxina). Esas 29 son las de más demanda.

## Dónde se responde cada búsqueda, dentro del formato de clase

| Sección del formato | Keywords |
|---|---|
| La clase en texto: párrafo o subtítulo propio | 3.498 |
| Referencias y «Para profundizar» (norma vigente y enlace oficial) | 418 |
| Conceptos clave (definición en una frase) | 258 |
| La clase en texto: sección con ese subtítulo (dosis, efectos, mecanismo…) | 237 |
| Errores frecuentes | 193 |
| Resumen y puntos clave | 98 |
| Caso para decidir y ejemplo aplicado | 83 |
| Mapa conceptual | 67 |
| Mapa de proceso | 65 |
| Repaso: pregunta frecuente | 47 |
| La clase en texto: tabla comparativa | 36 |

## Orden de trabajo

La prioridad sale del estado de la clase en `docs/auditoria-aula/formato-clases.md`:

| Prioridad | Keywords | Qué se hace |
|---|---|---|
| P1 · la clase ya tiene contenido propio | 2.232 | Agregar la respuesta en la sección indicada |
| P2 · la clase tiene contenido de plantilla | 2.121 | Reescribir la clase con contenido propio, como las de Farmacoterapia, e incluir la respuesta |
| P3 · la clase no tiene la estructura moderna | 647 | Crear primero la experiencia de la clase |

Reglas al escribir (las de `seo/PROMPT-MAESTRO-INDEXACION.md`):

- nada inventado: normas verificadas en el normograma del INVIMA, dosis y datos clínicos contra ficha técnica o guía vigente;
- la búsqueda va como subtítulo o como pregunta, con la respuesta en la primera frase;
- una clase no repite lo que ya responde otra: si dos clases compiten por la misma búsqueda, se deja en la más específica;
- el contenido clínico nuevo pasa por la revisión de Karla antes de publicarse.
