// Portfolio content data — update placeholder values when ready.

export interface EducationEntry {
  name: string;
  school: string;
  badgeSubtext: string;
  degree: string;
  dates: string;
  location?: string;
  imageUrl?: string;
  // Back of card
  program?: string;
  gpa?: string;
  highlights?: string[];
  footnotes?: string[];
  coursework?: string[];
}

export const EDUCATION_ENTRIES: EducationEntry[] = [
  {
    name: "Jamie Wise",
    school: "McGill University",
    badgeSubtext: "University",
    degree: "B.A. Computer Science",
    dates: "Sept. 2022 – May 2026",
    location: "Montreal, QC",
    imageUrl: "/images/mcgill-photo.jpg",

    program: "Bachelor of Arts, Computer Science\nMinor in Cognitive Science",
    gpa: "3.79 / 4.00",

    highlights: [
      "Graduated with Distinction.",
      "Social / Community Wellness Award at McGill CodeJam12's hackathon.",
      "Exchange semester at University of New South Wales (Sydney, Australia) in Winter 2025.",
      "2x McGill Intramural Champion (dodgeball '24*, flag football '25).",
      "Ski-ed with the McGill Ski Club seven times in my last semester.",
    ],
    footnotes: ["* denotes captain of championship team."],

    coursework: [
      "Algorithms & Data Structures",
      "Software Systems",
      "Programming Languages",
      "Algorithm Design",
      "Applied Machine Learning",
      "Reinforcement Learning",
      "Computational Biology",
      "Network Science",
    ],
  },
];
