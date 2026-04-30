import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function ReaderLayout() {
  return (
    <div className="h-screen w-full bg-black">
      <Outlet />
    </div>
  );
}

export default ReaderLayout;
