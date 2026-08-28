import { useRef, useEffect, useState } from "react";
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

// Icon colors rotate through our existing palette (no new hues introduced)
// so the four cards read distinctly without going off-brand.
const WHY_CHOOSE_FEATURES = [
  { title: "28+ Years of Expertise", desc: "Nearly three decades of experience you can rely on.", accent: "orange", icon: <CalendarIcon /> },
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

// Add more entries here as clients send more testimonials — the grid
// (.video-testimonial-in) wraps automatically, it isn't a fixed column
// count. Every card points at the same placeholder clip for now; swap
// each `video` (and `thumbnail`) once real per-client footage exists.
const SAMPLE_VIDEO = "/videos/sample-video.mp4";
const TESTIMONIALS = [
  { name: "Client Name", title: "Designation, Company", thumbnail: "/images/testimonial-1.jpg", video: SAMPLE_VIDEO },
  { name: "Client Name", title: "Designation, Company", thumbnail: "/images/testimonial-2.jpg", video: SAMPLE_VIDEO },
  { name: "Client Name", title: "Designation, Company", thumbnail: "/images/testimonial-3.jpg", video: SAMPLE_VIDEO },
  { name: "Client Name", title: "Designation, Company", thumbnail: "/images/testimonial-4.jpg", video: SAMPLE_VIDEO },
];

const Homepage = () => {
  const productsPinRef = useRef(null);
  const productsTrackRef = useRef(null);
  const testimonialTrackRef = useRef(null);
  const [playingTestimonial, setPlayingTestimonial] = useState(null);
  // Tracks thumbnails that 404'd/failed to load (keyed by index) — a
  // `thumbnail` path being set doesn't mean the file actually exists, so
  // the video-first-frame fallback is decided at load time, not just from
  // whether the field is filled in.
  const [brokenThumbnails, setBrokenThumbnails] = useState({});

  // Nudges the carousel by most of a viewport-width — only visible/relevant
  // at the tablet/mobile breakpoint where .video-testimonial-in becomes a
  // scroll-snap carousel instead of the desktop grid. Scroll-snap settles
  // the rest, so this doesn't need to know individual card widths.
  const scrollTestimonials = (direction) => {
    const el = testimonialTrackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

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
        .querySelectorAll(".become-dealer-content p:not(.eyebrow-head)")
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
      // transformOrigin pinned to the icon's own fixed center (not the
      // default 50%/50%, which — like the CSS fix in custom.css — would
      // otherwise pivot against this box's variable height (titles wrap to
      // 1 or 2 lines), wobbling the icon off the ring during the orbit.
      tl.to(".painters-prefer-orbit-node-spin", {
        rotation: -360,
        duration,
        ease: "none",
        transformOrigin: "50% 28px",
      }, 0);
    });

    return () => ctx.revert();
  }, []);

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
              With over <strong>28 years</strong> of expertise, Benzer Paints delivers
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
          <source media="(max-width: 767px)" srcSet="/images/become-dealer-bg-mob.png" />
          <img src="/images/become-dealer-bg.png" alt="" loading="lazy" />
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
            <a href="#dealer-inquiry" className="primary-btn">
              Apply Now
            </a>
          </div>
        </div>
      </section>
      <section className="video-testimonial">
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
      </section>
    </>
  );
};

export default Homepage;
