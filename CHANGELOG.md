# Changelog

## 0.1.0 — 2026-10-29

- Initial release: six skins (Ink Jade, Terracotta, Aurora, Abyss, Sakura Mist, Paper), each with light and dark appearances.
- Token engine derives all 119 `--dsw-*` alias tokens from six inputs per appearance; contrast gate in `scripts/verify.mjs`.
- In-app skin rail with `Alt+K` cycling, browser-local persistence and a hide control.
- Scoped fallback stylesheet for shells without `ctx.theme.overrideTokens`.
- Preview pipeline (`pnpm shots`) producing 1600×1000 screenshots, 2400×1350 contact sheet, 1536×1024 key art and the icon cuts.
