import { Dimensions, Pressable, View } from 'react-native';
import { Text } from 'components/text/text';
import * as React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, CardContent } from 'components/ui/card';
import { cn } from 'lib/utils';
import { t } from 'lib/i18n';
import MaterialSymbol from 'lib/icons/material-symbols';
import { useGetFacebookUser } from 'lib/hooks/facebook/use-get-user';
import Modal from 'components/modal/modal';
import { WebView } from 'react-native-webview';
import { useFacebookLogin } from 'lib/hooks/facebook/use-facebook-login';

export default function Integrations() {
  const { facebookUser } = useGetFacebookUser();
  const { initiateLogin } = useFacebookLogin();
  const [redirectUrl, setRedirectUrl] = React.useState<string | null>(null);
  const [showWebview, setShowWebview] = React.useState(false);

  async function fbLogin() {
    initiateLogin(undefined, {
      onSuccess: (loginResponse) => {
        if (loginResponse) {
          setRedirectUrl(loginResponse.redirect_url);
          setShowWebview(true);
        }
      },
    });
  }

  function WebModal() {
    return (
      <Modal contentClassName="p-0" visible={showWebview}>
        <View className={cn('items-start px-4 pb-4')}>
          <Pressable
            className={cn('flex flex-row items-center gap-1')}
            onPress={() => setShowWebview(false)}
          >
            <MaterialSymbol name="arrowBack" className={cn('text-4xl text-gray-700')} />
            <Text className={cn('font-bold text-xl')}>{t('common.goBackToApp')}</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1 }}>
          <WebView
            style={{
              height: Dimensions.get('window').height,
              width: Dimensions.get('window').width,
            }}
            source={{
              uri: `${redirectUrl}`,
            }}
          />
        </View>
      </Modal>
    );
  }

  return (
    <ScrollView contentContainerClassName={cn('flex-1')}>
      <Card className={cn('p-4 pt-8')}>
        <Pressable onPress={fbLogin}>
          <CardContent
            className={cn(
              'flex aspect-square w-5/12 items-center justify-center gap-2 rounded-lg bg-primary/5 p-4'
            )}
          >
            <Text className={cn('text-center font-bold text-sm')}>
              {t('integrations.meta')}
            </Text>

            <MaterialSymbol className={cn('text-4xl text-primary')} name="mobileChat" />

            <Text
              className={cn(
                'text-center text-sm',
                facebookUser ? 'text-emerald-700' : 'text-destructive-600'
              )}
            >
              {facebookUser ? t('integrations.active') : t('integrations.inactive')}
            </Text>
          </CardContent>
        </Pressable>
      </Card>

      <WebModal />
    </ScrollView>
  );
}
