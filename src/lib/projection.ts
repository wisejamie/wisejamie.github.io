import type { Vec3 } from './physics';

// ---------------------------------------------------------------------------
// Camera model — fixed catcher/broadcast angle looking toward the mound.
//
// Physical setup (feet):
//   Home plate:    (0, 0, 0)
//   Pitching rubber: (0, 60.5, ~1)
//   Ball release:  (~-2, ~55, ~5.9)
//   Camera:        (CAM_X, CAM_Y, CAM_Z)
//
// CAM_Y is placed in FRONT of the plate (negative y) so that every ball
// position at y ≥ 0 has depth dy = y − CAM_Y > 0. This prevents any
// projection singularity as the ball crosses y = 0.
//
// Pinhole projection:
//   dy       = pos.y − CAM_Y        (always > 0)
//   screenX  = vanishX + f * (pos.x − CAM_X) / dy
//   screenY  = vanishY − f * (pos.z − CAM_Z) / dy
//   radius   = BALL_RADIUS_FT * f / dy
//
// Focal length f scales with svgHeight so the strike zone occupies a
// consistent fraction of the screen across resolutions.
// ---------------------------------------------------------------------------

// Camera position (feet)
const CAM_X = 0;
const CAM_Y = -2.0; // 2 ft in front of plate — denominator always positive
const CAM_Z = 2.5;  // crouching catcher eye height; puts zone midpoint at vanish

// f = svgHeight * FOCAL_FRAC. At 1080p: f ≈ 378 px.
// Result: zone occupies ~35% of screen height, grows/shrinks proportionally.
// Increase this value to make the zone feel closer/larger.
const FOCAL_FRAC = 0.35;

const BALL_RADIUS_FT = 0.121;

// Vanishing point as fraction of SVG dimensions.
// x=0.5 → centered; y=0.38 → slightly above midscreen (mound appears elevated).
const VANISH_X_FRAC = 0.5;
const VANISH_Y_FRAC = 0.38;

export interface ScreenPos {
  x: number;
  y: number;
  radius: number;
  depth: number; // dy value — useful for opacity/ordering
}

export function project(pos: Vec3, svgWidth: number, svgHeight: number): ScreenPos {
  const f = svgHeight * FOCAL_FRAC;
  const vanishX = svgWidth * VANISH_X_FRAC;
  const vanishY = svgHeight * VANISH_Y_FRAC;
  const dy = pos.y - CAM_Y; // > 0 for all y ≥ 0

  return {
    x: vanishX + f * (pos.x - CAM_X) / dy,
    y: vanishY - f * (pos.z - CAM_Z) / dy,
    radius: Math.max(1.5, Math.min(30, (BALL_RADIUS_FT * f) / dy)),
    depth: dy,
  };
}

// Inverse of project() at the plate plane (y=0).
// Given a screen click (screenX, screenY), returns the physical plate
// coordinate (x in feet, z in feet). y is implicitly 0.
export function unproject(
  screenX: number,
  screenY: number,
  svgWidth: number,
  svgHeight: number,
): { x: number; z: number } {
  const f = svgHeight * FOCAL_FRAC;
  const vanishX = svgWidth * VANISH_X_FRAC;
  const vanishY = svgHeight * VANISH_Y_FRAC;
  const dy = 0 - CAM_Y; // depth at plate = 2 ft

  return {
    x: ((screenX - vanishX) * dy) / f,
    z: CAM_Z - ((screenY - vanishY) * dy) / f,
  };
}

// ---------------------------------------------------------------------------
// Strike zone geometry
//
// MLB zone: 17 in wide (home plate width), 1.5–3.5 ft height, centered x=0.
// ---------------------------------------------------------------------------
export const ZONE_HALF_WIDTH_FT = 17 / 24; // 8.5 in each side
export const ZONE_BOTTOM_FT = 1.5;
export const ZONE_TOP_FT = 3.5;

// Clamping bounds for user-selected targets: 1 ft beyond zone edges
export const TARGET_CLAMP = {
  xMin: -ZONE_HALF_WIDTH_FT - 1.0,
  xMax:  ZONE_HALF_WIDTH_FT + 1.0,
  zMin: ZONE_BOTTOM_FT - 0.5,
  zMax: ZONE_TOP_FT + 0.5,
};

export interface ZoneScreenRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function projectStrikeZone(svgWidth: number, svgHeight: number): ZoneScreenRect {
  const tl = project({ x: -ZONE_HALF_WIDTH_FT, y: 0, z: ZONE_TOP_FT },    svgWidth, svgHeight);
  const tr = project({ x:  ZONE_HALF_WIDTH_FT, y: 0, z: ZONE_TOP_FT },    svgWidth, svgHeight);
  const bl = project({ x: -ZONE_HALF_WIDTH_FT, y: 0, z: ZONE_BOTTOM_FT }, svgWidth, svgHeight);
  const br = project({ x:  ZONE_HALF_WIDTH_FT, y: 0, z: ZONE_BOTTOM_FT }, svgWidth, svgHeight);

  return {
    left:   Math.min(tl.x, bl.x),
    right:  Math.max(tr.x, br.x),
    top:    Math.min(tl.y, tr.y),
    bottom: Math.max(bl.y, br.y),
  };
}
