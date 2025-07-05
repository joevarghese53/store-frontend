import React from "react";

const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="category-form-container">
      <form onSubmit={handleSubmit} className="category-form">
        <div className="category-input-group">
          <input
            type="text"
            className="category-input"
            placeholder="Write category name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="category-buttons-container">
          <button type="submit" className="category-submit-button">
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="category-delete-button"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
