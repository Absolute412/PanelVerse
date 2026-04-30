import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function ReaderLayout() {
  return (
    <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 mx-auto w-full max-w-screen-2xl">
            <Outlet />
        </main>
    </div>
  );
}

export default ReaderLayout;
