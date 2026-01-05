import { StateCreator } from 'zustand';

export type ThemeState = {
  userChosenTheme: 'light' | 'dark';
  setUserChosenTheme: (theme: 'light' | 'dark') => void;
};

// eslint-disable-next-line
const createThemeSlice: StateCreator<ThemeState> = (set, get) => ({
  userChosenTheme: 'light',
  setUserChosenTheme: (theme) => {
    set({ userChosenTheme: theme });
  },
});

export default createThemeSlice;
