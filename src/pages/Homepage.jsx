import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PRODUCT_CATEGORIES = [
  { title: "Interior Paints", image: "/images/interior.avif" },
  { title: "Exterior Paints", image: "/images/exterior.avif" },
  { title: "Waterproofing Solutions", image: "/images/waterproofing.avif" },
  { title: "White Cement & Wall Solutions", image: "/images/white-cement.avif" },
  { title: "Waterproof Cement", image: "/images/waterproofing-cement.avif" },
];

const Homepage = () => {
  const heroSpaceRef = useRef(null);
  const heroRef = useRef(null);
  const heroImgRef = useRef(null);
  const productsPinRef = useRef(null);
  const productsTrackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) {
        gsap.set(heroImgRef.current, { yPercent: 0 });
        // No scroll-driven animation: let the hero sit in normal flow at
        // its natural height instead of reserving extra scroll space for it.
        if (heroSpaceRef.current) heroSpaceRef.current.style.height = "auto";
        if (heroRef.current) {
          heroRef.current.style.position = "relative";
          heroRef.current.style.visibility = "visible";
        }
        return;
      }

      const paths = gsap.utils.toArray(
        heroRef.current.querySelectorAll(".shape-overlays__path")
      );

      const masterTl = gsap.timeline({ paused: true });

      if (paths.length) {
        // Sweeps the wave up once to cover the hero, then the pin releases
        // and native scroll carries straight into "Our Products" below —
        // it does NOT uncover again (that used to re-reveal the same hero).
        const numPoints = 10;
        const numPaths = paths.length;
        const delayPointsMax = 0.18;
        const delayPerPath = 0.35;
        const segDuration = 1.3;

        const coverPoints = [];
        for (let i = 0; i < numPaths; i++) {
          coverPoints.push(new Array(numPoints).fill(100));
        }

        const pointsDelay = [];
        for (let j = 0; j < numPoints; j++) {
          pointsDelay.push(Math.random() * delayPointsMax);
        }

        // bottom-anchored: fills from the curve down to the bottom edge —
        // sweeps the wave up from the bottom to cover the hero.
        const buildPath = (points) => {
          let d = `M 0 0 V ${points[0]} C`;
          for (let j = 0; j < numPoints - 1; j++) {
            const p = ((j + 1) / (numPoints - 1)) * 100;
            const cp = p - (100 / (numPoints - 1)) / 2;
            d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`;
          }
          d += " V 100 H 0";
          return d;
        };

        for (let i = 0; i < numPaths; i++) {
          const points = coverPoints[i];
          const pathDelay = delayPerPath * i;
          for (let j = 0; j < numPoints; j++) {
            masterTl.to(
              points,
              { [j]: 0, duration: segDuration, ease: "sine.inOut" },
              pointsDelay[j] + pathDelay
            );
          }
        }

        const totalDuration = masterTl.duration();

        // Softens the handoff and keeps the position swap perfectly in
        // sync with the same (scrub-lagged) clock as the wave/parallax —
        // toggling on raw scroll position instead caused the two clocks to
        // disagree right at the boundary, which showed up as jitter and an
        // abrupt cut. Fading opacity to 0 first means the fixed→absolute
        // swap happens while the hero is already invisible.
        const fadeOutStart = totalDuration * 0.85;
        masterTl.to(
          heroRef.current,
          { opacity: 0, ease: "power1.in", duration: totalDuration - fadeOutStart },
          fadeOutStart
        );

        const render = () => {
          for (let i = 0; i < numPaths; i++) {
            paths[i].setAttribute("d", buildPath(coverPoints[i]));
          }

          const hidden = masterTl.progress() >= 0.999;
          if (heroRef.current) {
            heroRef.current.style.position = hidden ? "absolute" : "fixed";
            heroRef.current.style.visibility = hidden ? "hidden" : "visible";
            heroRef.current.style.pointerEvents = hidden ? "none" : "auto";
          }
        };

        masterTl.eventCallback("onUpdate", render);

        // Parallax lives in the SAME timeline as the wave so both stay
        // locked to the same scroll-driven progress, never drifting apart.
        masterTl.fromTo(
          heroImgRef.current,
          { yPercent: -8 },
          { yPercent: 8, ease: "none", duration: totalDuration },
          0
        );

        render();

        // `.hero-scroll-space` (sized in CSS) is the ONLY reserved scroll
        // space — GSAP's own `pin:true` would reserve the hero's height a
        // SECOND time after releasing it, leaving a dead extra viewport of
        // scroll before "Our Products" appeared. render() above handles the
        // fixed/hidden toggling itself instead, so "Our Products" arrives
        // the instant the wave finishes.
        ScrollTrigger.create({
          trigger: heroSpaceRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          animation: masterTl,
          invalidateOnRefresh: true,
        });
      }
    }, heroSpaceRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Pinned horizontal-scroll card gallery, on every screen size — the
    // section itself has no native horizontal overflow at all; cards only
    // move because vertical scroll drives the pinned tween below.
    const ctx = gsap.context(() => {
      const track = productsTrackRef.current;
      const pinEl = productsPinRef.current;
      if (!track || !pinEl) return;

      const getScrollAmount = () =>
        Math.max(0, track.scrollWidth - pinEl.offsetWidth);

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: pinEl,
        start: "top top",
        end: () => "+=" + getScrollAmount(),
        pin: true,
        scrub: 1,
        animation: tween,
        invalidateOnRefresh: true,
      });
    }, productsPinRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="hero-scroll-space" ref={heroSpaceRef}>
      <section className="hero-banner" ref={heroRef}>
        <div className="hero-banner-media">
          <picture>
              <source media="(max-width: 767px)" srcSet="/images/HeroBannerMob.png" />
              <img ref={heroImgRef} src="/images/HeroBanner.png" alt="Benzer Paints hero banner" />
          </picture>
        </div>
        <div className="hero-banner-content">
            <h1>Bring Life To<br />Every Wall</h1>
            <p>Premium quality paints, white cement, waterproof cement and complete construction solutions.</p>
            <a href="#" className="primary-btn">Explore Products</a>
        </div>

        <svg
          className="shape-overlays"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="shapeGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fffdf9" />
              <stop offset="100%" stopColor="#f7f0e8" />
            </linearGradient>
            <linearGradient id="shapeGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#efe6dc" />
            </linearGradient>
            <linearGradient id="shapeGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f3ece2" />
              <stop offset="100%" stopColor="#e7dccb" />
            </linearGradient>
          </defs>
          <path className="shape-overlays__path" fill="url(#shapeGradient1)"></path>
          <path className="shape-overlays__path" fill="url(#shapeGradient2)"></path>
          <path className="shape-overlays__path" fill="url(#shapeGradient3)"></path>
        </svg>
      </section>
      </div>

      <section className="our-products">
        <div className="products-scroll-pin" ref={productsPinRef}>
          <div className="container">
            <div className="heading">
              <p className="eyebrow-head">What We Offer</p>
              <h2>Our Products</h2>
            </div>
          </div>

          <div className="products-track" ref={productsTrackRef}>
            {PRODUCT_CATEGORIES.map((cat) => (
              <div className="product-card" key={cat.title}>
                <div className="product-card-media">
                  <img src={cat.image} alt={cat.title} loading="lazy" />
                </div>
                <div className="product-card-info">
                  <span className="product-card-title">{cat.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage;
