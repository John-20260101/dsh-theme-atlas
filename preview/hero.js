/* Contact sheet: six cards, each painted from its own palette. */
(function () {
  const data = window.__ATLAS_DATA__
  const host = document.querySelector('#cards')
  if (!data || !host) return

  const esc = (value) => String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

  host.innerHTML = data.skins.map((skin) => {
    const p = skin.light
    const d = skin.dark
    const row = (data.palette[skin.id].contrast || []).find((item) => item.mode === 'light') || { body: 0, buttonLabel: 0 }
    return `
      <article class="card" style="background:${esc(p.bg)};border-color:${esc(p.accent)}33;box-shadow:0 22px 60px rgb(0 0 0 / .28)">
        <div class="card-top" style="gap:10px">
          <b style="color:${esc(p.ink)};font-size:22px">${esc(skin.name.zh)}</b>
          <span style="color:${esc(p.muted)};font-size:12px">${esc(skin.name.en)}</span>
        </div>
        <div class="swatches">
          <i style="background:${esc(p.bg)}"></i>
          <i style="background:${esc(p.plate)}"></i>
          <i style="background:${esc(p.accent)}"></i>
          <i style="background:${esc(p.accent2)}"></i>
          <i style="background:${esc(d.bg)}"></i>
        </div>
        <div class="mini" style="background:${esc(p.plate)};border-color:${esc(p.ink)}14">
          <div class="row a" style="background:${esc(p.accent)}"></div>
          <div class="row b" style="background:${esc(p.ink)}2e"></div>
          <div class="row c" style="background:${esc(p.ink)}1f"></div>
          <div class="chiprow">
            <i style="background:${esc(p.accent)}26"></i>
            <i style="background:${esc(p.accent)}1a"></i>
            <i style="background:${esc(p.accent)}10"></i>
          </div>
        </div>
        <p style="color:${esc(p.muted)};font-size:12.5px">${esc(skin.story.zh)}</p>
        <div class="foot" style="color:${esc(p.muted)}">
          <span class="mode" style="border-color:${esc(p.ink)}26">light</span>
          <span class="mode" style="border-color:${esc(d.ink)}20;background:${esc(d.bg)};color:${esc(d.ink)}">dark</span>
          <span style="margin-left:auto">正文 ${row.body.toFixed(1)}:1</span>
        </div>
      </article>`
  }).join('')

  window.__PREVIEW_READY__ = true
})()
