# Project concept: **Pitch Lab Portfolio**

This is an interactive portfolio where the user navigates by choosing pitches. Each pitch corresponds to a portfolio section. When selected, the pitch is physically simulated from release point to home plate. The ball moves with speed, spin, gravity, drag, and pitch-specific break. When it reaches the strike zone, it freezes, the camera locks onto it, and the selected portfolio section reveals around the ball.

The site should feel like an immersive baseball technology demo first, and a portfolio second.

## What we have as the design direction right now

The current design should move toward:

**A dark, cinematic indoor baseball lab.**

Not a flat website. Not a normal portfolio. The core scene is a pitcher-to-plate tunnel inside a modern ballpark/lab environment.

Visual ingredients:

- dark green / navy background
- warm gold highlights
- off-white baseball seams and card surfaces
- subtle Toronto-inspired indoor stadium feel
- retractable-roof-like ceiling structure
- distant turf, plate, strike zone, netting, and stadium lighting
- clean technical HUD overlays
- pitch metrics displayed like a baseball analytics interface
- portfolio content revealed as polished cards after the pitch arrives

The homepage should feel like:

> “Choose a pitch. Watch it move. Unlock a section.”

## Core user flow

1. User lands on the pitch lab.
2. A strike zone sits near the foreground.
3. A release point / mound area appears in the distance.
4. User selects a pitch from a pitch menu.
5. The ball is thrown.
6. The ball travels through 3D-ish space with a visible movement trail.
7. Metrics animate live: speed, spin, horizontal break, vertical break.
8. Ball arrives at the plate and freezes.
9. The ball enlarges slightly or rotates into a UI anchor.
10. The portfolio section appears beside/behind the ball.

## Section mapping

| Pitch                | Portfolio Section | Feel                             |
| -------------------- | ----------------- | -------------------------------- |
| Four-Seam Fastball   | About             | direct, clean intro              |
| Changeup             | Education         | development, timing, growth      |
| Slider               | Experience        | movement, adaptability           |
| Curveball or Sweeper | Projects          | biggest visual movement/showcase |
| Sinker               | Skills            | technical depth                  |
| Cutter               | Contact / Resume  | sharp final action               |

The pitch menu should show each pitch as a compact card:

- pitch name
- section name
- velocity
- spin rate
- movement preview
- small pitch path icon

## Physics simulation plan

Use a real coordinate system.

- Units: feet, seconds
- Plate distance: pitching rubber to home plate is **60 ft 6 in**
- Base field facts are less central now, but baseball geometry should stay accurate where used. MLB describes the infield as a 90-foot square. ([MLB.com][1])
- Rogers Centre inspiration can use the real ballpark dimensions as environmental reference: 328 ft to left, 400 ft to center, 328 ft to right, plus varied wall distances in the alleys. ([MLB.com][2])

Coordinate model:

```text
x = horizontal movement, catcher-left/right
y = distance from pitcher to plate
z = height above ground

release point:
x = pitch-specific horizontal release
y = 60.5
z = pitch-specific release height

home plate:
y = 0
```

The simulation should step forward over time and update:

```text
position += velocity * dt
velocity += acceleration * dt
```

Acceleration should include:

- gravity
- drag
- Magnus-style spin movement
- optional pitch-specific tuning constants

It does not need to be a perfect MLB physics engine. It needs to be credible, stable, and visually satisfying.

## Pitch data model

Each pitch should be data-driven.

Example shape:

```ts
type PitchType = {
  id: string;
  name: string;
  section: SectionId;
  velocityMph: number;
  spinRpm: number;
  spinAxisDeg: number;
  release: {
    x: number;
    y: number;
    z: number;
  };
  target: {
    x: number;
    z: number;
  };
  movement: {
    horizontalInches: number;
    verticalInches: number;
  };
  colorLabel?: string;
};
```

Start with believable placeholder values. They can be tuned visually later.

## Visual scene plan

The main viewport should contain:

### 1. Pitch tunnel

A perspective scene from behind or near the catcher, looking toward the mound.

Elements:

- strike zone in foreground
- home plate
- dirt/turf lane
- release point marker
- subtle stadium lights
- roof truss lines
- blurred outfield/lab background
- optional Toronto skyline silhouette/CN Tower shape beyond the far end

### 2. Ball

The baseball should be a real visual object, not just a dot.

It should have:

- circular body
- red seams
- spin/rotation animation
- scale change as it approaches the plate
- shadow or glow
- freeze state at arrival

### 3. Trail

The pitch path should remain visible.

Trail behavior:

- thin glowing curve
- more intense near the current ball position
- color or style can vary by pitch
- show ghost balls or fading dots along the path
- optionally display horizontal/vertical break labels near the final location

### 4. Strike zone

The strike zone is the destination UI.

At arrival:

- ball stops inside or near the zone
- zone lines glow
- pitch metrics lock in
- section panel appears

### 5. Metrics HUD

Live display while the pitch travels:

- pitch type
- section
- speed
- spin rate
- horizontal break
- vertical break
- time to plate
- result label, e.g. “Section Unlocked”

## Portfolio reveal

Do not put long content on the ball.

Use the ball as the trigger/anchor.

At freeze:

- the ball becomes the section badge
- a glass/card panel opens beside the strike zone
- section content appears in baseball-card-style cards

Content can stay placeholder for now.

Section cards:

- About: one “Player Profile” card
- Education: 2–3 program/school cards
- Experience: 2–3 role cards
- Projects: 4–6 project cards
- Skills: stat/scouting report bars
- Contact: clean contact card

## Component plan

Suggested structure:

```text
App.tsx
data/pitches.ts
data/sections.ts

components/
  PitchLab.tsx
  PitchPicker.tsx
  PitchSimulator.tsx
  Baseball.tsx
  PitchTrail.tsx
  StrikeZone.tsx
  MetricsHUD.tsx
  SectionReveal.tsx
  PortfolioCard.tsx
  SceneBackground.tsx

lib/
  physics.ts
  coordinates.ts
  animation.ts
```

## Build phases

### Phase 1: Pitch simulator only

Goal: prove the core interaction.

- pitch picker
- ball movement
- strike zone
- trail
- freeze on arrival
- metrics HUD
- no serious portfolio content yet

### Phase 2: Make it cinematic

Goal: make the world feel premium.

- better lighting
- perspective tunnel
- ball scale/depth
- spin animation
- roof/stadium atmosphere
- camera push-in
- arrival freeze moment

### Phase 3: Add portfolio panels

Goal: turn it into a real site.

- section reveal
- placeholder cards
- responsive layout
- keyboard navigation
- reduced motion support

### Phase 4: Tune and polish

Goal: make it feel intentional.

- tune pitch movement
- improve pitch cards
- add soundless impact moments
- optimize mobile
- test GitHub Pages build

## Product rule

The app should always prioritize this:

> The pitch simulation is the main interaction. The portfolio is revealed through the pitch.

That means no generic landing page, no huge static hero, no normal portfolio grid as the first impression. The user should immediately understand that they are inside a pitch lab and that choosing pitches controls the experience.
