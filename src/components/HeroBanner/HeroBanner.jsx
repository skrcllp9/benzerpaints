import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./hero-banner.css";

// headline uses a literal "\n" for a forced line break (rendered via
// `white-space: pre-line` in CSS) instead of JSX <br/> — that keeps the
// text update as a single `.textContent` assignment in the animation
// below, no innerHTML/dangerouslySetInnerHTML needed.
const SLIDES = [
  {
    base: "/images/herobanner1.jpg",
    tab: "/images/homebanner1tab.jpg",
    mob: "/images/herobanner1mob.jpg",
    headline: "Bring life to\nevery wall",
    desc: "Colours that turn everyday spaces into something special.",
  },
  {
    base: "/images/herobanner2.jpg",
    tab: "/images/homebanner2tab.jpg",
    mob: "/images/herobanner2mob.jpg",
    headline: "Protect today.\nLive worry-free tomorrow.",
    desc: "Protection that helps your walls stand strong through everyday challenges.",
  },
  {
    base: "/images/herobanner3.jpg",
    tab: "/images/homebanner3tab.jpg",
    mob: "/images/herobanner3mob.jpg",
    headline: "Shades that speak beauty in every wall.",
    desc: "Wide range of colours for modern and elegant homes.",
  },
  {
    base: "/images/herobanner4.jpg",
    tab: "/images/homebanner4tab.jpg",
    mob: "/images/herobanner4mob.jpg",
    headline: "Perfect tools.\nPerfect finish.",
    desc: "Premium range of painting tools for every need.",
  },
];

// How long each slide holds before the next one starts wiping in (3500ms).
const DWELL = 3.5;
const NUM_BARS = 9;
const BAR_DURATION = 0.75;
const BAR_STAGGER = 0.08;
const BAR_JITTER = 0.13;
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
  const headingRef = useRef(null);
  const descRef = useRef(null);

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
    let textTl = null;
    let entranceTl = null;

    // Crossfades the heading/desc out (through a light blur, matching the
    // scroll-reveal treatment used for headings elsewhere on the page),
    // swaps their text to the next slide's copy while invisible, then
    // blurs back in. Kept as one h1/p pair in the DOM (rather than four
    // stacked per-slide blocks) so there's only ever a single real heading
    // for accessibility/SEO.
    const swapText = (index) => {
      const heading = headingRef.current;
      const desc = descRef.current;
      if (!heading || !desc) return null;

      return gsap
        .timeline()
        .to([heading, desc], { opacity: 0, y: -8, filter: "blur(10px)", duration: 0.35, ease: "power1.in" })
        .call(() => {
          heading.textContent = SLIDES[index].headline;
          desc.textContent = SLIDES[index].desc;
        })
        .to([heading, desc], { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power2.out" });
    };

    // First-load entrance — same blur-fade-in as every other heading on the
    // page, since the hero's h1/p don't otherwise get one (they're already
    // visible on mount, above the fold, never entering via scroll).
    if (!reduceMotion && headingRef.current && descRef.current) {
      entranceTl = gsap.fromTo(
        [headingRef.current, descRef.current],
        { opacity: 0, filter: "blur(16px)", y: 24 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1.1, ease: "power3.out", stagger: 0.08, delay: 0.2 }
      );
    }

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
        textTl = swapText(next);
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
        textTl?.kill();
        entranceTl?.kill();
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
        textTl = swapText(next);
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
      textTl?.kill();
      entranceTl?.kill();
    };
  }, []);

  return (
    <section className="hero-carousel">
      <div className="hero-carousel-stage">
        {SLIDES.map((slide, i) => (
          <picture key={slide.base}>
            <source media="(max-width: 767px)" srcSet={slide.mob} />
            <source media="(max-width: 991px)" srcSet={slide.tab} />
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

      <div className="hero-carousel-content">
        <div className="container">
          <div className="hero-carousel-text">
            <h1 ref={headingRef}>{SLIDES[0].headline}</h1>
            <p ref={descRef}>{SLIDES[0].desc}</p>
          </div>
        </div>
      </div>

      <div className="hero-carousel-progress">
        <span className="hero-carousel-progress-bar" ref={progressRef} />
      </div>
    </section>
  );
};

export default HeroBanner;
