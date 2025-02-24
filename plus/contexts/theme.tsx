import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from './auth';

export interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  setCustomColor: (color: string) => void;
  customColor: string | null;
  availableColors: string[];
}

const defaultColors = {
  light: {
    primary: '$primary500',
    background: '$gray100',
    surface: '$white',
    text: '$gray800',
    textSecondary: '$gray500',
    border: '$gray300',
  },
  dark: {
    primary: '$primary600',
    background: '$gray800',
    surface: '$gray900',
    text: '$gray100',
    textSecondary: '$gray400',
    border: '$gray700',
  },
};

// Predefined color options
export const themeColors = {
  blue: '$blue500',
  purple: '$purple500',
  pink: '$pink500',
  orange: '$orange500',
  green: '$green500',
  teal: '$teal500',
  yellow: '$yellow500',
  red: '$red500',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const systemColorScheme = useColorScheme();
  const [customColor, setCustomColor] = useState<string | null>(null);

  // Load user's color preference
  useEffect(() => {
    if (user) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot((doc) => {
          const data = doc.data();
          if (data?.themeColor) {
            setCustomColor(data.themeColor);
          }
        });

      return () => unsubscribe();
    }
  }, [user]);

  // Update user's color preference
  const updateCustomColor = async (color: string) => {
    if (!user) return;

    setCustomColor(color);
    await firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        themeColor: color,
      });
  };

  const baseColors = defaultColors[systemColorScheme === 'dark' ? 'dark' : 'light'];
  const colors: ThemeColors = {
    ...baseColors,
    primary: customColor || baseColors.primary,
  };

  const value = {
    colors,
    setCustomColor: updateCustomColor,
    customColor,
    availableColors: Object.values(themeColors),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 