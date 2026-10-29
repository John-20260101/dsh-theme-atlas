/**
 * Host half of dsh-theme-atlas.
 *
 * The theme is a browser-side layer, so the host contributes no behaviour:
 * this entry exists so the bundle has a loadable row. The client half ships
 * through `exports["./client"]` and the `dsh.client` declaration in
 * package.json.
 */

/** Row name used by cordis.patch.yml. */
export const name = 'themeAtlas'

/** No host-side behaviour for this surface plugin. */
export function apply() {}
