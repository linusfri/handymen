export type FacebookPages = {
  data: {
    id: string;
    name: string;
  }[];
};

export type FacebookLoginResponse = {
  redirect_url: string;
  fb_user_token: string;
};

export type FacebookUser = {
  id: string;
  name: string;
  email?: string;
};
