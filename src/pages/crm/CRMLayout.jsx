import { Outlet } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

const CRMLayout = () => {
  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-7xl py-2">
        <Outlet />
      </div>
    </MainLayout>
  );
};

export default CRMLayout;
