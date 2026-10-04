import { useEffect, useMemo, useRef, useState } from "react";
import ImageCropModal from "../../components/ImageCropModal/ImageCropModal";
import { createLeader, fetchLeaders, updateLeader, uploadLeaderImage } from "../../lib/leaders";
import "./admin.css";

const SLOT_COUNT = 3;
const PLACEHOLDER_IMAGE = "/images/leader-placeholder.svg";

const AdminLeadersPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // slot index being edited
  const [form, setForm] = useState({ name: "", role: "", image_url: "" });
  const [file, setFile] = useState(null);
  const [cropSource, setCropSource] = useState(null); // picked file awaiting crop
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const fileRef = useRef(null);

  const load = () =>
    fetchLeaders()
      .then(setLeaders)
      .catch(() => setNotice({ type: "error", message: "Couldn't load leaders." }))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  // Live preview of a freshly chosen photo (not revoked on cleanup — React's
  // dev-mode effect double-run would kill it before it paints).
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => leaders[i] || null);

  const startEdit = (index) => {
    const leader = slots[index];
    setEditing(index);
    setForm({ name: leader?.name || "", role: leader?.role || "", image_url: leader?.image_url || "" });
    setFile(null);
    setNotice(null);
  };

  const cancel = () => {
    setEditing(null);
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // Clears both a freshly chosen file and the saved photo; takes effect on Save.
  const removePhoto = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setForm((p) => ({ ...p, image_url: "" }));
  };

  const handleFile = (e) => {
    const picked = e.target.files?.[0];
    if (picked && !picked.type.startsWith("image/")) {
      setNotice({ type: "error", message: "Please choose an image file." });
      e.target.value = "";
      return;
    }
    if (picked) setCropSource(picked);
  };

  const finishCrop = (cropped) => {
    setFile(cropped);
    setCropSource(null);
  };

  const cancelCrop = () => {
    setCropSource(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const image_url = file ? await uploadLeaderImage(file) : form.image_url;
      const values = { name: form.name.trim(), role: form.role.trim(), image_url };
      const existing = slots[editing];
      if (existing) await updateLeader(existing.id, values);
      else await createLeader({ ...values, sort_order: editing + 1 });
      setNotice({ type: "success", message: "Saved — it's live on the About page." });
      cancel();
      await load();
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
          <h1>Leaders</h1>
          <p>The three people shown under "Our Leaders" on the About page. Click a card to edit it.</p>
        </div>
      </div>

      {cropSource && (
        <ImageCropModal
          file={cropSource}
          aspect={1}
          onConfirm={finishCrop}
          onCancel={cancelCrop}
        />
      )}

      {notice && <p className={`admin-alert admin-alert-${notice.type}`}>{notice.message}</p>}

      <div className="admin-leader-grid">
        {slots.map((leader, i) =>
          editing === i ? (
            <form className="admin-leader-card is-editing" key={i} onSubmit={handleSave}>
              <div className="admin-leader-card-photo">
                <img src={preview || form.image_url || PLACEHOLDER_IMAGE} alt="Photo preview" />
              </div>
              <div className="admin-field">
                <label htmlFor={`leader-image-${i}`}>Photo</label>
                <input
                  id={`leader-image-${i}`}
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                />
                <span className="admin-field-hint">Square or portrait photos look best.</span>
                {(preview || form.image_url) && (
                  <button type="button" className="admin-link-danger" onClick={removePhoto}>
                    Remove photo
                  </button>
                )}
              </div>
              <div className="admin-field">
                <label htmlFor={`leader-name-${i}`}>Name</label>
                <input
                  id={`leader-name-${i}`}
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="admin-field">
                <label htmlFor={`leader-role-${i}`}>Position</label>
                <input
                  id={`leader-role-${i}`}
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                />
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={cancel} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          ) : (
            <button type="button" className="admin-leader-card" key={i} onClick={() => startEdit(i)}>
              <div className="admin-leader-card-photo">
                <img src={leader?.image_url || PLACEHOLDER_IMAGE} alt={leader?.name || "Empty slot"} />
              </div>
              <span className="admin-leader-card-name">{leader?.name || "Empty slot"}</span>
              <span className="admin-leader-card-role">{leader?.role || "Click to add a leader"}</span>
              <span className="admin-leader-card-edit">Click to edit</span>
            </button>
          )
        )}
      </div>
    </>
  );
};

export default AdminLeadersPage;
