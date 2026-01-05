import axiosClient from 'lib/api/axios-client';
import { FacebookLoginResponse } from 'lib/types/user';

// Facebook user type (adjust based on your backend response)
export type FacebookUser = {
  id: string;
  name: string;
  email?: string;
};

// Get Facebook user data from backend
export async function getFacebookUser() {
  return (await axiosClient.get<FacebookUser>('/facebook-instagram/user')).data;
}

export async function initiateFacebookLogin() {
  const response = await axiosClient.get<FacebookLoginResponse>('/facebook-instagram/login');
  return response.data;
}