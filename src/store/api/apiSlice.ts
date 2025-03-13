/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, EndpointDefinitions } from '@reduxjs/toolkit/query/react';

import { AxiosRequestConfig, AxiosError } from 'axios';

import { BaseQueryFn } from '@reduxjs/toolkit/query';
import axiosInstance from '@/lib/axiosInstance';

const axiosBaseQuery =
  (): BaseQueryFn<{
    url: string;
    method?: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    headers?: AxiosRequestConfig['headers'];
  }> =>
  async ({ url, method, data }) => {
    try {
      const result = await axiosInstance(`api${url}`, { method, data });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<{
        message: string;
        error: string;
        data: any;
      }>;

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: [],
  endpoints: (): EndpointDefinitions => ({} as EndpointDefinitions),
});
