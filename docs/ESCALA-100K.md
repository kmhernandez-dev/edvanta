# Edvanta para 100.000 personas al día

Plan de capacidad y máquina de ventas. Fase 1 escrita el 19-nov-2026.
Este documento dice qué se hizo, con qué números se calculó, qué falta y qué hay que tocar en Coolify.

---

## 1. Cuánto tráfico son 100.000 personas al día

Los números son una **estimación de diseño**, no una medición. Se revisan con datos reales de Google Analytics y de `/api/health` cuando llegue el tráfico.

| Supuesto | Valor |
|---|---|
| Personas al día | 100.000 |
| Páginas por visita | 3 |
| Páginas vistas al día | 300.000 |
| Hora pico (10 % del día) | 30.000 páginas ≈ **8 por segundo**, con ráfagas de 25/s |
| Llamadas a la API por página | 3 a 5 |
| API pública en ráfaga | 75 a 125 peticiones/s **sin caché** |
| Estudiantes activos en el aula (10 %) | 10.000 al día, ≈ 50 llamadas cada uno (avance, tiempo, quices) |
| API del aula en hora pico | 15 a 40 peticiones/s, con escrituras |

**Conclusión:** el cuello de botella no es la base de datos, son cuatro cosas:

1. Cada ficha `/curso-de-…` se armaba en Node con PostgreSQL en **cada** visita.
2. Un solo proceso de Node usa un solo núcleo. Iniciar sesión (bcrypt) y armar páginas consumen CPU.
3. Las tareas únicas (migraciones, correos programados) no estaban preparadas para correr en varios procesos.
4. **El video.** Si los videos del aula se sirven desde el servidor, 10.000 estudiantes viendo 30 minutos a 1 Mbps suman unos 2 TB diarios. Un VPS no aguanta eso. Ver la fase 2.

---

## 2. Lo que ya quedó hecho (fase 1)

### Capacidad

| Cambio | Dónde | Efecto |
|---|---|---|
| **Microcaché de nginx (60 s)** para fichas, catálogo, carreras/rutas/competencias y la API pública del catálogo | `nginx.conf` | Mil visitas a una ficha en un minuto hacen **una sola** consulta. Si la API se cae o se reinicia en un despliegue, nginx sirve la última copia buena en lugar de un error. Un cambio publicado tarda máximo 1 minuto en verse. |
| **Varios procesos de la API** (`API_PROCESOS`) | `api/server.js` | Usa varios núcleos. Si un proceso muere, se relanza solo. |
| **Candado en PostgreSQL** para las tareas únicas | `api/lib/candado.js` | Migraciones, correos programados y limpieza corren en **un solo** proceso, aunque haya varios procesos o réplicas. |
| **Migraciones en una sola conexión** | `api/lib/migrate.js` | Arregla un error real: el BEGIN, la migración y el COMMIT podían caer en conexiones distintas del pool. |
| **Conexiones configurables** (`PG_POOL_MAX`, 15 por proceso) | `api/db.js` | Antes eran 10 fijas. |
| **Registro muestreado** | `api/server.js` | Siempre se registran errores, peticiones lentas (más de 1 s) y escrituras, con estado y duración. Del resto, el 2 %. Antes, una línea por petición borraba lo importante en minutos. |
| **Tope de la IA repartido** | `api/routes/cv-ia.js` | Con 4 procesos, el tope diario de revisiones de hojas de vida sigue siendo el total, no 4 veces el total. |
| **Índices** para búsqueda y bandejas | `api/migrations/164_aula_assist.sql` | La búsqueda por fragmento de correo o nombre (trigramas) y las bandejas no recorren tablas enteras. |

### Edvanta Assist: atender a cada persona

En el aula, menú **General → Edvanta Assist** (`/aula/admin/assist`). Solo pueden entrar los administradores.

- **Bandeja.** El trabajo del día, ordenado por dinero en juego:
  - pagos sin terminar;
  - cursos terminados sin certificado;
  - solicitudes nuevas;
  - estudiantes quietos;
  - invitaciones sin abrir;
  - entregas por revisar.
- **Personas.** Búsqueda por correo o nombre. Encuentra también a quien solo llenó un formulario y aún no tiene cuenta.
- **Ficha de la persona.** Reúne cuenta, cursos con avance, pagos, certificados, solicitudes, correos que recibió y notas del equipo. Incluye **«Qué hacer ahora»**: acciones con prioridad y su motivo.
  - Cada acción tiene un mensaje de WhatsApp ya escrito, sin suponer el género.
  - Botones de un clic: enviar enlace de acceso, recordatorio de pago y oferta del certificado.
  - Todo queda en la Bitácora.
- **Ventas.** Para 7, 30 o 90 días:
  - ingresos, certificados pagados, inscripciones y cuentas nuevas;
  - conversión de inscripción a pago, de terminar a pagar y de pagos iniciados a completados;
  - inscripciones por día, en gráfica y en tabla;
  - resultados por curso;
  - cuánto vendió cada correo automático.

API: `api/routes/aula/admin-assist.js` y `api/lib/aula/assist.js`. Pruebas: `api/tests/assist.test.js`.

### Venta automática: la plataforma vende sola

Tres correos nuevos en el embudo programado (`api/lib/aula/embudo-programado.js`). Corren cada hora en un solo proceso, porque llevan candado. Cuentan solo desde el 19-nov-2026, para que nadie reciba un correo atrasado.

| Correo | A quién | Cuándo |
|---|---|---|
| `pago-pendiente` | Quien empezó a pagar el certificado y no terminó | 2 horas después, hasta 7 días |
| `curso-completado` | Quien terminó un curso con certificado de pago y no lo tiene | 1 hora después |
| `reactivacion-curso` | Quien va entre el 1 % y el 99 % y no entra | Entre 10 y 30 días sin entrar |

Se suman a los que ya existían: bienvenida, recordatorio a los 5 días, descuento por vencer y novedades.

- Cada correo sale **una sola vez** por persona y curso (tabla `embudo_correos`).
- Los precios salen de `precio-certificado.js`. No hay urgencias falsas.
- Si una persona ya recibió el correo automático, Assist permite enviarle uno manual al día. Para insistir más, mejor escribirle por WhatsApp.

---

## 3. Qué tocar en Coolify (servicio `api`)

| Variable | Valor recomendado | Nota |
|---|---|---|
| `API_PROCESOS` | `2` (ya es el valor por defecto en docker-compose) | Súbelo a `4` si el servidor tiene 4 núcleos o más. `auto` usa un proceso por núcleo. |
| `PG_POOL_MAX` | `15` | `API_PROCESOS × PG_POOL_MAX` debe quedar **por debajo** de `max_connections` de PostgreSQL (100 por defecto), con margen. |
| `LOG_PETICIONES` | `muestra` | Pon `todas` solo mientras diagnosticas algo. |
| `LOG_MUESTRA` | `0.02` | La fracción de peticiones normales que se registra. |

**Límites que se reparten entre procesos.** Los límites de intentos de inicio de sesión viven en la memoria de cada proceso. Con 2 procesos, cada persona tiene, como máximo, el doble de intentos. Es aceptable. Si se pasa a varias réplicas, conviene moverlos a Redis (fase 2).

---

## 4. Lo que falta (fases siguientes)

### Fase 2: necesaria antes de llegar a 100.000 al día

1. **Video fuera del servidor.** Es lo más importante.
   - Los videos subidos al aula deben ir a un servicio de video con CDN: Bunny Stream, Cloudflare Stream o R2 detrás de Cloudflare.
   - Mientras tanto, mantener los videos en YouTube.
   - Alternativa intermedia: montar el volumen `aula-files` en el contenedor `web` (solo lectura) y servirlo con `X-Accel-Redirect`, tras comprobar el permiso en la API. Así nginx entrega los bytes y Node solo autoriza.
2. **Caché de Cloudflare** para `/assets/` e `/img/`. Ya tienen `Cache-Control: immutable`; hay que confirmar en el panel que Cloudflare no los omite.
3. **Prueba de carga** contra un entorno de prueba, no contra producción: 50, 100 y 200 peticiones/s sobre fichas, catálogo y aula. Medir en `/api/health` → `capacidad.conexiones_en_uso` y `peticiones_en_espera`.
4. **Base de datos.**
   - Confirmar `max_connections`, el tamaño de la máquina y las copias de seguridad diarias.
   - Si hay más de 2 réplicas, poner PgBouncer delante de PostgreSQL.
5. **Redis** para los límites de intentos y el contador de la IA, si se pasa a varias réplicas o servidores.
6. **Monitoreo.** Alerta cuando `/api/health/db` falle o cuando la latencia supere 2 s (UptimeRobot o Better Stack).

### Fase 3: Edvanta Design y operación

- **Edvanta Design** (`/admin/design`) ya junta los cursos curados y los propios. Falta:
  - importación masiva de cursos curados desde una hoja de cálculo;
  - revisión antes de publicar (portada, precio, duración y enlaces vivos);
  - plantilla de curso propio con unidades y clases desde un documento.
- **Assist 2:**
  - asignar personas a un asesor;
  - registrar llamadas;
  - plantillas de WhatsApp editables;
  - exportar la bandeja a CSV;
  - recordatorios de seguimiento con fecha.
- **Recomendador en la ficha:** «quien tomó este curso también tomó…», calculado de las matrículas reales.
- **Panel de ventas para instituciones:** cotizaciones, contratos y cupos.

---

## 5. Cómo verificar después de desplegar

1. `https://edvanta.co/api/health` → `capacidad.procesos` debe decir 2 (o lo que pongas).
2. Abrir dos veces seguidas una ficha `/curso-de-…`. La segunda carga no debe aparecer en el registro de la API, porque la sirvió nginx.
3. En el aula: **Edvanta Assist → Bandeja** y **Ventas** cargan con datos reales.
4. Al día siguiente, en **Ventas → Correos automáticos enviados**, deben aparecer los nuevos correos si hubo pagos sin terminar, cursos terminados o estudiantes quietos.
