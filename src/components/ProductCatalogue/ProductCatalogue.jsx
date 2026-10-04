import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { PRODUCT_RANGES } from "../../data/productCatalogue";
import "./product-catalogue.css";

gsap.registerPlugin(ScrollTrigger);

// The full line-up, one range at a time. Tabs pick the range; the panel
// below re-renders for it (keyed, so React swaps the DOM outright) and the
// effect staggers the new range's contents in. Heading/eyebrow reveals are
// handled by ProductsPage.jsx's page-wide h2/.eyebrow-head pass.
const ProductCatalogue = () => {
  const [activeKey, setActiveKey] = useState(PRODUCT_RANGES[0].key);
  const panelRef = useRef(null);
  const tabRefs = useRef([]);

  const activeIndex = PRODUCT_RANGES.findIndex((range) => range.key === activeKey);
  const active = PRODUCT_RANGES[activeIndex];

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    // One ScrollTrigger covers both cases: on first load it waits for the
    // panel to scroll into view; on a tab switch the panel is already past
    // its start line, so it fires immediately.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panelRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
      tl.fromTo(
        ".product-catalogue-aside > *",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" }
      ).fromTo(
        ".product-catalogue-group-head, .product-catalogue-item",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.025, ease: "power3.out" },
        0.1
      );
    }, panelRef);

    return () => ctx.revert();
  }, [activeKey]);

  // Standard tablist keyboard behaviour: arrows move between ranges.
  const onTabKeyDown = (event) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (activeIndex + step + PRODUCT_RANGES.length) % PRODUCT_RANGES.length;
    setActiveKey(PRODUCT_RANGES[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="product-catalogue">
      <div className="container">
        <div className="heading">
          <p className="eyebrow-head">
            <span className="eyebrow-head-text">The Full Range</span>
            <span className="eyebrow-underline" aria-hidden="true" />
          </p>
          <h2>Everything We Make</h2>
        </div>

        <div className="product-catalogue-tabs" role="tablist" aria-label="Product ranges">
          {PRODUCT_RANGES.map((range, i) => (
            <button
              type="button"
              key={range.key}
              ref={(el) => (tabRefs.current[i] = el)}
              role="tab"
              id={`product-catalogue-tab-${range.key}`}
              aria-selected={range.key === activeKey}
              aria-controls="product-catalogue-panel"
              tabIndex={range.key === activeKey ? 0 : -1}
              className={`product-catalogue-tab product-catalogue-tab--${range.key} ${range.key === activeKey ? "is-active" : ""}`}
              onClick={() => setActiveKey(range.key)}
              onKeyDown={onTabKeyDown}
            >
              <span className="product-catalogue-tab-number">{range.number}</span>
              <span className="product-catalogue-tab-text">
                <span className="product-catalogue-tab-tier">{range.tier}</span>
                <span className="product-catalogue-tab-name">{range.name}</span>
              </span>
            </button>
          ))}
        </div>

        <div
          className="product-catalogue-panel"
          id="product-catalogue-panel"
          role="tabpanel"
          aria-labelledby={`product-catalogue-tab-${active.key}`}
          ref={panelRef}
          key={active.key}
        >
          <div className="product-catalogue-aside">
            <span className="product-catalogue-range-label">
              Range {active.number} · {active.tier}
            </span>
            <h3>{active.name}</h3>
            <p>{active.summary}</p>
            <ul className="product-catalogue-brands" aria-label="Brands in this range">
              {active.brands.map((brand) => (
                <li key={brand}>{brand}</li>
              ))}
            </ul>
          </div>

          <div className="product-catalogue-groups">
            {active.groups.map((group) => (
              <div className="product-catalogue-group" key={group.title}>
                <div className="product-catalogue-group-head">
                  <h4>{group.title}</h4>
                  <ul className="product-catalogue-packs" aria-label="Pack sizes">
                    {group.packs.map((pack) => (
                      <li key={pack}>{pack}</li>
                    ))}
                  </ul>
                </div>
                <ul className="product-catalogue-items">
                  {group.products.map((product) => (
                    <li className="product-catalogue-item" key={product}>
                      <span className="product-catalogue-item-dot" aria-hidden="true" />
                      {product}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalogue;
