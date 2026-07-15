export default function FstSectionTitle({ eyebrow, title, subtitle, center }) {
  return (
    <div className={`mb-10 ${center ? 'text-center mx-auto max-w-2xl' : ''}`}>
      {eyebrow && <p className="text-xs font-bold text-teal-600 uppercase tracking-[0.2em] mb-2">{eyebrow}</p>}
      <h2 className="font-serif text-3xl md:text-4xl font-semibold text-deepblue-900 leading-tight">{title}</h2>
      {subtitle && <p className="text-base text-gray-500 mt-3 leading-relaxed">{subtitle}</p>}
    </div>
  );
}
