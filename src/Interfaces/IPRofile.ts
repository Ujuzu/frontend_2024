export interface ProviderMetadata {
  public_id: string;
  resource_type: string;
}

export interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes?: number;
  provider_metadata: ProviderMetadata;
  [key: string]: unknown;
}

export interface ImageFormats {
  thumbnail?: ImageFormat;
  small?: ImageFormat;
  medium?: ImageFormat;
  large?: ImageFormat;
  [key: string]: ImageFormat | undefined;
}

export interface ProfilePicture {
  id: number;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width: number;
  height: number;
  formats?: ImageFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  provider_metadata: ProviderMetadata;
  createdAt: string;
  updatedAt: string;
}
