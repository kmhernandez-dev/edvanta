/**
 * Container — Wrapper reutilizable para todas las secciones de Edvanta.
 * Aplica max-w-7xl (1280px) centrado con padding lateral responsive.
 */
export default function Container({ children, className = '', as: Tag = 'div', size = '7xl', ...props }) {
  const sizes = {
    '7xl': 'max-w-7xl',
    '6xl': 'max-w-6xl',
    '5xl': 'max-w-5xl',
    '4xl': 'max-w-4xl',
    '3xl': 'max-w-3xl',
    '2xl': 'max-w-2xl',
  };
  const maxW = sizes[size] || sizes['7xl'];

  return (
    <Tag className={`${maxW} mx-auto px-4 sm:px-6 lg:px-8 ${className}`} {...props}>
      {children}
    </Tag>
  );
}
