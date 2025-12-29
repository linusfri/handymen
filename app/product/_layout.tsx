import { Stack } from 'components/navigation/stack';
import * as React from 'react';
import { t } from 'lib/i18n';
import {
  commonSubPageHeaderTheme,
} from 'lib/constants/header/theme';

export default function ProductLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='[id]/index'
        options={{
          headerShown: true,
          title: t('productDetail.detailTitle'),
          ...commonSubPageHeaderTheme,
        }}
      />
      <Stack.Screen
        name='[id]/edit'
        options={{
          headerShown: true,
          title: t('productDetail.editTitle'),
          ...commonSubPageHeaderTheme,
        }}
      />
    </Stack>
  );
}