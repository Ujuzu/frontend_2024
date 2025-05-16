import {  ICourseResponse, IStrapiResponse } from '@/Interfaces/ICourseRespone';
import { ILoginToken } from '@/Interfaces/IUserLoginInterfaces';
import axios from 'axios';

const API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

export const courseService = {
  /**
   * Get courses with pagination and optional filtering
   */
  getCourses: async (token: ILoginToken, page = 1, filter = '') => {
    // Build query params
    let queryParams = `pagination[page]=${page}&pagination[pageSize]=10`;
    
    // Add populate parameter to fetch related data
    queryParams += '&populate=*';
    
    // Add filter if provided
    if (filter) {
      queryParams += `&filters[$or][0][course_name][$containsi]=${filter}&filters[$or][1][documentId][$containsi]=${filter}`;
    }
    
    // Fetch courses with pagination and populate
    const response = await axios.get<IStrapiResponse>(
      `${API_URL}/api/courses?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  },
  
  /**
   * Delete a course by documentId
   */
  deleteCourse: async (token: ILoginToken, documentId: number) => {
    return axios.delete(
      `${API_URL}/api/courses/${documentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  
  /**
   * Create a new course
   */
  createCourse: async (token: ILoginToken, courseData: unknown) => {
    return axios.post(
      `${API_URL}/api/courses`,
      { data: courseData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  
  /**
   * Update an existing course
   */
  updateCourse: async (token:ILoginToken, courseId: number, courseData: unknown) => {
    return axios.put(
      `${API_URL}/api/courses/${courseId}`,
      { data: courseData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  
  /**
   * Get a single course by ID
   */
  getCourseById: async (token: ILoginToken, courseId: number) => {
    return axios.get<ICourseResponse>(
      `${API_URL}/api/courses/${courseId}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
};