import type { ReactNode } from "react";
import type { EducationEntry } from "../data/portfolio";

interface EducationCardBackProps {
  entry: EducationEntry;
  isMobile: boolean;
  onFlipBack: () => void;
}

const CREAM = "#c9c4aa"; // faded paper/off-white
const TOPPS_YELLOW = "#c8bd32"; // main yellow stat-box color

const TOPPS_BLUE = "#344d6e"; // main 1987 Topps blue

const INK = "#213442"; // dark printed ink
const LINE = "#6f7a72"; // table/divider lines

// const CREAM = "#f0e8d2";
// const NAVY = "#182040";
// const NAVY_MID = "#243060";

function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: 13,
        fontWeight: 700,
        color: TOPPS_BLUE,
        borderBottom: `1.5px solid ${LINE}`,
        letterSpacing: "0.2em",
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
            color: "#1a1408",
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: TOPPS_BLUE }}>◆</span>
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
          background: TOPPS_YELLOW,
          color: INK,
          borderTop: `2px solid ${TOPPS_BLUE}`,
          borderBottom: `2px solid ${TOPPS_BLUE}`,
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
            color: "TOPPS_BLUE",
            letterSpacing: "0.22em",
            fontWeight: 700,
          }}
        >
          EDUCATION RECORD
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "TOPPS_BLUE",
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
              background: "CREAM",
              border: "1px solid TOPPS_BLUE",
              borderRadius: 3,
              color: "TOPPS_BLUE",
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

      {/* ── Player info ───────────────────────────────────────────────────── */}
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
                fontSize: isMobile ? 16 : 20,
                fontWeight: 600,
                color: INK,
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
                  fontSize: 13,
                  color: "#4a3c28",
                  letterSpacing: "0.1em",
                  marginTop: 6,
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
          background: TOPPS_BLUE,
          color: "#d8d2ae",
          borderBottom: `3px solid ${TOPPS_YELLOW}`,
          // background: NAVY_MID,
          padding: isMobile ? "11px 16px" : "13px 26px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1.0fr 0.7fr",
          gap: isMobile ? 10 : 22,
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          // borderBottom: "1px solid rgba(0,0,0,0.28)",
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
          // backgroundImage: RULED,
          padding: isMobile ? "16px 16px" : "18px 26px",
        }}
      >
        {/* Two-column: Highlights | Coursework */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr",
            gap: isMobile ? 14 : 0,
            // marginBottom: 12,
          }}
        >
          <div
            style={{
              paddingRight: isMobile ? 0 : 26,
              borderRight: isMobile
                ? "none"
                : `1.5px solid rgba(24,32,64,0.18)`,
            }}
          >
            <SectionHeader>HIGHLIGHTS</SectionHeader>
            <BulletList items={entry.highlights ?? ["Highlight placeholder"]} isMobile={isMobile} />
            {entry.footnotes?.length ? (
              <div
                style={{
                  marginTop: 10,
                  fontSize: isMobile ? 10 : 11,
                  lineHeight: 1.4,
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
          <div style={{ paddingLeft: isMobile ? 0 : 26 }}>
            <SectionHeader>RELEVANT COURSEWORK</SectionHeader>
            <BulletList
              items={entry.coursework ?? ["Coursework placeholder"]}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "CREAM",
          borderTop: `1.5px solid rgba(24,32,64,0.15)`,
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
