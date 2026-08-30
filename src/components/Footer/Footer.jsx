import { Link } from "react-router-dom";
import "./footer.css";

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20px"
    height="20px"
    viewBox="0 0 1024 1024"
    className="site-footer-heart"
    aria-hidden="true"
  >
    <path
      d="M 983.384 381.465 c 0 -147.456 -119.467 -266.923 -266.923 -266.923 c -81.4649 0 -154.283 36.4089 -203.207 93.8662 c -48.9245 -57.4578 -121.856 -93.8662 -203.207 -93.8662 c -147.456 0 -266.923 119.467 -266.923 266.923 c 0 77.3689 35.6125 142.109 85.5609 195.811 L 514.275 947.964 l 378.994 -366.592 c 48.0142 -50.0622 90.112 -120.377 90.112 -199.907 Z"
      fill="#d1525c"
    />
    <path
      d="M 514.275 947.964 L 128.569 577.276 C 78.507 523.574 43.008 458.835 43.008 381.465 c 0 -147.456 119.467 -266.923 266.923 -266.923 c 81.4649 0 154.283 36.4089 203.207 93.8662 l 1.13778 739.555 Z"
      fill="#db6574"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <path
      d="M14.5 8.5h2V5.6c-.35-.05-1.55-.15-2.95-.15-2.92 0-4.92 1.83-4.92 5.2v2.7H6.1v3.3h3.53V21h3.4v-4.35h3.38l.53-3.3h-3.91v-2.35c0-.96.26-1.5 1.47-1.5Z"
      fill="currentColor"
    />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="8" cy="8.5" r="1.3" fill="currentColor" />
    <path d="M8 11.3v6.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path
      d="M11.5 17.5v-3.7c0-1.3.75-2.1 1.9-2.1s1.85.8 1.85 2.1v3.7"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path d="M11.5 17.5v-6.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#", Icon: LinkedinIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "Facebook", href: "#", Icon: FacebookIcon },
];

// href starting with "/" is a real route (rendered via <Link>, no full
// page reload); "#" entries are pages that don't exist yet.
const FOOTER_LINKS = [
  { label: "About Us", href: "#" },
  { label: "Products", href: "#" },
  { label: "Career", href: "#" },
  { label: "Blogs", href: "#" },
  { label: "FAQs", href: "#" },
  { label: "Contact Us", href: "/contact" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-top">
        <div className="site-footer-brand">
          <div className="site-footer-brand-row">
            <Link to="/" className="site-footer-logo">
              <img src="/icons/benzer-logo.png" alt="Benzer Paints" />
            </Link>
            <img
              src="/icons/iso-logo.png"
              alt="ISO 9001:2015 Certified"
              className="site-footer-iso"
            />
          </div>

          <div className="site-footer-cta-row">
            <a
              href="/assets/BenzerPaints-Brochure.pdf"
              className="site-footer-brochure"
              download
            >
              Download Brochure
            </a>
            <Link to="/dealer-inquiry" className="primary-btn blue">
              Dealers Inquiry
            </Link>
          </div>
        </div>

        <div className="site-footer-links">
          <nav className="site-footer-nav">
            <ul>
              {FOOTER_LINKS.map((link) => (
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

          <div className="site-footer-contact">
            <a href="mailto:info@benzerpaints.com">info@benzerpaints.com</a>
            <a href="tel:+911204618033">+91 120 4618033</a>
            <a
              href="https://maps.app.goo.gl/DLCfuGjcBzk6KdLr9"
              target="_blank"
              rel="noopener noreferrer"
            >
              S.NO 133/2 Bhadle Vasti, Tal Haveli, Uruli Devachi, <br />Pune,
              Maharashtra 412308
            </a>
          </div>

          <div className="site-footer-social">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="site-footer-divider" />
      </div>

      <div className="container site-footer-bottom">
        <p>Copyright &copy; {year} Benzer Paints. All rights reserved.</p>
        <div className="site-footer-legal">
          <a href="#">Terms and Conditions</a>
          <a href="#">Privacy Policy</a>
        </div>
        <p className="site-footer-credit">
          Crafted With <HeartIcon /> By{" "}
          <a href="https://ayumastudio.com/" target="_blank" rel="noopener noreferrer">
            Ayuma Studio
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
