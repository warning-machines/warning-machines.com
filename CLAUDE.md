# CLAUDE.md — warning-machines.com

## Project
Next.js 16 website for Warning Machines (engineering/prototyping services company).
- Framework: Next.js (App Router), React 19, TypeScript
- Styling: CSS files (no inline styles)
- Payments: Stripe
- DB: PostgreSQL (via `pg`)
- Email: Nodemailer
- Local dev server: `npm run dev` → http://localhost:3000

## Design Fidelity Rules
- Do not add features, sections, or content not present in the reference image
- Match the reference exactly — do not "improve" the design
- If the user provides CSS classes or style tokens, use them verbatim
- Keep code clean but don't over-abstract
- When comparing screenshots, be specific about what's wrong (e.g., "heading is 32px but reference shows ~24px", "gap between cards is 16px but should be 24px")

## Prototyping / Static Files
- Use Tailwind CSS via CDN (`<script src="https://cdn.tailwindcss.com"></script>`)
- Use placeholder images from `https://placehold.co/` when source images aren't provided
- Mobile-first responsive design
- Single `index.html` file unless the user requests otherwise

## Task Completion Protocol
After completing ANY visual or UI task, you MUST:

1. **Verify the code** — re-read every file you changed and confirm the logic is correct
2. **Screenshot** the rendered page by updating `screenshot.js` with the target URLs, then running it via the Bash tool:
   ```bash
   "/c/Program Files/nodejs/node.exe" "C:/GitHub/warning-machines.com/screenshot.js"
   ```
   Then read the resulting PNG files with the Read tool to view them inline.
   If the page has distinct sections, capture those individually too.
   **Note:** The dev server must be running (`npm run dev`) for screenshots to work.
3. **Compare** your screenshot against the reference image. Check for mismatches in:
   - Spacing and padding (measure in px)
   - Font sizes, weights, and line heights
   - Colors (exact hex values)
   - Alignment and positioning
   - Border radii, shadows, and effects
   - Responsive behavior
   - Image/icon sizing and placement
4. **Fix** every mismatch found
5. **Re-screenshot** and compare again
6. **Repeat** steps 3–5 until the result is within ~2–3px of the reference everywhere

Do NOT stop after one pass. Always do at least 2 comparison rounds. Only stop when the user says so or when no visible differences remain.

## Screenshots
- Always screenshot the specific page that was edited, not just the homepage
- If the dev server is not running, note that the user needs to start it with `npm run dev`
- Save screenshots to a temp location and display them inline

## Code Conventions
- TypeScript throughout — no `any` types
- App Router conventions — layouts in `layout.tsx`, pages in `page.tsx`
- Keep components in `src/components/`, page-specific components co-located with the page

## Structure Notes
- Service pages: `src/app/services/[service]/page.tsx`
- Blog pages: `src/app/blog/[slug]/page.tsx`
- API routes: `src/app/api/`
- Shared components: `src/components/`

## Never Do
- Do not commit or push unless explicitly asked
- Do not change Stripe-related code without user confirmation
- Do not skip the screenshot verification step for UI tasks
- Do not add features or content not present in the reference
