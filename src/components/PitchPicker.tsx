import { PITCHES } from "../data/pitches";
import type { PitchType } from "../data/pitches";

interface PitchPickerProps {
  onSelect: (pitch: PitchType) => void;
  selectedId: string | null;
  disabled: boolean;
  isMobile?: boolean;
}

export function PitchPicker({
  onSelect,
  selectedId,
  disabled,
  isMobile = false,
}: PitchPickerProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: isMobile ? 70 : 24,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 7,
        padding: isMobile ? "0 12px" : "0 16px",
      }}
    >
      <div
        style={
          isMobile
            ? {
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 6,
                width: "100%",
              }
            : {
                display: "flex",
                justifyContent: "center",
                gap: 10,
                flexWrap: "wrap",
              }
        }
      >
        {PITCHES.map((pitch) => {
          const isSelected = pitch.id === selectedId;
          return (
            <button
              key={pitch.id}
              onClick={() => !disabled && onSelect(pitch)}
              style={{
                background: isSelected
                  ? "rgba(245,166,35,0.15)"
                  : "rgba(0,0,0,0.55)",
                border: `1.5px solid ${isSelected ? "#f5a623" : "rgba(255,255,255,0.15)"}`,
                borderRadius: 6,
                color: "#e0ddd5",
                cursor: disabled ? "not-allowed" : "pointer",
                fontFamily: "monospace",
                fontSize: isMobile ? 9 : 11,
                opacity: disabled && !isSelected ? 0.45 : 1,
                padding: isMobile ? "6px 6px" : "8px 12px",
                textAlign: "left",
                minWidth: isMobile ? 0 : 110,
              }}
            >
              <div
                style={{
                  color: pitch.colorLabel,
                  fontWeight: 700,
                  marginBottom: isMobile ? 1 : 2,
                  fontSize: isMobile ? 10 : 12,
                  whiteSpace: "normal",
                  lineHeight: 1.2,
                }}
              >
                {pitch.name}
              </div>
              {!isMobile && (
                <div style={{ color: "#555", fontSize: 10, marginBottom: 4 }}>
                  {pitch.section.toUpperCase()}
                </div>
              )}
              <div
                style={{ display: "flex", gap: 6, fontSize: 9, color: "#777", flexWrap: "wrap" }}
              >
                <span>{pitch.velocityMph} mph</span>
                {!isMobile && <span>{(pitch.spinRpm / 1000).toFixed(1)}k rpm</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
