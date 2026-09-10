import { useEffect, useState } from "react";
import {
  deleteDealerEnquiry,
  fetchAllDealerEnquiriesAdmin,
  updateDealerEnquiryStatus,
} from "../../lib/dealerEnquiries";
import "./admin.css";

const STATUS_OPTIONS = ["new", "contacted", "closed"];

const AdminDealerEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllDealerEnquiriesAdmin()
      .then(setEnquiries)
      .catch(() => setError("Couldn't load dealer enquiries."))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (enquiry, status) => {
    setEnquiries((prev) => prev.map((e) => (e.id === enquiry.id ? { ...e, status } : e)));
    try {
      await updateDealerEnquiryStatus(enquiry.id, status);
    } catch {
      setError("Couldn't update that status.");
    }
  };

  const handleDelete = async (enquiry) => {
    if (!window.confirm(`Delete the enquiry from ${enquiry.full_name}? This can't be undone.`)) return;
    try {
      await deleteDealerEnquiry(enquiry.id);
      setEnquiries((prev) => prev.filter((e) => e.id !== enquiry.id));
    } catch {
      setError("Couldn't delete that enquiry.");
    }
  };

  if (loading) return <div className="admin-empty-state">Loading…</div>;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Dealer Enquiries</h1>
          <p>Submissions from the Dealer Inquiry form.</p>
        </div>
      </div>

      {error && <p className="admin-alert admin-alert-error">{error}</p>}

      <div className="admin-table-card">
        {enquiries.length === 0 ? (
          <div className="admin-empty-state">No enquiries yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Business</th>
                <th>Received</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id}>
                  <td>{enquiry.full_name}</td>
                  <td>
                    <div>{enquiry.email}</div>
                    <div className="admin-table-subtext">+91 {enquiry.mobile}</div>
                  </td>
                  <td>
                    {enquiry.city}
                    {enquiry.city && enquiry.state ? ", " : ""}
                    {enquiry.state}
                  </td>
                  <td>
                    <div>{enquiry.business_type || "—"}</div>
                    {enquiry.business_name && <div className="admin-table-subtext">{enquiry.business_name}</div>}
                  </td>
                  <td>{new Date(enquiry.created_at).toLocaleDateString()}</td>
                  <td>
                    <select
                      className={`admin-status-select is-${enquiry.status}`}
                      value={enquiry.status}
                      onChange={(e) => handleStatusChange(enquiry, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button type="button" className="admin-btn admin-btn-danger" onClick={() => handleDelete(enquiry)}>
                      Delete
                    </button>
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

export default AdminDealerEnquiriesPage;
