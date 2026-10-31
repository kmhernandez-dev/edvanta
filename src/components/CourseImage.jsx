// Portada horizontal de un curso. La variante de afiche vertical («Curso
// GRATIS») se quitó: esos afiches se borraron y no deben volver a salir.
export default function CourseImage({ course, className = '', loading = 'lazy' }) {
  const assetVersion = '20260716-edvanta-refresh';
  const webp = `${course.image.webp}?v=${assetVersion}`;
  const jpg = `${course.image.jpg}?v=${assetVersion}`;

  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img
        src={jpg}
        alt={course.image.alt}
        width="1600"
        height="900"
        loading={loading}
        decoding={loading === 'eager' ? 'sync' : 'async'}
        className={className}
      />
    </picture>
  );
}
