import { ICourseCategoryStrapiResponse } from '@/Interfaces/ICourseCategory';
import { ICourseAttributes, ICourseResponse } from '@/Interfaces/ICourseRespone';
import { ICourseSubcategoryStrapiResponse } from '@/Interfaces/ICourseSubcategory';
import { ICourseTargetGroupResponse } from '@/Interfaces/ITargetGroup';
import { ILoginToken } from '@/Interfaces/IUserLoginInterfaces';
import axios from 'axios';

const API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';
const coursesUrl = `${API_URL}/api/courses`;
const targetGroupsUrl = `${API_URL}/api/course-target-groups`;
const courseSubCategoriesURL = `${API_URL}/api/course-subcategories`;
const courseCategoriesURL = `${API_URL}/api/coursecategories`;
// const courseInstructorsURL = `${API_URL}/api/courses-instructors`;
// const courseFeaturesURL = `${API_URL}/api/courses-features`;
// const courseWeeklyCurriculumURL = `${API_URL}/api/courses-weekly-curriculums`;
// const courseLearnListURL = `${API_URL}/api/learn-lists`;
// const courseQualificationRequirementURL = `${API_URL}/api/course-qualification-equirements`;
// const courseSubscriptionPackagesURL = `${API_URL}/api/subscription-packages`

export const courseService = {

  //
  // ALL GET REQUESTS
  /**
   * Get courses with pagination and optional filtering
   */
  getCourses: async <IStrapiResponse>(token: ILoginToken, page = 1, filter = '') => {
    // Build query params
    let queryParams = `?pagination[page]=${page}&pagination[pageSize]=10`;

    // Add populate parameter to fetch related data
    queryParams += '&populate=*';

    // Add filter if provided
    if (filter) {
      queryParams += `&filters[$or][0][course_name][$containsi]=${filter}&filters[$or][1][documentId][$containsi]=${filter}`;
    }

    // Fetch courses with pagination and populate
    const response = await axios.get<IStrapiResponse>(
      `${coursesUrl}/${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  getTargetGroups: async (token: ILoginToken, page = 1, queryParams = '') => {
    const paginng = `pagination[page]=${page}&pagination[pageSize]=10`;

    // Add populate parameter to fetch related data
    queryParams += paginng;

    // Fetch courses with pagination and populate
    const response = await axios.get<ICourseTargetGroupResponse[]>(
      `${targetGroupsUrl}/?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  getCourseSubCategories: async (token: ILoginToken | null) => {
    if (!token) {
      throw new Error('Token is required for fetching course subcategories');
    }

    const response = await axios.get<ICourseSubcategoryStrapiResponse>(
      `${courseSubCategoriesURL}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
   getCourseCatergories: async (token: ILoginToken | null) => {
    if (!token) {
      throw new Error('Token is required for fetching course categories');
    } 
    const response = await axios.get<ICourseCategoryStrapiResponse>(
      `${courseCategoriesURL}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
  // ALL DELETE REQUESTS
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

  /*************  END OF DELETE */

  // ALL POST REQUESTS
  /**
   * Create a new course
   */
  createCourse: async (token: ILoginToken | null, courseData: ICourseAttributes) => {
    if (!token) {
      throw new Error('Token is required for creating a course');
    }

    if (!courseData) {
      throw new Error('Course data is required for creating a course');
    }
    if (typeof courseData !== 'object') {
      throw new Error('Course data must be an object');
    }
    // return {data:courseData}

    return axios.post(
      `${coursesUrl}/?populate=*`,
      { data: courseData as ICourseAttributes },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  createTargetGroup: async (token: ILoginToken | null, targetGroupData: unknown) => {
    if (!token) {
      throw new Error('Token is required for creating a course');
    }

    if (!targetGroupData) {
      throw new Error('Course data is required for creating a course');
    }
    if (typeof targetGroupData !== 'object') {
      throw new Error('Course data must be an object');
    }


    return axios.post(
      `${targetGroupsUrl}`,
      { data: targetGroupData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  // ALL PUT REQUESTS
  /**
   * Update an existing course
   */
  updateCourse: async (token: ILoginToken | null, courseId: number, courseData: ICourseAttributes) => {
    if (!token) {
      throw new Error('Token is required for updating a course');
    }
    if (!courseId) {
      throw new Error('Course ID is required for updating a course');
    }
    if (!courseData) {
      throw new Error('Course data is required for updating a course');
    }
    if (typeof courseData !== 'object') {
      throw new Error('Course data must be an object');
    }

    return axios.put(
      `${API_URL}/api/courses/${courseId}?populate=*`,
      { data: courseData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  linkTargetGroupToCourse: async (token: ILoginToken | null, courseId: number, targetGroupId: number) => {
    if (!token) {
      throw new Error('Token is required for linking target group to course');
    }
    if (!courseId) {
      throw new Error('Course ID is required for linking target group to course');
    }
    if (!targetGroupId) {
      throw new Error('Target group ID is required for linking target group to course');
    }
    if (typeof targetGroupId !== 'number') {
      throw new Error('Target group ID must be a number');
    }
    return axios.put(
      `${targetGroupsUrl}/${targetGroupId}`,
      {
        data: {
          courses: [courseId],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  /*************  END OF POST */

  // ALL GET BY ID REQUESTS

  /**
   * Get a single course by ID
   */
  getCourseById: async (token: ILoginToken | null, courseId: number) => {
    if (!token) {
      throw new Error('Token is required for fetching a course');
    }
    if (!courseId) {
      throw new Error('Course ID is required for fetching a course');
    }
    if (typeof courseId !== 'number') {
      throw new Error('Course ID must be a number');
    }

    return axios.get<ICourseResponse>(
      `${API_URL}/api/courses/${courseId}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  getCourseTargetGroups: async (token: ILoginToken, courseId: number) => {
    const response = await axios.get<ICourseTargetGroupResponse[]>(
      `${targetGroupsUrl}/?filters[courses][id][$eq]=${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};