import type { ContactInfo } from "../data/portfolio";

interface ContactCardProps {
  info: ContactInfo;
  isMobile?: boolean;
}

export function ContactCard({ info, isMobile = false }: ContactCardProps) {
  return (
    <div style={{ width: "100%" }}>
      {/* Headline */}
      <div
        style={{
          fontFamily: "monospace",
          fontSize: isMobile ? 22 : 28,
          fontWeight: 700,
          color: "#f0ece2",
          letterSpacing: "0.03em",
          marginBottom: 10,
        }}
      >
        {info.headline}
      </div>
      {/* <div
        style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: "#4a6050",
          letterSpacing: "0.04em",
          lineHeight: 1.6,
          marginBottom: 36,
          maxWidth: 420,
        }}
      >
        {info.subline}
      </div> */}

      {/* Contact rows */}
      <div style={{ marginBottom: 36 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 8,
            color: "#638971",
            letterSpacing: "0.2em",
            marginBottom: 16,
          }}
        >
          CHANNELS
        </div>
        {info.links.map(({ label, display, href, external }, i) => (
          <div key={label}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: isMobile ? 12 : 24,
                padding: "13px 0",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 8,
                  color: "#638971",
                  letterSpacing: "0.18em",
                  minWidth: isMobile ? 68 : 80,
                  flexShrink: 0,
                }}
              >
                {label}
              </span>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                aria-label={`${label}: ${display}`}
                style={{
                  fontFamily: "monospace",
                  fontSize: isMobile ? 13 : 15,
                  color: "#c8c4b8",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#f0ece2")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#c8c4b8")
                }
              >
                {display}
                {external && (
                  <span
                    style={{
                      fontSize: 9,
                      marginLeft: 5,
                      opacity: 0.4,
                      verticalAlign: "super",
                    }}
                  >
                    ↗
                  </span>
                )}
              </a>
            </div>
            {i < info.links.length - 1 && (
              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.06)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Resume */}
      <div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 8,
            color: "#638971",
            letterSpacing: "0.2em",
            marginBottom: 16,
          }}
        >
          RESUME
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href={info.resumePath}
            download="Jamie_Wise_CV.pdf"
            aria-label="Download resume PDF"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#f5a623",
              color: "#0e1a12",
              borderRadius: 4,
              fontFamily: "monospace",
              fontSize: isMobile ? 11 : 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              padding: isMobile ? "9px 16px" : "10px 20px",
              textDecoration: "none",
              transition: "filter 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.filter =
                "brightness(1.1)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.filter = "none")
            }
          >
            ↓ DOWNLOAD
          </a>
          <a
            href={info.resumePath}
            target="_blank"
            rel="noreferrer"
            aria-label="Open resume in new tab"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "none",
              color: "#c8c4b8",
              borderRadius: 4,
              fontFamily: "monospace",
              fontSize: isMobile ? 10 : 11,
              letterSpacing: "0.1em",
              padding: isMobile ? "9px 12px" : "10px 14px",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)",
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#f0ece2";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#c8c4b8";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(255,255,255,0.12)";
            }}
          >
            OPEN ↗
          </a>
        </div>
      </div>
    </div>
  );
}
