import { PROJECTS } from "../data/portfolio";
import { LinkChips } from "./LinkChips";

const GOLD = "#d4a030";

// Matches a leading "Label: " prefix, e.g. "Approach:", "Next Steps:", "Product and Engineering:"
const LABEL_PATTERN = /^([A-Z][A-Za-z]*(?:\s(?:and\s)?[A-Z][A-Za-z]*)*):\s(.+)$/s;

// Marks standout metrics to highlight, e.g. "**58.5%**" — wrap only the numbers that should pop
const HIGHLIGHT_PATTERN = /\*\*(.+?)\*\*/g;

function splitBulletLabel(bullet: string): { label: string | null; rest: string } {
  const match = bullet.match(LABEL_PATTERN);
  return match ? { label: match[1], rest: match[2] } : { label: null, rest: bullet };
}

function renderBulletText(text: string) {
  return text.split(HIGHLIGHT_PATTERN).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: GOLD, fontWeight: 700 }}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

interface ProjectsSectionProps {
  isMobile?: boolean;
}

export function ProjectsSection({ isMobile = false }: ProjectsSectionProps) {
  return (
    <div style={{ width: "100%" }}>
      {PROJECTS.map((project, i) => (
        <div key={project.name}>
          {/* Project name */}
          <div
            style={{
              fontFamily: "monospace",
              fontSize: isMobile ? 15 : 18,
              fontWeight: 700,
              color: "#f0ece2",
              letterSpacing: "0.01em",
              marginBottom: project.subtitle ? 4 : 12,
            }}
          >
            {project.name}
          </div>

          {/* Optional subtitle / context */}
          {project.subtitle && (
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                color: "#4a6050",
                letterSpacing: "0.07em",
                marginBottom: 12,
              }}
            >
              {project.subtitle}
            </div>
          )}

          {/* Tech stack chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 7,
              marginBottom: 18,
            }}
          >
            {project.stack.map((tech) => (
              <span
                key={tech}
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: "#638971",
                  border: "1px solid rgba(99,137,113,0.3)",
                  borderRadius: 3,
                  padding: "3px 8px",
                  letterSpacing: "0.08em",
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Bullets */}
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {project.bullets.map((bullet, j) => {
              const { label, rest } = splitBulletLabel(bullet);
              return (
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
                    {label && (
                      <span
                        style={{
                          color: GOLD,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          fontSize: isMobile ? 11 : 12,
                        }}
                      >
                        {label}:{" "}
                      </span>
                    )}
                    {renderBulletText(rest)}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Link chips */}
          {project.links && project.links.length > 0 && (
            <LinkChips links={project.links} style={{ marginTop: 14 }} />
          )}

          {i < PROJECTS.length - 1 && (
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
