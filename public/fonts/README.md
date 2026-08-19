# Fonts

Self-hosted, both open source (OFL).

- **Archivo** — display and interface. A grotesk with enough width and weight
  to hold a dark ground.
- **Space Mono** — times and data. Times appear constantly in this product,
  and a column of times that doesn't align is the fastest way to look
  amateur.

Two formats, deliberately:

| Format | Read by | Why |
|---|---|---|
| `.woff2` | the browser | small; the variable Archivo covers 400–700 |
| `.ttf` | the card rasteriser | variable-font support in SVG rasterisers is unreliable, so the static weights (400/600/700) guarantee the exported pin matches the screen |

If you swap either family, replace **both** formats or the exported pins will
silently stop matching what the browser shows.
