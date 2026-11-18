# Estrategia de posicionamiento de las clases

17 de noviembre de 2026. Pedido de Karla: «posicionar los cursos porque allí están las ventas».

## La idea

Cada clase abierta (`/curso-de-…/clase/…`) responde una búsqueda concreta de un profesional, por ejemplo «metformina ajuste renal», «despeje de línea BPM» o «endotoxinas LAL».

Una ficha de curso compite por búsquedas amplias y difíciles, como «curso de farmacoterapia». Las clases, en cambio, entran por cientos de búsquedas de cola larga y llevan a quien llega al curso completo. El certificado, que cuesta COP 60.000, se vende en el curso.

El camino es:

1. la búsqueda;
2. la clase;
3. «Inscríbete gratis al curso»;
4. el aula;
5. el certificado.

## Punto de partida

**Clases abiertas: 367, en 11 cursos.**

| Curso | Clases abiertas |
|---|---|
| Farmacoterapia de la diabetes | 40 |
| Farmacoterapia de la insuficiencia cardiaca | 39 |
| Farmacoterapia del asma y la EPOC | 38 |
| Farmacoterapia de la hipertensión arterial | 37 |
| Farmacología endocrina | 35 |
| Control de calidad de medicamentos | 35 |
| Buenas prácticas de manufactura (BPM) | 35 |
| Farmacología del sistema nervioso central | 34 |
| Farmacología cardiovascular | 33 |
| Farmacología respiratoria | 32 |
| Validaciones y calificaciones | 9 |

**Search Console, 17 de noviembre.** De las 117 páginas en «Rastreada: actualmente sin indexar», 58 son clases. Google las leyó pero decidió no indexarlas todavía. Las causas más probables, en este sitio:

- **Pocos enlaces internos.** La ficha del curso mostraba el temario sin enlaces a las clases. Google solo llegaba a ellas por el sitemap y por los enlaces entre clases.
- **Títulos largos.** Llegaban a 86 caracteres y Google los cortaba. Las descripciones eran el inicio de un relato, no lo que se aprende.
- **Ninguna señal de quién responde por el contenido.** En temas de salud, Google pesa la experiencia y la autoridad de quien lo revisa.
- **El sitio es joven y tiene pocos enlaces externos.** Esto no se arregla en el código; está en `seo/PLAN-AUTORIDAD-ENLACES.md`.

## Lo que quedó hecho el 17 de noviembre

1. **Verificación.** Cada clase muestra «Verificada por Karla Hernández, química farmacéutica · Última revisión: 17 de noviembre de 2026», con enlace a su perfil de autora.
   - En los datos estructurados va como `WebPage.reviewedBy`, con la misma Person de `/autores/karla-hernandez`, y `lastReviewed`.
   - En el aula aparece en cada clase de los cursos de Edvanta, no en los de empresas.
   - Está en `api/lib/revision-de-clases.js`.
2. **Videos con crédito y licencia.** La página pública de la clase muestra su video de YouTube con:
   - el crédito: título del video, canal y enlace;
   - la nota «Licencia estándar de YouTube»;
   - «Se reproduce con el reproductor oficial de YouTube; los derechos del video son de su autor».

   Lo mismo aparece bajo cada video en el aula.
   - El canal y la disponibilidad de los 866 videos salen del oEmbed oficial de YouTube y se guardan en `api/lib/videos-youtube.json`, que genera `node scripts/videos-youtube.mjs`.
   - Los videos retirados o sin permiso de inserción no se muestran en la página pública.
3. **Títulos.** Tienen 60 caracteres como máximo, siguen siempre la misma regla y ninguno se repite entre las 367 clases; una prueba lo comprueba.
4. **Descripciones.** Dicen el tema de la clase, lo que se aprende, que es gratis y que la verificó una química farmacéutica.
5. **La ficha del curso enlaza cada clase abierta de su temario,** tanto en el HTML del servidor como en la aplicación, con la etiqueta «Clase abierta». Es el cambio de más peso: la página que vende reparte su autoridad a las clases, y las clases devuelven tráfico a la ficha.
6. **Página de la clase.**
   - El video aparece arriba. Hasta que alguien lo reproduce solo se carga la miniatura, para que la página abra rápido.
   - La portada del curso es la imagen al compartir (og:image).
   - Al final hay un bloque «Sigue el curso completo, gratis» con el número de clases y unidades.
7. **Sitemap.** Las clases salen con la fecha de esta revisión, para que Google sepa que cambiaron.

## Plan

### Semana 1: que Google vuelva a leer todo

- **Solicitudes de indexación.** Google deja unas 10 al día; esta semana se gastan en este orden:
  1. Las 11 fichas de curso. Ahora enlazan a sus clases, así que al leerlas Google encuentra 367 enlaces nuevos.
  2. Una clase por curso, la de más búsqueda. Lista de partida:
     - diabetes: «Metformina: mecanismo, indicaciones, dosificación y ajuste por función renal»;
     - hipertensión: «IECA y ARA-II»;
     - EPOC: «Exacerbaciones de la EPOC»;
     - BPM: «Despeje de línea»;
     - control de calidad: «Cromatografía líquida de alta eficiencia (HPLC)»;
     - insuficiencia cardiaca: «Diuréticos de asa»;
     - sistema nervioso central: la clase de migraña;
     - respiratoria: «Agonistas beta-2: SABA y LABA»;
     - endocrina: «Calcio, vitamina D y bisfosfonatos»;
     - cardiovascular: «Clases I a IV y otros antiarrítmicos»;
     - validaciones: «DQ, IQ, OQ y PQ».
- **Bing.** IndexNow con todas las clases, que ya están en el sitemap con fecha nueva.
- **Validaciones.** La validación de «Rastreada: actualmente sin indexar» se inició el 17 de noviembre. Se revisa cada semana.

### Semanas 2 a 4: enlaces desde lo que ya posiciona — hecho el 17 de noviembre

El vademécum y los artículos de salud ya están indexados y reciben impresiones. Ahora cada uno enlaza a la clase gratuita que enseña lo mismo, con el nombre de la clase como texto del enlace. La clase enlaza de vuelta.

**Lo que quedó publicado** (commit 086c636, «SEO: enlaces entre vademécum, artículos y clases abiertas»):

- **Parejas.** Están en `api/lib/enlaces-de-salud.js`: 49 monografías, 11 grupos del vademécum y 41 artículos enlazan a **121 clases distintas** de 8 cursos de salud. Una pareja solo entra si la clase nombra el medicamento en su título o lo trata a fondo en su texto. Se comprobó contando menciones en el texto de las 367 clases de producción.
- **Vademécum.** Cada página tiene la sección «Apréndelo en clase, gratis», con sus clases y los cursos completos. Los grupos ponen primero el curso que enseña el tema (por ejemplo, diabetes tipo 2 lleva al Curso de Farmacoterapia de la Diabetes y al de Farmacología Endocrina).
- **Artículos.** Llevan la sección «Para profesionales de la salud: clases gratuitas», con 1 a 3 clases y sus cursos. Entre ellos: los 8 de presión alta, las fichas `…-para-que-sirve` de medicamentos con clase, diabetes, insuficiencia cardiaca, asma, EPOC, inhaladores, levotiroxina y las guías «Cursos de hipertensión» y «Cursos de diabetes para profesionales».
- **Clases.** Llevan la sección «Para profundizar» con tres bloques: «En el vademécum de Edvanta», «Para explicarle al paciente» y «Lecturas relacionadas».
- **Datos estructurados.** Las tres páginas declaran `relatedLink` con las direcciones que enlazan.
- **Prueba.** `src/__tests__/enlaces-de-salud.test.js` compara cada clase con `src/data/clases-abiertas.json`, la lista de producción. Esa lista se regenera con `node scripts/clases-abiertas.mjs` después de publicar, renombrar o retirar clases. Si una clase cambia de nombre o de dirección, la prueba falla hasta corregir la pareja.

**Pendiente:**

- **Sin clase propia que enlazar:** antidepresivos y ansiolíticos (sertralina, fluoxetina, trazodona, quetiapina, clonazepam), antibióticos ambulatorios, aparato digestivo, antimicóticos y antiparasitarios, oncología y anticoagulantes directos (apixabán, rivaroxabán). Se enlazarán cuando haya clases de esos temas.
- **Clases de salud sin ningún enlace entrante:** 167 de 288, sobre todo introducciones de unidad, casos y temas sin página en el vademécum. Los artículos nuevos deberían apuntar a ellas.
- **Monografías y artículos que otra sesión agregó el 17-nov y aún no tienen commit:** dapagliflozina, finerenona, gliclazida, el grupo de enfermedad renal crónica y 9 artículos (colesterol, triglicéridos, estatinas, artrosis, rodilla, fibromialgia, fibrilación auricular, anticoagulantes y warfarina). Sus parejas ya están escritas en el archivo en disco y suben junto con esas páginas.

### Mes 2: contenido y formato

- **Videos rotos.** Hay 7 videos que YouTube reporta retirados o sin permiso de inserción. Varias de esas clases se completan viendo el video, así que quien estudia **no puede completarlas ni sacar el certificado**. Hay que reemplazar el video o cambiar la regla de la clase. Es lo más urgente para las ventas.

  | Clase | Problema |
  |---|---|
  | Diseño de estudios de estabilidad según ICH Q1A | retirado |
  | Diseños reducidos: bracketing y matrixing (ICH Q1D) | retirado |
  | Inhibidores de PARP y de mTOR | retirado |
  | Fisiopatología de la insuficiencia cardíaca: activación neurohormonal… | el autor no permite insertarlo |
  | IECA y ARA-II en la IC con FEVI reducida… | el autor no permite insertarlo |
  | Equipos: calificación (DQ/IQ/OQ/PQ), limpieza, mantenimiento y calibración | el autor no permite insertarlo |
  | Derecho de petición y solicitudes de información (Ley 1755 de 2015) | el autor no permite insertarlo |

- **Datos de video.** Con una clave de la API de YouTube Data v3 se obtienen la fecha de publicación y la licencia oficial de cada video. Con eso se puede marcar `VideoObject` y aparecer en la pestaña de videos de Google. Sin la fecha, Google lo marca como no válido; por eso hoy no se marca. Crear la clave es gratis en Google Cloud y la crea Karla.
- **Palabras clave por clase.** Cada experiencia ya trae `keywords`. Se cruzan con las consultas reales de Search Console (filtro de página «/clase/») y se ajustan el título y el primer párrafo de las clases que reciben impresiones en posiciones 8 a 20.
- **Clases de «Introducción a la unidad».** Responden poca búsqueda. Se dejan, pero sin solicitarles indexación.

### Medición, cada semana

En Search Console, informe de rendimiento con la página filtrada por `/clase/`:

- clases indexadas: hoy, al menos 58 sin indexar; la meta es 300 de 367 en ocho semanas;
- impresiones y clics;
- consultas nuevas.

En el aula: inscripciones por curso y certificados pagados. Para saber cuántas inscripciones llegan desde una clase hace falta un evento al hacer clic en «Inscríbete gratis» desde la clase; queda como siguiente paso técnico.

## Reglas

- **Contenido clínico.** No se publica una clase nueva sin la verificación de Karla. La fecha de revisión vive en `api/lib/revision-de-clases.js`; si Karla revisa de nuevo, se cambia ahí.
- **Videos.** Solo YouTube o Vimeo con su reproductor oficial y su crédito. Al agregar videos se corre `node scripts/videos-youtube.mjs` para tener su canal y saber si están disponibles.
- **Títulos de clases homónimas.** Si dos clases de cursos distintos quedan con el mismo título, la prueba «ningún título repetido» falla. Se resuelve con un título escrito a mano en `TITULOS_DISTINTOS` (`api/lib/clase-publica.js`).
