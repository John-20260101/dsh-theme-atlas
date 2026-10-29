/* Applies one Atlas palette to the static preview, from ?skin=&mode=. */
(function () {
  const query = new URLSearchParams(location.search)
  const data = window.__ATLAS_DATA__
  if (!data) return

  const id = query.get('skin') || 'ink-jade'
  const mode = query.get('mode') === 'dark' ? 'dark' : 'light'
  const skin = data.skins.find((item) => item.id === id) || data.skins[0]
  const entry = data.palette[skin.id]
  const tokens = entry[mode]

  const root = document.documentElement
  for (const [name, value] of Object.entries(tokens)) root.style.setProperty(name, value)
  root.style.setProperty('--atlas-a', skin[mode].accent)
  root.style.setProperty('--atlas-b', skin[mode].accent2)
  root.dataset.skin = skin.id
  root.dataset.mode = mode
  document.body.dataset.signature = skin.signature
  if (mode === 'dark') document.body.setAttribute('data-ds-dark-theme', '')

  const set = (selector, text) => {
    const node = document.querySelector(selector)
    if (node) node.textContent = text
  }
  const modeLabel = mode === 'dark' ? '深色' : '浅色'
  set('#foot-name', skin.name.zh)
  set('#foot-mode', modeLabel)
  set('#top-mode', modeLabel)
  set('#body-skin', skin.name.zh)

  const row = entry.contrast.find((item) => item.mode === mode) || { body: 0, buttonLabel: 0 }
  set('#body-contrast', row.body.toFixed(1))
  set('#body-button', row.buttonLabel.toFixed(1))

  const swatch = document.querySelector('#foot-swatch')
  if (swatch) swatch.style.background = `linear-gradient(140deg, ${skin[mode].accent}, ${skin[mode].accent2})`

  const codeLabel = document.querySelector('.code-head')
  if (codeLabel) codeLabel.firstChild.textContent = 'src/skins.mjs'
  const code = document.querySelector('.code pre')
  if (code) {
    const p = skin[mode]
    code.innerHTML = code.innerHTML.replace(/(<span class="k">)light(<\/span>)/, `$1${mode === 'dark' ? 'dark' : 'light'}$2`)
    code.innerHTML = code.innerHTML
      .replace(/#F5F7F3/g, p.bg)
      .replace(/#FFFFFF/g, p.plate)
      .replace(/#14201B/g, p.ink)
      .replace(/#56685F/g, p.muted)
      .replace(/#2E6B57/g, p.accent)
      .replace(/#F7FBF8/g, p.onAccent)
  }

  const diffValues = document.querySelectorAll('.diff .line span:nth-child(2)')
  if (diffValues.length >= 4) {
    const p = skin[mode]
    diffValues[1].textContent = `accent: '${p.accent}',`
    diffValues[2].textContent = `onAccent: '${p.onAccent}',`
    diffValues[3].textContent = `accent2: '${p.accent2}',`
  }

  document.title = `Atlas · ${skin.name.zh} ${skin.name.en} · ${modeLabel}`
  window.__PREVIEW_READY__ = true
})()
