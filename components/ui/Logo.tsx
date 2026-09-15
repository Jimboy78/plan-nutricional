export function Logo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo">
      <defs>
        <linearGradient id="logo-ball" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb057" />
          <stop offset="100%" stopColor="#e2620f" />
        </linearGradient>
        <linearGradient id="logo-leaf" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="34" r="24" fill="url(#logo-ball)" />
      <g fill="none" stroke="#7c2d12" strokeWidth="2.2" strokeLinecap="round" opacity="0.85">
        <path d="M6 34h48" />
        <path d="M30 10v48" />
        <path d="M13 17c8 8 8 26 0 34" />
        <path d="M47 17c-8 8-8 26 0 34" />
      </g>
      <path d="M40 14C42 4 54 1 61 3c1 9-5 18-15 17-3 0-5-2-6-6z" fill="url(#logo-leaf)" />
      <path d="M42 17c5-4 10-8 15-11" stroke="#14532d" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}
