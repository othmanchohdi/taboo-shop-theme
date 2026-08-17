# Handoff: The Taboo Shop — mobile + desktop storefront redesign

## Overview
A responsive ecommerce redesign for **The Taboo Shop** (taboothegame.com, Shopify).
Two prototypes are included, covering the same seven views:

- `TabooAppV2.dc.html` — **mobile** (390 x 844 viewport, bottom tab bar)
- `TabooDesktopV2.dc.html` — **desktop** (1440px wide, 1200px content column, sticky top nav)

Views: Home, Catalog (collection listing + filters), Product detail (PDP), Cart, Checkout, Order confirmation, How to play, Our story.
Commerce model reflected in the design: **Tabooster card packs, bundles, plush and merch are sold direct**; the **base board game is an Amazon pass-through** (interstitial modal explains the cart stays intact).

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show intended look, copy and behavior. They are **not production code to copy**. They are authored in an internal HTML component format (`.dc.html` = template + a small logic class, hydrated by `support.js`), so treat them as you would a Figma file: read the markup for exact structure, spacing, color and copy, then **recreate the designs in the target environment** — for this project most likely a **Shopify theme (Liquid + CSS, Dawn-based)**, or React/Hydrogen if the store moves headless. If no environment exists yet, pick the most appropriate stack and implement there.

To view a prototype: open either `.dc.html` in a browser (keep `support.js` next to them). Product photography loads from the live Shopify CDN, so viewing requires a network connection.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, imagery, copy and interaction behavior. Recreate the UI closely, using the target codebase's existing components where they exist. Two areas are intentionally provisional:
1. **Free-shipping-over-$35 progress bar** — a UX proposal, not a confirmed store policy. Confirm the real threshold (or remove).
2. **Merch/plush imagery** — those products are print-on-demand and their photos were not available; they render as tinted tiles with the product name. Swap in real product images.

## Screens / Views

### 1. Home
**Purpose:** communicate what a Tabooster is in one screen, drive to packs, and let visitors feel the game.

**Mobile layout (390px):** sticky black header (logo on cream chip, "Packs" link, cart icon with count badge) → yellow marquee ticker → scrolling content → sticky bottom tab bar (64px, 4 tabs: Home / Shop / Play / Cart).
Content order: hero photo with red gradient overlay + headline (44px) → overlapping black CTA card (pulled up -48px) → "Try a card" live demo → black "Tabooster Packs" horizontal carousel (228px cards) → Amazon base-game banner → teal "Why everyone loves it" list → "Never played?" 3-step rules → footer.

**Desktop layout (1440px):** marquee (full-bleed) → sticky black nav (64px tall content, logo left, 5 links, Amazon button + red cart button right) → red hero, 2-col grid `1fr 1fr` gap 56px, 64px/72px padding, headline 86px / line-height .86 → 2-col section `1fr 420px`: left = 2x2 pack grid (20px gap), right = **sticky** (top 110px) "Try a card" panel with 10px hard shadow → full-width Amazon banner as `230px 1fr auto` grid inside 2px black border, radius 24 → teal benefits band (`320px 1fr`, 2-col checklist) → "Never played?" 2-col (rules list + card photo).

**Key components**
- *Marquee*: bg #F2B233, ink #14100F, 700 11px, letter-spacing .18em, uppercase, `translateX(0 → -50%)` over 30s linear infinite; content duplicated once.
- *Header/nav*: bg #14100F. Logo is dark artwork on transparency, so it sits on a **#FFF6E9 chip** (radius 10, padding 7px 14px, logo height 30px). Active nav link #F2B233, inactive #FFF6E9 at .78 opacity. Cart button bg #E8402A, radius 10, 700 13px.
- *Live card demo*: white card, 2px #14100F border, radius 22 (mobile) / 24 (desktop), shadow `7px 7px 0 #14100F` (mobile) / `10px 10px 0` (desktop). Word plate: bg #14100F, radius 14–16, Bricolage 800 34px (mobile) / 40px (desktop) uppercase. Taboo words: 500 16–17px uppercase, `line-through` in #E8402A 2px, each with a 16–18px #FDE3DE circle bearing a red ×. Footer bar bg #14100F holds timer readout (Bricolage 800 23–26px, turns #E8402A at ≤10s), Start/Pause button (cream), Next (desktop only), and a 66x46 / 78x50 red **BUZZ** button.
- *Product card*: white, radius 20–22, image area `aspect-ratio 4/3` (home) or `1/1` (catalog) on the product's tint color, image `object-fit: contain`, then title 700 16.5–18px, meta line 500 12.5–13px #8A7C73, price 700 17–19px #E8402A, and a "View" pill. Desktop hover: `box-shadow: 0 14px 30px rgba(20,16,15,.13)`.
- *Amazon banner*: 2px #14100F border, radius 20–24, body bg #EFE4D4, CTA panel bg #F2B233 with 2px black divider, arrow icon 16px stroke 2.4.

### 2. Catalog
**Purpose:** browse all 17 products.
- Mobile: black page header (title 42px), **sticky** horizontal filter pill row (top 0, cream bg, 1.5px #E7DCCC bottom border), then full-width list rows — 94x94 image tile (radius 16) + category pill + "Best seller" pill + title + meta + price + View.
- Desktop: black header band (title 64px), then `230px 1fr` grid gap 44px — left rail is **sticky** (collections as stacked buttons, radius 12; plus the Amazon side card), right is a **3-column product grid** (22px gap) with result count and "Sort: Featured" above it.
- Filters: All / Tabooster packs / Game Night / Apparel / Under $20. Selected pill: bg #14100F, text #FFF6E9. Unselected: transparent bg, 1.5px #DCCEBB border, #14100F text.

### 3. Product detail (PDP)
- Mobile: tinted hero block (product tint), back pill, square image, thumbnail row; then category + stock pills, title 32px, price 29px #E8402A, two body paragraphs, variant radio list, "What you get" checklist card (white body + #EFE4D4 shipping strip), sample-card black panel, "Goes well with" carousel. **Sticky bottom buy bar** (above tab bar): category + price on the left, full-width red Add-to-cart button.
- Desktop: `1fr 460px` grid gap 56px. Left column **sticky** (top 110px): square gallery (radius 26, 40px padding) + 92px thumbnails. Right column: pills → title 46px → price 36px → copy → variants → quantity stepper (radius 14, 1.5px #DCCEBB) + red Add-to-cart (19px padding, shows running total) → 2-col "What you get" checklist → black sample-card panel. Below: "Goes well with" 5-up grid.
- Variant options by category: Packs → Single pack / Two packs; Bundle → Party Pack / Two Party Packs; Apparel → Medium / Large / X-Large; Accessories, Toy → none.
- Base game PDP replaces the variant block with a bordered "Where it ships from" note and the CTA becomes "Buy on Amazon ↗", which opens the interstitial.

### 4. Cart
- Free-shipping progress card: white, radius 14–16, message 700 12.5–14px, 7–8px track (#EFE4D4) with #1F7A6B fill at `min(100%, subtotal/35)`.
- Line items: 74px (mobile) / 110px (desktop) image tile, name, variant, pill quantity stepper, line total in #E8402A, text "Remove".
- Empty state: white panel, "Your cart is empty. Suspiciously quiet." + red "Continue shopping".
- "Goes well with" upsells: Party Pack, Taboo Bob Plush, Winking Face Pin.
- Mobile totals sit in a white card with a sticky red Checkout bar; desktop uses a **sticky order-summary sidebar** (380px, radius 22).

### 5. Checkout
Three-segment progress (Cart / Details / Done — 4–5px bars, #E8402A done, #E7DCCC pending), express wallet buttons (Shop Pay black, PayPal, + Google Pay on desktop), "or pay by card" divider, then form fields in a white card (radius 18–20). Desktop form is a 2-col grid with Email and Address spanning both. Yellow (#F2B233) consent block: "Email me exclusive deals and early access to new products." Desktop shows a sticky summary with line items; place-order button shows the total.

### 6. Order confirmation
Red 84px (mobile) / 104px (desktop) circle reading "BZZT", headline "Order in." (38px / 60px), order + arrival cards, an #EFE4D4 cross-sell block for the Amazon board game, and "Back to the game". Enters with `popIn` (see Interactions).

### 7. How to play / 8. Our story
Teal (#1F7A6B) header band, 5 numbered rule steps in a bordered list (32px/42px black number chips, radius 10–12), a black "Taboosters need no batteries" panel, and the Amazon card. Our story: editorial 2-col intro (headline 42px / 68px), card photo, 4 stat cards (value in Bricolage 800 28px/42px #E8402A), and a red closing CTA band.

## Interactions & Behavior
- **Navigation**: single-page screen switching; every navigation resets scroll to top (mobile resets the scroll container, desktop `window.scrollTo`). Mobile tab bar and desktop nav highlight the active screen (mobile #E8402A vs #8A7C73; desktop #F2B233 vs #FFF6E9).
- **Card demo**: "Deal another card" / "Next" cycles a 6-card array and resets the timer to 60s. New card animates `dealIn` — `opacity 0→1, translateY(20px→0) rotate(-4deg→0) scale(.93→1)`, 400ms `cubic-bezier(.2,.9,.3,1.2)`, keyed on card index so it replays.
- **Timer**: 1s interval countdown from 60; Start/Pause/Resume; readout turns #E8402A at ≤10s; hitting 0 auto-fires the buzzer.
- **Buzzer**: WebAudio square wave 150Hz → 75Hz over 450ms, gain .16 → .001 (wrapped in try/catch); `navigator.vibrate([90,50,140])` on mobile; full-screen red (rgba(232,64,42,.94)) "BZZT!" overlay for 620ms with `buzzShake` (±8–10px translateX with ±2deg rotation).
- **Add to cart**: merges by product id + variant; button label swaps to "Added ✓" for ~1.5s; short haptic on mobile. Desktop respects the quantity stepper.
- **Amazon interstitial**: mobile = bottom sheet (radius 24 top corners, grab handle, `popIn` 280ms) over rgba(20,16,15,.55); desktop = centered 560px modal over rgba(20,16,15,.6). Both explain the cart is unaffected; "Continue to Amazon ↗" should open the Amazon listing in a new tab (currently just closes).
- **popIn** keyframe: `opacity 0→1, scale(.88–.94 → 1), translateY(10–12px → 0)`, 280–420ms.
- **Hover** (desktop only): product cards lift with `0 12–16px 26–34px rgba(20,16,15,.12–.14)`; inputs focus to `border-color: #E8402A`.
- **Responsive**: build mobile ≤767px from the mobile file, ≥1024px from the desktop file. Tablet (768–1023px) is not designed — suggested interpolation: desktop nav, 2-column catalog grid, PDP stacked with the buy panel below the gallery, cart summary below the lines.

## State Management
```
screen     'home' | 'shop' | 'pdp' | 'cart' | 'checkout' | 'done' | 'play' | 'about'
prodId     current product id (PDP)
variant    selected variant index
shot       selected gallery image index
qty        PDP quantity (desktop)
filter     active collection filter
cart       [{ id, qty, variant, price }]
cardIdx    demo card index
time       timer seconds remaining
running    timer active
buzzing    buzz overlay visible
added      "Added ✓" confirmation visible
amazon     interstitial open
```
Derived: `subtotal`, `shipping` (free at ≥$35, else $4.95), `total`, `cartCount`, `shipPct`.
Real implementation: cart state belongs in Shopify's Cart AJAX API / cart drawer; products, prices, variants, images and copy come from the Shopify product data, not hardcoded arrays.

## Design Tokens
**Color**
| Token | Hex | Use |
|---|---|---|
| Ink | #14100F | Text, headers, footer, dark panels |
| Cream | #FFF6E9 | Page background, text on dark |
| Red | #E8402A | Primary CTA, prices, accents |
| Yellow | #F2B233 | Marquee, Amazon CTA, highlights |
| Teal | #1F7A6B | Benefit band, success ticks |
| Sand | #EFE4D4 | Secondary panels, pills |
| Border | #E7DCCC | Hairlines, input borders |
| Border strong | #DCCEBB | Unselected pill borders |
| Muted text | #5A4F49 | Body copy |
| Meta text | #8A7C73 | Labels, captions |
| White | #FFFFFF | Cards |
| Blush | #FDE3DE | Taboo-word bullet |
Product tints: #E8402A, #F2B233, #1F7A6B, #8C6DD4, #2E6FB8, #B0295E, #6B4F9E, #D97534, #4FA37A, #14100F, #EFE4D4.

**Typography** — Bricolage Grotesque (600, 800) for display; DM Sans (400, 500, 700) for UI and body.
Display: 86 / 68 / 64 / 60 / 46 / 42 / 40 / 34 / 30 / 27 / 26 / 24px, weight 800, line-height .86–1.05, letter-spacing -.05em to -.025em.
Body: 20 / 18 / 17.5 / 16.5 / 16 / 15.5 / 15 / 14.5 / 14 / 13.5 / 13px, line-height 1.4–1.6.
Labels: 700 9.5–11.5px, letter-spacing .12–.22em, uppercase.
Buttons: 700 12–16.5px.

**Spacing** — 4px base. Common: 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 40, 44, 48, 56, 64, 72, 80px. Mobile gutter 18px; desktop gutter 24px inside a 1200px max-width column.

**Radius** — 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26 px; 999px pills; 50% circles.

**Shadow** — hard offsets `7px 7px 0 #14100F` (mobile card demo) and `10px 10px 0 #14100F` (desktop); soft hovers `0 12–16px 26–34px rgba(20,16,15,.12–.14)`; device frame `0 30px 70px rgba(20,16,15,.28)` (prototype only).

**Borders** — 1.5px hairlines (#E7DCCC / #DCCEBB); 2px #14100F for emphasis frames.

## Assets
All imagery is the client's own, served from the live Shopify CDN (`https://taboothegame.com/cdn/shop/files/`) and referenced by URL in both prototypes:
- Logo — `Your_paragraph_text_2.png` (dark artwork, needs a light backing; **ask the client for a reversed/light version** for dark headers)
- Hero — `Shopify6.png`
- Pop Culture pack — `box_popCulture_rev01_….png`, `card_3x_popCulture_rev01.png`
- Family pack — `box_family_rev01.png`, `card_3x_family_rev03.png`
- 90s pack — `box_90s_rev03.png`, `card_3x_90s_rev02.png`
- Board game — `24.png`, `25.png`
Icons are inline SVG (24x24 viewBox, `currentColor`, stroke-width 1.9–2.4, round caps/joins): home, grid, timer, bag, external-link arrow.
**Missing:** photography for Taboo Bob Plush and all Game Night / Apparel merch (currently tinted name tiles), plus lifestyle photography if the client wants it.

## Content
Product names, prices, descriptions and rules copy in the prototypes are taken from taboothegame.com: 3 Tabooster packs at $19.99 (Pop Culture, Family Game Night, 90s), Tabooster Party Pack $44.99 (900 cards), Taboo Bob Plush $14.99, Game Night accessories ($4.95–$35.99), apparel ($23.99–$49.00), and the Amazon-exclusive Taboo Board Game with Buzzer! at $29.99 (450 cards, buzzer, 1-minute timer, 4+ players, ages 13+). No customer reviews or ratings are shown — the live store has none; if a review app is added later, the PDP has room under "What you get".

## Files
- `TabooAppV2.dc.html` — mobile prototype (all 8 views)
- `TabooDesktopV2.dc.html` — desktop prototype (all 8 views)
- `support.js` — runtime needed to open the two prototypes locally; not part of the implementation
