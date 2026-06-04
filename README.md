# SVGoat

Minimal, opinionated SVG optimizer in the browser. Inspired by [SVGOMG](https://jakearchibald.github.io/svgomg/), but without knobs: one frozen SVGO preset, instant results, copy and go.

Everything runs locally in your browser. Nothing is uploaded.

## Features

- **Drop or paste** an SVG (file picker, drag & drop, or paste anywhere on the page)
- **Automatic optimization** as soon as input is provided
- **Stats** — size before → after and relative savings; source dimensions when available
- **Preview** — rendered optimized SVG to check nothing broke
- **Copy** — button or **⌘C** / **Ctrl+C** when a result is ready (native copy still works if you select text, e.g. an error message)
- **Large files** — soft warning from 2 MB; processing continues

No markup editor, no plugin toggles, no account.

## Stack

- [Vite](https://vite.dev/)
- [Alpine.js](https://alpinejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SVGO](https://svgo.dev/) (browser bundle)
- [DOMPurify](https://github.com/cure53/DOMPurify) for safe inline preview

## Development

Requires [Bun](https://bun.sh/).

```bash
bun install
bun run dev
```

Other commands:

```bash
bun run build    # typecheck + production build → dist/
bun run preview  # serve dist/ locally
```

## SVGO configuration

The optimization preset is fixed in [`src/config/svgo.json`](src/config/svgo.json) (explicit plugin list, including `removeDimensions`). It is loaded via [`src/config/svgo-config.ts`](src/config/svgo-config.ts). Change the JSON and rebuild to adjust behavior; the UI never exposes settings.

## Deployment

Pushes to `main` deploy to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) (Bun install, `bun run build` with `--base=/images/` for that environment).

For a root-hosted build:

```bash
bun run build
```

Serve the `dist/` directory with any static host.

## License

Private project (`package.json` → `"private": true`). Add a license file if you open-source it.
