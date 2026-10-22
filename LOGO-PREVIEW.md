# Logo comparison — development branch only

This branch previews the supplied Sail Lore logo in blue and monochrome. Do not merge it into `main` until a treatment has been chosen and preview-only controls have been removed.

- `/logo-preview/` compares both versions at large and header sizes.
- `/` shows the logo in the actual header; the bottom-left Color/Monochrome controls switch its treatment.
- `components/site/BrandLogo.tsx` shares one transparent preview asset between both treatments. Monochrome is a display filter, preserving the same shape and lettering.
- The preview asset was prepared from the attached image. For final production, prefer an original logo export (ideally SVG or a transparent PNG) to preserve the master artwork faithfully.
- After choosing, remove the comparison route/control panel, retain the selected header treatment, and review before merging into `main`.

Build, lint, and browser checks passed at 320, 390, 768, and 1440 pixels, including the header collapse, variant switching, image loading, comparison layout, and mobile menu.
