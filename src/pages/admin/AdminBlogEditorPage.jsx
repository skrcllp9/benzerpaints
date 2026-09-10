import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createBlog,
  fetchBlogByIdAdmin,
  slugify,
  updateBlog,
  uploadBlogImage,
} from "../../lib/blogs";
import "./admin.css";

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  author: "Benzer Paints",
  featured: false,
  published: false,
};

// Shared by the cover-image field and every image content block: a URL/path
// text input (so an existing /images/... asset can be reused directly)
// plus a file picker that uploads to the "blog-images" bucket and fills
// the field with the resulting public URL.
const ImagePicker = ({ value, onChange, label }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadBlogImage(file));
    } catch {
      window.alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="admin-field">
      {label && <label>{label}</label>}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          placeholder="/images/example.jpg or paste an uploaded URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="admin-btn admin-btn-ghost"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFile}
        />
      </div>
      {value && <img src={value} alt="" className="admin-image-preview" />}
    </div>
  );
};

const AdminBlogEditorPage = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [blocks, setBlocks] = useState([]);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  // Tracks which action is mid-flight ("draft" | "publish" | null) so each
  // button can show its own "Saving…" label instead of a shared boolean.
  const [savingAction, setSavingAction] = useState(null);
  const [error, setError] = useState("");
  // The blog's real published_at, kept out of `form` so re-publishing an
  // already-published post (or toggling it back to draft and republishing)
  // doesn't bump its date — only the first-ever publish sets this.
  const originalPublishedAtRef = useRef(null);

  useEffect(() => {
    if (isNew) return;
    fetchBlogByIdAdmin(id)
      .then((blog) => {
        if (!blog) {
          setError("Blog not found.");
          return;
        }
        setForm({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          coverImage: blog.cover_image,
          author: blog.author,
          featured: blog.featured,
          published: blog.published,
        });
        originalPublishedAtRef.current = blog.published_at;
        setBlocks(blog.content || []);
        setSlugTouched(true);
      })
      .catch(() => setError("Couldn't load this blog."))
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

  const addBlock = (type) => {
    setBlocks((prev) => [
      ...prev,
      type === "paragraph" ? { type: "paragraph", text: "" } : { type: "image", src: "", caption: "" },
    ]);
  };

  const updateBlockField = (index, field, value) => {
    setBlocks((prev) => prev.map((block, i) => (i === index ? { ...block, [field]: value } : block)));
  };

  const moveBlock = (index, direction) => {
    setBlocks((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeBlock = (index) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
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
      excerpt: form.excerpt.trim(),
      cover_image: form.coverImage.trim(),
      author: form.author.trim() || "Benzer Paints",
      featured: form.featured,
      published: publish,
      published_at: publish ? originalPublishedAtRef.current || new Date().toISOString() : originalPublishedAtRef.current,
      content: blocks,
    };

    setSavingAction(publish ? "publish" : "draft");
    try {
      if (isNew) {
        const created = await createBlog(payload);
        navigate(`/admin/blogs/${created.id}`, { replace: true });
      } else {
        await updateBlog(id, payload);
      }
      navigate("/admin/blogs");
    } catch {
      setError("Couldn't save this blog — the slug may already be in use.");
    } finally {
      setSavingAction(null);
    }
  };

  if (loading) return <div className="admin-empty-state">Loading…</div>;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>{isNew ? "New Blog" : "Edit Blog"}</h1>
          <p>Only published blogs are visible on /blogs.</p>
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
            <label htmlFor="blog-title">Title</label>
            <input
              id="blog-title"
              type="text"
              value={form.title}
              onChange={(e) => setField("title")(e.target.value)}
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="blog-slug">Slug</label>
            <input
              id="blog-slug"
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setField("slug")(e.target.value);
              }}
              required
            />
            <span className="admin-field-hint">/blogs/{form.slug || "…"}</span>
          </div>

          <div className="admin-field">
            <label htmlFor="blog-excerpt">Excerpt</label>
            <textarea
              id="blog-excerpt"
              value={form.excerpt}
              onChange={(e) => setField("excerpt")(e.target.value)}
              required
            />
          </div>

          <ImagePicker
            label="Cover Image"
            value={form.coverImage}
            onChange={(value) => setField("coverImage")(value)}
          />

          <div className="admin-form-row">
            <div className="admin-field">
              <label htmlFor="blog-author">Author</label>
              <input
                id="blog-author"
                type="text"
                value={form.author}
                onChange={(e) => setField("author")(e.target.value)}
              />
            </div>
            <div className="admin-field admin-checkbox-field" style={{ alignSelf: "end" }}>
              <input
                id="blog-featured"
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setField("featured")(e.target.checked)}
              />
              <label htmlFor="blog-featured">Featured on /blogs</label>
            </div>
          </div>

          <div className="admin-field">
            <label>Content</label>
            <div className="admin-block-list">
              {blocks.map((block, index) => (
                <div className="admin-block-item" key={index}>
                  <div className="admin-block-item-head">
                    <span>{block.type}</span>
                    <div className="admin-block-item-controls">
                      <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0}>
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, 1)}
                        disabled={index === blocks.length - 1}
                      >
                        Down
                      </button>
                      <button type="button" onClick={() => removeBlock(index)}>
                        Remove
                      </button>
                    </div>
                  </div>

                  {block.type === "paragraph" ? (
                    <textarea
                      value={block.text}
                      onChange={(e) => updateBlockField(index, "text", e.target.value)}
                      placeholder="Paragraph text"
                    />
                  ) : (
                    <>
                      <ImagePicker
                        value={block.src}
                        onChange={(value) => updateBlockField(index, "src", value)}
                      />
                      <input
                        type="text"
                        placeholder="Caption (e.g. Image #1)"
                        value={block.caption}
                        onChange={(e) => updateBlockField(index, "caption", e.target.value)}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="admin-add-block-row">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => addBlock("paragraph")}>
                + Paragraph
              </button>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => addBlock("image")}>
                + Image
              </button>
            </div>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={() => navigate("/admin/blogs")}
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

export default AdminBlogEditorPage;
