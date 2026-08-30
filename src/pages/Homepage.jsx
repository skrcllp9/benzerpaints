import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import HeroBanner from "../components/HeroBanner/HeroBanner";

gsap.registerPlugin(ScrollTrigger);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.7" />
    <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path
      d="m12 12.3.75 1.52 1.68.24-1.21 1.18.28 1.67L12 16.1l-1.5.79.29-1.67-1.22-1.18 1.68-.24Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
    <path
      d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="m9 12 2 2 4-4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SwatchIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

const HeadsetIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
    <path
      d="M4 13v-1a8 8 0 0 1 16 0v1"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <rect x="3.2" y="13" width="4.2" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
    <rect x="16.6" y="13" width="4.2" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
    <path d="M16.6 19v.5A2.5 2.5 0 0 1 14.1 22H12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// Icon colors rotate through our existing palette (no new hues introduced)
// so the four cards read distinctly without going off-brand.
const WHY_CHOOSE_FEATURES = [
  { title: "30+ Years of Expertise", desc: "More than three decades of experience you can rely on.", accent: "orange", icon: <CalendarIcon /> },
  { title: "High Performance Products", desc: "Advanced formulations for long-lasting results.", accent: "blue", icon: <ShieldIcon /> },
  { title: "Wide Range of Solutions", desc: "Complete range for paints, coatings & construction needs.", accent: "skyblue", icon: <SwatchIcon /> },
  { title: "Expert Support You Can Count On", desc: "Dedicated support at every step of the way.", accent: "brown", icon: <HeadsetIcon /> },
];

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
    <path
      d="M12 3.5c2.2 1 4 1.4 6.5 1.4v6c0 5-2.8 7.8-6.5 9.1-3.7-1.3-6.5-4.1-6.5-9.1v-6c2.5 0 4.3-.4 6.5-1.4Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="m9 12.2 2.1 2.1L15.3 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DropletDotsIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
    <circle cx="12" cy="10" r="9" stroke="currentColor" strokeWidth="1.3" strokeDasharray="0.5 3.2" strokeLinecap="round" />
    <path
      d="M12 6c1.8 2.4 3 4 3 5.5a3 3 0 1 1-6 0C9 10 10.2 8.4 12 6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
    <path d="M6 18c-1.5-6 2-11 11-12-1 8-4.5 11.5-11 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M7 17c3-3 6-6 9-10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const WaveIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
    <path d="M3 8c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 12.5c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 17c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SimpleClockIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SimpleCalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <rect x="6.7" y="12" width="2.6" height="2.6" rx="0.5" fill="currentColor" />
    <rect x="10.7" y="12" width="2.6" height="2.6" rx="0.5" fill="currentColor" />
    <rect x="14.7" y="12" width="2.6" height="2.6" rx="0.5" fill="currentColor" />
  </svg>
);

// Renders as a 3-column grid (see .painters-prefer-diagram) — 3 cards then
// 2, auto-placed so the last row's 2 cards sit under the first 2 columns.
// `connectRight: true` draws a dotted connector into the grid gap toward
// the next card in the same row (so the row-enders — index 2 and 4 — don't
// get one, since there's nothing to their right in that row). Icons here
// are their own set (not reused from WHY_CHOOSE_FEATURES) so the two
// sections don't repeat the same glyphs. `position` maps each feature to a
// clock-face slot around the center badge (see .painters-prefer-orbit).
const PAINTERS_PREFER_FEATURES = [
  { title: "Better Coverage", icon: <DropletDotsIcon />, position: "top" },
  { title: "Easy Application", icon: <LeafIcon />, position: "left" },
  { title: "Smooth Finish", icon: <WaveIcon />, position: "right" },
  { title: "Long Durability", icon: <SimpleClockIcon />, position: "bottom-left" },
  { title: "Lower Repaint Frequency", icon: <SimpleCalendarIcon />, position: "bottom-right" },
];

const PRODUCT_CATEGORIES = [
  { title: "Interior Paints", image: "/images/interior.avif" },
  { title: "Exterior Paints", image: "/images/exterior.avif" },
  { title: "Waterproofing Solutions", image: "/images/waterproofing.avif" },
  { title: "White Cement & Wall Solutions", image: "/images/white-cement.avif" },
  { title: "Waterproof Cement", image: "/images/waterproofing-cement.avif" },
];

const FAQ_ITEMS = [
  {
    question: "What type of paint is best for interior walls?",
    answer:
      "For interior walls, we recommend our premium emulsion paints, which offer a smooth matte or silk finish, low odor, and long-lasting color. They're washable, durable, and ideal for living rooms, bedrooms, and hallways. For kitchens and bathrooms, a semi-gloss or satin finish works better due to its moisture resistance.",
  },
  {
    question: "How many liters of paint do I need for my room?",
    answer:
      "As a general rule, 1 liter of paint covers approximately 10–12 square meters per coat. To calculate the total quantity, measure your wall area (length × height), subtract windows/doors, and multiply by the number of coats (usually 2). You can also use our online paint calculator for an accurate estimate.",
  },
  {
    question: "Do you offer custom color mixing?",
    answer:
      "Yes! We offer a wide range of custom color mixing services at our authorized dealer stores. You can choose from our shade card or bring a color reference, and our tinting machines will match it precisely to create your desired shade.",
  },
  {
    question: "How long does it take for the paint to dry?",
    answer:
      "Drying time depends on the paint type, humidity, and ventilation. Typically, our interior paints are touch-dry within 1–2 hours and ready for a second coat after 4–6 hours. For best results, allow 24 hours before heavy use or cleaning the surface.",
  },
  {
    question: "Is your paint eco-friendly and safe for children/pets?",
    answer:
      "Yes, our paints are low-VOC (Volatile Organic Compounds) and formulated to be safe, non-toxic, and environmentally friendly once dry. We recommend proper ventilation during application, and rooms are generally safe to occupy within 24 hours after painting.",
  },
];

const WaterDropIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
    <path
      d="M12 3.5c3 3.8 6 7.6 6 11a6 6 0 1 1-12 0c0-3.4 3-7.2 6-11Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

// `accent` maps to a .mood-accent-* class (custom.css) shared by both the
// mood button's icon and the caption card's icon, so the two always agree
// on color. desktop/tab/mob mirror the responsive <picture> breakpoints
// used elsewhere (HeroBanner, brochure): mobile ≤767px, tablet ≤991px.
const MOOD_OPTIONS = [
  {
    key: "fresh",
    label: "Fresh",
    caption: "Green tones for a natural feel",
    accent: "green",
    icon: <LeafIcon />,
    desktop: "/images/nature-desktop.jpg",
    tab: "/images/nature-tab.jpg",
    mob: "/images/nature-mobile.jpg",
  },
  {
    key: "calm",
    label: "Calm",
    caption: "Blue tones for a calming feel",
    accent: "blue",
    icon: <WaterDropIcon />,
    desktop: "/images/calm-desktop.jpg",
    tab: "/images/calm-tab.jpg",
    mob: "/images/calm-mob.jpg",
  },
  {
    key: "bright",
    label: "Bright",
    caption: "Warm yellow tones for a bright, sunny feel",
    accent: "yellow",
    icon: <SunIcon />,
    desktop: "/images/bright-desktop.jpg",
    tab: "/images/bright-tab.jpg",
    mob: "/images/bright-mob.jpg",
  },
];

const ResidentialIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
    <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 10v9.5h13V10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <rect x="10.3" y="13.5" width="3.4" height="6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const CommercialIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
    <rect x="3.5" y="10.5" width="7" height="9" stroke="currentColor" strokeWidth="1.6" />
    <rect x="11.5" y="4.5" width="9" height="15" stroke="currentColor" strokeWidth="1.6" />
    <path d="M14.2 8h1.6M14.2 11.3h1.6M14.2 14.6h1.6M6 13.5h1.4M6 16.5h1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const IndustrialIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
    <path d="M3.5 19.5v-7l5-3v3l5-3v10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M13.5 19.5V9h6.5v10.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M16 9V5.5M16 5.5c0-1 1.4-1 1.4-2M18.5 9V6.2M18.5 6.2c0-.9 1.3-.9 1.3-1.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M3.5 19.5h17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const HospitalityIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
    <rect x="9" y="6" width="10.5" height="13.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M11.5 9h1.6M15.4 9H17M11.5 12h1.6M15.4 12H17M11.5 15h1.6M15.4 15H17" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M6 19.5v-6s-2.5.5-2.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 13.5c1.8 0 2.8 1.3 2.8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const EducationIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
    <path d="M4.5 19.5V11h9v8.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M4.5 11 9 7l4.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M9 4v3M9 4h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="17.5" cy="14.5" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M17.5 13v1.6l1.1.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InfrastructureIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
    <path d="M3 17c2-5 5-8 9-8s7 3 9 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M6 19.5V15M10 19.5v-7M14 19.5v-7M18 19.5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 19.5h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const INDUSTRY_CARDS = [
  {
    title: "Residential Projects",
    desc: "Trusted finishes for homes, apartments, and housing communities.",
    icon: <ResidentialIcon />,
    image: "/images/residential-projects.jpg",
  },
  {
    title: "Commercial Buildings",
    desc: "Durable, professional finishes for offices and retail spaces.",
    icon: <CommercialIcon />,
    image: "/images/commercial-buildings.jpg",
  },
  {
    title: "Industrial Spaces",
    desc: "High-performance coatings built for tough industrial environments.",
    icon: <IndustrialIcon />,
    image: "/images/industrial-spaces.jpg",
  },
  {
    title: "Hospitality",
    desc: "Elegant, welcoming finishes for hotels and hospitality spaces.",
    icon: <HospitalityIcon />,
    image: "/images/hospitality.jpg",
  },
  {
    title: "Educational Institutions",
    desc: "Safe, long-lasting solutions for schools and campuses.",
    icon: <EducationIcon />,
    image: "/images/educational-institutions.jpg",
  },
  {
    title: "Infrastructure Projects",
    desc: "Protective, weather-resistant coatings for public infrastructure.",
    icon: <InfrastructureIcon />,
    image: "/images/infrastructure-projects.jpg",
  },
];

const Homepage = () => {
  const productsPinRef = useRef(null);
  const productsTrackRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(0);
  const faqAnswerRefs = useRef([]);
  const [activeMood, setActiveMood] = useState(0);
  const moodMediaRefs = useRef([]);
  const moodCaptionRef = useRef(null);
  const industriesPinRef = useRef(null);
  const industryCardRefs = useRef([]);
  const industriesTrackRef = useRef(null);

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

  useEffect(() => {
    // Sticky/pinned stacking deck. All 6 cards are absolutely positioned in
    // the same box and never leave it. Card j's resting slot is a fixed
    // j * STRIP down from the top, so each revealed card lands STRIP pixels
    // below the previous one and simply stays there — nothing fades, nothing
    // scrolls away. Because card j always sits in front of card j-1
    // (z-index: j, set once in CSS-order below), each newly revealed card
    // covers all but the top STRIP pixels of the one before it, compressing
    // the earlier cards into overlapping strips while the newest one stays
    // fully open at the bottom of the stack.
    //
    // That fixed z-order is why nothing needs to be re-layered per step:
    // reveal order and paint order are the same, so a card's z never has to
    // change as the deck advances.
    const pinEl = industriesPinRef.current;
    const cards = industryCardRefs.current;
    if (!pinEl || cards.some((el) => !el)) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const cardCount = INDUSTRY_CARDS.length;

    let ctx;

    const build = () => {
      if (ctx) ctx.revert();

      // Mobile drops the pin/stacking-deck entirely in favor of a plain
      // horizontal carousel (see .industries-cards-window's mobile CSS) —
      // no scroll-jacking, no viewport-height pin. GSAP's only job here is
      // to clear any inline transform/opacity/z-index a previous
      // desktop-width build left behind on these same card elements before
      // a resize crossed the breakpoint.
      if (window.innerWidth <= 767) {
        ctx = gsap.context(() => {
          gsap.set(cards, { clearProps: "all" });
        }, industriesPinRef);
        return;
      }

      ctx = gsap.context(() => {
        // How much of each already-revealed card stays visible above the
        // one covering it. Kept under the card's own top padding (20px) so
        // a covered card shows only the blank white sliver above its
        // title — never a clipped line of text.
        const strip = 16;
        const restY = (j) => j * strip;

        cards.forEach((el, j) => {
          gsap.set(el, { zIndex: j });
          // Card 0 starts revealed; the rest wait just below their slot,
          // invisible, and slide up into it when their step arrives.
          gsap.set(
            el,
            j === 0
              ? { y: restY(0), opacity: 1 }
              : { y: restY(j) + 60, opacity: 0 }
          );
        });

        if (reduceMotion) {
          cards.forEach((el, j) => gsap.set(el, { y: restY(j), opacity: 1 }));
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinEl,
            start: "top top",
            end: "+=" + (cardCount - 1) * 500,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let step = 1; step < cardCount; step++) {
          tl.to(
            cards[step],
            {
              y: restY(step),
              opacity: 1,
              duration: 1,
              ease: "power2.out",
            },
            step - 1
          );
        }
      }, industriesPinRef);
    };

    build();

    // Crossing the mobile breakpoint swaps the whole layout (pinned deck vs
    // plain carousel), so a resize has to rebuild rather than leave the
    // previous mode's state stale.
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      if (ctx) ctx.revert();
    };
  }, []);

  useEffect(() => {
    // Scroll-reveal for section copy: headings fade in out of a blur, and
    // eyebrow labels get a left-to-right wipe (echoing the hero's
    // paint-roller motif) with a small accent underline that draws in
    // right after. Skipped entirely under reduced motion, in which case
    // everything just renders in its final state with no animation.
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduceMotion) return;

      gsap.utils.toArray("h2").forEach((heading) => {
        gsap.fromTo(
          heading,
          { opacity: 0, filter: "blur(14px)", y: 24 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      gsap.utils.toArray(".eyebrow-head").forEach((eyebrow) => {
        const text = eyebrow.querySelector(".eyebrow-head-text");
        const underline = eyebrow.querySelector(".eyebrow-underline");
        if (!text) return;

        gsap.set(text, { clipPath: "inset(0 100% 0 0)" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: eyebrow,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
        tl.to(text, { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power3.out" });
        if (underline) {
          tl.to(underline, { scaleX: 1, duration: 0.5, ease: "power2.out" }, "-=0.15");
        }
      });

      // Body copy under a heading: split into words and let them rise in
      // out of a mask, staggered, rather than fading the whole block at once.
      // (.why-choose-desc is excluded — it has an inline <strong>, and
      // rebuilding it from plain textContent would silently drop that.)
      document
        .querySelectorAll(
          ".brochure-content p:not(.eyebrow-head), .become-dealer-content p:not(.eyebrow-head)"
        )
        .forEach((p) => {
          const words = p.textContent.trim().split(/\s+/);
          p.innerHTML = words
            .map(
              (word) =>
                `<span class="word-mask"><span class="word-inner">${word}</span></span>`
            )
            .join(" ");

          gsap.fromTo(
            p.querySelectorAll(".word-inner"),
            { yPercent: 120, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.02,
              ease: "power3.out",
              scrollTrigger: {
                trigger: p,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        });

      // "Why Choose Benzer" desc fade-up (the subhead is a real <h2> now,
      // so it already gets the blur-fade-in from the h2 loop above), then
      // the four cards stagger in right after.
      gsap.fromTo(
        ".why-choose-desc",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".why-choose-desc",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".why-choose-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".why-choose-grid",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".why-choose-cta-wrap",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".why-choose-cta-wrap",
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );

      // "Why Painters Prefer Benzer" desc fade-up, then the 5 feature
      // columns stagger in right after. No animation on the button here —
      // buttons in the other sections (become-dealer, why-choose) don't
      // get one either, so this stays consistent with that.
      gsap.fromTo(
        ".painters-prefer-desc",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".painters-prefer-desc",
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );

      // opacity only — no `y` here. GSAP's y/x/rotation tweens write a
      // plain `transform: translate(...)` inline style, which would
      // silently replace (not compose with) the CSS-authored
      // `transform: rotate(...) translate(...)` that positions each node
      // around the circle, collapsing the whole radial layout.
      gsap.fromTo(
        ".painters-prefer-orbit-node, .painters-prefer-orbit-center",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".painters-prefer-diagram",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".faq-media",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".faq-media",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".faq-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".faq-list",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".colour-inspiration-desc",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".colour-inspiration-desc",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        [".colour-inspiration-mood-label", ".colour-inspiration-mood-btn"],
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".colour-inspiration-mood-list",
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".colour-inspiration-media",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".colour-inspiration-media",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".industries-desc",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".industries-desc",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".industries-cards-window",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".industries-cards-window",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // The whole node (icon + label) travels around the ring together,
    // continuously — .painters-prefer-orbit-group carries them around,
    // while each node's .painters-prefer-orbit-node-spin counter-rotates
    // in the opposite direction so the icon/label stay upright the entire
    // time rather than tumbling as they sweep around. Both tweens live in
    // one timeline (not just "started together") so they're driven by the
    // same clock and can't drift out of sync over a long run. Continuous,
    // not scroll-tied, so it lives in its own effect/ctx separate from the
    // reveal system.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const duration = 34;
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(".painters-prefer-orbit-group", { rotation: 360, duration, ease: "none" }, 0);
      // No transformOrigin here on purpose — it's declared in custom.css as
      // a calc() off --diagram-size so the pivot stays on the icon's own
      // center at every viewport size, instead of being pinned to a single
      // hardcoded pixel value that only matched the largest diagram. GSAP
      // uses the element's computed transform-origin when the tween omits it.
      tl.to(".painters-prefer-orbit-node-spin", {
        rotation: -360,
        duration,
        ease: "none",
      }, 0);
    });

    return () => ctx.revert();
  }, []);

  // Accordion open/close: height is driven entirely by GSAP (never a React
  // `style` prop), so this effect can freely re-run per click without
  // fighting React's own reconciliation of that inline style. Tweening to
  // literal "auto" lets GSAP measure the true content height once and settle
  // there, rather than us hardcoding/measuring it ourselves.
  useEffect(() => {
    faqAnswerRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        height: i === openFaq ? "auto" : 0,
        duration: 0.5,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    });
  }, [openFaq]);

  // Colour mood picker: all 3 room photos are stacked in the DOM (see
  // .colour-inspiration-media-layer) and crossfaded via opacity — never
  // `x`/`y`/`transform`, since the caption card below relies on a CSS
  // `transform: translateX(-50%)` for centering that a GSAP transform tween
  // would silently overwrite (same reason the caption fade below is
  // opacity-only too).
  useEffect(() => {
    moodMediaRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        opacity: i === activeMood ? 1 : 0,
        duration: 0.6,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    });

    if (moodCaptionRef.current) {
      gsap.fromTo(
        moodCaptionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" }
      );
    }
  }, [activeMood]);

  // Mobile-only carousel nav (see .industries-nav) — desktop/tablet keep the
  // pinned stacking deck and never render/use these buttons.
  const scrollIndustries = (dir) => {
    const el = industriesTrackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <>
      <HeroBanner />

      <section className="why-choose">
        <div className="container">
          <div className="why-choose-heading">
            <p className="eyebrow-head">
              <span className="eyebrow-head-text">Why Choose Benzer</span>
              <span className="eyebrow-underline" aria-hidden="true" />
            </p>
            <h2 className="why-choose-subhead">
              Trusted Quality.
              <br />
              Proven Performance.
            </h2>
            <p className="why-choose-desc">
              With over <strong>30 years</strong> of expertise, Benzer Paints delivers
              innovative, high-performance, and eco-friendly solutions that beautify
              and protect every space.
            </p>
          </div>

          <div className="why-choose-grid">
            {WHY_CHOOSE_FEATURES.map((feature) => (
              <div className={`why-choose-card why-choose-card--${feature.accent}`} key={feature.title}>
                <span className="why-choose-card-icon">{feature.icon}</span>
                <h3 className="why-choose-card-title">{feature.title}</h3>
                <p className="why-choose-card-desc">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="why-choose-cta-wrap">
            <a href="#" className="primary-btn">
              Learn More About Us
            </a>
          </div>
        </div>
      </section>

      <section className="our-products">
        <div className="products-scroll-pin" ref={productsPinRef}>
          <div className="container">
            <div className="heading">
              <p className="eyebrow-head">
                <span className="eyebrow-head-text">What We Offer</span>
                <span className="eyebrow-underline" aria-hidden="true" />
              </p>
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

      <section className="colour-inspiration">
        <div className="colour-inspiration-media">
          {MOOD_OPTIONS.map((mood, i) => (
            <picture
              key={mood.key}
              className={`colour-inspiration-media-layer ${i === 0 ? "is-active" : ""}`}
              ref={(el) => (moodMediaRefs.current[i] = el)}
            >
              <source media="(max-width: 767px)" srcSet={mood.mob} />
              <source media="(max-width: 991px)" srcSet={mood.tab} />
              <img
                src={mood.desktop}
                alt={`${mood.label} colour mood — ${mood.caption}`}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </picture>
          ))}
        </div>

        <div className="container">
          <div className="colour-inspiration-card">
            <p className="eyebrow-head">
              <span className="eyebrow-head-text">Colour Inspiration</span>
              <span className="eyebrow-underline" aria-hidden="true" />
            </p>
            <h2>
              Bring Your
              Walls To Life
            </h2>
            <p className="colour-inspiration-desc">
              Explore thousands of shades and combinations that reflect
              your style and personality.
            </p>
            <span className="colour-inspiration-mood-label">Choose Your Mood</span>
            <div className="colour-inspiration-mood-list">
              {MOOD_OPTIONS.map((mood, i) => (
                <button
                  key={mood.key}
                  type="button"
                  className={`colour-inspiration-mood-btn ${i === activeMood ? "is-active" : ""}`}
                  aria-pressed={i === activeMood}
                  onClick={() => setActiveMood(i)}
                >
                  <span className={`colour-inspiration-mood-icon mood-accent-${mood.accent}`}>
                    {mood.icon}
                  </span>
                  {mood.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="colour-inspiration-caption" ref={moodCaptionRef}>
          <span
            className={`colour-inspiration-caption-icon mood-accent-${MOOD_OPTIONS[activeMood].accent}`}
          >
            {MOOD_OPTIONS[activeMood].icon}
          </span>
          <span className="colour-inspiration-caption-text">
            <strong>{MOOD_OPTIONS[activeMood].label}</strong>
            <span>{MOOD_OPTIONS[activeMood].caption}</span>
          </span>
        </div>
      </section>

      <section className="industries">
        <div className="industries-pin" ref={industriesPinRef}>
          <div className="industries-bg">
            <picture>
              <source media="(max-width: 767px)" srcSet="/images/industries-mob.jpg" />
              <source media="(max-width: 991px)" srcSet="/images/industries-tab.jpg" />
              <img src="/images/industries-bg.jpg" alt="" loading="lazy" />
            </picture>
          </div>
          <div className="industries-fade" aria-hidden="true" />

          <div className="container industries-columns">
            <div className="industries-intro">
              <p className="eyebrow-head">
                <span className="eyebrow-head-text">Industries We Serve</span>
                <span className="eyebrow-underline" aria-hidden="true" />
              </p>
              <h2>
                Solutions For
                <br />
                Every Space
              </h2>
              <p className="industries-desc">
                From homes to large-scale commercial and industrial projects,
                Benzer Paints delivers durable, high-performance coating
                solutions designed around the demands of every space.
              </p>
              <p className="industries-desc">
                Whether you&rsquo;re creating a welcoming home, a professional
                workplace, or protecting a demanding industrial environment,
                our solutions are built to deliver lasting finish, protection
                and performance.
              </p>
            </div>

            <div className="industries-cards-window" ref={industriesTrackRef}>
              {INDUSTRY_CARDS.map((card, i) => (
                <div
                  className="industries-card"
                  key={card.title}
                  ref={(el) => (industryCardRefs.current[i] = el)}
                >
                  <span className="industries-card-media">
                    <img src={card.image} alt="" loading="lazy" />
                    <span className="industries-card-icon">{card.icon}</span>
                  </span>
                  <span className="industries-card-text">
                    <span className="industries-card-title">{card.title}</span>
                    <span className="industries-card-desc">{card.desc}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile-only carousel controls — hidden above 767px (see
                .industries-nav), where the pinned stacking deck is used
                instead. Same button design as the (currently unused)
                testimonial section's .testimonial-nav-btn. */}
            <div className="industries-nav">
              <button
                type="button"
                className="industries-nav-btn"
                aria-label="Previous industry"
                onClick={() => scrollIndustries(-1)}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className="industries-nav-btn"
                aria-label="Next industry"
                onClick={() => scrollIndustries(1)}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="brochure">
        <picture className="brochure-media">
          <source media="(max-width: 767px)" srcSet="/images/bros-mob.jpg" />
          <source media="(max-width: 991px)" srcSet="/images/bros-tab.jpg" />
          <img src="/images/bros-desk.jpg" alt="" loading="lazy" />
        </picture>
        <div className="brochure-fade" aria-hidden="true" />
        <div className="container">
          <div className="brochure-content">
            <p className="eyebrow-head">
              <span className="eyebrow-head-text">Download Brochure</span>
              <span className="eyebrow-underline" aria-hidden="true" />
            </p>
            <h2>
              Explore Benzer
              <br />
              Product Brochure
            </h2>
            <p>Know more about our products, finishes and applications.</p>
            <a
              href="/assets/BenzerPaints-Brochure.pdf"
              className="primary-btn"
              download
            >
              Download Brochure
            </a>
          </div>
        </div>
      </section>
      <section className="painters-prefer">
        <div className="container">
          <div className="painters-prefer-panel">
            <div className="painters-prefer-intro">
              <p className="eyebrow-head">
                <span className="eyebrow-head-text">Why Painters Prefer</span>
                <span className="eyebrow-underline" aria-hidden="true" />
              </p>
              <h2 className="painters-prefer-heading">
                Performance that
                <br />
                Professionals
                <br />
                Rely On.
              </h2>
              <p className="painters-prefer-desc">
                From better coverage to long-lasting protection, Benzer
                Paints is engineered to deliver results that professionals
                can trust, every single time.
              </p>
              <a href="#" className="primary-btn">
                Explore Benzer
              </a>
            </div>

            <div className="painters-prefer-diagram">
              <div className="painters-prefer-orbit-center">
                <span className="painters-prefer-orbit-center-icon"><ShieldCheckIcon /></span>
              </div>

              {/* One ring through all 5 nodes, instead of a separate spoke
                  connector per node. */}
              {/* An SVG circle with stroke-dasharray, not a CSS
                  border-style:dotted + border-radius circle — the latter
                  is notoriously unreliable across browsers for evenly
                  spaced round dots on a curve; stroke-dasharray is built
                  exactly for this. */}
              <svg className="painters-prefer-orbit-ring" viewBox="0 0 380 380" aria-hidden="true">
                <circle
                  cx="190"
                  cy="190"
                  r="187"
                  fill="none"
                  stroke="var(--beige)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="10 14"
                />
              </svg>

              {/* .painters-prefer-orbit-group is what actually travels
                  around the ring (GSAP rotates it continuously, see the
                  effect below) — it has no CSS-authored transform of its
                  own, so GSAP owns it exclusively. Each node's static
                  rotate/translate below places it at its pentagon slot
                  *within* that rotating group, so all 5 keep their 72°
                  spacing as the whole assembly sweeps around. */}
              <div className="painters-prefer-orbit-group">
                {PAINTERS_PREFER_FEATURES.map((feature) => (
                  <div
                    className={`painters-prefer-orbit-node painters-prefer-orbit-node--${feature.position}`}
                    key={feature.title}
                  >
                    <div className="painters-prefer-orbit-node-content">
                      {/* Counter-rotates in sync with the group (opposite
                          direction, same duration) so the icon/label stay
                          upright the whole time they're traveling. */}
                      <div className="painters-prefer-orbit-node-spin">
                        <span className="painters-prefer-orbit-icon">{feature.icon}</span>
                        <h3 className="painters-prefer-feature-title">{feature.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      

      <section className="become-dealer">
        <picture className="become-dealer-media">
          <source media="(max-width: 767px)" srcSet="/images/become-dealer-bg-mob.jpg" />
          <img src="/images/become-dealer-bg.jpg" alt="" loading="lazy" />
        </picture>
        <div className="become-dealer-fade" aria-hidden="true" />
        <div className="container">
          <div className="become-dealer-content">
            <p className="eyebrow-head">
              <span className="eyebrow-head-text">Distributor Partnership</span>
              <span className="eyebrow-underline" aria-hidden="true" />
            </p>
            <h2>
              Become A
              <br />
              Benzer Dealer
            </h2>
            <p>
              Join our growing network of dealers and distributors across
              India and grow your business with Benzer Paints.
            </p>
            <Link to="/dealer-inquiry" className="primary-btn">
              Apply Now
            </Link>
          </div>
        </div>
      </section>
      {/* <section className="video-testimonial">
        <div className="container">
          <div className="heading">
            <p className="eyebrow-head">
              <span className="eyebrow-head-text">Their Words</span>
              <span className="eyebrow-underline" aria-hidden="true" />
            </p>
            <h2>Our Happy Customers</h2>
          </div>

          <div className="video-testimonial-in" ref={testimonialTrackRef}>
            {TESTIMONIALS.map((testimonial, i) => {
              const isPlaying = playingTestimonial === i;
              const hasThumbnail = testimonial.thumbnail && !brokenThumbnails[i];
              return (
                <div className="testimonial-card" key={i}>
                  <div className="testimonial-card-media">
                    {isPlaying ? (
                      // key forces a fresh <video> element on every play —
                      // reusing the auto-thumbnail <video> node below (same
                      // tag, same slot) would just flip the `autoplay` prop
                      // on an already-loaded element, which browsers ignore.
                      <video
                        key="playing"
                        src={testimonial.video}
                        autoPlay
                        playsInline
                        onEnded={() => setPlayingTestimonial(null)}
                      />
                    ) : hasThumbnail ? (
                      <img
                        key="thumbnail"
                        src={testimonial.thumbnail}
                        alt={testimonial.name}
                        loading="lazy"
                        onError={() =>
                          setBrokenThumbnails((prev) => ({ ...prev, [i]: true }))
                        }
                      />
                    ) : (
                      // No thumbnail supplied, or it 404'd — fall back to the
                      // video itself, paused on its first frame, as a free
                      // auto-thumbnail.
                      <video
                        key="poster"
                        src={testimonial.video}
                        preload="metadata"
                        muted
                        playsInline
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="testimonial-card-scrim" aria-hidden="true" />
                  <div className="testimonial-card-bar">
                    <button
                      type="button"
                      className="testimonial-card-play"
                      aria-label={
                        isPlaying
                          ? `Pause ${testimonial.name}'s testimonial`
                          : `Play ${testimonial.name}'s testimonial`
                      }
                      onClick={() => setPlayingTestimonial(isPlaying ? null : i)}
                    >
                      {isPlaying ? (
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                          <rect x="5" y="4" width="5" height="16" rx="1.2" />
                          <rect x="14" y="4" width="5" height="16" rx="1.2" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                          <path d="M8 5.14v13.72c0 .78.87 1.24 1.51.81l10.7-6.86a.98.98 0 0 0 0-1.62L9.51 4.33A.98.98 0 0 0 8 5.14Z" />
                        </svg>
                      )}
                    </button>
                    <div className="testimonial-card-info">
                      <span className="testimonial-card-name">{testimonial.name}</span>
                      <span className="testimonial-card-title">{testimonial.title}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="testimonial-nav">
            <button
              type="button"
              className="testimonial-nav-btn"
              aria-label="Previous testimonial"
              onClick={() => scrollTestimonials(-1)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="testimonial-nav-btn"
              aria-label="Next testimonial"
              onClick={() => scrollTestimonials(1)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section> */}

      <section className="faq">
        <div className="container faq-grid">
          <div className="faq-media">
            <img
              src="/images/faq-img.jpg"
              alt="Freshly painted interior wall"
              loading="lazy"
              className="img"
            />
          </div>

          <div className="faq-content">
            <h2>Frequently Asked Questions</h2>

            <div className="faq-list">
              {FAQ_ITEMS.map((item, i) => {
                const isOpen = i === openFaq;
                return (
                  <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={item.question}>
                    <button
                      type="button"
                      className="faq-question"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq((prev) => (prev === i ? -1 : i))}
                    >
                      <span>{item.question}</span>
                      <span className="faq-icon">
                        <PlusIcon />
                      </span>
                    </button>
                    <div className="faq-answer" ref={(el) => (faqAnswerRefs.current[i] = el)}>
                      <div className="faq-answer-inner">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage;
