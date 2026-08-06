export default function TrustBar({ messages }) {
  return (
    <section className="py-8 bg-deepblue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {messages.map((msg, i) => (
            <div key={i} className="flex items-center gap-2 text-white/80">
              <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs font-medium">{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
