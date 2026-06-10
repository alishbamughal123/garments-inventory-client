import { useState } from "react";
import Button from "../ui/Button";
import {
  formControlClass,
  formLabelClass,
} from "../ui/formStyles";

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

        <label className={formLabelClass}>
          Category Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={formControlClass}
          placeholder="Enter category name"
        />

      </div>

      <div className="mb-6">

        <label className={formLabelClass}>
          Description
        </label>

        <textarea
          rows="4"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={formControlClass}
          placeholder="Category description"
        />

      </div>

      <Button
        type="submit"
        disabled={loading}
        size="lg"
      >
        {loading
          ? "Saving..."
          : "Save Category"}
      </Button>

    </form>
  );
};

export default CategoryForm;
