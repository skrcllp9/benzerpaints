import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBlog, fetchAllBlogsAdmin } from "../../lib/blogs";
import "./admin.css";

const AdminBlogsListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllBlogsAdmin()
      .then(setBlogs)
      .catch(() => setError("Couldn't load blogs."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (blog) => {
    if (!window.confirm(`Delete "${blog.title}"? This can't be undone.`)) return;
    try {
      await deleteBlog(blog.id);
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
    } catch {
      setError("Couldn't delete that blog.");
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Blogs</h1>
          <p>Publish, edit, or take down articles shown on /blogs.</p>
        </div>
        <Link to="/admin/blogs/new" className="admin-btn admin-btn-primary">
          + New Blog
        </Link>
      </div>

      {error && <p className="admin-alert admin-alert-error">{error}</p>}

      <div className="admin-table-card">
        {loading ? (
          <div className="admin-empty-state">Loading…</div>
        ) : blogs.length === 0 ? (
          <div className="admin-empty-state">No blogs yet — create your first one.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>{blog.title}</td>
                  <td>
                    <span className={`admin-status-pill ${blog.published ? "is-published" : "is-draft"}`}>
                      {blog.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{blog.featured ? "Yes" : "—"}</td>
                  <td>{new Date(blog.updated_at).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-table-actions">
                      <Link to={`/admin/blogs/${blog.id}`} className="admin-btn admin-btn-ghost">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        onClick={() => handleDelete(blog)}
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

export default AdminBlogsListPage;
