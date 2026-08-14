import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Homepage = () => {
  const heroRef = useRef(null);
  const heroImgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroImgRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
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
            <a href="#" className="primary-btn pink">Explore Products</a>
        </div>
      </section>

      <section className="our-products">
        <div className="container">
          <div className="heading">
            <p className="eyebrow-head">What We Offer</p>
            <h2>Our Products</h2>
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage;
