import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { articleService, categoryService } from "../../services/articleService";
import AdminLayout from "../../components/admin/AdminLayout";
import ImageUpload from "../../components/admin/ImageUpload";

const EditArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category_id: "",
    tags: "",
    image_url: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setInitialLoading(true);
      const [articleResponse, categoriesResponse] = await Promise.all([articleService.getById(id), categoryService.getAll()]);

      if (articleResponse.success && articleResponse.data) {
        const article = articleResponse.data;
        console.log("Raw article data:", article);
        const SUPABASE_URL = process.env.SUPABASE_STORAGE_URL;
        let imageUrls = [];

        try {
          if (article.image_url) {
            let urlsToProcess = [];

            if (Array.isArray(article.image_url)) {
              urlsToProcess = article.image_url;
            } else if (typeof article.image_url === "string") {
              if (article.image_url.startsWith("[")) {
                try {
                  const parsed = JSON.parse(article.image_url);
                  urlsToProcess = Array.isArray(parsed) ? parsed : [article.image_url];
                } catch (e) {
                  console.error("Failed to parse JSON:", e);
                  urlsToProcess = [article.image_url];
                }
              } else {
                urlsToProcess = [article.image_url];
              }
            }

            imageUrls = urlsToProcess
              .filter((url) => url && typeof url === "string")
              .map((url) => {
                let cleanUrl = url.replace(/[\[\]"]/g, "").trim();
                if (cleanUrl.includes("supabase.co")) {
                  return cleanUrl;
                }
                if (cleanUrl.startsWith("http")) {
                  return cleanUrl;
                }
                return SUPABASE_URL + cleanUrl;
              });

            console.log("Processed URLs:", imageUrls);
          }
        } catch (err) {
          console.error("Error processing image URLs:", err);
          imageUrls = [];
        }

        // console.log("Processed image URLs:", imageUrls);

        setFormData({
          title: article.title || "",
          content: article.content || "",
          category_id: article.category_id || "",
          tags: article.tags ? article.tags.join(", ") : "",
          image_url: imageUrls,
        });
      } else {
        setErrors({ general: "Article not found" });
      }

      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setErrors({ general: "Failed to load article data" });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleImagesChange = (newImages) => {
    console.log("handleImagesChange received:", newImages);

    const SUPABASE_URL = process.env.SUPABASE_STORAGE_URL;
    let validImages = [];

    try {
      let urlsArray = [];

      if (Array.isArray(newImages)) {
        urlsArray = newImages;
      } else if (typeof newImages === "string") {
        if (newImages.startsWith("[")) {
          try {
            const parsed = JSON.parse(newImages);
            urlsArray = Array.isArray(parsed) ? parsed : [newImages];
          } catch (e) {
            console.error("Failed to parse JSON:", e);
            urlsArray = [newImages];
          }
        } else {
          urlsArray = [newImages];
        }
      }

      validImages = urlsArray
        .filter((url) => url && typeof url === "string")
        .map((url) => {
          let cleanUrl = url.replace(/[\[\]"]/g, "").trim();

          if (cleanUrl.includes("supabase.co")) {
            return cleanUrl;
          }
          if (cleanUrl.startsWith("http")) {
            return cleanUrl;
          }
          return SUPABASE_URL + cleanUrl;
        });

      console.log("Processed URLs:", validImages);
    } catch (e) {
      console.error("Error processing image URLs:", e);
      validImages = [];
    }

    setFormData({
      ...formData,
      image_url: validImages,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 20) {
      newErrors.content = "Content must be at least 20 characters";
    }

    if (!formData.category_id) {
      newErrors.category_id = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const articleData = {
        ...formData,
        category_id: parseInt(formData.category_id),
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
      };

      const response = await articleService.update(id, articleData);

      if (response.success) {
        navigate("/admin/articles");
      } else {
        setErrors({ general: response.message || "Failed to update article" });
      }
    } catch (error) {
      console.error("Error updating article:", error);
      setErrors({ general: "Failed to update article. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/articles");
  };

  if (initialLoading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div className="loading-spinner"></div>
          <p>Loading article...</p>
        </div>
      </AdminLayout>
    );
  }

  if (errors.general && !formData.title) {
    return (
      <AdminLayout>
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-md)",
            textAlign: "center",
          }}
        >
          <div style={{ color: "var(--color-error)", marginBottom: "1rem" }}>⚠️ {errors.general}</div>
          <button
            onClick={() => navigate("/admin/articles")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "var(--color-primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
            }}
          >
            ← Back to Articles
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              margin: "0 0 0.5rem",
              color: "var(--color-secondary)",
              fontSize: "1.5rem",
            }}
          >
            Edit Article
          </h2>
          <p
            style={{
              margin: "0",
              color: "var(--color-gray-600)",
              fontSize: "0.875rem",
            }}
          >
            Update the troubleshooting article information
          </p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div
            style={{
              backgroundColor: "var(--color-error)",
              color: "white",
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.5rem",
            }}
          >
            ⚠️ {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                color: "var(--color-gray-700)",
                fontSize: "0.875rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Article Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a descriptive title for your article"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: `2px solid ${errors.title ? "var(--color-error)" : "var(--color-gray-200)"}`,
                borderRadius: "var(--radius-md)",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => {
                if (!errors.title) {
                  e.target.style.borderColor = "var(--color-primary)";
                }
              }}
              onBlur={(e) => {
                if (!errors.title) {
                  e.target.style.borderColor = "var(--color-gray-200)";
                }
              }}
            />
            {errors.title && (
              <div
                style={{
                  color: "var(--color-error)",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.title}
              </div>
            )}
          </div>

          {/* Category */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                color: "var(--color-gray-700)",
                fontSize: "0.875rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Category *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: `2px solid ${errors.category_id ? "var(--color-error)" : "var(--color-gray-200)"}`,
                borderRadius: "var(--radius-md)",
                fontSize: "1rem",
                outline: "none",
                backgroundColor: "white",
              }}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <div
                style={{
                  color: "var(--color-error)",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.category_id}
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                color: "var(--color-gray-700)",
                fontSize: "0.875rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Article Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your troubleshooting article here. Include step-by-step instructions, common causes, and solutions..."
              rows="15"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: `2px solid ${errors.content ? "var(--color-error)" : "var(--color-gray-200)"}`,
                borderRadius: "var(--radius-md)",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.3s ease",
                resize: "vertical",
                fontFamily: "inherit",
                lineHeight: "1.5",
              }}
              onFocus={(e) => {
                if (!errors.content) {
                  e.target.style.borderColor = "var(--color-primary)";
                }
              }}
              onBlur={(e) => {
                if (!errors.content) {
                  e.target.style.borderColor = "var(--color-gray-200)";
                }
              }}
            />
            {errors.content && (
              <div
                style={{
                  color: "var(--color-error)",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.content}
              </div>
            )}
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--color-gray-500)",
                marginTop: "0.25rem",
              }}
            >
              {formData.content.length} characters
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                color: "var(--color-gray-700)",
                fontSize: "0.875rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Tags (Optional)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags separated by commas (e.g., wifi, network, connection)"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid var(--color-gray-200)",
                borderRadius: "var(--radius-md)",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-gray-200)")}
            />
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--color-gray-500)",
                marginTop: "0.25rem",
              }}
            >
              Tags help users find your article more easily
            </div>
          </div>

          {/* Images */}
          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                color: "var(--color-gray-700)",
                fontSize: "0.875rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Images (Optional)
            </label>
            <ImageUpload images={formData.image_url} onImagesChange={handleImagesChange} maxImages={5} />
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--color-gray-500)",
                marginTop: "0.25rem",
              }}
            >
              Add images to illustrate your troubleshooting steps
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
              paddingTop: "1rem",
              borderTop: "1px solid var(--color-gray-200)",
            }}
          >
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "var(--color-gray-200)",
                color: "var(--color-gray-700)",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => window.open(`/article/${id}`, "_blank")}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "var(--color-success)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              👁 Preview
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: loading ? "var(--color-gray-400)" : "var(--color-primary)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {loading ? (
                <>
                  <div className="loading-spinner" style={{ width: "16px", height: "16px" }}></div>
                  Updating...
                </>
              ) : (
                <>💾 Update Article</>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditArticle;
