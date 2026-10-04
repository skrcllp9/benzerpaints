import { useEffect } from "react";
import "./product-bucket.css";

const SCRIPT_SRC = "/assets/benzer-bucket.js";

// Wraps the drop-in bucket animation in public/assets/benzer-bucket.js (one
// script for every product — the label image and lid/splash colour are
// per-host data attributes). That file is a self-contained IIFE which scans
// the document once for [data-benzer-bucket] hosts when it executes, so it
// can't just sit in index.html — the hosts below don't exist until this
// route renders. A fresh <script> is appended on every mount instead, which
// re-runs the scan; the script's own `__bz` flag stops an already-mounted
// host from being built twice (StrictMode's double effect, or several
// buckets on one page). The script sizes itself to the host via
// ResizeObserver, so all the responsive work is just CSS on .product-bucket.
//
// `color` is optional (the script defaults to the Alfa plum) and
// colorLight/colorDark are derived from it by the script when omitted.
const ProductBucket = ({ label, alt, color, colorLight, colorDark, disc = true, speed = 1 }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <div
      className="product-bucket"
      data-benzer-bucket
      data-label={label}
      data-color={color}
      data-color-light={colorLight}
      data-color-dark={colorDark}
      data-disc={disc ? undefined : "false"}
      data-speed={speed}
      role="img"
      aria-label={alt}
    />
  );
};

export default ProductBucket;
