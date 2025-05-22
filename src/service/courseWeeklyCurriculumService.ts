// 
import { API_URL } from '@/helper/hooks/endPoints';
import { ILoginToken } from '@/Interfaces/IUserLoginInterfaces';
import { ICoursesWklyCurriculumAttrib, IWeeklyCurriculumResponse, IWeeklyCurriculumStrapiResponse } from '@/Interfaces/IWeeklyCurriculum';
import axios from 'axios';

const courseWeeklyCurriculumURL = `${API_URL}/api/courses-weekly-curriculums`;

export const courseWeeklyCurriculumService = {
    
  getAllWeeklyCurricula: async (token: ILoginToken, page = '', queryParams = '') => {
    try {
        if (!token) {
          throw new Error("Token is required for fetching qualifications.");
        }
        queryParams += page;
    
        const response = await axios.get<IWeeklyCurriculumStrapiResponse>(
          `${courseWeeklyCurriculumURL}/?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        return response.data;
    } catch (error) {
        console.error("Error fetching all weekly curricula:", error);
        throw new Error("Failed to fetch all weekly curricula.");
        
    }
  },

  createWeeklyCurriculum: async (token: ILoginToken | null, payload: ICoursesWklyCurriculumAttrib) => {

    // Validate the token and payload   
    if (!token) {
      throw new Error("Token is required for creating qualification.");
    }
    if (!payload) {
      throw new Error("Payload is required for creating qualification.");
    }
    if (typeof payload !== "object") {
      throw new Error("Payload must be an object.");
    }
    if (Array.isArray(payload)) {
      throw new Error("Payload must not be an array.");
    }

    // Send a POST request to create a new qualification
    const response = await axios.post(
      `${courseWeeklyCurriculumURL}`,
      { data: payload },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Return the created qualification data
    return response.data.data as IWeeklyCurriculumResponse;
  },

    updateWeeklyCurriculum: async (token: ILoginToken | null,  curriculumId: number, payload:ICoursesWklyCurriculumAttrib) => {

   try {
     if (!token) {
       throw new Error("Token is required for updating qualification.");
     }
     if (!curriculumId) {
       throw new Error("Curriculum ID is required for updating qualification.");
     }
     if (typeof curriculumId !== "number") {
       throw new Error("Curriculum ID must be a number.");
     }
     if (!payload) {
       throw new Error("Payload is required for updating qualification.");
     }
     if (typeof payload !== "object") {
       throw new Error("Payload must be an object.");
     }
     if (Array.isArray(payload)) {
       throw new Error("Payload must not be an array.");
     }
 
   // Send a PUT request to update the qualification
 
     return axios.put(
       `${courseWeeklyCurriculumURL}/${curriculumId}`,
       {
         data: {
           ...payload,
         },
       },
       {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       }
     );
   } catch (error) {
     console.error("Error updating weekly curriculum:", error);
     throw new Error("Failed to update weekly curriculum.");
    
   }
  },

    getCourseWeeklyCurricula: async (token: ILoginToken,  courseId:number) => {

    try {
        if (!token) {
          throw new Error("Token is required for fetching course weekly curricula.");
        }
        if (!courseId) {
          throw new Error("Course ID is required for fetching course weekly curricula.");
        }
        if (typeof courseId !== "number") {
          throw new Error("Course ID must be a number.");
        }
            
        // Add populate parameter to fetch related data
    
        const response = await axios.get<IWeeklyCurriculumStrapiResponse>(
          `${courseWeeklyCurriculumURL}/?filters[courses][id][$eq]=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
    } catch (error) {
        
        console.error("Error fetching course weekly curricula:", error);
        throw new Error("Failed to fetch course weekly curricula.");
    }
  },
}