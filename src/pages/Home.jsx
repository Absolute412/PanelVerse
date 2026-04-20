import Hero from "../components/Hero";
import LatestRelease from "../components/LatestRelease";
import Popular from "../components/Popular";
import RecentlyAdded from "../components/RecentlyAdded";
import ContinueReading from "../components/ContinueReading";

function Home() {

    return(
        <div className="flex flex-col space-y-4">
            <Hero />
            <ContinueReading />
            <LatestRelease />
            <Popular />
            <RecentlyAdded />
        </div>
    );
}

export default Home
