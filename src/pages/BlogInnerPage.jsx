import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPublishedBlogBySlug, formatBlogDate, getReadingTime } from "../lib/blogs";

const BackArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BlogInnerPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedBlogBySlug(slug)
      .then(setBlog)
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <article className="blog-detail top-spacing" />;
  }

  if (!blog) {
    return (
      <section className="blog-detail-missing top-spacing">
        <div className="container">
          <h2>Article not found</h2>
          <p>The article you&rsquo;re looking for doesn&rsquo;t exist or may have moved.</p>
          <Link to="/blogs" className="primary-btn blue">
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="blog-detail top-spacing">
      <div className="container blog-detail-back-wrap">
        <Link to="/blogs" className="blog-detail-back">
          <BackArrowIcon /> Back to Blog
        </Link>
      </div>

      <div className="blog-detail-cover">
        <img src={blog.cover_image} alt={blog.title} className="img" />
      </div>

      <div className="container blog-detail-container">
        <h1 className="blog-detail-title">{blog.title}</h1>

        <p className="blog-detail-meta">
          {formatBlogDate(blog.published_at)} <span aria-hidden="true">|</span> {blog.author}{" "}
          <span aria-hidden="true">|</span> {getReadingTime(blog.content)}
        </p>

        <div className="blog-detail-content">
          {blog.content.map((block, index) =>
            block.type === "image" ? (
              <figure className="blog-detail-image" key={index}>
                <img src={block.src} alt={block.caption || blog.title} className="img" />
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            ) : (
              <p key={index}>{block.text}</p>
            )
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogInnerPage;
