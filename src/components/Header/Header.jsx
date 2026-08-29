import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import lenis from "../../animation";
import "./header.css";

gsap.registerPlugin(ScrollTrigger);

// Below this scroll position the header always stays shown, regardless of
// direction — avoids it flickering hidden/shown right at the top of the page.
const HIDE_AFTER = 80;

// href starting with "/" is a real route (rendered via <Link>, no full
// page reload); "#" entries are pages that don't exist yet.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#" },
  { label: "Products", href: "#" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blogs", href: "#" },
  { label: "Career", href: "#" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const navRef = useRef(null);
  // Drives the reveal via GSAP instead of a CSS `transition`, so it can't
  // depend on a mobile browser's own state-change/GPU-layer timing on the
  // first toggle — a CSS `transition:` fix for that didn't hold up on
  // device. GSAP explicitly computes and sets clip-path every frame.
  const progress = useRef({ value: 0 });

  useEffect(() => {
    // Lenis drives scrolling itself (via wheel/touch + its own rAF loop),
    // so body overflow:hidden alone doesn't stop it — it needs to be
    // paused directly through its own API.
    if (menuOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      lenis.start();
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    // Hides the header on scroll-down and brings it back on scroll-up —
    // otherwise it sits fixed on top of the pinned "Our Products" section
    // and collides with that section's own heading while it's pinned.
    const yTo = gsap.quickTo(el, "yPercent", { duration: 0.4, ease: "power3.out" });

    if (menuOpen) yTo(0);

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (menuOpen) return;
        if (self.scroll() < HIDE_AFTER) {
          yTo(0);
        } else if (self.direction === 1) {
          yTo(-100);
        } else {
          yTo(0);
        }
      },
    });

    return () => st.kill();
  }, [menuOpen]);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    gsap.to(progress.current, {
      value: menuOpen ? 100 : 0,
      duration: 0.5,
      ease: "power3.inOut",
      onUpdate: () => {
        el.style.clipPath = `inset(0 0 ${100 - progress.current.value}% 0 round 28px)`;
      },
    });
  }, [menuOpen]);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="site-header-bar">
        <Link to="/" className="site-header-logo">
          <img src="/icons/benzer-logo.png" alt="Benzer Paints" />
        </Link>

        <nav className="site-header-nav-desktop">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                {link.href.startsWith("/") ? (
                  <Link to={link.href}>{link.label}</Link>
                ) : (
                  <a href={link.href}>{link.label}</a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header-actions">
          <a href="#dealer-inquiry" className="primary-btn site-header-cta blue">
            Dealers Inquiry
          </a>
          <button
            type="button"
            className={`site-header-toggle ${menuOpen ? "is-open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Kept as a sibling of .site-header-bar (not nested inside it) —
          the bar's backdrop-filter creates its own stacking context, which
          was trapping this nav's z-index inside it and letting the overlay
          intercept clicks meant for the links despite a "higher" z-index. */}
      <nav
        ref={navRef}
        className={`site-header-nav-mobile ${menuOpen ? "is-open" : ""}`}
      >
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              {link.href.startsWith("/") ? (
                <Link to={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ) : (
                <a href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <a
          href="#dealer-inquiry"
          className="primary-btn blue site-header-cta-drawer"
          onClick={() => setMenuOpen(false)}
        >
          Dealers Inquiry
        </a>
      </nav>

      {menuOpen && (
        <div
          className="site-header-overlay"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Header;
