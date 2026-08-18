# Taboo Shop Theme — Session Progress

Last updated: 2026-08-18

## Context

Shopify Horizon-based theme for The Taboo Shop, being pixel-matched to a design
handoff (`design-reference/TabooDesktopV2.dc.html` + `TabooAppV2.dc.html`,
docs in `design-reference/README.md`).

**Important: this repo is two-way synced with Shopify's GitHub integration.**
Edits made live in the Shopify Admin theme editor get auto-committed back to
`main` by `shopify[bot]` ("Update from Shopify for theme..."). This means:
- `sections/*.json` (section groups like `header-group.json`,
  `footer-group.json`) and `templates/*.json` carry a "may be overwritten"
  warning — they're live content, not just code. Hardcoding values into them
  from git is fragile; they can get reset by the next Admin save.
- Always `git fetch` before pushing — remote has moved unexpectedly several
  times this session from Admin-side edits.
- If a merge conflict hits one of those JSON files, prefer the Admin-edited
  values (real merchant content: menu handles, images, etc.) and re-apply
  code-driven additions on top, rather than blindly taking either side.

## What shipped this session (chronological)

1. **Header logo chip** (`blocks/_header-logo.liquid`) — added the `#FFF6E9`
   cream chip behind the logo (dark artwork needs a light backing on the dark
   `#14100F` nav bar), removed a mobile override that zeroed its padding.
2. **Nav link styling** (`blocks/_header-menu.liquid`, `header-group.json`) —
   bold weight, `#F2B233` active / `#FFF6E9` @78% inactive, matching the
   design's `navColor()` logic.
3. **Hero full-width background bug** (`sections/home-hero-taboo.liquid`) —
   `max-width:1200px` was on the same element as the background color,
   clipping it. Split into an outer full-bleed section + inner
   `max-width:1200px` wrapper. **This turned out to be a recurring bug
   pattern** — found again in `how-to-play-taboo.liquid`'s `__header` and
   fixed the same way.
4. **Header actions row** (`sections/header.liquid`,
   `snippets/header-actions.liquid`, new `snippets/header-amazon-link.liquid`)
   — added the outlined "Board game on Amazon ↗" link and a solid `#E8402A`
   cart pill ("Cart · N"), visible ≥750px. Account/login icon kept
   icon-only (not present in the design at all; flagged, not deleted).
   **Known issue:** the placeholder Amazon URL I set got wiped by an Admin
   sync — see Action Items below.
5. **How to play / Our story sections** — audited both against the design,
   fixed small margin/line-height deviations and a missing button border.
6. **Live demo section** (`sections/home-live-demo-taboo.liquid`) — timer/buzz
   footer bar was nested inside padded ancestors so its dark background never
   reached the card edges; restructured to be a direct sibling, edge-to-edge
   like the design. Also fixed Tabooster Pack cards defaulting to cream
   (`#FFF6E9`) on desktop when the design wants white (`#FFFFFF`) there
   (cream is correct on mobile, where the section sits on a dark band).
7. **Section-width standardization** — added the same page-width/full-width
   toggle (schema `select` + CSS class) that `header.liquid` and the hero
   already had to all remaining custom sections: cart, PDP, catalog,
   try-a-card/packs, Amazon banner, benefits band, never-played rules,
   how-to-play, our-story. Established pattern: outer element carries any
   background color and is always full-bleed; inner wrapper gets the
   `max-width:1200px` (page-width) or `padding-inline:40px` (full-width).
8. **PDP blocks + merch template** (`sections/pdp-taboo.liquid`, new
   `templates/product.merch.json`) — added a repeatable `checklist_item`
   block type and `checklist_heading` / `ships_note` / `show_description`
   settings so "What you get" content can be authored in the theme customizer
   instead of requiring product metafield definitions. Since one section's
   blocks apply to every product on its template, and all products currently
   share `templates/product.json`, created a separate `product.merch.json`
   preconfigured for a print-on-demand item (checklist: "Insulated stainless
   steel", "Screw lid"; ships_note: "Made to order by our print partner";
   description hidden). `product.json` itself is untouched — existing
   metafield-driven products (Tabooster packs) are unaffected.

All changes pushed to `origin/main`. Theme-check baseline throughout: 56
pre-existing errors / 6 warnings across 34 files, none introduced by this
session's edits (all pre-existing `content_for 'block'` / `{%- doc -%}`
theme-check findings unrelated to what changed).

## Action items (need Othman / store access — Claude can't do these)

- [ ] **Fix the header Amazon URL.** It's currently set to
      `shopify://pages/contact` — looks like a picker default that got saved
      before a real link was chosen, not an intentional value. Theme
      customizer → Header section → "Amazon board game link" → set the real
      Amazon product URL.
- [ ] **Clean up `templates/product.json` (the DEFAULT template, shared by
      every product including all Tabooster packs).** As of 2026-08-18 it has
      4 `checklist_item` blocks, all still at the placeholder default text
      "300 all new cards" (added while testing the new feature, not yet
      filled in), and `show_description` is set to `false` — meaning **every
      product's description is currently hidden site-wide**, not just the
      merch item. Since this is the shared default template, anything set
      here affects every product that doesn't have an alternate template
      assigned. Either fill in real checklist text + turn description back on
      here (if this is meant to apply broadly), or remove the blocks/reset
      `show_description` to `true` and do the merch-specific version only on
      `product.merch` (as originally intended).
- [ ] **Assign `product.merch` template** to the actual steel-bottle/tumbler
      product: Admin → Products → [product] → Theme template → `product.merch`.
      (`product.merch.json` itself already has the right content — checklist
      items, ships_note, description off.)
- [ ] Confirm whether other merch/apparel products need the same treatment —
      if so, either reuse `product.merch` or ask for additional alternate
      templates.

## Explicitly deferred (user's call, not done yet)

- **Global typography/palette mismatch.** `config/settings_data.json` still
  uses stock Horizon defaults — Inter font, black/white color palette — not
  the design's DM Sans/Bricolage Grotesque + cream/ink/red/yellow/teal
  tokens (see `design-reference/README.md` "Design Tokens" section for exact
  values). Custom Taboo sections work around this with hardcoded hex/font
  values in their own CSS, which is why they look right despite the global
  mismatch. User said "let's worry about fonts later" — full fix means
  uploading the fonts, setting global type settings, and building a matching
  color scheme.
- **Color-scheme picker integration.** When asked to standardize sections to
  "Horizon theme standard," user explicitly scoped it to page-width/layout
  only (see commit `13be8cf`) — colors intentionally stay hardcoded hex to
  preserve the pixel-matched brand look, not routed through Shopify's
  color-scheme settings.
- **Account/login icon in header.** Not part of the design at all (no login
  UI in either mobile or desktop mockups), but kept rather than removed since
  removing it eliminates real customer account access. Flagged for a
  decision, not resolved either way.

## Established conventions (for consistency going forward)

- **Outer/inner width pattern:** any section with a colored background must
  put that background on an element with NO `max-width`; the
  `max-width:1200px` (or full-width equivalent) goes on a separate inner
  wrapper. Never combine both on the same selector — that's the bug that hit
  the hero and how-to-play sections.
- **`section_width` schema setting:** `select` with `page-width` (default) /
  `full-width` options, wired as a literal CSS class on the outer element
  (`{{ section.settings.section_width }}` in the `class=""` attribute), using
  locale keys `t:settings.width` / `t:options.page` / `t:options.full`
  (already defined in `locales/en.default.schema.json`).
- Breakpoint: custom Taboo sections use 1024px mobile/desktop split; the
  native header component's own drawer↔menu switch is at 750px (stock
  Horizon behavior, left as-is).
