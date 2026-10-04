import { useEffect, useRef, useState } from "react";
import {
  createLeader,
  deleteLeader,
  fetchLeaders,
  updateLeader,
  uploadLeaderImage,
} from "../../lib/leaders";
import "./admin.css";

const EMPTY = { name: "", role: "", image_url: "", sort_order: 0 };

const AdminLeadersPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // null = adding a new one
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
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

  const reset = () => {
    setEditingId(null);
    setForm(EMPTY);
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const startEdit = (leader) => {
    setEditingId(leader.id);
    setForm({
      name: leader.name,
      role: leader.role,
      image_url: leader.image_url,
      sort_order: leader.sort_order,
    });
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFile = (e) => {
    const picked = e.target.files?.[0];
    if (picked && !picked.type.startsWith("image/")) {
      setNotice({ type: "error", message: "Please choose an image file." });
      e.target.value = "";
      return;
    }
    setFile(picked || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const image_url = file ? await uploadLeaderImage(file) : form.image_url;
      const values = {
        name: form.name.trim(),
        role: form.role.trim(),
        image_url,
        sort_order: Number(form.sort_order) || 0,
      };
      if (editingId) await updateLeader(editingId, values);
      else await createLeader(values);
      setNotice({ type: "success", message: editingId ? "Leader updated." : "Leader added." });
      reset();
      await load();
    } catch {
      setNotice({ type: "error", message: "Couldn't save that leader. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (leader) => {
    if (!window.confirm(`Remove ${leader.name}? This can't be undone.`)) return;
    try {
      await deleteLeader(leader.id);
      setLeaders((prev) => prev.filter((l) => l.id !== leader.id));
      if (editingId === leader.id) reset();
    } catch {
      setNotice({ type: "error", message: "Couldn't remove that leader." });
    }
  };

  const preview = file ? URL.createObjectURL(file) : form.image_url;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Leaders</h1>
          <p>The people shown under "Our Leaders" on the About page.</p>
        </div>
      </div>

      {notice && <p className={`admin-alert admin-alert-${notice.type}`}>{notice.message}</p>}

      <form className="admin-form-card admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit leader" : "Add a leader"}</h3>
        <div className="admin-form-row">
          <div className="admin-field">
            <label htmlFor="leader-name">Name</label>
            <input
              id="leader-name"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="leader-role">Position</label>
            <input
              id="leader-role"
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-field">
            <label htmlFor="leader-image">Photo</label>
            <input id="leader-image" ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
            <span className="admin-field-hint">Square or portrait photos look best.</span>
          </div>
          <div className="admin-field">
            <label htmlFor="leader-order">Display order</label>
            <input
              id="leader-order"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((p) => ({ ...p, sort_order: e.target.value }))}
            />
            <span className="admin-field-hint">Lower numbers appear first.</span>
          </div>
        </div>
        {preview && <img src={preview} alt="" className="admin-leader-preview" />}
        <div className="admin-form-actions">
          {editingId && (
            <button type="button" className="admin-btn admin-btn-ghost" onClick={reset}>
              Cancel
            </button>
          )}
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? "Saving…" : editingId ? "Save Changes" : "Add Leader"}
          </button>
        </div>
      </form>

      <div className="admin-table-card" style={{ marginTop: 24 }}>
        {loading ? (
          <div className="admin-empty-state">Loading…</div>
        ) : leaders.length === 0 ? (
          <div className="admin-empty-state">No leaders yet — add one above.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Position</th>
                <th>Order</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader) => (
                <tr key={leader.id}>
                  <td>
                    {leader.image_url ? (
                      <img src={leader.image_url} alt="" className="admin-leader-thumb" />
                    ) : (
                      <span className="admin-field-hint">None</span>
                    )}
                  </td>
                  <td>{leader.name}</td>
                  <td>{leader.role}</td>
                  <td>{leader.sort_order}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button type="button" className="admin-btn admin-btn-ghost" onClick={() => startEdit(leader)}>
                        Edit
                      </button>
                      <button type="button" className="admin-btn admin-btn-danger" onClick={() => handleDelete(leader)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AdminLeadersPage;
