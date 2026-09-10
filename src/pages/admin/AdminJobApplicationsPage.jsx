import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { deleteApplication, fetchAllApplicationsAdmin, getResumeSignedUrl } from "../../lib/jobs";
import "./admin.css";

const AdminJobApplicationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const jobFilter = searchParams.get("job") || "all";

  useEffect(() => {
    fetchAllApplicationsAdmin()
      .then(setApplications)
      .catch(() => setError("Couldn't load applications."))
      .finally(() => setLoading(false));
  }, []);

  const jobs = useMemo(() => {
    const seen = new Map();
    applications.forEach((app) => {
      if (app.job_id && app.jobs?.title) seen.set(app.job_id, app.jobs.title);
    });
    return Array.from(seen, ([id, title]) => ({ id, title }));
  }, [applications]);

  const visibleApplications = useMemo(
    () => (jobFilter === "all" ? applications : applications.filter((app) => app.job_id === jobFilter)),
    [applications, jobFilter]
  );

  const handleViewResume = async (path) => {
    try {
      const url = await getResumeSignedUrl(path);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      window.alert("Couldn't open that resume.");
    }
  };

  const handleDelete = async (app) => {
    if (!window.confirm(`Delete ${app.full_name}'s application? This can't be undone.`)) return;
    try {
      await deleteApplication(app.id);
      setApplications((prev) => prev.filter((a) => a.id !== app.id));
    } catch {
      setError("Couldn't delete that application.");
    }
  };

  if (loading) return <div className="admin-empty-state">Loading…</div>;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Job Applications</h1>
          <p>Everyone who has applied across every posting.</p>
        </div>
        <select
          className="admin-filter-select"
          value={jobFilter}
          onChange={(e) => setSearchParams(e.target.value === "all" ? {} : { job: e.target.value })}
        >
          <option value="all">All Jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="admin-alert admin-alert-error">{error}</p>}

      <div className="admin-table-card">
        {visibleApplications.length === 0 ? (
          <div className="admin-empty-state">No applications yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Job</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Applied</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibleApplications.map((app) => (
                <tr key={app.id}>
                  <td>{app.full_name}</td>
                  <td>{app.jobs?.title || "—"}</td>
                  <td>{app.email}</td>
                  <td>{app.phone || "—"}</td>
                  <td>{new Date(app.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost"
                        onClick={() => handleViewResume(app.resume_path)}
                      >
                        Resume
                      </button>
                      <button type="button" className="admin-btn admin-btn-danger" onClick={() => handleDelete(app)}>
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

export default AdminJobApplicationsPage;
