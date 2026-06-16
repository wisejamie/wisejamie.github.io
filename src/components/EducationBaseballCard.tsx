import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { EducationEntry } from "../data/portfolio";
import { EducationCardBack } from "./EducationCardBack";

interface EducationBaseballCardProps {
  entry: EducationEntry;
  isMobile?: boolean;
  cardWidth?: number;
}

export function EducationBaseballCard({
  entry,
  isMobile = false,
  cardWidth = 240,
}: EducationBaseballCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [focused, setFocused] = useState(false);

  const { name, school, degree, dates, imageUrl } = entry;

  const W = cardWidth;
  const H = Math.round(W * (3.5 / 2.5));
  const BORDER = Math.round(W * 0.057);

  const TOPPS = {
    woodLight: "#d4a24a",
    woodMid: "#b9822d",
    woodDark: "#7b4f18",
    cream: "#eadfc2",
    creamDark: "#c8b98e",
    black: "#11100b",
    photoBorder: "#f0e2b5",
    red: "#d71920",
    redDark: "#9d1018",
    yellow: "#f0c83a",
    dateInk: "#5d5339",
  };

  const woodGrain = [
    "repeating-linear-gradient(90deg, rgba(70,38,10,0.16) 0px, transparent 1px, transparent 5px, rgba(255,230,150,0.12) 7px, transparent 10px)",
    "repeating-linear-gradient(88deg, transparent 0px, rgba(0,0,0,0.08) 2px, transparent 4px, transparent 13px)",
    `linear-gradient(180deg, ${TOPPS.woodLight} 0%, ${TOPPS.woodMid} 18%, #c69238 35%, ${TOPPS.woodDark} 50%, #b77d29 67%, ${TOPPS.woodLight} 100%)`,
  ].join(", ");

  const badgeSize = Math.round(W * 0.23);

  const toggle = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    setIsFlipped((f) => !f);
  };

  const frontCard = (
    <div
      tabIndex={0}
      role="button"
      aria-label={
        isFlipped
          ? "Flip back to card front"
          : "Flip card to see education details"
      }
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggle(e);
        }
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        cursor: "pointer",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        outline: focused ? "2px solid rgba(245,166,35,0.5)" : "none",
        outlineOffset: 8,
        borderRadius: 4,
      }}
    >
      {/* ── Card body ────────────────────────────────────────────────────── */}
      <div
        style={{
          width: W,
          height: H,
          background: woodGrain,
          padding: BORDER,
          boxSizing: "border-box",
          boxShadow:
            "0 16px 48px rgba(0,0,0,0.75), 0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {/* Inner cream frame */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#f0eadb",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.14)",
          }}
        >
          {/* Photo area */}
          <div
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              background: imageUrl
                ? undefined
                : "linear-gradient(168deg, #1b2f4c 0%, #0e1f38 45%, #091428 100%)",
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <>
                <svg
                  viewBox="0 0 100 130"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "62%",
                    opacity: 0.16,
                  }}
                  preserveAspectRatio="xMidYMax meet"
                  aria-hidden="true"
                >
                  <ellipse cx="50" cy="28" rx="19" ry="21" fill="white" />
                  <rect x="44" y="47" width="12" height="9" fill="white" />
                  <path
                    d="M 6 130 L 12 82 Q 22 64 50 62 Q 78 64 88 82 L 94 130 Z"
                    fill="white"
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "radial-gradient(circle at center, rgba(255,255,255,0.07) 1px, transparent 1px)",
                    backgroundSize: "4px 4px",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 7,
                    right: 8,
                    fontFamily: "monospace",
                    fontSize: Math.round(W * 0.028),
                    color: "rgba(255,255,255,0.22)",
                    letterSpacing: "0.1em",
                  }}
                >
                  PHOTO
                </div>
              </>
            )}

            {/* School badge */}
            <div
              style={{
                position: "absolute",
                top: 7,
                left: 7,
                width: badgeSize,
                height: badgeSize,
                borderRadius: "50%",
                background: "#fff8e6",
                border: `${Math.round(W * 0.01)}px solid #d4a832`,
                boxShadow:
                  "0 0 0 1px rgba(0,0,0,0.45), 0 3px 8px rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  borderRadius: "50%",
                  border: "1px solid rgba(120,60,20,0.25)",
                  pointerEvents: "none",
                }}
              />

              <img
                src="/images/mcgill-logo.png"
                alt="McGill University logo"
                style={{
                  width: "78%",
                  height: "78%",
                  objectFit: "contain",
                  position: "relative",
                  zIndex: 1,
                  filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.35))",
                }}
              />
            </div>

            {/* Photo inner border */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxShadow: "inset 0 0 0 1.5px rgba(240,234,216,0.45)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Nameplate */}
          <div
            style={{
              background: `linear-gradient(180deg, ${TOPPS.red} 0%, ${TOPPS.redDark} 100%)`,
              padding: `${Math.round(W * 0.033)}px ${Math.round(W * 0.042)}px ${Math.round(W * 0.025)}px`,
              position: "relative",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: Math.round(W * 0.012),
                background:
                  "linear-gradient(to right, #b88820, #f0ca40, #b88820)",
              }}
            />
            <div
              style={{
                fontFamily: '"Arial Black", Impact, fantasy',
                fontSize: Math.round(W * 0.075),
                fontWeight: 900,
                color: "#fff4dc",
                letterSpacing: "0.04em",
                lineHeight: 1,
                textShadow: "0 1px 4px rgba(0,0,0,0.55)",
                marginTop: Math.round(W * 0.012),
              }}
            >
              {school}
            </div>
            <div
              style={{
                fontFamily: '"Arial Black", Impact, fantasy',
                fontSize: Math.round(W * 0.055),
                color: "TOPPS.Yellow",
                letterSpacing: "0.06em",
                marginTop: Math.round(W * 0.012),
                opacity: 0.95,
              }}
            >
              {degree}
            </div>
          </div>

          {/* Footer with dates */}
          <div
            style={{
              background: `linear-gradient(180deg, #efe3c3 0%, #d7c89f 100%)`,
              padding: `${Math.round(W * 0.012)}px 6px`,
              textAlign: "center",
              borderTop: "0.5px solid rgba(0,0,0,0.1)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: '"Arial Black", Impact, fantasy',
                fontSize: Math.round(W * 0.045),
                color: "TOPPS.DATE_INK",
                letterSpacing: "0.18em",
              }}
            >
              {dates}
            </span>
          </div>
        </div>

        {/* Print texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.014) 1px, transparent 2px)",
            pointerEvents: "none",
          }}
        />
        {/* Corner wear */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: "inset 0 0 24px rgba(0,0,0,0.18)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Flip hint below card */}
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 9,
          color: "rgb(255, 255, 255)",
          letterSpacing: "0.12em",
          pointerEvents: "none",
        }}
      >
        CLICK CARD TO FLIP ↻
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        perspective: "1200px",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!isFlipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            {frontCard}
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ width: "100%" }}
          >
            <EducationCardBack
              entry={entry}
              isMobile={isMobile}
              onFlipBack={() => setIsFlipped(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
