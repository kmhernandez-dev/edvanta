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

## Medición del 18-nov (Search Console, 28 días)

- Páginas de curso (`/curso-*`): **6 clics, 104 impresiones**, posición media 16,8, en 44 páginas.
- Todo el sitio: 581 páginas indexadas y 570 sin indexar (eran 235 y 662 el 5-nov).
- `sitemap-cursos.xml`: leído el 18-nov, 605 direcciones, correcto.
- `/curso-de-oratoria`: Google aún no la conoce (ya tenía indexación solicitada). `/curso-de-liderazgo-y-trabajo-en-equipo`: indexada.
- IndexNow: 65 direcciones (62 cursos, /cursos, /escuelas y /escuelas/habilidades-blandas), HTTP 200.

## Dimensión de la meta con datos de Semrush (18-nov)

Datos en `seo/semrush/cursos-2026-11-18.md`. Cuenta gratuita: 10 filas por consulta.

- Todo lo que se busca con «curso farmacia» en Colombia suma **2.970 al mes**; «curso servicio al cliente», 1.980;
  «cursos gratis con certificado», 10.360. «Curso oratoria» suma 5.450 en México, y «curso de oratoria» exacto,
  880 en Colombia y 1.900 en México.
- Regla de cálculo (estimación, no dato): con los temas en las 3 primeras posiciones, un sitio capta del 15 al
  25 % de lo que se busca en ellos. Para **100.000 visitas** hacen falta temas que sumen entre **400.000 y
  700.000 búsquedas al mes**.
- Con el catálogo actual sumamos, en orden de magnitud:
  - farmacéuticos: pocos miles en Colombia;
  - 10 de habilidades blandas: entre 2.000 y 6.000 cada uno por país;
  - «cursos gratis con certificado»: unos 10.000 en Colombia.
  - Extendido a México, Perú, Argentina, Chile, Ecuador y España, el universo queda entre **150.000 y 250.000**:
    entre 25.000 y 50.000 visitas si se gana el top 3, algo que toma de 6 a 12 meses y exige enlaces.
- **Conclusión:** 100.000 al mes no salen solo de los 62 cursos actuales y solo de Colombia. Hacen falta tres
  palancas a la vez:
  1. **Toda Latinoamérica y España,** no solo Colombia (los títulos ya son neutros; faltan contenidos y ejemplos
     regionales).
  2. **Cursos en temas de mucho volumen** que la gente ya busca: auxiliar de farmacia (185 variantes en
     Colombia), farmacovigilancia, «cursos gratis en salud con certificado» y más habilidades blandas
     (Excel, atención al paciente, primeros auxilios). Esta decisión de catálogo le toca a Karla.
  3. **Autoridad:** los enlaces externos. Las búsquedas de KD 50 o más («curso de oratoria» en México,
     «cursos gratis con certificado») no se ganan con 3 enlaces.

## Search Console, 18-nov (tarde)

- **Sitemaps reenviados:** `sitemap.xml` (índice, 1.356 páginas, leído el 18-nov) y `sitemap-cursos.xml` (606 direcciones con el curso de manipulación de alimentos). Ambos «Correcto».
- **Indexación solicitada:** `/curso-de-manipulacion-de-alimentos`. Estaba indexada con el contenido del curado de Edutin; la solicitud es para que Google lea el curso propio.
- **Cuota diaria agotada** en la segunda solicitud (otras sesiones la usaron el mismo día).
- **Pendientes para pedir a partir del 19-nov** (unas 10 al día, en este orden):
  1. `/curso-de-servicio-al-cliente`: indexada; título nuevo.
  2. `/curso-de-oratoria`: Google aún no la conocía; ya tenía una solicitud previa.
  3. `/curso-de-inteligencia-emocional`
  4. `/curso-de-liderazgo-y-trabajo-en-equipo`: indexada; título nuevo.
  5. `/curso-de-comunicacion-asertiva`
  6. `/curso-de-negociacion-y-persuasion`
  7. `/curso-de-registro-sanitario-de-medicamentos-ante-el-invima`: la que más clics trae.
  8. `/curso-de-buenas-practicas-de-manufactura-bpm`
  9. `/curso-de-manipulacion-de-alimentos-en-edutin`: dirección nueva del curado.
  10. `/examenes/examen-avanzado-de-farmacologia-cardiovascular` (y luego los otros 11 avanzados).
- La inspección mostró «Un archivo bloquea el robot de Google» en el renderizado: es `/api/` (Disallow en robots.txt), que la aplicación pide al cargar. No afecta la indexación, porque el HTML del servidor ya trae el contenido completo.
