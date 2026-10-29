/* Material-study poster for ?skin=<id>: palette-derived, no photography. */
(function () {
  const data = window.__ATLAS_DATA__
  const id = new URLSearchParams(location.search).get('skin') || 'ink-jade'
  const skin = data.skins.find((item) => item.id === id) || data.skins[0]
  const index = data.skins.findIndex((item) => item.id === skin.id)
  const p = skin.light
  const d = skin.dark

  const root = document.documentElement.style
  root.setProperty('--bg', p.bg)
  root.setProperty('--ink', p.ink)
  root.setProperty('--muted', p.muted)
  root.setProperty('--accent', p.accent)
  root.setProperty('--line', p.accent + '33')
  root.setProperty('--caption', p.muted + 'cc')

  document.body.style.background = p.bg
  document.querySelector('#wash').style.background = `
    radial-gradient(760px 620px at 88% 8%, ${p.accent2}55, transparent 62%),
    radial-gradient(900px 700px at 4% 104%, ${p.accent}2e, transparent 64%),
    linear-gradient(180deg, ${p.plate}00, ${p.bg}00)`

  const text = (selector, value) => {
    const node = document.querySelector(selector)
    if (node) node.textContent = value
  }
  text('#zh', skin.name.zh)
  text('#en', skin.name.en)
  text('#material', skin.material.zh + ' — ' + skin.material.en)
  text('#index', `${String(index + 1).padStart(2, '0')} / 06`)

  const hex = (color) => color.toUpperCase()
  const swatches = [
    ['bg', p.bg], ['plate', p.plate], ['accent', p.accent], ['accent2', p.accent2], ['ink', p.ink], ['dark', d.bg],
  ]
  document.querySelector('#swatches').innerHTML = swatches.map(([name, color]) => `
    <div class="sw">
      <i style="background:${color}"></i>
      <span>${name} ${hex(color)}</span>
    </div>`).join('')

  const inputs = [
    ['bg', p.bg], ['plate', p.plate], ['ink', p.ink],
    ['muted', p.muted], ['accent', p.accent], ['on accent', p.onAccent],
  ]
  document.querySelector('#recipe').innerHTML = inputs.map(([name, color]) => `
    <div class="cell">
      <span class="k">${name}</span>
      <span class="v">${hex(color)}</span>
      <span class="bar" style="background:${color};box-shadow:0 0 0 1px ${p.ink}40"></span>
    </div>`).join('')

  const contrast = (data.palette[skin.id].contrast || []).find((row) => row.mode === 'light')
  document.querySelector('#ledger').innerHTML = `
    <div><b>${(contrast ? contrast.body : 0).toFixed(1)}:1</b><span>body · AAA</span></div>
    <div><b>${(contrast ? contrast.buttonLabel : 0).toFixed(1)}:1</b><span>button label</span></div>`
  text('#contrast', `${skin.signature} · light ${p.bg} / dark ${d.bg}`)

  /* Six facets, one per skin of the pack: the mark is literally the set. */
  const colors = data.skins.map((item) => item.light.accent)
  const facets = colors.map((color, i) => {
    const angle = (i / colors.length) * Math.PI * 2 - Math.PI / 2
    const x = 235 + Math.cos(angle) * 150
    const y = 235 + Math.sin(angle) * 150
    const rotate = (i / colors.length) * 360
    return `<g transform="rotate(${rotate} 235 235)">
      <path d="M235 74 L302 148 L235 196 L168 148 Z"
        fill="${color}" fill-opacity="${i === index ? 0.95 : 0.22}"
        stroke="${color}" stroke-opacity="${i === index ? 0.95 : 0.55}" stroke-width="1.2"/>
    </g>`
  }).join('')

  document.querySelector('#gem').innerHTML = `<svg viewBox="0 0 470 470" aria-hidden="true">
    <circle cx="235" cy="235" r="196" fill="none" stroke="${p.ink}" stroke-opacity=".14"/>
    <circle cx="235" cy="235" r="150" fill="none" stroke="${p.ink}" stroke-opacity=".08" stroke-dasharray="2 6"/>
    <circle cx="235" cy="235" r="92" fill="none" stroke="${p.accent}" stroke-opacity=".38"/>
    ${facets}
    <circle cx="235" cy="235" r="34" fill="${p.ink}" fill-opacity=".92"/>
    <circle cx="235" cy="235" r="34" fill="none" stroke="${p.accent}" stroke-opacity=".8"/>
    <circle cx="235" cy="235" r="6" fill="${p.accent}"/>
  </svg>`

  document.title = `Atlas · ${skin.name.en} key art`
  window.__PREVIEW_READY__ = true
})()
