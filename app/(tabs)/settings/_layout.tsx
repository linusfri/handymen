import * as React from 'react';
import { t } from 'lib/i18n';
import { commonHeaderTheme } from 'lib/constants/header/theme';
import { cn } from 'lib/utils';
import { useAuth } from 'lib/hooks/auth/use-auth';
import { Button } from 'components/button/button';
import { Text } from 'components/text/text';
import { Stack } from 'components/navigation/stack';

export default function SettingsLayout() {
  const { logout } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        ...commonHeaderTheme,
        headerRight: () => (
          <Button
            size={'sm'}
            className={cn('mr-4 bg-destructive')}
            onPress={() => logout()}
          >
            <Text>{t('auth.actions.logout')}</Text>
          </Button>
        ),
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          title: t('navigation.tabs.settings'),
          ...commonHeaderTheme,
        }}
      />

      <Stack.Screen
        name='integrations'
        options={{
          title: t('navigation.tabs.settings.integrations'),
          headerShown: false,
        }}
      />
    </Stack>
  );
}
