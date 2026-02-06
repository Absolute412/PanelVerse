import Footer from "./Footer";
import Hero from "./Hero";
import LatestRelease from "./LatestRelease";
import Navbar from "./Navbar";
import Popular from "./Popular";

function Home() {

    return(
        <>
            <div className="min-h-screen flex flex-col bg-main dark:bg-main-dark">
                <Navbar />

                <main className="flex-1 pt-16">
                    <Hero />
                    <LatestRelease />
                    <Popular />
                </main>

                <Footer />
            </div>
        </>
    );
}

export default Home