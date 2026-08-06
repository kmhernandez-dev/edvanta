import { Link } from 'react-router-dom';

const ICON_PATHS = {
  clipboard: 'M9 5h6a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v0a1 1 0 0 1 1-1Zm-1 1H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  scale: 'M12 4v16M7 20h10M6 4h12M6 4 3 11h6L6 4Zm12 0-3 7h6l-3-7Z',
  shield: 'M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-2.5 8.5 1.8 1.8 3.7-3.8',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z',
  message: 'M4 5h16v11H9l-5 4V5Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2',
  beaker: 'M9 4h6M10 4v5l-4.5 8A2 2 0 0 0 7.3 20h9.4a2 2 0 0 0 1.8-3L14 9V4M7.5 14h9',
  chart: 'M5 19V11M10 19V5M15 19v-6M20 19V8M4 21h16',
};

export default function ActivityCard({ activity }) {
  const d = ICON_PATHS[activity.icon] || ICON_PATHS.clipboard;

  return (
    <Link
      to={activity.route}
      className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-teal-200 hover:shadow-md transition-all flex items-start gap-4"
    >
      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors">
        <svg className="w-5 h-5 text-deepblue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={d} />
        </svg>
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-deepblue-900 group-hover:text-teal-700 transition-colors mb-0.5">{activity.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{activity.description}</p>
      </div>
      <svg className="w-4 h-4 text-gray-300 group-hover:text-teal-500 shrink-0 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
