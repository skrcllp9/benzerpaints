import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { fetchPublishedBlogs, formatBlogDate, getReadingTime } from "../lib/blogs";

gsap.registerPlugin(ScrollTrigger);

const PAGE_SIZE = 9;

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
    <path d="M4.5 12h15M13 5.5 19.5 12 13 18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const featuredCardRef = useRef(null);

  useEffect(() => {
    fetchPublishedBlogs()
      .then(setBlogs)
      .catch(() => setError("Couldn't load articles right now."))
      .finally(() => setLoading(false));
  }, []);

  const featured = blogs.find((blog) => blog.featured);
  const otherBlogs = blogs.filter((blog) => !featured || blog.id !== featured.id);

  // Static hero copy — present on first render regardless of the fetch
  // above, so this reveal runs once on mount rather than waiting on data.
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
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

      // Body copy under the hero heading: same word-rise reveal used on the
      // homepage's section intros (see Homepage.jsx), not a plain fade.
      document.querySelectorAll(".blogs-hero-desc").forEach((p) => {
        const words = p.textContent.trim().split(/\s+/);
        p.innerHTML = words
          .map((word) => `<span class="word-mask"><span class="word-inner">${word}</span></span>`)
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

  // Featured card + grid reveal — depends on data having arrived, since
  // neither exists in the DOM until the fetch above resolves.
  useEffect(() => {
    if (loading) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      // Featured card: image wipes in left-to-right, then its copy staggers
      // up right after — separate from the plain card-grid fade below so it
      // reads as the standout slot it is.
      if (featuredCardRef.current) {
        const media = featuredCardRef.current.querySelector(".blogs-featured-media");
        if (media) {
          gsap.set(media, { clipPath: "inset(0 0 0 100%)" });
          gsap.to(media, {
            clipPath: "inset(0 0 0 0%)",
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: featuredCardRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        }

        gsap.fromTo(
          featuredCardRef.current.querySelectorAll(".blogs-featured-content > *"),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuredCardRef.current,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Marked so the "load more" effect below knows which cards already
      // have their reveal wired up and only animates newly-appended ones.
      const initialCards = gsap.utils.toArray(".blog-card");
      gsap.fromTo(
        initialCards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".blogs-grid",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
      initialCards.forEach((card) => card.setAttribute("data-revealed", "true"));
    });

    return () => ctx.revert();
  }, [loading]);

  // "Load more" appends cards past the initial scroll-reveal setup above —
  // fade those in directly instead of re-running gsap.context (which would
  // replay the entrance animation on every card already on screen).
  useEffect(() => {
    if (loading || visibleCount === PAGE_SIZE) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const newCards = document.querySelectorAll(".blog-card:not([data-revealed])");
    if (!newCards.length) return;

    gsap.fromTo(
      newCards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" }
    );
    newCards.forEach((card) => card.setAttribute("data-revealed", "true"));
  }, [visibleCount, loading]);

  // Cursor-tilt on the featured card's image — desktop pointers only, and
  // skipped under reduced motion. Only touches the media's own transform
  // (the card itself is laid out with flex/grid, not a CSS transform), so
  // it never fights the GSAP reveal above. Re-runs once loading flips to
  // false, since the featured card doesn't exist in the DOM before then.
  useEffect(() => {
    const card = featuredCardRef.current;
    if (!card) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || isCoarsePointer) return;

    const media = card.querySelector(".blogs-featured-media");
    if (!media) return;

    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(media, {
        rotateX: py * -6,
        rotateY: px * 8,
        scale: 1.03,
        transformPerspective: 800,
        duration: 0.5,
        ease: "power3.out",
      });
    };
    const handleLeave = () => {
      gsap.to(media, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: "power3.out" });
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);
    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, [loading]);

  const visibleBlogs = otherBlogs.slice(0, visibleCount);
  const hasMore = visibleCount < otherBlogs.length;

  return (
    <>
      <section className="blogs-hero top-spacing">
        <div className="container">
          <p className="eyebrow-head">
            <span className="eyebrow-head-text">Our Blog</span>
            <span className="eyebrow-underline" />
          </p>
          <h2>Insights &amp; Ideas Worth Painting Over</h2>
          <p className="blogs-hero-desc">
            Practical guides on paint, waterproofing, colour, and everything
            else that goes into finishing a wall right — written for
            homeowners, painters, and dealers alike.
          </p>
        </div>
      </section>

      {error && (
        <section className="blogs-grid-section">
          <div className="container">
            <p className="career-status">{error}</p>
          </div>
        </section>
      )}

      {!loading && !error && blogs.length === 0 && (
        <section className="blogs-grid-section">
          <div className="container">
            <p className="career-status">No articles published yet — check back soon.</p>
          </div>
        </section>
      )}

      {featured && (
        <section className="blogs-featured-section">
          <div className="container">
            <Link
              to={`/blogs/${featured.slug}`}
              className="blogs-featured-card"
              ref={featuredCardRef}
            >
              <span className="blogs-featured-badge">Featured</span>
              <div className="blogs-featured-media">
                <img src={featured.cover_image} alt={featured.title} className="img" />
              </div>
              <div className="blogs-featured-content">
                <span className="blogs-featured-meta">
                  {formatBlogDate(featured.published_at)} <span aria-hidden="true">|</span> {featured.author}{" "}
                  <span aria-hidden="true">|</span> {getReadingTime(featured.content)}
                </span>
                <h3 className="blogs-featured-title">{featured.title}</h3>
                <p className="blogs-featured-excerpt">{featured.excerpt}</p>
                <span className="blogs-featured-link">
                  Read Article <ArrowIcon />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {otherBlogs.length > 0 && (
        <section className="blogs-grid-section">
          <div className="container">
            <p className="eyebrow-head">
              <span className="eyebrow-head-text">Latest Articles</span>
              <span className="eyebrow-underline" />
            </p>

            <div className="blogs-grid">
              {visibleBlogs.map((blog) => (
                <Link to={`/blogs/${blog.slug}`} className="blog-card" key={blog.slug}>
                  <div className="blog-card-media">
                    <img src={blog.cover_image} alt={blog.title} className="img" />
                  </div>
                  <div className="blog-card-body">
                    <span className="blog-card-meta">
                      {formatBlogDate(blog.published_at)} <span aria-hidden="true">|</span>{" "}
                      {getReadingTime(blog.content)}
                    </span>
                    <h3 className="blog-card-title">{blog.title}</h3>
                    <p className="blog-card-excerpt">{blog.excerpt}</p>
                    <span className="blog-card-link">
                      Read Article <ArrowIcon />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="blogs-load-more-wrap">
                <button
                  type="button"
                  className="blogs-load-more"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default BlogsPage;
