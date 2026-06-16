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
          overflowX: "auto",
          gap: 6,
          padding: "10px 12px",
          background:
            "linear-gradient(to bottom, rgba(14,26,18,0.92) 70%, transparent)",
          zIndex: 5,
          scrollbarWidth: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
                  ? "rgba(245,166,35,0.15)"
                  : "rgba(0,0,0,0.55)",
                border: `1px solid ${isActive ? "#f5a623" : "rgba(255,255,255,0.13)"}`,
                borderRadius: 4,
                color: isActive ? "#f5a623" : "#667a6e",
                cursor: disabled ? "default" : "pointer",
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: "0.08em",
                padding: "5px 10px",
                opacity: disabled && !isActive ? 0.35 : 1,
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              {section.label.toUpperCase()}
            </button>
          );
        })}
      </div>
    );
  }

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
        padding: "0 20px 80px 20px",
        zIndex: 5,
        pointerEvents: "none",
        background:
          "linear-gradient(to right, rgba(10,18,12,0.78) 0%, transparent 100%)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {SECTION_ORDER.map((sectionId, i) => {
        const section = SECTIONS[sectionId];
        const pitch = PITCH_FOR_SECTION[sectionId];
        const isActive = activeSectionId === sectionId;
        const isThrowing = isActive && simState === "throwing";

        return (
          <button
            key={sectionId}
            onClick={() => !disabled && onSelect(sectionId)}
            disabled={disabled}
            style={{
              pointerEvents: disabled ? "none" : "auto",
              background: "none",
              border: "none",
              textAlign: "left",
              cursor: disabled ? "default" : "pointer",
              padding: "14px 0",
              opacity: disabled && !isActive ? 0.3 : 1,
              transition: "opacity 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: isActive ? "#f5a623" : "#2e3d32",
                  letterSpacing: "0.12em",
                  minWidth: 14,
                  transition: "color 0.2s",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 18,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#f0ece2" : "#4a6050",
                  letterSpacing: "0.03em",
                  transition: "color 0.2s",
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
                color: isThrowing
                  ? "rgba(245,166,35,0.75)"
                  : isActive
                    ? "rgba(245,166,35,0.45)"
                    : "#243028",
                marginTop: 1,
                transition: "color 0.2s",
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
