/**
 * The six Atlas skins and their two appearances.
 *
 * A skin is *six numbers per appearance* — paper, plate, ink, muted ink,
 * accent and the two state colours — and the engine derives the remaining
 * ~110 shell tokens from them. Keeping the input this small is what makes the
 * pack swappable: a new skin is a new row here, not a new stylesheet.
 *
 * `accent2` is not a shell token. It only feeds the skin's signature wash (the
 * soft page gradient, the rail swatch and the promo art), so a skin can carry
 * two hues without confusing the semantics of `--dsw-alias-state-business-*`.
 */

/** @typedef {{ bg: string, plate: string, ink: string, muted: string, accent: string, onAccent: string, danger: string, success: string, warn: string, accent2: string }} Palette */

/** @type {ReadonlyArray<object>} */
export const SKINS = [
  {
    id: 'ink-jade',
    name: { zh: '墨玉', en: 'Ink Jade' },
    material: { zh: '和田青玉 · 宣纸', en: 'Hetian jade on rice paper' },
    story: {
      zh: '玉的青灰压进纸的暖白里，冷而不寒。适合长时间读代码的白天。',
      en: 'Jade grey pressed into warm paper — cool without feeling cold, for long daylight reading.',
    },
    swatch: ['#2E6B57', '#8FB3A2', '#F5F7F3'],
    signature: 'jade',
    light: {
      bg: '#F5F7F3', plate: '#FFFFFF', ink: '#14201B', muted: '#56685F',
      accent: '#2E6B57', onAccent: '#F7FBF8', danger: '#A93C2C',
      success: '#3F7A4E', warn: '#96701B', accent2: '#7FA897',
    },
    dark: {
      bg: '#0C1310', plate: '#141D19', ink: '#E6EFE9', muted: '#9FB2A7',
      accent: '#74C3A2', onAccent: '#07130E', danger: '#E07A67',
      success: '#74C9A0', warn: '#E0B05E', accent2: '#4F8F79',
    },
  },
  {
    id: 'terracotta',
    name: { zh: '赤陶', en: 'Terracotta' },
    material: { zh: '未上釉的陶土 · 砂', en: 'Unglazed clay and sand' },
    story: {
      zh: '窑火烧过的赭红，配粗砂纸的米色。像下午四点的书房。',
      en: 'Kiln-fired ochre over sandy paper — a study at four in the afternoon.',
    },
    swatch: ['#B4562F', '#D9A277', '#FBF4EB'],
    signature: 'clay',
    light: {
      bg: '#FBF4EB', plate: '#FFFCF7', ink: '#2B1D15', muted: '#6E5747',
      accent: '#AE5229', onAccent: '#FFF9F4', danger: '#A83A2A',
      success: '#587646', warn: '#9C6E1C', accent2: '#D9A277',
    },
    dark: {
      bg: '#16100D', plate: '#211915', ink: '#F2E3D6', muted: '#B7A08D',
      accent: '#E08C5F', onAccent: '#180D07', danger: '#EE8A72',
      success: '#8FBF7A', warn: '#E5B25F', accent2: '#8A5A3C',
    },
  },
  {
    id: 'aurora',
    name: { zh: '极光', en: 'Aurora' },
    material: { zh: '极地冰晶 · 夜光', en: 'Polar ice and night glow' },
    story: {
      zh: '青绿与紫在暗底上散开，像高纬度夜空的一道弧。运动感最强的一套。',
      en: 'Teal and violet blooming on a dark field — the most animated set in the pack.',
    },
    swatch: ['#55D6D2', '#8E7BFF', '#060E15'],
    signature: 'aurora',
    light: {
      bg: '#F2F7FA', plate: '#FFFFFF', ink: '#0F2029', muted: '#4E6A76',
      accent: '#16758F', onAccent: '#F4FBFF', danger: '#BE4230',
      success: '#2A7A5A', warn: '#9A7016', accent2: '#6E62C8',
    },
    dark: {
      bg: '#060E15', plate: '#0E1A24', ink: '#DDEEF6', muted: '#93AEBD',
      accent: '#55D6D2', onAccent: '#04120F', danger: '#F2796A',
      success: '#5FD3A6', warn: '#EDBE63', accent2: '#8E7BFF',
    },
  },
  {
    id: 'abyss',
    name: { zh: '深海', en: 'Abyss' },
    material: { zh: '深海蓝 · 微光', en: 'Deep water and faint light' },
    story: {
      zh: '压到最低的蓝，只有状态色还亮着。夜里最不刺眼的一套。',
      en: 'Blue pushed almost to black, with only the states still lit — the quietest set at night.',
    },
    swatch: ['#5B8DEF', '#2C4A73', '#050A12'],
    signature: 'abyss',
    light: {
      bg: '#F1F5FA', plate: '#FFFFFF', ink: '#0D1B2A', muted: '#4A6076',
      accent: '#1B58B4', onAccent: '#F6FAFF', danger: '#B23B32',
      success: '#2F7A55', warn: '#96700F', accent2: '#3E7BC8',
    },
    dark: {
      bg: '#050A12', plate: '#0B1420', ink: '#DCE9F8', muted: '#8FA6BE',
      accent: '#5B8DEF', onAccent: '#06101F', danger: '#EF7C72',
      success: '#57C39A', warn: '#E6B45C', accent2: '#2C4A73',
    },
  },
  {
    id: 'sakura',
    name: { zh: '樱雾', en: 'Sakura Mist' },
    material: { zh: '薄樱 · 雾面', en: 'Thin blossom on mist' },
    story: {
      zh: '粉只到「雾」的程度，干净、不甜腻，浅色下最好看。',
      en: 'Pink kept at mist strength — clean rather than sweet, at its best in light mode.',
    },
    swatch: ['#B84C74', '#E3A8BC', '#FBF3F5'],
    signature: 'mist',
    light: {
      bg: '#FBF3F5', plate: '#FFFFFF', ink: '#2B1A21', muted: '#765866',
      accent: '#B1436B', onAccent: '#FFF7FA', danger: '#B23A46',
      success: '#4E7A5A', warn: '#9C6C1A', accent2: '#E3A8BC',
    },
    dark: {
      bg: '#140F13', plate: '#1E161C', ink: '#F6E6EC', muted: '#B79AA7',
      accent: '#E78BA8', onAccent: '#1B0C12', danger: '#F08190',
      success: '#7FC098', warn: '#E7B267', accent2: '#6E3B50',
    },
  },
  {
    id: 'paper',
    name: { zh: '素笺', en: 'Paper' },
    material: { zh: '无涂布纸 · 墨', en: 'Uncoated paper and ink' },
    story: {
      zh: '只有墨与纸。零彩色强调，边框更实、阴影更浅，适合做长时间对照阅读。',
      en: 'Ink and paper only. No chromatic accent, firmer hairlines and shallower shadows, for long comparative reading.',
    },
    swatch: ['#1F1F1F', '#8C8C8C', '#FAFAF8'],
    signature: 'paper',
    light: {
      bg: '#FAFAF8', plate: '#FFFFFF', ink: '#121212', muted: '#5C5C5C',
      accent: '#1F1F1F', onAccent: '#FAFAF8', danger: '#9E2B22',
      success: '#2F6B3F', warn: '#7E5C12', accent2: '#8C8C8C',
    },
    dark: {
      bg: '#0A0A0A', plate: '#151515', ink: '#EDEDED', muted: '#A8A8A8',
      accent: '#E8E8E8', onAccent: '#0A0A0A', danger: '#E0796F',
      success: '#7FC79B', warn: '#DFB169', accent2: '#3A3A3A',
    },
  },
  {
    id: 'sanjiang',
    series: 'leshan',
    name: { zh: '三江夜', en: 'River Night' },
    material: { zh: '岷江 · 青衣江 · 大渡河', en: 'Three rivers at blue hour' },
    story: {
      zh: '江面把城市的灯揉成一条条暖线，山影是冷的。暖色只留给按钮和状态灯。',
      en: 'City lights smeared into warm lines on the water; the hills stay cold. Warmth is reserved for buttons and state.',
    },
    swatch: ['#C97A50', '#3E6A55', '#08131C'],
    signature: 'wallpaper',
    wallpaper: {
      file: 'leshan-sanjiang-1448x1086.jpg',
      width: 1448,
      height: 1086,
      focus: 'center 55%',
      alt: { zh: '乐山三江夜色（用户提供照片）', en: 'Leshan rivers at night (user-provided photograph)' },
    },
    light: {
      bg: '#F4F6F5', plate: '#FFFFFF', ink: '#14201F', muted: '#566663',
      accent: '#A9552F', onAccent: '#FFF7F2', danger: '#A93C2C',
      success: '#3F7A55', warn: '#96701B', accent2: '#3E6A55',
    },
    dark: {
      bg: '#08131C', plate: '#0F1D27', ink: '#E4EEF2', muted: '#9CB0B8',
      accent: '#C97A50', onAccent: '#1A0E08', danger: '#E07A67',
      success: '#6BBF95', warn: '#DFAF5F', accent2: '#3E6A55',
    },
  },
  {
    id: 'lingyun',
    series: 'leshan',
    name: { zh: '凌云晚照', en: 'Lingyun Dusk' },
    material: { zh: '崖壁 · 晚钟', en: 'Cliff face at the evening bell' },
    story: {
      zh: '砂岩吸走最后一点日光，只剩金褐色的边。全套里唯一以暖色为主调的深色皮肤。',
      en: 'Sandstone holds the last daylight as a gold-brown edge — the only warm-led dark skin in the pack.',
    },
    swatch: ['#D3A961', '#4A6E9E', '#0A1220'],
    signature: 'wallpaper',
    wallpaper: {
      file: 'leshan-lingyun-1536x1024.jpg',
      width: 1536,
      height: 1024,
      focus: 'center 45%',
      alt: { zh: '乐山凌云山晚照（用户提供照片）', en: 'Lingyun hill at dusk (user-provided photograph)' },
    },
    light: {
      bg: '#F7F2E8', plate: '#FFFDF8', ink: '#201A14', muted: '#6B5C4A',
      accent: '#8A6320', onAccent: '#FFF9EE', danger: '#A83A2A',
      success: '#4F7A46', warn: '#96701B', accent2: '#C9A25C',
    },
    dark: {
      bg: '#0A1220', plate: '#111C2B', ink: '#ECF1F8', muted: '#A3B1C2',
      accent: '#D3A961', onAccent: '#171006', danger: '#E88A74',
      success: '#79C39C', warn: '#E0B05E', accent2: '#C9A25C',
    },
  },
  {
    id: 'emei',
    series: 'leshan',
    name: { zh: '峨眉夜雾', en: 'Emei Mist' },
    material: { zh: '冷雾 · 月色', en: 'Cold mist and moonlight' },
    story: {
      zh: '整夜都是蓝的：雾把山脊擦掉，只留下很低的对比和一条月色边线。',
      en: 'Blue all night: mist erases the ridge, leaving very low contrast and a thin moonlit edge.',
    },
    swatch: ['#7FB2E8', '#4C6A8C', '#081320'],
    signature: 'wallpaper',
    wallpaper: {
      file: 'leshan-emei-1536x1024.jpg',
      width: 1536,
      height: 1024,
      focus: 'center 60%',
      alt: { zh: '峨眉山夜雾（用户提供照片）', en: 'Emei mist at night (user-provided photograph)' },
    },
    light: {
      bg: '#F1F5FA', plate: '#FFFFFF', ink: '#0E1A26', muted: '#4C6072',
      accent: '#25618F', onAccent: '#F4FAFF', danger: '#B23B32',
      success: '#2F7A55', warn: '#8F6C14', accent2: '#7FA6C9',
    },
    dark: {
      bg: '#081320', plate: '#0F1D2C', ink: '#E2EDF7', muted: '#98AEC2',
      accent: '#7FB2E8', onAccent: '#06121E', danger: '#EF8075',
      success: '#5FC49C', warn: '#E4B25F', accent2: '#4C6A8C',
    },
  },
]

/** Look a skin up by id. */
export function getSkin(id) {
  return SKINS.find((skin) => skin.id === id) ?? SKINS[0]
}

/**
 * Series label shown by the rail. Skins without a `series` are the original
 * material studies; the Leshan set carries photographs as wallpapers.
 */
export function seriesOf(skin) {
  return skin.series ?? 'material'
}

/** The skin the rail starts on when nothing is stored. */
export const DEFAULT_SKIN = 'ink-jade'
