// ---------------------------------------------------------------------------
// Coordinate convention (catcher's perspective, looking toward mound):
//   x  positive → catcher's RIGHT  = first-base side  = RHP glove side
//   x  negative → catcher's LEFT   = third-base side   = RHP arm side
//   y  positive → toward mound (release ≈ 54–56 ft, plate = 0)
//   z  positive → up (release ≈ 5.6–6.0 ft above ground)
//
// Release points below are approximate right-handed pitcher values.
// A RHP releases from their arm side = catcher's LEFT = negative x.
// All six pitches share a similar release window to enable pitch tunneling.
//
// spinAxisDeg: direction of Magnus force in the XZ plane.
//   0°   → force UP   (rise / backspin carry)
//   90°  → force RIGHT (glove-side / cutter cut direction for RHP)
//   180° → force DOWN  (topspin drop)
//   270° → force LEFT  (arm-side run / sinker direction for RHP)
// ---------------------------------------------------------------------------

export type SectionId =
  | "about"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "contact";

export interface PitchType {
  id: string;
  name: string;
  section: SectionId;
  velocityMph: number;
  spinRpm: number;
  spinAxisDeg: number; // see convention above
  release: { x: number; y: number; z: number };
  target: { x: number; z: number }; // default plate target (y=0)
  // Authored scouting movement in inches. Live throws replace this with
  // movement measured from the simulated path vs a spinless reference.
  movement: { horizontalInches: number; verticalInches: number };
  colorLabel: string;
}

// Tight release clustering (all within ≈0.2 ft of each other) so early pitch
// paths overlap and tunneling is visible before Magnus forces separate them.
// Variation reflects real grip/arm-slot differences, not random noise.

export const PITCHES: PitchType[] = [
  {
    id: "four-seam",
    name: "Four-Seam Fastball",
    section: "about",
    velocityMph: 94,
    spinRpm: 2350,
    spinAxisDeg: 340, // mostly rise (+z), slight arm-side tilt (-x)
    release: { x: -2.1, y: 55.0, z: 5.9 },
    target: { x: 0.2, z: 2.8 },
    movement: { horizontalInches: -4, verticalInches: 14 },
    colorLabel: "#e5e0d5",
  },
  {
    id: "changeup",
    name: "Changeup",
    section: "education",
    velocityMph: 83,
    spinRpm: 1650,
    spinAxisDeg: 270, // arm-side run, minimal rise (deceives by looking like fastball)
    release: { x: -2.1, y: 55.0, z: 5.8 }, // nearly identical to fastball
    target: { x: 0.1, z: 2.3 },
    movement: { horizontalInches: -9, verticalInches: 4 },
    colorLabel: "#7ec8e3",
  },
  {
    id: "slider",
    name: "Slider",
    section: "experience",
    velocityMph: 86,
    spinRpm: 2500,
    spinAxisDeg: 115, // glove-side break (+x) + downward (-z)
    release: { x: -2.0, y: 54.5, z: 5.7 },
    target: { x: 0.5, z: 2.3 },
    movement: { horizontalInches: 4, verticalInches: -2 },
    colorLabel: "#f5a623",
  },
  {
    id: "curveball",
    name: "Curveball",
    section: "projects",
    velocityMph: 78,
    spinRpm: 2700,
    spinAxisDeg: 185, // mostly downward (-z), very slight arm-side tilt
    release: { x: -2.0, y: 54.5, z: 6.0 }, // slightly higher arm slot
    target: { x: 0.0, z: 1.9 },
    movement: { horizontalInches: -3, verticalInches: -15 },
    colorLabel: "#b06aff",
  },
  {
    id: "sinker",
    name: "Sinker",
    section: "skills",
    velocityMph: 91,
    spinRpm: 2100,
    spinAxisDeg: 235, // arm-side run (-x) + downward bias (-z)
    release: { x: -2.1, y: 55.0, z: 5.8 },
    target: { x: -0.4, z: 2.1 },
    movement: { horizontalInches: -10, verticalInches: 6 },
    colorLabel: "#50c878",
  },
  {
    id: "cutter",
    name: "Cutter",
    section: "contact",
    velocityMph: 89,
    spinRpm: 2400,
    spinAxisDeg: 25, // mostly rise (+z), slight glove-side cut (+x)
    release: { x: -2.0, y: 54.5, z: 5.8 },
    target: { x: 0.3, z: 2.6 },
    movement: { horizontalInches: 3, verticalInches: 9 },
    colorLabel: "#ff6b6b",
  },
];

export const PITCH_FOR_SECTION: Record<SectionId, PitchType> = PITCHES.reduce<
  Record<SectionId, PitchType>
>(
  (acc, p) => {
    acc[p.section] = p;
    return acc;
  },
  {} as Record<SectionId, PitchType>,
);
