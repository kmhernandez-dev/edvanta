# Edvanta Pacientes

Guía técnica y de cumplimiento del departamento de pacientes de Edvanta. La marca pública es **Edvanta Contigo** (`https://edvanta.co/contigo`). La opera el super agente definido en `.claude/agents/super-agente-pacientes.md`.

> Este repositorio es público. La estrategia comercial (ofertas B2B, precios, aliados y proyecciones) vive en un documento privado fuera del repositorio.

## Qué aprendimos de PatientsLikeMe

Análisis de páginas públicas el 21-nov-2026, respetando su `robots.txt`, que bloquea los perfiles de miembros:

- **Propuesta:** «encuentra tu comunidad». Publica más de 850.000 miembros, 70 comunidades y 2.800 condiciones.
- **Motor de SEO:** miles de páginas programáticas:
  - `/conditions/{condición}`, con definición, síntomas, tratamientos, distribución por edad y sexo, y foro;
  - `/treatment/{tratamiento}`, con efectividad percibida, efectos secundarios en porcentaje y reseñas.
- **Debilidades que aprovechamos:**
  - está solo en inglés;
  - no tiene revisión profesional visible;
  - muchas páginas son delgadas («no tenemos suficientes datos»);
  - muros de registro para ver los datos;
  - ningún contexto del sistema de salud colombiano.
- **Modelo de negocio:** sin publicidad. Según su política y fuentes públicas, vende servicios de investigación y datos agregados y desidentificados a farmacéuticas, y hace alianzas para reclutar en ensayos clínicos. Afirma no vender información identificable sin consentimiento expreso y específico.

**Nuestra diferencia:**

- español de Colombia;
- revisión por químicos farmacéuticos y fuentes oficiales;
- contenido abierto sin muros;
- acompañamiento humano;
- y una promesa más fuerte que la suya: **no vendemos datos**.

## Arquitectura

| Capa | URL | Estado |
|---|---|---|
| Portada | `/contigo` | Publicada |
| Rutas por condición | `/contigo/{condicion}` | Tiroides abierta; las demás, en lista de interés |
| Programa Contigo Alto Costo | `/contigo/alto-costo` | Construido; registro cerrado y en `noindex` |
| Gestión de datos del titular | `/contigo/alto-costo/mis-datos?t=` | Construida |
| Artículos para pacientes | `/articulos/{tema}` y `/articulos/{medicamento}-para-que-sirve` | 479 artículos; los de «para qué sirve» son los que más posicionan |
| Vademécum profesional | `/vademecum/{grupo o medicamento}` | 14 grupos, incluido el de oncología de alto costo (trastuzumab, imatinib, pembrolizumab) |
| Herramientas privadas | `/fst-app` (tiroides) | Publicadas |

**Patrón de SEO recomendado.** Los artículos editoriales para pacientes siguen en `/articulos/`, porque ahí está la autoridad ganada. Cada condición tiene un hub en `/contigo/{condicion}`, que:

- enlaza sus artículos, las fichas de sus medicamentos y las monografías del vademécum;
- cierra con el registro al programa.

Así se replica la red de páginas de condición y tratamiento de PatientsLikeMe sin páginas delgadas: solo se publica una página cuando tiene contenido verificado completo.

## Prioridad de condiciones

Son las enfermedades de alto costo que sigue la Cuenta de Alto Costo: artritis reumatoide, cáncer, enfermedad renal crónica, hemofilia, hepatitis C, VIH y huérfanas.

| Ola | Condiciones | Por qué primero |
|---|---|---|
| 1 | Cáncer, enfermedad renal crónica, artritis reumatoide | Ya hay activos: el grupo de oncología de alto costo del vademécum, los cursos de farmacología oncológica y renal, y las rutas oncológica y renal en lista de interés |
| 2 | VIH, hepatitis C | Tratamientos con adherencia crítica, donde el acompañamiento farmacéutico agrega valor medible |
| 3 | Hemofilia, enfermedades huérfanas | Poblaciones pequeñas: alianzas con asociaciones de pacientes antes que SEO masivo |

**Pendiente:** medir el volumen de búsqueda de cada condición en Semrush (base Colombia) antes de fijar el calendario editorial. Hoy no hay datos de volumen para estas condiciones en `seo/semrush/`.

## El programa Contigo Alto Costo

### Qué hace

- Registra pacientes y cuidadores. Solo pide nombre, correo y la autorización de datos de contacto.
- La condición, el medicamento y la EPS son opcionales y exigen una autorización expresa propia.
- Tiene autorizaciones separadas para cada uso:
  - comunicaciones educativas;
  - contacto de un químico farmacéutico;
  - análisis anonimizados;
  - información de programas de terceros, sin entregar datos.
- Envía un enlace personal con el que el titular revisa sus datos, cambia sus autorizaciones o pide la supresión.
- Deja una bitácora con cada autorización y cada revocación.
- Da al equipo dos vistas: cifras agregadas, con los grupos de menos de 5 personas ocultos, y la lista de quienes autorizaron el contacto de un químico farmacéutico.

### API

`/api/contigo/alto-costo`

| Ruta | Uso |
|---|---|
| `GET /estado` | Si se reciben registros |
| `POST /registro` | Registro |
| `GET /mis-datos?t=` | El titular consulta sus datos |
| `POST /mis-datos` | El titular cambia sus autorizaciones |
| `POST /suprimir` | El titular pide la supresión |
| `GET /admin/resumen` | Cifras agregadas (cabecera `x-admin-token`) |
| `GET /admin/contactos` | Contactos que autorizaron llamada de un QF (cabecera `x-admin-token`) |

### Lista de apertura

El registro se abre con `CONTIGO_ALTO_COSTO_ACTIVO=true` en Coolify. Abrirlo antes de cumplir todos estos puntos expone a Edvanta a sanciones de la SIC, que según la Ley 1581 incluyen el cierre de operaciones que tratan datos sensibles.

1. [ ] Un abogado de protección de datos revisa:
   - los textos de autorización, versión `AC-2026-11-v1`;
   - la página del programa;
   - el correo de bienvenida.
2. [ ] La política de tratamiento en `/privacidad` incluye las finalidades del programa y el canal de consultas y reclamos.
3. [ ] Está definido el procedimiento de consultas y reclamos de los artículos 14 y 15 de la Ley 1581, con responsable y plazos.
4. [ ] La base está inscrita o actualizada en el Registro Nacional de Bases de Datos de la SIC, si Edvanta está obligada.
5. [ ] Karla revisa la página y se quita el `noindex`.
6. [ ] `ADMIN_TOKEN` y Resend están configurados en producción.
7. [ ] Se hace una prueba de punta a punta en producción con un correo de prueba: registro, correo, gestión, revocación y supresión.
8. [ ] Existe un protocolo del químico farmacéutico para contactar a los registrados: guion, tiempos, qué se registra y dónde.

### Riesgo conocido

El token de gestión viaja en la URL del enlace. Conviene no registrar las URLs completas con consulta en los logs de nginx para `/api/contigo/`. También hay que rotar el token si la persona lo pide.

## Métricas

| Métrica | Definición | Fuente |
|---|---|---|
| Norte | Personas con autorización activa en el programa | `GET /admin/resumen` (`activos`) |
| Tráfico de pacientes | Visitas orgánicas a `/contigo/*` y a artículos de pacientes | Search Console |
| Conversión | Registros ÷ visitas a `/contigo/alto-costo` | Analítica y API |
| Profundidad | Porcentaje de registrados que autorizan datos sensibles y contacto de un QF | `GET /admin/resumen` |
| Confianza | Revocaciones y supresiones ÷ registros | Bitácora |
| Acompañamiento | Contactos atendidos por un QF en menos de 72 horas | Protocolo de operación |

**Línea base (Semrush, 16-nov-2026):**

| Indicador | Valor |
|---|---|
| Keywords orgánicas del proyecto | 347 |
| Visitas orgánicas al mes | 816 |
| Backlinks | 267 |

Las keywords que posicionan son de intención «para qué sirve».
