// import React, { useState, useEffect } from "react";
// import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";

// const CategoryManager = () => {
//   const [categories, setCategories] = useState([]);
//   const [formData, setFormData] = useState({ name: "", description: "" });
//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const data = await getCategories();
//       setCategories(data);
//     } catch (err) {
//       setError("Failed to fetch categories");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await updateCategory(editingId, formData);
//       } else {
//         await createCategory(formData);
//       }
//       fetchCategories();
//       resetForm();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save category");
//     }
//   };

//   const handleEdit = (category) => {
//     setFormData({ name: category.name, description: category.description });
//     setEditingId(category._id);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this category?")) {
//       try {
//         await deleteCategory(id);
//         fetchCategories();
//       } catch (err) {
//         setError("Failed to delete category");
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({ name: "", description: "" });
//     setEditingId(null);
//     setError("");
//   };

//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
//       {/* Form Section */}
//       <div
//         style={{
//           backgroundColor: "white",
//           padding: "1.5rem",
//           borderRadius: "var(--radius-lg)",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//         }}
//       >
//         <h2 style={{ marginTop: 0 }}>{editingId ? "Edit Category" : "Add New Category"}</h2>
//         {error && (
//           <div
//             style={{
//               padding: "0.75rem",
//               backgroundColor: "var(--color-error-light)",
//               color: "var(--color-error)",
//               borderRadius: "var(--radius-md)",
//               marginBottom: "1rem",
//             }}
//           >
//             {error}
//           </div>
//         )}
//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: "1rem" }}>
//             <label style={{ display: "block", marginBottom: "0.5rem" }}>
//               Name:
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 style={{
//                   width: "100%",
//                   padding: "0.5rem",
//                   border: "1px solid var(--color-gray-200)",
//                   borderRadius: "var(--radius-md)",
//                 }}
//                 required
//               />
//             </label>
//           </div>
//           <div style={{ marginBottom: "1rem" }}>
//             <label style={{ display: "block", marginBottom: "0.5rem" }}>
//               Description:
//               <textarea
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 style={{
//                   width: "100%",
//                   padding: "0.5rem",
//                   border: "1px solid var(--color-gray-200)",
//                   borderRadius: "var(--radius-md)",
//                   minHeight: "100px",
//                 }}
//               />
//             </label>
//           </div>
//           <div style={{ display: "flex", gap: "1rem" }}>
//             <button
//               type="submit"
//               style={{
//                 padding: "0.5rem 1rem",
//                 backgroundColor: "var(--color-primary)",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "var(--radius-md)",
//                 cursor: "pointer",
//               }}
//             >
//               {editingId ? "Update" : "Add"} Category
//             </button>
//             {editingId && (
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 style={{
//                   padding: "0.5rem 1rem",
//                   backgroundColor: "var(--color-gray-200)",
//                   border: "none",
//                   borderRadius: "var(--radius-md)",
//                   cursor: "pointer",
//                 }}
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>
//       </div>

//       {/* Categories List */}
//       <div
//         style={{
//           backgroundColor: "white",
//           padding: "1.5rem",
//           borderRadius: "var(--radius-lg)",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//         }}
//       >
//         <h2 style={{ marginTop: 0 }}>Categories</h2>
//         <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//           {categories.map((category) => (
//             <div
//               key={category._id}
//               style={{
//                 padding: "1rem",
//                 backgroundColor: "var(--color-gray-50)",
//                 borderRadius: "var(--radius-md)",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <div>
//                 <h3 style={{ margin: 0, fontSize: "1rem" }}>{category.name}</h3>
//                 {category.description && <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "var(--color-gray-600)" }}>{category.description}</p>}
//               </div>
//               <div style={{ display: "flex", gap: "0.5rem" }}>
//                 <button
//                   onClick={() => handleEdit(category)}
//                   style={{
//                     padding: "0.5rem",
//                     backgroundColor: "var(--color-secondary)",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "var(--radius-md)",
//                     cursor: "pointer",
//                   }}
//                 >
//                   ✏️
//                 </button>
//                 <button
//                   onClick={() => handleDelete(category._id)}
//                   style={{
//                     padding: "0.5rem",
//                     backgroundColor: "var(--color-error)",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "var(--radius-md)",
//                     cursor: "pointer",
//                   }}
//                 >
//                   🗑️
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryManager;
