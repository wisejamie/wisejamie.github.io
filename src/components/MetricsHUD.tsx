import type { PitchType } from '../data/pitches';
import type { SectionMeta } from '../data/sections';

interface MetricsHUDProps {
  pitch: PitchType;
  section: SectionMeta;
  progress: number; // 0–1, how far through the flight
  frozen: boolean;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function MetricsHUD({ pitch, section, progress, frozen }: MetricsHUDProps) {
  // Speed bleeds down slightly as the ball travels (energy loss to drag)
  const displaySpeed = lerp(pitch.velocityMph, pitch.velocityMph * 0.94, progress);
  // Spin is displayed as constant (we don't model spin decay for Phase 1)
  const displaySpin = pitch.spinRpm;
  // Break values animate from 0 to full as the ball travels
  const hBreak = lerp(0, pitch.movement.horizontalInches, progress);
  const vBreak = lerp(0, pitch.movement.verticalInches, progress);

  const rows: [string, string][] = [
    ['PITCH',   pitch.name],
    ['SECTION', section.label],
    ['SPEED',   `${displaySpeed.toFixed(0)} mph`],
    ['SPIN',    `${displaySpin.toLocaleString()} rpm`],
    ['H-BREAK', `${hBreak >= 0 ? '+' : ''}${hBreak.toFixed(1)} in`],
    ['V-BREAK', `${vBreak >= 0 ? '+' : ''}${vBreak.toFixed(1)} in`],
  ];

  if (frozen) {
    rows.push(['STATUS', 'SECTION UNLOCKED']);
  }

  return (
    <div style={{
      position: 'absolute',
      top: 16,
      right: 16,
      fontFamily: 'monospace',
      fontSize: 12,
      color: '#e0ddd5',
      background: 'rgba(0,0,0,0.55)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 4,
      padding: '10px 14px',
      minWidth: 170,
      lineHeight: 1.9,
    }}>
      {rows.map(([label, value]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ color: '#888', letterSpacing: '0.05em' }}>{label}</span>
          <span style={{ color: label === 'STATUS' ? '#f5a623' : '#e0ddd5', textAlign: 'right' }}>{value}</span>
        </div>
      ))}
    </div>
  );
}
