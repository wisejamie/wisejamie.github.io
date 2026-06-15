import type { ReactNode } from "react";
import type { EducationEntry } from "../data/portfolio";

interface EducationCardBackProps {
  entry: EducationEntry;
  isMobile: boolean;
  onFlipBack: () => void;
}

const CREAM = "#f0e8d2";
const NAVY = "#182040";
const NAVY_MID = "#243060";

function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: 10,
        fontWeight: 700,
        color: NAVY,
        letterSpacing: "0.2em",
        marginBottom: 7,
        paddingBottom: 4,
        borderBottom: `1.5px solid rgba(24,32,64,0.2)`,
      }}
    >
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 7,
            marginBottom: 4,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 12,
            color: "#1a1408",
            lineHeight: 1.45,
          }}
        >
          <span style={{ color: "#8a1818", flexShrink: 0, marginTop: 1 }}>
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function EducationCardBack({
  entry,
  isMobile,
  onFlipBack,
}: EducationCardBackProps) {
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
      {/* ── Header band ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: NAVY,
          padding: isMobile ? "8px 14px" : "9px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: isMobile ? 9 : 10,
            color: "rgba(255,255,255,0.82)",
            letterSpacing: "0.22em",
            fontWeight: 700,
          }}
        >
          EDUCATION RECORD
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.1em",
            }}
          >
            No. 01
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFlipBack();
            }}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 3,
              color: "rgba(255,255,255,0.55)",
              cursor: "pointer",
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.1em",
              padding: "3px 8px",
            }}
          >
            ↩ FLIP
          </button>
        </div>
      </div>

      {/* ── Player info ───────────────────────────────────────────────────── */}
      <div
        style={{
          background: CREAM,
          padding: isMobile ? "10px 14px 12px" : "12px 20px 14px",
          borderBottom: `2px solid ${NAVY}`,
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
                fontSize: isMobile ? 26 : 34,
                fontWeight: 900,
                color: NAVY,
                letterSpacing: "0.03em",
                lineHeight: 1,
                textShadow: "0 1px 0 rgba(255,255,255,0.6)",
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
                fontSize: isMobile ? 18 : 22,
                fontWeight: 600,
                color: NAVY,
                letterSpacing: "0.03em",
                lineHeight: 1,
                textShadow: "0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              {entry.school}
            </div>
            {entry.location && (
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "#4a3c28",
                  letterSpacing: "0.1em",
                  marginTop: 4,
                }}
              >
                {entry.location}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats strip ───────────────────────────────────────────────────── */}
      <div
        style={{
          background: NAVY_MID,
          padding: isMobile ? "8px 14px" : "10px 22px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.4fr 0.9fr 0.8fr",
          gap: isMobile ? 8 : 18,
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(0,0,0,0.28)",
        }}
      >
        {[
          { label: "PROGRAM", value: entry.program ?? "Comp. Science" },
          { label: "YEARS", value: entry.dates },
          { label: "CUMULATIVE GPA", value: entry.gpa ?? "—" },
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
                fontSize: isMobile ? 7 : 8,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.14em",
                marginBottom: 4,
                lineHeight: 1,
              }}
            >
              {label}
            </div>

            <div
              style={{
                fontFamily: "monospace",
                fontSize: isMobile ? 10 : 11,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.03em",
                fontWeight: 700,
                lineHeight: 1.25,
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
          // backgroundImage: RULED,
          padding: isMobile ? "12px 14px" : "14px 20px",
        }}
      >
        {/* Two-column: Highlights | Coursework */}
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
              paddingRight: isMobile ? 0 : 20,
              borderRight: isMobile
                ? "none"
                : `1.5px solid rgba(24,32,64,0.18)`,
            }}
          >
            <SectionHeader>HIGHLIGHTS</SectionHeader>
            <BulletList items={entry.highlights ?? ["Highlight placeholder"]} />
            {entry.footnotes?.length ? (
              <div
                style={{
                  marginTop: 8,
                  fontSize: isMobile ? 7 : 8,
                  lineHeight: 1.35,
                  color: "rgba(24,32,64,0.62)",
                  fontStyle: "italic",
                }}
              >
                {entry.footnotes.map((note) => (
                  <div key={note}>{note}</div>
                ))}
              </div>
            ) : null}
          </div>
          <div style={{ paddingLeft: isMobile ? 0 : 20 }}>
            <SectionHeader>RELEVANT COURSEWORK</SectionHeader>
            <BulletList
              items={entry.coursework ?? ["Coursework placeholder"]}
            />
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#e4dcca",
          borderTop: `1.5px solid rgba(24,32,64,0.15)`,
          padding: "4px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 7,
            color: "#6a5838",
            letterSpacing: "0.15em",
          }}
        ></span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 7,
            color: "#6a5838",
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
            "repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.012) 1px, transparent 2px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
