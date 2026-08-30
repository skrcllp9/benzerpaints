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

const BackArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
    <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <path
      d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="m9 12 2 2 4-4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrendUpIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <path d="M4 16.5 9.5 10l4 4L20 6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.5 6.5H20V12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DEALER_INFO_FEATURES = [
  {
    title: "Premium Quality Products",
    desc: "Durable, high-performance paints that customers trust.",
    accent: "orange",
    icon: <ShieldCheckIcon />,
  },
  {
    title: "High Growth Potential",
    desc: "Expanding market with immense opportunities for growth.",
    accent: "green",
    icon: <TrendUpIcon />,
  },
];

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
  const [step, setStep] = useState(1);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const isFirstStepRender = useRef(true);

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
        ".dealer-form-desc, .dealer-field, .dealer-submit, .dealer-form-note, .dealer-info-heading, .dealer-info-desc, .dealer-info-feature",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "power3.out", delay: 0.3 }
      );

      const eyebrowText = document.querySelector(".dealer-info-eyebrow .eyebrow-head-text");
      const eyebrowUnderline = document.querySelector(".dealer-info-eyebrow .eyebrow-underline");
      if (eyebrowText) {
        gsap.set(eyebrowText, { clipPath: "inset(0 100% 0 0)" });
        gsap.to(eyebrowText, { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power3.out", delay: 0.15 });
      }
      if (eyebrowUnderline) {
        gsap.to(eyebrowUnderline, { scaleX: 1, duration: 0.5, ease: "power2.out", delay: 0.85 });
      }
    });

    return () => ctx.revert();
  }, []);

  // Re-run the field reveal whenever the visible step changes so step 2's
  // fields fade in too — skipped on the very first mount since the effect
  // above already handles that reveal.
  useEffect(() => {
    if (isFirstStepRender.current) {
      isFirstStepRender.current = false;
      return;
    }
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dealer-form-step > *",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, [step]);

  const handleChange = (field) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const goToStep2 = () => {
    if (formRef.current && !formRef.current.reportValidity()) return;
    setStep(2);
  };

  const goToStep1 = () => setStep(1);

  // No backend to send this to yet — this just validates the interaction
  // client-side. Wire up a real submit handler once there's an endpoint.
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm(EMPTY_FORM);
    setStep(1);
  };

  return (
    <section className="dealer-inquiry top-spacing">
      <div className="container dealer-inquiry-container">
        <div className="dealer-info-panel">
          <p className="eyebrow-head dealer-info-eyebrow">
            <span className="eyebrow-head-text">Partner With Us</span>
            <span className="eyebrow-underline" aria-hidden="true" />
          </p>
          <h2 className="dealer-info-heading">
            Become Our
            <br />
            Trusted Dealer
          </h2>
          <p className="dealer-info-desc">
            Join hands with a brand that stands for quality, innovation and
            trust. Let&rsquo;s build a strong and successful partnership
            together.
          </p>

          <div className="dealer-info-features">
            {DEALER_INFO_FEATURES.map((feature) => (
              <div className={`dealer-info-feature dealer-info-feature--${feature.accent}`} key={feature.title}>
                <span className="dealer-info-feature-icon">{feature.icon}</span>
                <span className="dealer-info-feature-title">{feature.title}</span>
                <span className="dealer-info-feature-desc">{feature.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dealer-form-card">
          <h2 className="dealer-form-heading" ref={headingRef}>
            Dealer Inquiry Form
          </h2>
          <span className="dealer-form-underline" aria-hidden="true" />
          <p className="dealer-form-desc">
            Please fill in the details below and our team will get in touch
            with you shortly.
          </p>

          <form className="dealer-form" onSubmit={handleSubmit} ref={formRef}>
            {step === 1 && (
              <div className="dealer-form-step">
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

                <button type="button" className="dealer-submit" onClick={goToStep2}>
                  Next: Business Details <SendIcon />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="dealer-form-step">
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

                <div className="dealer-step-actions">
                  <button type="button" className="dealer-step-back" onClick={goToStep1}>
                    <BackArrowIcon /> Back
                  </button>
                  <button type="submit" className="dealer-submit">
                    <SendIcon /> Submit Inquiry
                  </button>
                </div>

                <p className="dealer-form-note">
                  <LockIcon /> Your information is safe with us.
                </p>
              </div>
            )}

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
