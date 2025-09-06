// Utility functions for transforming Strapi data (v5 compatible)
import { IMedia } from "@/Interfaces/IMedia";
import { IStrapiUploadResponse } from "@/Interfaces/IStrapiFileUploader";

/**
 * Transform Strapi media response to IStrapiUploadResponse format (v5)
 */
export const transformStrapiMediaToUploadResponse = (
  strapiMedia: IMedia
): IStrapiUploadResponse | null => {
  if (!strapiMedia) {
    return null;
  }

  // In v5, the response is flat - no more attributes nesting
  return {
    id: strapiMedia.id,
    name: strapiMedia.name,
    alternativeText: strapiMedia.alternativeText || '',
    caption: strapiMedia.caption || '',
    width: strapiMedia.width,
    height: strapiMedia.height,
    formats: strapiMedia.formats,
    hash: strapiMedia.hash,
    ext: strapiMedia.ext,
    mime: strapiMedia.mime,
    size: strapiMedia.size,
    url: strapiMedia.url,
    previewUrl: strapiMedia.previewUrl,
    provider: strapiMedia.provider,
    provider_metadata: strapiMedia.provider_metadata,
    createdAt: strapiMedia.createdAt,
    updatedAt: strapiMedia.updatedAt,
  };
};

/**
 * Transform multiple Strapi media responses to IStrapiUploadResponse array (v5)
 */
export const transformStrapiMediaArrayToUploadResponse = (
  strapiMediaArray: any[]
): IStrapiUploadResponse[] => {
  if (!Array.isArray(strapiMediaArray)) {
    return [];
  }

  return strapiMediaArray
    .map(media => transformStrapiMediaToUploadResponse(media))
    .filter(Boolean) as IStrapiUploadResponse[];
};

/**
 * Extract existing files from courseData for StrapiFileUploader (v5)
 */
export const extractExistingFiles = (
  courseData: any,
  fieldPath: string
): IStrapiUploadResponse[] => {
  try {
    // Handle nested path like 'course_intro_img'
    const pathSegments = fieldPath.split('.');
    let current = courseData;
    
    for (const segment of pathSegments) {
      current = current?.[segment];
      if (!current) break;
    }

    if (!current) return [];

    // Handle single file (v5 - no data wrapper)
    if (!Array.isArray(current)) {
      const transformed = transformStrapiMediaToUploadResponse(current);
      return transformed ? [transformed] : [];
    }

    // Handle multiple files (v5 - array of media objects)
    if (Array.isArray(current)) {
      return transformStrapiMediaArrayToUploadResponse(current);
    }

    return [];
  } catch (error) {
    console.error('Error extracting existing files:', error);
    return [];
  }
};

/**
 * Check if a file exists in courseData (v5)
 */
export const hasExistingFile = (
  courseData: any,
  fieldPath: string
): boolean => {
  const files = extractExistingFiles(courseData, fieldPath);
  return files.length > 0;
};