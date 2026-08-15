# WISTFY — Interactive Virtual Portfolio

## ROLE

You are a senior creative developer, UI/UX designer, motion designer, and graphics programmer.

Your task is to design and implement a highly immersive personal portfolio website for **WISTFY**.

The portfolio should be inspired by the atmosphere, visual language, and virtual-computer aesthetic of **Code Lyoko**, especially:

* Virtual worlds
* Supercomputer interfaces
* HUD systems
* Digital maps
* System terminals
* Scanning effects
* Virtualization
* Network visualization
* Futuristic technical interfaces
* 3D environments

IMPORTANT:

Do NOT create a fan website.

Do NOT directly copy Code Lyoko's copyrighted UI, logos, characters, assets, dialogue, or exact visual designs.

Instead, create an original visual identity that evokes the feeling of entering a mysterious virtual computer system.

The final website should feel like:

> "A portfolio that behaves like a virtual system, not a normal website."

---

# 1. CORE CONCEPT

The website represents the personal computer system of WISTFY.

The visitor is not simply browsing a portfolio.

They are:

1. Connecting to the system
2. Initializing the virtual environment
3. Entering the WISTFY virtual world
4. Exploring projects
5. Inspecting technical information
6. Returning to the main system

The central concept is:

```text
REAL WORLD
     ↓
SYSTEM CONNECTION
     ↓
VIRTUALIZATION
     ↓
WISTFY VIRTUAL WORLD
     ↓
PROJECTS / ABOUT / SKILLS / CONTACT
```

Use this concept throughout the UX.

---

# 2. PERSONAL BRAND

Name:

WISTFY

Primary identity:

* Graphics Programmer
* Software Engineer
* Creative Technologist

Focus:

* OpenGL
* C++
* Graphics Programming
* GLSL
* Rendering
* Software Engineering
* Python
* Web Development
* Interactive Systems
* Experimental Technology

The design should communicate:

* Technical ability
* Curiosity
* Engineering
* Creativity
* Precision
* Experimental thinking

Avoid making the website look like a generic developer portfolio.

---

# 3. VISUAL DIRECTION

Use a dark futuristic technical interface.

Base:

```text
Background:
#030509
#05070A
#080C12
```

Primary accent:

```text
Electric Cyan
```

Secondary accent:

```text
Violet / Blue
```

Use accent colors sparingly.

The site should NOT become a generic neon gaming website.

Target visual balance:

```text
90% sophisticated technical interface
10% futuristic virtual-world aesthetic
```

The design should feel:

* Minimal
* Cinematic
* Technical
* Mysterious
* Precise
* Premium

Avoid:

* Excessive glow
* Excessive gradients
* Excessive glassmorphism
* Generic cyberpunk aesthetics
* Excessive rounded cards
* Template-like layouts

---

# 4. TYPOGRAPHY

Use a combination of:

Primary:

```text
Inter
IBM Plex Sans
Space Grotesk
```

Technical:

```text
JetBrains Mono
IBM Plex Mono
```

Use monospace typography for:

* System logs
* Technical metadata
* Project IDs
* Status indicators
* Coordinates
* Navigation labels

Use modern sans-serif typography for:

* Headings
* Descriptions
* Personal branding

Typography should be one of the strongest design elements.

---

# 5. ENTRY EXPERIENCE

The website should begin with a system boot sequence.

Example:

```text
WISTFY SYSTEM
--------------------------------

INITIALIZING CORE...

GRAPHICS MODULE       ONLINE
RENDERING ENGINE      ONLINE
PROJECT DATABASE      ONLINE
VIRTUAL ENVIRONMENT   ONLINE

SYSTEM CHECK          COMPLETE

> ACCESS GRANTED

ENTER VIRTUAL ENVIRONMENT
```

Create a short cinematic transition.

Requirements:

* Do not make the boot sequence annoying.
* Allow the user to skip it.
* Store a session/local state so returning visitors don't have to repeatedly watch the full animation.
* The animation should be approximately 2–4 seconds.
* Respect `prefers-reduced-motion`.

After initialization, transition into the main environment.

---

# 6. MAIN INTERFACE

The homepage should resemble an original virtual control system.

Do NOT create a traditional navbar.

Instead create a modular HUD.

Possible modules:

```text
PROJECTS
ABOUT
SKILLS
SYSTEM
CONTACT
```

The navigation should feel like system modules rather than webpage links.

Example:

```text
┌─────────────────────────────────────────────┐
│ WISTFY SYSTEM                     SYS: 001  │
│                                             │
│                                             │
│               W I S T F Y                   │
│                                             │
│        GRAPHICS PROGRAMMER                  │
│        SOFTWARE ENGINEER                   │
│                                             │
│        [ ENTER SYSTEM ]                    │
│                                             │
│                                             │
│ PROJECTS       ABOUT       SYSTEM           │
└─────────────────────────────────────────────┘
```

---

# 7. HERO SECTION

The hero must immediately establish the identity.

Use:

```text
WISTFY

GRAPHICS PROGRAMMER
SOFTWARE ENGINEER
```

Supporting statement:

```text
Building systems, rendering experiences,
and turning ideas into interactive worlds.
```

Add a subtle animated technical background.

Possible elements:

* Grid
* Coordinates
* Particles
* Network nodes
* Scan lines
* Wireframe geometry
* Data streams
* Subtle noise
* Orbiting points
* Technical markers

Do NOT overcrowd the hero.

---

# 8. VIRTUAL WORLD

This is the most important visual feature.

Create an interactive virtual environment inspired by the idea of a digital world.

The environment can contain:

* Floating geometry
* Wireframe structures
* Digital terrain
* Grid
* Particles
* Nodes
* Connection lines
* Abstract towers
* Portals
* Data streams

Do not directly recreate Code Lyoko environments.

Create an original world.

The user should be able to interact with it using:

* Mouse movement
* Cursor
* Scroll
* Drag
* Click

The environment should respond subtly to the user's actions.

---

# 9. PROJECT MAP

Projects should be represented as locations/modules inside the virtual world.

Do NOT simply display:

```text
Project Card
Project Card
Project Card
```

Instead create a digital map.

Example:

```text
                PROJECT 01
                    ●
                   /
                  /
       PROJECT 02 ●────────● PROJECT 03
                  |
                  |
                  ●
                PROJECT 04
```

Each project node should be interactive.

Hover:

* Node becomes active
* Information appears
* Environment reacts

Click:

* Camera moves toward the node
* Project interface opens
* Background environment changes subtly

---

# 10. PROJECT STRUCTURE

Create project categories inspired by virtual sectors.

Example:

### SECTOR 01 — GRAPHICS

Projects:

* OpenGL Renderer
* Rendering Engine
* Shader Experiments
* Computer Graphics Research

### SECTOR 02 — SYSTEMS

Projects:

* C++ Systems
* Algorithms
* Performance Experiments
* Tools

### SECTOR 03 — INTELLIGENCE

Projects:

* Machine Learning
* Stock Auto Trading
* Data Analysis
* Prediction Experiments

### SECTOR 04 — WEB

Projects:

* Financial Management
* Flask Applications
* React Applications
* Interactive Websites

The sector names and project names should remain editable through configuration/data files.

---

# 11. PROJECT DETAIL VIEW

When the user selects a project, transition into a technical project interface.

Example:

```text
WISTFY SYSTEM
/
PROJECT DATABASE
/
PROJECT_001

----------------------------------------

REAL-TIME RENDERING ENGINE

STATUS       COMPLETED
CATEGORY     GRAPHICS
LANGUAGE     C++
API          OPENGL
SHADERS      GLSL

----------------------------------------

DESCRIPTION

A real-time rendering system focused on
understanding graphics pipelines, rendering
architecture and GPU programming.

----------------------------------------

TECHNOLOGIES

C++
OpenGL
GLSL
GLM
CMake

----------------------------------------

[ LIVE DEMO ]
[ SOURCE ]
[ SYSTEM LOG ]
```

Include:

* Project screenshots
* Interactive demo when possible
* Technical explanation
* Architecture
* Challenges
* Solutions
* Technologies
* GitHub link
* Demo link

---

# 12. OPENGL PROJECT SHOWCASE

For graphics-related projects, prioritize visual demonstrations.

Instead of only screenshots, create:

* WebGL/WebGPU preview
* Shader visualization
* Interactive 3D model
* Particle simulation
* Lighting demonstration
* Wireframe mode
* Debug overlays

Example controls:

```text
[ W ] Wireframe
[ L ] Lighting
[ P ] Particles
[ R ] Reset
```

Display technical information as HUD overlays.

This section should demonstrate actual graphics knowledge.

---

# 13. ABOUT SECTION

Do not create a generic "About Me" section.

Instead present it as:

```text
SYSTEM PROFILE

USER: WISTFY

ROLE:
Graphics Programmer
Software Engineer

INTERESTS:
Real-time Rendering
Computer Graphics
Systems
Interactive Technology
Software Architecture
```

Then include a short personal description.

Keep it human.

The technical interface should not completely hide the person behind the portfolio.

---

# 14. SKILLS

Represent skills as system modules rather than percentage bars.

Avoid:

```text
C++ █████████ 90%
Python ████████ 80%
```

Instead:

```text
GRAPHICS ENGINE
├── OpenGL
├── GLSL
├── Rendering
├── Shaders
└── GPU Programming

SOFTWARE ENGINEERING
├── C++
├── Python
├── C#
├── Architecture
└── Performance

WEB SYSTEMS
├── React
├── Flask
├── .NET
├── PostgreSQL
└── REST APIs
```

Allow the user to expand/collapse modules.

---

# 15. SYSTEM LOG

Create a small live system log.

Example:

```text
[15:32:01] User connected
[15:32:02] Virtual environment initialized
[15:32:04] Project database loaded
[15:32:07] Graphics subsystem ready
```

The messages can change based on user interaction.

For example:

```text
[15:34:21] Project_001 selected
[15:34:22] Loading rendering engine...
[15:34:23] Shader subsystem initialized
```

This should be subtle and not distract from the content.

---

# 16. CURSOR INTERACTION

Create a custom cursor.

Possible states:

Normal:

```text
+
```

Hover interactive object:

```text
[ + ]
```

Loading:

```text
◌
```

Interactive 3D object:

```text
crosshair + coordinate indicator
```

The cursor should interact with the environment.

Keep it performant.

Disable or simplify custom cursor behavior on mobile.

---

# 17. TRANSITIONS

Use cinematic transitions.

Examples:

* Digital scan
* Horizontal wipe
* Grid displacement
* Particle dissolve
* Camera movement
* Data loading
* Virtualization effect

Do not use random animations everywhere.

Every animation should communicate:

```text
loading
navigation
selection
system state
```

---

# 18. SOUND

Sound should be optional.

DO NOT autoplay audio.

If implemented, provide:

```text
SOUND: OFF
```

and allow users to enable it.

Possible sounds:

* UI click
* System initialization
* Soft digital hum
* Project selection
* Data loading

Keep sound extremely subtle.

---

# 19. RESPONSIVE DESIGN

The desktop version can provide the full virtual experience.

Mobile should not attempt to reproduce every 3D effect.

Mobile should prioritize:

* Readability
* Navigation
* Project information
* Performance

Create a simplified mobile environment.

Example:

Desktop:

```text
Interactive 3D Virtual World
```

Mobile:

```text
Interactive 2D System Map
```

---

# 20. PERFORMANCE

Performance is extremely important.

Target:

```text
60 FPS desktop
30+ FPS mobile
```

Requirements:

* Lazy-load heavy assets
* Lazy-load 3D scenes
* Avoid unnecessary WebGL rendering
* Use requestAnimationFrame correctly
* Dispose geometries/materials/textures
* Avoid memory leaks
* Avoid excessive DOM animation
* Use GPU-friendly effects
* Reduce particle count on mobile
* Respect reduced motion

The portfolio itself should demonstrate engineering quality.

---

# 21. ACCESSIBILITY

Implement:

* Keyboard navigation
* Semantic HTML
* Focus states
* ARIA labels where necessary
* Reduced motion
* Sufficient contrast
* Screen-reader friendly project content

Do not sacrifice usability for visual effects.

---

# 22. ARCHITECTURE

Use a clean component architecture.

Suggested structure:

```text
src/
├── components/
│   ├── system/
│   ├── navigation/
│   ├── hero/
│   ├── projects/
│   ├── world/
│   ├── about/
│   ├── skills/
│   └── contact/
│
├── scenes/
│   ├── VirtualWorld/
│   ├── ProjectMap/
│   └── Effects/
│
├── data/
│   └── projects.ts
│
├── hooks/
│
├── shaders/
│
├── utils/
│
└── styles/
```

Keep content separate from presentation.

Projects should be data-driven.

---

# 23. TECHNOLOGY

Preferred stack:

```text
React
TypeScript
Vite
Three.js / React Three Fiber
GLSL
GSAP or Framer Motion
```

Use Tailwind CSS only if it improves development speed without making the design generic.

Do not blindly install libraries.

Use the minimum necessary dependencies.

---

# 24. VISUAL HIERARCHY

The site must remain understandable.

Priority:

```text
1. WISTFY identity
2. Projects
3. Technical expertise
4. Experience
5. About
6. Contact
7. Decorative effects
```

Never allow effects to overpower content.

---

# 25. ORIGINALITY REQUIREMENT

The final website should feel inspired by:

* Virtual computer systems
* Early 2000s futuristic interfaces
* Digital worlds
* Sci-fi HUDs
* Code Lyoko atmosphere

But it must have its own identity.

Do NOT directly reproduce:

* Code Lyoko logo
* XANA logo
* Lyoko sector maps
* Characters
* Character silhouettes
* Exact UI panels
* Exact typography
* Exact color combinations
* Copyrighted assets
* Original dialogue
* Original screenshots

The result should be:

```text
Code Lyoko inspiration
        +
WISTFY identity
        +
OpenGL / Graphics identity
        +
Modern web design
```

---

# 26. EASTER EGGS

Add subtle hidden interactions.

Examples:

* Typing a secret keyboard sequence unlocks a debug mode.
* Clicking a system indicator multiple times reveals developer information.
* Idle mode triggers a mysterious system scan.
* Opening the console reveals hidden system messages.

Keep these optional and subtle.

The portfolio must still work perfectly without discovering them.

---

# 27. CONTACT

Create a final system connection screen.

Example:

```text
COMMUNICATION MODULE

SYSTEM READY

Want to build something interesting?

[ CONNECT ]

--------------------------------

GitHub
LinkedIn
Email
```

The final screen should feel like ending a session rather than simply displaying a contact form.

---

# 28. FOOTER

Minimal:

```text
WISTFY SYSTEM

GRAPHICS • SOFTWARE • EXPERIMENTS

SYSTEM STATUS: ONLINE

© 2026 WISTFY
```

---

# 29. DESIGN QUALITY BAR

The website should look like it was designed by:

```text
Senior Product Designer
+
Creative Technologist
+
Graphics Programmer
```

Not:

```text
AI generated developer template
```

Avoid generic AI-generated patterns such as:

* Huge gradient text
* Random glowing blobs
* Excessive glass cards
* Generic purple/blue SaaS design
* Unnecessary statistics
* Skill percentage bars
* Stock illustrations
* Generic "Let's build the future" copy
* Excessive rounded cards

Every element must have a reason to exist.

---

# 30. IMPLEMENTATION PROCESS

Before writing code:

1. Analyze the complete design direction.
2. Define the information architecture.
3. Define the visual system.
4. Define the animation system.
5. Define the 3D world concept.
6. Define reusable components.
7. Create the project data model.
8. Create the desktop layout.
9. Create the mobile fallback.
10. Implement the experience incrementally.

Do NOT generate the entire project blindly in one pass.

Build the system in stages.

---

# 31. DEVELOPMENT PHASES

## PHASE 1

Create:

* Project setup
* Global styles
* Typography
* Color system
* Boot screen
* Main navigation
* Hero

## PHASE 2

Create:

* Virtual world
* Grid
* Particles
* Interactive nodes
* Project map

## PHASE 3

Create:

* Project detail interface
* Project data
* Technical information
* Project demos

## PHASE 4

Create:

* About
* Skills
* Contact
* System logs

## PHASE 5

Create:

* Mobile experience
* Accessibility
* Reduced motion
* Performance optimization

## PHASE 6

Polish:

* Animation timing
* Transitions
* Micro-interactions
* Loading states
* Error states
* Visual consistency

---

# 32. IMPORTANT DEVELOPMENT RULE

Do not stop at making the website "functional".

Continuously evaluate:

> "Does this feel like entering a virtual system?"

If not, improve the interaction model.

The goal is not merely to create a pretty portfolio.

The goal is to create an **experience**.

---

# 33. FINAL EXPERIENCE

When a visitor opens the website, the intended emotional sequence should be:

```text
CURIOUS
   ↓
"What is this?"
   ↓
SYSTEM INITIALIZATION
   ↓
"Interesting..."
   ↓
ENTER VIRTUAL WORLD
   ↓
"This is a portfolio?"
   ↓
PROJECT EXPLORATION
   ↓
"This person actually builds graphics systems."
   ↓
PROJECT DETAILS
   ↓
"Technically impressive."
   ↓
CONTACT
   ↓
"I want to know more."
```

The final result should be a portfolio that demonstrates the developer's technical ability **through the website itself**.

---

# FINAL REQUIREMENT

Before considering the implementation complete, perform a complete UX review.

Check:

* Does the first 5 seconds communicate who WISTFY is?
* Can a visitor find projects quickly?
* Does the Code Lyoko-inspired concept feel original?
* Does the site demonstrate graphics programming ability?
* Does the 3D experience improve the portfolio instead of distracting from it?
* Does it work without WebGL?
* Does it work on mobile?
* Does it remain performant?
* Does it look professional enough for a technical portfolio?
* Does it feel like a unique WISTFY product rather than an AI-generated template?

If any answer is "no", fix it before declaring the project complete.
