// API configuration and endpoints
export const API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

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