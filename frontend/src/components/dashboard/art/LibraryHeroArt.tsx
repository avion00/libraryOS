const SHELF_ROWS = [128, 178, 228, 278, 328];
const SPINE_COLORS = ["#c2410c", "#0f766e", "#3C4854", "#b45309", "#F2AA4C", "#be123c", "#15803d", "#a16207"];

function bookRow(y: number, seed: number) {
  const spines = [];
  let x = 40;
  let i = 0;
  while (x < 300) {
    const w = 8 + ((seed + i) % 5) * 3;
    const h = 34 + ((seed + i * 3) % 4) * 4;
    const color = SPINE_COLORS[(seed + i) % SPINE_COLORS.length];
    spines.push(<rect key={`${y}-${x}`} x={x} y={y - h} width={w} height={h} rx={1.5} fill={color} opacity={0.88} />);
    x += w + 3;
    i++;
  }
  return spines;
}

export function LibraryHeroArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 420"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Bright modern library interior"
    >
      <defs>
        <linearGradient id="hero-wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5f1e8" />
          <stop offset="55%" stopColor="#eee7d8" />
          <stop offset="100%" stopColor="#e2dac4" />
        </linearGradient>
        <linearGradient id="hero-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a877" />
          <stop offset="100%" stopColor="#a7824f" />
        </linearGradient>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe0f7" />
          <stop offset="100%" stopColor="#eaf6ff" />
        </linearGradient>
        <radialGradient id="hero-sun" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fff6d8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff6d8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-shelf-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5a34" />
          <stop offset="100%" stopColor="#6e4526" />
        </linearGradient>
        <radialGradient id="hero-lamp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe9b0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffe9b0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="420" fill="url(#hero-wall)" />

      <rect x="470" y="20" width="300" height="300" rx="18" fill="url(#hero-sky)" />
      <circle cx="640" cy="110" r="110" fill="url(#hero-sun)" />
      <ellipse cx="560" cy="230" rx="46" ry="16" fill="#dff0e0" opacity="0.9" />
      <ellipse cx="690" cy="245" rx="58" ry="20" fill="#dff0e0" opacity="0.9" />
      <rect x="470" y="20" width="300" height="300" rx="18" fill="none" stroke="#d8cdb0" strokeWidth="10" />
      <line x1="620" y1="20" x2="620" y2="320" stroke="#d8cdb0" strokeWidth="6" />
      <line x1="470" y1="170" x2="770" y2="170" stroke="#d8cdb0" strokeWidth="6" />

      <g>
        <rect x="24" y="90" width="300" height="270" rx="6" fill="url(#hero-shelf-wood)" />
        <rect x="34" y="100" width="280" height="250" rx="4" fill="#7a4f2e" />
        {SHELF_ROWS.map((y, idx) => (
          <g key={y}>
            <rect x="34" y={y} width="280" height="8" fill="#5c3a20" />
            {bookRow(y, idx * 7 + 3)}
          </g>
        ))}
      </g>

      <rect x="0" y="345" width="800" height="75" fill="url(#hero-floor)" />
      <rect x="0" y="345" width="800" height="6" fill="#8a6a3f" opacity="0.6" />

      <g opacity="0.95">
        <ellipse cx="420" cy="392" rx="46" ry="10" fill="#00000014" />
        <rect x="392" y="330" width="12" height="60" rx="4" fill="#3a3a3a" />
        <rect x="440" y="330" width="12" height="60" rx="4" fill="#3a3a3a" />
        <path d="M380 300 q40 -30 90 0 l-6 40 q-40 20 -78 0 z" fill="#3C4854" />
        <path d="M380 300 q40 -30 90 0 l-4 14 q-42 22 -82 0 z" fill="#273440" />
      </g>

      <g transform="translate(560,300)">
        <ellipse cx="0" cy="96" rx="60" ry="10" fill="#00000012" />
        <rect x="-4" y="10" width="8" height="86" rx="3" fill="#3f5f4a" />
        <path d="M-46 10 C-46 -30 46 -30 46 10 Z" fill="#2f7a52" />
        <path d="M-40 -4 C-30 -34 30 -34 40 -4 Z" fill="#3a8f5f" />
        <ellipse cx="0" cy="8" rx="52" ry="14" fill="#4a3a2c" />
      </g>

      <g transform="translate(360,60)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#8a7350" strokeWidth="3" />
        <circle cx="0" cy="70" r="90" fill="url(#hero-lamp-glow)" />
        <path d="M-26 40 L26 40 L18 78 L-18 78 Z" fill="#3d3226" />
        <ellipse cx="0" cy="40" rx="26" ry="6" fill="#57493a" />
      </g>

      <circle cx="120" cy="60" r="3" fill="#fff6d8" opacity="0.8" />
      <circle cx="200" cy="40" r="2" fill="#fff6d8" opacity="0.7" />
      <circle cx="250" cy="75" r="2.5" fill="#fff6d8" opacity="0.6" />
    </svg>
  );
}
