import { t } from 'lib/i18n';
import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text } from 'components/text/text';
import { cn } from 'lib/utils';
import ListItem from 'components/list/list-item';

export default function Settings() {
  

  return (
    <ScrollView>
      <Text className={cn('pb-2 pl-4 pt-8 font-semibold text-sm text-neutral-700')}>
        {t('settings.sections.integrations')}
      </Text>
      <ListItem
        containerClassName={cn('bg-gray-50')}
        title={t('settings.integrations')}
        description={t('settings.integrationsDescription')}
        icon={{ name: 'linkedServices' }}
        href={'/settings/integrations'}
      />
    </ScrollView>
  );
}
