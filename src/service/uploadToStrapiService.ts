// Project: Strapi File Upload Service
//       setIsUploading(false); 

import { API_URL } from "@/helper/hooks/endPoints";
import { IStrapiUploadResponse } from "@/Interfaces/IStrapiFileUploader";
import { ILoginToken } from "@/Interfaces/IUserLoginInterfaces";
import { mediaTypesHealper } from "@/utils/mediaUploadHelper";
const mediaUploadURL = `${API_URL}/api/upload`;
const mediaDeleteURL = `${API_URL}/api/upload/files`;


 export const mediaUploadToStrapiService = {    
 
 uploadToStrapi: async (token:ILoginToken | null, file: File,  maxFileSize:number, mediaType:string): Promise<IStrapiUploadResponse> => {
 
mediaTypesHealper.validateFile(file, maxFileSize, mediaType);

    if (!token) {   
        throw new Error('No authentication token provided');
        }

    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch(`${mediaUploadURL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0]; // take the first item
  },

   deleteFromStrapi: async (
    token: ILoginToken | null, 
    fileId: number
  ): Promise<void> => {
    if (!token) {   
      throw new Error('No authentication token provided');
    }

    const response = await fetch(`${mediaDeleteURL}/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Delete failed: ${response.statusText}`);
    }
  },

  /**
   * Get file details from Strapi
   */
  getFileDetails: async (
    token: ILoginToken | null, 
    fileId: number
  ): Promise<IStrapiUploadResponse> => {
    if (!token) {   
      throw new Error('No authentication token provided');
    }

    const response = await fetch(`${mediaDeleteURL}/${fileId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to get file details: ${response.statusText}`);
    }

    return await response.json();
  }
}