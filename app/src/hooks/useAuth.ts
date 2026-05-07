import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { User } from '@/types';

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context and state.
 * Wraps useAuthContext to provide a simple interface.
 * 
 * Returns:
 * - user: Current logged-in user or null
 * - isAuthenticated: Whether user is logged in
 * - isLoading: Whether auth operations are in progress
 * - isInitialized: Whether auth has finished initializing
 * - error: Last error message
 * - login: Function to login with email/password
 * - register: Function to register new user
 * - logout: Function to logout
 * 
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login: contextLogin,
    register: contextRegister,
    logout: contextLogout,
  } = useAuthContext();

  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setError(null);
      const user = await contextLogin(email, password);
      return user;
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<User> => {
    try {
      setError(null);
      const user = await contextRegister(
        email,
        password,
        displayName
      );
      return user;
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setError(null);
      await contextLogout();
    } catch (err: any) {
      const errorMessage = err.message || 'Logout failed';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login,
    register,
    logout,
  };
};
