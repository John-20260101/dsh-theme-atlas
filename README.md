# dsh-theme-atlas

**Nine skins for the DeepSeek Harness Web GUI — six material studies and three Leshan photo skins. One token engine, light and dark, switched from inside the app.**

[中文说明](./README.zh.md) · [Theme document](./docs/themes.md) · [Palette reference](./docs/palettes.md) · [Image sizes](./docs/images.md)

![Atlas × Leshan — three photo skins](./assets/screenshots/00b-leshan-2400x1350.jpg)

Atlas is a theme *pack*, not a single recolour. Each skin declares six input colours per appearance; the engine derives the 119 `--dsw-*` alias tokens the Web shell reads from them, then measures the result. Nine skins × two appearances = eighteen palettes that all share the same semantic rules, so a state that reads in light mode reads in dark.

Two series live in the pack:

- **Material studies** — abstract surfaces (jade, clay, aurora, deep water, blossom, paper), each a colour climate with its own signature wash.
- **乐山 Leshan** — three photographs, provided by the author, used as full-bleed wallpapers. The panels above them turn into frosted plates (translucent surface tokens), and a scrim keyed to the active appearance keeps body text above 15:1.

## The nine skins

| Skin | Material | Accent light / dark | Body contrast | Preview |
| --- | --- | --- | --- | --- |
| **墨玉 Ink Jade** | 和田青玉 · 宣纸 / Hetian jade on rice paper | `#2E6B57` / `#74C3A2` | 15.6:1 / 16.0:1 | [light](./assets/screenshots/01-ink-jade-light-1600x1000.jpg) |
| **赤陶 Terracotta** | 未上釉的陶土 · 砂 / Unglazed clay and sand | `#AE5229` / `#E08C5F` | 14.9:1 / 15.0:1 | [light](./assets/screenshots/02-terracotta-light-1600x1000.jpg) |
| **极光 Aurora** | 极地冰晶 · 夜光 / Polar ice and night glow | `#16758F` / `#55D6D2` | 15.5:1 / 16.3:1 | [light](./assets/screenshots/03-aurora-light-1600x1000.jpg) |
| **深海 Abyss** | 深海蓝 · 微光 / Deep water and faint light | `#1B58B4` / `#5B8DEF` | 15.9:1 / 16.1:1 | [light](./assets/screenshots/04-abyss-light-1600x1000.jpg) |
| **樱雾 Sakura Mist** | 薄樱 · 雾面 / Thin blossom on mist | `#B1436B` / `#E78BA8` | 15.1:1 / 15.8:1 | [light](./assets/screenshots/05-sakura-light-1600x1000.jpg) |
| **素笺 Paper** | 无涂布纸 · 墨 / Uncoated paper and ink | `#1F1F1F` / `#E8E8E8` | 17.9:1 / 16.9:1 | [light](./assets/screenshots/06-paper-light-1600x1000.jpg) |
| **三江夜 River Night** | 乐山 · 三江 / Leshan, three rivers | `#A9552F` / `#C97A50` | 15.4:1 / 15.9:1 | [light](./assets/screenshots/09-sanjiang-light-1600x1000.jpg) · [dark](./assets/screenshots/12-sanjiang-dark-1600x1000.jpg) |
| **凌云晚照 Lingyun Dusk** | 乐山 · 崖壁 / Leshan, cliff at dusk | `#8A6320` / `#D3A961` | 15.4:1 / 16.5:1 | [light](./assets/screenshots/10-lingyun-light-1600x1000.jpg) |
| **峨眉夜雾 Emei Mist** | 乐山 · 雾与月色 / Leshan, mist and moonlight | `#25618F` / `#7FB2E8` | 16.1:1 / 15.7:1 | [light](./assets/screenshots/11-emei-light-1600x1000.jpg) |

Dark examples: [Aurora dark](./assets/screenshots/07-aurora-dark-1600x1000.jpg) · [Paper dark](./assets/screenshots/08-paper-dark-1600x1000.jpg) · [River Night dark](./assets/screenshots/12-sanjiang-dark-1600x1000.jpg). Full palettes, token tables and measured contrast live in [docs/palettes.md](./docs/palettes.md).

### 乐山 · Leshan

![Leshan key art — River Night](./assets/keyart/sanjiang-1536x1024.jpg)

The three photographs are used at their native resolution and cover-cropped by the shell. The host half serves them from `/dsh-theme-atlas/wallpapers/<file>` through an exact-file whitelist (immutable caching, HEAD, 304); without a `webServer` service the skin falls back to its wash and stays fully usable.

| Skin | Photograph | Native size | Dark | Light |
| --- | --- | --- | --- | --- |
| 三江夜 River Night | `leshan-sanjiang-1448x1086.jpg` | 1448×1086 | `assets/keyart/sanjiang-1536x1024.jpg` | [shot](./assets/screenshots/09-sanjiang-light-1600x1000.jpg) |
| 凌云晚照 Lingyun Dusk | `leshan-lingyun-1536x1024.jpg` | 1536×1024 | `assets/keyart/lingyun-1536x1024.jpg` | [shot](./assets/screenshots/10-lingyun-light-1600x1000.jpg) |
| 峨眉夜雾 Emei Mist | `leshan-emei-1536x1024.jpg` | 1536×1024 | `assets/keyart/emei-1536x1024.jpg` | [shot](./assets/screenshots/11-emei-light-1600x1000.jpg) |

## Install

```sh
# Web profile, straight from GitHub
dsh plugin --profile web add github:John-20260101/dsh-theme-atlas
```

Desktop: **插件 → 添加插件**, paste `github:John-20260101/dsh-theme-atlas`, enable it, then reload the window if the shell asks.

The plugin is a normal bundle: `package.json` declares `dsh.bundle` + a `cordis.patch.yml`, so `dsh plugin add` can load it. There is no build step to approve — `client.js` ships prebuilt.

## Switch skins

- Click the **Atlas** pill at the bottom-right of the window, or press <kbd>Alt</kbd>+<kbd>K</kbd> to cycle.
- The choice is browser-local (`localStorage: dsh.theme-atlas.skin`), so different browsers can run different skins.
- “隐藏此钮” hides the pill (`dsh.theme-atlas.rail`); <kbd>Alt</kbd>+<kbd>K</kbd> keeps working, and clearing that key brings the pill back.
- Light/dark still belongs to the shell’s own **Appearance** setting — Atlas has both palettes and never overrides your preference.

## What it actually does

1. **Token layer.** On load it calls `ctx.theme.overrideTokens('dsh-theme-atlas', layer)`, where `layer` maps every `--dsw-*` alias token to a `{ light, dark }` pair. Switching a skin replaces that layer; unloading the plugin removes it. On a shell without the theme service it falls back to a scoped stylesheet with the same values.
2. **Signature wash.** One small plugin-owned stylesheet adds the skin’s page gradient, selection colour and focus ring, keyed by `html[data-dsh-atlas]`. For the Leshan skins the same sheet paints the photograph on `<body>` under an appearance-keyed scrim, and the derived surface tokens carry alpha so the panels read as frosted plates. No layout is touched.
3. **Skin rail.** A shadow-DOM panel so no shell rule can reach it, keyboard reachable, removed with the plugin.

Nothing else is written: no host settings document, no files, no network calls.

## Images in this repo

| Set | Size | Count | Where |
| --- | --- | --- | --- |
| Storefront screenshots | 1600×1000 (16:10) | 12 | [`assets/screenshots/`](./assets/screenshots) |
| Contact sheets / banners | 2400×1350 (16:9) | 2 | [`assets/screenshots/`](./assets/screenshots) — materials, Leshan |
| Key art | 1536×1024 (3:2) | 9 | [`assets/keyart/`](./assets/keyart) |
| Leshan wallpapers | native 1448×1086 / 1536×1024 | 3 | [`assets/wallpapers/`](./assets/wallpapers) |
| Storefront icon | 1024, 512, 180 square | 3 | [`assets/`](./assets) |

Sizes, display guidance and regeneration commands are specified in [docs/images.md](./docs/images.md); `screenshots.json` points the storefront at the eight UI shots.

## Compatibility

- DeepSeek Harness Web **0.2.0-rc.1 … 0.2.x** (`dsh.bundle` + `dsh.client`).
- Works in the official Desktop app and in `dsh web`; needs a browser with `color-mix()` (Chromium 111+, Safari 16.2+).
- If the theme service is absent, the fallback layer still applies both palettes.

## Develop

```sh
npm install
npm run verify   # build + token completeness + WCAG gates
npm run shots    # re-render every image at the documented size
```

Source layout: `src/color.mjs` (colour maths), `src/tokens.mjs` (the 119-name contract), `src/skins.mjs` (nine skins, six inputs per appearance), `src/derive.mjs` (role derivation, plus the translucent-plate mode for photo skins), `src/runtime.mjs` (tokens, wallpapers, rail), `index.js` (the wallpaper route). `client.js` is generated — edit `src/` and run `npm run build`.

Adding a skin is one row in `src/skins.mjs`; run `npm run verify` and the contrast gate tells you whether the two new palettes hold up.

## License

MIT. Palette names and copy are original to this repository; the `--dsw-*` token names belong to DeepSeek Harness.
