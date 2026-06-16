// src/components/Topps1963CardDemo.tsx
//
// Standalone 1963 Topps-style baseball card — CSS/inline-styles only.
// No external dependencies. Use placeholder images/text until integrated.
//
// ─── Start here when tuning the look ────────────────────────────────────────
const C = {
  // Palette
  stock: "#f0e4c8", // aged cream card stock
  border: "#161208", // near-black outer border + photo frame
  nameplateBg: "#3b6940", // vintage muted green
  namePrimary: "#f0ece0", // off-white name text
  nameSubtitle: "#d4a030", // faded yellow/gold team line
  insetBg: "#3d9ed4", // bright sky-blue circle
  insetRing: "#c8a020", // gold ring around inset circle
  positionText: "#d4a030", // position label ("CS", "OF", etc.)

  // Layout ratios (relative to cardWidth — change these to reshape sections)
  outerPad: 0.036, // cream border as fraction of card width
  photoRatio: 0.725, // photo height / inner height
  circleSize: 0.325, // inset circle diameter / card width
  circleEdgeGap: 0.048, // gap between circle right edge and inner right edge
};
// ─────────────────────────────────────────────────────────────────────────────

interface Topps1963CardDemoProps {
  cardWidth?: number;
  onClick?: () => void;
}

export function Topps1963CardDemo({ cardWidth = 280, onClick }: Topps1963CardDemoProps) {
  const W = cardWidth;
  const H = Math.round(W * 1.4); // 2.5 × 3.5 vintage card ratio

  const pad = Math.round(W * C.outerPad);
  const innerW = W - pad * 2;
  const innerH = H - pad * 2;
  const photoH = Math.round(innerH * C.photoRatio);
  const nameH = innerH - photoH;
  const borderPx = Math.max(2, Math.round(W * 0.009));

  // Circular inset: diameter, ring thickness, and absolute position.
  // Vertically centred on the photo/nameplate seam (half in each).
  const circleD = Math.round(W * C.circleSize);
  const circleR = circleD / 2;
  const ringPx = Math.max(2, Math.round(W * 0.014));
  const edgeGap = Math.round(W * C.circleEdgeGap);
  const circleLeft = W - pad - edgeGap - circleD;
  const circleTop = pad + photoH - circleR;

  // Nameplate text must not bleed under the circle.
  // Reserve (W − circleLeft) + a small breathing gap on the right.
  const nameplateRightPad = W - circleLeft + Math.round(W * 0.025);

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        width: W,
        height: H,
        background: C.stock,
        border: `${borderPx}px solid ${C.border}`,
        borderRadius: Math.round(W * 0.02),
        boxSizing: "border-box",
        overflow: "hidden",
        cursor: onClick ? "pointer" : undefined,
        boxShadow: [
          "0 6px 20px rgba(0,0,0,0.40)",
          "0 2px 5px rgba(0,0,0,0.22)",
          "inset 0 0 0 1px rgba(0,0,0,0.05)",
        ].join(", "),
        // Subtle overall age filter — desat + slight sepia, not too heavy
        filter: "sepia(0.12) saturate(0.86) brightness(0.96)",
        fontFamily: '"Arial Black", "Arial Bold", Impact, sans-serif',
        userSelect: "none",
      }}
    >
      {/* ── Main photo area ──────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: pad,
          left: pad,
          width: innerW,
          height: photoH,
          border: `${borderPx}px solid ${C.border}`,
          boxSizing: "border-box",
          overflow: "hidden",
          background:
            "linear-gradient(168deg, #647866 0%, #3e504a 50%, #252e28 100%)",
          // Inner shadow gives the impression of a printed photo
          boxShadow: "inset 0 0 24px rgba(0,0,0,0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/images/unsw-photo.jpg"
          alt="Jamie Wise"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
      </div>

      {/* ── Green nameplate ──────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: pad + photoH,
          left: pad,
          width: innerW,
          height: nameH,
          background: C.nameplateBg,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: Math.round(W * 0.045),
          paddingRight: nameplateRightPad,
          overflow: "hidden",
        }}
      >
        {/* First name — smaller weight */}
        <div
          style={{
            color: C.namePrimary,
            fontSize: Math.round(W * 0.05),
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
            marginTop: Math.round(W * 0.025),
          }}
        >
          University of
        </div>

        {/* Last name — large, dominant */}
        <div
          style={{
            color: C.namePrimary,
            fontSize: Math.round(W * 0.07),
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.01em",
            lineHeight: 1.5,
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
            marginTop: Math.round(W * 0.02),
          }}
        >
          New South Wales
        </div>

        {/* Team / subtitle */}
        <div
          style={{
            color: C.nameSubtitle,
            fontSize: Math.round(W * 0.047),
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            marginTop: Math.round(W * 0.013),
            textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            fontFamily: '"Arial", Helvetica, sans-serif',
            whiteSpace: "nowrap",
          }}
        >
          Sydney, Australia
        </div>

        {/* Position label — bottom-right corner of nameplate */}
        <div
          style={{
            position: "absolute",
            right: Math.round(W * 0.032),
            bottom: Math.round(nameH * 0.13),
            color: C.positionText,
            fontSize: Math.round(W * 0.048),
            fontWeight: 700,
            letterSpacing: "0.1em",
            textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            fontFamily: '"Arial", Helvetica, sans-serif',
          }}
        >
          W '25
        </div>
      </div>

      {/* ── Circular inset ───────────────────────────────────────────── */}
      {/* Half overlaps the photo, half overlaps the nameplate */}
      <div
        style={{
          position: "absolute",
          top: circleTop,
          left: circleLeft,
          width: circleD,
          height: circleD,
          borderRadius: "50%",
          background: C.insetBg,
          border: `${ringPx}px solid ${C.insetRing}`,
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.40), inset 0 0 8px rgba(0,0,0,0.15)",
        }}
      >
        <img
          src="/images/unsw-head.jpg"
          alt="Jamie Wise headshot"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 50%",
            transform: "scale(1.5)",
          }}
        />
      </div>

      {/* ── Aged vignette overlay ────────────────────────────────────── */}
      {/* Darkens corners to simulate worn card edges; increase opacity to age more */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 46%, transparent 48%, rgba(0,0,0,0.26) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Paper grain overlay ──────────────────────────────────────── */}
      {/* Very faint SVG-noise pattern simulating printed card stock */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">' +
              '<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="4" stitchTiles="stitch"/>' +
              '<feColorMatrix type="saturate" values="0"/></filter>' +
              '<rect width="100%" height="100%" filter="url(#g)" opacity="0.038"/></svg>',
          )}")`,
          backgroundSize: "180px 180px",
          pointerEvents: "none",
          mixBlendMode: "multiply",
          opacity: 0.7,
        }}
      />
    </div>
  );
}
