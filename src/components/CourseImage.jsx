export default function CourseImage({ course, className = '', loading = 'lazy' }) {
  return (
    <picture>
      <source srcSet={course.image.webp} type="image/webp" />
      <img
        src={course.image.jpg}
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
