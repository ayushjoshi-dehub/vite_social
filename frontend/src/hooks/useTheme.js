import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../redux/userSlice';

export default function useTheme() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.user);
  const [systemTheme, setSystemTheme] = useState('dark');

  useEffect(() => {
    // Detect system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
    localStorage.setItem('theme', newTheme);
  };

  const setThemeMode = (mode) => {
    dispatch(setTheme(mode));
    localStorage.setItem('theme', mode);
  };

  return {
    theme: theme || systemTheme,
    systemTheme,
    toggleTheme,
    setThemeMode,
    isDark: (theme || systemTheme) === 'dark',
    isLight: (theme || systemTheme) === 'light',
  };
}