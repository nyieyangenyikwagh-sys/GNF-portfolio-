# Claims Professional Casebook — audit and migration plan

Phase 1 checkpoint, 2026-09-28. This audit preceded implementation; the approved implementation is now complete as of 2026-09-30.

## Repository audit

The supplied directory contains one Next.js App Router page. All application source and configuration files were inspected. There are no `AGENTS.md` instructions in the workspace or checked parent locations. There is no `.git` directory: `git status` reports that this is not a Git repository. Existing commit history, baseline Git diff statistics, and section commits are therefore unavailable until a local repository is initialized or the original checkout is supplied. Plan: initialize local Git with an appropriate ignore file and baseline commit when implementation starts; never commit dependencies, build output, or secrets.

### Actual installed versions

Verified with `npm ls --depth=0`, rather than inferring from version ranges:

| Dependency | Version |
| --- | --- |
| Next.js / eslint-config-next | 16.3.5 |
| React / React DOM | 19.3.0 |
| TypeScript | 5.9.3 |
| Tailwind CSS / @tailwindcss/postcss | 4.3.3 |
| PostCSS | 8.5.28 |
| Framer Motion | 12.43.0 |
| lucide-react | 0.468.0 |
| ESLint | 9.39.5 |
| @types/node | 22.20.4 |
| @types/react / @types/react-dom | 19.3.0 |

Three installed packages are reported extraneous: `@img/sharp-wasm32@0.35.4`, `@napi-rs/wasm-runtime@1.2.4`, and `@tybys/wasm-util@0.10.4`. No dependency cleanup is proposed as part of this refactor.

### Complete source and configuration inventory

| File / directory | Purpose |
| --- | --- |
| `app/page.tsx` | Sole route `/`; renders Portfolio. |
| `app/layout.tsx` | Root HTML/body, Inter through next/font, static designer metadata, global CSS. |
| `app/globals.css` | Entire visual system, component styles, responsive rules, reduced-motion CSS. |
| `components/portfolio.tsx` | Entire interactive portfolio, local content arrays, all reusable functions and sections. |
| `package.json` / `package-lock.json` | Dependencies and dev/build/start/lint scripts; installed lockfile. |
| `next.config.ts` | Empty Next configuration; no redirects or special routing. |
| `postcss.config.mjs` | Tailwind v4 PostCSS integration. |
| `eslint.config.mjs` | Next core-web-vitals and TypeScript rules with generated output ignored. |
| `tsconfig.json` | Strict TypeScript, bundler resolution, `@/*` root alias, no emit. |
| `next-env.d.ts` | Generated Next environment declarations. |
| `.next/`, `node_modules/` | Generated build/dependency directories, not authored content. |
| `components/ui`, `data`, `lib`, `public`, Tailwind config | Not present. Tailwind v4 is imported directly by global CSS. |

### Every existing component and section

All following functions live in `components/portfolio.tsx`:

| Component | Description |
| --- | --- |
| Reveal | Once-per-viewport motion wrapper, fade and 16px upward entrance. |
| Button | Pill-shaped primary/secondary anchor primitive. |
| Brand | Three-line AYO / OLA / DIPO wordmark linking to #top. |
| Eyebrow | Uppercase accent section label. |
| Header | Fixed navigation; scroll background; intersection-based active anchor; mobile overlay with Escape, focus cycling and restoration. |
| SectionIntro | Eyebrow/title/body in an asymmetric two-column section header. |
| NumberedItem | Rounded numbered card with optional description, bullets and compact variant. |
| Portfolio | Homepage composition, section content, contact and footer. |

| Existing section | Description |
| --- | --- |
| Header | Services, How I Work, Format, About, Contact; Start a project CTA. |
| Hero / #top | Split heading and circular photo, two-column pitch, identity and explore link. |
| Hero statistics | 08+ years, 24 products, 11 partnerships, 04 continents; unsupported by supplied evidence. |
| Services / #services | Product direction, experience design, design systems, creative partnership cards. |
| Process / #process | Listen closely, Find the signal, Make it tangible, Refine together, Leave it stronger. |
| Engagement / #format | Sprint, embedded partnership, design-system engagement cards. |
| Focus areas | Fintech, AI tools, future of work, health platforms, climate tech, creator tools, public services, new ventures. |
| About / #about | Designer biography and useful-work quotation. |
| Contact / #contact | Email, collaboration copy, mailto CTA, three placeholder social links. |
| Footer | Brand, practice description, navigation/social links, copyright and Lagos location. |

No developer project library, project detail routes, real work samples, credentials, PDFs, backend integration or images exist in the supplied source tree. `/images/hero-image.jpg` is referenced but the entire `public` directory is absent.

### Design inventory to preserve

| Token / pattern | Current value |
| --- | --- |
| Background / foreground | `#fff` / `#111` |
| Muted / card / border | `#6b6b6b` / `#f7f6f4` / `#e8e6e2` |
| Accent / secondary | `#f5906b` / `#c9a6c9` |
| Font | Inter via `--font-inter`, Arial, sans-serif fallback; no custom mono font. |
| Card / button radius | 16px / 999px; circular avatar and hero image. |
| Shadows / borders | No defined shadow system; predominantly 1px borders. |
| Shell | Max 1440px; inline padding clamp(1.5rem, 4.4vw, 4rem), 1.25rem on phones. |
| Section spacing | Block padding clamp(5rem, 9vw, 9rem); 70px anchor offset. |
| Grids | Four-column services/stats/focus; three-column format; asymmetric intro/about/contact grids. |
| Grid gaps | Common 1rem; fluid 2–6rem intro gaps and larger 8–9vw editorial gaps. |
| Typography | Hero clamp(3rem, 8vw, 7.5rem), 850 weight, .91 line height; section titles clamp(2.5rem, 5vw, 4rem), .98 line height; card titles clamp(1.25rem, 1.6vw, 1.55rem). |
| Small typography | Eyebrows .76rem/800, nav .8rem/700, buttons .83rem/750; body typically 1–1.12rem. |
| Breakpoints | 1050px, 820px, 600px, 360px. |
| Header | Fixed, 88px desktop / 74px mobile; existing overlay below 820px. |

There is no formal spacing or type token configuration beyond the CSS declarations and Tailwind defaults. Preserve these existing values and reuse their patterns for additions. No new font, palette, UI package or animation package is planned.

### Content, animation, and theme

Content is entirely hardcoded in the main client component, including arrays for navigation, services, process and focus areas. Metadata is hardcoded in layout. No content API or data model exists.

Framer Motion drives Reveal (0.55s, easing `[0.22, 1, 0.36, 1]`, once, viewport amount .15) and mobile navigation (0.22s overlay, staggered links). CSS hover transitions typically use .2–.25s, photo scaling .6s with matching cubic-bezier. Reduced-motion CSS disables transitions/animations and smooth scrolling; Reveal removes translation but still fades, and mobile motion does not fully honor reduced motion. Extend the existing approach to respect reduced motion throughout.

The site is light-only. The dark contact section and mobile overlay are local inverse surfaces, not a dark theme. There is no provider, theme switch, theme persistence or dark palette to preserve. To honor the highest-priority prohibition on introducing a palette, do not invent a dark mode. Test OS dark preference for readable unchanged light rendering and explicitly report that a true second theme is absent. Adding a dark palette would require a change to the design constraints.

### Baseline issues

- Missing hero image; replace the visual as explicitly requested.
- Unverified career statistics and designer claims must not become verified claims experience.
- Social anchors point to `#`; hide unset URLs.
- Profile name, email and Lagos location exist in source but ownership/current accuracy is not established by the task. Preserve original copy in a non-rendered legacy content record in the future data file; default public identity/contact to the requested placeholders or empty configured values.
- No skip link, contact form, document modal or semantic content labels.
- Eight new navigation labels may exceed the existing desktop header at intermediate widths. Preserve overlay behavior and use it earlier if measured fit requires it; document any breakpoint adjustment.
- Accent small text and focus outlines need measured contrast checks. If needed use existing foreground for readable text and retain accent decoratively, without changing tokens.
- Baseline `npx tsc --noEmit` passed. Final lint and TypeScript checks pass with zero errors. The original `@next/next/no-img-element` warning was removed when the missing portrait hero was replaced by the workflow visual. Final production build, responsive browser checks and interaction QA are recorded in the delivery report and `.tools` QA artifacts (ignored from Git).

## Section mapping

| Existing section/content | Target | Action | Reason |
| --- | --- | --- | --- |
| Header and mobile navigation | Eight requested navigation labels | ADAPT | Retain fixed header, overlay, active tracking, keyboard behavior and wordmark styling. |
| Hero composition | Hero | ADAPT | Preserve split layout/type scale; replace copy and missing photo with a labelled workflow visual. |
| Hero statistics | Performance / Track Record | ADAPT | Reuse stat cards; values default to empty and hide in production until documented. |
| About | Professional Profile | ADAPT | Reuse asymmetric layout for identity, honest transition background, current focus. |
| Services | Claims Capabilities | ADAPT | Reuse numbered card grid with enabled, typed capability content. |
| Existing focus grid | Profile Current Focus and Technology | ADAPT | Retain compact cards; show configured claims interests and supported technical background. |
| Process | Claims Workflow | ADAPT | Retain numbered editorial treatment; add nine selectable stages and details. |
| Engagement format | Availability & Deployment | ADAPT | Reuse card treatment for configured work types and regions without assuming work authorization. |
| Contact | Contact | ADAPT | Preserve inverse section and layout; add validated configurable inquiry form. |
| Footer | Footer | ADAPT | Preserve layout; replace copy with claims/privacy content and valid configured links. |
| Shell, dividers, Button, Eyebrow, Reveal, NumberedItem | Shared building blocks | REUSE | Maintain existing visual language; move only where reuse requires it. |
| SectionIntro | SectionHeader | ADAPT | Use the existing equivalent rather than duplicate a header system. |
| No equivalent | Licenses & Certifications | NEW | Placeholder credential/empty state and planned Ontario/Utah jurisdiction statuses. |
| No equivalent | Casebook | NEW | Four synthetic conditional cases, claim-type filters and six-part accessible details. |
| No equivalent | Work Samples / DocumentViewer | NEW | Filtered synthetic documents, lazy accessible modal and native PDF rendering. |
| No equivalent | Quality & Accuracy | NEW | Illustrative interactive claim-file checklist, never certification. |
| No equivalent | Claims Technology / Automation | NEW | Prominent SQL/backend application, synthetic dashboard and pipeline; platforms disabled. |
| No equivalent | Professional Documents | NEW | Render only configured files verified to exist under public/documents. |
| No equivalent | Field Readiness | NEW | Build data-driven component but default hidden for desk-based target. |
| Unsupported 08+/24/11/04 figures | Non-rendered migration record only | REMOVE | No supporting evidence; must not appear as genuine performance. |
| Designer-specific marketing and engagement claims | Non-rendered legacy copy; adapt transferable concepts | REMOVE | Public designer positioning conflicts with requested casebook; preserve original strings for review in data rather than assert employment. |
| Missing portrait reference | Hero workflow visual | REMOVE | Asset does not exist and user explicitly requests workflow replacement. |
| `#` LinkedIn/Behance/Instagram links | Configured social links only | REMOVE | Placeholder links provide no destination. |

Keep route `/` and existing `#top`, `#services`, `#process`, `#format`, `#about`, `#contact` destinations as compatibility anchors near their mapped sections. Fragments cannot be redirected by next.config. No route deletion or redirect is needed.

## Implementation decisions for subsequent phases

1. Add `data/types.ts` and a single typed `data/portfolio.ts` object, extending the requested shape with section/UI copy, navigation, content-label text, region options and legacy migration content. Strict `ContentLabel` fields cover all displayed content entities, including metrics, workflow and technology. Badge text is the three required labels; synthetic cases additionally show DEMONSTRATION CASE STUDY.
2. Default identity to `[YOUR NAME]`, unknown contact fields to empty, claim experience to a placeholder, credentials to PLACEHOLDER, metrics to empty, Ontario/Utah status to PLANNED, vendor platforms disabled, field readiness hidden, regulatory frameworks opt-in/off. User-provided fullstack/backend/advanced SQL background is the only verified background; do not infer proficiency in every suggested tool.
3. Preserve transferable legacy copy and the FastAPI/backend reference as editable archived source material. There are no existing projects to migrate; never invent a Selected Technical Work project. Keep a future relatedProject slot empty.
4. Implement sections in the user's specified order. Use server components for static content and small client components for navigation, filters, accordion, workflow, checklist, modal and form. Retain existing component primitives, adapting equivalents instead of creating competing designs.
5. Reuse existing CSS classes and tokens. Add narrowly scoped interaction/layout styles as needed; do not rewrite existing token declarations or theme configuration. Maintain hero composition, type scale, section widths/padding, card radius and motion easing.
6. Use native browser PDF embedding, no PDF dependency. React placeholder pages visibly show SAMPLE/redaction. Native PDF viewers differ in page/zoom-fragment support: custom controls should provide best-effort navigation, with the browser toolbar/download as fallback. Do not claim cross-browser PDF rendering control that native embedding cannot guarantee.
7. Use an accessible lazy-loaded modal, explicit labelled buttons, Escape/backdrop closing, focus containment/restoration, and scroll locking. Placeholder pages support deterministic zoom and pagination. Verify a temporary synthetic real PDF through the same configured-file path; do not ship a fictitious professional document.
8. Validate public document paths/existence on the server before displaying professional documents/resume. Document intended PDF path constraints and browser behavior in EDITING-GUIDE.
9. Default contact to mailto, hide missing contact details, and display an honest unavailable submission state when no recipient is configured. Support configured Formspree and a server-only Resend route with environment variables, input validation and honeypot. No API keys in client data. No actual inquiry or external message will be sent during testing.
10. Add Metadata API, optional configured OG/Twitter image, and Person JSON-LD using only configured non-placeholder fields. Add development-only placeholder diagnostics; those expected diagnostics are distinct from implementation errors.
11. No added runtime dependencies are planned. Any tooling or dependency need must be documented with bundle impact before addition. Use existing Framer Motion/lucide tools.
12. After each section run lint, TypeScript and dev rendering checks; fix regressions before proceeding, then commit the completed section once Git is initialized. Final build and interaction/responsive verification follow all sections.

## Verification and delivery checklist

- Dev server, lint, TypeScript, build and route/bundle output; distinguish pre-existing issues from regressions.
- Nav/legacy anchors and active highlighting; filters; keyboard/mouse expansion; complete document modal behavior and configured PDF rendering.
- Responsive widths 1440, 1280, 1024, 768, 390, 375; no page overflow; local code/table scrolling; minimum 44px interactive targets.
- Reduced-motion browser emulation, visible focus, headings/landmarks, modal focus, accessible form errors, contrast and OS theme preference. Actual dark-theme verification is not possible without adding an unrequested palette.
- Scan configured/rendered content for unsupported claims, personal/confidential data, missing labels and synthetic data presentation.
- Compare original theme/font/config against baseline; report additions separately from token changes. Original globals.css SHA256: `0CA5664AC16C9FA180640159E81F4C91FA072EACA958E0838E18C1FF468B2DA3`.
- Deliver accurate EDITING-GUIDE and this evolving plan; report files created/modified/removed, dependencies, limitations, checks actually completed, deviations and all remaining owner-supplied fields.

## Completion update

The Phase 1 plan was presented and approved. Phases 2–4 are now implemented. The original global design tokens remain unchanged; `app/casebook.css` adds scoped layouts and interaction styles that compose the same palette, typography, spacing and radii. No application dependency was added. See `docs/EDITING-GUIDE.md` for the editable configuration and known browser-dependent native PDF behavior.

Final QA: `npm run build` passes with `/` static, `/api/contact` dynamic and `/icon.svg` static. Lint and TypeScript pass. Headless Chrome checks pass at 1440, 1280, 1024, 768, 390 and 375px under light and dark OS preferences with no horizontal overflow; keyboard/mouse filters, accordions, workflow, checklist, mobile menu, modal focus containment, Escape/backdrop closing, zoom/page controls, synthetic PDF embedding and contact validation pass. Axe reports no modal violations and only the preserved original peach brand/kicker contrast findings on the page. Those token values were intentionally preserved per the design-preservation rule.
