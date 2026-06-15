import { project } from "../lib/projection";

interface PlateSceneProps {
  svgWidth: number;
  svgHeight: number;
}

// ---------------------------------------------------------------------------
// Near-plane clip (Sutherland-Hodgman, single y half-plane).
// Camera is at physics y = −2 ft; clip at −1.98 to stay just in front of
// the dy→0 singularity. Vertices behind the near plane are replaced with
// the edge-intersection point at y = nearY.
// ---------------------------------------------------------------------------
const NEAR_Y = -1.98;

function nearClipY(
  pts: { x: number; y: number }[],
  nearY: number,
): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const aIn = a.y >= nearY;
    const bIn = b.y >= nearY;
    if (aIn) out.push(a);
    if (aIn !== bIn) {
      const t = (nearY - a.y) / (b.y - a.y);
      out.push({ x: a.x + t * (b.x - a.x), y: nearY });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// PlateScene — static environment rendered behind the ball and zone.
//
// Physics coordinate system (shared with physics.ts / projection.ts):
//   x  = catcher's right  (positive = first-base side)
//   y  = toward pitcher   (plate front edge = 0; values behind plate < 0)
//   z  = up
//   Camera at y = −2 ft; objects at y ≥ 0 are always in front of camera.
//
// Home plate geometry (MLB regulation):
//   17" front edge, 8.5" straight sides, 12" angled edges.
//   Apex (rear tip) = (0, APEX_Y, 0).  From there two 12" angled edges run
//   along the 45° foul-line directions normalize(±1,+1) to the side corners,
//   then 8.5" straight sides rise to the 17" front edge at y = 0.
//   The foul lines are collinear with those angled edges, meeting at the apex.
// ---------------------------------------------------------------------------

export function PlateScene({ svgWidth, svgHeight }: PlateSceneProps) {
  const p = (x: number, y: number, z: number) =>
    project({ x, y, z }, svgWidth, svgHeight);

  // ── Plate constants ──────────────────────────────────────────────────────
  const IN = 1 / 12;
  const HW = 8.5 * IN; // half of 17" front edge = 8.5 in
  const ANGLED = 12 * IN; // angled edge length = 12 in = 1 ft
  const SIDE_C = ANGLED / Math.SQRT2; // x/y component of side corners from apex
  const APEX_Y = -(SIDE_C + HW); // apex y in physics coords ≈ −1.415 ft

  // ── Home plate vertices (physics coords) ─────────────────────────────────
  // Order per spec: apex → first-base side corner → front-right →
  //                 front-left → third-base side corner
  const pApex = p(0, APEX_Y, 0); // rear tip (catcher-facing)
  const pFSide = p(SIDE_C, -HW, 0); // first-base angled-edge endpoint
  const pFR = p(HW, 0, 0); // front-right corner (pitcher-facing)
  const pFL = p(-HW, 0, 0); // front-left corner
  const pTSide = p(-SIDE_C, -HW, 0); // third-base angled-edge endpoint

  const platePoints = [pApex, pFSide, pFR, pFL, pTSide]
    .map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`)
    .join(" ");

  // Midpoint of front edge — used for screen-space scuff marks
  const pmx = (pFL.x + pFR.x) / 2;
  const pmy = pFL.y;

  // ── Batter's boxes ────────────────────────────────────────────────────────
  // 4 ft wide × 6 ft long. Center = 8.5 in from apex toward pitcher.
  // Inner edge 6" from nearest plate side.
  // Back half extends behind camera → clipped to NEAR_Y via nearClipY().
  const plateMidY = APEX_Y + HW; // ≈ −SIDE_C ≈ −0.707 ft in physics
  const yMinBox = plateMidY - 3.5; // ≈ −3.707 ft (behind camera)
  const yMaxBox = plateMidY + 2.3; // ≈ +2.293 ft (toward pitcher)
  const BI = HW + 0.5; // inner edge x: 8.5" + 6" = 1.208 ft
  const BO = BI + 4; // outer edge x: 5.208 ft

  const toPoints = (verts: { x: number; y: number }[]) =>
    verts
      .map((v) => p(v.x, v.y, 0))
      .map((s) => `${s.x.toFixed(1)},${s.y.toFixed(1)}`)
      .join(" ");

  const leftBox = toPoints(
    nearClipY(
      [
        { x: -BI, y: yMaxBox },
        { x: -BO, y: yMaxBox },
        { x: -BO, y: yMinBox },
        { x: -BI, y: yMinBox },
      ],
      NEAR_Y,
    ),
  );
  const rightBox = toPoints(
    nearClipY(
      [
        { x: BI, y: yMaxBox },
        { x: BO, y: yMaxBox },
        { x: BO, y: yMinBox },
        { x: BI, y: yMinBox },
      ],
      NEAR_Y,
    ),
  );

  // ── Foul lines ────────────────────────────────────────────────────────────
  // Collinear with the 12" angled plate edges; meet at apex at 90° in world space.
  // Visible chalk begins at the side corners (ends of the angled edges).
  // Extend 100 ft toward first base (+x,+y)/√2 and third base (−x,+y)/√2.
  const foulDist = 100;
  const foulREnd = p(foulDist, APEX_Y + foulDist / Math.SQRT2, 0);
  const foulLEnd = p(-foulDist, APEX_Y + foulDist / Math.SQRT2, 0);

  // ── Mound markers ─────────────────────────────────────────────────────────
  const rubber = p(0, 60.5, 1.0);
  const release = p(-2.1, 55.0, 5.9);

  const cx = svgWidth / 2;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    >
      <defs>
        {/* Warm clay/dirt radial gradient */}
        <radialGradient id="ps-dirt" cx="50%" cy="100%" r="65%">
          <stop offset="0%" stopColor="#7a4e2c" stopOpacity="0.52" />
          <stop offset="45%" stopColor="#5a3618" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#2a1608" stopOpacity="0" />
        </radialGradient>

        {/* Foul-line chalk gradients — bright at side corners, fade to distance */}
        <linearGradient
          id="ps-fr"
          gradientUnits="userSpaceOnUse"
          x1={pFSide.x}
          y1={pFSide.y}
          x2={foulREnd.x}
          y2={foulREnd.y}
        >
          <stop offset="0%" stopColor="#d8cead" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#d8cead" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="ps-fl"
          gradientUnits="userSpaceOnUse"
          x1={pTSide.x}
          y1={pTSide.y}
          x2={foulLEnd.x}
          y2={foulLEnd.y}
        >
          <stop offset="0%" stopColor="#d8cead" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#d8cead" stopOpacity="0" />
        </linearGradient>

        {/* Viewport clip */}
        <clipPath id="ps-vp">
          <rect x={0} y={0} width={svgWidth} height={svgHeight} />
        </clipPath>
      </defs>

      {/* ── Dirt cutout ──────────────────────────────────────────────────── */}
      <ellipse
        cx={cx}
        cy={svgHeight}
        rx={svgWidth * 0.44}
        ry={svgHeight * 0.6}
        fill="url(#ps-dirt)"
      />

      {/* ── Foul lines ───────────────────────────────────────────────────── */}
      <line
        x1={pFSide.x}
        y1={pFSide.y}
        x2={foulREnd.x}
        y2={foulREnd.y}
        stroke="url(#ps-fr)"
        strokeWidth={1.5}
        clipPath="url(#ps-vp)"
      />
      <line
        x1={pTSide.x}
        y1={pTSide.y}
        x2={foulLEnd.x}
        y2={foulLEnd.y}
        stroke="url(#ps-fl)"
        strokeWidth={1.5}
        clipPath="url(#ps-vp)"
      />

      {/* ── Batter's boxes ───────────────────────────────────────────────── */}
      {leftBox && (
        <polygon
          points={leftBox}
          fill="none"
          stroke="rgba(210,200,170,0.16)"
          strokeWidth={1}
          clipPath="url(#ps-vp)"
        />
      )}
      {rightBox && (
        <polygon
          points={rightBox}
          fill="none"
          stroke="rgba(210,200,170,0.16)"
          strokeWidth={1}
          clipPath="url(#ps-vp)"
        />
      )}

      {/* ── Home plate ───────────────────────────────────────────────────── */}
      {/* Drop shadow */}
      <polygon
        points={platePoints}
        fill="rgba(0,0,0,0.38)"
        transform="translate(4,7)"
        clipPath="url(#ps-vp)"
      />
      {/* Plate surface */}
      <polygon
        points={platePoints}
        fill="#eee8d8"
        fillOpacity={0.93}
        stroke="#bab09a"
        strokeWidth={0.8}
        clipPath="url(#ps-vp)"
      />
      {/* Chalk bevel on front edge */}
      <line
        x1={pFL.x}
        y1={pFL.y}
        x2={pFR.x}
        y2={pFR.y}
        stroke="#ffffff"
        strokeOpacity={0.55}
        strokeWidth={1.5}
      />
      {/* Dirt scuff marks — screen-space offsets from front-edge midpoint */}
      <ellipse
        cx={pmx - 20}
        cy={pmy + 14}
        rx={11}
        ry={3.5}
        fill="rgba(85,55,30,0.30)"
        transform={`rotate(-18,${pmx - 20},${pmy + 14})`}
        clipPath="url(#ps-vp)"
      />
      <ellipse
        cx={pmx + 24}
        cy={pmy + 9}
        rx={8}
        ry={2.5}
        fill="rgba(85,55,30,0.22)"
        transform={`rotate(10,${pmx + 24},${pmy + 9})`}
        clipPath="url(#ps-vp)"
      />
      <ellipse
        cx={pmx + 4}
        cy={pmy + 22}
        rx={5}
        ry={2}
        fill="rgba(85,55,30,0.18)"
        clipPath="url(#ps-vp)"
      />

      {/* ── Pitching rubber ──────────────────────────────────────────────── */}
      <rect
        x={rubber.x - 5.5}
        y={rubber.y - 1.5}
        width={11}
        height={3}
        fill="rgba(240,235,220,0.35)"
        rx={1}
      />

      {/* ── RHP release point glow ───────────────────────────────────────── */}
      <circle
        cx={release.x}
        cy={release.y}
        r={5}
        fill="rgba(245,166,35,0.10)"
        stroke="rgba(245,166,35,0.40)"
        strokeWidth={1}
      />
      <text
        x={release.x + 9}
        y={release.y + 4}
        fontSize={8}
        fill="rgba(245,166,35,0.50)"
        fontFamily="ui-monospace, Consolas, monospace"
        letterSpacing="0.05em"
      >
        RHP
      </text>
    </svg>
  );
}
