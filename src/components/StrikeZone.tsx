import type { ZoneScreenRect } from '../lib/projection';

interface StrikeZoneProps {
  rect: ZoneScreenRect;
  frozen: boolean;
}

export function StrikeZone({ rect, frozen }: StrikeZoneProps) {
  const { left, right, top, bottom } = rect;
  const w = right - left;
  const h = bottom - top;

  return (
    <rect
      x={left}
      y={top}
      width={w}
      height={h}
      fill="none"
      stroke={frozen ? '#f5a623' : '#ffffff'}
      strokeWidth={frozen ? 2.5 : 1.5}
      strokeOpacity={frozen ? 1 : 0.4}
      rx={2}
    />
  );
}
