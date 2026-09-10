import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../context/adminAuthStore";
import "./admin.css";

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const BlogIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
    <path d="M5 4.5h11l3 3v12H5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M9 10h6M9 13.5h6M9 17h3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const JobIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
    <rect x="3.5" y="7.5" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const ApplicationsIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
    <path d="M7 3.5h10l2 2v15H5v-15Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M9 9.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 15h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="m4.5 7 7.5 5.5L19.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const DealerIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
    <path d="M4 20V10l8-6 8 6v10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M9.5 20v-6h5v6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
const BrochureIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
    <path d="M6 3.5h9l3 3v14H6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M12 8v7M9 12l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV_LINKS = [
  { to: "/admin", label: "Dashboard", icon: <DashboardIcon />, end: true },
  { to: "/admin/blogs", label: "Blogs", icon: <BlogIcon /> },
  { to: "/admin/jobs", label: "Jobs", icon: <JobIcon /> },
  { to: "/admin/applications", label: "Job Applications", icon: <ApplicationsIcon /> },
  { to: "/admin/contact-enquiries", label: "Contact Enquiries", icon: <MailIcon /> },
  { to: "/admin/dealer-enquiries", label: "Dealer Enquiries", icon: <DealerIcon /> },
  { to: "/admin/brochure", label: "Brochure", icon: <BrochureIcon /> },
];

const AdminLayout = () => {
  const { signOut } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="admin-sidebar-logo">
          <img src="/icons/light-logo.png" alt="Benzer Paints" />
          <span className="admin-sidebar-logo-text">Admin</span>
        </div>
        <button
          type="button"
          className={`admin-menu-toggle ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && <div className="admin-mobile-overlay" onClick={closeMenu} />}

      <aside className={`admin-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar-logo">
          <img src="/icons/light-logo.png" alt="Benzer Paints" />
          <span className="admin-sidebar-logo-text">Admin</span>
        </div>
        <nav className="admin-sidebar-nav">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "is-active" : "")}
              onClick={closeMenu}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-signout">
          <button type="button" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
