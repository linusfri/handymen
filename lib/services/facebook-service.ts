import axiosClient from 'lib/api/axios-client';

// Facebook user type (adjust based on your backend response)
export type FacebookUser = {
  id: string;
  name: string;
  email?: string;
};

// Get Facebook user data from backend
export async function getFacebookUser() {
  return (await axiosClient.get<FacebookUser>('/facebook/user')).data;
}
