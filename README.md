# AI Editorial Video Generation

Code-driven "collage reveal" videos — photo/video tiles fly in and assemble
into a layout, matching the polaroid/print-collage style used in the
reference reels.

## Stack

[Remotion](https://www.remotion.dev/) — React components render frame-by-frame
to video. All layout, timing, and rotation is defined in scene configs, so a
new video is just a new config + assets, not new code.

## Structure

- `src/CollageReveal.tsx` — the composition: sequences scenes back to back.
- `src/CollageTile.tsx` — a single tile's fly-in/settle animation.
- `src/types.ts` — `Tile` / `Scene` config shape.
- `src/scenes/example.ts` — placeholder scene (flat colors, no assets needed).
- `public/images/` — drop real images/video clips here, referenced by path.

## Usage

```bash
npm install
npm start            # opens Remotion Studio to preview/scrub scenes live
npm run render        # renders src/scenes/*.ts -> out/video.mp4
```

To make a new video: add images to `public/images/`, write a new `Scene[]`
(position/size/rotation/timing per tile — see `src/scenes/example.ts`), point
`src/Root.tsx` at it, and render.

## Notes

This environment's network egress blocks Remotion's own Chrome download, so
`remotion.config.ts` points at the Chromium headless shell already installed
at `/opt/pw-browsers/`. If rendering elsewhere, remove that line so Remotion
downloads its own browser.
