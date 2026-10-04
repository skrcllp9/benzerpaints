/* Alfa Acrylic Distemper — rotating bucket loop. Vanilla JS, transparent, no dependencies.
   Usage: <div data-alfa-bucket data-label="alfa-label.webp" style="width:480px;aspect-ratio:1"></div>
          <script src="alfa-bucket.js" defer></script>
   Options (data-attributes): data-disc="false" hides the plum circle; data-speed="0.8" slows playback. */
(function () {
  const PLUM = '#520c36', PLUM_2 = '#7a2b5e', PLUM_D = '#33061f';
  const D2R = Math.PI / 180, TOTAL = 6, CUE = { Reveal: 1.2, Hold: 2.4, Reset: 5.2 };
  const FRONT = 177.5, LUG = 87.5;
  const R = 228, LEAN = 2.4, N = 96;
  const LW = 2 * Math.PI * R, LH = 1024 * (LW / 2880), MT = 70, MB = 46, H = LH + MT + MB;
  const RTOP = R + (H / 2) * Math.sin(LEAN * D2R), RBOT = R - (H / 2) * Math.sin(LEAN * D2R);
  const TOP = -H / 2, BOT = H / 2, FW = LW / N;
  const VSHADE = 'linear-gradient(180deg, rgba(25,8,16,.32) 0px, rgba(25,8,16,0) 46px, rgba(25,8,16,0) calc(100% - 40px), rgba(25,8,16,.26) 100%)';
  const E = {
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
    inCubic: (t) => t * t * t,
    outBack: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    linear: (t) => t,
  };
  const anim = (from, to, s, e, ease) => (T) => { const t = Math.min(1, Math.max(0, (T - s) / (e - s))); return from + (to - from) * ease(t); };
  const wrapPi = (r) => { r = (r + Math.PI) % (2 * Math.PI); if (r < 0) r += 2 * Math.PI; return r - Math.PI; };
  function light(th) {
    const diff = Math.max(0, Math.cos(th + 0.55));
    const dark = Math.min(0.85, 0.6 * Math.pow(1 - diff, 1.3) + 0.28 * Math.pow(1 - Math.max(0, Math.cos(th)), 2.4));
    const spec = 0.38 * Math.exp(-Math.pow((th + 0.36) / 0.17, 2)) + 0.1 * Math.exp(-Math.pow((th - 0.95) / 0.12, 2));
    return [dark, spec];
  }
  function shade(th, half, k) {
    const a = light(th - half), b = light(th + half);
    return `linear-gradient(90deg, rgba(20,4,12,${(a[0] * k).toFixed(3)}), rgba(20,4,12,${(b[0] * k).toFixed(3)})), linear-gradient(90deg, rgba(255,255,255,${(a[1] * k).toFixed(3)}), rgba(255,255,255,${(b[1] * k).toFixed(3)}))`;
  }
  const el = (parent, css) => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;' + css; parent.appendChild(d); return d; };

  function mount(host) {
    const label = host.getAttribute('data-label') || 'alfa-label.webp';
    const showDisc = host.getAttribute('data-disc') !== 'false';
    const speed = parseFloat(host.getAttribute('data-speed') || '1') || 1;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.style.overflow = 'hidden';
    const stage = el(host, 'left:0;top:0;width:1080px;height:1080px;transform-origin:0 0;');
    const fit = () => { const s = Math.min(host.clientWidth, host.clientHeight || host.clientWidth) / 1080; stage.style.transform = `scale(${s})`; stage.style.left = (host.clientWidth - 1080 * s) / 2 + 'px'; stage.style.top = ((host.clientHeight || 1080 * s) - 1080 * s) / 2 + 'px'; };
    fit(); new ResizeObserver(fit).observe(host);
    const camEl = el(stage, 'inset:0;transform-origin:540px 540px;');
    const stream = el(camEl, `left:514px;width:52px;border-radius:26px;background:${PLUM};`);
    const disc = el(camEl, `left:140px;top:140px;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle at 42% 38%, ${PLUM_2} 0%, ${PLUM} 58%, #3c0626 100%);`);
    if (!showDisc) disc.style.display = 'none';
    const DROPS = [[-150, 470, 34], [-115, 500, 22], [-70, 455, 28], [-30, 500, 16], [20, 480, 30], [60, 500, 20], [105, 460, 26], [150, 490, 18], [195, 470, 24], [235, 500, 14]];
    const drops = DROPS.map(([, , s]) => el(camEl, `width:${s}px;height:${s}px;border-radius:50%;background:${PLUM};`));
    const shadow = el(camEl, `left:${540 - RBOT - 70}px;top:${596 + BOT - 10}px;width:${(RBOT + 70) * 2}px;height:70px;border-radius:50%;background:radial-gradient(closest-side, rgba(15,4,10,.45), rgba(15,4,10,0));`);
    const persp = el(camEl, 'inset:0;perspective:2400px;perspective-origin:540px 120px;');
    const world = el(persp, 'left:540px;top:596px;transform-style:preserve-3d;');

    const band = (r, y, h, n, bg, k) => {
      const w = (2 * Math.PI * r) / n + 1.5;
      for (let i = 0; i < n; i++) {
        const a = (360 * i) / n, th = wrapPi(a * D2R);
        if (Math.cos(th) < -0.2) continue;
        el(world, `left:${-w / 2}px;top:${y}px;width:${w}px;height:${h}px;backface-visibility:hidden;transform:rotateY(${a}deg) translateZ(${r}px);background:${shade(th, Math.PI / n, k)}, ${bg};`);
      }
    };
    const RL = RTOP + 12, LIDH = 50, lidY = TOP - LIDH + 4;
    band(RBOT + 3, BOT - 16, 22, 64, '#ebe8e2', 0.9);
    band(RTOP + 5, TOP - 2, 16, 64, '#f4f2ee', 1);
    band(RL, lidY, LIDH, 72, `linear-gradient(180deg, #8d3c6f 0%, ${PLUM_2} 10%, ${PLUM} 55%, #440a2c 100%)`, 1);
    const cap = el(world, `left:${-RL}px;top:${lidY - RL}px;width:${RL * 2}px;height:${RL * 2}px;border-radius:50%;transform:rotateX(90deg);background:radial-gradient(circle, #84346a 0 50%, #3c0726 51% 54%, #6a1f4e 55% 86%, #2e0419 87% 90%, #7a2b5e 91% 100%);`);
    el(cap, 'inset:0;border-radius:50%;background:linear-gradient(200deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 45%, rgba(20,2,10,.35) 100%);');

    const spinEl = el(world, 'left:0;top:0;transform-style:preserve-3d;');
    const faces = [];
    for (let i = 0; i < N; i++) {
      const a = (360 * i) / N;
      const f = el(spinEl, `left:${-FW / 2 - 0.9}px;top:${-H / 2}px;width:${FW + 1.8}px;height:${H}px;backface-visibility:hidden;transform:rotateY(${a}deg) translateZ(${R}px) rotateX(${-LEAN}deg);background-color:#f2f0eb;background-repeat:no-repeat,no-repeat,no-repeat,repeat-x;background-size:100% 100%,100% 100%,100% 100%,${LW}px ${LH}px;background-position:0 0,0 0,0 0,${-(i * FW) + 0.9}px ${MT}px;`);
      faces.push({ f, a });
    }
    const tabs = [];
    for (let d = 0; d < 360; d += 12) tabs.push({ d, t: el(spinEl, `left:-5px;top:${lidY + 22}px;width:10px;height:24px;background:rgba(18,2,10,.45);backface-visibility:hidden;transform:rotateY(${d}deg) translateZ(${RL + 0.8}px);`) });
    const lugY = TOP + 26, RH = RTOP + 16, HH = 190, hT = `rotateY(${LUG - 90}deg) rotateX(14deg)`;
    [LUG, LUG + 180].forEach((a) => el(spinEl, `left:-14px;top:${lugY - 16}px;width:28px;height:32px;border-radius:7px;background:linear-gradient(180deg, ${PLUM_2}, ${PLUM_D});backface-visibility:hidden;transform:rotateY(${a}deg) translateZ(${RTOP + 2}px);`));
    const arc = (r, h, bw, col, extra) => `left:${-r}px;top:${lugY - h}px;width:${r * 2}px;height:${h}px;box-sizing:border-box;border:${bw}px solid ${col};border-bottom:none;border-radius:${r}px ${r}px 0 0 / ${h}px ${h}px 0 0;transform-origin:50% 100%;${extra}`;
    el(spinEl, arc(RH, HH, 7, '#4a4846', `transform:${hT};`));
    el(spinEl, arc(RH, HH, 2, 'rgba(255,255,255,.45)', `transform:${hT} translateZ(0.5px);`));
    el(spinEl, arc(RH + 5, HH + 5, 17, '#1c1a19', `transform:${hT} translateZ(1px);clip-path:inset(0 33% 70% 33%);`));

    let labelSet = false;
    const pre = new Image(); pre.onload = () => { labelSet = true; }; pre.src = label;

    function render(T) {
      const turn = anim(-0.5, 0, 0, CUE.Reveal + 0.3, E.outCubic)(T) + anim(0, 0.08, CUE.Reveal + 0.3, CUE.Reset, E.linear)(T) + anim(0, 0.42, CUE.Reset, TOTAL, E.inCubic)(T);
      const spin = -(FRONT + turn * 360);
      const cam = 1 + 0.03 * Math.sin((Math.PI * T) / TOTAL);
      const lift = anim(30, 0, 0.3, 1.3, E.outCubic)(T) + anim(0, 30, CUE.Reset + 0.2, TOTAL, E.inCubic)(T);
      camEl.style.transform = `scale(${cam})`;
      world.style.transform = `translateY(${lift}px) rotateX(-9deg)`;
      shadow.style.opacity = 1 - lift / 60;
      spinEl.style.transform = `rotateY(${spin}deg)`;
      for (const { f, a } of faces) {
        const th = wrapPi((a + spin) * D2R);
        const vis = Math.cos(th) >= -0.15;
        f.style.display = vis ? '' : 'none';
        if (vis) f.style.backgroundImage = `${shade(th, Math.PI / N, 1)}, ${VSHADE}${labelSet ? `, url("${label}")` : ', none'}`;
      }
      for (const { d, t } of tabs) t.style.display = Math.cos(wrapPi((d + spin) * D2R)) < 0.05 ? 'none' : '';
      const head = anim(-60, 540, 0.05, 0.45, E.inCubic)(T), tail = anim(-60, 540, 0.38, 0.8, E.inCubic)(T);
      stream.style.display = tail < 538 ? '' : 'none';
      stream.style.top = tail + 'px'; stream.style.height = Math.max(0, head - tail) + 'px';
      const dk = anim(0, 1, 0.42, 1.15, E.outBack)(T) * (1 - anim(0, 1, 5.2, 5.85, E.inCubic)(T));
      disc.style.transform = `scale(${dk})`; disc.style.visibility = dk > 0.001 ? 'visible' : 'hidden';
      const shrink = anim(1, 0, 0.85, 1.25, E.inCubic)(T);
      DROPS.forEach(([deg, dist, s], i) => {
        const k = anim(0, 1, 0.45 + i * 0.012, 1.05 + i * 0.012, E.outCubic)(T);
        const on = k > 0 && shrink > 0; drops[i].style.display = on ? '' : 'none';
        if (!on) return;
        const r = deg * D2R, dd = 120 + (dist - 120) * k;
        drops[i].style.left = 540 + Math.sin(r) * dd - s / 2 + 'px'; drops[i].style.top = 540 - Math.cos(r) * dd - s / 2 + 'px';
        drops[i].style.transform = `scale(${shrink})`;
      });
    }
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { render(3); pre.onload = () => { labelSet = true; render(3); }; return; }
    let t0 = null, visible = true;
    render(0);
    pre.onload = () => { labelSet = true; render(t0 == null ? 0 : (((performance.now() - t0) / 1000) * speed) % TOTAL); };
    if (pre.complete && pre.naturalWidth) pre.onload();
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(host);
    const loop = (now) => { if (t0 == null) t0 = now; if (visible) render((((now - t0) / 1000) * speed) % TOTAL); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  const init = () => document.querySelectorAll('[data-alfa-bucket]').forEach((h) => { if (!h.__alfa) { h.__alfa = 1; mount(h); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
