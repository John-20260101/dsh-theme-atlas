# Changelog

## 0.2.2 — 2026-10-31

- Fixed the desktop shell hanging on the "Loading plugins…" boot screen. The browser half parked a
  `ctx.inject(['theme'])` fiber for a service the desktop shell never provides; that pending fiber kept
  the shell's own `uiRenderer` mount from settling, so the app never left the boot page. Late arrival is
  now handled by re-reading the service on every repaint instead of parking a fiber.
- Added a strict-injection browser case: the client test now applies the bundle against a
  proxy that throws on undeclared service reads and asserts the scoped stylesheet fallback
  plus the rail still land, and that no injection is parked for `theme`.
- Fixed the desktop shell failing to boot with `web boot: 1 entry did not activate` /
  `dsh-theme-atlas: failed`. The browser half read `ctx.theme` directly while declaring
  `inject: []`; cordis 4 throws `cannot get property "theme" without inject` on that read,
  before the `typeof` fallback guard could run. The service is now discovered through
  `ctx.get('theme')`, which stays silent when no provider exists.

## 0.2.1 — 2026-10-30

- Compressed the shipped image set from ~21 MB to ~3.8 MB: UI screenshots and key art are JPEG (q86 4:4:4 / q84), wallpapers re-encoded at q78, icons palette-quantised PNG.
- Added `scripts/compress.py`; `npm run shots` now renders then compresses.

## 0.2.0 — 2026-10-30

- Added the **乐山 Leshan** series: three photo skins (三江夜 River Night, 凌云晚照 Lingyun Dusk, 峨眉夜雾 Emei Mist) using author-provided photographs as full-bleed wallpapers.
- Photo skins emit translucent surface tokens (frosted plates) and an appearance-keyed scrim (light 0.86–0.90, dark 0.74–0.82).
- Host half now serves `assets/wallpapers/*` over an exact-file whitelist route with ETag/304/HEAD; without `webServer` the skins fall back to their wash.
- Skin rail groups the pack into MATERIAL and LESHAN sections.
- New images: Leshan triptych (2400×1350), four Leshan UI shots (1600×1000), three photo key-art posters (1536×1024) and three native-resolution wallpapers.
- Renderer now fails loudly on canvas overflow; added a host-route test and wallpaper assertions to the browser smoke test.

## 0.1.0 — 2026-10-29

- Initial release: six skins (Ink Jade, Terracotta, Aurora, Abyss, Sakura Mist, Paper), each with light and dark appearances.
- Token engine derives all 119 `--dsw-*` alias tokens from six inputs per appearance; contrast gate in `scripts/verify.mjs`.
- In-app skin rail with `Alt+K` cycling, browser-local persistence and a hide control.
- Scoped fallback stylesheet for shells without `ctx.theme.overrideTokens`.
- Preview pipeline (`pnpm shots`) producing 1600×1000 screenshots, 2400×1350 contact sheet, 1536×1024 key art and the icon cuts.
