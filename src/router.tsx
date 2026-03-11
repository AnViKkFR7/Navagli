import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * Remix-style routing structure.
 * Routes follow Remix conventions:
 *   - Layouts wrap route segments
 *   - Index routes for default views
 *   - Nested routing for detail pages
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Index route
      { index: true, element: <HomePage /> },

      // Properties routes
      { path: 'properties', element: <PropertiesPage /> },
      { path: 'properties/:slug', element: <PropertyDetailPage /> },

      // Projects routes
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:slug', element: <ProjectDetailPage /> },

      // Services route
      { path: 'services', element: <ServicesPage /> },

      // About route
      { path: 'about', element: <AboutPage /> },

      // Contact route
      { path: 'contact', element: <ContactPage /> },

      // 404 catch-all
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
