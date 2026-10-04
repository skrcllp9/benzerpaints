import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useBrochureUrl } from "../hooks/useBrochureUrl";
import ProductCatalogue from "../components/ProductCatalogue/ProductCatalogue";
import ProductBucket from "../components/ProductBucket/ProductBucket";

gsap.registerPlugin(ScrollTrigger);

// Every bucket label prints the same four selling points, so they're shared.
const FEATURED_POINTS = [
  "Smooth and elegant matt finish",
  "Excellent hiding and covering power",
  "Easy to apply",
  "Long lasting protection",
];

// `color` (+ optional light/dark) is the lid and splash palette handed to
// benzer-bucket.js — matched to each label's own dominant colour.
const FEATURED_PRODUCTS = [
  {
    key: "alfa",
    name: "AP Alfa Acrylic Distemper",
    desc: "A water-based acrylic distemper that adds beauty to your interior walls with a smooth, even finish.",
    label: "/assets/alfa-label.webp",
    color: "#520c36",
    colorLight: "#7a2b5e",
    colorDark: "#33061f",
  },
  {
    key: "birla",
    name: "Birla Cem Super Acrylic Emulsion",
    desc: "An acrylic emulsion for interior walls, with excellent coverage and a finish that is washable to some extent.",
    label: "/assets/birla-label.webp",
    color: "#0f1f4c",
  },
  {
    key: "camel",
    name: "BP Camel Damproof",
    desc: "A damp-resistant coating for exterior and interior surfaces, built for adhesion and durability.",
    label: "/assets/camel-label.webp",
    color: "#42301c",
    colorLight: "#6b4d2e",
    colorDark: "#26190c",
  },
];

const PRODUCT_RANGE = [
  { title: "Interior Paints", image: "/images/interior.avif" },
  { title: "Exterior Paints", image: "/images/exterior.avif" },
  { title: "Waterproofing Solutions", image: "/images/waterproofing.avif" },
  { title: "White Cement & Wall Solutions", image: "/images/white-cement.avif" },
  { title: "Waterproof Cement", image: "/images/waterproofing-cement.avif" },
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="m8 12.3 2.7 2.7L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = ({ dir }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <path
      d={dir === "left" ? "m14.5 5.5-6.5 6.5 6.5 6.5" : "m9.5 5.5 6.5 6.5-6.5 6.5"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ProductsPage = () => {
  const rootRef = useRef(null);
  const rangeTrackRef = useRef(null);
  const [rangeEdge, setRangeEdge] = useState({ start: true, end: false });

  // Below desktop the category grid turns into a swipeable slider; these
  // keep the arrow buttons in sync with where the track is scrolled.
  useEffect(() => {
    const track = rangeTrackRef.current;
    if (!track) return;
    const update = () =>
      setRangeEdge({
        start: track.scrollLeft <= 2,
        end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2,
      });
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const slideRange = (direction) => {
    const track = rangeTrackRef.current;
    const card = track?.querySelector(".products-range-card");
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  };
  const brochureUrl = useBrochureUrl();

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // The underline rests at scaleX(0) in CSS and is only ever drawn in
      // by the reveal below — without motion it has to be shown outright.
      if (reduceMotion) {
        gsap.set(".eyebrow-underline", { scaleX: 1 });
        return;
      }

      // Same reveal conventions as Homepage.jsx / BlogsPage.jsx.
      gsap.utils.toArray("h2").forEach((heading) => {
        gsap.fromTo(
          heading,
          { opacity: 0, filter: "blur(14px)", y: 24 },
          {
            opacity: 1,
            filter: "blur(0px)", clearProps: "filter",
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

      gsap.utils.toArray(".products-showcase-desc").forEach((p) => {
        gsap.fromTo(
          p,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: p,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      gsap.utils.toArray(".products-featured").forEach((panel) => {
        // Opacity only on the bucket's wrapper — the script inside drives
        // its own transforms every frame, so nothing here should touch them.
        gsap.fromTo(
          panel.querySelector(".products-featured-media"),
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.fromTo(
          panel.querySelectorAll(".products-featured-content > *"),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      gsap.fromTo(
        ".products-range-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".products-range-grid",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".products-cta-row",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".products-cta-row",
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <section className="products-showcase top-spacing">
        <div className="container">
          <div className="heading">
            <p className="eyebrow-head">
              <span className="eyebrow-head-text">What We Offer</span>
              <span className="eyebrow-underline" aria-hidden="true" />
            </p>
            <h2>Our Products</h2>
            <p className="products-showcase-desc">
              A look at some of the paints and wall solutions from the Benzer Paints range, made for homes, workplaces and everything in between.
            </p>
          </div>

          <div className="products-featured-list">
            {FEATURED_PRODUCTS.map((product) => (
              <div className="products-featured" key={product.key}>
                <div className="products-featured-media">
                  <ProductBucket
                    label={product.label}
                    alt={`Benzer Paints ${product.name} bucket`}
                    color={product.color}
                    colorLight={product.colorLight}
                    colorDark={product.colorDark}
                  />
                </div>
                <div className="products-featured-content">
                  <span className="products-featured-tag">Featured Product</span>
                  <h3>{product.name}</h3>
                  <p>{product.desc}</p>
                  <ul className="products-featured-points">
                    {FEATURED_POINTS.map((point) => (
                      <li key={point}>
                        <CheckIcon />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="products-cta-row">
            <Link to="/dealer-inquiry" className="primary-btn">
              Enquire Now
            </Link>
            <a href={brochureUrl} className="primary-btn products-cta-outline" download>
              Download Product Catalogue
            </a>
          </div>
        </div>
      </section>

      <ProductCatalogue />

      <section className="products-range">
        <div className="container">
          <div className="heading">
            <p className="eyebrow-head">
              <span className="eyebrow-head-text">Categories</span>
              <span className="eyebrow-underline" aria-hidden="true" />
            </p>
            <h2>Categories We Are Offering</h2>
          </div>

          <div className="products-range-slider">
            <div className="products-range-grid" ref={rangeTrackRef}>
            {PRODUCT_RANGE.map((product) => (
              <div className="products-range-card" key={product.title}>
                <div className="products-range-card-media">
                  <img src={product.image} alt={product.title} loading="lazy" />
                </div>
                <span className="products-range-card-title">{product.title}</span>
              </div>
            ))}
          </div>
            <div className="products-range-nav">
              <button
                type="button"
                className="products-range-arrow"
                onClick={() => slideRange(-1)}
                disabled={rangeEdge.start}
                aria-label="Previous category"
              >
                <ChevronIcon dir="left" />
              </button>
              <button
                type="button"
                className="products-range-arrow"
                onClick={() => slideRange(1)}
                disabled={rangeEdge.end}
                aria-label="Next category"
              >
                <ChevronIcon dir="right" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
