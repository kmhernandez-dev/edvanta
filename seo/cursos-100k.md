# Cursos: meta de 100.000 visitas orgánicas al mes

Pedido de Karla (18-nov-2026): posicionar únicamente los cursos, en Google y en los buscadores con IA, hasta
**100.000 personas al mes** que quieran estudiarlos, y que compren el certificado.

## Línea base (antes de este plan)

- Todo edvanta.co: unas **816 visitas orgánicas al mes** y 347 keywords (Semrush, proyecto, 16-nov). El 97 % viene
  de la ficha de diclofenaco; los cursos casi no aportan.
- Search Console (5-nov): 235 páginas indexadas y 662 sin indexar; 202 de las «descubiertas sin indexar» eran
  cursos.
- **Solo 3 enlaces externos** que Google reconoce. Es el cuello de botella de autoridad.
- 238 fichas de curso en el sitemap (62 propias y 176 curadas) y 367 clases abiertas.

La meta es de 120 veces la base. Necesita volumen de búsqueda real, indexación completa y autoridad. Este
documento separa lo que ya está hecho de lo que depende de terceros.

## Hecho el 18-nov

1. **Una búsqueda principal por curso propio** (`api/lib/seo-cursos-propios.js`, 62 claves únicas). El título
   pasa de «Curso de Oratoria: cómo hablar en público con seguridad» a «Curso de oratoria online gratis |
   Edvanta». La descripción empieza por la misma búsqueda y termina con «Certificado verificable opcional».
   Las pruebas exigen claves únicas, títulos de 60 caracteres o menos y que el título contenga la clave.
2. **Buscadores con IA:** `public/llms.txt` lista los 62 cursos por área, con qué enseña cada uno, sus clases
   y horas, y el precio vigente del certificado (`node scripts/llms-cursos.mjs`; volver a correrlo al cambiar
   cursos).
3. **Venta:** cada ficha lleva a `/curso-de-…/inscripcion` (dos caminos, chulos verdes, diploma y comparativa).
   El tráfico que llegue tiene dónde convertirse.

## Bloqueos que dependen de Karla

1. **Cloudflare bloquea a los buscadores con IA.** Con sus agentes reales, GPTBot, PerplexityBot y ClaudeBot
   reciben 403; OAI-SearchBot y Google sí entran. Cloudflare también antepone su `robots.txt` («ai-train=no»).
   Para aparecer en Perplexity y en las respuestas con fuente de ChatGPT y Claude, en Cloudflare:
   *Seguridad › Bots* (o *AI Crawl Control*): permitir PerplexityBot, Perplexity-User, ChatGPT-User,
   OAI-SearchBot, Claude-SearchBot y Claude-User. Se pueden dejar bloqueados los de entrenamiento (GPTBot,
   ClaudeBot, CCBot) si no quiere que se entrene con el contenido.
2. **Volumen de búsqueda.** Semrush pide iniciar sesión en el navegador. Con la sesión abierta se exporta el
   volumen de las 62 claves y sus variantes. Así la meta de 100.000 se reparte por curso con cifras reales, y se
   eligen las páginas de área que faltan.
3. **Enlaces externos.** El kit de 7 correos a universidades y gremios (9-nov) sigue sin enviarse. Sin enlaces,
   las búsquedas amplias («curso de oratoria», «curso de liderazgo») no se ganan.
4. **Search Console.** Pedir la indexación de los cursos clave (cuota de unas 10 al día) y revisar cada lunes
   cuántas de las 238 fichas están indexadas.

## Siguientes pasos (orden por impacto)

1. Volúmenes reales y reparto de la meta por curso (requiere Semrush).
2. Páginas de área para búsquedas amplias, sobre las escuelas que ya existen (`/escuelas/...`): «cursos de
   farmacología», «cursos de habilidades blandas», «cursos de asuntos regulatorios», «cursos de calidad
   farmacéutica».
3. Contenido que responde preguntas de quien busca estudiar («cómo ser regente», «qué estudiar para
   trabajar en asuntos regulatorios»), con enlace al curso.
4. Enlaces internos desde las 367 clases abiertas, el vademécum y los casos clínicos hacia la ficha y la
   inscripción.
5. Medición semanal: clics a `/curso-de-*` en Search Console, inscripciones y certificados pagados.
