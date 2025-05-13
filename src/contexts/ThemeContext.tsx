import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeMode } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@eventsify:theme';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const defaultState: ThemeState = {
  mode: 'cosmicPurple', // Default to our vibrant purple theme
  toggleTheme: () => {},
  setTheme: () => {},
};

const ThemeContext = createContext<ThemeState>(defaultState);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('cosmicPurple');

  // Load saved theme on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (
          savedTheme === 'cosmicPurple' || 
          savedTheme === 'oceanBlue' || 
          savedTheme === 'sunsetVibes'
        )) {
          setThemeMode(savedTheme as ThemeMode);
        }
      } catch (e) {
        console.error('Failed to load theme preference:', e);
      }
    };
    
    loadTheme();
  }, []);

  // Cycle through available themes
  const toggleTheme = async () => {
    let newTheme: ThemeMode;
    
    switch (themeMode) {
      case 'cosmicPurple':
        newTheme = 'oceanBlue';
        break;
      case 'oceanBlue':
        newTheme = 'sunsetVibes';
        break;
      default:
        newTheme = 'cosmicPurple';
        break;
    }
    
    setThemeMode(newTheme);
    
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.error('Failed to save theme preference:', e);
    }
  };
  
  // Set a specific theme
  const setTheme = async (theme: ThemeMode) => {
    setThemeMode(theme);
    
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.error('Failed to save theme preference:', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ mode: themeMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
