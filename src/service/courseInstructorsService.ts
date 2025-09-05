// 
import { API_URL } from '@/helper/hooks/endPoints';
import { ICoursesInstructorResponse, ICoursesInstructorStrapiResponse } from '@/Interfaces/ICourseInstructor';
import { ILoginToken } from '@/Interfaces/IUserLoginInterfaces';
import axios from 'axios';

const courseInstructorsURL = `${API_URL}/api/courses-instructors`;

export const courseInstructorService = {
    
  getInstructors: async (token: ILoginToken, page = 1, queryParams = '') => {

    if (!token) {
      throw new Error('Token is required for fetching instructors');
    }

    const paginng = `pagination[page]=${page}&pagination[pageSize]=10`;

    // Add populate parameter to fetch related data
    queryParams += paginng;

    const response = await axios.get<ICoursesInstructorStrapiResponse>(
      `${courseInstructorsURL}/?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  createInstructor: async (token: ILoginToken | null, instructorData: unknown) => {
    if (!token) {
      throw new Error('Token is required for creating an instructor');
    }
    if (!instructorData) {
      throw new Error('Instructor data is required for creating an instructor');
    }
    if (typeof instructorData !== 'object') {
      throw new Error('Instructor data must be an object');
    }
    
    const response = await axios.post(
      `${courseInstructorsURL}`,
      { data: instructorData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data as ICoursesInstructorResponse;
  },

    linkInstructorToCourse: async (token: ILoginToken | null, documentId: string, instructorId: number) => {
  if (!token) {
    throw new Error("Token is required for linking instructor to course."); 
  }

  if (!documentId) {
    throw new Error("Course ID is required for linking instructor to course.");
  }


  if (!instructorId) {
    throw new Error("Instructor ID is required for linking instructor to course.");
  }
  if (typeof instructorId !== "number") {
    throw new Error("Instructor ID must be a number.");
  }
  // Send a PUT request to link the instructor to the course

    return axios.put(
      `${courseInstructorsURL}/${instructorId}`,
      {
        data: {
          courses: [documentId],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

    getCourseInstructors: async (token: ILoginToken, documentId: string) => {

    if (!token) {
      throw new Error("Token is required for fetching course instructors.");
    }
    if (!documentId) {
      throw new Error("Course ID is required for fetching course instructors.");
    }

    const response = await axios.get<ICoursesInstructorStrapiResponse>(
      `${courseInstructorsURL}/?filters[courses][documentId]=${documentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  unlinkInstructorFromCourse: async (token: ILoginToken | null, documentId: string, instructorId: number) => {
  if (!token) {
    throw new Error("Token is required for unlinking instructor from course.");
  }
  if (!documentId) {
    throw new Error("Course ID is required for unlinking instructor from course.");
  }
  if (!instructorId) {
    throw new Error("Instructor ID is required for unlinking instructor from course.");
  }
  if (typeof instructorId !== "number") {
    throw new Error("Instructor ID must be a number.");
  }
  // Send a PUT request to unlink the instructor from the course

  return axios.put(
    `${courseInstructorsURL}/${instructorId}`,
    { data: { courses: [] } }, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
},
}