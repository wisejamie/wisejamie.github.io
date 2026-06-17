import { useState } from "react";
import type { ProjectLink } from "../data/portfolio";

// ── Per-kind visual config ────────────────────────────────────────────────────
const KIND_STYLE: Record<
  ProjectLink["kind"],
  { color: string; border: string; hoverBorder: string }
> = {
  github:      { color: "#8a9e90", border: "rgba(138,158,144,0.28)", hoverBorder: "rgba(138,158,144,0.65)" },
  demo:        { color: "#d4a030", border: "rgba(212,160,48,0.28)",  hoverBorder: "rgba(212,160,48,0.65)"  },
  paper:       { color: "#7a9fd4", border: "rgba(122,159,212,0.28)", hoverBorder: "rgba(122,159,212,0.65)" },
  devpost:     { color: "#c8a868", border: "rgba(200,168,104,0.28)", hoverBorder: "rgba(200,168,104,0.65)" },
  website:     { color: "#8a9e90", border: "rgba(138,158,144,0.28)", hoverBorder: "rgba(138,158,144,0.65)" },
  publication: { color: "#7a9fd4", border: "rgba(122,159,212,0.28)", hoverBorder: "rgba(122,159,212,0.65)" },
  other:       { color: "#8a9e90", border: "rgba(138,158,144,0.28)", hoverBorder: "rgba(138,158,144,0.65)" },
};

function Chip({ link }: { link: ProjectLink }) {
  const [hovered, setHovered] = useState(false);
  const s = KIND_STYLE[link.kind];
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "monospace",
        fontSize: 10,
        letterSpacing: "0.08em",
        color: hovered ? "#f0ece2" : s.color,
        background: hovered ? "rgba(255,255,255,0.04)" : "transparent",
        border: `1px solid ${hovered ? s.hoverBorder : s.border}`,
        borderRadius: 3,
        padding: "4px 10px",
        textDecoration: "none",
        transition: "color 0.14s, border-color 0.14s, background 0.14s",
        whiteSpace: "nowrap",
      }}
    >
      {link.label}
      <span style={{ opacity: 0.6, fontSize: 9 }}>↗</span>
    </a>
  );
}

interface LinkChipsProps {
  links: ProjectLink[];
  style?: React.CSSProperties;
}

export function LinkChips({ links, style }: LinkChipsProps) {
  if (!links.length) return null;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 7,
        ...style,
      }}
    >
      {links.map((link) => (
        <Chip key={link.url} link={link} />
      ))}
    </div>
  );
}
