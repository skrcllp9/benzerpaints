import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./hero-banner.css";

const SLIDES = [
  { base: "/images/herobanner1.jpg", mob: "/images/herobanner1mob.jpg" },
  { base: "/images/herobanner2.jpg", mob: "/images/herobanner2mob.jpg" },
  { base: "/images/herobanner3.jpg", mob: "/images/herobanner3mob.jpg" },
  { base: "/images/herobanner4.jpg", mob: "/images/herobanner4mob.jpg" },
];

const DWELL = 4.2;
const NUM_BARS = 9;
const BAR_DURATION = 1;
const BAR_STAGGER = 0.11;
const BAR_JITTER = 0.18;
const BAR_DIRECTIONS = Array.from({ length: NUM_BARS }, (_, i) =>
  i % 2 === 0 ? "top" : "bottom"
);
const TRANSITION_DURATION =
  BAR_STAGGER * (NUM_BARS - 1) + BAR_JITTER + BAR_DURATION;

const buildBarsClip = (bars) => {
  const n = bars.length;
  const barWidth = 100 / n;

  const topEdge = [];
  for (let i = 0; i < n; i++) {
    const xLeft = i * barWidth;
    const xRight = xLeft + barWidth;
    const topY = BAR_DIRECTIONS[i] === "top" ? 0 : (1 - bars[i]) * 100;
    topEdge.push(`${xLeft}% ${topY}%`, `${xRight}% ${topY}%`);
  }

  const bottomEdge = [];
  for (let i = n - 1; i >= 0; i--) {
    const xLeft = i * barWidth;
    const xRight = xLeft + barWidth;
    const bottomY = BAR_DIRECTIONS[i] === "top" ? bars[i] * 100 : 100;
    bottomEdge.push(`${xRight}% ${bottomY}%`, `${xLeft}% ${bottomY}%`);
  }

  return `polygon(${topEdge.join(", ")}, ${bottomEdge.join(", ")})`;
};

const HeroBanner = () => {
  const slideRefs = useRef([]);
  const progressRef = useRef(null);

  useEffect(() => {
    const slides = slideRefs.current.filter(Boolean);
    if (slides.length !== SLIDES.length) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let cancelled = false;
    let dwellCall = null;
    let transitionTl = null;
    let progressTween = null;

    if (reduceMotion) {
      // No bars — a plain, gentle crossfade.
      let active = 0;
      slides.forEach((el, i) => {
        el.style.clipPath = "none";
        gsap.set(el, { opacity: i === 0 ? 1 : 0, scale: 1 });
      });

      const crossfade = () => {
        if (cancelled) return;
        const next = (active + 1) % slides.length;
        gsap.to(slides[active], { opacity: 0, duration: 1, ease: "power1.inOut" });
        gsap.to(slides[next], { opacity: 1, duration: 1, ease: "power1.inOut" });
        if (progressRef.current) {
          gsap.fromTo(
            progressRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: DWELL + TRANSITION_DURATION, ease: "none", transformOrigin: "left" }
          );
        }
        active = next;
        dwellCall = gsap.delayedCall(DWELL + TRANSITION_DURATION, crossfade);
      };

      crossfade();

      return () => {
        cancelled = true;
        dwellCall?.kill();
      };
    }

    let active = 0;
    let zCounter = 1;

    slides.forEach((el, i) => {
      const bars = new Array(NUM_BARS).fill(i === 0 ? 1 : 0);
      el.style.clipPath = buildBarsClip(bars);
      gsap.set(el, { scale: 1, zIndex: i === 0 ? ++zCounter : 1 });
    });

    const step = () => {
      if (cancelled) return;
      const next = (active + 1) % slides.length;

      zCounter += 1;
      const bars = new Array(NUM_BARS).fill(0);
      slides[next].style.clipPath = buildBarsClip(bars);
      gsap.set(slides[next], { zIndex: zCounter });

      if (progressRef.current) {
        progressTween = gsap.fromTo(
          progressRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: DWELL + TRANSITION_DURATION, ease: "none", transformOrigin: "left" }
        );
      }

      dwellCall = gsap.delayedCall(DWELL, () => {
        if (cancelled) return;
        transitionTl = gsap.timeline({
          onUpdate: () => {
            slides[next].style.clipPath = buildBarsClip(bars);
          },
          onComplete: () => {
            if (cancelled) return;
            active = next;
            step();
          },
        });
        for (let i = 0; i < NUM_BARS; i++) {
          const jitter = Math.random() * BAR_JITTER;
          transitionTl.to(
            bars,
            { [i]: 1, duration: BAR_DURATION, ease: "power3.out" },
            i * BAR_STAGGER + jitter
          );
        }
      });
    };

    step();

    return () => {
      cancelled = true;
      dwellCall?.kill();
      transitionTl?.kill();
      progressTween?.kill();
    };
  }, []);

  return (
    <section className="hero-carousel" aria-hidden="true">
      <div className="hero-carousel-stage">
        {SLIDES.map((slide, i) => (
          <picture key={slide.base}>
            <source media="(max-width: 767px)" srcSet={slide.mob} />
            <img
              ref={(el) => (slideRefs.current[i] = el)}
              className="hero-carousel-slide"
              src={slide.base}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </picture>
        ))}
      </div>
      <div className="hero-carousel-scrim" />
      <div className="hero-carousel-progress">
        <span className="hero-carousel-progress-bar" ref={progressRef} />
      </div>
    </section>
  );
};

export default HeroBanner;
