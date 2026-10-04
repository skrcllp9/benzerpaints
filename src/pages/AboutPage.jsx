import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLeaders } from "../lib/leaders";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VISION_PILLARS = [
  {
    title: "Quality First",
    text: "Every batch is made to perform, from the first coat to years of protection.",
  },
  {
    title: "Trusted Partnerships",
    text: "We grow alongside our dealers, painters and customers, not ahead of them.",
  },
  {
    title: "Colour for Everyone",
    text: "Dependable paints and wall solutions that are within reach of every home.",
  },
];

const PLACEHOLDER_IMAGE = "/images/leader-placeholder.svg";

// Shown until leaders are added from /admin/leaders (mirrors the seed in
// supabase/schema_v3.sql).
const DEFAULT_LEADERS = [
  { id: "d1", name: "Mr. Vijay Gupta", role: "Managing Director", image_url: "" },
  { id: "d2", name: "Mr. Diwakar Singhal", role: "Director", image_url: "" },
  { id: "d3", name: "Mr. Shubham Gupta", role: "Director", image_url: "" },
];

const AboutPage = () => {
  const rootRef = useRef(null);
  // Managed from /admin/leaders; falls back to the defaults above while the
  // table is empty or unreachable.
  const [leaders, setLeaders] = useState(DEFAULT_LEADERS);

  useEffect(() => {
    fetchLeaders()
      .then((rows) => {
        if (rows.length > 0) setLeaders(rows);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(".eyebrow-underline", { scaleX: 1 });
        return;
      }

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

      gsap.utils.toArray(".about-copy").forEach((p) => {
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

      [[".about-pillar", ".about-pillars"]].forEach(([items, trigger]) => {
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      gsap.fromTo(
        ".about-join-btn",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-join-btn",
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Cards get their own effect because the list can be swapped for the
  // admin-managed one after the first render.
  useEffect(() => {
    if (leaders.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-leader",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-leaders-grid",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [leaders]);

  return (
    <div ref={rootRef}>
      <section className="about-intro top-spacing">
        <div className="container">
          <div className="heading">
            <p className="eyebrow-head">
              <span className="eyebrow-head-text">Who We Are</span>
              <span className="eyebrow-underline" aria-hidden="true" />
            </p>
            <h2>Our Story</h2>
            <p className="about-copy">
              Benzer Paints is a Pune-based paint company making interior and exterior paints, waterproofing solutions and wall care products for homes, workplaces and institutions across India. Our range covers everything a wall needs, from distempers and emulsions to damp-proofing coatings, white cement and waterproof cement.
            </p>
            <p className="about-copy">
              From our plant at Uruli Devachi, we focus on one thing: paints that apply easily, cover well and last. Every product is made with the same care, whether it is meant for a small home or a large commercial project, and every batch is checked before it leaves for the dealer.
            </p>
            <p className="about-copy">
              We believe a good paint should not be difficult to use or hard to trust. That is why we keep our formulations dependable, our finishes consistent and our pricing fair, so painters, contractors and homeowners can pick Benzer Paints with confidence.
            </p>
            <p className="about-copy">
              Behind the products is a network of dealers and applicators who carry our name to every corner of the market. We work closely with them, listening to what they see on site, and we use that feedback to keep improving what we make and how we serve them.
            </p>
</div>
        </div>
      </section>

      <section className="about-vision">
        <div className="container">
          <div className="heading">
            <p className="eyebrow-head">
              <span className="eyebrow-head-text">Where We Are Headed</span>
              <span className="eyebrow-underline" aria-hidden="true" />
            </p>
            <h2>Our Vision</h2>
            <p className="about-copy">
              To be a paint brand people trust for its quality and honesty, bringing lasting colour and protection to every wall we touch.
            </p>
            <p className="about-copy">
              We want Benzer Paints to be the first name that comes to mind when someone plans to repaint, waterproof or finish a wall, whether in a village home, a city apartment or a large building. To get there, we are investing in better products, a wider dealer network and the skills of the people who apply our paints.
            </p>
            <p className="about-copy">
              We see paint as more than decoration. It protects a building from weather, damp and wear, and it shapes how a space feels to live and work in. Our goal is to make that protection and that beauty available to everyone, without compromise on quality.
            </p>
            <p className="about-copy">
              Growth, for us, is measured by trust: repeat customers, dealers who stay with us and walls that still look good years after the last coat.
            </p>
          </div>
          <div className="about-pillars">
            {VISION_PILLARS.map((pillar, i) => (
              <div className="about-pillar" key={pillar.title}>
                <span className="about-pillar-num">0{i + 1}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-leaders">
        <div className="container">
          <div className="heading">
            <p className="eyebrow-head">
              <span className="eyebrow-head-text">The People Behind Benzer Paints</span>
              <span className="eyebrow-underline" aria-hidden="true" />
            </p>
            <h2>Our Leaders</h2>
          </div>
          <div className="about-leaders-grid">
            {leaders.map((leader) => (
              <div className="about-leader" key={leader.id}>
                <div className="about-leader-photo">
                  <img src={leader.image_url || PLACEHOLDER_IMAGE} alt={leader.name} loading="lazy" />
                </div>
                <h3>{leader.name}</h3>
                <span>{leader.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-join">
        <div className="container">
          <div className="about-join-card">
            <h2>Join Us</h2>
            <p className="about-copy">
              Help us build a paint brand that people trust. <br /> Explore the open positions and grow with the Benzer Paints team.
            </p>
            <Link to="/career" className="primary-btn about-join-btn">
              View Open Positions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
