/**
 * Bespoke library-interior illustration for the auth page's right panel.
 * No stock/external photography is available to this project, so this
 * extends the same hand-built SVG art style already used elsewhere in the
 * app (see components/dashboard/art/) rather than relying on an unstable
 * external image URL.
 */
export function LibraryLoginArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 1400" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label="A warmly lit library reading room">
      <defs>
        <linearGradient id="loginArtSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6EFDF" />
          <stop offset="100%" stopColor="#EFE3CB" />
        </linearGradient>
        <linearGradient id="loginArtFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A877" />
          <stop offset="100%" stopColor="#A7824F" />
        </linearGradient>
        <linearGradient id="loginArtWindowGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF6D8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFF6D8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="loginArtTable" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C89B6B" />
          <stop offset="100%" stopColor="#A67A45" />
        </linearGradient>
        <radialGradient id="loginArtLampGlow" cx="50%" cy="0%" r="70%">
          <stop offset="0%" stopColor="#FFE9B0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFE9B0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="900" height="1400" fill="url(#loginArtSky)" />

      {/* Window with warm light */}
      <g opacity="0.9">
        <rect x="80" y="90" width="360" height="520" rx="6" fill="#FBF6E8" stroke="#E3D6B8" strokeWidth="8" />
        <line x1="260" y1="90" x2="260" y2="610" stroke="#E3D6B8" strokeWidth="8" />
        <line x1="80" y1="350" x2="440" y2="350" stroke="#E3D6B8" strokeWidth="8" />
        <rect x="88" y="98" width="164" height="244" fill="#EAF1EE" />
        <rect x="268" y="98" width="164" height="244" fill="#EAF1EE" />
        <rect x="88" y="358" width="164" height="244" fill="#EAF1EE" />
        <rect x="268" y="358" width="164" height="244" fill="#EAF1EE" />
      </g>
      <ellipse cx="260" cy="340" rx="360" ry="420" fill="url(#loginArtWindowGlow)" />

      {/* Bookshelf wall, right side */}
      <g>
        <rect x="470" y="60" width="380" height="700" rx="10" fill="#8A5A34" />
        <rect x="486" y="76" width="348" height="668" fill="#7A4F2E" />
        {[0, 1, 2, 3, 4, 5].map((row) => {
          const y = 92 + row * 108;
          const seed = row * 7 + 3;
          const books = [];
          let x = 500;
          let i = 0;
          while (x < 800) {
            const w = 16 + ((seed + i) % 5) * 6;
            const h = 82 + ((seed + i * 3) % 4) * 6;
            const palette = ["#C2410C", "#0F766E", "#3C4854", "#B45309", "#F2AA4C", "#7A2E2E", "#15803D", "#8A6A2F"];
            const color = palette[(seed + i) % palette.length];
            books.push(<rect key={`${row}-${i}`} x={x} y={y + (108 - h)} width={w} height={h} rx="2" fill={color} opacity="0.92" />);
            x += w + 5;
            i++;
          }
          return (
            <g key={row}>
              {books}
              <rect x="486" y={y + 100} width="348" height="8" fill="#5C3A20" />
            </g>
          );
        })}
      </g>

      {/* Hanging pendant light */}
      <g transform="translate(360,60)">
        <line x1="0" y1="0" x2="0" y2="120" stroke="#2B2118" strokeWidth="4" />
        <ellipse cx="0" cy="185" rx="230" ry="140" fill="url(#loginArtLampGlow)" />
        <path d="M-58 120 C-58 165 58 165 58 120 Z" fill="#20180F" />
        <ellipse cx="0" cy="120" rx="58" ry="14" fill="#332818" />
      </g>

      {/* Floor */}
      <rect x="0" y="900" width="900" height="500" fill="url(#loginArtFloor)" />
      <rect x="0" y="895" width="900" height="10" fill="#8A6A3F" opacity="0.7" />

      {/* Indoor plant */}
      <g transform="translate(640,760)">
        <ellipse cx="0" cy="230" rx="86" ry="16" fill="#00000018" />
        <path d="M-46 210 L46 210 L34 90 L-34 90 Z" fill="#B9895A" />
        <path d="M-46 210 L46 210 L42 190 L-42 190 Z" fill="#A67A45" />
        <rect x="-10" y="20" width="20" height="90" rx="6" fill="#4C6B4A" />
        <path d="M0 30 C-70 -10 -110 -90 -60 -140 C-30 -170 20 -150 10 -100 C60 -140 130 -100 100 -40 C80 5 20 20 0 30 Z" fill="#3F7A52" />
        <path d="M0 30 C-40 0 -60 -60 -30 -100 C-10 -125 25 -110 15 -75 C45 -100 90 -75 70 -30 C55 0 20 20 0 30 Z" fill="#4E8F60" />
      </g>

      {/* Reading table with books */}
      <g transform="translate(230,860)">
        <ellipse cx="0" cy="240" rx="230" ry="26" fill="#00000018" />
        <rect x="-220" y="60" width="440" height="26" rx="6" fill="url(#loginArtTable)" />
        <rect x="-198" y="86" width="18" height="150" fill="#8C6A3E" />
        <rect x="180" y="86" width="18" height="150" fill="#8C6A3E" />
        <rect x="-90" y="10" width="130" height="52" rx="3" fill="#EFE7D6" />
        <rect x="-90" y="10" width="130" height="14" rx="3" fill="#F6EFDF" />
        <rect x="-70" y="-16" width="96" height="30" rx="3" fill="#DCCFAE" />
        <rect x="20" y="-2" width="60" height="64" rx="3" fill="#C2410C" opacity="0.85" />
      </g>

      {/* Chair */}
      <g transform="translate(120,1000)">
        <path d="M-70 -140 C-70 -190 70 -190 70 -140 L60 20 L-60 20 Z" fill="#D3812F" />
        <path d="M-70 -140 C-70 -170 70 -170 70 -140 L64 -40 L-64 -40 Z" fill="#E9952E" />
        <rect x="-64" y="20" width="18" height="90" fill="#5C3A20" />
        <rect x="46" y="20" width="18" height="90" fill="#5C3A20" />
      </g>

      {/* Soft ambient glow bottom-left */}
      <ellipse cx="140" cy="1250" rx="260" ry="90" fill="#FFF6D8" opacity="0.25" />
    </svg>
  );
}
