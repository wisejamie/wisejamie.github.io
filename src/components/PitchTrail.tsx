import type { ScreenPos } from '../lib/projection';

interface PitchTrailProps {
  points: ScreenPos[];      // all projected frames up to current
  color?: string;
}

export function PitchTrail({ points, color = '#ffffff' }: PitchTrailProps) {
  if (points.length < 2) return null;

  // Build a polyline points string
  const pts = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <polyline
      points={pts}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeOpacity={0.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
