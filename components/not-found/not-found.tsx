import React from 'react';
import { Text } from 'components/text/text';
import MaterialSymbol, { IconName } from 'lib/icons/material-symbols';
import { cn } from 'lib/utils';
import { t } from 'lib/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NotFoundProps {
  icon?: IconName;
  title?: string;
  description?: string;
  className?: string;
}

export function NotFound({
  icon = 'searchOff',
  title = t('status.notFound.title'),
  description = t('status.notFound.description'),
  className,
}: NotFoundProps) {
  return (
    <SafeAreaView className={cn('items-center justify-center', className)}>
      <MaterialSymbol name={icon} className={cn('mb-4 text-6xl text-gray-400')} />
      <Text className={cn('mb-2 text-center font-semibold text-xl text-gray-700')}>{title}</Text>
      <Text className={cn('text-center text-sm text-gray-500')}>{description}</Text>
    </SafeAreaView>
  );
}
