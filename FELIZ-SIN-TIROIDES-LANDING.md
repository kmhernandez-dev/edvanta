# Feliz Sin Tiroides: landing, conversión y operación

## Auditoría de la versión anterior

La página tenía una base valiosa: productos reales, portadas, enlaces Hotmart, artículos educativos y una fotografía real de Karla. Los principales problemas eran:

- Propuesta de valor emocional pero poco específica sobre levotiroxina, exámenes, tiroidectomía y yodoterapia.
- Catálogo muy largo sin agrupación por necesidad ni recomendador.
- Captación limitada a nombre y correo, sin consentimiento, país, interés o atribución UTM.
- Recurso gratuito anunciado sin archivo entregable configurado.
- Imagen social y hero referenciadas a un archivo que no existía en Git.
- Testimonios publicados sin evidencia de autorización verificable.
- Falta de FAQ estructuradas, política de tratamiento de datos y política de reembolso.
- Varias frases podían interpretarse como promesas clínicas o como alcance médico.
- No había eventos uniformes para medir la ruta de conversión.

## Arquitectura implementada

1. Navegación fija: Inicio, Recursos, Guías, Cursos, Sobre mí y FAQ.
2. Hero de propuesta específica con dos CTA.
3. Franja de confianza verificable.
4. Selector de etapa del paciente.
5. Lead magnet y formulario con consentimiento.
6. Ruta de tres pasos y recomendador interactivo.
7. Productos agrupados por tratamiento, nutrición, cirugía y bienestar.
8. Cursos, academia y orientación educativa.
9. Perfil real de Karla con límites profesionales explícitos.
10. Compromisos éticos en lugar de testimonios no verificables.
11. FAQ, artículos, CTA final, pie legal y WhatsApp.

## Captación y email

El formulario envía a `POST /api/lead-capture`:

- Nombre, correo, país e interés.
- WhatsApp opcional.
- Consentimiento y fecha de consentimiento.
- Recurso y recomendación seleccionada.
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` y página de origen.

La API guarda o actualiza el contacto en la tabla `leads`, notifica al correo interno, envía el recurso mediante Resend y puede sincronizar el contacto con un webhook privado. La migración `006_leads.sql` se aplica al reiniciar la API.

Variables:

- `VITE_FORM_ENDPOINT`: endpoint público alternativo. Vacío usa `/api/lead-capture`.
- `VITE_PRIVACY_POLICY_URL`: URL de privacidad.
- `VITE_THANK_YOU_PAGE_URL`: página opcional posterior al registro.
- `WHATSAPP_NUMBER`: número central configurado en `src/config/links.js`.
- `EMAIL_PLATFORM_API`: webhook privado del backend para n8n/Brevo/MailerLite/etc.

`EMAIL_PLATFORM_API` nunca debe llevar prefijo `VITE_` ni incluirse en código cliente.

## Enlaces y datos por validar

- Confirmar que todos los precios COP siguen vigentes en Hotmart y Mercado Pago.
- Confirmar la política de garantía visible en cada checkout Hotmart.
- Añadir `INSTAGRAM_URL` cuando exista una URL oficial.
- Confirmar el correo responsable de privacidad y derechos de datos.
- Validar con asesoría legal local los textos de privacidad, tratamiento y reembolso.
- Sustituir o complementar el checklist cuando exista una versión PDF oficial de marca.
- Añadir testimonios solo con consentimiento escrito, texto aprobado y fecha de autorización.
- Configurar `EMAIL_PLATFORM_API` si se desea sincronización automática externa.

## Analítica

La interfaz prepara estos eventos sin cargar cookies publicitarias por sí sola:

- `page_view`
- `hero_cta_click`
- `lead_form_view`
- `lead_form_start`
- `lead_form_submit`
- `free_resource_download`
- `product_view`
- `product_click`
- `checkout_click`
- `whatsapp_click`
- `faq_open`
- `recommendation_completed`

Los eventos se emiten como `edvanta:analytics`. Solo se envían a `dataLayer`, GA4 o Meta cuando `window.__EDVANTA_ANALYTICS_CONSENT__ === true`.

## Publicación

1. Ejecutar `npm run build` en la raíz.
2. Ejecutar las pruebas del backend o iniciar `node api/server.js` con variables de prueba.
3. Hacer commit y push a `main`.
4. Desplegar web y API en Coolify.
5. Confirmar que la API aplicó `006_leads.sql`.
6. Probar el formulario con un correo controlado y verificar Resend, base de datos y webhook.
7. Verificar `https://edvanta.co/feliz-sin-tiroides` en móvil y escritorio.

## Checklist previo al lanzamiento

- Un solo H1 y jerarquía H2/H3 correcta.
- Hero, foto de Karla, portadas y logo cargan sin 404.
- Formulario valida, muestra error y muestra confirmación.
- Consentimiento es obligatorio y WhatsApp es opcional.
- Recurso abre y puede imprimirse o guardarse como PDF.
- Hotmart, Mercado Pago, WhatsApp, correo y legales abren correctamente.
- Navegación móvil, pestañas, recomendador y FAQ funcionan con teclado.
- Botones tienen al menos 44 px de alto.
- No hay testimonios, cifras o promesas clínicas no verificadas.
- No se expone `EMAIL_PLATFORM_API`, claves de Resend o credenciales.

## Plan de medición de 30 días

- Días 1-3: validar errores, entregabilidad, enlaces y embudo técnico.
- Semana 1: medir visitas, selección de etapa, inicio de formulario y tasa de envío.
- Semana 2: comparar CTA del hero frente al CTA después del selector.
- Semana 3: analizar intereses, recomendador y clics por categoría de producto.
- Semana 4: revisar ventas asistidas, consultas por WhatsApp, bajas y calidad de leads.

Indicadores principales: conversión a lead, abandono del formulario, entrega de correo, apertura del recurso, clic a producto, clic a checkout, clic a WhatsApp y ventas confirmadas. No optimizar solo por volumen: vigilar consentimiento, bajas y consultas realmente pertinentes.

## Recomendaciones CRO

- Mantener una sola oferta gratuita principal durante los primeros 30 días.
- No activar popup antes de 45 segundos; se muestra una vez por sesión y no bloquea móvil.
- Probar cambios de una variable a la vez: titular, CTA o disposición del formulario.
- No usar contadores, escasez o descuentos sin evidencia real.
- Publicar fragmentos interiores reales de las guías antes de añadir testimonios.
- Responder consultas de elección con alcance educativo y derivar dudas clínicas al equipo tratante.
