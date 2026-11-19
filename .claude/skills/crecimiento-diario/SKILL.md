---
name: crecimiento-diario
description: Corre el ciclo diario del Agente de Crecimiento de Edvanta (meta de 100 certificados y 100 guías vendidos al día). Mide ventas, rastrea edvanta.co, prioriza, programa hasta tres correcciones con pruebas y deja el reporte del día. Úsalo cuando pidan "/crecimiento-diario", "corre el agente de crecimiento" o "qué hacemos hoy para vender más".
---

# Ciclo diario de crecimiento

Sigue el rol y las reglas de `.claude/agents/director-crecimiento.md`. Pasos:

1. **Preparar.** Desde la raíz del repositorio, en la rama de la sesión. Si `node_modules` no existe: `npm ci` y `cd api && npm ci`.
2. **Correr el agente.**
   ```bash
   NODE_USE_ENV_PROXY=1 node scripts/agente/agente.mjs diario
   ```
   Si `EDVANTA_ADMIN_TOKEN` no está en el entorno, el reporte sale sin ventas: dilo y sigue con el resto.
3. **Leer** `seo/agente/reportes/<fecha>.md` y elegir hasta tres acciones del apartado 4, de mayor puntaje, que se puedan cerrar hoy con pruebas. Las que dependan de Karla (Search Console, Hotmart, Cloudflare, precios, ofertas) van a la lista de pendientes, no se programan.
4. **Programar** cada acción con su prueba. Contenido en `src/data/*`; plantillas de fichas en `api/lib/html-de-ficha.js`; prerender de guías en `scripts/prerenderizar-paginas.mjs`.
5. **Verificar.**
   ```bash
   npm test
   ```
   ```bash
   npm run build
   ```
   ```bash
   cd api && node --check server.js
   ```
6. **Commit y push** a la rama de la sesión, con el reporte del día incluido. Nunca el token ni `seo/agente/datos/`.
7. **Responder** en el chat, corto:
   - cómo vamos frente a la meta (o que no hay datos y por qué);
   - las acciones hechas, con el archivo y la prueba;
   - lo que queda para Karla, con el paso exacto;
   - las 10 direcciones de Search Console del día;
   - el siguiente paso.
