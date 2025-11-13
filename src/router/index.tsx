import { createBrowserRouter } from 'react-router-dom';
import { UserLayout } from '../components/navigation/UserLayout';
import { AdminLayout } from '../components/navigation/AdminLayout';
import { HomePage } from '../pages/HomePage';
import { AuctionsPage } from '../pages/AuctionsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { LoginPage } from '../pages/LoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminPendingPage } from '../pages/admin/AdminPendingPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const createUserRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <UserLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'auctions',
          element: <AuctionsPage />,
        },
        {
          path: 'profile',
          element: <ProfilePage />,
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
      ],
    },
  ]);
  

export const createAdminRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <AdminDashboardPage />,
        },
        {
          path: 'auctions',
          element: <AuctionsPage />,
        },
        {
          path: 'pending',
          element: <AdminPendingPage />,
        },
        {
          path: 'users',
          element: <AdminUsersPage />,
        },
        {
          path: 'settings',
          element: <AdminSettingsPage />,
        },
        {
          path: 'profile',
          element: <ProfilePage />,
        },
      ],
    },
  ]);
