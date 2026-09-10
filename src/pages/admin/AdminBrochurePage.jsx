import { useEffect, useRef, useState } from "react";
import { fetchBrochureSettingAdmin, uploadBrochure } from "../../lib/settings";
import "./admin.css";

const TOAST_DURATION = 4000;

// Local to this page for now — extract if a second admin page needs one.
const AdminToast = ({ toast, onDismiss }) => {
  if (!toast) return null;
  return (
    <div className={`admin-toast admin-toast-${toast.type}`} role="status">
      <span>{toast.message}</span>
      <button type="button" className="admin-toast-close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
};

const AdminBrochurePage = () => {
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBrochureSettingAdmin()
      .then(setCurrent)
      .catch(() => setToast({ type: "error", message: "Couldn't load the current brochure." }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), TOAST_DURATION);
    return () => clearTimeout(id);
  }, [toast]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setToast({ type: "error", message: "Please choose a PDF file." });
      e.target.value = "";
      setPendingFile(null);
      return;
    }
    setPendingFile(file);
  };

  const handleUpdate = async () => {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const url = await uploadBrochure(pendingFile);
      setCurrent({ value: url, updated_at: new Date().toISOString() });
      setToast({ type: "success", message: "Brochure updated — it's now live on the site." });
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setToast({ type: "error", message: "Couldn't upload that file. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="admin-empty-state">Loading…</div>;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Brochure</h1>
          <p>The PDF linked from every "Download Brochure" button on the site.</p>
        </div>
      </div>

      <AdminToast toast={toast} onDismiss={() => setToast(null)} />

      <div className="admin-form-card">
        <div className="admin-field">
          <label>Current Brochure</label>
          {current?.value ? (
            <a href={current.value} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost">
              View Current PDF
            </a>
          ) : (
            <span className="admin-field-hint">No brochure set yet.</span>
          )}
          {current?.updated_at && (
            <span className="admin-field-hint">Last updated {new Date(current.updated_at).toLocaleString()}</span>
          )}
        </div>

        <div className="admin-field">
          <label htmlFor="brochure-upload">Replace With New PDF</label>
          <input
            ref={fileInputRef}
            id="brochure-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <span className="admin-field-hint">
            Choose a file, then click Update Brochure — it replaces the one linked across the whole site immediately.
          </span>
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleUpdate}
            disabled={!pendingFile || uploading}
          >
            {uploading ? "Updating…" : "Update Brochure"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminBrochurePage;
