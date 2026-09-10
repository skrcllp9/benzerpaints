import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { submitContactEnquiry } from "../lib/contactEnquiries";

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <path
      d="M7.5 3.5 10 6a1.5 1.5 0 0 1-.2 2L8.3 9.5a11 11 0 0 0 6.2 6.2l1.5-1.5a1.5 1.5 0 0 1 2-.2l2.5 2.5a1.5 1.5 0 0 1 0 2l-1.2 1.2a2.5 2.5 0 0 1-2.6.6C11.9 18.4 5.6 12.1 3.7 7.3a2.5 2.5 0 0 1 .6-2.6L5.5 3.5a1.5 1.5 0 0 1 2 0Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2.4" stroke="currentColor" strokeWidth="1.6" />
    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <path
      d="M12 21.5c4.5-4.5 7-8.1 7-11.5a7 7 0 1 0-14 0c0 3.4 2.5 7 7 11.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

// Pulled from the footer's contact details (see Footer.jsx) so this page
// and the footer never drift apart. Address links to the same Google Maps
// URL already used there.
const CONTACT_INFO = [
  {
    label: "Customer Support",
    value: "7391074994 (10:00 AM – 5:00 PM)",
    href: "tel:+917391074994",
    icon: <PhoneIcon />,
  },
  { label: "Email", value: "info@benzerpaints.com", href: "mailto:info@benzerpaints.com", icon: <MailIcon /> },
  {
    label: "Address",
    value:
      "First Floor, Office No.1, Survey No. 133/2, Pune Saswad Road, Bhadalewasti, Uruli Devachi, Pune, Maharashtra 412308, India",
    href: "https://maps.app.goo.gl/DLCfuGjcBzk6KdLr9",
    icon: <PinIcon />,
  },
];

const EMPTY_FORM = { firstName: "", lastName: "", email: "", phone: "", message: "" };

const ContactPage = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const headingRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion || !headingRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, filter: "blur(14px)", y: 24 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, ease: "power3.out", delay: 0.15 }
      );
      gsap.fromTo(
        [".contact-hero-desc", ".contact-form-card", ".contact-info-card"],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out", delay: 0.35 }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Digits only, capped at 10 — the +91 prefix is fixed in the UI, so the
  // field itself only ever holds the local number.
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((prev) => ({ ...prev, phone: digits }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitContactEnquiry(form);
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch {
      setError("Something went wrong sending your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="contact-hero top-spacing">
        <div className="container">
          <h2 className="contact-hero-heading" ref={headingRef}>
            Get in Touch
          </h2>
          <p className="contact-hero-desc">
            Have questions or want to discuss a project? We&rsquo;d love to
            hear from you. Fill out the form below and we&rsquo;ll get back
            to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="contact-main">
        <div className="container contact-grid">
          <div className="contact-info-card">
            {CONTACT_INFO.map((item) => (
              <a
                key={item.label}
                className="contact-info-item"
                href={item.href}
                target={item.label === "Address" ? "_blank" : undefined}
                rel={item.label === "Address" ? "noopener noreferrer" : undefined}
              >
                <span className="contact-info-icon">{item.icon}</span>
                <span className="contact-info-text">
                  <span className="contact-info-label">{item.label}</span>
                  <span className="contact-info-value">{item.value}</span>
                </span>
              </a>
            ))}

            <div className="contact-info-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.657183507609!2d73.96971909999999!3d18.453868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2e973e4915981%3A0x78b5a9e6fa604460!2sBENZER%20PAINTS!5e0!3m2!1sen!2sin!4v1787922068292!5m2!1sen!2sin"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Benzer Paints location"
              />
            </div>
          </div>

          <div className="contact-form-card">
            <h3>Send us a Message</h3>
            <p>Fill out the form below and we&rsquo;ll respond as soon as possible.</p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange("firstName")}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={handleChange("lastName")}
                    required
                  />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="phone">Phone</label>
                  <div className="phone-input-wrap">
                    <span className="phone-input-prefix">+91</span>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={handlePhoneChange}
                      maxLength={10}
                      pattern="[0-9]{10}"
                      title="Enter a 10-digit mobile number"
                    />
                  </div>
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  placeholder="Message"
                  value={form.message}
                  onChange={handleChange("message")}
                  required
                />
              </div>

              {error && <p className="job-application-error">{error}</p>}

              <button type="submit" className="primary-btn blue contact-submit" disabled={submitting}>
                {submitting ? "Sending…" : "Send Message"}
              </button>

              {submitted && (
                <p className="contact-form-success" role="status">
                  Thanks — we&rsquo;ve got your message and will be in touch soon.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
