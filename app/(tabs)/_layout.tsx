import { Tabs } from 'expo-router';
import * as React from 'react';
import { t } from 'lib/i18n';
import { Icon } from 'components/ui/icon';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { Button } from 'components/ui/button';
import { commonHeaderTheme } from '../../lib/constants/header/theme';
import MaterialSymbol from 'lib/icons/material-symbols';
import { usePersistedTheme } from 'lib/hooks/theme/use-persisted-theme';

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleTheme } = usePersistedTheme();

  return (
    <Button
      onPressIn={toggleTheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4"
    >
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}

function HeaderRight() {
  return <ThemeToggle />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#1976D2',
        tabBarInactiveTintColor: '#3E3E3E'
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerRight: () => <HeaderRight />,
          title: t('navigation.tabs.items'),
          ...commonHeaderTheme,
          tabBarIcon: ({ color }) => <MaterialSymbol name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('navigation.tabs.settings'),
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialSymbol name="apps" size={24} color={color} />,
          ...commonHeaderTheme,
        }}
      />
    </Tabs>
  );
}
