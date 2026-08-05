# Seguridad

## Controles implementados en el MVP

- JWT existente para sesiones autenticadas.
- Identidad del paciente derivada del token.
- Limite de cuerpo, validacion de estructura y version.
- Consultas parametrizadas y transacciones.
- Auditoria de lectura, escritura, exportacion y desactivacion.
- CORS restringido y secretos solo en variables de entorno.
- Modo demo separado en `localStorage`, sin datos reales.
- Interruptor de seguridad en frontend y API. El modo real queda cerrado por
  defecto con `VITE_VIDA360_REAL_DATA_ENABLED=false` y
  `VIDA360_REAL_DATA_ENABLED=false`.

## Controles antes de datos reales

- Rotacion y custodia formal de claves.
- Rate limiting distribuido.
- MFA y recuperacion segura de cuenta.
- cifrado administrado, backups probados y retencion definida.
- almacenamiento privado con URLs firmadas, antivirus y limites MIME.
- pruebas de acceso horizontal, pentest y gestion de vulnerabilidades.
- alertas sobre exportaciones, revocaciones y accesos anormales.

El MVP no se declara conforme con una norma. Requiere validacion juridica, clinica, regulatoria y de ciberseguridad.

## Riesgo residual de dependencias

El `npm audit --omit=dev` reporta `GHSA-qwww-vcr4-c8h2` en React Router 7.18.2.
La condicion publicada afecta el modo RSC y la ejecucion de server actions; esta
aplicacion se entrega como SPA de Vite y no usa RSC. La correccion automatica
propone bajar a 7.11.0, version que vuelve a introducir avisos anteriores de
XSS, RCE y denegacion de servicio, por lo que no se aplica ese downgrade. Se
debe actualizar cuando exista una version corregida que no reactive esos
avisos y repetir el audit antes de habilitar datos reales.
