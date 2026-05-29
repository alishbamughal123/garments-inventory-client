import {
  NavLink,
  Outlet,
} from "react-router-dom";

const CRMLayout = () => {
  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          CRM
        </h1>

        <p className="text-gray-500">
          Customer Relationship Management
        </p>
      </div>

      <div className="flex gap-3 border-b pb-3 mb-6">

        <NavLink
          to="/crm/customers"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg ${
              isActive
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`
          }
        >
          Customers
        </NavLink>

        <NavLink
          to="/crm/leads"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg ${
              isActive
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`
          }
        >
          Leads
        </NavLink>

        <NavLink
          to="/crm/pipeline"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg ${
              isActive
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`
          }
        >
          Pipeline
        </NavLink>

      </div>

      <Outlet />

    </div>
  );
};

export default CRMLayout;