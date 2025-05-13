import supabase from '../supabase/supabase';
import { User } from '../types';

// Test user credentials
export const TEST_USER = {
  email: 'test@eventsify.app',
  password: 'Test123!',
  id: '123e4567-e89b-12d3-a456-426614174000',  // UUID format
  created_at: new Date().toISOString()
};

/**
 * Helper function to create a test user session
 * This bypasses the actual Supabase authentication for testing
 */
export const createTestSession = async (): Promise<{user: User; session: any}> => {
  try {
    // Attempt to sign in with test credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    if (!error && data.user) {
      console.log('Successfully logged in with test account');
      return {
        user: data.user as User,
        session: data.session
      };
    }
    
    // If login fails, try to create the account
    console.log('Test user does not exist, attempting to create...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    if (signUpError) {
      throw new Error(`Failed to create test user: ${signUpError.message}`);
    }
    
    console.log('Test user created successfully');
    return {
      user: signUpData.user as User,
      session: signUpData.session
    };
  } catch (error) {
    console.error('Error in test authentication:', error);
    
    // Return a mock user as fallback for completely offline testing
    const mockUser: User = {
      id: TEST_USER.id,
      email: TEST_USER.email,
      created_at: TEST_USER.created_at
    };
    
    const mockSession = {
      access_token: 'test-token',
      expires_at: Date.now() + 3600000, // 1 hour from now
      refresh_token: 'test-refresh-token',
      user: mockUser
    };
    
    return { user: mockUser, session: mockSession };
  }
};
