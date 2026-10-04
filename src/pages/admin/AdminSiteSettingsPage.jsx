import { useEffect, useState } from "react";
import { DEFAULT_SITE_INFO, fetchSiteInfo, saveSiteInfo } from "../../lib/settings";
import "./admin.css";

const FIELDS = [
  {
    heading: "Contact",
    items: [
      { key: "contact_phone", label: "Phone number", placeholder: "7391074994" },
      {
        key: "contact_phone_note",
        label: "Phone hours note",
        placeholder: "(10:00 AM – 5:00 PM)",
        hint: "Shown after the number on the Contact page only.",
      },
      { key: "contact_email", label: "Email", placeholder: "info@benzerpaints.com", type: "email" },
    ],
  },
  {
    heading: "Address",
    items: [
      {
        key: "address",
        label: "Address",
        textarea: true,
        hint: "Press Enter to start a new line — the footer shows it exactly as typed.",
      },
      { key: "maps_url", label: "Google Maps link", placeholder: "https://maps.app.goo.gl/…", type: "url" },
    ],
  },
  {
    heading: "Social links",
    items: [
      { key: "social_linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/…", type: "url" },
      { key: "social_instagram", label: "Instagram URL", placeholder: "https://instagram.com/…", type: "url" },
      { key: "social_facebook", label: "Facebook URL", placeholder: "https://facebook.com/…", type: "url" },
    ],
    hint: "Leave a link empty to hide that icon in the footer.",
  },
];

const AdminSiteSettingsPage = () => {
  const [form, setForm] = useState(DEFAULT_SITE_INFO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetchSiteInfo()
      .then(setForm)
      .catch(() => setNotice({ type: "error", message: "Couldn't load the saved details." }))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      await saveSiteInfo(form);
      setNotice({ type: "success", message: "Saved — the footer and Contact page are updated." });
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
          <p>Contact details, address and social links used in the footer and on the Contact page.</p>
        </div>
      </div>

      {notice && <p className={`admin-alert admin-alert-${notice.type}`}>{notice.message}</p>}

      <form className="admin-form-card admin-form" onSubmit={handleSubmit}>
        {FIELDS.map((group) => (
          <div className="admin-form" key={group.heading}>
            <h3>{group.heading}</h3>
            {group.items.map((item) => (
              <div className="admin-field" key={item.key}>
                <label htmlFor={item.key}>{item.label}</label>
                {item.textarea ? (
                  <textarea id={item.key} rows={3} value={form[item.key]} onChange={handleChange(item.key)} />
                ) : (
                  <input
                    id={item.key}
                    type={item.type || "text"}
                    placeholder={item.placeholder}
                    value={form[item.key]}
                    onChange={handleChange(item.key)}
                  />
                )}
                {item.hint && <span className="admin-field-hint">{item.hint}</span>}
              </div>
            ))}
            {group.hint && <span className="admin-field-hint">{group.hint}</span>}
          </div>
        ))}

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AdminSiteSettingsPage;
