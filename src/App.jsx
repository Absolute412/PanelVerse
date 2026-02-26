import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home';
import Library from './components/Library';
import Browse from './components/Browse';
import About from './components/About';
import { LibraryProvider } from './contexts/LibraryContext';
import ReadPage from './components/ReadPage';
// import { sampleManga } from './data/sampleManga';
import MangaPage from './components/MangaPage';
import PopularPage from './components/PopularPage';
import { ThemeProvider } from './contexts/ThemeContext';
import Settings from './components/Settings';
import Profile from './components/Profile';
import LatestReleasePage from './components/LatestReleasePage';
import RecentlyAddedPage from './components/RecentlyAddedPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/library",
    element: <Library />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/popular",
    element: <PopularPage />
  },
  {
    path: "/latest-release",
    element: <LatestReleasePage />
  },
  {
    path: "recently-added",
    element: <RecentlyAddedPage />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/manga/:mangaId",
    element: <MangaPage />
  },
  {
    path: "/read/:mangaId/:chapterId",
    element: <ReadPage />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/settings",
    element: <Settings />
  },
]);

export default function App() {

  return(
    <>
      <ThemeProvider>
        <LibraryProvider>
          <RouterProvider router={router}/>
        </LibraryProvider>
      </ThemeProvider>
    </>
  );
}