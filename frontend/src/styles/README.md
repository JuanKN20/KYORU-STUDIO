# Frontend stylesheet structure

`src/index.css` is the only stylesheet entry point. Its imports are ordered to preserve the original Tailwind cascade:

1. `foundation.css` — design tokens, document defaults, background, and global focus behavior.
2. `primitives.css` — shared `akai-*` layout, surface, button, chip, and heading primitives.
3. `navigation.css` — fixed navbar and accessible mobile menu, including their responsive rules.
4. `home.css` — Home sections and the public footer in their original source order.
5. `experience.css` — creation intro, keyframes, responsive overrides, hover-capable interactions, and reduced-motion behavior shared by the public experience.
6. `admin.css` — administration-only surfaces, controls, and motion overrides.

All modules retain their original Tailwind `@layer` assignment. Do not reorder these imports without comparing the compiled CSS, because later component rules intentionally depend on source order.

## Historical naming

The `akai-*` custom properties, utility classes, Tailwind tokens, shadows, and grid names remain active compatibility identifiers. They are used by public pages and the admin interface. Rename them only in a dedicated migration that updates every JSX consumer, Tailwind configuration, stylesheet selector, responsive override, and visual regression baseline together.
