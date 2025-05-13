/**
 * Application Types
 */

// Auth Types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  isGuest: boolean;
}

// Theme Types
export type ThemeMode = 'vividSunset' | 'coolAqua';

export interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  tags?: string[];
  images?: string[];
  source?: 'app' | 'twitter';
}

// Media Types
export interface MediaItem {
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
}
