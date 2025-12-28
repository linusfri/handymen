import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from 'lib/hooks/auth/use-auth';
import Loader from 'components/loader/loader';
import { AxiosError } from 'axios';
import { Text } from 'components/ui/text';
import { t } from 'lib/i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { FormInput } from 'components/form/fields/input/controlled-input';
import MaterialSymbol from 'lib/icons/material-symbols';
import { cn } from 'lib/utils';
import { Button } from 'components/ui/button';

export default function Login() {
  type LoginFormData = {
    username: string;
    password: string;
    rememberMe: boolean;
  };

  const { ...formMethods } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: true,
    },
  });

  const { handleSubmit, setError, formState } = formMethods;
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();

  if (isLoading && !error) {
    return <Loader text={t('auth.states.loggingIn')} />;
  }

  function handleLoginError(error: AxiosError) {
    if (error.response?.status) {
      setError('username', {
        type: 'manual',
        message: t('auth.validation.invalidCredentials'),
      });
      setError('password', {
        type: 'manual',
        message: t('auth.validation.invalidCredentials'),
      });
    }
  }

  async function onSubmit(data: LoginFormData) {
    return login(
      {
        username: data.username,
        password: data.password,
        rememberMe: data.rememberMe,
      },
      {
        onError: (error) => {
          handleLoginError(error as AxiosError);
        },
      }
    );
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      className={cn('p-4')}
      keyboardShouldPersistTaps="handled"
      bottomOffset={40}
    >
      <FormProvider {...formMethods}>
        <Text className={cn('mb-4 pb-6 text-2xl font-semibold')}>
          {t('common.greetings.welcome')}
        </Text>

        <FormInput
          editable={!formState.isSubmitting && !formState.isValidating}
          containerClassName="mb-4"
          name="username"
          label={t('auth.fields.username')}
          placeholder={t('auth.fields.username')}
          rules={{
            required: {
              value: true,
              message: t('auth.validation.usernameRequired'),
            },
          }}
          autoCapitalize="none"
          textContentType="username"
          autoComplete="username"
          keyboardType="default"
        />

        <FormInput
          editable={!formState.isSubmitting && !formState.isValidating}
          containerClassName="mb-8"
          name="password"
          label={t('auth.fields.password')}
          placeholder={t('auth.fields.password')}
          rules={{
            required: {
              value: true,
              message: t('auth.validation.passwordRequired'),
            },
          }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          textContentType="password"
          autoComplete="password"
          keyboardType="default"
          icon={
            <MaterialSymbol
              name={showPassword ? 'visibility' : 'visibilityOff'}
              size={24}
              className={cn('pr-4', formState.errors.password && 'text-primary')}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        <Button
          className="mb-4 rounded-full"
          onPress={handleSubmit(onSubmit)}
          disabled={formState.isSubmitting}
        >
          <Text className="text-base font-semibold">
            {t('auth.actions.login')}
          </Text>
        </Button>
      </FormProvider>
    </KeyboardAwareScrollView>
  );
}
