#!/usr/bin/env node
/**
 * Host-half contract test: the bundle row still mounts, exports a stable name,
 * and asks the host for nothing it does not use.
 *
 * The pack is browser-side, so a host without `webServer` must be a supported
 * shape rather than a degraded one. The previous host half injected
 * `webServer` to serve wallpapers; this test fails if that dependency (or any
 * other service read) comes back.
 */
import { apply, name } from '../index.js'

const problems = []
const check = (ok, message) => { if (!ok) problems.push(message) }

check(name === 'themeAtlas', `name is ${name}, want themeAtlas`)
check(typeof apply === 'function', 'apply is not a function')

// Any service read throws: an inert row must not touch `ctx` at all.
const ctx = new Proxy({}, {
  get(target, prop) {
    throw new Error(`host half read ctx.${String(prop)}`)
  },
})

let threw = null
try {
  apply(ctx)
} catch (error) {
  threw = String((error && error.message) || error)
}
check(threw === null, `apply threw on a bare context: ${threw}`)

if (problems.length > 0) {
  console.error(problems.map((line) => `FAIL ${line}`).join('\n'))
  process.exit(1)
}
console.log('host OK — inert row: no webServer, no route, no state')
