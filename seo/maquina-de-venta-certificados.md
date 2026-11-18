# Máquina de venta de certificados y guías (18-nov-2026)

Pedido de Karla: al inscribirse, dos opciones. «Estudiar con certificado» lleva al pago con Mercado Pago y
«Estudiar gratis» inscribe sin certificado. Además: mucha publicidad para el certificado, precios por país
con un descuento del 60-70 % (pago final entre COP 60.000 y 65.000) y posicionar cursos y guías en Google.

## Decisiones de Karla (18-nov, selector de preguntas)

1. **Descuento real (opción A).** Precio de lista COP 199.000. Quien compra el certificado al inscribirse o en
   sus primeros 7 días paga el precio con descuento; después, el de lista. Las inscripciones anteriores al
   lanzamiento (18-nov) cuentan sus 7 días desde el lanzamiento.
2. **Países.** Colombia COP 60.000 (−70 %); el resto COP 65.000 (−67 %). Siempre se cobra en COP; fuera de
   Colombia se muestra el equivalente aproximado en moneda local. Sin país conocido: precio de Colombia.
3. **Acompañamiento.** Por WhatsApp, con Karla o un docente, respuesta en 48 horas hábiles. Quien estudia
   gratis queda solo con quices automáticos: la revisión docente de actividades es del camino con certificado.
4. **Guías.** Llevan precio en Google, tomado de Hotmart.

Por qué es legal (Ley 1480 de 2011, arts. 29, 30 y 33; SIC): el precio de lista se cobra de verdad a quien
compra después del plazo; el plazo es personal y real (cuenta desde la inscripción), no un contador que se
reinicia; y la página dice cuándo vence y cuánto se paga después.

## Qué quedó

| Pieza | Dónde | Qué hace |
|---|---|---|
| Oferta | `api/lib/precio-certificado.js` (`OFERTA_CERTIFICADO`) | Una sola fuente para ficha, aula, checkout, correos y JSON-LD. País por `CF-IPCountry`. |
| Precio para quien mira | `GET /api/aula/precio-certificado/:courseId` | Sin caché: precio, lista, %, vence, país y `equivalente` (moneda local). |
| Equivalente local | `api/lib/tasas-de-cambio.js` | Tasas de open.er-api.com (base COP, diaria), 12 h en memoria; si falla, no se muestra. |
| Dos caminos | `src/components/curso/DosCaminos.jsx` en la tarjeta de `/curso-de-…` | «Estudiar con certificado» destacado con precio, tachado, % y beneficios; crea cuenta si hace falta (`?camino=certificado` sigue al pago), inscribe y abre Mercado Pago; vuelve a `/aula/<curso>/certificado`. «Estudiar gratis» inscribe. |
| Barra móvil y sección del certificado | `FichaDeCurso.jsx` | Mismo precio y mismo camino. |
| Recordatorio en cada clase | `src/aula/components/RecordatorioCertificado.jsx` | Gratis: beneficios, precio y pago directo (se cierra por sesión). Pagado: enlace de acompañamiento por WhatsApp. |
| Actividades | `api/routes/aula/pedagogia.js` + `revisionIncluida` en `checkout.js` | Borrador y envío responden 402 `actividad_con_certificado` a quien estudia gratis; la página muestra cómo pasarse. Sin costo, institución, pagado o emitido: incluida. |
| Beneficios | `src/data/beneficiosCertificado.js` | Certificado, verificable, PDF/LinkedIn, acompañamiento y revisión (todos confirmados). |
| Correos | `correos-embudo.js`, `embudo-programado.js` | La bienvenida dice precio, lista y fecha de vencimiento de esa inscripción. |

## SEO

- **Cursos propios:** `Course.offers` con `price` (COP 60.000, precio de Colombia dentro del plazo),
  `priceCurrency`, `category: Partially Free` y `availability`. El HTML del servidor tiene «Dos formas de
  estudiar este curso» y la pregunta «¿Puedo estudiarlo gratis? ¿Cuánto cuesta el certificado?»; la ficha usa
  las mismas preguntas (`preguntasDeCurso`).
- **Guías (`/guia/…`):** `datosDeGuia` (en `guiasVenta.js`) arma el JSON-LD para la página y el prerender:
  `Book`+`Product` (o `Course`) con `offers` del precio real de Hotmart para Colombia, visible también en la
  página. Precios en `src/data/preciosGuias.js`, generados por `node scripts/precios-guias-hotmart.mjs`
  (38/38 el 18-nov). **Volver a correrlo cuando cambie un precio en Hotmart.** El HTML prerenderizado muestra
  además preguntas frecuentes, autora, formato y guías relacionadas.

## Embudo dentro del aula (18-nov, segunda parte)

Estrategia: presencia constante pero sin cansar, mensajes en los momentos de logro y urgencia solo con la
fecha real de cada persona.

1. **Barra fija arriba de cada clase** (`src/aula/components/BarraCertificado.jsx`, en el `banner` del
   reproductor): «Estás estudiando gratis. Certificado, revisión de actividades y acompañamiento por $60.000
   ~~$199.000~~ −70 % hasta el <su fecha>» + «Estudiar con certificado», que abre la misma comparativa de la ficha.
2. **Tarjeta en el momento de logro**: bajo la clase solo cuando la persona la completó («¡Clase completada!
   Llevas el X % del curso…»), no en cada pantalla.
3. **Actividad bloqueada**: al intentar enviar una actividad, la tarjeta explica que la revisión docente es del
   camino con certificado.
4. **Correo `certificado-por-vencer`**: una sola vez, cuando faltan 48 horas o menos para que venza el
   descuento de esa inscripción, con sus precios y su fecha.
5. Sin contadores falsos, sin ventanas que se abren solas, sin bloquear el contenido gratis.
