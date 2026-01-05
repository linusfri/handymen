import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { useBoundStore } from 'lib/store/store';

export function usePersistedTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const userChosenTheme = useBoundStore((state) => state.userChosenTheme);
  const setUserChosenTheme = useBoundStore((state) => state.setUserChosenTheme);

  // Sync persisted theme to NativeWind on mount
  useEffect(() => {
    if (userChosenTheme && userChosenTheme !== colorScheme) {
      setColorScheme(userChosenTheme);
    }
  }, []);

  function toggleTheme() {
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newTheme);
    setUserChosenTheme(newTheme);
  }

  return {
    colorScheme,
    toggleTheme,
  };
}
