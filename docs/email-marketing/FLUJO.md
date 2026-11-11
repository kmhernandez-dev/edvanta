# El embudo de ventas de Edvanta

Edvanta capta datos en todo el sitio, abre la conversación por WhatsApp y la sostiene por correo hasta la compra. Cada paso se mide.

## 1. Entradas: dónde llega cada persona

| Entrada | Dirección | Referencia en solicitudes |
|---|---|---|
| Encuesta del inicio (profesionales) | `/` | `encuesta-inicio-profesionales` |
| Encuesta de Contigo (pacientes) | `/contigo` | `encuesta-inicio-pacientes` |
| Encuestas por área | `/encuesta/calidad`, `/encuesta/farmacia-clinica`, `/encuesta/farmacologia`, `/encuesta/asuntos-regulatorios`, `/encuesta/webinars` | `encuesta-<área>` |
| Cierre de cada página pública | Todas, antes del pie | `cierre-profesionales`, `cierre-instituciones`, `cierre-contigo`, `cierre-carrera` |
| Página de venta de cada guía (38) | `/guia/<slug>` | `guia-<slug>` |
| Botón flotante de WhatsApp | Todas las páginas públicas | Va directo al chat, con el nombre de la página |

Todas guardan nombre, correo y WhatsApp en el panel de solicitudes del aula **antes** de abrir WhatsApp. Si la persona no escribe, igual queda el dato.

## 2. Conversación: WhatsApp en menos de 24 horas

El mensaje llega escrito con lo que la persona respondió (tema, cargo, modalidad o guía). Responde en este orden:

1. **Saludo y diagnóstico.** «Hola, {nombre}. Vi que te interesa {tema}. ¿Qué es lo que más te cuesta hoy?»
2. **Recomendación.** El curso gratis del tema y, si su necesidad lo pide, la guía. Una sola recomendación, no un catálogo.
3. **Cierre.** El enlace de la página de venta (`edvanta.co/guia/...`), no el de Hotmart: la página responde objeciones y mide.

## 3. Correos: cinco en diez días

| Día | Correo | Objetivo | Archivo |
|---|---|---|---|
| 0 | Tu ruta para empezar | Primer curso gratis | `01-bienvenida-tu-ruta.html` |
| 2 | Lo que cambia con un método | Valor: enseñar algo útil | `02-valor-caso-practico.html` |
| 4 | Estudia gratis, certifícate | Oferta real: certificado COP 60.000 | `03-oferta-curso-y-certificado.html` |
| 7 | La guía de tu área | Venta en Hotmart | `04-guia-recomendada.html` |
| 10 | Tus dudas, resueltas | Objeciones y WhatsApp | `05-preguntas-y-ultimo-paso.html` |

Para verlos juntos, abre `index.html`; las versiones con datos de ejemplo están en `muestras/`. Para regenerarlos después de un cambio, ejecuta `node scripts/generar-correos.mjs`.

**Variables.** `{{nombre}}`, `{{area}}`, `{{curso_titulo}}`, `{{curso_url}}`, `{{guia_titulo}}`, `{{guia_url}}`, `{{guia_portada}}`, `{{baja_url}}`. En las portadas de correo usa los JPG de `edvanta.co/img/guias/correo/`, porque Outlook no muestra WebP.

**Qué recomendar según la entrada**

| Entrada | Guía (`{{guia_url}}`) |
|---|---|
| `encuesta-calidad`, `guia-claude-aseguramiento-…` | `/guia/claude-aseguramiento-de-calidad-farmaceutica` |
| Control de calidad | `/guia/claude-control-de-calidad-farmaceutica` |
| `encuesta-farmacia-clinica` | `/guia/claude-farmacia-asistencial` o `/guia/problemas-farmacoterapeuticos-iesa` |
| `encuesta-farmacologia` | `/guia/farmacocinetica-clinica-aplicada` |
| `encuesta-asuntos-regulatorios` | Por ahora no hay guía: correo 4 con el curso de la Escuela de Asuntos Regulatorios |
| `cierre-carrera` | `/guia/metodo-linkedin-edutin` |
| Pacientes (`encuesta-inicio-pacientes`, `cierre-contigo`) | `/guia/coleccion-bienestar-tiroideo`. **Antes de enviar, hay que adaptar los correos 2 y 4 a lenguaje de paciente.** |

**El flujo se detiene** cuando la persona compra, cuando responde (sigue la conversación una persona) o cuando se da de baja.

## 4. Reglas que no se rompen

- **Consentimiento.** El flujo completo solo va a quien marcó «Quiero recibir avisos». Si solo autorizó que le respondamos, recibe únicamente el correo 1, como respuesta a su solicitud.
- **Baja.** Todo correo lleva el enlace para dejar de recibirlos, y la baja se respeta de inmediato.
- **Verdad.** No hay descuentos ni plazos falsos, ni «últimos cupos» inventados. El precio lo muestra Hotmart. En salud, todo es educativo y no reemplaza al equipo tratante.

## 5. Medición: el embudo se corrige con datos

| Paso | Evento de analítica | Indicador |
|---|---|---|
| Ve la página de venta | `guia_vista` | Visitas por guía |
| Abre Hotmart | `guia_compra_click` (con `origen`: hero, oferta, barra-movil) | Clics de compra ÷ visitas |
| Deja sus datos | `lead_enviado` (`origen`: encuesta, cierre, guia) | Datos ÷ visitas |
| Abre WhatsApp | `whatsapp_click` | Conversaciones iniciadas |
| Compra | Informe de Hotmart, filtrado por `src` | Ventas por página y por botón |

Los enlaces de compra llevan `src=edv-<guía>-<botón>`, así el informe de ventas de Hotmart dice de qué página y de qué botón vino cada venta.

**Revisión semanal.**

1. Mide dos semanas para tener la línea base, sin metas inventadas.
2. Después, cada semana, corrige primero el paso que más personas pierde. Por ejemplo, si muchos ven la guía y pocos abren Hotmart, cambia el título o la portada.
3. Anota el cambio y su resultado en `docs/auditoria-diseno/REGISTRO.md`.

## 6. Pendiente de decisión

- **Herramienta de envío.** Brevo, MailerLite o Mailchimp: cualquiera importa estos HTML. Hay que elegir una y conectar el panel de solicitudes para que el flujo salga solo.
- **Versión de los correos para pacientes**, en lenguaje de paciente.
- **Guías duplicadas en Hotmart.** «20 trucos de Claude para aseguramiento» y «10 automatizaciones con Claude» tienen el mismo contenido que otras dos guías. Cada par tiene una sola página de venta, y el enlace alterno se conserva en los datos.
