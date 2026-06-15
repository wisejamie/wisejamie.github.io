import { PITCHES } from "../data/pitches";
import type { PitchType } from "../data/pitches";

interface PitchPickerProps {
  onSelect: (pitch: PitchType) => void;
  selectedId: string | null;
  disabled: boolean;
}

export function PitchPicker({
  onSelect,
  selectedId,
  disabled,
}: PitchPickerProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 7,
        padding: "0 16px",
      }}
    >
      {/* <div style={{
        fontFamily: 'monospace',
        fontSize: 8,
        color: '#2a3a2e',
        letterSpacing: '0.22em',
      }}>
        PITCH LAB
      </div> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
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
                fontSize: 11,
                opacity: disabled && !isSelected ? 0.45 : 1,
                padding: "8px 12px",
                textAlign: "left",
                minWidth: 110,
              }}
            >
              <div
                style={{
                  color: pitch.colorLabel,
                  fontWeight: 700,
                  marginBottom: 2,
                  fontSize: 12,
                }}
              >
                {pitch.name}
              </div>
              <div style={{ color: "#555", fontSize: 10, marginBottom: 4 }}>
                {pitch.section.toUpperCase()}
              </div>
              <div
                style={{ display: "flex", gap: 8, fontSize: 10, color: "#777" }}
              >
                <span>{pitch.velocityMph} mph</span>
                <span>{(pitch.spinRpm / 1000).toFixed(1)}k rpm</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
