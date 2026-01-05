import { AxiosError } from 'axios';

import { t } from 'lib/i18n';

function publicApiUrlExists() {
  if (process.env.EXPO_PUBLIC_API_URL === undefined) {
    return false;
  }
  return true;
}

function getBaseUrl(): string {
  if (publicApiUrlExists()) {
    return process.env.EXPO_PUBLIC_API_URL as string;
  }

  if (!isHostPortEnvDefined()) throw new Error('Could not get port of development host.');

  return getHostAddressAndPort();
}

function getFacebookApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_FACEBOOK_API_URL !== undefined) {
    return process.env.EXPO_PUBLIC_FACEBOOK_API_URL;
  }

  console.error('EXPO_PUBLIC_FACEBOOK_API_URL is not defined. Facebook API calls will fail.');
  return '';
}

function getHostAddressAndPort() {
  const hostAddress = process.env.EXPO_PUBLIC_LOCAL_API_URL;
  const port = process.env.EXPO_PUBLIC_LOCAL_API_PORT;

  if (hostAddress === undefined || port === undefined) {
    throw new Error('Could not get address or port of development host.');
  }

  const apiUrl = `${hostAddress}:${port}`;
  const protocol = process.env.EXPO_PUBLIC_LOCAL_HTTPS ? 'https' : 'http';

  return `${protocol}://${apiUrl}`;
}

function isHostPortEnvDefined() {
  if (process.env.EXPO_PUBLIC_LOCAL_API_PORT === undefined) return false;
  return true;
}

function getErrorMessageByStatus(status: number): string {
  switch (true) {
    case status === 400:
      return t('errors.http.badRequest');
    case status === 401:
      return t('errors.http.unauthorized');
    case status === 403:
      return t('errors.http.forbidden');
    case status === 404:
      return t('errors.http.notFound');
    case status === 422:
      return t('errors.http.validationError');
    case status >= 500 && status < 600:
      return t('errors.http.serverError');
    default:
      return `${t('errors.http.requestFailed')} ${status}`;
  }
}

async function handleError(error: AxiosError) {
  let customMessage = error.message;
  if (error.response?.status) {
    const status = error.response.status;

    customMessage = getErrorMessageByStatus(status);
  }

  const enhancedError = new Error(customMessage) as AxiosError;
  enhancedError.response = error.response;
  enhancedError.request = error.request;
  enhancedError.config = error.config;
  enhancedError.code = error.code;
  enhancedError.stack = error.stack;

  return Promise.reject(enhancedError);
}

export {
  getBaseUrl,
  getFacebookApiBaseUrl,
  publicApiUrlExists,
  isHostPortEnvDefined,
  getHostAddressAndPort,
  handleError,
  getErrorMessageByStatus,
};
