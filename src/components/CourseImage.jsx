export default function CourseImage({ course, className = '', loading = 'lazy', variant = 'landscape' }) {
  const assetVersion = '20260716-edvanta-refresh';
  const isPoster = variant === 'poster';
  const webp = isPoster ? `/img/cursos/posters/${course.slug}.webp?v=${assetVersion}` : `${course.image.webp}?v=${assetVersion}`;
  const jpg = isPoster ? `/img/cursos/posters/${course.slug}.jpg?v=${assetVersion}` : `${course.image.jpg}?v=${assetVersion}`;
  const width = isPoster ? '941' : '1600';
  const height = isPoster ? '1672' : '900';

  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img
        src={jpg}
        alt={course.image.alt}
        width={width}
        height={height}
        loading={loading}
        decoding={loading === 'eager' ? 'sync' : 'async'}
        className={className}
      />
    </picture>
  );
}
