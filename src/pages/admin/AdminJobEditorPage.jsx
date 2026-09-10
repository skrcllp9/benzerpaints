import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createJob, fetchJobByIdAdmin, JOB_TYPES, updateJob } from "../../lib/jobs";
import { slugify } from "../../lib/blogs";
import "./admin.css";

const EMPTY_FORM = {
  title: "",
  slug: "",
  department: "",
  location: "",
  jobType: "Full-time",
  experienceLevel: "",
  description: "",
  published: false,
};

const AdminJobEditorPage = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  // Tracks which action is mid-flight ("draft" | "publish" | null) so each
  // button can show its own "Saving…" label instead of a shared boolean.
  const [savingAction, setSavingAction] = useState(null);
  const [error, setError] = useState("");
  // The job's real published_at, kept out of `form` so re-publishing an
  // already-published post (or toggling it back to draft and republishing)
  // doesn't bump its date — only the first-ever publish sets this.
  const originalPublishedAtRef = useRef(null);

  useEffect(() => {
    if (isNew) return;
    fetchJobByIdAdmin(id)
      .then((job) => {
        if (!job) {
          setError("Job not found.");
          return;
        }
        setForm({
          title: job.title,
          slug: job.slug,
          department: job.department,
          location: job.location,
          jobType: job.job_type,
          experienceLevel: job.experience_level,
          description: job.description,
          published: job.published,
        });
        originalPublishedAtRef.current = job.published_at;
        setSlugTouched(true);
      })
      .catch(() => setError("Couldn't load this job."))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const setField = (field) => (value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !slugTouched) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSave = async (publish) => {
    setError("");

    if (!form.title.trim() || !form.slug.trim()) {
      setError("Title and slug are required.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      slug: slugify(form.slug),
      department: form.department.trim(),
      location: form.location.trim(),
      job_type: form.jobType,
      experience_level: form.experienceLevel.trim(),
      description: form.description.trim(),
      published: publish,
      published_at: publish ? originalPublishedAtRef.current || new Date().toISOString() : originalPublishedAtRef.current,
    };

    setSavingAction(publish ? "publish" : "draft");
    try {
      if (isNew) {
        const created = await createJob(payload);
        navigate(`/admin/jobs/${created.id}`, { replace: true });
      } else {
        await updateJob(id, payload);
      }
      navigate("/admin/jobs");
    } catch {
      setError("Couldn't save this job — the slug may already be in use.");
    } finally {
      setSavingAction(null);
    }
  };

  if (loading) return <div className="admin-empty-state">Loading…</div>;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>{isNew ? "New Job" : "Edit Job"}</h1>
          <p>Only published jobs are visible on /career.</p>
        </div>
        {!isNew && (
          <span className={`admin-status-pill ${form.published ? "is-published" : "is-draft"}`}>
            {form.published ? "Published" : "Draft"}
          </span>
        )}
      </div>

      {error && <p className="admin-alert admin-alert-error">{error}</p>}

      <div className="admin-form-card">
        <form className="admin-form" onSubmit={(e) => e.preventDefault()}>
          <div className="admin-field">
            <label htmlFor="job-title">Title</label>
            <input
              id="job-title"
              type="text"
              value={form.title}
              onChange={(e) => setField("title")(e.target.value)}
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="job-slug">Slug</label>
            <input
              id="job-slug"
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setField("slug")(e.target.value);
              }}
              required
            />
            <span className="admin-field-hint">/career/{form.slug || "…"}</span>
          </div>

          <div className="admin-form-row">
            <div className="admin-field">
              <label htmlFor="job-department">Department</label>
              <input
                id="job-department"
                type="text"
                value={form.department}
                onChange={(e) => setField("department")(e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="job-location">Location</label>
              <input
                id="job-location"
                type="text"
                value={form.location}
                onChange={(e) => setField("location")(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-field">
              <label htmlFor="job-type">Job Type</label>
              <select id="job-type" value={form.jobType} onChange={(e) => setField("jobType")(e.target.value)}>
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="job-experience">Experience Level</label>
              <input
                id="job-experience"
                type="text"
                placeholder="e.g. 2-4 years"
                value={form.experienceLevel}
                onChange={(e) => setField("experienceLevel")(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="job-description">Description</label>
            <textarea
              id="job-description"
              value={form.description}
              onChange={(e) => setField("description")(e.target.value)}
              required
            />
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={() => navigate("/admin/jobs")}
              disabled={savingAction !== null}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={() => handleSave(false)}
              disabled={savingAction !== null}
            >
              {savingAction === "draft" ? "Saving…" : "Save as Draft"}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => handleSave(true)}
              disabled={savingAction !== null}
            >
              {savingAction === "publish" ? "Publishing…" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminJobEditorPage;
