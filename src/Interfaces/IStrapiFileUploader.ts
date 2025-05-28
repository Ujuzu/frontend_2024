import { MediaAttributes } from "./IMedia";

export interface IStrapiUploadResponse extends MediaAttributes {
  id: number;
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
  onFileDelete?: (file: IStrapiUploadResponse) => void; // New callback for file deletion
  existingFiles?: IStrapiUploadResponse[]; // New prop for existing files
  disabled?: boolean; // New prop to disable the component
  
}
