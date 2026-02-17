import useAuth from 'lib/hooks/auth/use-auth';
import { Stack } from 'expo-router';
import * as React from 'react';
import { useEffect } from 'react';
import { AxiosError } from 'node_modules/axios';
import useRefreshToken from 'lib/hooks/auth/use-refresh-token';

export default function App() {
  const { isAuthenticated, error, logout } = useAuth();
  const errorIsUnauthorized = (error as AxiosError)?.request?.status === 401;
  useRefreshToken();

  /** Do this to make sure client token is deleted if unauthorized */
  useEffect(() => {
    if (errorIsUnauthorized) {
      logout();
    }
  }, [error]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
