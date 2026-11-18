# Cursos nuevos para cerrar la brecha hacia 100.000 visitas (propuesta, 18-nov-2026)

Con el catálogo actual el techo estimado es de 25.000 a 50.000 visitas al mes (`seo/cursos-100k.md`). Esta
propuesta suma temas con mucho volumen que encajan con Edvanta (salud, farmacia, calidad y habilidades
profesionales). Ninguno se crea sin el visto bueno de Karla.

Fuentes: Semrush (cuenta gratuita de Karla, Colombia, 18-nov; agotó sus 10 consultas del día) y Google Trends
(Colombia, 12 meses; solo sirve para ordenar, porque los datos de Colombia son escasos).

| # | Curso propuesto | Demanda medida | Encaje | Cuidado legal o de contenido |
|---|---|---|---|---|
| 1 | **Manipulación de alimentos** | Semrush CO: 19.090 al mes en total; «curso de manipulacion de alimentos» 8.100, «… gratis» 880, «… virtual gratis» 720 | Calidad, BPM e inocuidad: el mismo lenguaje de BPM | Res. 2674 de 2013: la capacitación es obligatoria para manipuladores. Hay que confirmar quién puede impartirla y certificarla para que las autoridades sanitarias la acepten, y decirlo con claridad en la ficha. |
| 2 | **Primeros auxilios** | Trends CO: el más buscado de los cinco comparados, por encima de manipulación de alimentos | Salud; útil para pacientes, cuidadores y personal de farmacia | Contenido clínico: revisión de Karla. Debe decir que no sustituye un curso práctico certificado (RCP con maniquí). |
| 3 | **Página «Cursos gratis en salud con certificado»** (no es un curso) | Semrush CO: «cursos gratis con certificado» suma 10.360 al mes; «cursos gratis en salud con certificado» 170 | Reúne los 62 cursos actuales para esa intención | Decir con exactitud que el contenido es gratis y el certificado opcional, con su precio. |
| 4 | **Farmacovigilancia y tecnovigilancia** | Trends CO: bajo en Colombia; tema núcleo para químicos farmacéuticos en toda Latinoamérica y España | Marca y autoridad de Edvanta; vende certificado a profesionales | Normas INVIMA vigentes; revisión de Karla. |
| 5 | **Dispensación para auxiliares de farmacia** | Semrush CO: «curso auxiliar de farmacia» 170; faceta «auxiliar» con 185 variantes dentro de «curso farmacia» | Farmacia; público grande que compra certificado para su hoja de vida | Es educación informal: no otorga el título de técnico laboral en servicios farmacéuticos y debe decirlo. |
| 6 | **Seguridad y salud en el trabajo (SST)** | Semrush CO: 2.660 al mes con «curso seguridad y salud en el trabajo»; la forma más buscada («curso de 50 horas») no se pudo medir por el límite diario | Industria y servicios farmacéuticos | El curso oficial de 50 horas lo regula el Ministerio de Trabajo (Res. 4927 de 2016). Un curso de Edvanta no lo reemplaza; se ofrecería como complemento. Confirmar antes de crearlo. |

## Orden recomendado

1. **Página «Cursos gratis en salud con certificado»:** usa lo que ya existe, se puede publicar ya y apunta a un grupo de 10.000 búsquedas.
2. **Manipulación de alimentos:** el mayor volumen medido de un solo tema (19.090 al mes en Colombia), con encaje directo en calidad.
3. **Primeros auxilios:** mucha demanda en toda Latinoamérica.
4. **Dispensación para auxiliares y farmacovigilancia:** menos volumen, pero compradores de certificado muy probables.
5. **SST:** solo si se confirma un enfoque que no confunda con el curso oficial de 50 horas.

## Lo que falta medir

Con la cuenta gratuita de Semrush (10 consultas al día) se puede seguir mañana: «curso de 50 horas», «curso de
primeros auxilios» exacto, farmacovigilancia en México y España, y los mismos temas en México, Perú, Chile y
Argentina. Con el plan Pro (USD 139,95 al mes, decisión de Karla) se mediría todo en un solo día.

## Estado al 18-nov: Manipulación de alimentos (2cc2213)

- Curso creado en **borrador** (migraciones 161 y 162):
  - 5 unidades, 15 clases y 10 horas;
  - un quiz de 4 preguntas, una actividad con rúbrica y un foro por unidad;
  - certificado de COP 60.000 con la oferta vigente.
  - Fuentes: Res. 2674 de 2013 (arts. 11 a 14 y 26), concepto INVIMA 2036144 de 2018 y manual de las cinco claves de la OMS (2007).
  - Contenido en `scripts/datos/manipulacion-alimentos.mjs` (se regenera con `node scripts/generar-manipulacion-alimentos.mjs`).
- **Falta:**
  1. Revisión de Karla y aprobación para publicar.
  2. Portada (no se generan portadas en código).
  3. Al publicar, que el curso propio tome `/curso-de-manipulacion-de-alimentos`. Hoy esa dirección la tiene el curso curado de Edutin, que pasaría a `/curso-de-manipulacion-de-alimentos-en-edutin`. El cambio se hace con migración el mismo día de la publicación, para no dejar la dirección vacía.
