import axiosClient from 'lib/api/axios-client';
import { FacebookLoginResponse, FacebookPages } from 'lib/types/facebook';

export type FacebookUser = {
  id: string;
  name: string;
  email?: string;
};

export async function getFacebookUser() {
  return (await axiosClient.get<FacebookUser>('/facebook-instagram/user')).data;
}

export async function getCurrentFacebookUserPages() {
  return (await axiosClient.get<FacebookPages>('/facebook-instagram/user/pages')).data.data;
}

export async function initiateFacebookLogin() {
  const response = await axiosClient.get<FacebookLoginResponse>('/facebook-instagram/login');
  return response.data;
}