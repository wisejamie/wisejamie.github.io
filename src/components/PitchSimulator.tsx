import { useEffect, useRef, useState, useCallback } from 'react';
import type { PitchType } from '../data/pitches';
import type { ScreenPos } from '../lib/projection';
import { Baseball } from './Baseball';
import { PitchTrail } from './PitchTrail';

interface PitchSimulatorProps {
  path: ScreenPos[];
  pitch: PitchType;
  svgWidth: number;
  svgHeight: number;
  flightTimeMs: number;
  playbackSpeed: number; // 0.25 | 0.5 | 0.75 | 1 — scales animation duration only
  frozen: boolean;
  onArrive: () => void;
  onProgress: (progress: number) => void;
  refPath?: ScreenPos[]; // spinless reference for ghost trail
  hudHovered?: boolean;  // ghost trail only visible when HUD is hovered
}

export function PitchSimulator({
  path,
  pitch,
  svgWidth,
  svgHeight,
  flightTimeMs,
  playbackSpeed,
  frozen,
  onArrive,
  onProgress,
  refPath,
  hudHovered,
}: PitchSimulatorProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  // All mutable values accessed inside the RAF loop live in refs so the
  // tick function can have an empty dependency array (stable closure).
  const rafRef        = useRef<number | null>(null);
  const lastTimeRef   = useRef<number | null>(null);
  const frameRef      = useRef(0);        // float frame position for smooth pacing
  const arrivedRef    = useRef(false);
  const frozenRef        = useRef(frozen);
  const totalFRef        = useRef(path.length);
  const flightMsRef      = useRef(flightTimeMs);
  const playbackSpeedRef = useRef(playbackSpeed);
  const onArriveRef      = useRef(onArrive);
  const onProgressRef    = useRef(onProgress);

  // Keep refs in sync with latest props on every render
  frozenRef.current        = frozen;
  totalFRef.current        = path.length;
  flightMsRef.current      = flightTimeMs;
  playbackSpeedRef.current = playbackSpeed;
  onArriveRef.current      = onArrive;
  onProgressRef.current    = onProgress;

  // Stable tick — never recreated, reads everything via refs
  const tick = useCallback((now: number) => {
    if (frozenRef.current) return;

    if (lastTimeRef.current === null) lastTimeRef.current = now;
    const elapsed = now - lastTimeRef.current;
    lastTimeRef.current = now;

    const total = totalFRef.current;
    // Divide by playbackSpeed to stretch the animation duration.
    // Physics and flightTimeMs are unchanged — only visual pacing is affected.
    const duration = flightMsRef.current / playbackSpeedRef.current;

    frameRef.current = Math.min(
      frameRef.current + elapsed * (total - 1) / duration,
      total - 1,
    );

    const progress = frameRef.current / (total - 1);
    onProgressRef.current(progress);

    const idx = Math.floor(frameRef.current);
    setFrameIndex(idx);

    if (frameRef.current >= total - 1) {
      if (!arrivedRef.current) {
        arrivedRef.current = true;
        setTimeout(() => onArriveRef.current(), 0);
      }
      return; // stop scheduling new frames
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []); // stable — intentionally empty deps

  // Reset and restart whenever a new path arrives
  useEffect(() => {
    arrivedRef.current = false;
    frameRef.current = 0;
    setFrameIndex(0);
    lastTimeRef.current = null;

    if (path.length === 0) return;

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [path, tick]);

  if (path.length === 0) return null;

  const current = path[Math.min(frameIndex, path.length - 1)];
  const trailPoints = path.slice(0, frameIndex + 1);
  const spinProgress = frameIndex / Math.max(1, path.length - 1);

  // Ghost trail: slice refPath to match current animation progress
  const showGhost = hudHovered && refPath && refPath.length >= 2;
  const ghostPoints = showGhost
    ? (frozen ? refPath! : refPath!.slice(0, frameIndex + 1))
    : [];

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      {showGhost && ghostPoints.length >= 2 && (
        <polyline
          points={ghostPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="rgba(190,205,215,0.22)"
          strokeWidth={1}
          strokeDasharray="4 5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <PitchTrail points={trailPoints} color={pitch.colorLabel} />
      <Baseball
        cx={current.x}
        cy={current.y}
        r={current.radius}
        spin={spinProgress * 3}
      />
    </svg>
  );
}
