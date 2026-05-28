import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } =
    useAuth();

  return (
    <div
      className="
        bg-white
        h-16

        flex
        items-center
        justify-between

        px-4
        sm:px-6
        lg:px-8

        shadow-sm
      "
    >

      {/* Left Side */}

      <div
        className="
          pl-14
          lg:pl-0
        "
      >

        <h1
          className="
            font-semibold
            text-lg
            sm:text-xl
            whitespace-nowrap
          "
        >
          Garment Inventory
        </h1>

      </div>

      {/* Right Side */}

      <div
        className="
          flex
          items-center
          gap-2
          sm:gap-4
        "
      >

        <span
          className="
            text-sm
            sm:text-base
            font-medium
            text-slate-700
            hidden
            sm:block
          "
        >
          {user?.name}
        </span>

        <button
          onClick={() => {
            logout();

            window.location.href =
              "/login";
          }}
          className="
            bg-red-500
            hover:bg-red-600
            text-white

            px-3
            sm:px-4

            py-2

            rounded-lg
            transition-all
            duration-200

            text-sm
            sm:text-base
          "
        >
          Logout
        </button>

      </div>

    </div>
  );
};

export default Navbar;