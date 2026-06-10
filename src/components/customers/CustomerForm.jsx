
import Button from "../ui/Button";
import { formControlClass } from "../ui/formStyles";

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
        className={formControlClass}
      />

      {/* Company */}
      <input
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        placeholder="Company Name"
        className={formControlClass}
      />

      {/* Designation */}
      <input
        name="designation"
        value={formData.designation}
        onChange={handleChange}
        placeholder="Designation"
        className={formControlClass}
      />

      {/* Phone */}
      <input
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
        className={formControlClass}
      />

      {/* Email */}
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className={formControlClass}
      />

      <Button
        type="submit"
        className="md:col-span-2"
        size="lg"
      >
        {submitText}
      </Button>
    </form>
  );
};

export default CustomerForm;
