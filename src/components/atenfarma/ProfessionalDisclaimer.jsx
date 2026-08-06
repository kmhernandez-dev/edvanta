export default function ProfessionalDisclaimer({ text, compact = false }) {
  if (compact) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="text-[11px] text-amber-800 leading-relaxed">{text}</p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p className="text-sm text-amber-800 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
