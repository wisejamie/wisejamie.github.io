interface BaseballProps {
  cx: number;
  cy: number;
  r: number;
  spin?: number; // 0–1, rotation progress for seam animation
}

export function Baseball({ cx, cy, r, spin = 0 }: BaseballProps) {
  const rotateDeg = spin * 360;

  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${rotateDeg})`}>
      {/* Ball body */}
      <circle r={r} fill="#f0ece0" stroke="#c8bfa0" strokeWidth={r * 0.05} />
      {/* Seam — left arc */}
      <path
        d={`M ${-r * 0.1} ${-r * 0.6}
            C ${-r * 0.7} ${-r * 0.4}, ${-r * 0.7} ${r * 0.4}, ${-r * 0.1} ${r * 0.6}`}
        fill="none"
        stroke="#c0392b"
        strokeWidth={Math.max(0.8, r * 0.07)}
        strokeLinecap="round"
      />
      {/* Seam — right arc */}
      <path
        d={`M ${r * 0.1} ${-r * 0.6}
            C ${r * 0.7} ${-r * 0.4}, ${r * 0.7} ${r * 0.4}, ${r * 0.1} ${r * 0.6}`}
        fill="none"
        stroke="#c0392b"
        strokeWidth={Math.max(0.8, r * 0.07)}
        strokeLinecap="round"
      />
    </g>
  );
}
