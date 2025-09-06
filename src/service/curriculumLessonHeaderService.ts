// 
import { API_URL } from '@/helper/hooks/endPoints';
import { ILessonHeaderAttributes, ILessonHeaderResponse, ILessonHeaderStrapiResponse } from '@/Interfaces/ILessonHeaders';
import { ILoginToken } from '@/Interfaces/IUserLoginInterfaces';
import axios from 'axios';

const courseWeeklyCurriculumLessonHeadersURL = `${API_URL}/api/course-curriculum-lesson-headers`;

export const lessonHeaderService = {
    
  getAllCurriculaLessonHeaders: async (token: ILoginToken, page = '', queryParams = '') => {
    try {
        if (!token) {
          throw new Error("Token is required for fetching all curriculum lessons header.");
        }
 
        queryParams += page;
    
        const response = await axios.get<ILessonHeaderStrapiResponse>(
          `${courseWeeklyCurriculumLessonHeadersURL}/?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        return response.data;
    } catch (error) {
        console.error("Error fetching all curriculum lessons header:", error);
        throw new Error("Failed to fetch all curriculum lessons header.");
        
    }
  },

  createCurriculumLessonHeader: async (token: ILoginToken | null, payload: ILessonHeaderAttributes) => {

   try {
     // Validate the token and payload   
  
        if (!token) {
        throw new Error("Token is required for creating the curriculum lesson.");
        }
        if (!payload) {
        throw new Error("Payload is required for creating the curriculum lesson.");
        }
        if (typeof payload !== "object") {
        throw new Error("Payload must be an object.");
        }
        if (Array.isArray(payload)) {
        throw new Error("Payload must not be an array.");
        }
        if (!payload.curriculum_lesson_header_title) {
        throw new Error("Curriculum lesson header title is required.");
        }
        if (!payload.course_curriculum_lesson_header_content) {
        throw new Error("Curriculum lesson header content is required.");
        }

     // Send a POST request to create a new qualification
     const response = await axios.post(
       `${courseWeeklyCurriculumLessonHeadersURL}`,
       { data: payload },
       {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       }
     );
     // Return the created qualification data
     return response.data.data as ILessonHeaderResponse;
   } catch (error) {
     console.error("Error creating curriculum lesson:", error);
     throw new Error("Failed to create curriculum lesson.");
    
   }
  },

updateCurriculumLessonHeader: async (token: ILoginToken | null,  lessonHeaderDocId: string, payload:ILessonHeaderAttributes) => {

   try {
        // Validate the token and payload

        if (!token) {
            throw new Error("Token is required for updating the curriculum lesson.");
            }
        if (!lessonHeaderDocId) {
            throw new Error("Lesson header ID is required for updating the curriculum lesson.");
            }
        if (!payload) {
            throw new Error("Payload is required for updating the curriculum lesson.");
            }
        if (typeof payload !== "object") {
            throw new Error("Payload must be an object.");
            }
        if (Array.isArray(payload)) {
            throw new Error("Payload must not be an array.");   
            }
        if (!payload.curriculum_lesson_header_title) {
            throw new Error("Curriculum lesson header title is required.");
            }
        if (!payload.course_curriculum_lesson_header_content) {
            throw new Error("Curriculum lesson header content is required.");
            }
   // Send a PUT request to update the qualification
 
     return axios.put(
       `${courseWeeklyCurriculumLessonHeadersURL}/${lessonHeaderDocId}`,
       {
         data:payload,
         
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

    getCurriculumLessonsHeader: async (token: ILoginToken,  lessonHeaderDocId:string) => {

    try {
        // Validate the token and lessonHeaderId
        if (!token) {
          throw new Error("Token is required for fetching curriculum lessons header.");
        }
        if (!lessonHeaderDocId) {
          throw new Error("Lesson header ID is required for fetching curriculum lessons header.");
        }
        // Send a GET request to fetch curriculum lessons headers
    
        const response = await axios.get<ILessonHeaderStrapiResponse>(
          `${courseWeeklyCurriculumLessonHeadersURL}/?filters[crs_cur_lessons][documentId]=${lessonHeaderDocId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
    } catch (error) {

        console.error("Error fetching curriculum lessons header:", error);
        throw new Error("Failed to fetch curriculum lessons header.");
    }
  },
}