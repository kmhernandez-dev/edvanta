# Sistema de gestión de diseño de Edvanta

Trabajamos sobre datos: cada cambio visual responde a un hallazgo medido, tiene una acción correctiva y se verifica con una nueva medición. Funciona como un ciclo CAPA.

## Cómo funciona

1. **Medir.** En `/admin/auditoria-diseno`, «Correr la auditoría» abre 8 páginas a 390 y 1366 px y las compara con 11 criterios (`src/data/auditoriaDiseno.js`). El JSON se descarga y se guarda en esta carpeta con su fecha.
2. **Registrar.** Cada criterio que falla se anota abajo como hallazgo, con su evidencia y su causa.
3. **Corregir.** Se aplica la acción correctiva en el código.
4. **Verificar.** Se vuelve a medir.
   - Si el criterio se cumple, el hallazgo se cierra.
   - Si la medida mejora de forma estable, el umbral se endurece; nunca se afloja.
5. **Proteger.** La acción queda vigilada por una prueba automática (`src/__tests__/auditoria-diseno.test.jsx`). Si alguien la deshace, las pruebas fallan antes de publicar.

**Frecuencia:** después de cada cambio de diseño y una vez al mes.

## Línea base: 11-nov-2026 (código en producción, commit 06767c6)

| Página · ancho | Peso normal | Peso 800+ | Menos de 12 px | Tamaños | Radios | Colores fuera | Degradado | Imágenes retiradas | Alto |
|---|---|---|---|---|---|---|---|---|---|
| Inicio · 1366 | 11,4 % | 17,6 % | 202 | 13 | 10 | 6 | 1 | 2 | 8.461 px |
| Inicio · 390 | 10,5 % | 17,8 % | 202 | 13 | 9 | 6 | 1 | 2 | 9.975 px |
| Instituciones · 1366 | 24,1 % | 11,4 % | 103 | 13 | 11 | 6 | 1 | 0 | 7.658 px |
| Contigo · 1366 | 21,5 % | 15,9 % | 100 | 15 | 9 | 9 | 0 | 0 | 6.266 px |
| Escuelas · 1366 | 67,7 % | 8,3 % | 8 | 12 | 9 | 5 | 1 | 0 | 5.034 px |
| Cursos · 1366 | 46,7 % | 2,1 % | 147 | 11 | 8 | 12 | 1 | 0 | 7.127 px |
| Ficha de curso · 1366 | 54,9 % | 1,0 % | 30 | 24 | 11 | 9 | 0 | 0 | 6.918 px |
| Feliz Sin Tiroides · 1366 | 46,5 % | 9,9 % | 8 | 14 | 12 | 5 | 1 | 0 | 5.666 px |
| Acceso · 1366 | 67,7 % | 1,1 % | 11 | 9 | 8 | 4 | 0 | 0 | 2.104 px |

## Hallazgos y acciones

| Id | Hallazgo (dato) | Causa raíz | Acción correctiva | Verificación | Estado |
|---|---|---|---|---|---|
| H1 | 18 % de los textos en peso 800 | `font-extrabold` en títulos de tarjeta repetidos ~80 veces | El 800 queda solo para el `h1`; títulos de tarjeta en 700 | Inicio: 0,3 % (máx. 5 %) | Cerrado |
| H2 | 10,5 % de textos en peso normal | Datos y etiquetas de 12 px en 600/700 | Datos de tarjeta en 13 px peso normal; `text-xs` semi-negrilla pasa a 500 | Inicio: 55,4 % (mín. 40 %) | Cerrado |
| H3 | 202 textos de menos de 12 px en el inicio | 463 clases `text-[9–11px]` en 105 archivos e insignias de 10,9 px | 210 clases llevadas a 12 px; insignias retiradas (H14). Prueba: ninguna clase menor de 12 px | Inicio, instituciones, cursos y escuelas: 0. Quedan 11 en la ficha y 6 en Contigo (CSS propio) | Abierto |
| H5 | 13–24 tamaños distintos | Tamaños sueltos (10,88; 13,5; 15,5 px…) | Escala `--ds-fs-xs…lg`; títulos de tarjeta a 16 px | 9–17 (máx. 9) | Abierto |
| H6 | 9–12 radios distintos | Radios por defecto de Tailwind (4, 6, 12, 16, 24) fuera de la escala | Radios de Tailwind alineados a 8 · 10 · 14 · 20 · 28; 18 radios sueltos corregidos; prueba de control | 5–10 (máx. 6) | Abierto |
| H7 | Colores fuera del sistema: `#EEF5FA` ×90, `#17223B`, grises de Tailwind, paleta vieja del carrito | Paleta `edvanta.soft` y `--ed-text` desalineadas; componentes con `gray-*` y `navy-*` | `soft` → `#F4F7FD`, `--ed-text` → `#14233F`; carrito, catálogo, ficha y Contigo a variables; prueba de control | Producción por verificar tras el despliegue | Verificar |
| H8 | Texto con degradado en el héroe y en `LandingHero` | Clases `hx-grad`, `ed-grad-text` y `bg-clip-text` | Énfasis en turquesa sólido; prueba de control | 0 en todas las páginas | Cerrado |
| H9 | Foto de personas generada con IA en el héroe del inicio (y como imagen para redes) | Imágenes de banco o IA sin dirección de arte | Héroe nuevo con el arco del logo y piezas reales del aula; `og-edvanta.png` sin personas; imágenes borradas; prueba de control | 0 imágenes retiradas | Cerrado |
| H10 | Se cargaban Fraunces y Patrick Hand en todas las páginas | Fuentes heredadas | Patrick Hand eliminada; Fraunces solo se carga con el diploma | Prueba de control | Cerrado |
| H11 | Las tres puertas de público repetidas bajo la foto | Duplicado de la franja superior | Retiradas del héroe | Revisión visual | Cerrado |
| H12 | Párrafo del héroe centrado de seis líneas en el celular | Alineación centrada | Héroe alineado a la izquierda | Revisión visual | Cerrado |
| H13 | **Decisión de la dueña:** íconos en ficha junto a títulos | Recurso decorativo genérico | Quitados del catálogo y del héroe; ocultos en el resto con regla global; prueba de control | Revisión visual | Cerrado |
| H14 | **Decisión de la dueña:** insignias Nuevo, Edvanta, Edutin y En vivo sobre las portadas | Ruido sobre la imagen | Retiradas de todas las tarjetas; prueba de control | Revisión visual | Cerrado |
| H15 | **Decisión de la dueña:** cada curso con el botón «Estudiar gratis» | La tarjeta no invitaba a actuar | Botón en cada tarjeta. El curso en vivo dice «Registrar mi interés» porque aún no tiene apertura ni precio. Los externos de pago conservan «Ver en plataforma» | Prueba de control | Cerrado |
| H16 | **Decisión de la dueña:** el pie de página usaba solo el nombre, sin el arco | Se usaba el logotipo horizontal | Logo completo (arco + nombre), igual al del encabezado | Revisión visual | Cerrado |
| H17 | **Decisión de la dueña:** botones genéricos | Botón rectangular estándar | Botones 3.0: píldora, luz al pasar, flecha en burbuja, filo de marca en el destacado; el aula usa la misma forma | Revisión visual | Cerrado |
| H18 | Portadas en tres estilos (IA con persona, plano de marca, 3D) | Imágenes hechas en momentos distintos | Se probó un sistema de portadas generado en código (arco + ícono). **La dueña lo rechazó por genérico (11-nov)**: se restauraron las 97 originales | Revisión de la dueña | Abierto: otra dirección de arte |
| H19 | Alto del inicio: 8.461 px de filas iguales (meta: 6.800) | Una fila por área, todas con el mismo patrón | Bloques editoriales y filas agrupadas (siguiente entrega) | Inicio 1366: 9.069 px | Abierto |
| H20 | Párrafos de lectura de menos de 13 px (2–4 por página) | Textos largos en `text-xs` | Revisión por página | — | Abierto |

## Mediciones posteriores

### 11-nov-2026 · después de la primera entrega (servidor local, código corregido)

| Página · ancho | Peso normal | Peso 800+ | Menos de 12 px | Tamaños | Radios | Degradado | Imágenes retiradas | Criterios cumplidos |
|---|---|---|---|---|---|---|---|---|
| Inicio · 1366 | **55,8 %** | **0,3 %** | **0** | 11 | 7 | **0** | **0** | 7/11 |
| Inicio · 390 | **55,4 %** | **0,3 %** | **0** | 12 | **6** | **0** | **0** | 8/10 |
| Instituciones · 1366 | **63,2 %** | **0,4 %** | **0** | 11 | 8 | **0** | 0 | 7/10 |
| Contigo · 1366 | 37,5 % | **1,0 %** | 6 | 15 | 9 | 0 | 0 | 5/10 |
| Escuelas · 1366 | 69,3 % | **1,0 %** | **0** | 11 | 7 | **0** | 0 | 7/10 |
| Cursos · 1366 | 50,8 % | 0,4 % | **0** | **9** | **6** | **0** | 0 | 8/10 |
| Ficha de curso · 1366 | 56,3 % | 0,5 % | 11 | 16 | 10 | 0 | 0 | 6/10 |
| Feliz Sin Tiroides · 1366 | 53,2 % | **0,7 %** | **0** | 13 | 10 | **0** | 0 | 7/10 |
| Acceso · 1366 | 67,7 % | 1,1 % | **0** | 8 | 6 | 0 | 0 | 9/10 |

En el servidor local los colores no se pueden medir con exactitud: la caché de Tailwind conservaba el color anterior. La compilación de producción ya trae los colores corregidos. Se verifican con la auditoría en edvanta.co.

## Embudo de ventas · 11-nov-2026

**Pedido de la dueña:** que cada página venda y recoja datos, que todo lleve a WhatsApp, una página de venta por guía, encuestas por área y correos de venta.

| Id | Acción | Cómo se verifica | Estado |
|---|---|---|---|
| E1 | La encuesta del inicio pide WhatsApp, guarda la solicitud y abre WhatsApp con las respuestas | Prueba «embudo-ventas» | Hecho |
| E2 | Cierre de venta antes del pie en toda página pública: oferta real por público, botón principal y WhatsApp. Si la página no tiene formulario propio, uno corto que guarda y abre WhatsApp | Prueba de rutas y oferta (COP 60.000) | Hecho |
| E3 | Botón flotante de WhatsApp con el nombre de la página; se sube sobre las barras fijas del celular | Revisión visual | Hecho |
| E4 | 38 páginas de venta `/guia/<slug>`: 5 de Edvanta, 12 de AtenFarmaClinic y 21 de Feliz Sin Tiroides. Contenido tomado de cada PDF o ficha; sin precios inventados | Prueba de datos (enlace real de Hotmart, 3 dolores, portadas) y prerender (38 en el sitemap) | Hecho |
| E5 | Productos nuevos: 4 guías de Claude, el Método LinkedIn y 2 de AtenFarmaClinic. Enlazados 2 de Feliz Sin Tiroides que no tenían Hotmart | Prueba: todo producto con Hotmart tiene página | Hecho |
| E6 | Encuestas por área: calidad, farmacia clínica, farmacología, asuntos regulatorios y webinars | Prueba | Hecho |
| E7 | 5 correos HTML y su flujo (`docs/email-marketing/FLUJO.md`) | Revisión visual de las muestras | Hecho; falta conectar la herramienta de envío |
| E8 | Enlaces de compra con `src=edv-<guía>-<botón>` para atribuir cada venta | Prueba (conserva `off` y `sck`) | Hecho |

**Indicadores** (línea base de dos semanas desde el despliegue): visitas a guías (`guia_vista`), clics de compra (`guia_compra_click`), datos dejados (`lead_enviado`), conversaciones (`whatsapp_click`) y ventas por `src` en Hotmart.

### Embudo de LinkedIn y CRM · 11-nov-2026 (segunda entrega)

| Id | Acción | Cómo se verifica | Estado |
|---|---|---|---|
| E9 | 6 páginas de registro `/unete/:publico` (profesionales, cursos, guías, pacientes, instituciones y asesorías). Una sola página por público; el área llega en el enlace | Prueba «embudo-ventas» y revisión en celular | Hecho |
| E10 | **Decisión de la dueña:** fotos de personas generadas con IA en las páginas de registro. Recortes en retrato de 26–40 KB, para que carguen rápido | Revisión visual | Hecho |
| E11 | CRM: cada solicitud se clasifica sola (público, interés, puntaje, temperatura, segmento y siguiente acción) y guarda profesión, país y `utm`. Filtros y descarga en CSV | Pruebas de la API «crm-embudo» | Hecho |
| E12 | Correos automáticos: registro (5), inscripción, bienvenida, recordatorio, certificado pagado y novedades. Una sola vez por persona, sin avalanchas a contactos antiguos | Pruebas de la API (plantillas sin huecos, envío único, bienvenida al día siguiente) | Hecho |
| E13 | Las encuestas por área de la primera entrega se unieron a `/unete` y la dirección vieja redirige | Prueba de redirección | Hecho |
| E14 | El control de diseño detectó radios fuera de la escala en las páginas nuevas (14, 10 y 20 px) y se corrigieron antes de publicar | Prueba H6 | Cerrado |

## Diseño 3.1 · Color, movimiento y oferta · 11-nov-2026

**Pedido de la dueña:** que todo se vea colorido y dinámico, con descuentos, botones y publicidad.

**Oferta real decidida por la dueña:** 20 % con el cupón EDVANTA20 hasta el 30-nov-2026, 11:59 p. m. (hora de Colombia). El cupón se crea en Hotmart. Vive en una sola fuente (`src/data/promocion.js`, con su copia en la API para los correos) y todo se apaga solo al vencer.

| Id | Acción | Control | Estado |
|---|---|---|---|
| D1 | Acento coral, solo para ofertas: botón con brillo (#D93A22, contraste 4,6:1 con blanco), insignia «−20 %» que late y sello circular en las portadas | Colores agregados al sistema; auditoría C7 | Hecho |
| D2 | Franja superior animada en todo el sitio, con cuenta regresiva real; se puede cerrar | Prueba: se apaga después del 30-nov | Hecho |
| D3 | `/ofertas`: vitrina de las 38 guías con filtros, collage animado, cupón para copiar y los pasos para usarlo | Prerender y sitemap | Hecho |
| D4 | Páginas de venta: héroe con burbujas de color, sello de descuento, cupón, cuenta regresiva, cinta de beneficios en movimiento, tarjetas en tres tintes y aparición al bajar | Revisión en celular: sin desborde y 12 bloques que aparecen | Hecho |
| D5 | Páginas `/unete`: fondo vivo, sellos sobre la foto, borde degradado en el formulario y cupón en guías | Revisión visual | Hecho |
| D6 | Correos (5 de venta y 10 automáticos): franja de colores, sello de la oferta, banda con luces, botones con degradado (respaldo sólido para Outlook), cupón como tiquete y portada de la guía en JPG | Pruebas de la API: plantillas sin huecos | Hecho |
| D7 | El cupón solo puede estar escrito en `promocion.js`, para que nunca quede una oferta vencida a la vista | Prueba de control | Hecho |
| D8 | El control de radios ya había detectado valores fuera de la escala en las páginas nuevas; esta entrega se hizo dentro de la escala | Prueba H6 | Cerrado |

**Al vencer la oferta:** la interfaz se apaga sola. El título prerenderizado de `/ofertas` se actualiza en el siguiente despliegue.
