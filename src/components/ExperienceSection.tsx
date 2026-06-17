import { EXPERIENCE_ROLES } from "../data/portfolio";
import type { Publication } from "../data/portfolio";
import { LinkChips } from "./LinkChips";

interface ExperienceSectionProps {
  isMobile?: boolean;
}

export function ExperienceSection({ isMobile = false }: ExperienceSectionProps) {
  return (
    <div style={{ width: "100%" }}>
      {EXPERIENCE_ROLES.map((role, i) => (
        <div key={role.company}>
          {/* Company + dates */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 5,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: isMobile ? 15 : 18,
                fontWeight: 700,
                color: "#f0ece2",
                letterSpacing: "0.01em",
              }}
            >
              {role.company}
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                color: "#638971",
                letterSpacing: "0.07em",
                flexShrink: 0,
              }}
            >
              {role.dates}
            </div>
          </div>

          {/* Role + location */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                color: "#4a6050",
                letterSpacing: "0.03em",
              }}
            >
              {role.role}
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                color: "#4a6050",
                letterSpacing: "0.04em",
                flexShrink: 0,
              }}
            >
              {role.location}
            </div>
          </div>

          {/* Bullets */}
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {role.bullets.map((bullet, j) => (
              <li
                key={j}
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 10,
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    color: "#638971",
                    flexShrink: 0,
                    fontFamily: "monospace",
                    fontSize: 14,
                    lineHeight: 1.65,
                    userSelect: "none",
                  }}
                >
                  •
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: isMobile ? 13 : 14,
                    color: "#c8c4b8",
                    lineHeight: 1.65,
                  }}
                >
                  {bullet}
                </span>
              </li>
            ))}
          </ul>

          {/* Publication callout */}
          {role.publication && (
            <PublicationCard pub={role.publication} isMobile={isMobile} />
          )}

          {/* Link chips */}
          {role.links && role.links.length > 0 && (
            <LinkChips links={role.links} style={{ marginTop: 16 }} />
          )}

          {i < EXPERIENCE_ROLES.length - 1 && (
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.06)",
                margin: "28px 0",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PublicationCard({
  pub,
  isMobile,
}: {
  pub: Publication;
  isMobile: boolean;
}) {
  return (
    <div
      style={{
        marginTop: 20,
        padding: isMobile ? "14px 16px" : "16px 20px",
        background: "rgba(16, 28, 48, 0.55)",
        border: "1px solid rgba(122,159,212,0.2)",
        borderTop: "2px solid rgba(122,159,212,0.48)",
        borderRadius: 4,
      }}
    >
      {/* Label row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 9,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 8,
            color: "rgba(122,159,212,0.65)",
            letterSpacing: "0.22em",
          }}
        >
          PUBLISHED RESEARCH
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 8,
            color: "rgba(122,159,212,0.35)",
            letterSpacing: "0.1em",
          }}
        >
          · {pub.journal.toUpperCase()}
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "monospace",
          fontSize: isMobile ? 13 : 15,
          fontWeight: 700,
          color: "#dde8f4",
          letterSpacing: "0.01em",
          marginBottom: 5,
          lineHeight: 1.3,
        }}
      >
        {pub.title}
      </div>

      {/* Authors */}
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          color: "rgba(122,159,212,0.5)",
          letterSpacing: "0.04em",
          marginBottom: 10,
        }}
      >
        {pub.authors}
      </div>

      {/* Description */}
      <div
        style={{
          fontFamily: "monospace",
          fontSize: isMobile ? 12 : 13,
          color: "#b4bccc",
          lineHeight: 1.7,
          marginBottom: 14,
        }}
      >
        {pub.description}
      </div>

      {/* Link */}
      <LinkChips
        links={[{ label: "Read the paper", url: pub.url, kind: "paper" }]}
      />
    </div>
  );
}
