import { useState } from "react";
import type { SectionId } from "../data/pitches";
import { PITCH_FOR_SECTION } from "../data/pitches";
import { SECTIONS, SECTION_ORDER } from "../data/sections";

interface SectionNavProps {
  simState: "idle" | "throwing" | "frozen";
  activeSectionId: SectionId | null;
  onSelect: (sectionId: SectionId) => void;
  containerWidth: number;
}

export function SectionNav({
  simState,
  activeSectionId,
  onSelect,
  containerWidth,
}: SectionNavProps) {
  const isMobile = containerWidth < 640;
  const disabled = simState === "throwing";

  if (isMobile) {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          overflowX: "auto",
          gap: 6,
          padding: "10px 12px",
          background:
            "linear-gradient(to bottom, rgba(10,20,14,0.97) 75%, transparent)",
          zIndex: 5,
          scrollbarWidth: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ flexShrink: 0, marginRight: 6, lineHeight: 1.2 }}>
          <div style={{
            fontFamily: "monospace",
            fontSize: 10,
            fontWeight: 700,
            color: "#7aaa8a",
            letterSpacing: "0.16em",
          }}>
            JAMIE WISE
          </div>
          <div style={{
            fontFamily: "monospace",
            fontSize: 8,
            color: "#3a5040",
            letterSpacing: "0.18em",
          }}>
            PORTFOLIO
          </div>
        </div>
        <div style={{
          width: 1,
          alignSelf: "stretch",
          background: "rgba(255,255,255,0.1)",
          marginRight: 6,
          flexShrink: 0,
        }} />
        {SECTION_ORDER.map((sectionId) => {
          const section = SECTIONS[sectionId];
          const isActive = activeSectionId === sectionId;
          return (
            <button
              key={sectionId}
              onClick={() => !disabled && onSelect(sectionId)}
              disabled={disabled}
              style={{
                flexShrink: 0,
                background: isActive
                  ? "rgba(245,166,35,0.18)"
                  : "rgba(255,255,255,0.06)",
                border: `1px solid ${isActive ? "#f5a623" : "rgba(255,255,255,0.22)"}`,
                borderRadius: 5,
                color: isActive ? "#f5a623" : "#a8bfb0",
                cursor: disabled ? "default" : "pointer",
                fontFamily: "monospace",
                fontSize: 12,
                fontWeight: isActive ? 600 : 400,
                letterSpacing: "0.06em",
                padding: "8px 14px",
                opacity: disabled && !isActive ? 0.35 : 1,
                transition: "color 0.15s, border-color 0.15s, background 0.15s",
              }}
            >
              {section.label.toUpperCase()}
            </button>
          );
        })}
      </div>
    );
  }

  const [hoveredId, setHoveredId] = useState<SectionId | null>(null);

  return (
    <nav
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: 180,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        padding: "0 20px 80px 0",
        zIndex: 5,
        pointerEvents: "none",
        background:
          "linear-gradient(to right, rgba(10,18,12,0.82) 0%, transparent 100%)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {SECTION_ORDER.map((sectionId, i) => {
        const section = SECTIONS[sectionId];
        const pitch = PITCH_FOR_SECTION[sectionId];
        const isActive = activeSectionId === sectionId;
        const isHovered = hoveredId === sectionId && !disabled;
        const isThrowing = isActive && simState === "throwing";

        const barColor = isActive
          ? "#f5a623"
          : isHovered
            ? "rgba(245,166,35,0.45)"
            : "rgba(245,166,35,0.14)";

        const numColor = isActive
          ? "#f5a623"
          : isHovered
            ? "#8aaa90"
            : "#4a6050";

        const labelColor = isActive
          ? "#f0ece2"
          : isHovered
            ? "#b0cabb"
            : "#7a9a82";

        const pitchColor = isThrowing
          ? "rgba(245,166,35,0.75)"
          : isActive
            ? "rgba(245,166,35,0.45)"
            : isHovered
              ? "#4a6050"
              : "#304038";

        return (
          <button
            key={sectionId}
            onClick={() => !disabled && onSelect(sectionId)}
            onMouseEnter={() => setHoveredId(sectionId)}
            onMouseLeave={() => setHoveredId(null)}
            disabled={disabled}
            style={{
              pointerEvents: disabled ? "none" : "auto",
              background: isHovered && !isActive ? "rgba(245,166,35,0.04)" : "none",
              border: "none",
              borderLeft: `2px solid ${barColor}`,
              textAlign: "left",
              cursor: disabled ? "default" : "pointer",
              padding: "14px 0 14px 18px",
              opacity: disabled && !isActive ? 0.3 : 1,
              transition: "opacity 0.2s, background 0.15s, border-color 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: numColor,
                  letterSpacing: "0.12em",
                  minWidth: 14,
                  transition: "color 0.15s",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 18,
                  fontWeight: isActive ? 600 : 400,
                  color: labelColor,
                  letterSpacing: "0.03em",
                  transition: "color 0.15s",
                }}
              >
                {section.label}
              </span>
            </div>
            <div
              style={{
                marginLeft: 21,
                fontSize: 12,
                fontFamily: "monospace",
                letterSpacing: "0.07em",
                color: pitchColor,
                marginTop: 1,
                transition: "color 0.15s",
              }}
            >
              {isThrowing ? "▸ THROWING" : pitch.name.toUpperCase()}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
