import { type ReactNode } from "react";
import { motion } from "framer-motion";
import type { SectionId, PitchType } from "../data/pitches";
import { SECTIONS, SECTION_ORDER } from "../data/sections";

interface SectionPanelProps {
  sectionId: SectionId;
  pitch: PitchType | null;
  onClose: () => void;
  isMobile: boolean;
  children?: ReactNode;
}

export function SectionPanel({
  sectionId,
  pitch,
  onClose,
  isMobile,
  children,
}: SectionPanelProps) {
  const section = SECTIONS[sectionId];
  const sectionNum = SECTION_ORDER.indexOf(sectionId) + 1;

  const initial = isMobile ? { y: "100%" } : { x: "100%" };
  const animate = isMobile ? { y: 0 } : { x: 0 };
  const exit = isMobile ? { y: "100%" } : { x: "100%" };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ type: "tween", duration: 1, ease: [0.32, 0.72, 0, 1] }}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(10,18,12,0.97)",
        zIndex: 8,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Inner layout: constrained width, centered */}
      <div
        style={{
          maxWidth: 760,
          width: "100%",
          margin: "0 auto",
          padding: isMobile ? "24px 20px 48px" : "48px 40px 80px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 32,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: "#638971",
                letterSpacing: "0.2em",
                marginBottom: 10,
              }}
            >
              {String(sectionNum).padStart(2, "0")} /{" "}
              {String(SECTION_ORDER.length).padStart(2, "0")}
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: isMobile ? 36 : 52,
                fontWeight: 700,
                color: "#f0ece2",
                letterSpacing: "0.01em",
                lineHeight: 1.05,
              }}
            >
              {section.label}
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                color: "#4a6050",
                marginTop: 8,
                letterSpacing: "0.06em",
              }}
            ></div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4,
              color: "#638971",
              cursor: "pointer",
              fontFamily: "monospace",
              fontSize: 14,
              padding: "6px 10px",
              lineHeight: 1,
              marginTop: 4,
              flexShrink: 0,
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#9ab09e";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#3a4a3e";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.1)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.06)",
            marginBottom: 28,
          }}
        />

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.06)",
            marginBottom: 28,
          }}
        />

        {/* Content area — children when available, placeholder otherwise */}
        {children ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              marginBottom: 28,
              paddingTop: 8,
            }}
          >
            {children}
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.015)",
              border: "1px dashed rgba(255,255,255,0.07)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                color: "#1e2820",
                letterSpacing: "0.2em",
              }}
            >
              CONTENT COMING SOON
            </div>
          </div>
        )}

        {/* Dismiss hint */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 8,
            color: "#1e2820",
            letterSpacing: "0.15em",
            textAlign: "center",
          }}
        >
          ESC OR CLICK OUTSIDE TO CLOSE
        </div>
      </div>
    </motion.div>
  );
}
