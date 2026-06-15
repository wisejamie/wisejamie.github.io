import type { PitchType } from '../data/pitches';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SimFrame {
  pos: Vec3;
  t: number; // seconds since release
}

export interface SimResult {
  frames: SimFrame[];
  flightTimeMs: number; // total flight duration in milliseconds
}

// ---------------------------------------------------------------------------
// Physical constants
// ---------------------------------------------------------------------------
const GRAVITY = -32.174; // ft/s²
const AIR_DENSITY = 0.0023769; // slug/ft³ at sea level
const BALL_MASS_SLUGS = 0.3203 / 32.174;
const BALL_RADIUS_FT = 0.121;
const BALL_AREA = Math.PI * BALL_RADIUS_FT ** 2;
const CD = 0.37; // drag coefficient

// Magnus scaling constant. Tuned so a 94-mph / 2350-rpm four-seamer
// produces ~12–14 inches of induced vertical break over a 55-ft flight.
// Adjust this value to make movement more or less dramatic globally.
const MAGNUS_K = 0.000430; // ft/s² / (rad/s · ft/s)

// ---------------------------------------------------------------------------
// Force helpers
// ---------------------------------------------------------------------------

function mphToFtPerS(mph: number): number {
  return (mph * 5280) / 3600;
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// Drag deceleration opposite to velocity direction.
function dragAccel(vel: Vec3, speed: number): Vec3 {
  const k = (0.5 * AIR_DENSITY * CD * BALL_AREA) / BALL_MASS_SLUGS;
  return {
    x: -k * speed * vel.x,
    y: -k * speed * vel.y,
    z: -k * speed * vel.z,
  };
}

// Simplified Magnus acceleration.
//
// The full cross-product form (ω × v) requires knowing the exact 3-D spin
// axis orientation, which is tricky to get right when defining pitches by
// hand and easy to get wrong by a sign or 90° error. Instead we use a
// direct force-direction model:
//
//   spinAxisDeg = direction of the net Magnus force in the XZ plane
//     0°   → +z (rise)       90°  → +x (glove-side for RHP)
//     180° → -z (drop)       270° → -x (arm-side for RHP)
//
// Magnitude: MAGNUS_K × ω(rad/s) × v(ft/s). This is proportional to the
// true Magnus force (ρ·C_L·A·r·ω·v / m) with a single tuning constant.
function magnusAccel(spinRpm: number, spinAxisDeg: number, speed: number): Vec3 {
  const omega = (spinRpm * 2 * Math.PI) / 60; // rad/s
  const mag = MAGNUS_K * omega * speed;
  const axisRad = degToRad(spinAxisDeg);
  return {
    x: mag * Math.sin(axisRad),
    y: 0,
    z: mag * Math.cos(axisRad),
  };
}

// ---------------------------------------------------------------------------
// Core simulation
// ---------------------------------------------------------------------------

// Run a single Euler integration pass, aiming the initial velocity toward
// `aimTarget` (a physical plate coordinate, y=0). Returns SimFrame[].
function runSim(
  pitch: PitchType,
  aimTarget: { x: number; z: number },
  dt: number,
): SimFrame[] {
  const speed0 = mphToFtPerS(pitch.velocityMph);

  let pos: Vec3 = { ...pitch.release };

  // Direction from release to aim point
  const dX = aimTarget.x - pitch.release.x;
  const dY = -pitch.release.y; // y goes from release.y → 0
  const dZ = aimTarget.z - pitch.release.z;
  const dist = Math.sqrt(dX * dX + dY * dY + dZ * dZ);

  let vel: Vec3 = {
    x: (speed0 * dX) / dist,
    y: (speed0 * dY) / dist,
    z: (speed0 * dZ) / dist,
  };

  const frames: SimFrame[] = [];
  let t = 0;
  const MAX_T = 2.0; // safety cap

  while (pos.y > 0 && t < MAX_T) {
    frames.push({ pos: { ...pos }, t });

    const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2);
    const drag = dragAccel(vel, speed);
    const magnus = magnusAccel(pitch.spinRpm, pitch.spinAxisDeg, speed);

    vel = {
      x: vel.x + (drag.x + magnus.x) * dt,
      y: vel.y + (drag.y + magnus.y) * dt,
      z: vel.z + (drag.z + magnus.z + GRAVITY) * dt,
    };
    pos = {
      x: pos.x + vel.x * dt,
      y: pos.y + vel.y * dt,
      z: pos.z + vel.z * dt,
    };
    t += dt;
  }

  // Final frame at or just past y=0 (the plate crossing)
  frames.push({ pos: { ...pos }, t });

  return frames;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

// Simulate a pitch, correcting the initial aim to compensate for Magnus and
// drag so the ball actually arrives near `target`. Uses iterative refinement:
// each pass measures the arrival error and adjusts the aim vector accordingly.
// Typically converges in 2–3 iterations to within 0.5 inch of the target.
export function simulatePitch(
  pitch: PitchType,
  target: { x: number; z: number } = pitch.target,
  dt = 0.001,
): SimResult {
  let aim = { x: target.x, z: target.z };
  let frames: SimFrame[] = [];

  for (let iter = 0; iter < 4; iter++) {
    frames = runSim(pitch, aim, dt);
    const arrival = frames[frames.length - 1].pos;
    const errX = arrival.x - target.x;
    const errZ = arrival.z - target.z;
    if (Math.abs(errX) < 0.01 && Math.abs(errZ) < 0.01) break;
    // Shift the aim point by the error to compensate
    aim = { x: aim.x - errX, z: aim.z - errZ };
  }

  const flightTimeMs = frames[frames.length - 1].t * 1000;
  return { frames, flightTimeMs };
}

// Downsample a frame array to at most `maxFrames` evenly-spaced entries,
// always preserving the first and last frame.
export function downsample(frames: SimFrame[], maxFrames: number): SimFrame[] {
  if (frames.length <= maxFrames) return frames;
  const result: SimFrame[] = [];
  const step = (frames.length - 1) / (maxFrames - 1);
  for (let i = 0; i < maxFrames; i++) {
    result.push(frames[Math.round(i * step)]);
  }
  return result;
}
