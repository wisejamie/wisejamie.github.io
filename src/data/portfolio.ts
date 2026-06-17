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
      display: "linkedin.com/in/jamie-wise-",
      href: "https://www.linkedin.com/in/jamie-wise-",
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

export interface ProjectLink {
  label: string;
  url: string;
  kind:
    | "github"
    | "demo"
    | "paper"
    | "devpost"
    | "website"
    | "publication"
    | "other";
}

export interface Publication {
  title: string;
  journal: string;
  authors: string;
  description: string;
  url: string;
}

export interface ExperienceRole {
  company: string;
  role: string;
  dates: string;
  location: string;
  bullets: string[];
  links?: ProjectLink[];
  publication?: Publication;
}

export const EXPERIENCE_ROLES: ExperienceRole[] = [
  {
    company: "McGill University – Department of Psychology",
    role: "Research Assistant / Full-Stack Developer",
    dates: "May 2024 – Aug. 2025",
    location: "Montreal, Quebec",
    bullets: [
      "Collaborated with Professor Thomas Shultz to investigate GPT-4's discourse comprehension capabilities, turning open-ended research questions into testable tasks with clear prompts, controls, and evaluation criteria.",
      "Co-authored a peer-reviewed paper in Royal Society Open Science by synthesizing related work, analyzing experimental results, and communicating technical findings clearly and rigorously for publication.",
      "Designed and implemented full-stack AI tutoring prototypes that used GPT-powered document parsing, section-aware explanations, guided questions, and interactive study workflows to support academic reading comprehension. (See the PAIT project in the Projects section for more details.)",
    ],
    publication: {
      title: "Text understanding in GPT-4 versus humans",
      journal: "Royal Society Open Science",
      authors: "Thomas R. Shultz, Jamie M. Wise, Ardavan Salehi Nobandegani",
      description:
        "Co-authored a study comparing GPT-4 and human performance on discourse comprehension tasks, examining inference, generalization, and text understanding.",
      url: "https://royalsocietypublishing.org/rsos/article/12/2/241313/92871/Text-understanding-in-GPT-4-versus-humansText",
    },
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
    links: [
      {
        label: "Check out the site I worked on!",
        url: "https://www.sue-app.com/",
        kind: "website",
      },
    ],
  },
];

export interface Project {
  name: string;
  subtitle?: string;
  stack: string[];
  bullets: string[];
  links?: ProjectLink[];
}

export const PROJECTS: Project[] = [
  {
    name: "Clinical Converter",
    subtitle: "HL7 v2 to FHIR R4 healthcare interoperability tool",
    stack: [
      "Python",
      "FastAPI",
      "Next.js",
      "Tailwind CSS",
      "OpenAI API",
      "CLI tooling",
    ],
    bullets: [
      "Built a full-stack healthcare interoperability tool that converts legacy HL7 v2 hospital EMR messages into structured FHIR R4 JSON Bundles and human-readable clinical summaries.",
      "Implemented a FastAPI backend to ingest, validate, and transform clinical messages end-to-end, mapping patient demographics, encounters, observations, related persons, and allergies into standardized FHIR resources.",
      "Added deterministic fact-based summaries, optional GPT-generated narrative summaries, synthetic HL7 generation, CLI tooling, automated tests, and a deployed Next.js web demo.",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/wisejamie/clinical-converter",
        kind: "github",
      },
      {
        label: "Live Demo",
        url: "https://clinical-converter-frontend.vercel.app/",
        kind: "demo",
      },
    ],
  },
  {
    name: "Flash",
    subtitle: "AI flashcard generator for lecture material",
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
      "Built a full-stack AI study app that converts lecture PDFs or pasted text into organized flashcard sets, summaries, and quiz material.",
      "Designed an LLM generation pipeline for concept extraction, flashcard creation, content filtering, and deduplication from PDFs or pasted text.",
      "Created an interactive frontend for managing study sets, editing cards, reviewing material, taking quizzes, tracking progress, and importing/exporting data.",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/wisejamie/flash",
        kind: "github",
      },
      {
        label: "Live Demo",
        url: "https://flash-ij2tis5aw-wisejamies-projects.vercel.app/",
        kind: "demo",
      },
    ],
  },
  {
    name: "PAIT (2025)",
    subtitle:
      "Personal AI Tutor for complex academic papers (while working with Professor Shultz at McGill)",
    stack: ["FastAPI", "React", "Vite", "Python", "OpenAI API"],
    bullets: [
      "Built a full-stack AI learning app that turns uploaded PDFs and text documents into interactive study experiences with section navigation, summaries, quizzes, and tutor-style Q&A.",
      "Developed a document-processing pipeline to identify paper structure and map AI-generated section anchors back to the original text using fuzzy matching. The fuzzy matching algorithm reduces LLM token usage by ~88% while preserving accuracy.",
      "Implemented interactive learning flows including text simplification, multiple-choice quiz sessions, and open-ended tutor-style comprehension checks.",
    ],
  },
  {
    name: "Contwext",
    subtitle: "McGill CodeJam 12 · Social/Community Wellness Award",
    stack: [
      "Hackathon",
      "JavaScript",
      "Chrome Extension",
      "Django",
      "Python",
      "Hugging Face",
    ],
    bullets: [
      "Won the Social/Community Wellness Award at McGill CodeJam 12 (with a $500 prize) for building a browser tool to combat misinformation online.",
      "Built a Chrome extension that scraped tweets from a user’s timeline and surfaced relevant news articles to add context to posts they interacted with.",
      "Created with two close friends during our first semester at McGill.",
    ],
    links: [
      {
        label: "View on Devpost",
        url: "https://devpost.com/software/contwext",
        kind: "devpost",
      },
    ],
  },
];

export interface TripEntry {
  id: string;
  location: string;
  tagline?: string;
  description: string;
  date?: string;
  tags?: string[];
  // Map pin position on a 1000×500 SVG viewBox (Plate Carrée projection)
  // x = (lon + 180) / 360 * 1000,  y = (90 − lat) / 180 * 500
  mapX: number;
  mapY: number;
  // Placeholder photo labels — swap strings for image URLs when ready
  photos?: string[];
}

export const TRIPS: TripEntry[] = [
  {
    id: "australia",
    location: "Australia",
    tagline:
      "Sydney · Great Ocean Road · Melbourne · Byron Bay · Great Barrier Reef",
    description: "Wow, it is hot down there.",
    date: "Jan – May 2025",
    tags: ["exchange", "ocean", "city"],
    mapX: 919,
    mapY: 344,
    photos: ["Bondi Beach", "Great Ocean Road", "Great Barrier Reef"],
  },
  {
    id: "newzealand",
    location: "New Zealand (South Island)",
    tagline: "Queenstown · Te Anau · Wanaka · Isthmus Peak · Milford Sound",
    description: "Hands down the best nature I've ever seen.",
    date: "Feb 2025",
    tags: ["road trip", "mountains", "nature"],
    mapX: 971,
    mapY: 372,
    photos: ["Milford Sound", "Isthmus Peak", "Wanaka"],
  },
  {
    id: "seasia",
    location: "Vietnam & Thailand",
    tagline: "Hanoi · Ninh Binh · Ha Giang · Chiang Mai · Koh Samui · Bangkok",
    description: "Living the dream in Southeast Asia.",
    date: "May 2025",
    tags: ["backpacking", "food", "history"],
    mapX: 783,
    mapY: 208,
    photos: ["Ha Giang Loop", "Chiang Mai", "Koh Samui"],
  },
  {
    id: "banff",
    location: "Banff, Alberta",
    tagline: "With friends",
    description: "Fooling around in the Canadian Rockies.",
    date: "Aug 2025",
    tags: ["mountains", "lakes", "hiking"],
    mapX: 181,
    mapY: 108,
    photos: ["Lake Louise", "Moraine Lake", "Icefields Pkwy"],
  },
  {
    id: "montreal",
    location: "Montreal / Ski Trips",
    tagline: "Last semester",
    description: "Got pretty alright at skiing.",
    date: "Jan – Feb 2026",
    tags: ["city", "university", "skiing"],
    mapX: 296,
    mapY: 122,
    photos: ["Old Montreal", "McGill Campus", "Mont Tremblant"],
  },
  {
    id: "california",
    location: "California Road Trip",
    tagline: "Santa Cruz · Big Sur · Sequoia · Yosemite",
    description:
      "Driving, rucking, and surfing through California coast, national parks, and backcountry.",
    date: "May 2026",
    tags: ["road trip", "camping", "surfing"],
    mapX: 168,
    mapY: 147,
    photos: ["Big Sur Coast", "Yosemite Valley", "Sequoia Grove"],
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
      "Had an absolute ripper of a time down undah (really great time in Australia)!",
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
