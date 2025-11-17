import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { LoginForm } from '../../components/authentication/LoginForm';
import { RegistrationForm } from '../../components/authentication/RegistrationForm';
import { ThemeToggle } from '../../components/navigation/ThemeToggle';

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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2 bg-surface backdrop-blur-md border border-border rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all shadow-sm hover:shadow-md"
      >
        <HiArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </button>

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Tab Switcher */}
        <div className="flex bg-surface backdrop-blur-md border border-border rounded-full p-1 mb-6 shadow-sm">
          <button
            onClick={() => handleModeChange('login')}
            className={`flex-1 py-2.5 px-4 rounded-full font-medium transition-all focus:outline-none ${
              mode === 'login'
                ? 'bg-primary text-background shadow-md'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleModeChange('register')}
            className={`flex-1 py-2.5 px-4 rounded-full font-medium transition-all focus:outline-none ${
              mode === 'register'
                ? 'bg-primary text-background shadow-md'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
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
