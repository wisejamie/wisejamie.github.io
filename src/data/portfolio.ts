// Portfolio content data — update placeholder values when ready.

export interface ContactLink {
  label: string;
  display: string;
  href: string;
  external: boolean;
}

export interface ContactInfo {
  headline: string;
  subline: string;
  links: ContactLink[];
  resumePath: string;
}

export const CONTACT_INFO: ContactInfo = {
  headline: "LET'S CONNECT!",
  subline:
    "Reach out for opportunities, collaborations, or project conversations.",
  links: [
    {
      label: "EMAIL",
      display: "wisejamie2@gmail.com",
      href: "mailto:wisejamie2@gmail.com",
      external: false,
    },
    {
      label: "GITHUB",
      display: "github.com/wisejamie",
      href: "https://github.com/wisejamie",
      external: true,
    },
    {
      label: "LINKEDIN",
      display: "linkedin.com/in/jamie-wise-534122251",
      href: "https://www.linkedin.com/in/jamie-wise-534122251",
      external: true,
    },
  ],
  resumePath: "/resume/Jamie_Wise_CV.pdf",
};

export interface AboutInfo {
  name: string;
  title: string;
  bio: string;
  imageUrl?: string;
  facts: Array<{ label: string; value: string }>;
}

export const ABOUT_INFO: AboutInfo = {
  name: "Jamie Wise",
  title: "Software Engineer · Computer Science",
  bio: "Hey, I’m Jamie. I recently graduated from McGill University with a degree in Computer Science.\nYou can find more about my work and experience in the other sections, but the quick version is that I enjoy building things: web apps, models, tools, (campfires), and projects that help me solve difficult problems. I also really like talking through those problems with other people.\n\nTied with problem solving, my favourite activity in the world is throwing.\nBaseballs, frisbees, tennis balls, footballs, whatever. I love going outside and getting active, with my friends or my dogs.\n\nI'm always open to connecting with like-minded people, so feel free to reach out if you want to chat about anything tech-related, or not.",
  imageUrl: "/images/about.jpg",
  facts: [
    { label: "BASED IN", value: "Toronto, Ontario" },
    {
      label: "STATUS",
      value: "Just moved back home; looking for opportunities to work!",
    },
    {
      label: "INTERESTS",
      value: "Baseball (obviously) · Placeholder · Placeholder",
    },
    // { label: "FUN FACT", value: "Think of something good." },
  ],
};

export interface ExperienceRole {
  company: string;
  role: string;
  dates: string;
  location: string;
  bullets: string[];
}

export const EXPERIENCE_ROLES: ExperienceRole[] = [
  {
    company: "McGill University – Department of Psychology",
    role: "Research Assistant / Full-Stack Developer",
    dates: "May 2024 – Aug. 2025",
    location: "Montreal, Quebec",
    bullets: [
      "Collaborated with Professor Thomas Shultz to investigate GPT-4's discourse comprehension capabilities, turning open-ended research questions into testable tasks with clear prompts, controls, and evaluation criteria.",
      "Designed and implemented a full-stack AI-powered learning platform that leverages GPT's demonstrated capabilities to aid human comprehension, using Python (FastAPI), PostgreSQL, and React.",
      "Co-authored a peer-reviewed paper in Royal Society Open Science by synthesizing related work, analyzing experimental results, and communicating technical findings clearly and rigorously for publication.",
    ],
  },
  {
    company: "SueApp",
    role: "Frontend Developer Intern",
    dates: "May 2023 – June 2023",
    location: "Tel Aviv, Israel",
    bullets: [
      "Built a production-ready frontend in React and TypeScript integrated with a Node.js/Express backend for filing online legal claims, delivering a functional MVP within 5 weeks.",
      "Collaborated with a 4-person engineering team using Agile, Jira, and Git workflows to ensure smooth coordination and on-time delivery.",
      "Authored detailed onboarding documentation outlining Git practices, component structure, and local setup to streamline future developer onboarding.",
    ],
  },
];

export interface Project {
  name: string;
  stack: string[];
  bullets: string[];
}

export const PROJECTS: Project[] = [
  {
    name: "Clinical Converter",
    stack: [
      "Python",
      "FastAPI",
      "Next.js",
      "Tailwind CSS",
      "OpenAI API",
      "CLI tooling",
    ],
    bullets: [
      "Built a clinical data interoperability tool that converts legacy HL7 v2 hospital EMR messages into standardized FHIR R4 JSON outputs.",
      "Implemented a FastAPI (Python) backend to ingest, validate, and transform messages end-to-end; added a CLI and synthetic HL7 generators for testing.",
      "Developed an interactive Next.js web demo (via Vercel) with deterministic and LLM-generated summaries for quick human-readable views of the converted records.",
    ],
  },
  {
    name: "Flash (AI Flashcard Generator)",
    stack: [
      "Python",
      "JavaScript",
      "React",
      "Vite",
      "FastAPI",
      "Tailwind CSS",
      "OpenAI API",
    ],
    bullets: [
      "Built a flashcard generator that converts unstructured lecture text and PDFs into structured flashcards and summaries.",
      "Implemented a FastAPI service integrating the OpenAI API with custom prompting and an iterative concept-enumeration pipeline to extract key ideas while filtering noise.",
      "Designed a fuzzy alignment algorithm to match generated content back to the source text, reducing LLM token usage by ~88% while preserving accuracy, improving scalability and cost.",
    ],
  },
];

export interface TripEntry {
  location: string;
  tagline?: string;
  description: string;
}

export const TRIPS: TripEntry[] = [
  {
    location: "Sydney, Australia",
    tagline: "Exchange semester at UNSW · Jan – May 2025",
    description:
      "Surf, hikes, friends, and probably the happiest I've ever been.",
  },
  {
    location: "New Zealand South Island",
    tagline: "Road trip",
    description:
      "Mountains, road trips, and some of the best nature I've seen.",
  },
  {
    location: "Vietnam & Thailand",
    tagline: "Backpacking",
    description:
      "Backpacking, food, history, and a lot of figuring it out as I went.",
  },
  {
    location: "Banff, Alberta",
    tagline: "With friends",
    description: "[Placeholder — add a line or two about this trip.]",
  },
  {
    location: "Montreal / McGill Ski Club",
    tagline: "Last semester",
    description: "Skiing at McGill this last semester.",
  },
  {
    location: "California Road Trip",
    tagline: "Santa Cruz · Big Sur · Sequoia · Yosemite",
    description: "With friends. Camping, hiking, surfing.",
  },
];

export interface EducationEntry {
  name: string;
  school: string;
  badgeSubtext: string;
  degree: string;
  dates: string;
  location?: string;
  imageUrl?: string;
  cardStyle?: "topps1987" | "topps1963";
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
    cardStyle: "topps1987",
    badgeSubtext: "University",
    degree: "B.A. Computer Science",
    dates: "Sept. 2022 – May 2026",
    location: "Montreal, Quebec",
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
  {
    // ── UNSW Exchange entry — edit the [Replace] placeholders below ──
    name: "Jamie Wise",
    school: "Univ. New South Wales",
    badgeSubtext: "Exchange",
    degree: "CS · Exchange",
    dates: "Jan. – May 2025",
    location: "Sydney, Australia",
    imageUrl: "/images/unsw-photo.jpg",
    cardStyle: "topps1963",

    program: "Computer Science\nExchange Semester",

    highlights: [
      "Studied abroad for a semester at UNSW in Sydney, Australia.",
      "Completed courses in Artificial Intelligence and Web Frontend Development with high distinction.",
      "Traveled to six different countries: Australia, New Zealand, Indonesia, Singapore, Vietnam, and Thailand.",
      "Had a wicked pissah (really great) time down undah (in Australia)!",
    ],
    coursework: [
      "Artificial Intelligence",
      "Web Frontend Development",
      "How to shred (surf).",
      "How to trek (travel).",
      "Picked up a bit of Aussie lingo.",
    ],
  },
];
