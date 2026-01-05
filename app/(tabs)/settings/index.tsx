import { t } from 'lib/i18n';
import * as React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from 'components/text/text';
import { Button } from 'components/ui/button';
import { useFacebookLogin } from 'lib/hooks/auth/use-facebook-login';
import { WebView } from 'react-native-webview';
import Modal from 'components/modal/modal';
import { Dimensions } from 'react-native';
import { cn } from 'lib/utils';
import MaterialSymbol from 'lib/icons/material-symbols';

export default function Settings() {
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
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <View>
        <Button onPress={fbLogin}>
          <Text>{t('settings.title')}</Text>
        </Button>
      </View>

      <Modal contentClassName='p-0' visible={showWebview}>
        <View className={cn('pb-4 px-4 items-start')}>
          <Pressable className={cn('flex flex-row items-center gap-1')} onPress={() => setShowWebview(false)}>
            <MaterialSymbol name='arrowBack' className={cn('text-gray-700 text-4xl')} />
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
    </ScrollView>
  );
}
