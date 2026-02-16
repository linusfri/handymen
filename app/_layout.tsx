import 'global.css';

import { NAV_THEME } from 'lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { Platform, AppStateStatus } from 'react-native';
import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOnlineManager } from 'lib/hooks/use-online-manager';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useAppState } from 'lib/hooks/use-app-state';
import React from 'react';
import App from 'app/app';
import SetUpFonts from 'lib/fonts/fonts';
import { SplashScreen } from 'expo-router';
import { usePersistedTheme } from 'lib/hooks/theme/use-persisted-theme';

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
    },
  },
});

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = usePersistedTheme();
  useOnlineManager();
  useAppState(onAppStateChange);
  const fontsLoaded = SetUpFonts();

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    SplashScreen.preventAutoHideAsync();
    return null;
  }

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <App />
        </KeyboardProvider>
      </QueryClientProvider>
      <PortalHost />
    </ThemeProvider>
  );
}
