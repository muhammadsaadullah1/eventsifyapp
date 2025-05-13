import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Event } from '../types';

// Auth Stack
export type AuthStackParamList = {
  TestLogin: undefined; // Add test login screen for easy testing
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Map: undefined;
  CreateEvent: undefined;
  Profile: undefined;
};

// Main Stack (includes tabs and other screens)
export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  EventDetail: { eventId: string; event?: Event };
};

// Root Navigator (combines auth and main)
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

// Helper types for screen props
export type AuthScreenProps<T extends keyof AuthStackParamList> = StackScreenProps<
  AuthStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type MainStackScreenProps<T extends keyof MainStackParamList> = StackScreenProps<
  MainStackParamList,
  T
>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;
