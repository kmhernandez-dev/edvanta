export default function CourseImage({ course, className = '', loading = 'lazy', variant = 'landscape' }) {
  const isPoster = variant === 'poster';
  const webp = isPoster ? `/img/cursos/posters/${course.slug}.webp` : course.image.webp;
  const jpg = isPoster ? `/img/cursos/posters/${course.slug}.jpg` : course.image.jpg;
  const width = isPoster ? '900' : '1600';
  const height = isPoster ? '1272' : '900';

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
