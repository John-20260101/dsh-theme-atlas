#!/usr/bin/env node
/**
 * Browser smoke test for the generated `client.js`.
 *
 * Loads the real bundle into a blank page with a stub cordis context, applies
 * it, and checks the three things the plugin promises: a full 119-token layer
 * through `ctx.theme.overrideTokens`, the `data-dsh-atlas` attribute, and a
 * rail that survives a skin switch. Skips (exit 0) when no local Chrome is
 * available, so CI without a browser stays green.
 */
import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))

let browser
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true })
} catch (error) {
  console.log('SKIP client smoke test — no Chrome available')
  process.exit(0)
}

const fail = (message) => {
  console.error(`FAIL ${message}`)
  process.exitCode = 1
}

try {
  const page = await browser.newPage()
  await page.setContent('<!doctype html><html><head></head><body><div id="app">shell</div></body></html>')
  await page.evaluate(() => {
    window.__MOD = null
    window.__ModuleLoader__ = { load: (mod) => { window.__MOD = mod } }
    window.__LAYER = null
  })
  await page.addScriptTag({ content: await readFile(join(ROOT, 'client.js'), 'utf8') })
  await page.waitForFunction(() => window.__MOD !== null)

  const result = await page.evaluate(() => {
    const module = window.__MOD
    const effects = []
    const ctx = {
      effect(fn, label) {
        const dispose = fn()
        effects.push({ label, dispose })
        return () => {}
      },
      inject(deps, callback) {
        // The stub never resolves a late service; the direct property is enough.
      },
      theme: {
        overrideTokens(source, layer) {
          window.__LAYER = { source, layer }
          return () => { window.__DISPOSED = (window.__DISPOSED || 0) + 1 }
        },
      },
    }
    const plugin = module.factory(() => null)
    plugin.apply(ctx)
    const first = {
      id: window.__MOD.id,
      attr: document.documentElement.getAttribute('data-dsh-atlas'),
      source: window.__LAYER.source,
      tokens: Object.keys(window.__LAYER.layer).length,
      sample: window.__LAYER.layer['--dsw-alias-bg-base'],
      rail: document.querySelector('#dsh-theme-atlas-rail') !== null,
      shadow: document.querySelector('#dsh-theme-atlas-rail').shadowRoot !== null,
      effects: effects.map((item) => item.label),
      wash: document.documentElement.style.getPropertyValue('--atlas-a'),
    }
    window.__DSH_ATLAS__.apply('paper')
    const second = {
      attr: document.documentElement.getAttribute('data-dsh-atlas'),
      disposed: window.__DISPOSED || 0,
      tokens: Object.keys(window.__LAYER.layer).length,
    }
    document.body.setAttribute('data-ds-dark-theme', '')
    const darkAccent = document.documentElement.style.getPropertyValue('--atlas-a')
    const paperWallpaper = document.documentElement.hasAttribute('data-dsh-atlas-wallpaper')
    window.__DSH_ATLAS__.apply('sanjiang')
    const wallpaper = {
      attr: document.documentElement.getAttribute('data-dsh-atlas-wallpaper'),
      url: document.documentElement.style.getPropertyValue('--atlas-wallpaper'),
      scrim: document.documentElement.style.getPropertyValue('--atlas-scrim-1'),
      tokens: Object.keys(window.__LAYER.layer).length,
    }
    return { first, second, darkAccent, lightAccent: first.wash, paperWallpaper, wallpaper }
  })

  if (result.first.id !== 'dsh-theme-atlas') fail(`module id ${result.first.id}`)
  if (result.first.attr !== 'ink-jade') fail(`initial skin ${result.first.attr}`)
  if (result.first.source !== 'dsh-theme-atlas') fail(`override source ${result.first.source}`)
  if (result.first.tokens !== 119) fail(`token count ${result.first.tokens}`)
  if (!result.first.sample || !result.first.sample.light) fail('token values are not {light,dark} pairs')
  if (!result.first.rail || !result.first.shadow) fail('rail missing or not in a shadow root')
  if (result.second.attr !== 'paper') fail(`switch did not land on paper (${result.second.attr})`)
  if (result.second.disposed < 1) fail('previous token layer was not disposed on switch')
  if (result.second.tokens !== 119) fail('switched layer is incomplete')
  if (result.lightAccent === result.darkAccent) fail('signature wash did not follow the appearance')
  if (result.paperWallpaper) fail('a non-wallpaper skin set the wallpaper attribute')
  if (result.wallpaper.attr === null) fail('wallpaper skin did not set the attribute')
  if (!result.wallpaper.url.includes('leshan-sanjiang')) fail(`wallpaper url ${result.wallpaper.url}`)
  if (!result.wallpaper.scrim.startsWith('rgba')) fail('wallpaper scrim is not translucent')
  if (result.wallpaper.tokens !== 119) fail('wallpaper skin layer is incomplete')

  if (process.exitCode !== 1) {
    console.log(`client OK — 119 tokens, rail, switch, ${result.first.effects.length} effects`)
  }
} finally {
  await browser.close()
}
