#!/usr/bin/env node
/**
 * Browser smoke test for the generated `client.js`.
 *
 * Loads the real bundle into a blank page with a stub cordis context, applies
 * it, and checks what the pack promises: a full 119-token layer through
 * `ctx.theme.overrideTokens`, the `data-dsh-atlas` attribute, a rail with one
 * entry per skin, a switch that disposes the previous layer, and an unload that
 * leaves no attribute, custom property, style tag or rail behind.
 *
 * A second page repeats the apply against a strict-injection context whose
 * proxy throws on undeclared service reads, so the no-theme-service fallback
 * stays regression-tested. Skips (exit 0) when no local Chrome is available, so
 * CI without a browser stays green.
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
      inject() {
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
    const railButtons = document.querySelectorAll('#dsh-theme-atlas-rail')
    const first = {
      id: window.__MOD.id,
      attr: document.documentElement.getAttribute('data-dsh-atlas'),
      mode: document.documentElement.getAttribute('data-dsh-atlas-mode'),
      source: window.__LAYER.source,
      tokens: Object.keys(window.__LAYER.layer).length,
      sample: window.__LAYER.layer['--dsw-alias-bg-base'],
      rail: railButtons.length === 1,
      shadow: railButtons[0].shadowRoot !== null,
      radios: railButtons[0].shadowRoot.querySelectorAll('[role="radio"]').length,
      effects: effects.map((item) => item.label),
      wash: document.documentElement.style.getPropertyValue('--atlas-a'),
      handles: window.__DSH_ATLAS__.skins.length,
    }
    window.__DSH_ATLAS__.apply('paper')
    const second = {
      attr: document.documentElement.getAttribute('data-dsh-atlas'),
      disposed: window.__DISPOSED || 0,
      tokens: Object.keys(window.__LAYER.layer).length,
    }
    window.__DSH_ATLAS__.apply('sanjiang')
    const invalid = window.__DSH_ATLAS__.current()
    document.body.setAttribute('data-ds-dark-theme', '')
    const darkAccent = document.documentElement.style.getPropertyValue('--atlas-a')
    window.__DSH_ATLAS__.apply('ink-jade')
    const back = {
      attr: document.documentElement.getAttribute('data-dsh-atlas'),
      wash: document.documentElement.style.getPropertyValue('--atlas-a'),
    }
    // Unload in reverse registration order, the way the shell disposes a fiber.
    for (const item of effects.slice().reverse()) {
      if (typeof item.dispose === 'function') item.dispose()
    }
    const after = {
      attr: document.documentElement.hasAttribute('data-dsh-atlas'),
      mode: document.documentElement.hasAttribute('data-dsh-atlas-mode'),
      washA: document.documentElement.style.getPropertyValue('--atlas-a'),
      washB: document.documentElement.style.getPropertyValue('--atlas-b'),
      signature: document.getElementById('dsh-theme-atlas/styles') !== null,
      fallback: document.getElementById('dsh-theme-atlas/fallback') !== null,
      rail: document.querySelector('#dsh-theme-atlas-rail') !== null,
      handle: '__DSH_ATLAS__' in window,
      disposed: window.__DISPOSED || 0,
    }
    return { first, second, invalid, darkAccent, lightAccent: first.wash, back, after }
  })

  if (result.first.id !== 'dsh-theme-atlas') fail(`module id ${result.first.id}`)
  if (result.first.attr !== 'ink-jade') fail(`initial skin ${result.first.attr}`)
  if (result.first.mode !== 'light') fail(`initial mode ${result.first.mode}`)
  if (result.first.source !== 'dsh-theme-atlas') fail(`override source ${result.first.source}`)
  if (result.first.tokens !== 119) fail(`token count ${result.first.tokens}`)
  if (!result.first.sample || !result.first.sample.light) fail('token values are not {light,dark} pairs')
  if (!result.first.rail || !result.first.shadow) fail('rail missing or not in a shadow root')
  if (result.first.radios !== 6) fail(`rail lists ${result.first.radios} skins, want 6`)
  if (result.first.handles !== 6) fail(`debug handle exposes ${result.first.handles} skins`)
  if (result.second.attr !== 'paper') fail(`switch did not land on paper (${result.second.attr})`)
  if (result.second.disposed < 1) fail('previous token layer was not disposed on switch')
  if (result.second.tokens !== 119) fail('switched layer is incomplete')
  if (result.invalid !== 'paper') fail(`unknown skin id changed the skin to ${result.invalid}`)
  if (result.lightAccent === result.darkAccent) fail('signature wash did not follow the appearance')
  if (result.back.attr !== 'ink-jade') fail(`switch back did not land (${result.back.attr})`)
  if (result.after.attr || result.after.mode) fail('unload left data-dsh-atlas attributes behind')
  if (result.after.washA || result.after.washB) fail('unload left --atlas-a/--atlas-b behind')
  if (result.after.signature) fail('unload left the signature sheet behind')
  if (result.after.fallback) fail('unload left the fallback sheet behind')
  if (result.after.rail) fail('unload left the rail in the DOM')
  if (result.after.handle) fail('unload left the debug handle on window')
  if (result.after.disposed < 2) fail(`token layer disposed ${result.after.disposed} times, want >= 2`)

  // --- strict-injection shell ------------------------------------------------
  // The desktop shell's cordis proxy throws on any service read that is not
  // declared in `inject`, before the caller's own `typeof` guard can run. The
  // plugin declares `inject: []`, so it must never touch `ctx.theme` directly;
  // it has to discover the service through `ctx.get` and fall back when absent.
  const guarded = await browser.newPage()
  await guarded.setContent('<!doctype html><html><head></head><body><div id="app">shell</div></body></html>')
  await guarded.evaluate(() => {
    window.__MOD = null
    window.__ModuleLoader__ = { load: (mod) => { window.__MOD = mod } }
  })
  await guarded.addScriptTag({ content: await readFile(join(ROOT, 'client.js'), 'utf8') })
  await guarded.waitForFunction(() => window.__MOD !== null)
  const strict = await guarded.evaluate(() => {
    const module = window.__MOD
    const injected = []
    const effects = []
    const base = {
      effect(fn) {
        const dispose = fn()
        effects.push(dispose)
        return () => {}
      },
      inject(deps) {
        // Parking a fiber here is what froze the desktop boot screen.
        injected.push(...(Array.isArray(deps) ? deps : Object.keys(deps)))
      },
      // cordis exposes `on` on every context; the plugin subscribes instead of injecting.
      on() {
        return () => {}
      },
      // No theme service on this shell.
      get() {
        return undefined
      },
    }
    const ctx = new Proxy(base, {
      get(target, prop, receiver) {
        if (typeof prop === 'string' && !(prop in target)) {
          throw new Error(`cannot get property "${prop}" without inject`)
        }
        return Reflect.get(target, prop, receiver)
      },
    })
    let guardActive = false
    try {
      void ctx.theme
    } catch (error) {
      guardActive = /without inject/.test(error.message)
    }
    const plugin = module.factory(() => null)
    let threw = null
    try {
      plugin.apply(ctx)
    } catch (error) {
      threw = String((error && error.message) || error)
    }
    const style = document.getElementById('dsh-theme-atlas/fallback')
    const state = {
      guardActive,
      threw,
      injected,
      attr: document.documentElement.getAttribute('data-dsh-atlas'),
      fallback: style !== null,
      declarations: style === null ? 0 : (style.textContent.match(/--dsw-[a-z0-9-]+:/g) || []).length,
      rail: document.querySelector('#dsh-theme-atlas-rail') !== null,
    }
    for (const dispose of effects.slice().reverse()) {
      if (typeof dispose === 'function') dispose()
    }
    state.after = {
      fallback: document.getElementById('dsh-theme-atlas/fallback') !== null,
      attr: document.documentElement.hasAttribute('data-dsh-atlas'),
      rail: document.querySelector('#dsh-theme-atlas-rail') !== null,
    }
    return state
  })
  await guarded.close()

  if (!strict.guardActive) fail('strict-injection guard did not engage — the case proves nothing')
  if (strict.threw !== null) fail(`apply threw on a strict-injection ctx: ${strict.threw}`)
  if (strict.injected.includes('theme')) {
    fail('plugin parked an injection for an unavailable theme service (freezes the shell boot)')
  }
  if (strict.attr !== 'ink-jade') fail(`strict ctx did not paint (${strict.attr})`)
  if (!strict.fallback) fail('strict ctx did not fall back to the scoped stylesheet')
  if (strict.declarations !== 238) fail(`fallback sheet has ${strict.declarations} declarations, want 238`)
  if (!strict.rail) fail('strict ctx did not mount the rail')
  if (strict.after.fallback) fail('strict ctx unload left the fallback sheet behind')
  if (strict.after.attr) fail('strict ctx unload left data-dsh-atlas behind')
  if (strict.after.rail) fail('strict ctx unload left the rail behind')

  if (process.exitCode !== 1) {
    console.log(
      `client OK — 119 tokens, 6 skins, switch, ${result.first.effects.length} effects, unload cleanup, strict-injection fallback`,
    )
  }
} finally {
  await browser.close()
}
