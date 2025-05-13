/**
 * Mock Authentication Context for Eventsify
 * 
 * This provides a UI-focused authentication system without Supabase dependencies
 * for easier testing and development. It simulates authentication behaviors.
 */
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User } from '../types';
import { TEST_USER, createMockSession, createGuestSession } from '../utils/mockAuth';

// Storage key for persisting auth state
const AUTH_STORAGE_KEY = '@eventsify:auth_state';

// Create context with default values
const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
  isGuest: false,
};

type AuthContextType = {
  state: AuthState;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  signInWithTestUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  state: initialState,
  signUp: async () => {},
  signIn: async () => {},
  continueAsGuest: async () => {},
  signInWithTestUser: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Check for active session on mount
    checkAuthState();
  }, []);

  // Check current authentication state
  const checkAuthState = async () => {
    try {
      // First, check local storage for existing session
      const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        setState({
          ...parsedAuth,
          loading: false,
        });
        return;
      }
      
      // If no stored auth, automatically create a mock user session
      console.log('No existing session found, creating mock user');
      const { user, session } = await createMockSession();
      
      const newState = {
        user,
        session,
        loading: false,
        error: null,
        isGuest: false,
      };
      
      // Save to storage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
      
      // Update state with mock user
      setState(newState);
    } catch (error) {
      console.error('Error checking auth state:', error);
      setState({
        ...state,
        error: 'Failed to load authentication state',
        loading: false,
      });
    }
  };

  // Sign up with email and password (mock implementation)
  const signUp = async (email: string, password: string) => {
    try {
      setState({ ...state, loading: true, error: null });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user and session
      const { user, session } = await createMockSession();
      
      // Update state with new user
      const newState = {
        user,
        session,
        loading: false,
        error: null,
        isGuest: false,
      };
      
      // Save to storage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
      
      // Update state
      setState(newState);
    } catch (error: any) {
      setState({
        ...state,
        error: error.message || 'An error occurred during sign up',
        loading: false,
      });
    }
  };

  // Sign in with email and password (mock implementation)
  const signIn = async (email: string, password: string) => {
    try {
      setState({ ...state, loading: true, error: null });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user and session
      const { user, session } = await createMockSession();
      
      // Update state with new user
      const newState = {
        user,
        session,
        loading: false,
        error: null,
        isGuest: false,
      };
      
      // Save to storage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
      
      // Update state
      setState(newState);
    } catch (error: any) {
      setState({
        ...state,
        error: error.message || 'An error occurred during sign in',
        loading: false,
      });
    }
  };

  // Continue as guest
  const continueAsGuest = async () => {
    try {
      setState({ ...state, loading: true, error: null });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create guest session
      const { isGuest } = await createGuestSession();
      
      // Update state for guest user
      const newState = {
        ...state,
        isGuest,
        loading: false,
        error: null,
      };
      
      // Save to storage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
      
      // Update state
      setState(newState);
    } catch (error: any) {
      setState({
        ...state,
        error: error.message || 'An error occurred',
        loading: false,
      });
    }
  };

  // Sign in with test user (for development and testing)
  const signInWithTestUser = async () => {
    try {
      setState({ ...state, loading: true, error: null });
      console.log('Signing in with test user...');
      
      // Use the test authentication helper
      const { user, session } = await createMockSession();
      
      // Update state with test user
      const newState = {
        user,
        session,
        loading: false,
        error: null,
        isGuest: false,
      };
      
      // Save to storage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
      
      // Update state
      setState(newState);
      
      console.log('Test user signed in successfully:', user.email);
    } catch (error: any) {
      console.error('Failed to sign in with test user:', error);
      setState({
        ...state,
        error: error.message || 'Failed to sign in with test user',
        loading: false,
      });
    }
  };

  // Sign in with Google (mock implementation)
  const signInWithGoogle = async () => {
    try {
      setState({ ...state, loading: true, error: null });
      console.log('Signing in with Google...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would use Google Authentication
      // For now, create a mock session like other auth methods
      const { user, session } = await createMockSession();
      
      // Update state with user
      const newState = {
        user,
        session,
        loading: false,
        error: null,
        isGuest: false,
      };
      
      // Save to storage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
      
      // Update state
      setState(newState);
      
      console.log('Google sign in successful');
    } catch (error: any) {
      console.error('Failed to sign in with Google:', error);
      setState({
        ...state,
        error: error.message || 'Failed to sign in with Google',
        loading: false,
      });
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setState({ ...state, loading: true, error: null });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear local storage
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      
      // Reset state
      setState({
        user: null,
        session: null,
        loading: false,
        error: null,
        isGuest: false,
      });
    } catch (error: any) {
      setState({
        ...state,
        error: error.message || 'An error occurred during sign out',
        loading: false,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        signUp,
        signIn,
        continueAsGuest,
        signInWithTestUser,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
