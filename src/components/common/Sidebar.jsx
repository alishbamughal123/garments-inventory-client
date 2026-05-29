
import {
  FiGrid,
  FiBox,
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiRepeat,
  FiAlertTriangle,
  FiMenu,
  FiX,
  FiUsers,
  FiShoppingCart,
  FiFileText,
} from "react-icons/fi";

import {
  NavLink,
} from "react-router-dom";

import {
  useState,
} from "react";

import logo from "../../assets/logo.png";

const Sidebar = () => {
  const [open, setOpen] =
    useState(false);

  const menus = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: FiGrid,
    },

    {
      name: "Products",
      path: "/products",
      icon: FiBox,
    },

    {
      name: "Stock IN",
      path: "/stock-in",
      icon: FiArrowDownCircle,
    },

    {
      name: "Stock OUT",
      path: "/stock-out",
      icon: FiArrowUpCircle,
    },

    {
      name: "Transactions",
      path: "/transactions",
      icon: FiRepeat,
    },


{
  name: "CRM Customers",
  path: "/customers",
  icon: FiUsers,
},


    {
      name: "Returns",
      path: "/returns",
      icon: FiRepeat,
    },

    {
      name: "Low Stock",
      path: "/low-stock",
      icon: FiAlertTriangle,
    },

    {
      name: "Sales",
      path: "/sales",
      icon: FiShoppingCart,
    },

    {
      name: "Create Sale",
      path: "/sales/create",
      icon: FiFileText,
    },

    {
      name: "Categories",
      path: "/categories",
      icon: FiGrid,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          lg:hidden
          fixed
          top-5
          left-5
          z-50
          bg-white
          p-2
          rounded-lg
          shadow-md
        "
      >
        {open ? (
          <FiX size={24} />
        ) : (
          <FiMenu size={24} />
        )}
      </button>

      {/* Overlay */}

      {open && (
        <div
          onClick={() =>
            setOpen(false)
          }
          className="
            fixed
            inset-0
            bg-black/40
            z-40
            lg:hidden
          "
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          h-screen
          fixed
          left-0
          top-0
          bg-white
          w-72
          shadow-sm
          flex
          flex-col
          z-50
          transition-transform
          duration-300
          overflow-hidden

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >

        {/* Logo */}

        <div
          className="
            h-28
            flex
            items-center
            pl-4
            border-b
            border-slate-100
            flex-shrink-0
          "
        >

          <img
            src={logo}
            alt="Immi Garments"
            className="
              h-22
              w-56
              mt-5
              object-contain
            "
          />

        </div>

        {/* Navigation */}

       <nav className=" flex-1 overflow-y-auto px-4 py-6 sidebar-scroll " >

          <ul className="space-y-2">

            {menus.map(
              (menu) => {
                const Icon =
                  menu.icon;

                return (
                  <li
                    key={
                      menu.path
                    }
                  >

                    <NavLink
                      to={
                        menu.path
                      }
                      onClick={() =>
                        setOpen(
                          false
                        )
                      }
                      className={({
                        isActive,
                      }) =>
                        `
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-xl
                        transition-all
                        duration-200
                        font-medium

                        ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-600 hover:bg-slate-100"
                        }
                      `
                      }
                    >

                      <Icon
                        size={18}
                      />

                      <span>
                        {
                          menu.name
                        }
                      </span>

                    </NavLink>

                  </li>
                );
              }
            )}

          </ul>

        </nav>

      </aside>
    </>
  );
};

export default Sidebar;
