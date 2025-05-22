// API configuration and endpoints
export const API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

// const courseSubCategoriesURL = `${API_URL}/api/course-subcategories`;
// const courseCategoriesURL = `${API_URL}/api/coursecategories`;
// const courseInstructorsURL = `${API_URL}/api/courses-instructors`;
// const courseFeaturesURL = `${API_URL}/api/courses-features`;
// const courseWeeklyCurriculumURL = `${API_URL}/api/courses-weekly-curriculums`;
// const courseWeeklyCurriculumLessonsURL = `${API_URL}/api/crs-cur-lessons`;
// const courseWeeklyCurriculumLessonHeadersURL = `${API_URL}/api/course-curriculum-lesson-headers`;
// const courseLearnListURL = `${API_URL}/api/learn-lists`;
// const courseQualificationRequirementURL = `${API_URL}/api/course-qualification-equirements`;
// const courseSubscriptionPackagesURL = `${API_URL}/api/subscription-packages`
// const coursesUrl = `${API_URL}/api/courses`;
// const targetGroupsUrl = `${API_URL}/api/course-target-groups`;

// Helper :full URLs
export const getFullUrl = (path: string): string => {
  // path lazima to starts with '/' if not already
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
};

// API Endpoints
export const ENDPOINTS = {
  // User related endpoints
  USER: {
    GET_BY_ID: (id: number) => getFullUrl(`/api/users/${id}`),
  },
 
};

// Helper function to add query parameters
export const addQueryParams = (url: string, params: Record<string, string | boolean | number | undefined>): string => {
  const urlObj = new URL(url);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      urlObj.searchParams.append(key, String(value));
    }
  });
  
  return urlObj.toString();
};

// Common headers
export const getDefaultHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};