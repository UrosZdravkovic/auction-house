import { RouterProvider } from 'react-router-dom';
import { createUserRouter, createAdminRouter } from './router';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { userProfile, loading } = useAuth();

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-primary text-lg">Loading...</div>
      </div>
    );
  }

  // Use admin router if user is admin, otherwise use regular user router
  const router = userProfile?.role === 'admin' 
    ? createAdminRouter() 
    : createUserRouter();

  return <RouterProvider router={router} />;
}