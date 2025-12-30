export type NewImage = {
  data: string; // base64 or file URI
  filename: string;
  filetype: string;
};

export type ExistingImage = {
  kind: 'existing';
  id: number;
};

export type FileData = {
  id: number;
  data?: string;
  filename: string;
  uri: string;
  filetype: string;
};

/** Could be either a new image or an existing one when creating or updating product from client. */
export type ImageCreateData = NewImage | ExistingImage;

/** Context in which the image is created. For example if the image is created for a product. */
export type FileContext = 'product' | 'user' | 'misc';