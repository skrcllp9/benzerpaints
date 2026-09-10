import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import lenis from "../animation";
import { fetchPublishedJobBySlug, submitApplication, uploadResume } from "../lib/jobs";

const EMPTY_FORM = { fullName: "", email: "", phone: "", coverNote: "" };
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

// Pure CSS draw-in (see .success-check-circle/.success-check-mark) — no
// GSAP, so it's unaffected by the "no animation" removal elsewhere on the
// career pages, and respects prefers-reduced-motion on its own.
const SuccessCheckIcon = () => (
  <svg viewBox="0 0 52 52" width="64" height="64" className="success-check" aria-hidden="true">
    <circle className="success-check-circle" cx="26" cy="26" r="24" fill="none" />
    <path className="success-check-mark" fill="none" d="M14.5 27l7 7 16-16" />
  </svg>
);

const JobApplicationPage = () => {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchPublishedJobBySlug(slug)
      .then((data) => {
        if (!data) setNotFound(true);
        setJob(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Digits only, capped at 10 — the +91 prefix is fixed in the UI, so the
  // field itself only ever holds the local number.
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((prev) => ({ ...prev, phone: digits }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > MAX_RESUME_BYTES) {
      setError("Resume must be under 5MB.");
      e.target.value = "";
      setResumeFile(null);
      return;
    }
    setError("");
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!resumeFile) {
      setError("Please attach your resume.");
      return;
    }

    setSubmitting(true);
    try {
      const resumePath = await uploadResume(job.id, resumeFile);
      await submitApplication({
        jobId: job.id,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        coverNote: form.coverNote.trim(),
        resumePath,
      });
      setSubmitted(true);
      // The success view is much shorter than the form, so the old scroll
      // position (usually well down the page, near the submit button)
      // would otherwise land on the footer for a frame before the browser
      // catches up. Scrolling to top isn't enough on its own — the loader
      // overlay below stays up through two animation frames so the reset
      // has fully settled *before* the success card is ever revealed,
      // instead of racing it.
      lenis.scrollTo(0, { immediate: true });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSubmitting(false));
      });
    } catch {
      setError("Something went wrong submitting your application. Please try again.");
      setSubmitting(false);
    }
  };

  const loaderOverlay = submitting && (
    <div className="page-loader-overlay" role="status" aria-label="Submitting your application…">
      <span className="page-loader-spinner" />
    </div>
  );

  if (loading) return <section className="job-application top-spacing" />;

  if (notFound) {
    return (
      <section className="job-detail-missing top-spacing">
        <div className="container">
          <h2>Position not found</h2>
          <p>This role may have closed or moved.</p>
          <Link to="/career" className="primary-btn blue">
            Back to Careers
          </Link>
        </div>
      </section>
    );
  }

  if (submitted) {
    return (
      <>
        {loaderOverlay}
        <section className="job-application-success top-spacing">
          <div className="container">
            <div className="job-application-success-card">
              <SuccessCheckIcon />
              <h2 className="job-application-success-title">Application Sent</h2>
              <p>
                Thanks for applying to <strong>{job.title}</strong> — we&rsquo;ve received your
                resume and will be in touch if there&rsquo;s a fit.
              </p>
              <Link to="/career" className="primary-btn blue">
                Back to Careers
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {loaderOverlay}
      <section className="job-application top-spacing">
        <div className="container job-application-container">
          <Link to={`/career/${job.slug}`} className="blog-detail-back job-application-back">
            &larr; Back to {job.title}
          </Link>

          <div className="job-application-card">
            <h2 className="job-application-title">Apply for {job.title}</h2>
            <p className="job-application-desc">
              {job.department} &middot; {job.location} &middot; {job.job_type}
            </p>

            <form className="job-application-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="app-name">Full Name</label>
                  <input
                    id="app-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="app-email">Email</label>
                  <input
                    id="app-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="app-phone">Phone</label>
                <div className="phone-input-wrap">
                  <span className="phone-input-prefix">+91</span>
                  <input
                    id="app-phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    title="Enter a 10-digit mobile number"
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="app-note">Cover Note (optional)</label>
                <textarea
                  id="app-note"
                  placeholder="Tell us why you'd be a good fit for this role"
                  value={form.coverNote}
                  onChange={handleChange("coverNote")}
                />
              </div>

              <div className="contact-field">
                <label htmlFor="app-resume">Resume (PDF or Word, max 5MB)</label>
                <input id="app-resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
              </div>

              {error && <p className="job-application-error">{error}</p>}

              <button type="submit" className="primary-btn blue contact-submit" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default JobApplicationPage;
