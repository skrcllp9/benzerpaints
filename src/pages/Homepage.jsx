import { useRef, useEffect } from "react";
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

const Homepage = () => {
  const productsPinRef = useRef(null);
  const productsTrackRef = useRef(null);

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
      <HeroBanner />

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

      <section className="become-dealer">
        <picture className="become-dealer-media">
          <source media="(max-width: 767px)" srcSet="/images/become-dealer-bg-mob.png" />
          <img src="/images/become-dealer-bg.png" alt="" loading="lazy" />
        </picture>
        <div className="become-dealer-fade" aria-hidden="true" />
        <div className="container">
          <div className="become-dealer-content">
            <p className="eyebrow-head">Distributor Partnership</p>
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
          <div className="videp-testimonial-in">
            <div className="heading">
              <p className="eyebrow-head">Their Words</p>
              <h2>Our Heappy Customer</h2>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage;
