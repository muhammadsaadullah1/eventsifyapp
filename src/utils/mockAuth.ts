/**
 * Mock Authentication System
 * This provides a completely offline authentication experience for UI testing
 */
import { User } from '../types';

// Test user credentials - available for quick testing
export const TEST_USER = {
  email: 'test@eventsify.app',
  password: 'Test123!',
  id: '123e4567-e89b-12d3-a456-426614174000',
  created_at: new Date().toISOString()
};

// Storage key for persisting mock auth state
const MOCK_AUTH_STORAGE_KEY = '@eventsify:mock_auth';

/**
 * Create a mock authentication session without Supabase
 * @returns Mock user and session objects
 */
export const createMockSession = async (): Promise<{user: User; session: any}> => {
  // Create a mock user
  const mockUser: User = {
    id: TEST_USER.id,
    email: TEST_USER.email,
    created_at: TEST_USER.created_at
  };
  
  // Create a mock session with a fake token
  const mockSession = {
    access_token: `mock_token_${Date.now()}`,
    expires_at: Date.now() + 3600000, // 1 hour from now
    refresh_token: `mock_refresh_${Date.now()}`,
    user: mockUser
  };
  
  return { user: mockUser, session: mockSession };
};

/**
 * Mock authentication checker
 * Always returns the mock session for testing UI flows
 */
export const checkMockAuth = async (): Promise<{user: User | null; session: any | null}> => {
  try {
    // For UI testing, we'll just return a successful mock session
    const { user, session } = await createMockSession();
    return { user, session };
  } catch (error) {
    console.error('Error in mock authentication:', error);
    return { user: null, session: null };
  }
};

/**
 * Create a guest session for UI testing
 * This allows the user to browse the app without authentication
 */
export const createGuestSession = async (): Promise<{isGuest: boolean}> => {
  return { isGuest: true };
};
