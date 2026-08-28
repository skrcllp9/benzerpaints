import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import HeroBanner from "../components/HeroBanner/HeroBanner";

gsap.registerPlugin(ScrollTrigger);

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
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <HeroBanner />

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
