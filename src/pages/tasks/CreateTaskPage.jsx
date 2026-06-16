import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";
import TaskForm from "../../components/tasks/TaskForm";
import { createInitialTaskForm } from "../../components/tasks/taskForm.helpers";
import PageHeader from "../../components/ui/PageHeader";
import { appRoutes } from "../../config/routes";
import { getUsers } from "../../services/auth.service";
import { getCustomers } from "../../services/customer.service";
import { getLeads } from "../../services/lead.service";
import { createTask } from "../../services/task.service";

const CreateTaskPage = () => {
  const navigate =
    useNavigate();
  const [loading, setLoading] =
    useState(false);
  const [
    referencesLoading,
    setReferencesLoading,
  ] = useState(true);
  const [users, setUsers] =
    useState([]);
  const [customers, setCustomers] =
    useState([]);
  const [leads, setLeads] =
    useState([]);
  const [formData, setFormData] =
    useState(
      createInitialTaskForm()
    );

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const [
          usersResponse,
          customersResponse,
          leadsResponse,
        ] = await Promise.all([
          getUsers(),
          getCustomers(),
          getLeads(),
        ]);

        if (!isMounted) {
          return;
        }

        setUsers(
          usersResponse.data
        );
        setCustomers(
          customersResponse.data
        );
        setLeads(
          leadsResponse.data
        );
      } catch {
        toast.error(
          "Failed to load task references"
        );
      } finally {
        if (isMounted) {
          setReferencesLoading(
            false
          );
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit =
    async (payload) => {
      try {
        setLoading(true);
        await createTask(payload);
        toast.success(
          "Task created successfully"
        );
        navigate(
          appRoutes.crmTasks
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to create task"
        );
      } finally {
        setLoading(false);
      }
    };

  if (referencesLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading task form...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        eyebrow="Task Module"
        title="Create Task"
        description="Open a new customer or lead follow-up with ownership, due date, and reminder-ready metadata."
      />

      <TaskForm
        formData={formData}
        setFormData={
          setFormData
        }
        onSubmit={
          handleSubmit
        }
        loading={loading}
        users={users}
        customers={customers}
        leads={leads}
        submitLabel="Create Task"
      />
    </div>
  );
};

export default CreateTaskPage;
