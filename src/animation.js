import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Safari (esp. iOS) resizes the viewport as its toolbars slide away; without
// this ScrollTrigger recalculates every trigger on each of those resizes.
ScrollTrigger.config({ ignoreMobileResize: true });

const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

// Belt-and-suspenders: Lenis's own "scroll" event only fires for scrolling
// it intercepted itself (wheel/touch). A programmatic jump that bypasses
// it — keyboard Home/End/PageDown, browser back/forward scroll
// restoration, "Find in page", an in-page anchor link — changes the real
// scroll position without Lenis ever noticing, so ScrollTrigger.update()
// never runs and any scrub animation (e.g. the hero) gets stuck wherever
// it last was, including a permanently `position: fixed` hero blocking
// clicks on everything below it. A native scroll listener guarantees
// ScrollTrigger always finds out, regardless of how the scroll happened.
window.addEventListener("scroll", ScrollTrigger.update, { passive: true });

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Trigger positions are measured against layout that shifts once web fonts
// and images arrive (Safari is slower at both), so re-measure afterwards —
// otherwise reveal triggers can sit at stale positions.
window.addEventListener("load", () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());

export default lenis;
