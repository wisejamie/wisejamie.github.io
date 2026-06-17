// 1963 Topps-inspired card back for the UNSW exchange entry.
// Colors mirror the 1963 card front (green + cream + gold).
// Edit UNSW content in src/data/portfolio.ts → EDUCATION_ENTRIES[1].

import type { ReactNode } from "react";
import type { EducationEntry } from "../data/portfolio";

interface Topps1963CardBackProps {
  entry: EducationEntry;
  isMobile: boolean;
  onFlipBack: () => void;
}

const GREEN = "#3b6940"; // matches 1963 nameplate green
const CREAM = "#f0e4c8"; // matches 1963 card stock
const INK = "#1a2e1c"; // deep forest green for body text
const LINE = "#5a7d5e"; // divider / header underline
const GOLD = "#d4a030"; // matches 1963 subtitle gold

function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: 13,
        fontWeight: 700,
        color: GREEN,
        borderBottom: `1.5px solid ${LINE}`,
        letterSpacing: "0.18em",
        marginBottom: 10,
        paddingBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function BulletList({ items, isMobile = false }: { items: string[]; isMobile?: boolean }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 6,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: isMobile ? 12 : 14,
            color: INK,
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: GREEN, flexShrink: 0 }}>◆</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Topps1963CardBack({
  entry,
  isMobile,
  onFlipBack,
}: Topps1963CardBackProps) {
  return (
    <div
      style={{
        width: "100%",
        background: CREAM,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 16px 48px rgba(0,0,0,0.7), 0 3px 10px rgba(0,0,0,0.4)",
        border: "1.5px solid rgba(0,0,0,0.18)",
        position: "relative",
      }}
    >
      {/* ── Header band ─────────────────────────────────────────────────── */}
      <div
        style={{
          background: GREEN,
          borderTop: `2px solid ${GOLD}`,
          borderBottom: `2px solid ${GOLD}`,
          padding: isMobile ? "10px 16px" : "12px 26px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: isMobile ? 11 : 13,
            color: "#f0ece0",
            letterSpacing: "0.22em",
            fontWeight: 700,
          }}
        >
          EXCHANGE RECORD
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "rgba(240,236,224,0.55)",
              letterSpacing: "0.1em",
            }}
          >
            No. 02
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFlipBack();
            }}
            style={{
              background: "rgba(0,0,0,0.18)",
              border: "1px solid rgba(240,236,224,0.3)",
              borderRadius: 3,
              color: "#f0ece0",
              cursor: "pointer",
              fontFamily: "monospace",
              fontSize: 12,
              letterSpacing: "0.1em",
              padding: "5px 12px",
            }}
          >
            ↩ FLIP
          </button>
        </div>
      </div>

      {/* ── Player / institution info ────────────────────────────────────── */}
      <div
        style={{
          background: CREAM,
          padding: isMobile ? "14px 16px 16px" : "16px 26px 18px",
          borderBottom: `2px solid ${INK}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "4px" : "4px 24px",
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                fontFamily:
                  '"Arial Black", "Franklin Gothic Heavy", Impact, sans-serif',
                fontSize: isMobile ? 34 : 44,
                fontWeight: 900,
                color: INK,
                letterSpacing: "0.03em",
                lineHeight: 1,
                textShadow: "0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              {entry.name}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              paddingTop: isMobile ? 4 : 2,
            }}
          >
            <div
              style={{
                fontFamily:
                  '"Arial Black", "Franklin Gothic Heavy", Impact, sans-serif',
                fontSize: isMobile ? 16 : 20,
                fontWeight: 700,
                color: INK,
                letterSpacing: "0.02em",
                lineHeight: 1.2,
                textShadow: "0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              {entry.school}
            </div>
            {entry.location && (
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: "#3d5a40",
                  letterSpacing: "0.1em",
                  marginTop: 5,
                }}
              >
                {entry.location}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: GREEN,
          color: "#d4e8d4",
          borderBottom: `3px solid ${GOLD}`,
          padding: isMobile ? "11px 16px" : "13px 26px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr 1fr",
          gap: isMobile ? 10 : 22,
          alignItems: "center",
        }}
      >
        {[
          { label: "PROGRAM", value: entry.program ?? "CS · Exchange" },
          { label: "PERIOD", value: entry.dates },
          { label: "FUN HAD", value: "A lot." },
        ].map(({ label, value }, index) => (
          <div
            key={label}
            style={{
              minWidth: 0,
              paddingLeft: !isMobile && index > 0 ? 18 : 0,
              borderLeft:
                !isMobile && index > 0
                  ? "1px solid rgba(255,255,255,0.12)"
                  : "none",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: isMobile ? 9 : 11,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.14em",
                marginBottom: 6,
                lineHeight: 1,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: isMobile ? 13 : 14,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.03em",
                fontWeight: 700,
                lineHeight: 1.3,
                whiteSpace: "pre-line",
                overflowWrap: "break-word",
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div
        style={{
          background: CREAM,
          padding: isMobile ? "16px 16px" : "18px 26px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr",
            gap: isMobile ? 14 : 0,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              paddingRight: isMobile ? 0 : 26,
              borderRight: isMobile
                ? "none"
                : `1.5px solid rgba(30,46,28,0.15)`,
            }}
          >
            <SectionHeader>HIGHLIGHTS</SectionHeader>
            <BulletList
              items={entry.highlights ?? ["Exchange highlight placeholder."]}
              isMobile={isMobile}
            />
          </div>
          <div style={{ paddingLeft: isMobile ? 0 : 26 }}>
            <SectionHeader>WHAT I LEARNED</SectionHeader>
            <BulletList items={entry.coursework ?? ["Course placeholder."]} isMobile={isMobile} />
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div
        style={{
          background: CREAM,
          borderTop: `1.5px solid rgba(30,46,28,0.12)`,
          padding: "7px 26px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            color: "#5a7040",
            letterSpacing: "0.15em",
          }}
        />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 7,
            color: "#5a7040",
            letterSpacing: "0.12em",
          }}
        >
          LIMITED EDITION
        </span>
      </div>

      {/* Print texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 8,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.010) 1px, transparent 2px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
