/**
 * Iconos SVG line (estilo profesional, sin emojis).
 * Uso: <Icon name="pill" className="w-6 h-6 text-teal-600" />
 */
const PATHS = {
  pill:        'M10.5 20.5 20 11a4.95 4.95 0 0 0-7-7l-9.5 9.5a4.95 4.95 0 0 0 7 7ZM8.5 6.5l9 9',
  shield:      'M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-2.5 8.5 1.8 1.8 3.7-3.8',
  clipboard:   'M9 5h6a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v0a1 1 0 0 1 1-1Zm-1 1H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2',
  chart:       'M5 19V11M10 19V5M15 19v-6M20 19V8M4 21h16',
  heart:       'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z',
  activity:    'M3 12h4l2 7 4-14 2 7h6',
  scale:       'M12 4v16M7 20h10M6 4h12M6 4 3 11h6L6 4Zm12 0-3 7h6l-3-7Z',
  compass:     'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3-12-2 5-4 2 2-5 4-2Z',
  leaf:        'M5 19c0-8 6-13 14-13 0 8-5 13-13 13H5Zm2 0c2-6 5-8 9-9',
  sparkles:    'M12 4l1.5 4L18 9.5 13.5 11 12 15l-1.5-4L6 9.5 10.5 8 12 4ZM5 16l.8 2 2 .8-2 .8L5 22l-.8-2.4-2-.8 2-.8L5 16Z',
  users:       'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 0a3 3 0 1 0 0-6M3 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1M17 15a4 4 0 0 1 4 4v1',
  book:        'M12 6C10 4.5 7 4 4 4.5v13C7 17 10 17.5 12 19m0-13c2-1.5 5-2 8-1.5v13c-3-.5-6 0-8 1.5m0-13v13',
  droplet:     'M12 3s6 6 6 10a6 6 0 0 1-12 0c0-4 6-10 6-10Z',
  bell:        'M18 16V11a6 6 0 0 0-12 0v5l-2 2h16l-2-2ZM10 20a2 2 0 0 0 4 0',
  check:       'M5 13l4 4L19 7',
  checkCircle: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3-9 2 2 4-4',
  trendDown:   'M3 7l6 6 4-4 8 8M21 17h-6m6 0v-6',
  trendUp:     'M3 17l6-6 4 4 8-8M21 7h-6m6 0v6',
  circle:      'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  briefcase:   'M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m4 0H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1ZM4 12h16',
  cube:        'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 0v18m8-13.5L12 12 4 7.5',
  cap:         'M12 5 2 9l10 4 10-4-10-4Zm0 4v0M6 11v4c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-4',
  map:         'M9 5 3 7v12l6-2 6 2 6-2V5l-6 2-6-2Zm0 0v12m6-10v12',
  beaker:      'M9 4h6M10 4v5l-4.5 8A2 2 0 0 0 7.3 20h9.4a2 2 0 0 0 1.8-3L14 9V4M7.5 14h9',
  award:       'M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-3 0-1 6 4-2 4 2-1-6',
  sun:         'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 2v2m0 16v2M4 12H2m20 0h-2M5 5 4 4m15 15-1-1M5 19l-1 1M19 5l1-1',
};

export default function Icon({ name, className = 'w-6 h-6', strokeWidth = 1.6 }) {
  const d = PATHS[name] || PATHS.circle;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
