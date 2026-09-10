import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPublishedJobs } from "../lib/jobs";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title", label: "Title (A-Z)" },
];

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
    <path d="M4.5 12h15M13 5.5 19.5 12 13 18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CareerPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [location, setLocation] = useState("all");
  const [jobType, setJobType] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    fetchPublishedJobs()
      .then(setJobs)
      .catch(() => setError("Couldn't load open positions right now."))
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.department).filter(Boolean))).sort(),
    [jobs]
  );
  const locations = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.location).filter(Boolean))).sort(),
    [jobs]
  );
  const jobTypes = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.job_type).filter(Boolean))).sort(),
    [jobs]
  );

  const visibleJobs = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = jobs.filter((job) => {
      if (department !== "all" && job.department !== department) return false;
      if (location !== "all" && job.location !== location) return false;
      if (jobType !== "all" && job.job_type !== jobType) return false;
      if (term && !`${job.title} ${job.description}`.toLowerCase().includes(term)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      const aTime = new Date(a.published_at || a.created_at).getTime();
      const bTime = new Date(b.published_at || b.created_at).getTime();
      return sort === "oldest" ? aTime - bTime : bTime - aTime;
    });

    return list;
  }, [jobs, search, department, location, jobType, sort]);

  return (
    <>
      <section className="career-hero top-spacing">
        <div className="container">
          <p className="eyebrow-head">
            <span className="eyebrow-head-text">Careers</span>
            <span className="eyebrow-underline" />
          </p>
          <h2>Build Your Career With Benzer Paints</h2>
          <p className="career-hero-desc">
            Open roles across manufacturing, sales, R&amp;D, and marketing —
            find the one that fits and apply directly below.
          </p>
        </div>
      </section>

      <section className="career-main">
        <div className="container">
          <div className="career-filters">
            <input
              type="text"
              className="career-search"
              placeholder="Search roles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option value="all">All Job Types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="career-status">Loading open positions…</p>
          ) : error ? (
            <p className="career-status">{error}</p>
          ) : visibleJobs.length === 0 ? (
            <p className="career-status">No roles match your filters right now.</p>
          ) : (
            <>
              <p className="career-count">
                Showing {visibleJobs.length} of {jobs.length} open position{jobs.length === 1 ? "" : "s"}
              </p>
              <div className="career-list">
                {visibleJobs.map((job) => (
                  <Link to={`/career/${job.slug}`} className="career-row" key={job.id}>
                    <div className="career-row-main">
                      <h3 className="career-row-title">{job.title}</h3>
                      <div className="career-row-tags">
                        <span>{job.department}</span>
                        <span>{job.location}</span>
                        <span>{job.job_type}</span>
                        {job.experience_level && <span>{job.experience_level}</span>}
                      </div>
                    </div>
                    <span className="career-row-link">
                      View &amp; Apply
                      <span className="career-row-arrow">
                        <ArrowIcon />
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default CareerPage;
