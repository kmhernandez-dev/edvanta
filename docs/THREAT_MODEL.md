# Modelo de amenazas

| Amenaza | Impacto | Control MVP | Control pendiente |
| --- | --- | --- | --- |
| Acceso horizontal | Exposicion de salud | `patient_id` sale del JWT | pruebas automatizadas y RLS |
| Robo de token | Suplantacion | expiracion JWT, TLS | rotacion, refresh tokens, MFA |
| XSS | Exfiltracion | React escapa texto, sin HTML clinico | CSP estricta y escaneo continuo |
| Inyeccion SQL | Alteracion | consultas parametrizadas | SAST/DAST en CI |
| Archivo malicioso | Ejecucion o fuga | cargas reales deshabilitadas | bucket privado, AV y MIME real |
| Exportacion indebida | Perdida de privacidad | accion explicita y auditoria | reautenticacion y notificacion |
| Regla clinica equivocada | Danio por confianza | lenguaje no diagnostico y trazable | revision clinica y versionado |
| Perdida de datos | Historia incompleta | autosave y DB | backups, restauracion y DR |

