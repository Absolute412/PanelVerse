import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useEffect } from 'react';
import Home from './pages/Home';
import Library from './pages/Library';
import Browse from './pages/Browse';
import About from './pages/About';
import { LibraryProvider } from './contexts/LibraryContext';
import ReadPage from './pages/ReadPage';
// import { sampleManga } from './data/sampleManga';
import MangaPage from './pages/MangaPage';
import PopularPage from './pages/PopularPage';
import { ThemeProvider } from './contexts/ThemeContext';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import LatestReleasePage from './pages/LatestReleasePage';
import RecentlyAddedPage from './pages/RecentlyAddedPage';
import { ensureStorageSchema } from './utils/storageService';

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
  useEffect(() => {
    // Run schema migration once at app boot to keep storage format consistent.
    ensureStorageSchema();
  }, []);

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
