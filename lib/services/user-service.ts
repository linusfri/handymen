import axiosClient from '../api/axios-client';
import { User, AuthResponse, FacebookLoginResponse } from 'lib/types/user';

export async function getUser() {
  return (await axiosClient.get<User>('/auth/user')).data;
}

export async function loginUser(
  username: string,
  password: string,
  device_name: string,
  rememberMe: boolean = false
) {
  const response = await axiosClient.post<AuthResponse>('/auth/login', {
    username,
    password,
    device_name,
  });

  return {
    token: response.data.token,
    user: response.data.user,
    rememberMe,
  };
}

export async function refreshToken(refreshToken: string) {
  const response = await axiosClient.post<AuthResponse['token']>('/auth/refresh-token', {
    refresh_token: refreshToken,
  });

  return {
    token: response.data,
  };
}

export async function logoutUser() {
  return (await axiosClient.post('/auth/logout')).data;
}

export async function initiateFacebookLogin() {
  const response = await axiosClient.get<FacebookLoginResponse>('/facebook-instagram/login');
  return response.data;
}
