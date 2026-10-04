import { useEffect, useState } from "react";
import { DEFAULT_SITE_INFO, fetchSiteInfo, saveSiteInfo } from "../../lib/settings";
import "./admin.css";

const TABS = [
  { key: "footer", label: "Footer", social: true, note: "Shown in the footer on every page." },
  { key: "contact", label: "Contact Page", social: false, note: "Shown on the Contact page." },
];

const SOCIAL_FIELDS = [
  { key: "social_linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/…" },
  { key: "social_instagram", label: "Instagram URL", placeholder: "https://instagram.com/…" },
  { key: "social_facebook", label: "Facebook URL", placeholder: "https://facebook.com/…" },
];

const AdminSiteSettingsPage = () => {
  const [info, setInfo] = useState(DEFAULT_SITE_INFO);
  const [tab, setTab] = useState("footer");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetchSiteInfo()
      .then(setInfo)
      .catch(() => setNotice({ type: "error", message: "Couldn't load the saved details." }))
      .finally(() => setLoading(false));
  }, []);

  const current = TABS.find((t) => t.key === tab);
  const form = info[tab];
  const update = (patch) => setInfo((prev) => ({ ...prev, [tab]: { ...prev[tab], ...patch } }));
  const handleChange = (key) => (e) => update({ [key]: e.target.value });

  const setPhone = (index, field) => (e) =>
    update({ phones: form.phones.map((p, i) => (i === index ? { ...p, [field]: e.target.value } : p)) });
  const addPhone = () => update({ phones: [...form.phones, { label: "", number: "", note: "" }] });
  const removePhone = (index) => update({ phones: form.phones.filter((_, i) => i !== index) });

  const switchTab = (key) => {
    setTab(key);
    setNotice(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      await saveSiteInfo(tab, form);
      setNotice({ type: "success", message: `Saved — the ${current.label.toLowerCase()} is updated.` });
    } catch {
      setNotice({ type: "error", message: "Couldn't save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-empty-state">Loading…</div>;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Site Settings</h1>
          <p>Contact details for the footer and the Contact page — each is set separately.</p>
        </div>
      </div>

      <div className="admin-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={`admin-tab ${tab === t.key ? "is-active" : ""}`}
            onClick={() => switchTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {notice && <p className={`admin-alert admin-alert-${notice.type}`}>{notice.message}</p>}

      <form className="admin-form-card admin-form" onSubmit={handleSubmit}>
        <span className="admin-field-hint">{current.note} Save applies to this tab only.</span>

        <div className="admin-form">
          <h3>Phone numbers</h3>
          <span className="admin-field-hint">
            Add as many as you need, each with its own label. Every number is a tap-to-call link. The note
            (e.g. hours) shows on the Contact page only.
          </span>
          {form.phones.map((phone, i) => (
            <div className="admin-phone-row" key={i}>
              <div className="admin-field">
                <label htmlFor={`phone-label-${i}`}>Label</label>
                <input
                  id={`phone-label-${i}`}
                  placeholder="Customer Support"
                  value={phone.label}
                  onChange={setPhone(i, "label")}
                />
              </div>
              <div className="admin-field">
                <label htmlFor={`phone-number-${i}`}>Number</label>
                <input
                  id={`phone-number-${i}`}
                  type="tel"
                  placeholder="7391074994"
                  value={phone.number}
                  onChange={setPhone(i, "number")}
                />
              </div>
              <div className="admin-field">
                <label htmlFor={`phone-note-${i}`}>Note (optional)</label>
                <input
                  id={`phone-note-${i}`}
                  placeholder="(10:00 AM – 5:00 PM)"
                  value={phone.note}
                  onChange={setPhone(i, "note")}
                />
              </div>
              <button type="button" className="admin-btn admin-btn-danger" onClick={() => removePhone(i)}>
                Remove
              </button>
            </div>
          ))}
          <div>
            <button type="button" className="admin-btn admin-btn-ghost" onClick={addPhone}>
              + Add Phone Number
            </button>
          </div>
        </div>

        <div className="admin-form">
          <h3>Email</h3>
          <div className="admin-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="info@benzerpaints.com"
              value={form.email}
              onChange={handleChange("email")}
            />
          </div>
        </div>

        <div className="admin-form">
          <h3>Address</h3>
          <div className="admin-field">
            <label htmlFor="address">Address</label>
            <textarea id="address" rows={3} value={form.address} onChange={handleChange("address")} />
            <span className="admin-field-hint">Press Enter to start a new line — it shows exactly as typed.</span>
          </div>
          <div className="admin-field">
            <label htmlFor="maps_url">Google Maps link</label>
            <input
              id="maps_url"
              type="url"
              placeholder="https://maps.app.goo.gl/…"
              value={form.maps_url}
              onChange={handleChange("maps_url")}
            />
            <span className="admin-field-hint">Where tapping the address opens. Leave empty to search the address on Google Maps.</span>
          </div>
        </div>

        {current.social && (
          <div className="admin-form">
            <h3>Social links</h3>
            {SOCIAL_FIELDS.map((f) => (
              <div className="admin-field" key={f.key}>
                <label htmlFor={f.key}>{f.label}</label>
                <input
                  id={f.key}
                  type="url"
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={handleChange(f.key)}
                />
              </div>
            ))}
            <span className="admin-field-hint">Leave a link empty to hide that icon in the footer.</span>
          </div>
        )}

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? "Saving…" : `Save ${current.label}`}
          </button>
        </div>
      </form>
    </>
  );
};

export default AdminSiteSettingsPage;
