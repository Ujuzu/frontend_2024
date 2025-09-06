export interface IMedia extends MediaAttributes {

    id: number;
  
}

export interface MediaAttributes {
  name?: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: IStrapiFormats; 
  hash?: string;
  ext?: string;
  mime?: string;
  size: number;
  url?: string;
  previewUrl?: string | null;
  provider?: string;
  provider_metadata?: {
    public_id?: string;
    resource_type?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}


export interface IStrapiImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
}

export interface IStrapiFormats {
  large?: IStrapiImageFormat;
  medium?: IStrapiImageFormat;
  small?: IStrapiImageFormat;
  thumbnail?: IStrapiImageFormat;
}
