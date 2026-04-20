import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Layout () {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 mx-auto w-full max-w-screen-2xl">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default Layout;