export function LibraryPromoArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 170" className={className} role="img" aria-label="Students studying at a library table">
      <defs>
        <linearGradient id="promo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2A3542" />
          <stop offset="100%" stopColor="#1B2530" />
        </linearGradient>
        <linearGradient id="promo-table" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7F5F1" />
          <stop offset="100%" stopColor="#EDE9E2" />
        </linearGradient>
      </defs>
      <rect width="300" height="170" rx="16" fill="url(#promo-bg)" />

      <g opacity="0.55">
        {[18, 46, 74, 226, 254].map((x, i) => (
          <rect key={x} x={x} y={14} width={22} height={40} rx={2} fill={i % 2 === 0 ? "#F2AA4C" : "#3C4854"} />
        ))}
      </g>

      <ellipse cx="150" cy="150" rx="120" ry="14" fill="#00000030" />

      <ellipse cx="150" cy="118" rx="86" ry="26" fill="url(#promo-table)" stroke="#D5CEC2" />
      <rect x="128" y="98" width="24" height="16" rx="2" fill="#F2AA4C" opacity="0.9" />
      <rect x="156" y="100" width="20" height="14" rx="2" fill="#66717B" opacity="0.85" />
      <rect x="100" y="102" width="18" height="12" rx="2" fill="#B96214" opacity="0.85" />

      <g transform="translate(96,66)">
        <circle cx="0" cy="0" r="15" fill="#f2b892" />
        <path d="M-15 4a15 15 0 0 1 30 0v6h-30z" fill="#fbcfa1" />
        <path d="M-16 -4 q16 -18 32 0 q-2 -14 -16 -14 q-14 0 -16 14z" fill="#3b2a20" />
        <rect x="-20" y="16" width="40" height="34" rx="10" fill="#F2AA4C" />
      </g>

      <g transform="translate(150,58)">
        <circle cx="0" cy="0" r="16" fill="#e8b48a" />
        <path d="M-16 5a16 16 0 0 1 32 0v6h-32z" fill="#f4c79c" />
        <path d="M-17 -6 q17 -16 34 0 q0 -16 -17 -18 q-17 2 -17 18z" fill="#241a14" />
        <rect x="-22" y="17" width="44" height="36" rx="11" fill="#3C4854" />
      </g>

      <g transform="translate(204,66)">
        <circle cx="0" cy="0" r="15" fill="#c98a5e" />
        <path d="M-15 4a15 15 0 0 1 30 0v6h-30z" fill="#d99e70" />
        <path d="M-16 -3 q16 -17 32 0 q-1 -15 -16 -15 q-15 0 -16 15z" fill="#1c130d" />
        <rect x="-20" y="16" width="40" height="34" rx="10" fill="#B96214" />
      </g>
    </svg>
  );
}
