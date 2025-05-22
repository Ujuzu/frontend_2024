import { IStrapiFormats } from "./IMedia";

export interface IStrapiUploadResponse {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats: IStrapiFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: object;
  createdAt: string;
  updatedAt: string;
}

export type IMediaType = 'image' | 'file' | 'both';

export interface IStrapiFileUploaderProps {
  onUploadSuccess: (fileData: IStrapiUploadResponse) => void; //yet to think here
  onUploadError?: (error: string) => void;
  mediaType?: IMediaType;
  maxFileSize?: number; // in MB, most ithink 5 will wbe max, this will go to env
  multiple?: boolean;
  className?: string;
  placeholder?: string;
  maximumFileCount?: number; // Maximum number of files to upload also to store on env
  
}
