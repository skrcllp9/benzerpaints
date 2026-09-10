import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteJob, fetchAllJobsAdmin } from "../../lib/jobs";
import "./admin.css";

const AdminJobsListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllJobsAdmin()
      .then(setJobs)
      .catch(() => setError("Couldn't load jobs."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete "${job.title}"? This can't be undone.`)) return;
    try {
      await deleteJob(job.id);
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch {
      setError("Couldn't delete that job.");
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Jobs</h1>
          <p>Publish, edit, or close postings shown on /career.</p>
        </div>
        <Link to="/admin/jobs/new" className="admin-btn admin-btn-primary">
          + New Job
        </Link>
      </div>

      {error && <p className="admin-alert admin-alert-error">{error}</p>}

      <div className="admin-table-card">
        {loading ? (
          <div className="admin-empty-state">Loading…</div>
        ) : jobs.length === 0 ? (
          <div className="admin-empty-state">No jobs yet — create your first posting.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.department}</td>
                  <td>{job.location}</td>
                  <td>{job.job_type}</td>
                  <td>
                    <span className={`admin-status-pill ${job.published ? "is-published" : "is-draft"}`}>
                      {job.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link to={`/admin/jobs/${job.id}`} className="admin-btn admin-btn-ghost">
                        Edit
                      </Link>
                      <Link to={`/admin/applications?job=${job.id}`} className="admin-btn admin-btn-ghost">
                        Applications
                      </Link>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        onClick={() => handleDelete(job)}
                      >
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

export default AdminJobsListPage;
