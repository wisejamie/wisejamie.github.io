import { EXPERIENCE_ROLES } from "../data/portfolio";

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
