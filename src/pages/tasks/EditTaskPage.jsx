import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import TaskForm from "../../components/tasks/TaskForm";
import { createInitialTaskForm } from "../../components/tasks/taskForm.helpers";
import PageHeader from "../../components/ui/PageHeader";
import { appRoutes } from "../../config/routes";
import { getUsers } from "../../services/auth.service";
import { getCustomers } from "../../services/customer.service";
import { getLeads } from "../../services/lead.service";
import {
  getTaskById,
  updateTask,
} from "../../services/task.service";

const EditTaskPage = () => {
  const { id } = useParams();
  const navigate =
    useNavigate();
  const [loading, setLoading] =
    useState(false);
  const [pageLoading, setPageLoading] =
    useState(true);
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
          taskResponse,
          usersResponse,
          customersResponse,
          leadsResponse,
        ] = await Promise.all([
          getTaskById(id),
          getUsers(),
          getCustomers(),
          getLeads(),
        ]);

        if (!isMounted) {
          return;
        }

        setFormData(
          createInitialTaskForm(
            taskResponse.data
          )
        );
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
          "Failed to load task"
        );
        navigate(
          appRoutes.crmTasks
        );
      } finally {
        if (isMounted) {
          setPageLoading(
            false
          );
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const handleSubmit =
    async (payload) => {
      try {
        setLoading(true);
        await updateTask(
          id,
          payload
        );
        toast.success(
          "Task updated successfully"
        );
        navigate(
          appRoutes.crmTaskDetails(
            id
          )
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to update task"
        );
      } finally {
        setLoading(false);
      }
    };

  if (pageLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading task...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        eyebrow="Task Module"
        title="Edit Task"
        description="Adjust due dates, ownership, customer links, and execution status from one task workspace."
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
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditTaskPage;
