import axios, { AxiosError } from 'axios';
import { useBoundStore } from 'lib/store/store';
import { getBaseUrl } from 'lib/api/utils';
import { t } from 'lib/i18n';

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

export async function handleError(error: AxiosError) {
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

const axiosClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const { token } = useBoundStore.getState();

  if (token) {
    config.headers.Authorization = `Bearer ${token.access_token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => handleError(error)
);

export default axiosClient;
