import * as React from 'react';
import { t } from 'lib/i18n';
import { commonSubPageHeaderTheme } from 'lib/constants/header/theme';
import { Stack } from 'components/navigation/stack';

export default function IntegrationsLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          title: t('navigation.tabs.settings.integrations'),
          ...commonSubPageHeaderTheme,
        }}
      />
    </Stack>
  );
}
