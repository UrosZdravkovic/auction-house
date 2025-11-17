import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { LoginForm } from '../../components/authentication/LoginForm';
import { RegistrationForm } from '../../components/authentication/RegistrationForm';

type AuthMode = 'login' | 'register';

export const AuthenticationPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('login');
  const navigate = useNavigate();

  // Set initial mode based on URL parameter
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'register') {
      setMode('register');
    }
  }, [searchParams]);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    const params = new URLSearchParams();
    params.set('mode', newMode);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-900 transition-all shadow-sm hover:shadow-md"
      >
        <HiArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="w-full max-w-md">
        {/* Tab Switcher */}
        <div className="flex bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full p-1 mb-6 shadow-sm">
          <button
            onClick={() => handleModeChange('login')}
            className={`flex-1 py-2.5 px-4 rounded-full font-medium transition-all focus:outline-none ${
              mode === 'login'
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleModeChange('register')}
            className={`flex-1 py-2.5 px-4 rounded-full font-medium transition-all focus:outline-none ${
              mode === 'register'
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Content */}
        {mode === 'login' ? <LoginForm /> : <RegistrationForm />}
      </div>
    </div>
  );
};
