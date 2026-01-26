import * as React from 'react';
import { t } from 'lib/i18n';
import { Dimensions, Pressable, View } from 'react-native';
import Modal from 'components/modal/modal';
import { Text } from 'components/text/text';
import { useFacebookLogin } from 'lib/hooks/facebook/use-facebook-login';
import MaterialSymbol from 'lib/icons/material-symbols';
import { WebView } from 'react-native-webview';
import { cn } from 'lib/utils';
import { useGetFacebookUser } from 'lib/hooks/facebook/use-get-user';
import { ScrollView } from 'react-native-gesture-handler';
import { useCurrentFacebookUserPages } from 'lib/hooks/facebook/use-get-current-facebook-user-pages';
import { useBoundStore } from 'lib/store/store';

export default function Meta() {
  const { initiateLogin } = useFacebookLogin();
  const { facebookUser } = useGetFacebookUser();
  const { facebookUserPages } = useCurrentFacebookUserPages({ facebookUserId: facebookUser?.id });
  const [redirectUrl, setRedirectUrl] = React.useState<string | null>(null);
  const [showWebview, setShowWebview] = React.useState(false);

  const { setCurrentFacebookPageId, currentFacebookPageId } = useBoundStore();

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
    <ScrollView className={cn('p-4')}>
      {facebookUser ? (
        <View className={cn('flex')}>
          <Text
            className={cn(
              'rounded-lg bg-emerald-50 p-4 text-center font-semibold text-base text-emerald-600'
            )}
          >
            {t('auth.loggedIn')}
          </Text>
        </View>
      ) : (
        <View className={cn('flex')}>
          <Text
            className={cn(
              'mb-4 rounded-lg bg-destructive/10 p-4 text-center font-semibold text-base text-destructive'
            )}
          >
            {t('auth.notLoggedIn')}
          </Text>

          <Pressable
            className={cn(
              'flex-row items-center justify-center gap-2 self-center rounded-sm bg-primary/90 px-4 py-3'
            )}
            onPress={fbLogin}
          >
            <MaterialSymbol name="login" className={cn('text-3xl text-white')} />
            <Text className={cn('font-bold text-white')}>{t('auth.actions.login')}</Text>
          </Pressable>
        </View>
      )}

      {facebookUser ? (
        <View className={cn('mt-8')}>
          <Text className={cn('mb-4 font-bold text-sm text-neutral-600')}>
            {t('common.yourPages')}
          </Text>
          {facebookUserPages && facebookUserPages.length > 0 ? (
            facebookUserPages.map((page) => (
              <Pressable
                key={page.id}
                className={cn(
                  'mb-2 flex flex-row items-center justify-between rounded-lg border p-4',
                  currentFacebookPageId === page.id
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-neutral-300 bg-neutral-50'
                )}
                onPress={() => {
                  setCurrentFacebookPageId(page.id);
                }}
              >
                <View>
                  <Text className={cn('font-semibold text-base')}>{page.name}</Text>
                  <Text className={cn('text-sm text-gray-600')}>{page.id}</Text>
                </View>
                <Text
                  className={cn(
                    'text-sm',
                    currentFacebookPageId === page.id ? 'text-emerald-600' : 'text-neutral-600'
                  )}
                >
                  {currentFacebookPageId === page.id
                    ? t('common.states.active')
                    : t('common.states.inactive')}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text className={cn('text-gray-600')}>{t('common.noPagesFound')}</Text>
          )}
        </View>
      ) : null}

      <WebModal />
    </ScrollView>
  );
}
