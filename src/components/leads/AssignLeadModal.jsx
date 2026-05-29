import {
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  assignLead,
} from "../../services/lead.service";

const AssignLeadModal =
  ({
    leadId,
    users,
    onClose,
  }) => {
    const [
      selectedUser,
      setSelectedUser,
    ] = useState("");

    const submit =
      async () => {
        await assignLead(
          leadId,
          selectedUser
        );

        toast.success(
          "Assigned"
        );

        onClose();
      };

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <div className="bg-white p-6 rounded">
          <select
            onChange={(
              e
            ) =>
              setSelectedUser(
                e.target
                  .value
              )
            }
          >
            <option>
              Select User
            </option>

            {users.map(
              (
                user
              ) => (
                <option
                  key={
                    user.id
                  }
                  value={
                    user.id
                  }
                >
                  {
                    user.name
                  }
                </option>
              )
            )}
          </select>

          <button
            onClick={
              submit
            }
          >
            Assign
          </button>
        </div>
      </div>
    );
  };

export default AssignLeadModal;