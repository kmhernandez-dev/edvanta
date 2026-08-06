const ICON_PATHS = {
  clipboard: 'M9 5h6a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v0a1 1 0 0 1 1-1Zm-1 1H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2',
  scale: 'M12 4v16M7 20h10M6 4h12M6 4 3 11h6L6 4Zm12 0-3 7h6l-3-7Z',
  shield: 'M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-2.5 8.5 1.8 1.8 3.7-3.8',
  trendUp: 'M3 17l6-6 4 4 8-8M21 7h-6m6 0v6',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z',
  message: 'M4 5h16v11H9l-5 4V5Z',
  activity: 'M3 12h4l2 7 4-14 2 7h6',
  chart: 'M5 19V11M10 19V5M15 19v-6M20 19V8M4 21h16',
};

export default function ProcessFlow({ steps }) {
  return (
    <div className="relative">
      {/* Desktop: horizontal flow */}
      <div className="hidden lg:grid grid-cols-8 gap-3">
        {steps.map((step, i) => {
          const d = ICON_PATHS[step.icon] || ICON_PATHS.clipboard;
          return (
            <div key={step.step} className="relative text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-deepblue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={d} />
                </svg>
              </div>
              <p className="text-[10px] font-bold text-deepblue-900 mb-0.5">{step.title}</p>
              <p className="text-[10px] text-gray-400 leading-tight">{step.description}</p>
              {i < steps.length - 1 && (
                <div className="absolute top-6 -right-1.5 w-3 text-teal-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical flow */}
      <div className="lg:hidden space-y-0">
        {steps.map((step, i) => {
          const d = ICON_PATHS[step.icon] || ICON_PATHS.clipboard;
          return (
            <div key={step.step} className="flex items-start gap-3 relative">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-deepblue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={d} />
                  </svg>
                </div>
                {i < steps.length - 1 && <div className="w-0.5 h-6 bg-teal-100 my-1" />}
              </div>
              <div className="pb-4">
                <p className="text-xs font-bold text-deepblue-900">{step.step}. {step.title}</p>
                <p className="text-[11px] text-gray-500">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
