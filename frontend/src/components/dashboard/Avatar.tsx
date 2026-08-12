const PALETTE = [
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-teal-100", text: "text-teal-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-yellow-100", text: "text-yellow-700" },
  { bg: "bg-stone-200", text: "text-stone-700" },
  { bg: "bg-paper-700", text: "text-ink-500" },
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function paletteFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const { bg, text } = paletteFor(name);
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${bg} ${text}`}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.36) }}
    >
      {initials(name)}
    </span>
  );
}
