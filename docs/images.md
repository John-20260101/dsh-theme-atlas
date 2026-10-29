# Image sizes / 图片尺寸规范

Every image in this repository is generated, not hand-exported: `npm run shots` renders the static preview pages at the sizes below and writes them into `assets/`. That is why the table is a contract — a size changed in `scripts/shots.mjs` without changing this document is a bug.

仓库里所有图片都是生成的：`npm run shots` 按下列尺寸渲染静态预览页并写入 `assets/`。所以这张表就是契约——改了 `scripts/shots.mjs` 却没改这里，就是 bug。

---

## 1. Shipped sizes

| # | Asset | Pixels | Ratio | Format | Purpose | Referenced by |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `assets/icon-1024.png` | 1024×1024 | 1:1 | PNG | master icon, source for the smaller cuts | this doc |
| 2 | `assets/icon-512.png` | 512×512 | 1:1 | PNG | storefront / plugin-manager tile | this doc |
| 3 | `assets/icon-180.png` | 180×180 | 1:1 | PNG | small tile, list rows | this doc |
| 4 | `assets/screenshots/00-hero-2400x1350.png` | 2400×1350 | 16:9 | PNG | README banner, social preview, contact sheet | README, `screenshots.json` |
| 5 | `assets/screenshots/01…06-*-1600x1000.png` | 1600×1000 | 16:10 | PNG | one storefront screenshot per skin (light) | `screenshots.json` |
| 6 | `assets/screenshots/07-aurora-dark-1600x1000.png` | 1600×1000 | 16:10 | PNG | dark-mode showcase | `screenshots.json` |
| 7 | `assets/screenshots/08-paper-dark-1600x1000.png` | 1600×1000 | 16:10 | PNG | high-contrast showcase | `screenshots.json` |
| 8 | `assets/keyart/<skin>-1536x1024.png` | 1536×1024 | 3:2 | PNG | material-study poster per skin, used in the theme document | `docs/themes.md` |

Eight UI images is exactly the storefront maximum (`screenshots.json` accepts 1–8); the six posters are documentation, not storefront material.

## 2. Why these numbers

- **Icon, 1024 master.** Marketplaces draw the tile at roughly 96 px. Exporting from a 1024 master keeps the geometry clean at any scale and lets the same file serve an App Store–style 512 and a 180 list row without resampling twice.
- **1600×1000, not 1920×1080.** DSH is a three-column desktop shell; 16:10 at 1600 wide is the smallest canvas where the sidebar, transcript and right panel all read without shrinking type below 11 px. It also halves cleanly to 800×500 in a detail modal.
- **2400×1350 for the banner.** 16:9 so it can be reused as a GitHub social preview without letterboxing; 2400 wide because the contact sheet carries six cards and the type has to survive being shown at ~900 px in a README.
- **1536×1024 for key art.** 3:2 prints and crops well, and matches the size the poster layout was composed for; downscaling to 1152×768 still keeps the microtype legible.
- **PNG everywhere.** The UI shots are flat colour and type — PNG is smaller than WebP here and avoids chroma artefacts on hairlines.

## 3. Display guidance

| Surface | Renders at | File to use |
| --- | --- | --- |
| dsh-market / plugin tile | ~96 px square | `icon-512.png` (never the 180) |
| Plugin detail screenshots | up to ~1200 px wide | the 1600×1000 shots |
| README banner | ~900 px wide | `00-hero-2400x1350.png` |
| Docs inline figure | 640–760 px wide | key art, or the 1600 shot scaled by CSS |
| Social preview | 1200×630 crop | hero, centre-cropped to 1.9:1 |

The 180 px icon exists for list rows and README badges; it is a downscale of the 1024 master, not a separately drawn mark.

## 4. Regenerating

```sh
npm run build      # palettes first: images are painted from derived tokens
npm run shots      # renders UI shots (dsf 2, saved at CSS size), key art, icon
```

- UI screenshots are captured with `deviceScaleFactor: 2` and saved with `scale: 'css'`, so the file is exactly 1600×1000 while the type was laid out with 2× rasterisation.
- The icon is rendered once at 1024 and cut to 512 / 180 with `sips`:

```sh
sips -z 512 512 assets/icon-1024.png --out assets/icon-512.png
sips -z 180 180 assets/icon-1024.png --out assets/icon-180.png
```

- Optional, not committed: a 1280×640 social card and a 2× (3200×2000) screenshot set. If a storefront asks for them, render at the same CSS layout and only change the export size.

## 5. Checklist before shipping an image change

1. `npm run verify` passes (the images must match a valid palette).
2. The file name still carries its pixel size — a mismatch between name and file is a documentation bug.
3. `screenshots.json` still lists exactly the UI shots, in reading order, and no key art.
4. The README and this table agree with the file listing:

```sh
ls assets/screenshots assets/keyart assets/*.png
```
