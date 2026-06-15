import type { PitchType } from '../data/pitches';
import { TARGET_CLAMP } from './projection';

// ---------------------------------------------------------------------------
// Per-throw pitch variation.
//
// Base pitch data in pitches.ts is never mutated. Each call to
// createPitchAttempt returns a fresh copy with realistic per-throw noise.
//
// What drives what:
//   velocityMph, spinRpm, spinAxisDeg, release  → actual physics path
//   movement.horizontalInches / verticalInches  → HUD display ONLY
//     (the physics sim reads spinRpm/spinAxisDeg, not movement values)
//
// Both the HUD values and the physical path vary each throw, but they are
// not precisely coupled. The HUD values are estimated display numbers;
// the path is what the Magnus model actually computes.
//
// intendedTarget — what the pitcher aimed at (shown in the reticle)
// actualTarget   — intended ± command variation (passed to simulatePitch)
// ---------------------------------------------------------------------------

export interface PitchAttempt {
  pitch: PitchType;
  intendedTarget: { x: number; z: number };
  actualTarget: { x: number; z: number };
}

// Uniform random in [-range, +range]
function rand(range: number): number {
  return (Math.random() * 2 - 1) * range;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// Add noise to a movement value while preserving its sign.
// The noise range is capped at 60% of abs(value) so the break direction
// can never flip even for small base values.
function varyMovement(value: number, range: number): number {
  if (value === 0) return rand(range * 0.5);
  const safeRange = Math.min(range, Math.abs(value) * 0.6);
  return value + rand(safeRange);
}

export function createPitchAttempt(
  base: PitchType,
  selectedTarget: { x: number; z: number } | null,
): PitchAttempt {
  // Fastball family (4-seam, sinker, cutter) has tighter mechanical variance.
  const isFastball = base.velocityMph >= 88;

  // ── Velocity ──────────────────────────────────────────────────────────────
  // Fastballs: arm speed repeats tightly → ±1.5 mph
  // Breaking/off-speed: grip pressure and pronation vary → ±2.5 mph
  const velocityMph = base.velocityMph + rand(isFastball ? 1.5 : 2.5);

  // ── Spin ──────────────────────────────────────────────────────────────────
  // ±4% for fastballs, ±7% for breaking balls.
  // Kept as a float internally; round only for HUD display (toLocaleString).
  const spinRpm = Math.round(base.spinRpm * (1 + rand(isFastball ? 0.04 : 0.07)));

  // ── Spin axis ─────────────────────────────────────────────────────────────
  // Grip variation changes the tilt of the Magnus force vector.
  // This directly affects the actual flight path (more than spinRpm alone).
  const spinAxisDeg = base.spinAxisDeg + rand(isFastball ? 5 : 9);

  // ── Release point ─────────────────────────────────────────────────────────
  const release = {
    x: base.release.x + rand(0.05),
    y: base.release.y + rand(0.03),
    z: base.release.z + rand(0.04),
  };

  // ── Movement display (HUD only) ───────────────────────────────────────────
  // Two sources of variation intentionally combined:
  //   1. Spin-ratio scale: magnitude scales with RPM deviation (~±4–7%)
  //   2. Independent noise: adds visible inch-level variation per throw
  //
  // Do NOT call Math.round here — keep decimals so the HUD (which already
  // uses .toFixed(1)) can show values like "-14.3 in" instead of "-14.0 in".
  //
  // varyMovement() caps noise at 60% of the base value to prevent sign flips.
  const spinRatio = spinRpm / base.spinRpm;
  const breakRange = isFastball ? 1.5 : 3.0; // inches of independent variation
  const movement = {
    horizontalInches: varyMovement(base.movement.horizontalInches * spinRatio, breakRange),
    verticalInches:   varyMovement(base.movement.verticalInches   * spinRatio, breakRange),
  };

  const pitch: PitchType = {
    ...base,
    velocityMph,
    spinRpm,
    spinAxisDeg,
    release,
    movement,
  };

  // ── Intended target ───────────────────────────────────────────────────────
  // User-selected → use it directly.
  // No selection → randomize near each pitch's natural location so
  // pitch identity (high FF, low CB, arm-side CH, etc.) is preserved.
  const intendedTarget = selectedTarget
    ? { ...selectedTarget }
    : {
        x: clamp(base.target.x + rand(0.5),  TARGET_CLAMP.xMin, TARGET_CLAMP.xMax),
        z: clamp(base.target.z + rand(0.35), TARGET_CLAMP.zMin, TARGET_CLAMP.zMax),
      };

  // ── Command variation (tightened) ─────────────────────────────────────────
  // Pitcher misses the intended spot by a small amount — visually subtle.
  // Fastballs: ~±0.7 in;  breaking balls: ~±1.1 in.
  const cmdSpread = isFastball ? 0.06 : 0.09;
  const actualTarget = {
    x: clamp(intendedTarget.x + rand(cmdSpread), TARGET_CLAMP.xMin, TARGET_CLAMP.xMax),
    z: clamp(intendedTarget.z + rand(cmdSpread), TARGET_CLAMP.zMin, TARGET_CLAMP.zMax),
  };

  return { pitch, intendedTarget, actualTarget };
}
