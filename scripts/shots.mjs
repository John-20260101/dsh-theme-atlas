#!/usr/bin/env node
/**
 * Render the shipped preview images from the static preview pages.
 *
 * Everything is driven by the same derived palettes the plugin uses, so a
 * screenshot cannot drift from `client.js`. Sizes are the ones documented in
 * docs/images.md; change them in both places or not at all.
 *
 *   00 hero/contact sheet   2400×1350   (16:9, README banner, social preview)
 *   01-06 skin previews     1600×1000   (16:10, storefront screenshots)
 *   07 dark showcase        1600×1000
 *   08 rail detail          1600×1000
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToFileURL } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const OUT = join(ROOT, 'assets/screenshots')
const PREVIEW = pathToFileURL(join(ROOT, 'preview')).href
const SKINS = ['ink-jade', 'terracotta', 'aurora', 'abyss', 'sakura', 'paper']
const LESHAN = ['sanjiang', 'lingyun', 'emei']

const shots = [
  { file: '00-hero-2400x1350.png', page: 'hero.html', width: 2400, height: 1350, dsf: 1 },
  ...SKINS.map((skin, index) => ({
    file: `${String(index + 1).padStart(2, '0')}-${skin}-light-1600x1000.png`,
    page: `preview.html?skin=${skin}&mode=light`,
    width: 1600,
    height: 1000,
    dsf: 2,
  })),
  {
    file: '07-aurora-dark-1600x1000.png',
    page: 'preview.html?skin=aurora&mode=dark',
    width: 1600,
    height: 1000,
    dsf: 2,
  },
  {
    file: '08-paper-dark-1600x1000.png',
    page: 'preview.html?skin=paper&mode=dark',
    width: 1600,
    height: 1000,
    dsf: 2,
  },
  { file: '00b-leshan-2400x1350.png', page: 'leshan.html', width: 2400, height: 1350, dsf: 1 },
  ...LESHAN.map((skin, index) => ({
    file: `${String(index + 9).padStart(2, '0')}-${skin}-light-1600x1000.png`,
    page: `preview.html?skin=${skin}&mode=light`,
    width: 1600,
    height: 1000,
    dsf: 2,
  })),
  {
    file: '12-sanjiang-dark-1600x1000.png',
    page: 'preview.html?skin=sanjiang&mode=dark',
    width: 1600,
    height: 1000,
    dsf: 2,
  },
]

const keyArt = [
  ...SKINS.map((skin) => ({
    file: `assets/keyart/${skin}-1536x1024.png`,
    page: `keyart.html?skin=${skin}`,
    width: 1536,
    height: 1024,
    dsf: 1,
    dir: ROOT,
  })),
  ...LESHAN.map((skin) => ({
    file: `assets/keyart/${skin}-1536x1024.png`,
    page: `keyart-photo.html?skin=${skin}`,
    width: 1536,
    height: 1024,
    dsf: 1,
    dir: ROOT,
  })),
]

const icon = { file: 'assets/icon-1024.png', page: 'icon.html', width: 1024, height: 1024, dsf: 1, dir: ROOT }

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  for (const shot of [...shots, ...keyArt, icon].filter((item) => process.env.ATLAS_SET !== 'ui' || shots.includes(item)).filter((item) => process.env.ATLAS_SET !== 'art' || !shots.includes(item))) {
    const context = await browser.newContext({
      viewport: { width: shot.width, height: shot.height },
      deviceScaleFactor: shot.dsf,
      colorScheme: shot.page.includes('dark') || shot.page.startsWith('hero') ? 'dark' : 'light',
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    await page.goto(`${PREVIEW}/${shot.page}`, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__PREVIEW_READY__ === true)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(120)

    const destination = shot.dir ? join(shot.dir, shot.file) : join(OUT, shot.file)
    await mkdir(dirname(destination), { recursive: true })
    // Geometry gate: nothing may overflow the fixed canvas (layout is deterministic).
    const overflow = await page.evaluate(() => {
      const out = []
      const w = document.documentElement.scrollWidth
      const h = document.documentElement.scrollHeight
      if (w > window.innerWidth + 1 || h > window.innerHeight + 1) out.push(`document ${w}×${h}`)
      for (const el of document.querySelectorAll('*')) {
        const r = el.getBoundingClientRect()
        if (r.width > 0 && (r.right > window.innerWidth + 2 || r.bottom > window.innerHeight + 2)) {
          out.push(`${el.tagName.toLowerCase()}.${el.className || ''}`)
        }
      }
      return out.slice(0, 5)
    })
    if (overflow.length > 0) console.warn(`  ! overflow in ${shot.page}: ${overflow.join(', ')}`)
    await page.screenshot({ path: destination, scale: 'css' })
    console.log(`${shot.file}  ${shot.width}×${shot.height} (dsf ${shot.dsf})`)
    await context.close()
  }
} finally {
  await browser.close()
}

console.log(`\n${shots.length + keyArt.length + 1} images → assets/`)
