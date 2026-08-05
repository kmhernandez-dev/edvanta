# FST Vida 360 - PRD del MVP

## Proposito

FST Vida 360 es el portal del paciente de Feliz Sin Tiroides. Ayuda a organizar la historia tiroidea, medicamentos, adherencia, sintomas, laboratorios, barreras biopsicosociales, metas y preparacion de consultas. Convierte datos registrados por la persona en resumenes, tendencias, tareas, una linea de tiempo y documentos descargables.

## Limites clinicos

El producto organiza y educa. No diagnostica, prescribe, calcula dosis, determina recurrencia, atribuye sintomas a una causa ni interpreta de forma definitiva laboratorios. Toda alerta se etiqueta como educativa, organizativa, recordatorio o dato para revisar con un profesional.

## Usuarios y alcance

El MVP se concentra en adultos con tiroidectomia total o hipotiroidismo tratado con levotiroxina. Incluye cuenta, consentimiento granular, onboarding, perfil, historia tiroidea, medicamentos, adherencia, sintomas, laboratorios, evaluacion biopsicosocial, Mapa FST 360, metas, tareas, consulta, pasaporte, linea de tiempo y privacidad.

Fuera del MVP: portal profesional, decisiones clinicas, derivaciones, IPS, pagos, teleconsulta, IA clinica, FHIR operativo, laboratorios conectados y aplicacion nativa.

## Resultados esperados

- La persona identifica sus tres siguientes acciones prioritarias.
- Puede registrar y corregir su informacion sin perder historial.
- Puede preparar una consulta y descargar un resumen seleccionable.
- Comprende por que aparece cada estado del Mapa 360.
- Puede revisar, revocar y exportar sus autorizaciones y datos.

## Criterios de aceptacion

El recorrido descrito en `DEMO_GUIDE.md` debe funcionar sin servicios externos. En modo autenticado, el servidor obtiene siempre el paciente desde el JWT y nunca acepta un `patient_id` enviado por el navegador.

