// 
import { API_URL } from '@/helper/hooks/endPoints';
import { ICurriculumLessonAttributes, ICurriculumLessonResponse, ICurriculumLessonStrapiResponse } from '@/Interfaces/ICurriculumLessons';
import { ILoginToken } from '@/Interfaces/IUserLoginInterfaces';
import axios from 'axios';

const courseWeeklyCurriculumLessonsURL = `${API_URL}/api/crs-cur-lessons`;

export const curriculumLessonService = {
    
  getAllCurriculaLessons: async (token: ILoginToken, page = '', queryParams = '') => {
    try {
        if (!token) {
          throw new Error("Token is required for fetching all curriculum lessons.");
        }
 
        queryParams += page;
    
        const response = await axios.get<ICurriculumLessonStrapiResponse>(
          `${courseWeeklyCurriculumLessonsURL}/?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        return response.data;
    } catch (error) {
        console.error("Error fetching all curriculum lessons:", error);
        throw new Error("Failed to fetch all curriculum lessons.");
        
    }
  },

  createCurriculumLesson: async (token: ILoginToken | null, payload: ICurriculumLessonAttributes) => {

   try {
     // Validate the token and payload   
  
     if (!token) {
       throw new Error("Token is required for creating a new qualification.");
     }
     if (!payload) {
       throw new Error("Payload is required for creating a new qualification.");
     }
     if (typeof payload !== "object") {
       throw new Error("Payload must be an object.");
     }
     if (Array.isArray(payload)) {
       throw new Error("Payload must not be an array.");
     }
     if (!payload.curriculum_lesson_title) {
       throw new Error("Curriculum lesson title is required.");
     }
     // Send a POST request to create a new qualification
     const response = await axios.post(
       `${courseWeeklyCurriculumLessonsURL}`,
       { data: payload },
       {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       }
     );
     // Return the created qualification data
     return response.data.data as ICurriculumLessonResponse;
   } catch (error) {
     console.error("Error creating curriculum lesson:", error);
     throw new Error("Failed to create curriculum lesson.");
    
   }
  },

updateCurriculumLesson: async (token: ILoginToken | null,  lessonId: string, payload:ICurriculumLessonAttributes) => {

   try {
        // Validate the token and payload
        if (!token) {
        throw new Error("Token is required for updating the qualification.");
        }
        if (!lessonId) {
        throw new Error("Lesson ID is required for updating the qualification.");
        }
        if (!payload) {
        throw new Error("Payload is required for updating the qualification.");
        }
        if (typeof payload !== "object") {
        throw new Error("Payload must be an object.");
        }
        if (Array.isArray(payload)) {
        throw new Error("Payload must not be an array.");
        }
        if (!payload.curriculum_lesson_title) {
        throw new Error("Curriculum lesson title is required.");
        }
 
   // Send a PUT request to update the qualification
 
     return axios.put(
       `${courseWeeklyCurriculumLessonsURL}/${lessonId}`,
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

    getCurriculumLessons: async (token: ILoginToken,  curriculumDocId:string) => {

    try {
        if (!token) {
          throw new Error("Token is required for fetching curriculum lessons.");
        }

        if (!curriculumDocId) {
          throw new Error("Curriculum ID is required for fetching curriculum lessons.");
        }

        // Send a GET request to fetch curriculum lessons
    
        const response = await axios.get<ICurriculumLessonStrapiResponse>(
          `${courseWeeklyCurriculumLessonsURL}/?filters[courses_weekly_curricula][documentId]=${curriculumDocId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
    } catch (error) {

        console.error("Error fetching curriculum lessons:", error);
        throw new Error("Failed to fetch curriculum lessons.");
    }
  },
}