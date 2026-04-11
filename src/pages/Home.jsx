import Footer from "../components/Footer";
import Hero from "../components/Hero";
import LatestRelease from "../components/LatestRelease";
import Navbar from "../components/Navbar";
import Popular from "../components/Popular";
import RecentlyAdded from "../components/RecentlyAdded";
import ContinueReading from "../components/ContinueReading";

function Home() {

    return(
        <>
            <div className="min-h-screen flex flex-col bg-(--main)">
                <Navbar />

                <main className="flex-1 pt-16">
                    <Hero />
                    <ContinueReading />
                    <LatestRelease />
                    <Popular />
                    <RecentlyAdded />
                </main>

                <Footer />
            </div>
        </>
    );
}

export default Home
