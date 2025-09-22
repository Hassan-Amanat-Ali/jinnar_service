import { Outlet } from "react-router-dom";

const SetupLayout = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

export default SetupLayout;
