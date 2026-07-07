# Dashboard Admin Basico - Edvanta

## Objetivo

Crear un dashboard administrativo basico para que Karla pueda ver, desde la app, el estado comercial de Edvanta sin usar `curl`, Postman ni acceder manualmente a PostgreSQL.

El dashboard debe mostrar intentos de compra, ordenes pagadas, clientes, ingresos y estado operativo de la plataforma.

## Ruta propuesta

Ruta frontend:

```txt
/admin/orders
```

La ruta no debe aparecer en la navegacion publica principal. Debe ser una ruta oculta/directa.

## Seguridad

El endpoint actual de ordenes esta protegido por `ADMIN_TOKEN`.

Endpoint:

```txt
GET /api/list-orders?limit=200
Header: x-admin-token: <ADMIN_TOKEN>
```

UX recomendada:

1. Mostrar una pantalla simple de acceso si no hay token guardado.
2. Pedir `ADMIN_TOKEN` en un campo tipo password.
3. Guardar el token en `localStorage` con una key clara:

```txt
edvanta_admin_token
```

4. Permitir cerrar sesion/borrar token.
5. Nunca imprimir el token en pantalla, logs o errores.

No implementar login real con usuarios todavia. Este dashboard es una herramienta interna ligera.

## Datos disponibles actualmente

`GET /api/list-orders?limit=200` devuelve:

```json
{
  "count": 1,
  "limit": 200,
  "orders": [
    {
      "id": "1",
      "payment_id": null,
      "preference_id": "3491568274-232fcb5a-22ce-4522-82c3-e447b376836e",
      "external_reference": "84c9d5a0-779b-42cc-935d-8532fa5ff471",
      "status": "pending_checkout",
      "status_detail": "preference_created",
      "email": null,
      "payer_id": null,
      "items": [
        {
          "id": "atencion-farmaceutica",
          "title": "Kit de Atencion Farmaceutica Pro",
          "quantity": 1,
          "unit_price": 44900,
          "currency_id": "COP"
        }
      ],
      "transaction_amount": "44900.00",
      "currency_id": "COP",
      "payment_method": null,
      "payment_type": null,
      "date_approved": null,
      "date_created": "2026-07-07T02:17:43.200Z",
      "logged_at": "2026-07-07T02:17:43.200Z",
      "updated_at": "2026-07-07T02:17:43.200Z",
      "email_sent_at": null
    }
  ]
}
```

## Estados comerciales

Interpretar los estados asi:

```txt
pending_checkout
```

Cliente llego a Mercado Pago o se creo una preferencia, pero no hay pago aprobado. Es intento de compra.

```txt
approved
```

Pago aprobado por Mercado Pago. Debe contar como venta.

Otros estados posibles de Mercado Pago:

```txt
pending
in_process
rejected
cancelled
refunded
charged_back
```

Si aparecen, mostrarlos sin romper la UI.

## Metricas principales

Mostrar tarjetas de resumen en la parte superior:

1. Ventas aprobadas
   - Conteo de ordenes con `status === "approved"`.

2. Ingresos aprobados
   - Suma de `transaction_amount` solo para `approved`.
   - Formato COP.

3. Checkouts pendientes
   - Conteo de `status === "pending_checkout"`.

4. Tasa de conversion simple
   - `approved / total_intentos * 100`.
   - Total intentos = ordenes con `pending_checkout` + `approved` + otros estados con preference/payment.

5. Clientes identificados
   - Conteo de emails unicos no vacios.

6. Correos enviados
   - Conteo de ordenes con `email_sent_at` no nulo.

## Tabla de ordenes

Columnas recomendadas:

- Estado
- Fecha
- Producto(s)
- Cliente/email
- Total
- Metodo de pago
- Payment ID
- Preference ID
- Email enviado

Formato:

- Fecha: local, compacta.
- Total: COP.
- Estado: badge visual.
- Productos: mostrar nombre + cantidad. Si hay varios, una lista compacta.
- IDs largos: mostrar truncado con boton/copiar opcional.

## Filtros

Controles basicos esperados:

- Buscar por email, payment_id, preference_id, external_reference o producto.
- Filtro por estado:
  - Todos
  - Pendientes
  - Aprobadas
  - Rechazadas/Otros
- Filtro por rango:
  - Hoy
  - 7 dias
  - 30 dias
  - Todo

No usar una UI pesada. Debe sentirse como herramienta de trabajo, no landing page.

## Detalle de orden

Al hacer click en una fila, abrir panel/modal lateral con:

- Estado completo
- Fecha de creacion
- Fecha de aprobacion
- Payment ID
- Preference ID
- External reference
- Email
- Items en JSON legible o lista detallada
- Monto
- Metodo/tipo de pago
- Estado de envio de correo

## Estado operativo

Agregar una pequena seccion de salud:

Endpoints:

```txt
GET /api/health
GET /api/health/db
```

Mostrar:

- API: ok/error
- DB: ok/error
- Mercado Pago: configured/missing
- Resend: configured/missing

No bloquear el dashboard si health falla. Mostrar una alerta discreta.

## Reglas de frontend

- Usar `apiUrl()` desde `src/config/api.js` para construir URLs.
- No hardcodear dominio en el frontend.
- No exponer el token admin en componentes, constantes ni commits.
- Manejar `401` con mensaje: "Token admin invalido o vencido".
- Manejar `503` con mensaje: "Servicio admin no configurado".
- Manejar errores de red con opcion "Reintentar".
- Incluir boton de refrescar.
- Auto-refresco opcional cada 60 segundos, desactivable si se implementa.

## Diseno esperado

Estilo:

- Profesional, sobrio, denso y escaneable.
- No usar hero ni secciones decorativas.
- No usar emojis.
- Usar tablas, badges, filtros y tarjetas metricas compactas.
- Mantener consistencia visual con la app actual.

Componentes sugeridos:

```txt
src/pages/AdminOrders.jsx
src/components/admin/AdminLogin.jsx
src/components/admin/MetricsCards.jsx
src/components/admin/OrdersTable.jsx
src/components/admin/OrderDetailPanel.jsx
src/components/admin/HealthStrip.jsx
```

Si se prefiere una primera version rapida, puede hacerse todo en:

```txt
src/pages/AdminOrders.jsx
```

Luego refactorizar.

## Criterios de aceptacion

La implementacion se considera lista cuando:

1. `/admin/orders` carga sin romper la app publica.
2. Si no hay token, muestra formulario de acceso.
3. Con token correcto, lista ordenes desde `/api/list-orders`.
4. Muestra la orden `pending_checkout` creada durante pruebas.
5. Calcula metricas principales correctamente.
6. Permite filtrar/buscar ordenes.
7. Permite cerrar sesion/borrar token.
8. `npm run build` pasa.
9. No se imprime ni commitea `ADMIN_TOKEN`.

## Futuras mejoras

- Crear endpoint agregado `/api/admin/metrics`.
- Exportar CSV.
- Marcar orden como atendida.
- Reenviar correo de descarga.
- Integrar un login real con usuario/contrasena.
- Registrar eventos de carrito abandonado.
- Capturar email antes de redirigir a Mercado Pago.
