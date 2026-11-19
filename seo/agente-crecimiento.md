# Agente de Crecimiento: 100 certificados y 100 guías al día

Pedido de Karla (19-nov-2026): un agente que posicione los cursos de https://edvanta.co/cursos en Google y lleve a **100 certificados y 100 guías o ebooks vendidos al día**, y que programe, rastree y mida.

Este documento dice qué quedó construido, qué muestran los números y qué decisión de dirección se recomienda.

---

## 1. Qué es el agente

Tiene tres piezas: el motor que mide, el agente de Claude que decide y programa, y el registro de ventas en el sitio.

| Pieza | Dónde | Qué hace |
|---|---|---|
| **Motor** | `scripts/agente/agente.mjs` | `diario`: lee los sitemaps y rastrea /cursos, las 63 fichas propias, las 177 curadas y las 38 guías como las lee Google (sin JavaScript). Audita cada página, lee las ventas reales, calcula el embudo y escribe el reporte con las acciones del día ordenadas por impacto en ventas. `embudo` y `metricas` también corren por separado. |
| **Agente de Claude** | `.claude/agents/director-crecimiento.md` | Rol, meta, prioridades de dirección, formato de las piezas de campaña y reglas: Ley 1480, rigor clínico, propios frente a curados, nada de atajos que Google castiga. Usa Semrush para volúmenes y CPC y Firecrawl para ver a la competencia. |
| **Ciclo diario** | `.claude/skills/crecimiento-diario/SKILL.md` | El comando `/crecimiento-diario`: medir, elegir hasta tres acciones, programarlas con pruebas, verificar, hacer commit y reportar. |
| **Tablero de ventas** | `api/lib/agente-tablero.js` y `GET /api/admin/agente/tablero?dias=7` (con `x-admin-token`) | Por día, en hora de Colombia: certificados pagados, inscripciones, guías vendidas por Mercado Pago y por Hotmart, y clics de compra. Muestra el promedio de 7 días frente a la meta. |
| **Ventas de Hotmart** | `POST /api/hotmart-webhook` (`api/routes/hotmart-webhook.js`, migración 165) | Cada venta aprobada en Hotmart queda registrada una sola vez por transacción, con la guía que la originó (el `src` de los botones de `/guia/…`). |
| **Clics de compra** | `src/pages/GuiaVenta.jsx` | El botón de compra de cada guía registra `hotmart_clicked` en el servidor. Antes solo iba a Google Analytics. |

Salidas de cada corrida:

- `seo/agente/reportes/AAAA-MM-DD.md`: el reporte. Va al repositorio.
- `seo/agente/datos/AAAA-MM-DD/`: el rastreo, los hallazgos, las acciones, el tablero y `indexnow.txt`. Queda fuera de git.

Pruebas: `src/__tests__/agente-crecimiento.test.js` (18) y `api/tests/agente-tablero.test.js` (10).

---

## 2. Qué mostró la primera corrida (19-nov-2026)

Reporte completo en `seo/agente/reportes/2026-11-19.md`. Se rastrearon 279 páginas en 26 segundos.

**La parte técnica está sana.**

- Las 279 páginas responden 200 y son indexables.
- Todas tienen canónica propia.
- Ninguna tiene un precio anunciado distinto al que se cobra.
- Las fichas propias tienen unas 950 palabras visibles sin JavaScript.
- /cursos enlaza todas las fichas.

**Lo que frena la venta:**

1. **Las 63 fichas de cursos propios no enlazan ninguna guía.** Quien estudia gratis nunca ve una guía para comprar. Las fichas son las páginas con más tráfico, así que es la palanca más directa para la meta de guías.
2. **Las guías llegan a Google casi vacías.** 33 de 38 tienen menos de 400 palabras en el HTML del servidor (unas 200 en promedio). Problemas, logros, temario, autora y preguntas frecuentes solo aparecen con JavaScript.
3. **20 guías tienen títulos de más de 60 caracteres.** Google los corta.
4. **12 fichas propias enlazan menos de 3 cursos relacionados.**
5. **Las ventas de guías no se podían medir.** El evento `hotmart_purchase` existía, pero nada lo escribía. Ya quedó el webhook; falta activarlo en Hotmart.

---

## 3. Los números de la meta

El cálculo va hacia atrás, desde la venta hasta la visita. Las tasas son **supuestos** hasta que el tablero tenga volumen. El agente los reemplaza solo con 30 o más inscripciones propias, o con 90 o más clics de compra.

| Para 100 ventas al día | Certificados (COP 60.000) | Guías (promedio COP 24.526) |
|---|---:|---:|
| Tasas supuestas | 6 % de las visitas se inscribe; 5 % de los inscritos paga | 5 % de las visitas hace clic en comprar; 8 % de los clics compra |
| Paso intermedio diario | 2.000 inscripciones | 1.250 clics de compra |
| Visitas al mes | **1.000.000** | **750.000** |
| Ingreso bruto al mes | COP 180.000.000 | COP 73.578.000 |
| Tope de gasto en anuncios por venta | COP 20.055 | COP 7.726 |
| Tope por clic de anuncio | COP 60 | COP 31 |

Base de comparación (`seo/cursos-100k.md`):

- Todo edvanta.co recibe unas **816 visitas orgánicas al mes** (Semrush, 16-nov).
- Las fichas de curso recibieron **6 clics en 28 días** (Search Console, 18-nov).

**Lectura de dirección:**

- **Solo con Google orgánico, la meta no se alcanza este año.** Haría falta más de 1.000 veces el tráfico actual del sitio. Para captarlo, los temas tendrían que sumar unos 5 millones de búsquedas al mes en el top 3. Los cursos actuales suman entre 150.000 y 250.000 en toda Latinoamérica y España (`seo/cursos-100k.md`).
- **La publicidad pagada solo sirve si el clic cuesta menos de COP 31 a 60.** Ese es el tope por clic con estas tasas. Antes de invertir hay que compararlo con el CPC real de Semrush o de Google Ads. El 19-nov no se pudo verificar: la cuenta de Semrush no tenía unidades de API («API UNITS BALANCE IS ZERO»). El agente repite la comparación en cada reporte.
- **Las empresas son la palanca que escala más rápido.** Con contratos de 30 personas, la meta completa de certificados serían 100 contratos al mes. Con 20 contratos al mes se cubre una quinta parte, y cada contrato suele traer el siguiente.

---

## 4. Recomendación de dirección

| Prioridad | Qué | Qué dato la sustenta | Qué resultado justificaría invertir más |
|---|---|---|---|
| **1. Medir** | Desplegar esta rama, configurar el webhook de Hotmart y correr el agente con `EDVANTA_ADMIN_TOKEN` | Hoy no se sabe cuántas guías se venden al día | — (es requisito) |
| **2. Convertir lo que ya llega** | Venta cruzada de guías en las 63 fichas; guías con contenido completo en el HTML del servidor; títulos de guías de 60 caracteres o menos | Cero enlaces de ficha a guía; 200 palabras por guía | Si los clics de compra por cada 100 visitas a ficha pasan de 1 en 4 semanas, ampliar la venta cruzada al aula (barra y correos) |
| **3. Empresas** | Oferta «Capacitación para tu equipo» con certificados por volumen, página propia y lista de droguerías, laboratorios e IPS para contacto humano | 30 certificados por contrato frente a 0,3 % de conversión por visita (supuesto) | 3 contratos firmados en 60 días justifican un asesor comercial dedicado |
| **4. SEO acumulativo** | Clases abiertas que enlazan a su ficha y a la inscripción; guías con contenido propio; enlaces de universidades y gremios (`seo/PLAN-AUTORIDAD-ENLACES.md`) | 816 visitas al mes, solo 3 enlaces externos | Cuando las fichas pasen de 1.000 clics al mes, ampliar el catálogo a temas de mucho volumen (auxiliar de farmacia, farmacovigilancia) |
| **5. Anuncios** | Solo como prueba acotada | Tope por clic de COP 31 a 60 | Inscripción a pago de 8 % o más con 300 o más inscripciones a la semana: 14 días de Google Ads a COP 30.000 diarios en 5 búsquedas de alta intención. Seguir solo si el costo por venta queda bajo COP 20.055 |

---

## 5. Qué le toca a Karla

1. **Hotmart:**
   - Ir a *Herramientas › Webhook (API y notificaciones) › Nueva configuración*.
   - URL: `https://edvanta.co/api/hotmart-webhook`. Versión: 2.0.0.
   - Eventos: *Compra aprobada* y *Compra completa*.
   - Copiar el hottok en Coolify, servicio `api`, como `HOTMART_HOTTOK`, y volver a desplegar.
2. **Token del agente:** el agente lee las ventas con el mismo valor de `ADMIN_TOKEN`. En la sesión o en la tarea programada que corra el agente, ese valor va como `EDVANTA_ADMIN_TOKEN`. Nunca en un archivo.
3. **Promoción EDVANTA20:** vence el 30-nov. Decidir la oferta siguiente y crear el cupón en Hotmart antes de anunciarla.
4. **Venta cruzada:** aprobar qué guía va con cada área de cursos. El agente propone la tabla y Karla la revisa antes de publicarla.
5. **Search Console:** pedir cada día las 10 direcciones que trae el reporte.

---

## 6. Lo que el agente no hace

- No publica en redes ni envía correos masivos. Prepara las piezas para que Karla las revise.
- No compra enlaces, no crea páginas en masa sin contenido propio y no escribe reseñas.
- No rastrea datos personales ni sitios privados.
- No anuncia precios ni descuentos sin verificarlos (Ley 1480).
- No toma decisiones comerciales: las propone con datos.

---

## 7. Plan de posiciones: aparecer de primero en Google (19-nov, segunda parte)

Pedido de Karla: posicionar Edvanta lo más rápido posible para salir de primeros cuando la gente busque cursos.

Nadie controla el primer lugar de Google. Sí se controla qué tan fácil se lo dejamos. En la primera corrida, la parte técnica salió sana: las fichas son indexables, tienen canónica, Course con precio y unas 950 palabras. Lo que frena el posicionamiento son tres cosas:

1. Las páginas que deberían ganar las búsquedas amplias estaban vacías.
2. Faltan enlaces internos.
3. Hay solo 3 enlaces externos (autoridad).

### Lo que quedó hecho en esta rama (se ve en Google después de desplegar)

| Cambio | Antes, en producción (agente, 19-nov) | Después, en el build |
|---|---|---|
| **Escuelas como páginas pilar** (`SEO_ESCUELAS` en `src/data/edvanta/escuelas.js`, `scripts/lib/cursos-por-escuela.mjs`) | Título «Escuela de Salud y Farmacia Clínica \| Edvanta». Unas 150 palabras sin JavaScript. 3 de 5 escuelas no enlazaban ninguno de sus cursos propios. | Título con la búsqueda («Cursos de farmacología y farmacia clínica gratis \| Edvanta»). Los 63 cursos propios enlazados desde su escuela, con su búsqueda como texto del enlace. Introducción, preguntas frecuentes, `ItemList` y `FAQPage`. Farmacia clínica pasa de 3 a 22 cursos enlazados y de 387 a 657 palabras. |
| **Fichas propias con 3 o más cursos relacionados** (`api/routes/paginas-publicas.js`) | 12 fichas enlazaban de 0 a 2 cursos. | Si la categoría no alcanza, se completa con cursos de la misma área. |
| **Títulos de guías de 60 caracteres o menos** (`tituloSeoDeGuia` en `src/data/guiasVenta.js`) | 20 guías con el título cortado en Google. | Todos caben; la marca se acorta antes que el título. |
| **El agente vigila las escuelas** | — | Reglas nuevas: `escuela-sin-sus-cursos` y `enlace-a-curso-inexistente`. |

Pruebas nuevas:

- `src/__tests__/escuelas-pilar.test.js`
- `src/__tests__/guias-titulo-seo.test.js`
- `api/tests/fichas-relacionadas.test.js`

### Metas por nivel de dificultad

Datos de Semrush del 18-nov (`seo/semrush/cursos-2026-11-18.md`). KD es la dificultad de 0 a 100.

| Nivel | Búsquedas | Dificultad | Meta | Cuándo |
|---|---|---|---|---|
| **1. Nicho farmacéutico** | La búsqueda principal de cada uno de los 63 cursos propios: «curso de bioequivalencia», «curso de central de mezclas», «curso de radiofármacos», «curso de registro sanitario INVIMA»… | Baja: casi nadie tiene un curso propio de esos temas en español | Top 3 en 40 de las 63 | 4 a 8 semanas después de que Google indexe la ficha |
| **2. Escuelas y temas medianos** | «cursos de farmacología», «cursos de BPM», «cursos de asuntos regulatorios», «cursos de habilidades blandas», «curso de oratoria» en Colombia (880 al mes, KD 26), «cursos de farmacia» (140, KD 30), «curso de servicio al cliente» (260, KD 33) | Media | Primera página | 2 a 4 meses, con enlaces externos |
| **3. Búsquedas grandes** | «cursos gratis con certificado» (2.400, KD 66), «curso de manipulación de alimentos» (8.100, KD 51), «curso de oratoria» en México (1.900, KD 52) | Alta | Primera página | 6 a 12 meses. Exige autoridad: decenas de enlaces de calidad |

El nivel 1 casi no trae volumen, pero trae a quien ya quiere ese curso exacto: es el que más convierte en certificado. Los niveles 2 y 3 traen el volumen.

### Lo que acelera más fuera del código, en orden

1. **Desplegar** y pedir en Search Console la indexación de las 4 escuelas y de /cursos el mismo día. Después, las 10 direcciones diarias del reporte. **Responsable:** Karla.
2. **IndexNow** con `seo/agente/datos/<fecha>/indexnow.txt` justo después del despliegue. Llega a Bing, Copilot y la búsqueda de ChatGPT en horas. **Responsable:** Claude, si edvanta.co y api.indexnow.org están permitidos en el entorno.
3. **Enlaces externos.** Es el cuello de botella de los niveles 2 y 3. **Responsable:** Karla. El agente prepara textos y listas.
   - El kit de 7 correos a universidades y gremios ya está escrito (`seo/PLAN-AUTORIDAD-ENLACES.md`) y sigue sin enviarse.
   - Perfil de empresa en Google, LinkedIn de Edvanta, canal de YouTube con las clases y descripciones que enlacen a cada curso.
   - Alianzas académicas que publiquen el curso en su sitio.
4. **Primeros estudiantes y opiniones reales.** Google premia las fichas que la gente usa. Aplica la bandeja de Edvanta Assist y los correos automáticos que ya existen.
5. **Contenido de las guías (trabajo editorial).** 33 de 38 guías tienen menos de 400 palabras en sus datos: las de AtenFarmaClinic no tienen preguntas frecuentes y las de Feliz Sin Tiroides tienen una. El agente puede redactar borradores de preguntas y temario. Son temas clínicos y de nutrición, así que **cada borrador pasa por la revisión de Karla antes de publicarse** (`docs/CLINICAL_SAFETY.md`).

### Cómo se mide

- **Cada lunes:** Search Console › Rendimiento, filtrado por página `/curso-` y por `/escuelas/`. Se miran clics, impresiones, posición media y cuántas de las 63 búsquedas principales están en el top 3.
- **Cada día:** el agente revisa que ninguna escuela pierda sus enlaces y que ninguna ficha caiga a menos de 3 cursos relacionados.
