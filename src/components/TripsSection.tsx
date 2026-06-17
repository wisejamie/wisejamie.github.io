import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TRIPS } from "../data/portfolio";
import type { TripEntry } from "../data/portfolio";

// Photo placeholder gradient palettes — keyed by trip id, visual-only
const PALETTES: Record<string, [string, string][]> = {
  australia:  [["#0e2a4a","#1a5a8a"],["#0a2a18","#147a40"],["#2a1a08","#7a4a10"]],
  newzealand: [["#0a1a3a","#1a3a6a"],["#081c10","#10402a"],["#1a1a2a","#3a3a5a"]],
  seasia:     [["#3a1008","#8a3010"],["#0a2008","#1a5010"],["#1a080a","#5a1820"]],
  banff:      [["#081018","#103050"],["#081408","#0a3018"],["#181808","#3a3810"]],
  montreal:   [["#18081a","#3a1848"],["#080a18","#101838"],["#180808","#401010"]],
  california: [["#2a1008","#7a3008"],["#0a1808","#1a4010"],["#181008","#404010"]],
};

// ── Simplified continent SVG paths (1000×500 Plate Carrée) ───────────────────
const CONTINENT_PATHS: string[] = [
  "M 283,38 L 320,32 L 350,50 L 352,84 L 320,102 L 285,92 L 270,65 Z",
  "M 92,72 L 165,60 L 210,64 L 255,70 L 302,92 L 356,112 L 312,132 L 296,155 L 278,178 L 250,192 L 218,200 L 192,196 L 166,178 L 148,148 L 138,110 L 105,90 Z",
  "M 218,200 L 252,192 L 270,210 L 260,232 L 242,240 L 222,228 Z",
  "M 240,240 L 298,220 L 348,228 L 382,252 L 398,285 L 390,332 L 368,376 L 338,404 L 305,408 L 275,390 L 250,358 L 240,318 L 234,278 Z",
  "M 468,100 L 480,95 L 488,106 L 482,118 L 468,116 Z",
  "M 490,92 L 502,86 L 510,96 L 505,112 L 490,108 Z",
  "M 472,92 L 525,74 L 572,76 L 602,92 L 600,115 L 578,130 L 548,140 L 518,140 L 490,128 L 468,112 Z",
  "M 525,74 L 548,56 L 570,50 L 574,76 L 548,88 L 522,86 Z",
  "M 462,154 L 584,148 L 648,198 L 655,250 L 638,298 L 596,344 L 558,360 L 508,344 L 466,298 L 448,252 L 448,204 Z",
  "M 595,295 L 604,280 L 612,290 L 610,318 L 598,325 L 590,312 Z",
  "M 578,78 L 658,62 L 738,55 L 820,58 L 874,68 L 930,88 L 935,115 L 908,140 L 875,132 L 848,150 L 818,152 L 792,148 L 765,170 L 740,178 L 712,178 L 688,162 L 668,168 L 645,200 L 618,218 L 600,208 L 580,188 L 562,162 L 556,140 L 576,118 L 592,106 L 580,88 Z",
  "M 688,162 L 715,155 L 744,172 L 748,208 L 736,234 L 716,244 L 694,232 L 678,212 L 678,184 Z",
  "M 720,248 L 728,244 L 732,254 L 726,262 L 718,258 Z",
  "M 762,170 L 800,178 L 810,208 L 804,238 L 780,250 L 758,236 L 752,208 L 758,182 Z",
  "M 752,268 L 790,252 L 808,260 L 800,280 L 765,288 L 748,278 Z",
  "M 820,272 L 870,262 L 926,272 L 944,298 L 942,344 L 918,364 L 880,370 L 842,358 L 814,335 L 808,305 Z",
  "M 967,354 L 978,344 L 988,354 L 985,372 L 968,375 Z",
  "M 974,378 L 984,374 L 990,388 L 984,400 L 972,397 Z",
  "M 882,114 L 896,108 L 912,118 L 910,140 L 895,148 L 880,138 Z",
  "M 856,188 L 863,182 L 870,188 L 867,200 L 857,200 Z",
];

// ── Main component ────────────────────────────────────────────────────────────

interface TripsSectionProps {
  isMobile?: boolean;
}

export function TripsSection({ isMobile = false }: TripsSectionProps) {
  const [hoveredId,  setHoveredId]  = useState<string | null>(null);
  const [openTripId, setOpenTripId] = useState<string | null>(null);
  const [photoIdx,   setPhotoIdx]   = useState(0);

  const openIdx  = TRIPS.findIndex((t) => t.id === openTripId);
  const openTrip = openIdx >= 0 ? TRIPS[openIdx] : null;

  const openPopup = (id: string) => { setOpenTripId(id); setPhotoIdx(0); };
  const closePopup = () => setOpenTripId(null);

  const goToTrip = (delta: number) => {
    const next = (openIdx + delta + TRIPS.length) % TRIPS.length;
    setOpenTripId(TRIPS[next].id);
    setPhotoIdx(0);
  };

  const goToPhoto = (delta: number) => {
    if (!openTrip) return;
    setPhotoIdx((i) => (i + delta + (openTrip.photos ?? []).length) % (openTrip.photos ?? []).length);
  };

  // Keyboard: ESC closes, arrows navigate trips (capture-phase so section-nav doesn't fire)
  useEffect(() => {
    if (!openTripId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")      { e.stopImmediatePropagation(); closePopup(); }
      if (e.key === "ArrowLeft")   { e.stopImmediatePropagation(); goToTrip(-1); }
      if (e.key === "ArrowRight")  { e.stopImmediatePropagation(); goToTrip(+1); }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [openTripId, openIdx]);

  return (
    <div style={{ width: "100%", position: "relative" }}>

      {/* ── Map + list ──────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <MapPanel
            trips={TRIPS}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onOpen={openPopup}
          />
        </div>
        <div style={{ flexShrink: 0, width: isMobile ? "100%" : 210 }}>
          <FieldNotes
            trips={TRIPS}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onOpen={openPopup}
          />
        </div>
      </div>

      {/* ── Popup overlay ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {openTrip && (
          <motion.div
            key="trip-popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(4,10,6,0.96)",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              borderRadius: 4,
              overflow: "hidden",
            }}
            onClick={closePopup}
          >
            <TripPopup
              trips={TRIPS}
              trip={openTrip}
              tripIdx={openIdx}
              photoIdx={photoIdx}
              isMobile={isMobile}
              onClose={closePopup}
              onNextTrip={() => goToTrip(+1)}
              onPrevTrip={() => goToTrip(-1)}
              onNextPhoto={() => goToPhoto(+1)}
              onPrevPhoto={() => goToPhoto(-1)}
              onSetPhoto={setPhotoIdx}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Trip popup ────────────────────────────────────────────────────────────────

function TripPopup({
  trips,
  trip,
  tripIdx,
  photoIdx,
  isMobile,
  onClose,
  onNextTrip,
  onPrevTrip,
  onNextPhoto,
  onPrevPhoto,
  onSetPhoto,
}: {
  trips: TripEntry[];
  trip: TripEntry;
  tripIdx: number;
  photoIdx: number;
  isMobile: boolean;
  onClose: () => void;
  onNextTrip: () => void;
  onPrevTrip: () => void;
  onNextPhoto: () => void;
  onPrevPhoto: () => void;
  onSetPhoto: (i: number) => void;
}) {
  const [from, to] = PALETTES[trip.id]?.[photoIdx] ?? ["#0a1210", "#1a3020"];

  return (
    // stopPropagation so clicks inside don't bubble to the backdrop-close handler
    <div
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── Top nav bar ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "10px 14px" : "12px 20px",
          borderBottom: "1px solid rgba(212,160,48,0.15)",
          flexShrink: 0,
        }}
      >
        {/* Prev trip */}
        <button
          onClick={onPrevTrip}
          aria-label="Previous location"
          style={navBtnStyle}
        >
          ← {!isMobile && trips[(tripIdx - 1 + trips.length) % trips.length].location}
        </button>

        {/* Counter */}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(100,137,113,0.6)",
            letterSpacing: "0.18em",
          }}
        >
          {String(tripIdx + 1).padStart(2, "0")} / {String(trips.length).padStart(2, "0")}
        </span>

        {/* Next trip + close */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onNextTrip}
            aria-label="Next location"
            style={navBtnStyle}
          >
            {!isMobile && trips[(tripIdx + 1) % trips.length].location} →
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              ...navBtnStyle,
              marginLeft: 6,
              color: "rgba(240,236,226,0.5)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Photo area ────────────────────────────────────────────────── */}
      <div style={{ flex: "1 1 0", position: "relative", minHeight: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${trip.id}-${photoIdx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Hatching texture */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(255,255,255,0.014) 0px, rgba(255,255,255,0.014) 1px, transparent 1px, transparent 9px)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                textAlign: "center",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: isMobile ? 10 : 12,
                  color: "rgba(200,196,180,0.28)",
                  letterSpacing: "0.22em",
                  marginBottom: 10,
                }}
              >
                PHOTO {String(photoIdx + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: isMobile ? 16 : 22,
                  color: "rgba(200,196,180,0.45)",
                  letterSpacing: "0.06em",
                }}
              >
                {(trip.photos ?? [])[photoIdx]}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Photo arrow overlays */}
        <button
          onClick={onPrevPhoto}
          aria-label="Previous photo"
          style={{
            ...photoArrowStyle,
            left: 12,
          }}
        >
          ‹
        </button>
        <button
          onClick={onNextPhoto}
          aria-label="Next photo"
          style={{
            ...photoArrowStyle,
            right: 12,
          }}
        >
          ›
        </button>
      </div>

      {/* ── Caption strip ─────────────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          padding: isMobile ? "14px 16px" : "16px 24px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: isMobile ? 10 : 16,
        }}
      >
        {/* Left: title + location */}
        <div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: isMobile ? 16 : 20,
              fontWeight: 700,
              color: "#f0ece2",
              letterSpacing: "0.01em",
              marginBottom: 4,
            }}
          >
            {trip.location}
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "#638971",
              letterSpacing: "0.1em",
            }}
          >
            {trip.tagline}
          </div>
        </div>

        {/* Right: date + photo dots */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: isMobile ? "flex-start" : "flex-end",
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "#d4a030",
              letterSpacing: "0.1em",
            }}
          >
            {trip.date}
          </div>
          {/* Photo dots */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {(trip.photos ?? []).map((_, i) => (
              <button
                key={i}
                onClick={() => onSetPhoto(i)}
                aria-label={`Photo ${i + 1}`}
                style={{
                  width: i === photoIdx ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === photoIdx ? "#d4a030" : "rgba(212,160,48,0.25)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "width 0.18s, background 0.18s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Map panel ─────────────────────────────────────────────────────────────────

function MapPanel({
  trips,
  hoveredId,
  onHover,
  onOpen,
}: {
  trips: TripEntry[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: "rgba(4, 10, 6, 0.96)",
        border: "1px solid rgba(80,120,90,0.2)",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 9,
          left: 11,
          fontFamily: "monospace",
          fontSize: 8,
          color: "rgba(100,137,113,0.55)",
          letterSpacing: "0.22em",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        GLOBAL FIELD MAP
      </div>
      <div
        style={{
          position: "absolute",
          top: 9,
          right: 11,
          fontFamily: "monospace",
          fontSize: 8,
          color: "rgba(100,137,113,0.35)",
          letterSpacing: "0.1em",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        CLICK PIN TO OPEN
      </div>

      <svg
        viewBox="0 0 1000 500"
        style={{ width: "100%", display: "block" }}
        aria-label="Travel map — click a pin to view trip"
      >
        <defs>
          <style>{`
            @keyframes mapPulse {
              0%   { r: 10; opacity: 0.55; }
              100% { r: 26; opacity: 0; }
            }
            .map-pulse { animation: mapPulse 2.2s ease-out infinite; }
          `}</style>
        </defs>

        <rect width={1000} height={500} fill="#040a06" />

        {/* Grid */}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`vg${i}`} x1={i*100} y1={0} x2={i*100} y2={500}
            stroke="rgba(255,255,255,0.022)" strokeWidth={0.5} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`hg${i}`} x1={0} y1={i*100} x2={1000} y2={i*100}
            stroke="rgba(255,255,255,0.022)" strokeWidth={0.5} />
        ))}

        {/* Reference lines */}
        <line x1={0} y1={250} x2={1000} y2={250} stroke="rgba(100,150,110,0.09)" strokeWidth={0.8} strokeDasharray="6 10" />
        <line x1={0} y1={184} x2={1000} y2={184} stroke="rgba(100,150,110,0.04)" strokeWidth={0.5} strokeDasharray="2 12" />
        <line x1={0} y1={316} x2={1000} y2={316} stroke="rgba(100,150,110,0.04)" strokeWidth={0.5} strokeDasharray="2 12" />

        {/* Continents */}
        {CONTINENT_PATHS.map((d, i) => (
          <path key={i} d={d}
            fill="rgba(26,50,30,0.62)"
            stroke="rgba(55,85,60,0.55)"
            strokeWidth={0.7}
            strokeLinejoin="round"
          />
        ))}

        {/* Route */}
        <polyline
          points={trips.map((t) => `${t.mapX},${t.mapY}`).join(" ")}
          fill="none"
          stroke="rgba(212,160,48,0.12)"
          strokeWidth={1}
          strokeDasharray="5 9"
          strokeLinecap="round"
        />

        {/* Pins */}
        {trips.map((trip) => {
          const isHov = trip.id === hoveredId;
          return (
            <g key={trip.id}>
              {isHov && (
                <circle className="map-pulse" cx={trip.mapX} cy={trip.mapY} r={10}
                  fill="none" stroke="#d4a030" strokeWidth={1} />
              )}
              <circle cx={trip.mapX} cy={trip.mapY}
                r={isHov ? 7 : 4.5}
                fill="none"
                stroke={isHov ? "rgba(212,160,48,0.85)" : "rgba(212,160,48,0.32)"}
                strokeWidth={1}
              />
              <circle cx={trip.mapX} cy={trip.mapY}
                r={isHov ? 3 : 1.8}
                fill={isHov ? "#d4a030" : "rgba(212,160,48,0.55)"}
              />
              {/* Hit area */}
              <circle cx={trip.mapX} cy={trip.mapY} r={20}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={() => onOpen(trip.id)}
                onMouseEnter={() => onHover(trip.id)}
                onMouseLeave={() => onHover(null)}
                role="button"
                aria-label={`Open ${trip.location}`}
              />
            </g>
          );
        })}

        {/* Hovered pin label */}
        {hoveredId && (() => {
          const t = trips.find((x) => x.id === hoveredId)!;
          return (
            <text
              x={Math.min(Math.max(t.mapX, 60), 940)}
              y={t.mapY - 14}
              textAnchor={t.mapX > 900 ? "end" : t.mapX < 100 ? "start" : "middle"}
              fill="rgba(212,160,48,0.8)"
              fontSize={8.5}
              fontFamily="monospace"
              letterSpacing={1.2}
            >
              {t.location.toUpperCase()}
            </text>
          );
        })()}
      </svg>

      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.055) 1px, transparent 2px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ── Field notes list ──────────────────────────────────────────────────────────

function FieldNotes({
  trips,
  hoveredId,
  onHover,
  onOpen,
}: {
  trips: TripEntry[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div
      style={{
        background: "rgba(4, 10, 6, 0.96)",
        border: "1px solid rgba(80,120,90,0.2)",
        borderRadius: 4,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          padding: "11px 14px 9px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: 8, color: "#638971", letterSpacing: "0.22em" }}>
          FIELD NOTES
        </span>
        <span style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(100,137,113,0.4)", letterSpacing: "0.1em" }}>
          {trips.length} LOC
        </span>
      </div>

      <div style={{ flex: 1 }}>
        {trips.map((trip, i) => {
          const isHov = trip.id === hoveredId;
          return (
            <button
              key={trip.id}
              onClick={() => onOpen(trip.id)}
              onMouseEnter={() => onHover(trip.id)}
              onMouseLeave={() => onHover(null)}
              aria-label={`Open ${trip.location}`}
              style={{
                width: "100%",
                display: "block",
                textAlign: "left",
                background: isHov ? "rgba(212,160,48,0.06)" : "transparent",
                border: "none",
                borderLeft: `2px solid ${isHov ? "rgba(212,160,48,0.5)" : "transparent"}`,
                borderBottom: i < trips.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                cursor: "pointer",
                padding: "10px 14px 10px 12px",
                transition: "background 0.12s",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginBottom: 3 }}>
                <span style={{
                  fontFamily: "monospace", fontSize: 8,
                  color: isHov ? "#d4a030" : "rgba(100,137,113,0.4)",
                  letterSpacing: "0.1em", flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{
                  fontFamily: "monospace", fontSize: 11,
                  fontWeight: isHov ? 700 : 400,
                  color: isHov ? "#f0ece2" : "#7a9482",
                  letterSpacing: "0.01em", lineHeight: 1.3,
                }}>
                  {trip.location}
                </span>
              </div>
              <div style={{
                fontFamily: "monospace", fontSize: 9,
                color: isHov ? "rgba(212,160,48,0.6)" : "#354a3c",
                letterSpacing: "0.08em", paddingLeft: 21,
              }}>
                {trip.date}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Shared button styles ──────────────────────────────────────────────────────

const navBtnStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(212,160,48,0.2)",
  borderRadius: 3,
  color: "rgba(212,160,48,0.7)",
  cursor: "pointer",
  fontFamily: "monospace",
  fontSize: 11,
  letterSpacing: "0.06em",
  padding: "5px 12px",
};

const photoArrowStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(0,0,0,0.45)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 3,
  color: "rgba(240,236,226,0.7)",
  cursor: "pointer",
  fontFamily: "monospace",
  fontSize: 28,
  lineHeight: 1,
  padding: "6px 10px",
  zIndex: 2,
};
