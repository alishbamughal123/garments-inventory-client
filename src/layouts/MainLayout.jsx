import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const MainLayout = ({
  children,
}) => {
  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.14),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]">
      <Sidebar />

      <div className="min-w-0 flex-1 lg:ml-64">
        <Navbar />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
