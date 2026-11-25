# DESIGN.md · TIGA (Art for Earth) — UI Blueprint v2

## Brand Identity & Soul
- **Name:** TIGA · Art for Earth
- **Tagline:** *When nature loses its voice, let art speak.*
- **Philosophy:** Voice, Unity, Protect
- **Theme:** Impact of wildfires (karhutla) on forests, wildlife, and human communities in Indonesia.
- **Personality:** Bold, artistic, critical, hopeful.
- **Style:** Modern art editorial. Large typography, hairline borders, three-color collage bands, wildfire photography/video hero background.
- **Base Canvas:** White (`#ffffff`).
- **UI Language:** English (project documentation remains Indonesian).
- **Tone of Copy:** Crisp, artistic, exhibition-like. Honest and empathetic. Functional menus and actions remain straightforward. Strictly no arrows on buttons, tabs, or links (R-08).

## Three Dials (anti-slop Part 3)
- **ENERGY: 3 (Bold / Modern Art Editorial)** — Large scale Cormorant Garamond display typography, full-bleed media canvas, high contrast ink against crisp white.
- **RHYTHM: 3 (Varied & Asymmetric)** — Hero full-screen, 3-color issue banners, 3-column category tiles, 4-column artwork showcase with list/grid toggle, editorial footnotes.
- **MOTION: 2 (Deliberate & Purposeful)** — Smooth title entrance, delicate hover zoom on artwork cards, drawer slide-in, with full respect for `prefers-reduced-motion` (video paused, animations disabled).

## Color System
| Token | Hex | Role |
|---|---|---|
| `white` | `#ffffff` | Primary background canvas |
| `ink` | `#0f0f0f` | Primary text, hairlines, primary pill buttons |
| `forest` | `#1f6b45` | Forest issue group (Flora, Environment) |
| `animals` | `#2f3fa8` | Animals issue group (Fauna, Conservation & Hope) |
| `people` | `#d92e1c` | People issue group (Social Impact, Culture & Heritage), brand logo, primary hover |
| `soft` | `#f5f5f3` | Card backgrounds, drawer, inputs, notes |
| `mute` | `#6a6a6a` | Secondary text, subtle metadata |
| `line` | `#e2e2e2` | Hairline dividers and card borders |
| `cream` | `#fff1dc` | Text and badges overlaid on hero media |

Tints for dark backgrounds:
- Forest tint: `#8fe3ae`
- Animals tint: `#a8b8ff`
- People tint: `#ff8466`

Rules:
- The three colors are never combined into a single logo mark.
- The artwork remains the hero. The three colors are accents for categories, tags, and issue tiles.

## Typography
- **Display:** `Cormorant Garamond` (weight 600, italic 500/600) — Titles, artwork titles, large numbers.
- **Body & UI:** `Montserrat` (weight 400, 500, 600) — Body copy, navigation, buttons, metadata.
- Hero H1: `clamp(50px, 9vw, 148px)`, line-height `.88`.
- Page H1: `clamp(44px, 7vw, 96px)`.
- Section H2: `clamp(30px, 4vw, 48px)`.
- Artwork title: `22px` (Cormorant Garamond).
- Small labels: `11–12px`, uppercase, letter-spacing `.14–.2em`.

## Anti-Slop Enforcement
- No em dashes (`—`) in UI copy (R-02).
- No buzzwords like "Next-Gen", "AI-Powered", "Revolutionary" (R-16).
- No button arrows (`→`, `↗`) as decoration (R-08).
- Accessible 44px minimum tap target on mobile (R-03).
- WCAG AA contrast on both light background and dark video overlays (R-25).
- Visible keyboard focus rings and ESC-closable drawers/dialogs (R-32).
