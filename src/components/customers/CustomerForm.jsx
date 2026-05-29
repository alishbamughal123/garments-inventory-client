
const CustomerForm = ({
  formData,
  handleChange,
  handleSubmit,
  submitText,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        rounded-xl
        shadow-sm
        p-6
        grid
        md:grid-cols-2
        gap-4
      "
    >
      {/* Full Name */}
      <input
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Full Name"
        className="border rounded-lg px-4 py-3"
      />

      {/* Company */}
      <input
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        placeholder="Company Name"
        className="border rounded-lg px-4 py-3"
      />

      {/* Designation */}
      <input
        name="designation"
        value={formData.designation}
        onChange={handleChange}
        placeholder="Designation"
        className="border rounded-lg px-4 py-3"
      />

      {/* Phone */}
      <input
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
        className="border rounded-lg px-4 py-3"
      />

      {/* Email */}
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="border rounded-lg px-4 py-3"
      />

      <button
        type="submit"
        className="
          bg-blue-600
          text-white
          py-3
          rounded-lg
          md:col-span-2
        "
      >
        {submitText}
      </button>
    </form>
  );
};

export default CustomerForm;
