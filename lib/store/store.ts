import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import createAuthSlice, { AuthState } from './auth-slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createThemeSlice, { ThemeState } from './theme-slice';
import createFacebookSlice, { FacebookState } from './facebook-slice';

export type StoreState = AuthState & ThemeState & FacebookState;

export const useBoundStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createFacebookSlice(...a),
      ...createThemeSlice(...a),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        if (state.rememberMe) {
          return {
            token: state.token,
            status: state.status,
            rememberMe: state.rememberMe,
            userChosenTheme: state.userChosenTheme,
            currentFacebookPageId: state.currentFacebookPageId,
          };
        } else {
          return {
            rememberMe: state.rememberMe,
            userChosenTheme: state.userChosenTheme,
            currentFacebookPageId: state.currentFacebookPageId,
          };
        }
      },
    }
  )
);
