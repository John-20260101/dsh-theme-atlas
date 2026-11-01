/**
 * Host half of dsh-theme-atlas.
 *
 * The pack is entirely browser-side: the token layer and the skin rail ship
 * through the `dsh.client` manifest (`client.js`), and this module only exists
 * so the bundle has a row to mount, enable and unload as a unit. It registers
 * no route, reads no file and keeps no state — the six material skins paint
 * themselves with CSS, and the package ships no wallpaper to serve.
 *
 * A host that never provides `webServer` is therefore not a degraded case:
 * there is nothing here that wants one.
 */

/** Stable cordis plugin name. */
export const name = 'themeAtlas'

/**
 * Keep the row alive for the lifetime of the bundle.
 *
 * Everything the theme does happens in the browser; `apply` exists because a
 * cordis row must export it, and returns nothing because it has nothing to
 * tear down.
 * @param {import('@deepseek-ai/cordis').Context} _ctx host context
 */
export function apply(_ctx) {}
