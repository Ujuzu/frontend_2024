// 
import { API_URL } from '@/helper/hooks/endPoints';
import { ICourseQualificationReqResponse, IQualificationReqStrapiResponse } from '@/Interfaces/IQualificationRequirement';
import { ILoginToken } from '@/Interfaces/IUserLoginInterfaces';
import axios from 'axios';

const courseQualificationReqURL = `${API_URL}/api/course-qualification-equirements`;

export const courseQualificationService = {
    
  getQualifications: async (token: ILoginToken, page = '', queryParams = '') => {

    if (!token) {
      throw new Error('Token is required for fetching qualifications.');
    } 
    
    // Add populate parameter to fetch related data
    queryParams += page;

    const response = await axios.get<IQualificationReqStrapiResponse>(
      `${courseQualificationReqURL}/?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  createQualification: async (token: ILoginToken | null, reqQualificationData: unknown) => {
    if (!token) {
      throw new Error("Token is required for creating qualification.");
    } 
    if (!reqQualificationData) {
      throw new Error("Qualification data is required for creating qualification.");
    }
    if (typeof reqQualificationData !== "object") {
      throw new Error("Qualification data must be an object.");
    }

    // Send a POST request to create a new qualification
    const response = await axios.post(
      `${courseQualificationReqURL}`,
      { data: reqQualificationData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Return the created qualification data
    return response.data.data as ICourseQualificationReqResponse;
  },

    linkQualificationToCourse: async (token: ILoginToken | null, documentId: string, reqQualificationId: number) => {
 
    if (!token) {
      throw new Error("Token is required for linking instructor to course.");
    }
    if (!documentId) {
      throw new Error("Course ID is required for linking instructor to course.");
    }
    if (!reqQualificationId) {
      throw new Error("Qualification ID is required for linking instructor to course.");
    }
    if (typeof reqQualificationId !== "number") {
      throw new Error("Qualification ID must be a number.");
    }

  // Send a PUT request to link the instructor to the course

    return axios.put(
      `${courseQualificationReqURL}/${reqQualificationId}`,
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

    getCourseQualifications: async (token: ILoginToken, documentId: string) => {

    if (!token) {
      throw new Error("Token is required for fetching course qualifications.");
    }
    if (!documentId) {
      throw new Error("Course ID is required for fetching course qualifications.");
    }
    // Add populate parameter to fetch related data

    const response = await axios.get<IQualificationReqStrapiResponse>(
      `${courseQualificationReqURL}/?filters[courses][documentId]=${documentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  unlinkQualificationFromCourse: async (token: ILoginToken | null, reqQualificationId: number) => {

  if (!token) {
    throw new Error("Token is required for unlinking Qualification from course.");
  }
  if (!reqQualificationId) {
    throw new Error("Qualification ID is required for unlinking Qualification from course.");
  }
  
  
  if (typeof reqQualificationId !== "number") {
    throw new Error("Qualification ID must be a number.");
  }

  // Send a PUT request to unlink the instructor from the course

  return axios.put(
    `${courseQualificationReqURL}/${reqQualificationId}`,
    { data: { courses: [] } }, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
},
}