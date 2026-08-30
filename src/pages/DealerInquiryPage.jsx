import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { INDIA_STATES } from "../data/indiaLocations";

const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
    <path d="M3.4 20.6 21 12 3.4 3.4 3 10l12 2-12 2Z" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MONTHLY_PURCHASE_OPTIONS = [
  "Below ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000 – ₹5,00,000",
  "₹5,00,000 – ₹10,00,000",
  "Above ₹10,00,000",
];

const EMPTY_FORM = {
  fullName: "",
  mobile: "",
  email: "",
  state: "",
  city: "",
  address: "",
  pincode: "",
  businessType: "Own Shop",
  businessName: "",
  gst: "",
  monthlyPurchase: "",
  message: "",
};

const DealerInquiryPage = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
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
        ".dealer-form-desc, .dealer-field, .dealer-submit, .dealer-form-note",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "power3.out", delay: 0.3 }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleChange = (field) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // No backend to send this to yet — this just validates the interaction
  // client-side. Wire up a real submit handler once there's an endpoint.
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm(EMPTY_FORM);
  };

  return (
    <section className="dealer-inquiry top-spacing">
      <div className="dealer-inquiry-bg" aria-hidden="true">
        <picture>
          <source media="(max-width: 991px)" srcSet="/images/dealer-inquiry-bg-mob.jpg" />
          <img src="/images/dealer-inquiry-bg.jpg" alt="" loading="eager" />
        </picture>
      </div>
      <div className="dealer-inquiry-fade" aria-hidden="true" />

      <div className="container dealer-inquiry-container">
        <div className="dealer-form-card">
          <h2 className="dealer-form-heading" ref={headingRef}>
            Dealer Inquiry Form
          </h2>
          <span className="dealer-form-underline" aria-hidden="true" />
          <p className="dealer-form-desc">
            Please fill in the details below and our team will get in touch
            with you shortly.
          </p>

          <form className="dealer-form" onSubmit={handleSubmit}>
            <div className="dealer-field">
              <label htmlFor="fullName">
                Full Name <span className="req">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange("fullName")}
                required
              />
            </div>

            <div className="dealer-form-row">
              <div className="dealer-field">
                <label htmlFor="mobile">
                  Mobile Number <span className="req">*</span>
                </label>
                <input
                  id="mobile"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={form.mobile}
                  onChange={handleChange("mobile")}
                  required
                />
              </div>
              <div className="dealer-field">
                <label htmlFor="email">
                  Email Address <span className="req">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>
            </div>

            <div className="dealer-field">
              <label htmlFor="address">Full Address</label>
              <input
                id="address"
                type="text"
                placeholder="Enter your full address"
                value={form.address}
                onChange={handleChange("address")}
              />
            </div>

            <div className="dealer-field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                placeholder="Enter your city"
                value={form.city}
                onChange={handleChange("city")}
              />
            </div>

            <div className="dealer-form-row">
              <div className="dealer-field">
                <label htmlFor="state">State</label>
                <div className="dealer-select-wrap">
                  <select id="state" value={form.state} onChange={handleChange("state")}>
                    <option value="" disabled>
                      Select your state
                    </option>
                    {INDIA_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
              </div>

              <div className="dealer-field">
                <label htmlFor="pincode">Pincode</label>
                <input
                  id="pincode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="Enter 6-digit pincode"
                  value={form.pincode}
                  onChange={handleChange("pincode")}
                />
              </div>
            </div>

            <div className="dealer-field">
              <span className="dealer-field-label">
                Business Type <span className="req">*</span>
              </span>
              <div className="dealer-radio-row">
                <label className="dealer-radio">
                  <input
                    type="radio"
                    name="businessType"
                    value="Own Shop"
                    checked={form.businessType === "Own Shop"}
                    onChange={handleChange("businessType")}
                  />
                  Own Shop
                </label>
                <label className="dealer-radio">
                  <input
                    type="radio"
                    name="businessType"
                    value="Distributor"
                    checked={form.businessType === "Distributor"}
                    onChange={handleChange("businessType")}
                  />
                  Distributor
                </label>
              </div>
            </div>

            <div className="dealer-field">
              <label htmlFor="businessName">
                Shop / Business Name <span className="req">*</span>
              </label>
              <input
                id="businessName"
                type="text"
                placeholder="Enter shop or business name"
                value={form.businessName}
                onChange={handleChange("businessName")}
                required
              />
            </div>

            <div className="dealer-field">
              <label htmlFor="gst">GST Number</label>
              <input
                id="gst"
                type="text"
                placeholder="Enter GST number (if available)"
                value={form.gst}
                onChange={handleChange("gst")}
              />
            </div>

            <div className="dealer-field">
              <label htmlFor="monthlyPurchase">
                Approx. Monthly Paint Purchase <span className="req">*</span>
              </label>
              <div className="dealer-select-wrap">
                <select
                  id="monthlyPurchase"
                  value={form.monthlyPurchase}
                  onChange={handleChange("monthlyPurchase")}
                  required
                >
                  <option value="" disabled>
                    Select approximate value
                  </option>
                  {MONTHLY_PURCHASE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
            </div>

            <div className="dealer-field">
              <label htmlFor="message">Additional Message</label>
              <textarea
                id="message"
                placeholder="Write your message (optional)"
                value={form.message}
                onChange={handleChange("message")}
              />
            </div>

            <button type="submit" className="dealer-submit">
              <SendIcon /> Submit Inquiry
            </button>

            <p className="dealer-form-note">
              <LockIcon /> Your information is safe with us.
            </p>

            {submitted && (
              <p className="contact-form-success" role="status">
                Thanks — we&rsquo;ve received your inquiry and will be in
                touch soon.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default DealerInquiryPage;
