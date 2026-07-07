# Modulo Admin de Email - Edvanta

## Objetivo

Crear un modulo administrativo tipo inbox para gestionar comunicaciones de Edvanta desde la misma app:

- Ver correos/eventos de email relacionados con leads, ordenes y compras.
- Redactar y enviar emails manuales.
- Reenviar correos de descarga.
- Ver historial de emails por cliente u orden.

La experiencia debe ser similar a un Gmail sencillo, pero orientado a operaciones comerciales.

## Ruta propuesta

```txt
/admin/emails
```

Puede integrarse como una pestana dentro del dashboard admin:

```txt
/admin/orders
/admin/emails
```

La ruta no debe aparecer en la navegacion publica.

## Importante sobre alcance actual

Actualmente el backend tiene helper para enviar emails via Resend:

```txt
api/lib/resend.js
```

Y envia emails desde:

```txt
api/routes/lead-capture.js
api/routes/mp-webhook.js
```

Pero hoy NO existe una tabla `emails` ni endpoints para listar, buscar o enviar emails manuales desde el dashboard.

Por eso el modulo frontend debe implementarse en dos fases.

## Fase 1 - Frontend Preparado + Vista de Historial Disponible

Objetivo:

Crear la UI base del modulo email usando los datos disponibles hoy en ordenes.

Datos disponibles desde:

```txt
GET /api/list-orders?limit=200
Header: x-admin-token: <ADMIN_TOKEN>
```

Campos utiles:

- `email`
- `email_sent_at`
- `status`
- `payment_id`
- `preference_id`
- `items`
- `transaction_amount`
- `date_approved`
- `logged_at`

La UI puede mostrar:

- Clientes con email conocido.
- Ordenes a las que ya se les envio correo (`email_sent_at`).
- Ordenes aprobadas sin correo enviado.
- Checkouts pendientes sin email.

Limitacion:

No se puede ver un inbox real ni emails recibidos todavia sin endpoints/backend adicional.

## Fase 2 - Backend Requerido Para Gmail Interno

Para que el modulo sea realmente tipo Gmail, se requieren nuevos endpoints backend:

```txt
GET  /api/admin/emails
GET  /api/admin/emails/:id
POST /api/admin/emails/send
POST /api/admin/emails/:id/retry
POST /api/admin/orders/:id/resend-download
```

Todos protegidos con:

```txt
Header: x-admin-token: <ADMIN_TOKEN>
```

Tambien se recomienda crear una tabla:

```sql
emails
```

Campos sugeridos:

```txt
id
direction              -- inbound | outbound
provider               -- resend | gmail | manual
provider_message_id
to_email
from_email
reply_to
subject
html
text
status                 -- draft | queued | sent | delivered | bounced | failed | received
error_message
related_order_id
related_payment_id
related_preference_id
related_external_reference
customer_email
sent_at
received_at
created_at
updated_at
```

## Vista Principal

Layout recomendado:

```txt
Sidebar izquierda: carpetas/filtros
Panel central: lista de emails/conversaciones
Panel derecho o modal: detalle del email
Boton principal: Redactar
```

Carpetas/filtros:

- Todos
- Enviados
- Recibidos
- Fallidos
- Pendientes
- Descargas
- Leads
- Ordenes

## Metricas Del Modulo

Tarjetas compactas:

- Emails enviados
- Emails fallidos
- Descargas enviadas
- Ordenes aprobadas sin email
- Leads capturados
- Clientes con email

## Tabla / Lista De Emails

Columnas:

- Estado
- Fecha
- Para/De
- Asunto
- Relacion
- Orden/Pago
- Acciones

Estados visuales:

```txt
sent
delivered
failed
bounced
pending
received
draft
```

## Redactor De Email

Modal o panel lateral con:

- Para
- Asunto
- Mensaje
- Plantilla
- Relacionar con orden
- Boton enviar

Plantillas sugeridas:

- Confirmacion de compra
- Reenvio de descarga
- Pago pendiente
- Respuesta a lead
- Soporte general

Reglas:

- No permitir enviar si falta destinatario valido.
- Confirmar antes de enviar.
- Mostrar loading mientras envia.
- Mostrar resultado: enviado/fallido.
- No guardar claves ni tokens en frontend.

## Acciones Por Orden

Desde el modulo email o el dashboard de ordenes:

- Reenviar correo de descarga.
- Enviar mensaje manual al cliente.
- Copiar email.
- Ver historial del cliente.

## Integracion Con Resend

El frontend NO debe llamar Resend directamente.

Debe llamar endpoints internos:

```txt
POST /api/admin/emails/send
```

El backend usa:

```txt
api/lib/resend.js
```

Variables necesarias:

```txt
RESEND_API_KEY
FROM_EMAIL
NOTIFY_EMAIL
ADMIN_TOKEN
```

## Inbox Real / Correos Recibidos

Resend sirve principalmente para envio. Para ver correos recibidos estilo Gmail se necesita una de estas opciones:

1. Integracion Gmail API.
2. Reenvio de inbound emails a webhook propio.
3. Usar Resend Inbound si se configura dominio y webhooks.

Mientras no exista esa integracion, el modulo debe llamarse "Emails" o "Comunicaciones", no prometer inbox real.

## Seguridad

- Reusar el token admin guardado en `localStorage`:

```txt
edvanta_admin_token
```

- No mostrar el token en pantalla.
- Manejar `401` limpiando sesion o pidiendo token de nuevo.
- Sanitizar/escapar contenido si se renderiza HTML de emails.
- No permitir enviar emails masivos en la primera version.

## Diseno Esperado

Estilo:

- Herramienta operativa, sobria y escaneable.
- Similar a Gmail en estructura, pero no copiar marca ni estilos exactos.
- Sin hero.
- Sin decoracion innecesaria.
- Tablas/listas compactas.
- Badges claros.
- Paneles laterales para detalle/redaccion.

## Componentes Sugeridos

Primera version:

```txt
src/pages/AdminEmails.jsx
src/components/admin/AdminShell.jsx
src/components/admin/email/EmailSidebar.jsx
src/components/admin/email/EmailList.jsx
src/components/admin/email/EmailDetailPanel.jsx
src/components/admin/email/EmailComposer.jsx
src/components/admin/email/EmailMetrics.jsx
```

Si no existe `AdminShell`, se puede crear para compartir layout con `/admin/orders`.

## Criterios De Aceptacion - Fase 1

La fase 1 esta lista cuando:

1. `/admin/emails` carga sin afectar la app publica.
2. Usa el mismo token admin de `/admin/orders`.
3. Muestra metricas basadas en ordenes y emails conocidos.
4. Lista clientes/ordenes con email.
5. Muestra ordenes aprobadas sin `email_sent_at`.
6. Muestra estado de "backend de email limitado" si no existen endpoints de email.
7. No intenta llamar Resend desde frontend.
8. `npm run build` pasa.

## Criterios De Aceptacion - Fase 2

La fase 2 esta lista cuando:

1. Existe tabla `emails`.
2. Existe endpoint para listar emails.
3. Existe endpoint para enviar email manual.
4. Existe endpoint para reenviar descargas.
5. Cada envio queda registrado con estado.
6. Errores de Resend se guardan y se muestran.
7. Se puede ver historial por cliente.

## Prioridad Recomendada

1. Completar links reales de descarga.
2. Registrar cada envio de Resend en una tabla `emails`.
3. Crear endpoint `POST /api/admin/orders/:id/resend-download`.
4. Crear `/admin/emails` con historial y redactor.
5. Evaluar Gmail API o inbound webhooks para correos recibidos reales.
