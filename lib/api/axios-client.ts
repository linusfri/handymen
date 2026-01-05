import axios from 'axios';
import { useBoundStore } from 'lib/store/store';
import { getBaseUrl, handleError } from 'lib/api/utils';

const axiosClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
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
