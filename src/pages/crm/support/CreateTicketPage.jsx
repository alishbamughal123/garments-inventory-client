import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../../components/ui/PageHeader";
import SupportTicketForm from "../../../components/crm/support/SupportTicketForm";
import { createTicket } from "../../../services/support.service";
import { appRoutes } from "../../../config/routes";

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await createTicket(data);
      toast.success("Support ticket created successfully");
      navigate(appRoutes.crmSupport);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Ticket"
        description="Raise a new support request for a customer or general issue."
      />

      <SupportTicketForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Create Ticket"
      />
    </div>
  );
};

export default CreateTicketPage;
