'use client';

import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { authService } from '@/services/authService';
import { User } from '@/types';

// Session expiration constants
const SESSION_EXPIRY_DAYS = 7;
const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
const LAST_LOGIN_KEY = 'learnviz_last_login';
const SESSION_EXPIRED_KEY = 'learnviz_session_expired';

// Auth context state types
export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  sessionExpired: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, displayName: string) => Promise<User>;
  logout: () => Promise<void>;
  clearSessionExpiredMessage: () => void;
}

// Auth reducer action types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_SESSION_EXPIRED'; payload: boolean }
  | { type: 'LOGOUT' };

// Auth reducer state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  sessionExpired: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  sessionExpired: false,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    case 'SET_SESSION_EXPIRED':
      return { ...state, sessionExpired: action.payload };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        sessionExpired: false,
      };
    default:
      return state;
  }
};

// Create auth context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider Component
 * 
 * Provides authentication state and methods to the entire application.
 * Handles:
 * - User session initialization
 * - 7-day session expiration check
 * - Login/Register/Logout operations
 * - Auth state persistence
 * 
 * Features:
 * - Automatic session expiration after 7 days
 * - No flicker on page reload (proper loading state)
 * - Firebase persistent authentication
 * - Centralized auth state management
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Check if user session has expired (more than 7 days old)
   */
  const checkSessionExpiration = useCallback((): boolean => {
    try {
      const lastLogin = localStorage.getItem(LAST_LOGIN_KEY);
      if (!lastLogin) return false;

      const lastLoginTime = parseInt(lastLogin);
      const now = Date.now();
      const elapsed = now - lastLoginTime;

      return elapsed > SESSION_EXPIRY_MS;
    } catch (error) {
      console.error('Error checking session expiration:', error);
      return false;
    }
  }, []);

  /**
   * Initialize authentication on app load
   * - Check for existing user session
   * - Validate session expiration
   * - Auto-logout if expired
   */
  useEffect(() => {
    let isMounted = true;
    const initializeAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        console.log('[Auth] Starting initialization...');
        if (checkSessionExpiration()) {
          console.log('[Auth] Session expired, logging out');
          await authService.logout();
          localStorage.removeItem(LAST_LOGIN_KEY);
          localStorage.setItem(SESSION_EXPIRED_KEY, 'true');
          if (isMounted) {
            dispatch({ type: 'SET_SESSION_EXPIRED', payload: true });
            dispatch({ type: 'SET_USER', payload: null });
          }
        } else {
          console.log('[Auth] Session valid, getting current user...');
          const currentUser = await authService.getCurrentUser();
          console.log('[Auth] Got current user:', currentUser ? currentUser.email : 'null');
          if (isMounted) {
            dispatch({ type: 'SET_USER', payload: currentUser });
          }
        }
      } catch (error) {
        console.error('[Auth] Initialization error:', error);
        if (isMounted) {
          dispatch({ type: 'SET_USER', payload: null });
        }
      } finally {
        if (isMounted) {
          console.log('[Auth] Initialization complete');
          dispatch({ type: 'SET_LOADING', payload: false });
          dispatch({ type: 'SET_INITIALIZED', payload: true });
        }
      }
    };

    initializeAuth();
    return () => {
      isMounted = false;
    };
  }, [checkSessionExpiration]);

  /**
   * Login user with email and password
   */
  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        const user = await authService.login(email, password);

        // Store login timestamp for session expiration check
        localStorage.setItem(LAST_LOGIN_KEY, Date.now().toString());
        localStorage.removeItem(SESSION_EXPIRED_KEY);

        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_SESSION_EXPIRED', payload: false });

        return user;
      } catch (error) {
        dispatch({ type: 'SET_USER', payload: null });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    []
  );

  /**
   * Register new user and automatically log them in
   */
  const register = useCallback(
    async (
      email: string,
      password: string,
      displayName: string
    ): Promise<User> => {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        const user = await authService.register(email, password, displayName);

        // Store login timestamp for session expiration check
        localStorage.setItem(LAST_LOGIN_KEY, Date.now().toString());
        localStorage.removeItem(SESSION_EXPIRED_KEY);

        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_SESSION_EXPIRED', payload: false });

        return user;
      } catch (error) {
        dispatch({ type: 'SET_USER', payload: null });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    []
  );

  /**
   * Logout user
   */
  const logout = useCallback(async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await authService.logout();
      localStorage.removeItem(LAST_LOGIN_KEY);
      localStorage.removeItem(SESSION_EXPIRED_KEY);
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  /**
   * Clear session expired message
   */
  const clearSessionExpiredMessage = useCallback((): void => {
    localStorage.removeItem(SESSION_EXPIRED_KEY);
    dispatch({ type: 'SET_SESSION_EXPIRED', payload: false });
  }, []);

  const value: AuthContextValue = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    sessionExpired: state.sessionExpired,
    login,
    register,
    logout,
    clearSessionExpiredMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * 
 * Use this hook to access authentication context anywhere in your app.
 * Always use within AuthProvider (which is in the root layout).
 * 
 * @throws Error if used outside of AuthProvider
 * @returns Auth context value
 */
export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
