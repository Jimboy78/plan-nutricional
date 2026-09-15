interface Props {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
  size?: number;
}

export function MacroRing({ label, current, target, color, unit = "g", size = 118 }: Props) {
  const stroke = 11;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = target > 0 ? Math.min(1, current / target) : 0;

  return (
    <div className="ring" style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          className="ring__progress"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: pct >= 1 ? `drop-shadow(0 0 6px ${color})` : undefined }}
        />
      </svg>
      <div className="ring__center">
        <strong style={{ color }}>{Math.round(pct * 100)}%</strong>
        <span>{label}</span>
      </div>
      <div className="ring__caption">
        {current}/{target}
        {unit}
      </div>
    </div>
  );
}
