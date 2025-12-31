import { createBrowserRouter } from 'react-router-dom';
import { UserLayout } from '../components/user/navigation/UserLayout';
import { AdminLayout } from '../components/admin/navigation/AdminLayout';
import AuctionsPage from '../pages/user/AuctionsPage';
import MyAuctionsPage from '../pages/user/MyAuctionsPage';
import { ProfilePage } from '../pages/user/ProfilePage';
import { AuthenticationPage } from '../pages/authentication/AuthenticationPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminAuctionsPage } from '../pages/admin/AdminAuctionsPage';
import { AdminAuctionDetailsPage } from '../pages/admin/AdminAuctionDetailsPage';

export const createUserRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <UserLayout />,
      children: [
        {
          index: true,
          element: <AuctionsPage />,
        },
        {
          path: 'auctions',
          element: <AuctionsPage />,
        },
        {
          path: 'my-auctions',
          element: <MyAuctionsPage />,
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
          path: 'auctions/:id',
          element: <AdminAuctionDetailsPage />,
        },
        {
          path: 'profile',
          element: <ProfilePage />,
        },
      ],
    },
  ]);
