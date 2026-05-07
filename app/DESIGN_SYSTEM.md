# LearnViz Pastel Design System (EdTech, Ages 10–17)

## 1) Brand Intent
This system is designed for a modern learning startup:
- Creative and inspiring without feeling childish
- Calm, safe, and structured for classroom and home use
- Modern SaaS quality with soft depth, clear hierarchy, and accessible interactions

## 2) Core Palette (Only Allowed Brand Colors)
- Soft Yellow: `#FFF58A`
- Light Pink: `#FFBBE1`
- Purple Accent: `#DD7BDF`
- Soft Blue: `#B3BFFF`

## 3) Semantic Color Roles
### Primary action color
- `#DD7BDF` (purple)
- Use for: main CTA buttons, active tabs/states, important highlights

### Secondary structural color
- `#B3BFFF` (blue)
- Use for: page backgrounds, section wrappers, calm structure

### Creative soft color
- `#FFBBE1` (pink)
- Use for: cards, secondary containers, supportive content areas

### Achievement/reinforcement color
- `#FFF58A` (yellow)
- Use for: achievement badges, progress reinforcement, positive feedback

## 4) State System
### Hover and active
- Hover = same base color with reduced opacity or darker blend via opacity
- Active = purple emphasis (`#DD7BDF`) with visible ring/border reinforcement

### Disabled
- Disabled surfaces use blue at low opacity (calm and neutral)
- Disabled text remains neutral dark-gray for readability

### Focus (Accessibility)
- Focus ring uses purple alpha glow (`#DD7BDF` with transparency)
- Keep minimum 2px visible focus treatment on keyboard navigation

### Error and success (derived from palette tone)
- Success: yellow-led surface (`#FFF58A`) with purple icon/accent for legibility
- Error: pink-led surface (`#FFBBE1`) with purple border/icon for clear state signaling

## 5) Layout Guidance
### Page background
- Main app: very light blue treatment (`#B3BFFF` low opacity)

### Section backgrounds
- Learning blocks: pink or blue low-opacity sections
- Motivational/achievement sections: yellow low-opacity surface

### Card system
- Default cards: pink-tinted soft surface
- Highlight cards: blue→yellow or pink→blue subtle gradients
- Card border: blue by default, purple on active/selected

### Border and depth
- Borders are always pastel-blue or pastel-purple variants
- Shadows are soft and low contrast (SaaS-like, not playful/chaotic)

## 6) Component Guidance
### Navbar
- Calm blue translucent surface
- Purple used only for active/highlighted navigation actions

### Hero
- Blue/yellow soft gradient background
- Purple CTA button as the strongest visual action

### Dashboard
- Pink/blue cards with clear spacing and hierarchy
- Yellow highlights for progress/achievement areas

### Diagram cards
- Keep structure calm with blue/pink surfaces
- Use purple for selected/active diagram state

### Buttons
- Primary: purple
- Secondary: blue
- Outline/Ghost: purple border/text with pink hover wash
- Accent (reinforcement): yellow

### Inputs
- Soft blue background tint
- Purple focus ring and border on interaction
- Pink-toned error treatment

### Modal windows
- Pink or blue soft panel over calm overlay
- Primary modal actions remain purple

### Sidebar (when used)
- Blue structural background
- Active item = purple emphasis with clear contrast

### Achievement badges
- Yellow base with subtle purple icon/text accents

## 7) Spacing, Radius, and Hierarchy
- Use medium-large radius (`rounded-xl` preferred)
- Keep soft shadows and generous whitespace
- Preserve clear content hierarchy:
  - Page title
  - Section title
  - Supporting text
  - Primary action

## 8) Accessibility Notes (WCAG AA intent)
- Keep text primarily in neutral dark tones for readability
- Use pastel colors as surfaces/highlights, not as low-contrast text blocks
- Ensure focus state is always visible and consistent

## 9) UX Rationale
- Blue creates emotional safety and structure for students
- Pink adds creativity and warmth without turning playful/childish
- Purple provides clear intent for action and progress
- Yellow reinforces achievement and confidence in learning workflows
- The combined system supports motivation, clarity, and trust for ages 10–17
