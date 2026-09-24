# AI Editorial Video Generation

Code-driven "mosaic reveal" videos: a fixed grid of cells covers the frame,
and each cell independently swaps to the next photo in a staggered wave,
reassembling into a full image cell by cell. Matches the reference reels'
tiled-photo-wipe style — no flying pieces, no rotation, no drop shadows.

## Stack

[Remotion](https://www.remotion.dev/) — React components render frame-by-frame
to video. Grid layout and per-scene timing/reveal direction are config, so a
new video is a new scene list + images, not new code.

## Structure

- `src/MosaicReveal.tsx` — the composition: a `columns x rows` grid; each cell
  works out which scene it's currently showing and crossfades on its own
  staggered schedule.
- `src/revealOrder.ts` — reveal direction patterns (bottom-up, top-down,
  left-right, right-left, diagonal, random) plus per-cell timing jitter so the
  sweep doesn't look mechanical.
- `src/types.ts` — `MosaicScene` / `MosaicGrid` config shape.
- `src/textures.ts` — paper/grain textures pulled from the Figma texture
  library; used for the grid's grout background and the global film-grain
  overlay.
- `src/scenes/mosaicExample.ts` — placeholder scene (flat colors, no assets
  needed).
- `public/images/` — drop real images here, referenced by path per scene.

## Usage

```bash
npm install
npm start            # opens Remotion Studio to preview/scrub scenes live
npm run render        # renders -> out/video.mp4
```

To make a new video: add photos to `public/images/`, write a new
`MosaicScene[]` (one full image per scene — it gets divided across the grid
cells automatically; see `src/scenes/mosaicExample.ts`), point `src/Root.tsx`
at it, and render. Each cell shows the same shared image cropped to its grid
position, so scene images should be shot/framed for the full 1080x1920 canvas.

## Notes

This environment's network egress blocks Remotion's own Chrome download, so
`remotion.config.ts` points at the Chromium headless shell already installed
at `/opt/pw-browsers/`. If rendering elsewhere, remove that line so Remotion
downloads its own browser.
