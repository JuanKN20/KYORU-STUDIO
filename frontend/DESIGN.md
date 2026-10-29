# Kyoru Studio Design System

This document is the human source of truth for Kyoru's visual direction. It records the current system, the intended evolution, and decisions that remain open. It does not authorize changes to public content, data contracts, or production infrastructure.

## 1. Kyoru Design Direction

Kyoru should feel like a creative multimedia studio able to originate worlds and deliver professional digital work:

**Creative Studio × Original IP / Animation Studio × Digital Technology**

The visual territory is:

**Anime / Manga Editorial × Production Studio × Digital Craft**

The result should be dark, mysterious, cinematic, precise, experimental, technological, premium, and narrative. It must not turn the whole corporate site into “an anime website.” Original work may be more expressive than commercial pages, but both must clearly belong to Kyoru.

## 2. Positioning

Kyoru spans web development, digital experiences, design, illustration, manga/anime, 2D/3D animation, audiovisual production, 3D, games and interactive work, branding, creative technology, applied AI, original IP, and future R&D.

The public V1 must represent only verified current capability. Its commercial focus remains:

- Desarrollo Web
- Modelado y Experiencias 3D
- Animación y Contenido Digital
- YORUTSUGI as the first original IP

The system should be able to grow later toward `CLIENT WORK`, `ORIGINALS`, and `LAB / R&D`, without presenting that future structure as already implemented.

## 3. Reference System

References are strategic lenses, not templates:

- UNIT9 and Territory Studio: business structure and multidisciplinary production.
- Dogstudio and Active Theory: digital experience and creative development.
- BUCK: art direction and animation craft.
- Riot Games: original IP and entertainment ecosystems.
- Epic Games: long-term relationship between content and technology.
- AKQA: strategic discipline and creative technology.

Do not copy their layouts, identity, assets, language, or motion. Extract a principle, test whether it fits Kyoru, and reinterpret it through Kyoru's own work.

## 4. Narrative

Core concept: **THE UNKNOWN BECOMES REAL**.

The experience should suggest:

**darkness → possibility → creation → construction → world / result**

The idea “what can be imagined can be built” should be demonstrated through composition, interaction, real work, and movement—not repeated as advertising copy.

## 5. Design Principles

1. Lead with real work; explain after attention has been earned.
2. Make media and typography carry identity before adding decoration.
3. Separate commercial clarity from original-IP expression without splitting the brand.
4. Use technology as craft and capability, not as decorative cyberpunk language.
5. Vary composition according to content; do not reuse one hero and card grid everywhere.
6. Give every surface, control, and motion a function.
7. Keep claims factual and distinguish current capability from future ambition.
8. Treat accessibility, responsive behavior, and performance as part of the art direction.

## 6. Preserve / Refine / Replace

### Preserve

- The near-black, red, and off-white identity.
- Strong contrast, visible keyboard focus, semantic headings, and reduced-motion handling.
- The fixed navigation, clear business routes, and direct contact path.
- The honest presentation of YORUTSUGI as an original work “En desarrollo.”
- The existing content width around `max-w-7xl` and responsive horizontal padding as current implementation evidence.
- Reusable primitives where they serve clear interaction or content hierarchy.

### Refine

- Red as an intentional signal and editorial accent rather than a glow applied everywhere.
- Current typography hierarchy, especially the relationship between corporate copy and editorial display moments.
- Section rhythm so pages do not read as equal-height blocks separated by identical spacing.
- Buttons, links, and media controls into a clearer interaction grammar.
- Current rounded surfaces: retain them where softness or grouping is useful, not as the default container.
- Abstract backgrounds and grids so they support real media instead of replacing it.

### Replace progressively

- The repeated two-column SaaS-style hero with an abstract card on the right.
- The fictitious `Kyoru / Creative System` visual as the primary Home artwork.
- Repeated icon-in-rounded-square + heading + paragraph compositions.
- Universal panels, nested cards, pills, HUD lines, red glow, and backdrop blur.
- Abstract service imagery that repeats information already presented elsewhere.
- Universal `fade-up` treatment and identical page structures.

The historical `akai-*` class and token names remain functional implementation debt. Do not rename them opportunistically; address them in a dedicated, tested migration.

## 7. Color

Observed current values:

| Role | Current value | Source / status |
| --- | --- | --- |
| Near-black | `#050506` | `--akai-black`, `akai.black`; consolidated current base |
| Dark surface | `#0e0f12` | `akai.dark`; current supporting surface |
| Gray surface | `#1a1d24` | `akai.gray`; current supporting surface |
| Brand red | `#b3172f` | `--akai-red`, `akai.red`; consolidated current accent |
| Glow red | `#ff3b5c` | `--akai-red-glow`, `akai.glow`; use sparingly |
| Off-white | `#f5f7fa` | `--akai-white`, `akai.white`; current primary light color |

`index.css` and `tailwind.config.js` duplicate part of this palette. Treat that as system debt; do not create a third source of truth.

The exact future semantic palette, contrast pairings, and extended neutral scale are an **OPEN DESIGN DECISION**. Do not introduce a purple/blue “AI” palette by category habit.

## 8. Typography

The current body stack is `Inter`, `Segoe UI`, `Tahoma`, `Geneva`, `Verdana`, `sans-serif`. Current headings rely primarily on weight, tight tracking, uppercase kickers, and size rather than a distinct display family.

Preserve legibility and the existing functional hierarchy while exploring a future direction. The future system should support:

- precise corporate information;
- strong cinematic statements;
- editorial/manga moments for original IP;
- Spanish copy, uppercase labels, numerals, and responsive text without fragile line breaks.

The definitive font family, licensing, loading strategy, type scale, and editorial display treatment are **OPEN DESIGN DECISION**. Do not select or install a new font in documentation alone.

## 9. Layout / Grid / Containers

The current implementation repeatedly uses `max-w-7xl`, responsive `px-4 / sm:px-6 / lg:px-8`, two-column desktop heroes, and card grids. These are observed patterns, not a mandate for every future surface.

Keep a dependable content boundary for corporate pages, then create identity through controlled variation:

- allow selected media to break the standard container when it strengthens the story;
- alternate editorial, full-width, split, and sequential compositions according to content;
- put projects near the top of Home;
- let media lead selected work and original-IP sections;
- do not define a new exact grid until representative Home compositions have been tested.

The definitive grid, container variants, and breakpoint strategy are **OPEN DESIGN DECISION**.

## 10. Spacing / Rhythm

Current pages use consistent padding but often give sections similar visual weight. Future rhythm should create a sequence of anticipation, reveal, detail, and release.

- Use spacing to express hierarchy, not merely separate cards.
- Give important media room to breathe.
- Compress related text and controls; expand transitions between narrative chapters.
- Avoid identical top/bottom padding on every section by default.
- Preserve readable touch spacing and text measure on small screens.

No new numeric spacing scale is approved. **OPEN DESIGN DECISION**.

## 11. Shape Language

- **Sharp:** editorial dividers, framing, crops, data-like precision, and moments that need tension.
- **Soft:** supporting layers, media masks, and approachable commercial surfaces.
- **Rounded:** controls and containers where grouping, touch, or continuity justify it.
- **Pills:** compact statuses, filters, and short labels—not every link or content block.

Large radii and circles are not Kyoru's universal signature. The definitive radius system is an **OPEN DESIGN DECISION**.

## 12. Surfaces

Use a surface only when it groups content, creates depth, or establishes interaction. Prefer open composition, typography, dividers, cropping, and media before adding another card.

- Avoid cards inside cards.
- Avoid universal glassmorphism and backdrop blur.
- Avoid turning every section into a bordered panel.
- Use glow as a focal signal, not ambient wallpaper.
- Technological grids and HUD marks must have narrative or functional value.
- Let real images and video provide texture whenever approved media exists.

## 13. Imagery / Media

Priority order:

1. real work;
2. frames;
3. manga and illustration;
4. animation;
5. video;
6. 3D;
7. screenshots and real projects;
8. real process material.

Abstract decoration is secondary. Never manufacture portfolio evidence, clients, metrics, stills, or production claims. Media must have verified provenance and editorial approval, purposeful crops, meaningful alternative text when informative, and optimized responsive delivery.

## 14. Original IP

Original IP may adopt stronger editorial pacing, illustration, character art, panels, crops, and narrative transitions. It must retain shared Kyoru anchors: disciplined typography, core color behavior, accessibility, navigation, and production quality.

YORUTSUGI should become proof that Kyoru creates worlds, not merely another card in a services page. Its public state must remain honest while assets, publications, and official links are pending.

Known content debt: `src/data/yorutsugi.ts` still contains historical character canon. The approved names are Kaena Homusaki, Haruki Shinamori, Rinka, Daichi, and Mizuki Yemari, all with `alias: null`; related slugs must follow the approved canon when that data is migrated. Do not silently correct this during visual work.

## 15. Intro / Creation Sequence

Home may open with a short sequence:

**darkness → signal → fragments → creation → KYORU → Hero**

It should transform naturally into the Hero rather than behave as a separate loading screen. Potential ingredients include a red signal, fragments, strokes, geometry, frames, code, manga, image, mask, and light—only where they contribute to the narrative.

The current target is approximately 2–3 seconds if implementation tests support it. This is provisional, not a fixed duration. Avoid sound autoplay, a long blocking intro, a required “skip intro,” generic particles, and expensive effects without clear benefit. The complete page must remain understandable if the intro is reduced or absent.

## 16. Motion Principles

- Function and narrative before ornament.
- Motion may draw from montage, cuts, masks, depth, scale, typography, media expansion, and transformation.
- Do not animate every element or apply scroll reveal to every section.
- Use parallax or sticky sequences only when they improve comprehension or narrative progression.
- Keep important content available without motion.
- Respect `prefers-reduced-motion` with a coherent alternative, not merely a broken animation removed.
- Design a more economical mobile motion layer.
- Protect responsiveness, frame rate, input latency, and loading.

The motion library, timing system, easing, and concrete transitions are **OPEN DESIGN DECISION**.

## 17. Interaction System

Future work should distinguish:

- **Primary Action:** important commercial action such as starting a project.
- **Explore Action:** opening work, projects, or a deeper section.
- **Inline Action:** editorial navigation within content.
- **Media Action:** play, view, open, or explore media.

Not every action should be a rounded button. Each applicable control needs deliberate `default`, `hover`, `focus-visible`, `active/pressed`, `disabled`, and `loading` states. Keyboard, touch, and pointer use must be equivalent in outcome; hover cannot contain exclusive information.

## 18. Responsive

Mobile is its own composition, not compressed desktop.

- Preserve hierarchy while reducing simultaneous effects.
- Use a lighter intro and more economical transitions.
- Reframe or reorder media instead of merely shrinking it.
- Replace hover-only ideas with explicit touch interaction.
- Adjust line length and typography to the available space.
- Optimize media formats, crops, loading, and playback behavior.
- Preserve the same Kyoru identity without forcing desktop ornament into a narrow viewport.

Existing Tailwind breakpoints are implementation evidence; no new breakpoint system is approved.

## 19. Accessibility

The target is **experimental experience + professional engineering**.

- Maintain semantic landmarks and heading order.
- Preserve keyboard navigation and visible focus.
- Maintain sufficient contrast and avoid encoding meaning only in red.
- Respect reduced motion and expose equivalent content without animation.
- Keep usable touch targets and support zoom and text reflow.
- Give informative media useful alternatives; hide purely decorative layers from assistive technology.
- Avoid focus traps, unexpected autoplay, or interactions that depend on fine pointer control.

## 20. Performance

Spectacle should come from direction, not brute force.

- Avoid multiple simultaneous WebGL canvases, uncontrolled scroll listeners, giant blur layers, excessive particles, and competing heavy videos.
- Budget media and motion for mobile from the start.
- Prefer progressive enhancement and resilient fallbacks.
- Optimize images, video, fonts, and above-the-fold loading.
- Validate Core Web Vitals and animation frame stability when executable work begins.

Concrete media budgets and performance thresholds are **OPEN DESIGN DECISION**.

## 21. Anti-Generic Rules

Kyoru must not default to:

- AI gradients or excessive glow;
- universal glassmorphism;
- cards within cards;
- a default bento grid;
- repeated icon-square-heading-paragraph blocks;
- a SaaS hero with text left and a decorative card right;
- decorative HUD language without function;
- technological grids used instead of art direction;
- pills for every action;
- large radii on every surface;
- particles everywhere;
- universal `fade-up`, scroll reveals, or decorative parallax;
- repeated layouts across pages;
- fake metrics, clients, logos, work, or content.

## 22. Home Direction

Home V1 should evolve toward this narrative order. This is direction, not an implementation specification:

### 00 — Creation Intro

Darkness → signal → creation → Kyoru. The sequence merges into the Hero.

### 01 — Hero

A strong statement with real media integrated into the composition. Remove the current fictitious `Kyoru / Creative System` panel. Primary intents: `Ver proyectos` and `Hablemos`; final wording is open.

### 02 — Selected Work

Show verifiable work early. Media/project first, description second. YORUTSUGI can currently carry the lead position.

### 03 — Capabilities

Current commercial categories: Digital/Web, 3D, and Motion/Animation. Replace three identical SaaS cards with an editorial or interactive structure in which media responds to selection.

### 04 — Kyoru Original

Give YORUTSUGI controlled editorial/manga expression while preserving Kyoru's global grammar.

### 05 — Process

Concept: **FROM NOTHING TO SOMETHING**.

Possible sequence: `00 THE UNKNOWN`, `01 IMAGINE`, `02 DESIGN`, `03 BUILD`, `04 BRING IT TO LIFE`. Treat it as a narrative progression, not four step cards.

### 06 — Studio

Explain concisely who Kyoru is and how creativity, technology, and production work together.

### 07 — Showreel / Motion

Reserve a meaningful place for verified audiovisual material when an appropriate reel exists. Do not simulate one with abstract gradients.

### 08 — Contact

End with a strong, commercially clear invitation.

### 09 — Footer

Corporate information, navigation, original production, and later verified legal information.

## 23. References Method

**REFERENCE → analyze → extract principle → reinterpret as Kyoru**

Never copy. Record what a reference solves, why that principle applies, how Kyoru changes it, and what evidence will show that it works.

## 24. Open Design Decisions

- Definitive type families, licensing, loading, and type scale.
- Semantic color expansion and exact contrast pairings beyond the observed core values.
- Exact grid, container variants, breakpoints, spacing scale, and radius system.
- Final Hero copy and language strategy for primary actions.
- Approved media inventory, provenance, crops, and release order.
- Intro implementation, exact duration, replay behavior, and reduced-motion version.
- Motion tooling, timing, easing, and performance budgets.
- Final interaction treatment for capability selection and media controls.
- How `CLIENT WORK`, `ORIGINALS`, and `LAB / R&D` enter information architecture when verified content exists.
- When and how historical `akai-*` implementation names are migrated.

## 25. Design Review Questions

- Does the first viewport show what Kyoru creates, or only describe it?
- Is real media doing more work than abstract decoration?
- Does this composition serve its content, or repeat a template used elsewhere?
- Are current capability and future ambition clearly distinguished?
- Does motion improve narrative, hierarchy, or feedback?
- Does the experience remain clear with reduced motion, keyboard navigation, touch, zoom, and slower hardware?
- Is performance being spent on the most important moment?
- **¿Esta web podría pertenecer, cambiando solamente el logo, a cualquier otra agencia o startup?**

If yes, Kyoru's identity is still missing.
