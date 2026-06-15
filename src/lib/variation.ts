import type { PitchType } from '../data/pitches';
import { TARGET_CLAMP } from './projection';

// ---------------------------------------------------------------------------
// Per-throw pitch variation with handedness support.
//
// Base pitch data in pitches.ts is written for RHP.
// LHP is derived at runtime by mirroring x-side values; base data is never
// mutated.
//
// What drives what:
//   velocityMph, spinRpm, spinAxisDeg, release  → actual physics path
//   movement.horizontalInches / verticalInches  → authored fallback/scouting values
//     (live throws measure movement from the simulated physics path)
//
// intendedTarget — what the pitcher aimed at (shown in the reticle)
// actualTarget   — intended ± command variation (passed to simulatePitch)
// ---------------------------------------------------------------------------

export type Handedness = 'RHP' | 'LHP';

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
// Range is capped at 60% of abs(value) so break direction never flips.
function varyMovement(value: number, range: number): number {
  if (value === 0) return rand(range * 0.5);
  const safeRange = Math.min(range, Math.abs(value) * 0.6);
  return value + rand(safeRange);
}

// ---------------------------------------------------------------------------
// Mirror a base RHP pitch for a left-handed pitcher.
//
// Values that flip (x-axis / horizontal):
//   release.x          → negated (LHP arm side = catcher's right = +x)
//   target.x           → negated (default/random aim point mirrors)
//   movement.horizontalInches → negated (glove-side / arm-side flip)
//   spinAxisDeg        → (360 - deg) % 360
//
//     spinAxisDeg controls the Magnus force direction in the XZ plane:
//       x-component = sin(axis),  z-component = cos(axis)
//     Mirroring the horizontal force requires: sin(new) = -sin(old), cos unchanged.
//     The unique solution mod 360 is: newAxis = (360 - oldAxis) % 360.
//     Example: RHP changeup 270° (arm-side −x) → LHP 90° (arm-side +x) ✓
//              RHP slider  115° (glove-side +x) → LHP 245° (glove-side −x) ✓
//
// Values that stay the same (vertical / speed):
//   velocityMph, spinRpm, release.y, release.z, movement.verticalInches
// ---------------------------------------------------------------------------
export function mirrorPitchForHandedness(base: PitchType, handedness: Handedness): PitchType {
  if (handedness === 'RHP') return base;
  return {
    ...base,
    release: { ...base.release, x: -base.release.x },
    target: { ...base.target, x: -base.target.x },
    spinAxisDeg: (360 - base.spinAxisDeg) % 360,
    movement: {
      ...base.movement,
      horizontalInches: -base.movement.horizontalInches,
    },
  };
}

export function createPitchAttempt(
  base: PitchType,
  selectedTarget: { x: number; z: number } | null,
  handedness: Handedness = 'RHP',
): PitchAttempt {
  // Mirror the base pitch for handedness first. All subsequent variation runs
  // on the mirrored values so the physics and display stay consistent.
  // selectedTarget is an absolute plate coordinate — intentionally NOT mirrored.
  const mb = mirrorPitchForHandedness(base, handedness);

  const isFastball = mb.velocityMph >= 88;

  // ── Velocity ──────────────────────────────────────────────────────────────
  const velocityMph = mb.velocityMph + rand(isFastball ? 1.5 : 2.5);

  // ── Spin ──────────────────────────────────────────────────────────────────
  const spinRpm = Math.round(mb.spinRpm * (1 + rand(isFastball ? 0.04 : 0.07)));

  // ── Spin axis ─────────────────────────────────────────────────────────────
  // Variation is applied after mirroring, so the noise is symmetric around
  // the already-correct LHP/RHP axis.
  const spinAxisDeg = mb.spinAxisDeg + rand(isFastball ? 5 : 9);

  // ── Release point ─────────────────────────────────────────────────────────
  const release = {
    x: mb.release.x + rand(0.05),
    y: mb.release.y + rand(0.03),
    z: mb.release.z + rand(0.04),
  };

  // ── Authored movement fallback ────────────────────────────────────────────
  // mb.movement.horizontalInches is already sign-flipped for LHP.
  // varyMovement() adds independent inch-level noise without flipping sign.
  const spinRatio = spinRpm / mb.spinRpm;
  const breakRange = isFastball ? 1.5 : 3.0;
  const movement = {
    horizontalInches: varyMovement(mb.movement.horizontalInches * spinRatio, breakRange),
    verticalInches:   varyMovement(mb.movement.verticalInches   * spinRatio, breakRange),
  };

  const pitch: PitchType = {
    ...mb,
    velocityMph,
    spinRpm,
    spinAxisDeg,
    release,
    movement,
  };

  // ── Intended target ───────────────────────────────────────────────────────
  // User-selected → keep as-is (absolute plate coord, never mirrored).
  // No selection → randomize near the mirrored default location.
  const intendedTarget = selectedTarget
    ? { ...selectedTarget }
    : {
        x: clamp(mb.target.x + rand(0.5),  TARGET_CLAMP.xMin, TARGET_CLAMP.xMax),
        z: clamp(mb.target.z + rand(0.35), TARGET_CLAMP.zMin, TARGET_CLAMP.zMax),
      };

  // ── Command variation (tightened) ─────────────────────────────────────────
  const cmdSpread = isFastball ? 0.06 : 0.09;
  const actualTarget = {
    x: clamp(intendedTarget.x + rand(cmdSpread), TARGET_CLAMP.xMin, TARGET_CLAMP.xMax),
    z: clamp(intendedTarget.z + rand(cmdSpread), TARGET_CLAMP.zMin, TARGET_CLAMP.zMax),
  };

  return { pitch, intendedTarget, actualTarget };
}
