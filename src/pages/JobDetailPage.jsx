import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPublishedJobBySlug } from "../lib/jobs";

const BackArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const JobDetailPage = () => {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPublishedJobBySlug(slug)
      .then(setJob)
      .catch(() => setError("Couldn't load this job."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <section className="job-detail top-spacing" />;

  if (error || !job) {
    return (
      <section className="job-detail-missing top-spacing">
        <div className="container">
          <h2>Position not found</h2>
          <p>This role may have closed or moved.</p>
          <Link to="/career" className="primary-btn blue">
            Back to Careers
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="job-detail top-spacing">
      <div className="container job-detail-container">
        <Link to="/career" className="blog-detail-back job-detail-back">
          <BackArrowIcon /> Back to Careers
        </Link>

        <div className="job-detail-card">
          <h1 className="job-detail-title">{job.title}</h1>

          <div className="job-detail-tags">
            <span>{job.department}</span>
            <span>{job.location}</span>
            <span>{job.job_type}</span>
            {job.experience_level && <span>{job.experience_level}</span>}
          </div>

          <p className="job-detail-description">{job.description}</p>

          <Link to={`/career/${job.slug}/apply`} className="primary-btn blue job-detail-apply">
            Apply for This Role
          </Link>
        </div>
      </div>
    </article>
  );
};

export default JobDetailPage;
