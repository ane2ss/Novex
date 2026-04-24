# Design System Document: The Midnight Atelier

## 1. Overview & Creative North Star
**Creative North Star: The Midnight Atelier**
This design system is a sophisticated evolution of the "Digital Atelier" philosophy, reimagined for a high-end dark mode experience. It moves away from the sterile, "flat" web by embracing the depth of a physical workshop at twilight. We treat the interface not as a screen, but as a curated space of layered surfaces, luminous accents, and editorial precision.

The system breaks the "template" look through **intentional asymmetry** and **tonal depth**. Rather than using rigid grids and stark borders, we guide the user’s eye through light, shadow, and scale. Every element should feel like it was hand-placed on a desk of deep slate and navy, illuminated by the soft glow of indigo and lavender light.

---

## 2. Colors
Our palette is rooted in the deep obsidian of `#0b1326`, layered with sophisticated slates and navies to create a sense of infinite space.

### The "No-Line" Rule
To maintain a premium, editorial feel, **1px solid borders for sectioning are strictly prohibited.** Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-low` (`#131b2e`) section should sit directly against the `surface` (`#0b1326`) background to create a "carved" effect rather than a "boxed" one.

### Surface Hierarchy & Nesting
Depth is achieved by "stacking" the surface-container tiers. Treat the UI as a series of physical layers where inner containers use a slightly higher tier to define importance:
- **Base Layer:** `surface` (#0b1326)
- **Secondary Areas:** `surface_container_low` (#131b2e)
- **Primary Content Cards:** `surface_container` (#171f33)
- **Floating/Elevated Elements:** `surface_container_high` (#222a3d)

### The "Glass & Gradient" Rule
To avoid a static "out-of-the-box" feel, use **Glassmorphism** for floating elements (navbars, tooltips, overlays). Use `surface_container_highest` with a `0.6` opacity and a `20px` backdrop-blur. 

### Signature Textures
Main CTAs and hero backgrounds should utilize a "soulful" gradient rather than flat fills. Transition from `primary_container` (`#4a40e0`) to a deeper indigo to provide a professional, three-dimensional polish that mimics a soft light source hitting a surface.

---

## 3. Typography: The Editorial Voice
We use **Plus Jakarta Sans** as our sole typeface. The brand identity is conveyed through a high-contrast scale that favors dramatic headers and generous breathing room.

- **Display & Headlines:** Use `display-lg` (3.5rem) and `headline-lg` (2rem) for hero moments. These should feel authoritative and architectural.
- **Body & Labels:** Use `body-lg` (1rem) for readability. Ensure all body text uses `on_surface_variant` (`#c7c4d8`) to reduce eye strain, reserving `on_surface` (`#dae2fd`) for high-priority headings.
- **Hierarchy through Contrast:** Instead of varying weights, prioritize size and color. A `label-md` in `primary` (`#c3c0ff`) often carries more visual weight than a larger headline in a neutral tone.

---

## 4. Elevation & Depth
Elevation in this system is an atmospheric quality, not just a drop shadow.

### The Layering Principle
Depth is achieved by "stacking" surface tiers. Place a `surface_container_lowest` card on a `surface_container_low` section to create a soft, natural lift. This creates a "recessed" look that feels premium and tactile.

### Ambient Shadows
When an element must float (e.g., a dropdown or modal), shadows must be extra-diffused. 
- **Shadow Property:** `0px 20px 40px rgba(0, 0, 0, 0.4)`
- **Luminous Tint:** Add a secondary shadow layer with a tinted indigo glow (`#4a40e0` at 5% opacity) to mimic the way light reflects off high-end navy materials.

### The "Ghost Border" Fallback
If a border is required for accessibility, it must be a **Ghost Border**. Use the `outline_variant` token at 15% opacity. Never use 100% opaque, high-contrast borders.

---

## 5. Components

### Buttons
- **Primary:** A soft gradient of `primary_container` (`#4a40e0`) with `on_primary_container` text. 
- **Secondary:** No fill. Use a Ghost Border (`outline_variant` at 20%) with `primary` text.
- **Corner Radius:** Always use `full` (9999px) for buttons to contrast against the `xl` (1.5rem) radius of cards.

### Chips
- **Selection/Filter:** Use `surface_container_highest` for the background with a subtle `primary` glow on the text when active. No borders.

### Cards & Lists
- **Prohibition:** Divider lines are forbidden.
- **Separation:** Separate list items using vertical white space (16px–24px) or a 2% shift in surface color on hover. Use the `md` (0.75rem) roundedness for small internal elements and `xl` (1.5rem) for main containers.

### Input Fields
- **Background:** `surface_container_lowest` (#060e20).
- **State:** On focus, the background remains dark, but a 1px "Ghost Border" of `primary` appears, accompanied by a soft `surface_tint` outer glow.

---

## 6. Do’s and Don'ts

### Do:
- **Use "Active White Space":** Allow elements to breathe. Use the `xl` corner radius to create "softness" in a dark environment.
- **Prioritize Tonal Shifts:** Distinguish a sidebar from a main content area using `surface` vs `surface_container_low`.
- **Embrace Asymmetry:** Place a large `display-sm` headline off-center to create an editorial, hand-crafted feel.

### Don’t:
- **Don’t use pure black:** It kills the "Atelier" depth. Always stick to the navy/slate background tokens.
- **Don’t use standard drop shadows:** Avoid the "dirty" look of grey shadows. Use deep navy or tinted indigo blurs.
- **Don’t use dividers:** If you feel the need for a line, increase your padding or shift your surface color instead.