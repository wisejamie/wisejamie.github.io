import { motion } from "framer-motion";
import type { SectionId } from "../data/pitches";
import { SECTION_ORDER } from "../data/sections";

interface SectionHintProps {
  isMobile: boolean;
  sectionId: SectionId;
  containerHeight: number;
  onDismiss: () => void;
}

// Approximate height of each desktop nav button (14px pad + ~22px label + ~17px pitch line + 14px pad)
const BUTTON_H = 67;
const BUTTON_GAP = 2;
const NAV_BOTTOM_PAD = 80;

function sectionButtonCenterY(sectionId: SectionId, containerH: number): number {
  const index = SECTION_ORDER.indexOf(sectionId);
  const totalH = SECTION_ORDER.length * BUTTON_H + (SECTION_ORDER.length - 1) * BUTTON_GAP;
  const availableH = containerH - NAV_BOTTOM_PAD;
  const startY = (availableH - totalH) / 2;
  return startY + index * (BUTTON_H + BUTTON_GAP) + BUTTON_H / 2;
}

export function SectionHint({ isMobile, sectionId, containerHeight, onDismiss }: SectionHintProps) {
  const centerY = sectionButtonCenterY(sectionId, containerHeight);

  return (
    <motion.div
      initial={isMobile ? { opacity: 0, x: "-50%", y: -8 } : { opacity: 0, x: -8, y: "-50%" }}
      animate={isMobile ? { opacity: 1, x: "-50%", y: 0 } : { opacity: 1, x: 0, y: "-50%" }}
      exit={isMobile ? { opacity: 0, x: "-50%", y: -8 } : { opacity: 0, x: -8, y: "-50%" }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.3 }}
      style={{
        position: "absolute",
        ...(isMobile ? { top: 68, left: "50%" } : { left: 192, top: centerY }),
        zIndex: 7,
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(0,0,0,0.78)",
        border: "1px solid rgba(245,166,35,0.38)",
        borderRadius: 6,
        padding: "8px 10px 8px 12px",
        pointerEvents: "auto",
        whiteSpace: "nowrap",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <PulsingArrow isMobile={isMobile} />
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          letterSpacing: "0.07em",
          color: "#a8bfb0",
        }}
      >
        {isMobile ? "TAP A SECTION TO EXPLORE" : "CLICK A SECTION TO EXPLORE"}
      </span>
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          color: "rgba(245,166,35,0.6)",
          cursor: "pointer",
          fontFamily: "monospace",
          fontSize: 13,
          lineHeight: 1,
          padding: "0 0 0 4px",
          marginLeft: 2,
        }}
        aria-label="Dismiss hint"
      >
        ×
      </button>
    </motion.div>
  );
}

function PulsingArrow({ isMobile }: { isMobile: boolean }) {
  return (
    <motion.span
      animate={{ opacity: [0.45, 1, 0.45] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      style={{
        fontFamily: "monospace",
        fontSize: 13,
        color: "#f5a623",
        display: "inline-block",
      }}
    >
      {isMobile ? "↑" : "←"}
    </motion.span>
  );
}
