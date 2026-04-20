import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useEffect } from 'react';
import Home from './pages/Home';
import Library from './pages/Library';
import Browse from './pages/Browse';
import About from './pages/About';
import { LibraryProvider } from './contexts/LibraryContext';
import ReadPage from './pages/ReadPage';
import MangaPage from './pages/MangaPage';
import PopularPage from './pages/PopularPage';
import { ThemeProvider } from './contexts/ThemeContext';
import Settings from './pages/Settings';
import LatestReleasePage from './pages/LatestReleasePage';
import RecentlyAddedPage from './pages/RecentlyAddedPage';
import { ensureStorageSchema } from './utils/storageService';
import Layout from './layout/Layout';
import NotFound from './pages/NotFoundPage';
import ReaderLayout from './layout/ReaderLayout';
import Appearance from './pages/Appearance';
import LibrarySettings from './pages/LibrarySettings';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/latest-release", element: <LatestReleasePage /> },
      { path: "/browse", element: <Browse /> },
      { path: "/library", element: <Library /> },
      { path: "/popular", element: <PopularPage /> },
      { path: "recently-added", element: <RecentlyAddedPage /> },
      { path: "/manga/:mangaId", element: <MangaPage /> },
      { path: "/about", element: <About /> },
      { path: "/settings", element: <Settings /> },
      { path: "/settings/appearance", element: <Appearance /> },
      { path: "/settings/library", element: <LibrarySettings /> },
      { path: "*", element: <NotFound />},
    ]
  }, 
  {
    path: "/read/:mangaId/:chapterId",
    element: <ReaderLayout />,
    children: [
      { index: true, element: <ReadPage /> }
    ]
  },
]);

export default function App() {
  useEffect(() => {
    // Run schema migration once at app boot to keep storage format consistent.
    ensureStorageSchema();
  }, []);

  return(
    <ThemeProvider>
        <LibraryProvider>
          <RouterProvider router={router}/>
        </LibraryProvider>
      </ThemeProvider>
  );
}
