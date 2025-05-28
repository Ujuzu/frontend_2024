// Utility functions for transforming Strapi data
import { IStrapiUploadResponse } from "@/Interfaces/IStrapiFileUploader";

/**
 * Transform Strapi media response to IStrapiUploadResponse format
 */
export const transformStrapiMediaToUploadResponse = (
  strapiMedia: any
): IStrapiUploadResponse | null => {
  if (!strapiMedia?.data?.attributes) {
    return null;
  }

  const mediaData = strapiMedia.data;
  const attributes = mediaData.attributes;

  return {
    id: mediaData.id,
    name: attributes.name,
    alternativeText: attributes.alternativeText || '',
    caption: attributes.caption || '',
    width: attributes.width,
    height: attributes.height,
    formats: attributes.formats,
    hash: attributes.hash,
    ext: attributes.ext,
    mime: attributes.mime,
    size: attributes.size,
    url: attributes.url,
    previewUrl: attributes.previewUrl,
    provider: attributes.provider,
    provider_metadata: attributes.provider_metadata,
    createdAt: attributes.createdAt,
    updatedAt: attributes.updatedAt,
  };
};

/**
 * Transform multiple Strapi media responses to IStrapiUploadResponse array
 */
export const transformStrapiMediaArrayToUploadResponse = (
  strapiMediaArray: any[]
): IStrapiUploadResponse[] => {
  if (!Array.isArray(strapiMediaArray)) {
    return [];
  }

  return strapiMediaArray
    .map(media => transformStrapiMediaToUploadResponse({ data: media }))
    .filter(Boolean) as IStrapiUploadResponse[];
};

/**
 * Extract existing files from courseData for StrapiFileUploader
 */
export const extractExistingFiles = (
  courseData: any,
  fieldPath: string
): IStrapiUploadResponse[] => {
  try {
    // Handle nested path like 'attributes.course_intro_img'
    const pathSegments = fieldPath.split('.');
    let current = courseData;
    
    for (const segment of pathSegments) {
      current = current?.[segment];
      if (!current) break;
    }

    if (!current) return [];

    // Handle single file
    if (current.data && !Array.isArray(current.data)) {
      const transformed = transformStrapiMediaToUploadResponse(current);
      return transformed ? [transformed] : [];
    }

    // Handle multiple files
    if (current.data && Array.isArray(current.data)) {
      return transformStrapiMediaArrayToUploadResponse(current.data);
    }

    return [];
  } catch (error) {
    console.error('Error extracting existing files:', error);
    return [];
  }
};

/**
 * Check if a file exists in courseData
 */
export const hasExistingFile = (
  courseData: any,
  fieldPath: string
): boolean => {
  const files = extractExistingFiles(courseData, fieldPath);
  return files.length > 0;
};