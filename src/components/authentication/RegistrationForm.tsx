import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';

const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    try {
      await signup(data.email, data.password, data.name);
      navigate('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Failed to create account';
      setError('root', {
        type: 'manual',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface backdrop-blur-md rounded-2xl border border-border p-8 shadow-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Create an account
          </h1>
          <p className="text-sm text-text-secondary">
            Join Auction House and start bidding
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-text-secondary"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`w-full px-3.5 py-2.5 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-error focus:ring-error/20'
                  : 'border-border focus:ring-primary/20 focus:border-primary'
              } text-text-primary placeholder:text-text-tertiary`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-xs text-error flex items-center gap-1">
                <span>⚠</span>
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-secondary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full px-3.5 py-2.5 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.email || errors.root
                  ? 'border-error focus:ring-error/20'
                  : 'border-border focus:ring-primary/20 focus:border-primary'
              } text-text-primary placeholder:text-text-tertiary`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-xs text-error flex items-center gap-1">
                <span>⚠</span>
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-secondary"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`w-full px-3.5 py-2.5 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-error focus:ring-error/20'
                    : 'border-border focus:ring-primary/20 focus:border-primary'
                } text-text-primary placeholder:text-text-tertiary pr-10`}
                placeholder="Create a password (6+ characters)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
              >
                {showPassword ? (
                  <HiEyeOff className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-error flex items-center gap-1">
                <span>⚠</span>
                <span>{errors.password.message}</span>
              </p>
            )}
          </div>

          {/* Auth Error - Only for authentication failures */}
          {errors.root && !errors.name && !errors.email && !errors.password && (
            <div className="p-3 bg-error-light border border-error rounded-lg">
              <p className="text-sm text-error flex items-center gap-2">
                <span>⚠</span>
                <span>{errors.root.message}</span>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-primary text-background rounded-lg font-medium hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md mt-6"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
