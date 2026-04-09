# Callendar Design System — Dashboard
> Extracted from `overview/page.tsx` (source of truth). Apply to every dashboard page without deviation.

---

## 1. Color Tokens

### Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| `bg-page` | `#0A0A0B` | Page root background |
| `bg-surface` | `#121216` | Cards, panels, sidebar |
| `bg-surface-raised` | `#0D0D11` | Nested cards within surface (e.g. credits sub-cards) |
| `bg-overlay` | `black/20` (`rgba(0,0,0,0.2)`) | Panel headers, inset sections |

### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border-default` | `#212129` | All card borders, dividers, table rows |
| `border-accent` | `#2DD4BF/40` | Hover state on interactive cards |
| `border-accent-dim` | `#2DD4BF/20` | Icon container borders, badge borders |

### Text
| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#FFFFFF` | Headings, values, primary content |
| `text-secondary` | `white/50` (`rgba(255,255,255,0.5)`) | Row labels, secondary labels |
| `text-muted` | `white/30` (`rgba(255,255,255,0.3)`) | Helper text, timestamps, metadata |
| `text-micro` | `white/20` (`rgba(255,255,255,0.2)`) | Empty states, placeholders |
| `text-accent` | `#2DD4BF` | Active values, links, CTA text, icon color |
| `text-warning` | `amber-400` | Low credits, warning states |
| `text-danger` | `red-400` | Error, inactive, offline states |

### Accent / Brand
| Token | Value | Usage |
|-------|-------|-------|
| `accent-primary` | `#2DD4BF` | CTAs, active nav, progress bars, success, icon backgrounds |
| `accent-primary-bg` | `#2DD4BF/10` | Icon container fill, badge background, glow base |
| `accent-primary-border` | `#2DD4BF/20–25` | Icon container border, badge border |
| `accent-glow` | `shadow-[0_0_12-14px_rgba(45,212,191,0.25-0.45)]` | Active badges, progress bar glow, hover glow |
| `accent-warning` | `amber-500/10` bg, `amber-500/20` border, `amber-400` text | Warning badges, low credit states |
| `accent-danger` | `red-500/10` bg, `red-500/20` border, `red-400` text | Inactive/offline badges |

### Decorative
| Token | Value | Usage |
|-------|-------|-------|
| `glow-blob` | `#2DD4BF/10 blur-3xl` | Hero card ambient background glow |

---

## 2. Typography

### Fonts
- **Display / Headings:** `var(--font-syne)` — Syne (Google Font). Applied via `style={{ fontFamily: 'var(--font-syne)' }}` inline.
- **UI / Body:** Tailwind default (Geist or system). No inline style needed.

### Scale
| Role | Class | Notes |
|------|-------|-------|
| Page title | `text-4xl md:text-5xl font-semibold tracking-tight leading-none` + Syne | Clinic name in hero |
| Section heading | `text-lg font-semibold` + Syne | Panel titles (Live Call Stream, Performance Summary) |
| Stat value | `text-3xl font-semibold tracking-tight tabular-nums` + Syne | Stat card numbers |
| Credits value | `text-2xl md:text-3xl font-semibold tracking-tight` + Syne | Credits balance |
| Sub-value | `text-2xl font-semibold tracking-tight` + Syne | Credits sub-card numbers |
| Row label | `text-sm font-semibold text-white/50` | Performance summary labels |
| Row value | `text-sm font-semibold text-white tabular-nums` + Syne | Performance summary values |
| Label micro | `text-[10px] font-black uppercase tracking-[0.2em]` | Stat card labels, section eyebrows |
| Label badge | `text-[10px] font-black uppercase tracking-widest` | All pill/badge text |
| Call name | `text-sm font-semibold` | Call list patient name |
| Call meta | `text-[10px] font-mono` | Phone numbers in call list |
| Duration | `text-[11px] font-semibold tabular-nums` | Call duration |
| Timestamp | `text-[9px] font-black uppercase tracking-widest` | Call timestamps |
| Helper text | `text-[11px]` or `text-xs` | Stat card helper, sub-card helper |
| Page subtitle | `text-sm md:text-base uppercase tracking-tight` + Syne | "Overview Dashboard" |
| Greeting | `text-[10px] font-black uppercase tracking-[0.2em]` | "Good morning" eyebrow |

### Rules
- `font-black uppercase tracking-widest` = all labels, badges, eyebrows. Never use for body text.
- `tabular-nums` on every numeric value.
- Syne only on display-size values and headings. UI text uses default font.
- No `font-bold` — use `font-semibold` (600) for values, `font-black` (900) for micro labels only.

---

## 3. Component Patterns

### Stat Card
```
rounded-2xl border border-[#212129] bg-[#121216] p-5
hover:-translate-y-0.5 hover:border-[#2DD4BF]/40
transition-all duration-200
```
Interior layout: left col (label → value → helper) + right col (icon container).

**Icon container:**
```
rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 p-3
```
Icon: `size-5 text-[#2DD4BF]`

**Label:** `text-[10px] font-black uppercase tracking-[0.2em] text-white/30`
**Value:** `mt-4 text-3xl font-semibold tracking-tight text-white tabular-nums` + Syne
**Helper:** `mt-2 text-[11px] text-white/30`

### Panel / Section Card
```
rounded-2xl border border-[#212129] bg-[#121216] overflow-hidden
```
**Panel header:**
```
flex items-center justify-between px-6 py-5 border-b border-[#212129] bg-black/20
```
Header eyebrow: `text-[10px] font-black uppercase tracking-[0.2em] text-white/30`
Header title: `text-lg font-semibold text-white mt-1` + Syne

### Hero / Page Header Card
```
relative rounded-3xl border border-[#212129] bg-[#121216] p-6 md:p-8 overflow-hidden
```
Decorative glow blob (top-right):
```
absolute -top-24 -right-10 h-48 w-48 rounded-full bg-[#2DD4BF]/10 blur-3xl
```

### Status Badge / Pill
Base:
```
inline-flex items-center gap-2 px-4 py-2 rounded-full border
text-[11px] font-black uppercase tracking-widest
```
**Active (teal):**
```
bg-[#2DD4BF]/10 border-[#2DD4BF]/25 text-[#2DD4BF]
shadow-[0_0_12px_rgba(45,212,191,0.25)]
```
**Warning (amber):**
```
bg-amber-500/10 border-amber-500/20 text-amber-400
shadow-[0_0_12px_rgba(245,158,11,0.2)]
```
**Danger (red):**
```
bg-red-500/10 border-red-500/20 text-red-400
```
Animated dot: `size-2 rounded-full bg-[#2DD4BF] animate-pulse`

Small status tag (non-pill):
```
px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full
border border-white/10 text-white/40
```

### Booked Badge (inline list)
```
px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-full
bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20
```

### Progress Bar
Container:
```
h-2 rounded-full bg-black/40 border border-[#212129] overflow-hidden
```
Fill (normal):
```
h-full bg-[#2DD4BF] shadow-[0_0_12px_rgba(45,212,191,0.45)] transition-all duration-500
```
Fill (warning):
```
h-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all duration-500
```
Thin variant (performance panel): `h-1.5` with `bg-[#2DD4BF] shadow-[0_0_12px_rgba(45,212,191,0.4)]`

### Divider Row (list items)
```
divide-y divide-[#212129]
```
Row: `flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-colors`

### Link (panel corner)
```
text-[10px] font-black uppercase tracking-widest text-[#2DD4BF]
hover:text-[#2DD4BF]/70 transition-colors
```
With icon: `flex items-center gap-1` + `ArrowUpRight size-3`

### Nested Sub-Card (inside credits panel)
```
rounded-xl border border-[#212129] bg-black/20 p-4
```
Label: `text-[10px] font-black uppercase tracking-[0.2em] text-[#2DD4BF]/80` (teal variant)
or `text-white/40` (neutral variant)
Value: `mt-3 text-2xl font-semibold tracking-tight text-white` + Syne
Helper: `text-xs text-white/30 mt-1`

---

## 4. Spacing & Layout

### Page Wrapper
```
px-6 py-8 lg:px-10 lg:py-12 max-w-[1600px] mx-auto
```

### Section Gaps
- Between stat cards: `gap-4`
- Between major sections: `mb-6`
- Page header to first section: `mb-8`

### Grid
- Stat cards: `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4`
- Two-column panels: `grid grid-cols-1 lg:grid-cols-2 gap-6`
- Credits sub-cards: `grid grid-cols-1 md:grid-cols-3 gap-4`

### Border Radius
- Page hero: `rounded-3xl`
- Panels / stat cards: `rounded-2xl`
- Sub-cards, icon containers: `rounded-xl`
- Badges (pills): `rounded-full`
- Small badges (inline): `rounded-full`
- Progress bars: `rounded-full`

---

## 5. Motion & Interaction

```
transition-all duration-200   /* stat card hover */
transition-colors              /* row hover, link hover */
transition-all duration-500   /* progress bar fill */
transition-all duration-700   /* performance bar fill */
hover:-translate-y-0.5        /* stat card lift */
hover:border-[#2DD4BF]/40    /* stat card border glow */
hover:bg-white/[0.03]         /* list row background */
animate-pulse                 /* status dots */
```

No bounce. No spring. No `duration-1000+`. Every motion is functional.

---

## 6. Empty States

```
px-6 py-12 text-center text-xs font-black uppercase tracking-widest text-white/20
```
Examples: `"Waiting for system activity..."` / `"Syncing monthly data..."`

---

## 7. Error State

```
bg-[#121216] border border-[#212129] rounded-2xl p-6 text-red-400
```
Title: `font-semibold` + Syne
Body: `text-sm text-red-400/70 mt-1`

---

## 8. Loading Indicator

```
fixed bottom-6 right-6 text-[10px] font-black uppercase tracking-widest text-white/40
```
Text: `"Syncing..."`

---

## 9. Page-by-Page Application Rules

Apply the above system to every dashboard page. Page-specific notes:

**Operations (Call Logs)**
- Use Panel pattern with `divide-y divide-[#212129]` row list or a table with `hover:bg-white/[0.03]`
- After-hours badge: amber variant
- Booked badge: teal variant
- Transcript drawer: surface `#121216`, border `#212129`

**Profiles (Appointments)**
- Table rows follow divider row pattern
- Status badges: `Booked` = teal, `Cancelled` = red/danger variant
- Summary bar above table: use sub-card pattern `rounded-xl border border-[#212129] bg-black/20`

**Reports**
- Monthly report cards: panel pattern
- Charts: use the following series colors in order — `#2DD4BF` (teal), `#A78BFA` (violet), `#FB923C` (amber-orange), `#F472B6` (rose)
- Grid lines: `#212129`, axis labels: `white/30`
- Empty/ghost bars: `rgba(255,255,255,0.15)`
- No chart libraries with default color palettes — override every color to match system
- Never use blue `#3B82F6`, cyan `#40E0FF`, or purple `#8B5CF6` — these are removed from the chart palette

**Settings**
- Form inputs: `bg-black/20 border border-[#212129] rounded-xl px-4 py-3 text-white text-sm`
- Focus: `focus:border-[#2DD4BF]/60 focus:outline-none`
- Toggle (is_active): teal when on, red/danger when off
- Section groupings: panel pattern with header

---

## 10. What Codex Must Never Do

- Use `bg-white`, `bg-gray-*`, `bg-slate-*` anywhere in the dashboard
- Use `text-gray-*` — always use `text-white/*` opacity variants
- Use `border-gray-*` — always `border-[#212129]` or `border-[#2DD4BF]/*`
- Add purple, indigo, or blue accents — teal only
- Add `rounded-lg` on cards — must be `rounded-2xl` or `rounded-xl`
- Use `font-bold` — use `font-semibold` or `font-black` only
- Skip `tabular-nums` on any number
- Use default shadcn component styling — always override to match system
- Add new animation types not listed in section 5
- Use `Inter`, `Roboto`, or system fonts — Syne for display, Geist for UI

---