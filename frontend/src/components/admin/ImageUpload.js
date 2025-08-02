// File: frontend/src/components/admin/ImageUpload.js
import React, { useState, useRef } from "react";
import { uploadService } from "../../services/articleService";

const ImageUpload = ({ images, onImagesChange, maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Memastikan images selalu array
  const imageList = Array.isArray(images) ? images : [];

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - imageList.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      if (filesToUpload.length === 1) {
        console.log("Uploading single image:", filesToUpload[0].name);
        const response = await uploadService.uploadImage(filesToUpload[0]);
        console.log("Upload response:", response);

        if (response.success) {
          console.log("Image URL:", response.data.url);
          onImagesChange([...imageList, response.data.url]);
        } else {
          setError(response.message || "Failed to upload image");
        }
      } else {
        console.log(
          "Uploading multiple images:",
          filesToUpload.map((f) => f.name)
        );
        const response = await uploadService.uploadImages(filesToUpload);
        console.log("Upload response:", response);

        if (response.success) {
          const newUrls = response.data.map((img) => img.url);
          console.log("Image URLs:", newUrls);
          onImagesChange([...imageList, ...newUrls]);
        } else {
          setError(response.message || "Failed to upload images");
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index) => {
    const imageUrl = imageList[index];
    console.log("Removing image:", imageUrl);

    // Extract filename from URL
    const filename = imageUrl.split("/").pop();
    console.log("Filename to delete:", filename);

    try {
      await uploadService.deleteImage(filename);
      const newImages = imageList.filter((_, i) => i !== index);
      onImagesChange(newImages);
    } catch (error) {
      console.error("Delete error:", error);
      // Still remove from UI even if server delete fails
      const newImages = imageList.filter((_, i) => i !== index);
      onImagesChange(newImages);
    }
  };

  const handleImageError = (e, index) => {
    console.error("Image failed to load:", imageList[index]);
    e.target.style.display = "none";
    e.target.nextSibling.style.display = "flex";
  };

  const handleImageLoad = (e) => {
    console.log("Image loaded successfully:", e.target.src);
  };

  // ... drag and drop handlers same as before ...

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div>
      {/* Error Message */}
      {error && (
        <div
          style={{
            backgroundColor: "var(--color-error)",
            color: "white",
            padding: "0.75rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>⚠️ {error}</span>
          <button
            onClick={clearError}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "var(--color-primary)" : "var(--color-gray-300)"}`,
          borderRadius: "var(--radius-md)",
          padding: "2rem",
          textAlign: "center",
          cursor: uploading ? "not-allowed" : "pointer",
          backgroundColor: dragOver ? "var(--color-primary-light)" : "var(--color-gray-50)",
          transition: "all 0.3s ease",
          marginBottom: "1rem",
          opacity: uploading ? 0.7 : 1,
        }}
      >
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} style={{ display: "none" }} disabled={uploading} />

        {uploading ? (
          <div>
            <div className="loading-spinner" style={{ margin: "0 auto 1rem" }}></div>
            <p>Uploading images...</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📸</div>
            <p style={{ margin: "0 0 0.5rem", fontWeight: "600" }}>Click or drag images here to upload</p>
            <p style={{ margin: "0", fontSize: "0.875rem", color: "var(--color-gray-600)" }}>Maximum {maxImages} images, 5MB each (JPG, PNG, GIF, WebP)</p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", color: "var(--color-gray-500)" }}>
              {imageList.length}/{maxImages} images uploaded
            </p>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {imageList.length > 0 && (
        <div>
          <h4 style={{ margin: "0 0 1rem", color: "var(--color-gray-700)" }}>
            Uploaded Images ({imageList.length}/{maxImages})
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "1rem",
            }}
          >
            {imageList.map((imageUrl, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  border: "2px solid var(--color-gray-200)",
                  backgroundColor: "var(--color-gray-100)",
                }}
              >
                {/* Debug info */}
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    background: "rgba(0,0,0,0.7)",
                    color: "white",
                    fontSize: "10px",
                    padding: "2px 4px",
                    zIndex: "10",
                  }}
                >
                  {index + 1}
                </div>

                <img
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                  }}
                  onError={(e) => handleImageError(e, index)}
                  onLoad={handleImageLoad}
                />
                <div
                  style={{
                    display: "none",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "150px",
                    color: "var(--color-error)",
                    fontSize: "0.875rem",
                    flexDirection: "column",
                    padding: "1rem",
                    textAlign: "center",
                  }}
                >
                  <div style={{ marginBottom: "0.5rem" }}>❌</div>
                  <div>Failed to load</div>
                  <div style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>{imageUrl.substring(imageUrl.lastIndexOf("/") + 1)}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                    backgroundColor: "var(--color-error)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
