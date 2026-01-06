import { Text } from 'components/text/text';
import * as React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, CardContent } from 'components/ui/card';
import { cn } from 'lib/utils';
import { t } from 'lib/i18n';
import MaterialSymbol from 'lib/icons/material-symbols';
import { useGetFacebookUser } from 'lib/hooks/facebook/use-get-user';
import { Link } from 'expo-router';

export default function Integrations() {
  const { facebookUser } = useGetFacebookUser();

  return (
    <ScrollView contentContainerClassName={cn('flex-1')}>
      <Card className={cn('p-4 pt-8')}>
        <Link href="/settings/integrations/meta">
          <CardContent
            className={cn(
              'flex aspect-square w-5/12 items-center justify-center gap-2 rounded-lg bg-primary/5 p-4'
            )}
          >
            <Text className={cn('text-center font-bold text-sm')}>{t('integrations.meta')}</Text>

            <MaterialSymbol className={cn('text-4xl text-primary')} name="mobileChat" />

            <Text
              className={cn(
                'text-center text-sm',
                facebookUser ? 'text-emerald-700' : 'text-destructive-600'
              )}
            >
              {facebookUser ? t('common.states.active') : t('common.states.inactive')}
            </Text>
          </CardContent>
        </Link>
      </Card>
    </ScrollView>
  );
}
