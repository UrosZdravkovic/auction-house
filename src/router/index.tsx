import { createBrowserRouter } from 'react-router-dom';
import { UserLayout } from '../components/navigation/UserLayout';
import { AdminLayout } from '../components/navigation/AdminLayout';
import { HomePage } from '../pages/user/HomePage';
import { AuctionsPage } from '../pages/user/AuctionsPage';
import { ProfilePage } from '../pages/user/ProfilePage';
import { AuthenticationPage } from '../pages/authentication/AuthenticationPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminAuctionsPage } from '../pages/admin/AdminAuctionsPage';

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
      ],
    },
    {
      path: '/auth',
      element: <AuthenticationPage />,
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
          element: <AdminAuctionsPage />,
        },
        {
          path: 'profile',
          element: <ProfilePage />,
        },
      ],
    },
  ]);
