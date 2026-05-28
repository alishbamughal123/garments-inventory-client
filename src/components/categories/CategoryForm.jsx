import { useState } from "react";

const CategoryForm = ({
  initialData = {
    name: "",
    description: "",
  },
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] =
    useState(initialData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        p-8
      "
    >
      <div className="mb-5">

        <label className="
          block
          mb-2
          text-sm
          font-medium
          text-slate-700
        ">
          Category Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="
            w-full
            border
            border-slate-300
            rounded-xl
            px-4
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-blue-200
          "
          placeholder="Enter category name"
        />

      </div>

      <div className="mb-6">

        <label className="
          block
          mb-2
          text-sm
          font-medium
          text-slate-700
        ">
          Description
        </label>

        <textarea
          rows="4"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="
            w-full
            border
            border-slate-300
            rounded-xl
            px-4
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-blue-200
          "
          placeholder="Category description"
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          bg-blue-500
          hover:bg-blue-600
          text-white
          px-6
          py-3
          rounded-xl
          font-medium
          transition
        "
      >
        {loading
          ? "Saving..."
          : "Save Category"}
      </button>

    </form>
  );
};

export default CategoryForm;