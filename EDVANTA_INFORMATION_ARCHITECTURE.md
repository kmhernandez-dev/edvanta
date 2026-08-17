# Edvanta 2.0 - Arquitectura de informacion y UX

Estado: propuesta progresiva  
Fecha: 2026-08-15

## 1. Objetivo UX

Edvanta debe ayudar al usuario a responder:

- Donde puedo trabajar.
- Que area encaja conmigo.
- Que habilidades ya tengo y cuales me faltan.
- Que debo aprender ahora.
- Como puedo practicar y demostrarlo.
- Que oportunidad o conexion tiene sentido despues.

La interfaz no se organiza alrededor de inventario de cursos. Se organiza
alrededor de objetivos y siguientes pasos.

## 2. Audiencias

### Audiencia prioritaria MVP

Quimicos farmaceuticos de Latinoamerica recien egresados o con 0-3 años de
experiencia.

### Audiencias posteriores

- Estudiantes de ultimos semestres y practicantes.
- Profesionales que cambian de area o se especializan.
- Investigadores, emprendedores, mentores y consultores.
- Empresas y reclutadores verificados.

El MVP no intenta servir todos los casos con la misma profundidad.

## 3. Navegacion objetivo

### Arquitectura de marca

Edvanta es la unica marca del nuevo ecosistema profesional. No se crea NexoQF,
otra submarca, un logo farmaceutico separado ni un selector de marcas para la
nueva experiencia. Las URLs y nombres heredados de Feliz Sin Tiroides y
AtenFarma se conservan durante la migracion por continuidad comercial y SEO,
pero se presentan progresivamente como programas o espacios respaldados por
Edvanta. Cualquier cambio visible de esos nombres requiere auditoria legal,
comercial y de redirects; no se hace como parte del MVP profesional.

Navbar principal, maximo siete destinos visibles:

```text
Inicio | Carreras | Aprende | Oportunidades | Conecta | Herramientas | Recursos
```

Acciones:

- CTA principal: `Crear mi perfil`.
- CTA secundaria contextual: `Descubrir mi ruta`.
- Empresas puede vivir en un menu `Mas` o en footer durante el MVP; sube al
  navbar cuando exista oferta B2B real.

No se agrega una marca ni logo separado para la vertical profesional.

## 4. Mapa de sitio progresivo

### Publico MVP

```text
/
/carreras
/carreras/:slug
/aprende
/cursos
/cursos/:slug
/rutas
/rutas/:slug
/competencias
/competencias/:slug
/recursos
/articulos
/articulos/:slug
/oportunidades             (solo al existir fuentes verificadas)
/acerca-de-edvanta
/privacidad
/terminos
/afiliados
```

### Miembro MVP

```text
/app
/app/onboarding
/app/carrera
/app/ruta
/app/cursos
/app/biblioteca
/app/perfil
/app/privacidad
```

### Futuro

```text
/proyectos
/proyectos/:slug
/conecta
/conecta/grupos/:slug
/empresas
/empresas/:slug
/certificaciones
/herramientas/career-explorer
/herramientas/skill-gap
```

### Rutas existentes que permanecen

Las rutas FST, academia, Vida 360, AtenFarma, legales y catalogos actuales no se
eliminan. Se conectan mediante enlaces y gateways claros sin mezclarlas con el
perfil profesional.

## 5. Mega menu

### Carreras

- Explorar todas.
- Quality & Compliance.
- Manufacturing.
- Regulatory Affairs.
- Pharmacovigilance.
- Research & Development.
- Medical Affairs.
- Data & AI for Pharma.

### Aprende

- Cursos.
- Rutas.
- Competencias.
- Certificaciones.
- Recursos recientes.

### Herramientas

- Explorar carreras.
- Evaluar brechas.
- CV y ATS, coming soon.
- LinkedIn, coming soon.
- Entrevistas, coming soon.

El mega menu usa texto explicativo breve, no una pared de categorias.

## 6. Home

### 1. Hero

H1 recomendado:

> Construye tu carrera farmaceutica.

Apoyo:

> Descubre donde puedes trabajar, identifica las habilidades que necesitas y
> encuentra el siguiente paso para avanzar.

CTAs:

- Crear mi perfil gratis.
- Descubrir mi ruta.

Visual: personas y situaciones profesionales reales de industria/laboratorio;
no collage de portadas como señal principal.

### 2. Que necesitas hoy

Selector de objetivos:

- Encontrar mi primer empleo.
- Descubrir mi area.
- Mejorar mi CV.
- Mejorar LinkedIn.
- Aprender una competencia.
- Crear experiencia.

Cada opcion lleva a una accion real o a un estado coming soon honesto.

### 3. Explora carreras

Familias principales con descripcion de una linea y ejemplos de roles. No usar
datos salariales o vacantes inventadas.

### 4. Descubre tu camino

CTA hacia Career Explorer. En la primera fase puede ser un formulario simple de
intereses, no una IA que prometa precision.

### 5. Construye las habilidades que necesitas

Rutas iniciales vinculadas a carrera. Muestran resultado profesional, skills y
siguiente paso; el curso es parte del camino.

### 6. Cursos destacados

Reutiliza los ocho cursos existentes con contexto:

- Power BI para Quality Analytics, Supply, Produccion y Comercial.
- Lean Six Sigma para mejora de procesos y operaciones.
- Gestion de Calidad para QA/QMS/Compliance.

Los botones indican proveedor y relacion de afiliacion cuando aplique.

### 7. Construye experiencia

Proyectos educativos claramente etiquetados. Si no existen proyectos reales,
mostrar la propuesta y captar interes sin contadores ficticios.

### 8. Oportunidades

Solo se activa con oportunidades verificadas. Antes, CTA de lista de espera.

### 9. Conecta

Grupos de estudio/proyecto verificados. No mostrar miembros o actividad falsa.

### 10. Recursos

Articulos relacionados con las carreras y skills del MVP.

### 11. Empresas

Bloque B2B breve cuando exista flujo de verificacion y publicacion.

## 7. Pagina de carreras

Ruta: `/carreras`.

### Controles

- Busqueda.
- Familia profesional.
- Intereses: laboratorio, personas, datos, procesos, regulacion, investigacion.
- Industria/sector.
- Tipo de trabajo: laboratorio, planta, oficina, campo, remoto/hibrido cuando
  exista informacion verificable.

### Card de carrera

- Nombre.
- Familia.
- Que problema resuelve.
- Skills core, maximo tres.
- CTA `Explorar carrera`.

No usar ratings, salarios o demanda sin fuente.

## 8. Pagina de carrera

Ruta: `/carreras/:slug`.

Orden:

1. Breadcrumbs y hero.
2. Que es.
3. Que hace en el dia a dia.
4. Donde trabaja.
5. Roles relacionados.
6. Perfil que suele disfrutar este trabajo.
7. Skills core y complementarias.
8. Herramientas y regulaciones.
9. Ruta profesional.
10. Cursos recomendados con razon.
11. Proyecto practico.
12. Recursos para CV/LinkedIn/entrevista.
13. Grupos y mentores, si existen.
14. Oportunidades verificadas.

Modulos sin datos se omiten o se marcan coming soon; no dejan contenedores
vacios.

## 9. Aprende

Ruta: `/aprende`.

Debe orientar por objetivo:

- Aprender para una carrera.
- Cerrar una brecha de skill.
- Seguir una ruta.
- Encontrar un curso.
- Preparar una certificacion.

### Catalogo de cursos

Filtros:

- Area/carrera.
- Skill.
- Proveedor.
- Nivel.
- Idioma.
- Precio.
- Certificado.

Card:

- Proveedor visible.
- Titulo y descripcion.
- Skills principales.
- Para que carrera sirve.
- Tipo de acceso/precio.
- CTA contextual.

Evitar mostrar una cifra de rating si no tiene fuente y fecha.

## 10. Onboarding

Ruta: `/app/onboarding`.

Formato: seis pasos breves, progreso visible y opcion de continuar despues.

1. Etapa profesional.
2. Objetivo principal.
3. Areas de interes.
4. Habilidades actuales.
5. Herramientas utilizadas.
6. Busqueda de empleo y privacidad.

Reglas UX:

- Seleccion multiple solo donde sea necesaria.
- No pedir CV, telefono o datos sensibles para entregar la primera recomendacion.
- Explicar por que se solicita cada grupo de datos.
- Permitir corregir respuestas desde perfil.
- No mezclar consentimiento de producto con marketing.

## 11. Dashboard Mi Edvanta

Ruta: `/app`.

La pantalla empieza con una sola prioridad:

```text
Hola, Laura
Objetivo: Quality Assurance
Siguiente mejor paso: aprender CAPA
[Continuar mi ruta]
```

Despues:

- Progreso de ruta.
- Curso recomendado con razon.
- Oportunidades nuevas verificadas.
- Proyecto recomendado.
- Actividad relevante de un grupo.

No crear una tarjeta para cada dato. Usar bandas, listas y jerarquia tipografica.

Navegacion lateral:

- Inicio.
- Mi carrera.
- Mi ruta.
- Cursos.
- Proyectos.
- Oportunidades.
- Conecta.
- Herramientas.
- Biblioteca.
- Perfil.

En movil se reduce a cinco destinos principales y un menu Mas.

## 12. Perfil y privacidad

Secciones:

- Identidad profesional.
- Objetivo y areas de interes.
- Skills y herramientas.
- Educacion y experiencia.
- Links profesionales.
- Preferencias de oportunidades.
- Visibilidad y privacidad.

Privacidad por defecto: `private` o `members`, nunca `public` sin accion
explicita. El preview muestra exactamente lo que otros verian.

## 13. Oportunidades

Cuando se active:

- Filtros por tipo, carrera, skill, experiencia, pais y modalidad.
- Fecha de verificacion y fuente visibles.
- CTA externo claro.
- Guardar y reportar.
- Estado vencido automatico.

No afirmar que una aplicacion se completo si Edvanta solo abrio el sitio externo.

## 14. Conecta

Entrada por objetivo:

- Encontrar un grupo de estudio.
- Unirme a un proyecto.
- Participar en investigacion.
- Buscar mentor.
- Explorar eventos.
- Probar una herramienta/producto permitido.

La pantalla no inicia con un feed. Inicia con tipos de participacion y grupos
relacionados con la carrera elegida.

## 15. Admin

Arquitectura de navegacion:

- Taxonomia: familias, carreras, skills.
- Aprendizaje: cursos, proveedores, rutas.
- Comercial: afiliados, productos, clics.
- Contenido: recursos, autores, SEO.
- Oportunidades: empresas y publicaciones.
- Comunidad: grupos, posts, reportes.
- Usuarios: soporte, roles y auditoria.

Funciones MVP:

- CRUD con borrador/revision/publicado.
- Relacionar carrera-skill y curso-skill.
- Gestionar prioridad editorial.
- Verificar enlaces sin cambiarlos automaticamente.
- Preview antes de publicar.
- Registro de cambios.

## 16. Busqueda global

Desktop: buscador en header o comando de busqueda.  
Movil: entrada dedicada.

Agrupa resultados por:

- Carreras.
- Skills.
- Cursos.
- Recursos.
- Oportunidades.
- Empresas.
- Proyectos.
- Grupos.
- Personas, solo segun visibilidad.

En MVP se muestran solo tipos disponibles; no pestañas vacias.

## 17. Componentes reutilizables

### Navegacion

- `AppHeader`, `MegaMenu`, `MobileNavigation`, `Breadcrumbs`, `UserMenu`.

### Dominio

- `CareerCard`, `SkillChip`, `CourseCard`, `LearningPathTimeline`,
  `OpportunityRow`, `ProjectCard`, `ResourceLink`.

### Accion

- `NextBestAction`, `SaveButton`, `AffiliateLinkButton`, `ComingSoonState`,
  `EmptyState`, `FilterBar`.

### Perfil

- `ProfileVisibilityControl`, `OnboardingStepper`, `SkillLevelSelector`,
  `GoalSelector`.

Se reutilizan `Header`, `Footer`, cards de cursos y tracking actuales mediante
adaptadores. No se reemplazan todos en un unico release.

## 18. Sistema visual

- Profesional, claro y sobrio.
- Azul marino Edvanta como base, teal para accion secundaria/estado positivo.
- Acentos adicionales solo para significado, no decoracion.
- Sin gradientes dominantes ni composicion de crypto startup.
- Cards de radio maximo 8 px salvo sistema existente justificado.
- Titulos compactos en paneles; hero scale solo en home y hubs.
- Iconos Lucide consistentes.
- Estados de hover, focus, loading, empty, error y disabled completos.
- Contenido mobile-first y tactil de al menos 44 px.

## 19. Accesibilidad

- Un `h1` por pagina y jerarquia de headings.
- Landmarks `header`, `nav`, `main`, `footer`.
- Nombre accesible para botones de icono; `title` no es suficiente.
- Focus visible y orden logico.
- Formularios con labels, errores asociados y resumen cuando aplique.
- Contraste WCAG AA.
- No depender solo del color.
- Modales con foco atrapado, Escape y retorno de foco.
- Carruseles pausables y controles accesibles.
- Respeto a `prefers-reduced-motion`.

## 20. Rendimiento

El bundle principal actual es de 1.627 MB minificado. La arquitectura nueva debe:

- Lazy-load Carreras, Admin, Comunidad, Oportunidades y herramientas.
- Separar datasets de salud y catalogos de la home.
- Servir imagenes responsivas WebP/AVIF.
- Evitar cargar mapas, editores o graficas hasta necesitarlos.
- Medir LCP, INP y CLS por plantilla.
- Prerenderizar paginas publicas indexables cuando se implemente el plan SEO.

## 21. Eventos de producto por flujo

| Flujo | Eventos |
|---|---|
| Registro | signup_started, signup_completed |
| Onboarding | onboarding_step_completed, onboarding_completed |
| Carrera | career_viewed, career_selected |
| Skills | skill_viewed, skill_self_assessed |
| Ruta | learning_path_viewed, learning_path_started, step_completed |
| Curso | course_viewed, course_saved, affiliate_click |
| Recursos | resource_viewed, resource_saved |
| Oportunidades | job_viewed, outbound_application_click |
| Comunidad | group_viewed, group_joined, project_joined |
| Perfil | profile_completed, profile_visibility_changed |

## 22. Estrategia de rollout UX

### Release 1: orientacion publica

- Nueva navegacion bajo feature flag.
- Home orientada a carrera.
- `/carreras` y 11 fichas en draft/revision.
- Cursos actuales contextualizados.

### Release 2: perfil

- Cuenta canonica, onboarding y perfil privado.
- Guardados de cursos/recursos.
- Dashboard con siguiente mejor paso editorial.

### Release 3: progreso

- Rutas y avance.
- Skill gap basico basado en reglas.
- Proyectos educativos piloto.

### Release 4: oportunidades

- Empresas y oportunidades verificadas.
- Alertas y guardados.

### Release 5: comunidad

- Grupos/proyectos con moderacion.
- Mentoring y testing solo con operaciones definidas.

## 23. Pruebas de aceptacion MVP

### Usuario anonimo

- Encuentra una carrera desde home en dos acciones.
- Comprende que Edvanta recomienda cursos de terceros.
- Puede filtrar cursos y volver sin perder contexto.
- Las URLs actuales siguen funcionando.

### Usuario registrado

- Completa onboarding sin datos sensibles innecesarios.
- Selecciona carrera y recibe un siguiente paso explicable.
- Guarda curso/recurso y comienza una ruta.
- Controla visibilidad del perfil.

### Administrador

- Crea/editora una carrera y skills sin deploy.
- Relaciona curso-skill y carrera-skill.
- Revisa el enlace comercial exacto antes de publicar.
- Ve auditoria de cambios.

## 24. Metricas de exito iniciales

- Porcentaje de registro completado.
- Porcentaje de onboarding completado.
- Carrera seleccionada.
- Ruta iniciada.
- Guardados por usuario.
- Clic de afiliado contextualizado por carrera/skill.
- Retorno a siete y treinta dias.

No usar contadores publicos ficticios como prueba social.
