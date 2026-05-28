import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const MainLayout = ({
  children,
}) => {
  return (
    <div
      className="
        flex
        bg-slate-50
        min-h-screen
      "
    >

      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <div
        className="
          flex-1

          lg:ml-72
        "
      >

        {/* Navbar */}

        <Navbar />

        {/* Page Content */}

        <main
          className="
            p-4
            sm:p-6
            lg:p-8

            pt-24
            lg:pt-8
          "
        >
          {children}
        </main>

      </div>

    </div>
  );
};

export default MainLayout;