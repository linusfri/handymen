import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'components/ui/text';
import MaterialSymbol from 'lib/icons/material-symbols';
import IconLink from 'components/navigation/icon-link';
import { t } from 'lib/i18n';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <SafeAreaView className="flex-1 items-center justify-center">
        <View style={{ maxWidth: 300 }} className="items-center">
          <MaterialSymbol name="errorOutline" className="mb-4 text-6xl text-gray-400" />
          <Text className="mb-2 text-center text-xl font-semibold text-gray-700">
            {t('pageNotFound.title')}
          </Text>
          <Text className="mb-6 text-center text-sm text-gray-500">
            {t('pageNotFound.description')}
          </Text>
          <IconLink href="/" icon='arrowBack' iconAlignment='left' text={t('navigation.go-back')} />
        </View>
      </SafeAreaView>
    </>
  );
}
