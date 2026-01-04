import { t } from 'lib/i18n';
import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'components/text/text';
import { Button } from 'components/ui/button';
import { useFacebookLogin } from 'lib/hooks/auth/use-facebook-login';
import { WebView } from 'react-native-webview';
import Modal from 'components/modal/modal';
import { Dimensions } from 'react-native';

export default function Settings() {
  const { initiateLogin } = useFacebookLogin();
  const [redirectUrl, setRedirectUrl] = React.useState<string | null>(null);
  const [fbUserToken, setFbUserToken] = React.useState<string | null>(null);
  const [showWebview, setShowWebview] = React.useState(false);

  async function fbLogin() {
    initiateLogin(undefined, {
      onSuccess: (loginResponse) => {
        if (loginResponse) {
          setRedirectUrl(loginResponse.redirect_url);
          setFbUserToken(loginResponse.fb_user_token);
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

      <Modal style={{ flex: 1 }} visible={showWebview} title={t('settings.facebookLogin')}>
        <WebView
          style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}
          source={{
            uri: redirectUrl || '',
            headers: {
              Cookie: `fb_user_token=${fbUserToken}`,
            },
          }}
        />
      </Modal>
    </ScrollView>
  );
}
