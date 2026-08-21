import Icon from '../../Icon';

/* ─── Portada 3D con sombra proyectada y borde de libro ─── */
export function EbookCover3D({ image, alt, className = '', ratio = 'aspect-[3/4]' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-4 -right-4 w-full rounded-2xl bg-[#132e55]/10 blur-sm" aria-hidden="true" />
      <div className="absolute inset-y-4 -left-3 w-full rounded-2xl bg-[#76539a]/15" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-2xl border border-[#e2d9eb] bg-white shadow-2xl shadow-[#0A2540]/20">
        <img src={image} alt={alt} width="600" height="800" className={`${ratio} w-full object-cover`} />
        <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/25 to-transparent" aria-hidden="true" />
      </div>
    </div>
  );
}

/* ─── Tablet con página interior del recurso ─── */
export function TabletMockup({ items, title, tag = 'FELIZ SIN TIROIDES' }) {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-label="Vista previa del contenido en tablet">
      <div className="absolute -left-5 top-8 h-[84%] w-full rounded-3xl border border-[#e5dceb] bg-[#f3eef8]" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-2xl border border-[#e5dceb] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#f0eaf5] bg-[#faf8fd] px-5 py-3">
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#76539a]">
            <Icon name="book" className="h-3.5 w-3.5" /> {tag}
          </span>
          <span className="rounded-full bg-[#e8f7f4] px-2 py-0.5 text-[9px] font-bold uppercase text-[#0B8176]">PDF</span>
        </div>
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#0f766e]">{title}</p>
          <div className="mt-4 space-y-3">
            {items.map((item, index) => (
              <div key={item} className="flex items-center gap-3 border-b border-gray-100 pb-2 text-sm text-gray-600">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#f2ebf7] text-xs font-bold text-[#563a78]">{index + 1}</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Smartphone (registro/tracker) ─── */
export function PhoneMockup({ title, rows, tag = 'Checklist' }) {
  return (
    <div className="relative mx-auto w-full max-w-[300px]" aria-label={`Vista previa: ${tag}`}>
      <div className="absolute -right-4 top-6 h-[86%] w-full rounded-3xl bg-[#0A2540]/5" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-3xl border-[6px] border-[#132e55] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f0eaf5] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#76539a]">{tag}</p>
          <span className="h-2 w-2 rounded-full bg-[#0f766e]" />
        </div>
        <div className="px-4 py-4">
          <p className="text-sm font-bold text-[#132e55]">{title}</p>
          <div className="mt-3 space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2.5 rounded-lg border border-[#f0eaf5] bg-[#faf8fd] px-3 py-2.5">
                <span className={`flex h-5 w-5 items-center justify-center rounded ${index < 2 ? 'bg-[#0f766e] text-white' : 'border border-gray-300 bg-white'}`}>
                  {index < 2 && <Icon name="check" className="h-3 w-3" />}
                </span>
                <span className={`h-1.5 flex-1 rounded-full ${index < 2 ? 'bg-[#d3efe9]' : 'bg-gray-100'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Tarjeta de contenido (qué incluye) ─── */
export function IncludeCard({ icon, title, helps }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#f0eaf5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE2F8] text-[#9274C9]">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h3 className="mt-3 font-semibold leading-snug text-[#132e55]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        <strong className="text-[#0B8176]">Esto te ayudará a...</strong> {helps}
      </p>
    </div>
  );
}

/* ─── "Lo que te llevas" — beneficio en vez de característica ─── */
export function TakeAway({ icon, children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e9f7f5] text-[#0B8176]">
        <Icon name={icon} className="h-3.5 w-3.5" />
      </span>
      <span className="text-sm leading-6 text-gray-700">{children}</span>
    </li>
  );
}
