export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  media_urls: string[];
  user_id: string;
  created_at: string;
  deep_link: string;
  tags?: string[];
  source: 'app' | 'twitter';
}

export type AuthState = {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  isGuest: boolean;
};

export type ThemeMode = 'cosmicPurple' | 'oceanBlue' | 'sunsetVibes';

export type ThemeState = {
  mode: ThemeMode;
  toggleTheme: () => void;
};
