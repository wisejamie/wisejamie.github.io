import type { SectionId } from "./pitches";

export interface SectionMeta {
  id: SectionId;
  label: string;
  tagline: string;
}

export const SECTION_ORDER: SectionId[] = [
  "about",
  "education",
  "experience",
  "projects",
  "trips",
  "contact",
];

export const SECTIONS: Record<SectionId, SectionMeta> = {
  about: { id: "about", label: "About", tagline: "Direct intro. No fluff." },
  education: {
    id: "education",
    label: "Education",
    tagline: "Development + timing.",
  },
  experience: {
    id: "experience",
    label: "Experience",
    tagline: "Movement + adaptability.",
  },
  projects: { id: "projects", label: "Projects", tagline: "Biggest showcase." },
  trips: { id: "trips", label: "Trips", tagline: "Places that shaped me." },
  contact: { id: "contact", label: "Contact", tagline: "Sharp final action." },
};
