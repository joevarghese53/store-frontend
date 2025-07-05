import React, { useState } from "react";
import { useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import CategoryForm from "../components/CategoryForm";
import Modal from "../components/Modal";
import { useRouter } from 'next/router';
import { FaPlus, FaEdit, FaTrash, FaTags } from "react-icons/fa";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const router = useRouter();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed. Try again.");
    }
  };

  return (
    <div className="category-list-main-container">
      <div className="category-list-card">
        <div className="category-list-header">
          <div className="category-list-title">
            <FaTags className="category-list-icon" />
            <h1>Manage Categories</h1>
          </div>
          <p className="category-list-subtitle">Create, edit, and manage your product categories</p>
        </div>

        <div className="category-create-section">
          <h3 className="category-create-title">Add New Category</h3>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
          />
        </div>

        <div className="category-list-section">
          <h3 className="category-list-title-section">Existing Categories</h3>
          <div className="category-grid">
            {categories?.map((category) => (
              <div key={category._id} className="category-item">
                <div className="category-item-content">
                  <FaTags className="category-item-icon" />
                  <span className="category-item-name">{category.name}</span>
                </div>
                <button
                  className="category-edit-button"
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }}
                  title="Edit category"
                >
                  <FaEdit />
                </button>
              </div>
            ))}
          </div>
          {categories?.length === 0 && (
            <div className="category-empty-state">
              <FaTags className="category-empty-icon" />
              <p>No categories found. Create your first category above.</p>
            </div>
          )}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
