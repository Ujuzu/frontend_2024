// File: src/service/courseTargetGroupService.ts
import { API_URL } from '@/helper/hooks/endPoints';
import { ICourseTargetGroupResponse, ITargetGroupStrapiResponse } from '@/Interfaces/ITargetGroup';
import { ILoginToken } from '@/Interfaces/IUserLoginInterfaces';
import axios from 'axios';

const targetGroupsUrl = `${API_URL}/api/course-target-groups`;

export const courseTargetGroupService = {
    
  getTargetGroups: async (token: ILoginToken, page = '', queryParams = '') => {
    // const paginng = `pagination[page]=${page}&pagination[pageSize]=10`;

    // Add populate parameter to fetch related data
    queryParams += page;

    // Fetch courses with pagination and populate
    const response = await axios.get<ITargetGroupStrapiResponse>(
      `${targetGroupsUrl}/?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
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


    const response = await axios.post(
      `${targetGroupsUrl}`,
      { data: targetGroupData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data as ICourseTargetGroupResponse;
  },

    linkTargetGroupToCourse: async (token: ILoginToken | null, documentId: string, targetGroupId: number) => {
    if (!token) {
      throw new Error('Token is required for linking target group to course');
    }
    if (!documentId) {
      throw new Error('Course ID is required for linking target group to course');
    }
    if (!targetGroupId) {
      throw new Error('Target group ID is required for linking target group to course');
    }
    return axios.put(
      `${targetGroupsUrl}/${targetGroupId}`,
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

    getCourseTargetGroups: async (token: ILoginToken, documentId: string) => {
    const response = await axios.get<ITargetGroupStrapiResponse>(
      `${targetGroupsUrl}/?filters[courses][documentId]=${documentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  unlinkTargetGroupFromCourse: async (token: ILoginToken | null, documentId: string, targetGroupId: number) => {
  if (!token) {
    throw new Error("Token is required for unlinking target group.");
  }
  if (!documentId) {
    throw new Error("Course documentId is required for unlinking target group.");
  }
  if (!targetGroupId) {
    throw new Error("Target group ID is required.");
  }

  return axios.put(
    `${targetGroupsUrl}/${targetGroupId}`,
    { data: { courses: [] } }, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
},
}