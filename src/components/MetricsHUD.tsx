import { useState } from "react";
import type { PitchType } from "../data/pitches";
import type { SectionMeta } from "../data/sections";

interface MetricsHUDProps {
  pitch: PitchType;
  section: SectionMeta;
  progress: number; // 0–1, how far through the flight
  frozen: boolean;
  onHoverChange?: (hovered: boolean) => void;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function MetricsHUD({ pitch, progress, onHoverChange, isMobile }: MetricsHUDProps & { isMobile?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(false);
  };

  // Speed bleeds down slightly as the ball travels (energy loss to drag)
  const displaySpeed = lerp(
    pitch.velocityMph,
    pitch.velocityMph * 0.94,
    progress,
  );
  // Spin is displayed as constant (we don't model spin decay for Phase 1)
  const displaySpin = pitch.spinRpm;
  // Break values animate from 0 to full as the ball travels
  const hBreak = lerp(0, pitch.movement.horizontalInches, progress);
  const vBreak = lerp(0, pitch.movement.verticalInches, progress);

  const rows: [string, string][] = [
    ["PITCH", pitch.name],
    // ["SECTION", section.label],
    ["SPEED", `${displaySpeed.toFixed(0)} mph`],
    ["SPIN", `${displaySpin.toLocaleString()} rpm`],
    ["H-BREAK", `${hBreak >= 0 ? "+" : ""}${hBreak.toFixed(1)} in`],
    ["V-BREAK", `${vBreak >= 0 ? "+" : ""}${vBreak.toFixed(1)} in`],
  ];

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "absolute",
        top: isMobile ? 50 : 16,
        right: isMobile ? 8 : 16,
        fontFamily: "monospace",
        fontSize: isMobile ? 11 : 12,
        color: "#e0ddd5",
        background: "rgba(0,0,0,0.55)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 4,
        padding: isMobile ? "7px 10px" : "10px 14px",
        minWidth: isMobile ? 140 : 170,
        lineHeight: 1.9,
        cursor: "default",
      }}
    >
      {rows.map(([label, value]) => (
        <div
          key={label}
          style={{ display: "flex", justifyContent: "space-between", gap: 16 }}
        >
          <span style={{ color: "#888", letterSpacing: "0.05em" }}>
            {label}
          </span>
          <span
            style={{
              color: "#e0ddd5",
              textAlign: "right",
            }}
          >
            {value}
          </span>
        </div>
      ))}

      {isHovered && (
        <div
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "rgba(200,210,220,0.45)",
              fontSize: 10,
              letterSpacing: "0.04em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 18,
                borderTop: "1px dashed rgba(200,210,220,0.45)",
                flexShrink: 0,
              }}
            />
            <span>no-spin path</span>
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.03em",
              marginTop: 3,
              paddingLeft: 24,
            }}
          >
            spin creates the break
          </div>
        </div>
      )}
    </div>
  );
}
