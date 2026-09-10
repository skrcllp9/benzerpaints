import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllBlogsAdmin } from "../../lib/blogs";
import { fetchAllJobsAdmin, fetchAllApplicationsAdmin, fetchRecentApplicationsAdmin } from "../../lib/jobs";
import { fetchAllContactEnquiriesAdmin } from "../../lib/contactEnquiries";
import { fetchAllDealerEnquiriesAdmin, fetchRecentDealerEnquiriesAdmin } from "../../lib/dealerEnquiries";
import "./admin.css";

const DAY_MS = 24 * 60 * 60 * 1000;

// Buckets rows (anything with a created_at) into one count per day for the
// trailing `days` window, oldest first — the shape the bar chart wants.
const buildDailyCounts = (rows, days = 14) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets = Array.from({ length: days }, (_, i) => {
    const date = new Date(today.getTime() - (days - 1 - i) * DAY_MS);
    return {
      key: date.toDateString(),
      label: `${date.getDate()}/${date.getMonth() + 1}`,
      count: 0,
    };
  });
  const byKey = new Map(buckets.map((b) => [b.key, b]));

  rows.forEach((row) => {
    const key = new Date(row.created_at).toDateString();
    const bucket = byKey.get(key);
    if (bucket) bucket.count += 1;
  });

  return buckets;
};

const BarChart = ({ title, data, color }) => {
  const max = Math.max(1, ...data.map((d) => d.count));
  const barWidth = 300 / data.length;

  return (
    <div className="admin-chart-card">
      <h3>{title}</h3>
      <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="admin-chart-svg">
        <line x1="0" y1="104" x2="300" y2="104" stroke="rgba(25, 37, 67, 0.12)" strokeWidth="1" />
        {data.map((d) => {
          const height = Math.max((d.count / max) * 88, d.count > 0 ? 3 : 0);
          const x = data.indexOf(d) * barWidth + barWidth * 0.22;
          const width = barWidth * 0.56;
          const y = 104 - height;
          return (
            <rect key={d.key} x={x} y={y} width={width} height={height} rx="2" fill={color}>
              <title>{`${d.label}: ${d.count}`}</title>
            </rect>
          );
        })}
      </svg>
      <div className="admin-chart-labels">
        {data.map((d, i) => (
          <span key={d.key} className={i % 2 === 0 ? "" : "is-hidden"}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const LiveClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="admin-clock">
      <span className="admin-clock-time">
        {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>
      <span className="admin-clock-date">
        {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </span>
    </div>
  );
};

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchAllBlogsAdmin(),
      fetchAllJobsAdmin(),
      fetchAllApplicationsAdmin(),
      fetchAllContactEnquiriesAdmin(),
      fetchAllDealerEnquiriesAdmin(),
      fetchRecentApplicationsAdmin(5),
      fetchRecentDealerEnquiriesAdmin(5),
    ])
      .then(([blogs, jobs, applications, contacts, dealers, recentApplications, recentDealers]) => {
        setStats({
          blogs,
          jobs,
          applications,
          contacts,
          dealers,
          recentApplications,
          recentDealers,
        });
      })
      .catch(() => setError("Couldn't load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-empty-state">Loading…</div>;
  if (error) return <p className="admin-alert admin-alert-error">{error}</p>;

  const publishedBlogs = stats.blogs.filter((b) => b.published).length;
  const publishedJobs = stats.jobs.filter((j) => j.published).length;

  const statCards = [
    { label: "Blogs", value: stats.blogs.length, hint: `${publishedBlogs} published`, to: "/admin/blogs" },
    { label: "Jobs", value: stats.jobs.length, hint: `${publishedJobs} published`, to: "/admin/jobs" },
    { label: "Job Applications", value: stats.applications.length, hint: "All time", to: "/admin/applications" },
    { label: "Contact Enquiries", value: stats.contacts.length, hint: "All time", to: "/admin/contact-enquiries" },
    { label: "Dealer Enquiries", value: stats.dealers.length, hint: "All time", to: "/admin/dealer-enquiries" },
  ];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>An overview of everything coming in through the site.</p>
        </div>
        <LiveClock />
      </div>

      <div className="admin-stat-grid">
        {statCards.map((card) => (
          <Link to={card.to} className="admin-stat-card" key={card.label}>
            <span className="admin-stat-value">{card.value}</span>
            <span className="admin-stat-label">{card.label}</span>
            <span className="admin-stat-hint">{card.hint}</span>
          </Link>
        ))}
      </div>

      <div className="admin-chart-grid">
        <BarChart
          title="Job Applications — Last 14 Days"
          data={buildDailyCounts(stats.applications)}
          color="var(--blue)"
        />
        <BarChart
          title="Dealer Enquiries — Last 14 Days"
          data={buildDailyCounts(stats.dealers)}
          color="var(--accent-orange)"
        />
      </div>

      <div className="admin-recent-grid">
        <div className="admin-table-card admin-recent-card">
          <div className="admin-recent-header">
            <h3>Recent Job Applications</h3>
            <Link to="/admin/applications">View all</Link>
          </div>
          {stats.recentApplications.length === 0 ? (
            <div className="admin-empty-state">No applications yet.</div>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <tbody>
                  {stats.recentApplications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.full_name}</strong>
                        <div className="admin-table-subtext">{app.jobs?.title || "—"}</div>
                        <div className="admin-table-date">{new Date(app.created_at).toLocaleDateString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-table-card admin-recent-card">
          <div className="admin-recent-header">
            <h3>Recent Dealer Enquiries</h3>
            <Link to="/admin/dealer-enquiries">View all</Link>
          </div>
          {stats.recentDealers.length === 0 ? (
            <div className="admin-empty-state">No enquiries yet.</div>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <tbody>
                  {stats.recentDealers.map((enquiry) => (
                    <tr key={enquiry.id}>
                      <td>
                        <strong>{enquiry.full_name}</strong>
                        <div className="admin-table-subtext">{enquiry.city || enquiry.business_name || "—"}</div>
                        <div className="admin-table-date">{new Date(enquiry.created_at).toLocaleDateString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
