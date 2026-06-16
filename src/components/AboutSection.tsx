import { ABOUT_INFO } from "../data/portfolio";

interface AboutSectionProps {
  isMobile?: boolean;
}

export function AboutSection({ isMobile = false }: AboutSectionProps) {
  const { name, bio, imageUrl, facts } = ABOUT_INFO;

  return (
    <div style={{ width: "100%" }}>
      {/* Photo + identity */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 24 : 40,
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        {/* Photos — stacked column */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {([imageUrl, "/images/about-baby.jpg"] as (string | undefined)[]).map(
            (src, idx) => (
              <div
                key={idx}
                style={{
                  width: isMobile ? 110 : 148,
                  height: isMobile ? 138 : 180,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 4,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {src ? (
                  <img
                    src={src}
                    alt={name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      ...(idx === 0
                        ? { transform: "scale(1.4)" }
                        : {
                            objectPosition: "65% 30%",
                            transform: "scale(2.6)",
                          }),
                    }}
                  />
                ) : (
                  <>
                    <svg
                      viewBox="0 0 100 130"
                      style={{ width: "52%", opacity: 0.07 }}
                      aria-hidden="true"
                    >
                      <ellipse cx="50" cy="28" rx="19" ry="21" fill="white" />
                      <rect x="44" y="47" width="12" height="9" fill="white" />
                      <path
                        d="M 6 130 L 12 82 Q 22 64 50 62 Q 78 64 88 82 L 94 130 Z"
                        fill="white"
                      />
                    </svg>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 8,
                        color: "#2e4035",
                        letterSpacing: "0.2em",
                        marginTop: 10,
                      }}
                    >
                      PHOTO
                    </span>
                  </>
                )}
              </div>
            ),
          )}
        </div>

        {/* Name + title + bio */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: isMobile ? 22 : 28,
              fontWeight: 700,
              color: "#f0ece2",
              letterSpacing: "0.01em",
              marginBottom: 7,
            }}
          >
            {name}
          </div>
          {/* <div
            style={{
              fontFamily: "monospace",
              fontSize: 13,
              color: "#4a6050",
              letterSpacing: "0.05em",
              marginBottom: 22,
            }}
          >
            {title}
          </div> */}
          <div
            style={{
              fontFamily: "monospace",
              fontSize: isMobile ? 13 : 14,
              color: "#c8c4b8",
              lineHeight: 1.75,
              whiteSpace: "pre-line",
            }}
          >
            {bio}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.06)",
          marginBottom: 20,
        }}
      />

      {/* Quick facts */}
      <div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            color: "#638971",
            letterSpacing: "0.2em",
            marginBottom: 16,
          }}
        >
          QUICK FACTS
        </div>
        {facts.map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: isMobile ? 16 : 28,
              padding: "13px 0",
              borderBottom:
                i < facts.length - 1
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "none",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                color: "#638971",
                minWidth: isMobile ? 80 : 96,
                flexShrink: 0,
                letterSpacing: "0.12em",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: isMobile ? 13 : 14,
                color: "#c8c4b8",
                lineHeight: 1.55,
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
