# Arquitectura de FST Vida 360

## Diagnostico del repositorio

Edvanta usa React 18, Vite, React Router, Tailwind CSS, una API Express y PostgreSQL. La academia ya aporta cuentas con email o Google y JWT. Migrar el sitio completo a Next.js aumentaria el riesgo sobre cursos, pagos, SEO y academia, por lo que Vida 360 se integra como un dominio funcional aislado sobre la arquitectura existente.

## Componentes

1. **Portal React** en `/vida-360`: interfaz movil primero, navegacion inferior movil y lateral en escritorio.
2. **Contexto de datos**: autosave con adaptador local para demo y adaptador HTTP para sesiones autenticadas.
3. **API Express** en `/api/vida360`: lectura, guardado, exportacion y desactivacion. La identidad proviene del JWT.
4. **PostgreSQL**: entidades relacionales preparadas para historial e interoperabilidad; un read-model JSON versionado acelera el MVP y no reemplaza las tablas clinicas normalizadas.
5. **Documentos**: PDF generado en el navegador con seleccion de campos; exportacion JSON desde la API o el modo demo.

## Decisiones

- Se reutiliza `academia_users` como identidad, sin duplicar contrasenas.
- Los datos Vida 360 usan su propio prefijo y no se mezclan con compras o progreso educativo.
- El modo demo se almacena solo en el navegador y usa personas ficticias.
- Las reglas del Mapa 360 son transparentes y estan separadas de la interfaz.
- No se cargan archivos clinicos reales en el MVP inicial; se documenta el adaptador privado futuro.

## Fases

1. MVP demo y persistencia autenticada basica.
2. Normalizacion completa de todos los comandos y almacenamiento privado.
3. Revision juridica, clinica, regulatoria y de seguridad.
4. Piloto controlado y observabilidad.

