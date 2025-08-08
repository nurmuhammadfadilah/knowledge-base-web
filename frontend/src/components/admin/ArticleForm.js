import React, { useState, useEffect } from "react";
import { getCategories } from "../../services/categoryService";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ArticleForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    image_url: [],
    ...initialData,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError("Failed to fetch categories");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "tags" ? value : value,
    }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
    };
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          style={{
            padding: "0.75rem",
            backgroundColor: "var(--color-error-light)",
            color: "var(--color-error)",
            borderRadius: "var(--radius-md)",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--color-gray-200)",
              borderRadius: "var(--radius-md)",
              fontSize: "1rem",
            }}
            required
          />
        </label>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          Category:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--color-gray-200)",
              borderRadius: "var(--radius-md)",
              fontSize: "1rem",
            }}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          Tags (comma separated):
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. javascript, react, web"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--color-gray-200)",
              borderRadius: "var(--radius-md)",
              fontSize: "1rem",
            }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          Content:
          <div style={{ border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <ReactQuill
              value={formData.content}
              onChange={handleEditorChange}
              style={{ height: "300px" }}
              modules={{
                toolbar: [[{ header: [1, 2, 3, false] }], ["bold", "italic", "underline", "strike"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image", "code-block"], ["clean"]],
              }}
            />
          </div>
        </label>
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
            fontSize: "1rem",
            fontWeight: "500",
          }}
        >
          {isLoading ? "Saving..." : "Save Article"}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;
