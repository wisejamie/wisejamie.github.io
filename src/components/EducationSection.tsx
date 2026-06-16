import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EDUCATION_ENTRIES } from "../data/portfolio";
import { EducationBaseballCard } from "./EducationBaseballCard";
import { EducationCardBack } from "./EducationCardBack";
import { Topps1963CardDemo } from "./Topps1963CardDemo";
import { Topps1963CardBack } from "./Topps1963CardBack";

type EduView = { mode: "fronts" } | { mode: "back"; index: 0 | 1 };

const CARD_LABELS: [string, string] = ["McGill", "UNSW"];

interface EducationSectionProps {
  isMobile?: boolean;
}

export function EducationSection({ isMobile = false }: EducationSectionProps) {
  const [view, setView] = useState<EduView>({ mode: "fronts" });

  const CARD_W = isMobile ? 210 : 340;
  const GAP    = isMobile ? 20 : 28;

  const goToFronts            = () => setView({ mode: "fronts" });
  const goToBack = (i: 0 | 1) => setView({ mode: "back", index: i });

  // Capture-phase handler so EducationSection intercepts arrow keys + space
  // before PitchLab's section-navigation handler sees them.
  useEffect(() => {
    const current = view;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.stopImmediatePropagation();
        e.preventDefault();
        if (current.mode === "fronts") {
          goToBack(0); // space on fronts → McGill back
        } else {
          goToFronts(); // space on back → return to fronts
        }
        return;
      }
      if (current.mode !== "back") return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.stopImmediatePropagation();
      goToBack(current.index === 0 ? 1 : 0);
    };

    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [view]);

  return (
    <div style={{ width: "100%" }} onClick={(e) => e.stopPropagation()}>
      <AnimatePresence mode="wait" initial={false}>

        {/* ── Front collection ──────────────────────────────────────── */}
        {view.mode === "fronts" && (
          <motion.div
            key="fronts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: GAP, alignItems: isMobile ? "center" : "flex-start" }}>
              {/* Card 01 — McGill 1987 Topps style */}
              <div style={{ width: CARD_W, flexShrink: 0 }}>
                <EducationBaseballCard
                  entry={EDUCATION_ENTRIES[0]}
                  isMobile={isMobile}
                  cardWidth={CARD_W}
                  onCardClick={() => goToBack(0)}
                />
              </div>

              {/* Card 02 — UNSW 1963 Topps style */}
              <div style={{ width: CARD_W, flexShrink: 0 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Topps1963CardDemo
                    cardWidth={CARD_W}
                    onClick={() => goToBack(1)}
                  />
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 9,
                      color: "rgba(255,255,255,0.5)",
                      letterSpacing: "0.12em",
                      pointerEvents: "none",
                    }}
                  >
                    CLICK TO FLIP ↻
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Card back view ────────────────────────────────────────── */}
        {view.mode === "back" && (
          <motion.div
            key={`back-${view.index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            style={{ width: "100%" }}
          >
            {/* Tab nav — which card back you're on */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 14,
              }}
            >
              {([0, 1] as const).map((i) => {
                const active = view.index === i;
                return (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); goToBack(i); }}
                    style={{
                      background: active
                        ? "rgba(99,137,113,0.18)"
                        : "rgba(0,0,0,0.4)",
                      border: `1px solid ${
                        active ? "#638971" : "rgba(255,255,255,0.12)"
                      }`,
                      borderRadius: 3,
                      color: active
                        ? "#a8c4b4"
                        : "rgba(255,255,255,0.3)",
                      cursor: active ? "default" : "pointer",
                      fontFamily: "monospace",
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      padding: "5px 12px",
                    }}
                  >
                    {CARD_LABELS[i]}
                  </button>
                );
              })}
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.1em",
                  marginLeft: 6,
                }}
              >
                ← → TO SWITCH
              </span>
            </div>

            {/* Back content */}
            {view.index === 0 ? (
              <EducationCardBack
                entry={EDUCATION_ENTRIES[0]}
                isMobile={isMobile}
                onFlipBack={goToFronts}
              />
            ) : (
              <Topps1963CardBack
                entry={EDUCATION_ENTRIES[1]}
                isMobile={isMobile}
                onFlipBack={goToFronts}
              />
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
