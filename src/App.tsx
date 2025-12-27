import { RouterProvider } from 'react-router-dom';
import { createUserRouter, createAdminRouter } from './router';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user, userProfile, loading } = useAuth();

  // Wait for auth AND profile to load
  if (loading || (user && !userProfile)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-primary text-lg">Loading...</div>
      </div>
    );
  }

  const router = userProfile?.role === 'admin' 
    ? createAdminRouter() 
    : createUserRouter();

  return <RouterProvider router={router} />;
}