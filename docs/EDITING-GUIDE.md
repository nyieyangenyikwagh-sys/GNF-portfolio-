# Editing your Claims Professional Casebook

`data/portfolio.ts` is the source of truth for content, navigation, UI copy and configuration. `data/types.ts` enforces the shapes. Components contain rendering logic, not portfolio copy. Original source is preserved in the baseline Git commit; the `legacy` record archives previous copy and is never rendered.

## Identity and labels

Replace `profile.name`, bio and yearsExperience with accurate information. Set location and contact fields only when you want them public. Update `seo.title` and `ui.footer.copyright` alongside your name. `profile.background` should describe only your actual background. The initial SQL entry reflects the advanced SQL background you supplied; other technologies stay disabled until you choose accurate proficiency levels.

Every substantive content record has a `label`: `REAL_EXPERIENCE`, `DEMONSTRATION`, or `SAMPLE_REDACTED`. These render as explicit badges. Use real experience only for facts you can support. Claims demonstrations must remain labelled demonstrations even when their underlying technical skills are real. A placeholder credential does not mean enrollment or licensing.

Some requested records used `label` for their display name. This implementation uses `title` for that text (metrics, focus areas and checklist entries), reserving `label` consistently for the required content classification.

## Sections and configuration

- Hero: edit `hero`; keep the illustrative-system notice for synthetic visuals.
- Profile: edit `profile`, `focusAreas` and the jurisdiction interests. Each focus item has an `enabled` flag.
- Capabilities: each record has `enabled`, a lucide icon key, category, explanation and list of activities. Do not enable claims capabilities as real experience unless justified.
- Credentials: supply issuer, category, dates, jurisdiction, verification link and accurate status. PLACEHOLDER is the default; no real credential is invented. Ontario and Utah initially show PLANNED. Edit `jurisdictionStatus` and `visible`; never infer licensing from geographic interest.
- Metrics: replace null values with documented figures, units and notes. Empty figures display as em dashes in development and are omitted in production. The performance disclaimer appears only when real metrics exist.
- Casebook: add or edit `caseStudies`, preserving the six named steps. Use conditional language for synthetic cases and maintain both demonstration badges. Region uses Province / State wording without asserting local legal rules.
- Samples: edit `workSamples`, category, page count, date, and synthetic placeholder pages. Only use the listed categories so filters stay consistent.
- Workflow: edit the nine stages, objectives, documents, questions, outputs and quality checks.
- Quality: edit `qualityChecklist`. Browser selections are temporary and do not certify anything.
- Technology: enable only tools you have used, set accurate levels, and retain the no-vendor-certification notice. Edit the automation pipeline, synthetic dashboard and query. Set all three relatedProject fields to add your future project; otherwise it stays hidden.
- Availability: edit status, work-type enabled flags and region list. Work authorization/relocation text is optional and initially empty. Add another US state using the Region type if not prelisted.
- Field Readiness: `equipment.visible` defaults to false; enable only if meaningful and supply real items.
- Professional Documents: empty or nonexistent file paths hide the individual card. The whole section is absent if no files exist.
- Contact: configure your own destination before enabling submission. Missing contact details are hidden; no example address receives inquiries.
- Footer and section headings: edit `ui.footer`, `sections` and `navigation`.

## PDFs

Place PDFs in `public/documents`, then set a URL such as `/documents/resume.pdf` in `profile.resumeFile`, a document record or a sample's `file`. Use letters, digits, hyphens, underscores and optional subdirectories in filenames. Traversal outside this directory is rejected. Professional documents and resume links are checked on the server for existence. Restart/rebuild after configuring new files for production.

Set a sample's `pages` to the actual PDF page count. Native browser PDF embedding is intentionally used without a large PDF library. Page/zoom fragments are best-effort because browser PDF viewers differ; the native toolbar and download link provide fallbacks. Without a valid configured PDF, synthetic React paper pages render. They include SAMPLE watermarks and redaction markers, never real personal information.

## Privacy and defaults

### Contact delivery

`contact.mode = "mailto"` is the default. Set `profile.email` to your own address; submission opens the visitor's email application and explicitly tells them to review and send the draft. The site does not claim an email was sent.

For Formspree, select `formspree` and supply the form ID in `contact.formspreeId`. The ID is public, not a private key. For Resend, select `resend`, copy `.env.example` to `.env.local`, and supply `RESEND_API_KEY`, a verified sender in `CONTACT_FROM_EMAIL`, and your destination in `CONTACT_TO_EMAIL`. Restart the server after environment changes. `/api/contact` validates requests and performs the provider request only on the server. Keep environment files out of Git.

The form includes a honeypot and length/email validation. An unconfigured destination disables submission. Provider delivery is not guaranteed by a successful client-side validation check; test your own configured delivery before publishing. Placeholder document downloads are clearly marked text samples; real PDFs download unchanged.

Never put confidential claimant, carrier, policy, medical or financial information in the data file, PDFs, source control or contact form tests. Use obviously synthetic identities such as Claimant A. Regulatory frameworks are not enabled by default; add awareness/working-knowledge wording only when accurate. No legal licensing requirements are asserted.

Development logs list empty/placeholder fields, including optional fields. These are expected owner-editing reminders, not evidence that optional values must be supplied. Production does not emit these warnings.

## Design and checks

The original `app/globals.css` remains the visual baseline. `app/casebook.css` adds scoped layouts and interactions using that palette and scale. No dark theme existed in the original site; the page remains light under either OS preference, with the original inverse contact surface.

Run `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `npm run dev`. The optional section checker runs lint/TypeScript and confirms configured text appears in the local dev response. Browser QA tooling is separate under ignored `.tools`, not an application dependency.
